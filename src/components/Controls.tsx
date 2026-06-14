import React, { useState } from 'react';

interface ControlsProps {
  onReset: () => void;
  onToggleHitbox: () => void;
  showHitbox: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onReset, onToggleHitbox, showHitbox }) => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-game-primary hover:bg-game-primary/80 text-white font-pixel text-xs rounded border-4 border-game-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          重置游戏
        </button>
        <button
          onClick={onToggleHitbox}
          className={`px-4 py-2 font-pixel text-xs rounded border-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
            showHitbox
              ? 'bg-game-secondary text-game-dark border-game-dark'
              : 'bg-game-accent hover:bg-game-accent/80 text-white border-game-dark'
          }`}
        >
          {showHitbox ? '隐藏命中区' : '显示命中区'}
        </button>
        <button
          onClick={() => setShowAbout(true)}
          className="px-4 py-2 bg-game-dark hover:bg-game-dark/80 text-game-light font-pixel text-xs rounded border-4 border-game-accent transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          关于
        </button>
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-game-dark border-4 border-game-primary rounded-lg p-6 max-w-md mx-4 animate-bounce-in">
            <h3 className="font-pixel text-game-primary text-lg mb-4 text-center">
              关于「投喂魅魔」
            </h3>
            <div className="font-body text-game-light text-sm space-y-3">
              <p>
                <span className="text-game-secondary font-bold">玩法：</span>
                从底部托盘拖拽食物到魅魔身上进行投喂。
              </p>
              <p>
                <span className="text-game-secondary font-bold">喜好：</span>
                魅魔喜欢甜食，对咸食一般，讨厌辣食。心情会影响喜好程度。
              </p>
              <p>
                <span className="text-game-secondary font-bold">表情：</span>
                根据满意度、连续投喂次数和空闲时间，魅魔会呈现6种不同表情。
              </p>
              <p>
                <span className="text-game-secondary font-bold">注意：</span>
                同一食物3秒内只能投喂一次，饱食度满后会拒绝进食。
              </p>
              <p className="text-game-accent text-xs mt-4">
                技术栈：React + TypeScript + Canvas + Zustand
              </p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-4 w-full px-4 py-2 bg-game-primary hover:bg-game-primary/80 text-white font-pixel text-xs rounded border-4 border-game-dark transition-all duration-200 hover:scale-105 active:scale-95"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
