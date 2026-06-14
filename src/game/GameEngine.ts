import { GameState, Food, Position, Mood, ExpressionState } from '@/types';
import { CONFIG, FOODS } from '@/data/config';
import { StateMachine } from './StateMachine';
import { PreferenceMatrix } from './PreferenceMatrix';
import { LineSystem } from './LineSystem';
import { Renderer } from './Renderer';
import { DragSystem } from './DragSystem';
import { reportIntimacy } from '@/utils/mockApi';

export class GameEngine {
  private state: GameState;
  private stateMachine: StateMachine;
  private preferenceMatrix: PreferenceMatrix;
  private lineSystem: LineSystem;
  private renderer: Renderer | null = null;
  private dragSystem: DragSystem | null = null;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private lastMoodChange: number = 0;
  private lastFullnessDecay: number = 0;
  private speechBubbleTimer: number = 0;
  private lastIntimacyReport: number = 0;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.createInitialState();
    this.stateMachine = new StateMachine();
    this.preferenceMatrix = new PreferenceMatrix();
    this.lineSystem = new LineSystem();
    this.speechBubbleTimer = 0;
    this.lastIntimacyReport = Date.now();
  }

  private createInitialState(): GameState {
    return {
      satisfaction: 0,
      fullness: 0,
      consecutiveFeeds: 0,
      currentMood: 'normal',
      currentExpression: 'happy',
      lastFeedTime: {},
      idleTime: 0,
      intimacy: 0,
      totalFeedCount: 0,
      totalSatisfaction: 0,
      animationState: 'idle',
      lastExpressionChangeTime: Date.now(),
      showSpeechBubble: false,
      currentLine: '',
      showHitbox: false,
    };
  }

  public initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new Renderer(canvas);
    this.dragSystem = new DragSystem(canvas);

    this.dragSystem.setOnDrop((food, position) => {
      this.handleFoodDrop(food, position);
    });

    this.dragSystem.setOnDragStart(() => {
      this.state.showHitbox = true;
      this.notifyListeners();
    });

    this.lastTime = performance.now();
    this.lastMoodChange = Date.now();
    this.lastFullnessDecay = Date.now();

    this.startGameLoop();
  }

  private startGameLoop(): void {
    const loop = (currentTime: number) => {
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      this.update(deltaTime);
      this.render(deltaTime);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private update(deltaTime: number): void {
    const now = Date.now();

    this.state.idleTime += deltaTime;

    if (now - this.lastMoodChange > CONFIG.MOOD_CHANGE_INTERVAL) {
      this.changeMood();
      this.lastMoodChange = now;
    }

    if (now - this.lastFullnessDecay > 60000) {
      this.state.fullness = Math.max(
        CONFIG.MIN_FULLNESS,
        this.state.fullness - CONFIG.FULLNESS_DECAY_RATE
      );
      this.lastFullnessDecay = now;
    }

    if (
      this.state.animationState === 'chewing' &&
      now - (this.state.lastFeedTime['__chewing_start'] || 0) > CONFIG.CHEWING_DURATION
    ) {
      this.state.animationState = 'idle';
    }

    if (
      this.state.animationState === 'refusing' &&
      now - (this.state.lastFeedTime['__refuse_start'] || 0) > CONFIG.REFUSE_DURATION
    ) {
      this.state.animationState = 'idle';
    }

    if (this.state.showSpeechBubble) {
      this.speechBubbleTimer -= deltaTime * 1000;
      if (this.speechBubbleTimer <= 0) {
        this.state.showSpeechBubble = false;
      }
    }

    const newExpression = this.stateMachine.evaluate(this.state);
    if (newExpression) {
      this.changeExpression(newExpression);
    }

    if (now - this.lastIntimacyReport > 60000) {
      this.reportIntimacyData();
      this.lastIntimacyReport = now;
    }

    this.notifyListeners();
  }

  private render(deltaTime: number): void {
    if (this.renderer && this.dragSystem) {
      const dragState = this.dragSystem.getState();
      this.renderer.render(
        this.state,
        dragState.isDragging,
        dragState.position,
        dragState.currentFood,
        deltaTime
      );
    }
  }

  private handleFoodDrop(food: Food, position: Position): void {
    if (!this.renderer) return;

    this.state.showHitbox = false;

    const isHit = this.renderer.isInHitbox(position);

    if (!isHit) {
      this.showSpeechBubble(this.lineSystem.getFeedLine(-10));
      return;
    }

    const now = Date.now();
    const lastFeedTime = this.state.lastFeedTime[food.id] || 0;

    if (now - lastFeedTime < CONFIG.FEED_COOLDOWN) {
      this.showSpeechBubble(this.lineSystem.getCooldownLine());
      return;
    }

    if (this.state.fullness >= CONFIG.MAX_FULLNESS) {
      this.state.animationState = 'refusing';
      this.state.lastFeedTime['__refuse_start'] = now;
      this.showSpeechBubble(this.lineSystem.getRefuseLine());
      return;
    }

    this.state.lastFeedTime[food.id] = now;
    this.state.lastFeedTime['__chewing_start'] = now;

    const satisfactionChange = this.preferenceMatrix.calculateSatisfaction(
      food.taste,
      this.state.currentMood
    );

    this.state.satisfaction = Math.max(
      CONFIG.MIN_SATISFACTION,
      Math.min(CONFIG.MAX_SATISFACTION, this.state.satisfaction + satisfactionChange)
    );

    this.state.fullness = Math.min(
      CONFIG.MAX_FULLNESS,
      this.state.fullness + CONFIG.FULLNESS_PER_FEED
    );

    this.state.consecutiveFeeds = satisfactionChange > 0 
      ? this.state.consecutiveFeeds + 1
      : 0;

    this.state.totalFeedCount++;
    this.state.totalSatisfaction += satisfactionChange;
    this.state.idleTime = 0;
    this.state.animationState = 'chewing';

    this.showSpeechBubble(this.lineSystem.getFeedLine(satisfactionChange));

    if (satisfactionChange > 0) {
      this.updateMoodBasedOnSatisfaction(satisfactionChange);
    }

    this.notifyListeners();
  }

  private showSpeechBubble(line: string): void {
    this.state.currentLine = line;
    this.state.showSpeechBubble = true;
    this.speechBubbleTimer = CONFIG.SPEECH_BUBBLE_DURATION;
  }

  private changeMood(): void {
    const moods: Mood[] = ['normal', 'good', 'bad'];
    const weights = [0.5, 0.3, 0.2];
    
    let random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < moods.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        this.state.currentMood = moods[i];
        break;
      }
    }
  }

  private updateMoodBasedOnSatisfaction(satisfaction: number): void {
    if (satisfaction >= 20) {
      this.state.currentMood = 'good';
      this.lastMoodChange = Date.now();
    } else if (satisfaction <= -10) {
      this.state.currentMood = 'bad';
      this.lastMoodChange = Date.now();
    }
  }

  private changeExpression(expression: ExpressionState): void {
    this.state.currentExpression = expression;
    this.state.lastExpressionChangeTime = Date.now();
    this.showSpeechBubble(this.lineSystem.getExpressionLine(expression));
  }

  private reportIntimacyData(): void {
    const today = new Date().toISOString().split('T')[0];
    reportIntimacy({
      date: today,
      totalSatisfaction: this.state.totalSatisfaction,
      feedCount: this.state.totalFeedCount,
    }).then((response) => {
      if (response.success) {
        this.state.intimacy = response.currentIntimacy;
      }
    });
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getDragSystem(): DragSystem | null {
    return this.dragSystem;
  }

  public getRenderer(): Renderer | null {
    return this.renderer;
  }

  public getFoods(): Food[] {
    return FOODS;
  }

  public reset(): void {
    this.state = this.createInitialState();
    this.lastMoodChange = Date.now();
    this.lastFullnessDecay = Date.now();
    this.lastIntimacyReport = Date.now();
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  public toggleHitbox(): void {
    this.state.showHitbox = !this.state.showHitbox;
    this.notifyListeners();
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
