import React from 'react';
import { GameState } from '@/types';
import { EXPRESSION_NAMES, MOOD_NAMES, CONFIG } from '@/data/config';

interface StatusPanelProps {
  gameState: GameState;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ gameState }) => {
  const fullnessPercent = (gameState.fullness / CONFIG.MAX_FULLNESS) * 100;
  const satisfactionPercent = ((gameState.satisfaction + 100) / 200) * 100;

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'good':
        return '😊';
      case 'bad':
        return '😠';
      default:
        return '😐';
    }
  };

  const getSatisfactionColor = (value: number) => {
    if (value >= 60) return 'bg-game-secondary';
    if (value >= 20) return 'bg-green-500';
    if (value >= 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFullnessColor = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-game-dark/90 border-4 border-game-primary rounded-lg p-4 w-64 backdrop-blur-sm">
      <h2 className="font-pixel text-game-primary text-sm mb-4 text-center">
        状态面板
      </h2>

      <div className="space-y-4">
        <div className="bg-game-bg/50 rounded p-3 border-2 border-game-accent">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-game-light text-sm">表情</span>
            <span className="font-pixel text-game-secondary text-xs">
              {EXPRESSION_NAMES[gameState.currentExpression]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body text-game-light text-sm">心情</span>
            <span className="flex items-center gap-1">
              <span className="text-xl">{getMoodEmoji(gameState.currentMood)}</span>
              <span className="font-body text-game-light text-sm">
                {MOOD_NAMES[gameState.currentMood]}
              </span>
            </span>
          </div>
        </div>

        <div className="bg-game-bg/50 rounded p-3 border-2 border-game-accent">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-game-light text-sm">饱食度</span>
            <span className="font-pixel text-game-secondary text-xs">
              {gameState.fullness}/{CONFIG.MAX_FULLNESS}
            </span>
          </div>
          <div className="h-4 bg-game-dark rounded-full border-2 border-game-primary overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getFullnessColor(gameState.fullness)}`}
              style={{ width: `${fullnessPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-game-bg/50 rounded p-3 border-2 border-game-accent">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-game-light text-sm">满意度</span>
            <span className="font-pixel text-game-secondary text-xs">
              {gameState.satisfaction}
            </span>
          </div>
          <div className="h-4 bg-game-dark rounded-full border-2 border-game-primary overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getSatisfactionColor(gameState.satisfaction)}`}
              style={{ width: `${satisfactionPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-game-bg/50 rounded p-3 border-2 border-game-accent">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="font-pixel text-game-primary text-lg">
                {gameState.consecutiveFeeds}
              </div>
              <div className="font-body text-game-light text-xs">连续投喂</div>
            </div>
            <div>
              <div className="font-pixel text-game-secondary text-lg">
                {gameState.totalFeedCount}
              </div>
              <div className="font-body text-game-light text-xs">总投喂数</div>
            </div>
          </div>
        </div>

        <div className="bg-game-bg/50 rounded p-3 border-2 border-game-accent">
          <div className="flex items-center justify-between">
            <span className="font-body text-game-light text-sm">亲密度</span>
            <span className="font-pixel text-game-primary text-lg">
              {gameState.intimacy.toFixed(1)}
            </span>
          </div>
          <div className="mt-2 h-2 bg-game-dark rounded-full border border-game-primary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-game-primary to-game-secondary transition-all duration-300"
              style={{ width: `${Math.min(gameState.intimacy * 2, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-game-bg/50 rounded p-3 border-2 border-game-accent">
          <div className="flex items-center justify-between">
            <span className="font-body text-game-light text-sm">空闲时间</span>
            <span className="font-pixel text-game-light text-xs">
              {Math.floor(gameState.idleTime)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
