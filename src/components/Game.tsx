import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { StatusPanel } from './StatusPanel';
import { FoodTray } from './FoodTray';
import { SpeechBubble } from './SpeechBubble';
import { Controls } from './Controls';
import { CONFIG } from '@/data/config';

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initializedRef = useRef(false);
  const {
    initializeEngine,
    destroyEngine,
    resetGame,
    gameState,
    foods,
    isInitialized,
    getEngine,
  } = useGameStore();
  const [showHitbox, setShowHitbox] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !isInitialized && !initializedRef.current) {
      initializedRef.current = true;
      initializeEngine(canvasRef.current);
    }

    return () => {
      if (initializedRef.current) {
        initializedRef.current = false;
        destroyEngine();
      }
    };
  }, []);

  const engine = getEngine();
  const dragSystem = engine?.getDragSystem() || null;

  const handleToggleHitbox = () => {
    setShowHitbox(!showHitbox);
    if (engine) {
      engine.toggleHitbox();
    }
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <h1 className="font-pixel text-game-primary text-2xl md:text-3xl mb-4 text-center animate-pulse-slow">
        投喂魅魔 ♡
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CONFIG.CANVAS_WIDTH}
              height={CONFIG.CANVAS_HEIGHT}
              className="border-4 border-game-primary rounded-lg shadow-2xl shadow-game-primary/20 cursor-crosshair"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            {!gameState && (
              <div className="absolute inset-0 flex items-center justify-center bg-game-bg/80 rounded-lg">
                <div className="font-pixel text-game-primary text-xl animate-pulse">
                  加载中...
                </div>
              </div>
            )}
            {gameState && (
              <>
                <SpeechBubble
                  text={gameState.currentLine}
                  visible={gameState.showSpeechBubble}
                />
                {gameState.animationState === 'refusing' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="font-pixel text-red-500 text-xl animate-shake">
                      X
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Controls
            onReset={resetGame}
            onToggleHitbox={handleToggleHitbox}
            showHitbox={showHitbox}
          />

          {gameState && (
            <FoodTray foods={foods} dragSystem={dragSystem} gameState={gameState} />
          )}
        </div>

        {gameState && <StatusPanel gameState={gameState} />}
      </div>

      <div className="mt-4 font-body text-game-light/60 text-xs text-center max-w-lg">
        <p>
          提示：拖拽食物到魅魔身上投喂。甜食+好感，辣食-好感。
          连续投喂喜欢的食物会触发特殊表情哦~
        </p>
      </div>
    </div>
  );
};
