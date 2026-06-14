import { ExpressionState, GameState, TransitionCondition } from '@/types';
import { CONFIG } from '@/data/config';

export class StateMachine {
  private transitionTable: TransitionCondition[];

  constructor() {
    this.transitionTable = this.buildTransitionTable();
  }

  private getMoodModifier(mood: string): { positive: number; negative: number } {
    switch (mood) {
      case 'good':
        return { positive: -20, negative: 20 };
      case 'bad':
        return { positive: 20, negative: -20 };
      default:
        return { positive: 0, negative: 0 };
    }
  }

  private buildTransitionTable(): TransitionCondition[] {
    return [
      {
        from: '*',
        to: 'excited',
        priority: 1,
        condition: (state) => {
          const modifier = this.getMoodModifier(state.currentMood);
          const threshold = 80 + modifier.positive;
          return state.satisfaction >= threshold && state.consecutiveFeeds >= 3;
        },
      },
      {
        from: '*',
        to: 'happy',
        priority: 2,
        condition: (state) => {
          const modifier = this.getMoodModifier(state.currentMood);
          const threshold = 60 + modifier.positive;
          return state.satisfaction >= threshold;
        },
      },
      {
        from: '*',
        to: 'coquettish',
        priority: 3,
        condition: (state) => {
          const modifier = this.getMoodModifier(state.currentMood);
          const threshold = 40 + modifier.positive;
          return state.satisfaction >= threshold && state.consecutiveFeeds >= 2;
        },
      },
      {
        from: '*',
        to: 'shy',
        priority: 4,
        condition: (state) => {
          const modifier = this.getMoodModifier(state.currentMood);
          const lowThreshold = 20 + modifier.positive;
          const highThreshold = 40 + modifier.positive;
          return state.satisfaction >= lowThreshold && state.satisfaction < highThreshold;
        },
      },
      {
        from: '*',
        to: 'wronged',
        priority: 5,
        condition: (state) => {
          if (state.currentMood === 'bad') {
            const modifier = this.getMoodModifier(state.currentMood);
            const threshold = 10 + modifier.negative;
            return state.satisfaction < threshold;
          }
          return state.satisfaction < -20;
        },
      },
      {
        from: '*',
        to: 'sleepy',
        priority: 6,
        condition: (state) =>
          state.idleTime >= 30 && state.fullness >= 50,
      },
      {
        from: '*',
        to: 'happy',
        priority: 7,
        condition: (state) => {
          if (state.currentMood === 'bad') return false;
          return state.idleTime >= 60;
        },
      },
      {
        from: '*',
        to: 'shy',
        priority: 8,
        condition: (state) => {
          const inNeutralZone = state.satisfaction >= 0 && state.satisfaction < 20;
          if (!inNeutralZone) return false;
          return state.currentMood === 'good';
        },
      },
      {
        from: '*',
        to: 'happy',
        priority: 9,
        condition: (state) => {
          const inNeutralZone = state.satisfaction >= 0 && state.satisfaction < 20;
          if (!inNeutralZone) return false;
          return state.currentMood === 'normal';
        },
      },
      {
        from: '*',
        to: 'wronged',
        priority: 10,
        condition: (state) => {
          const inNeutralZone = state.satisfaction >= 0 && state.satisfaction < 20;
          if (!inNeutralZone) return false;
          return state.currentMood === 'bad';
        },
      },
      {
        from: '*',
        to: 'shy',
        priority: 11,
        condition: (state) => {
          if (state.currentMood !== 'normal') return false;
          const inMildNegative = state.satisfaction >= -20 && state.satisfaction < 0;
          return inMildNegative;
        },
      },
      {
        from: '*',
        to: 'wronged',
        priority: 12,
        condition: (state) => {
          if (state.currentMood !== 'bad') return false;
          const inMildNegative = state.satisfaction >= -20 && state.satisfaction < 0;
          return inMildNegative;
        },
      },
      {
        from: '*',
        to: 'happy',
        priority: 99,
        condition: (state) => {
          if (state.currentMood === 'bad') return false;
          return state.satisfaction >= 0;
        },
      },
    ];
  }

  public evaluate(state: GameState): ExpressionState | null {
    const now = Date.now();
    if (now - state.lastExpressionChangeTime < CONFIG.EXPRESSION_MIN_DURATION) {
      return null;
    }

    const sortedTransitions = [...this.transitionTable].sort(
      (a, b) => a.priority - b.priority
    );

    for (const transition of sortedTransitions) {
      if (
        transition.from === '*' ||
        transition.from === state.currentExpression
      ) {
        if (transition.condition(state)) {
          if (transition.to !== state.currentExpression) {
            return transition.to;
          }
          return null;
        }
      }
    }

    return null;
  }

  public addTransition(transition: TransitionCondition): void {
    this.transitionTable.push(transition);
    this.transitionTable.sort((a, b) => a.priority - b.priority);
  }

  public removeTransition(to: ExpressionState): void {
    this.transitionTable = this.transitionTable.filter((t) => t.to !== to);
  }

  public getTransitions(): TransitionCondition[] {
    return [...this.transitionTable];
  }
}
