export type Taste = 'sweet' | 'salty' | 'spicy';

export type ExpressionState =
  | 'happy'
  | 'shy'
  | 'coquettish'
  | 'wronged'
  | 'sleepy'
  | 'excited';

export type Mood = 'normal' | 'good' | 'bad';

export type AnimationState = 'idle' | 'chewing' | 'refusing' | 'bouncing';

export interface Food {
  id: string;
  name: string;
  taste: Taste;
  color: string;
  emoji: string;
}

export interface GameState {
  satisfaction: number;
  fullness: number;
  consecutiveFeeds: number;
  currentMood: Mood;
  currentExpression: ExpressionState;
  lastFeedTime: Record<string, number>;
  idleTime: number;
  intimacy: number;
  totalFeedCount: number;
  totalSatisfaction: number;
  animationState: AnimationState;
  lastExpressionChangeTime: number;
  showSpeechBubble: boolean;
  currentLine: string;
  showHitbox: boolean;
}

export interface TransitionCondition {
  from: ExpressionState | '*';
  to: ExpressionState;
  condition: (state: GameState) => boolean;
  priority: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  currentFood: Food | null;
  position: Position;
}

export interface LineEntry {
  emotion: ExpressionState | 'feed_generic' | 'refuse' | 'cooldown';
  lines: string[];
}

export interface PixelCharacter {
  base: number[][];
  expressions: Record<ExpressionState, number[][]>;
}

export type PixelColorMap = Record<number, string>;
