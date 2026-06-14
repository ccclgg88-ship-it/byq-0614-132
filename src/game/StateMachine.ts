import { ExpressionState, GameState, TransitionCondition } from '@/types';
import { CONFIG } from '@/data/config';

export class StateMachine {
  private transitionTable: TransitionCondition[];

  constructor() {
    this.transitionTable = this.buildTransitionTable();
  }

  private buildTransitionTable(): TransitionCondition[] {
    return [
      {
        from: '*',
        to: 'excited',
        priority: 1,
        condition: (state) =>
          state.satisfaction >= 80 && state.consecutiveFeeds >= 3,
      },
      {
        from: '*',
        to: 'happy',
        priority: 2,
        condition: (state) => state.satisfaction >= 60,
      },
      {
        from: '*',
        to: 'coquettish',
        priority: 3,
        condition: (state) =>
          state.satisfaction >= 40 && state.consecutiveFeeds >= 2,
      },
      {
        from: '*',
        to: 'shy',
        priority: 4,
        condition: (state) =>
          state.satisfaction >= 20 && state.satisfaction < 40,
      },
      {
        from: '*',
        to: 'wronged',
        priority: 5,
        condition: (state) => state.satisfaction < 0,
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
        condition: (state) => state.idleTime >= 60,
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
