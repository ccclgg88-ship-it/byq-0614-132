import React from 'react';
import { Food, GameState } from '@/types';
import { CONFIG } from '@/data/config';
import { DragSystem } from '@/game/DragSystem';

interface FoodTrayProps {
  foods: Food[];
  dragSystem: DragSystem | null;
  gameState: GameState;
}

const tasteLabels: Record<string, string> = {
  sweet: '甜',
  salty: '咸',
  spicy: '辣',
};

const tasteColors: Record<string, string> = {
  sweet: 'bg-pink-500',
  salty: 'bg-yellow-500',
  spicy: 'bg-red-500',
};

export const FoodTray: React.FC<FoodTrayProps> = ({ foods, dragSystem, gameState }) => {
  const handleMouseDown = (e: React.MouseEvent, food: Food) => {
    e.preventDefault();
    const lastFeed = gameState.lastFeedTime[food.id] || 0;
    if (Date.now() - lastFeed < CONFIG.FEED_COOLDOWN) {
      return;
    }
    if (dragSystem) {
      dragSystem.startDrag(food, e.clientX, e.clientY);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        dragSystem.updatePosition(moveEvent.clientX, moveEvent.clientY);
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        const position = dragSystem.getCanvasPosition(upEvent.clientX, upEvent.clientY);
        dragSystem.endDrag(position);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, food: Food) => {
    e.preventDefault();
    const lastFeed = gameState.lastFeedTime[food.id] || 0;
    if (Date.now() - lastFeed < CONFIG.FEED_COOLDOWN) {
      return;
    }
    const touch = e.touches[0];
    if (dragSystem) {
      dragSystem.startDrag(food, touch.clientX, touch.clientY);

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const moveTouch = moveEvent.touches[0];
        dragSystem.updatePosition(moveTouch.clientX, moveTouch.clientY);
      };

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endTouch = endEvent.changedTouches[0];
        const position = dragSystem.getCanvasPosition(endTouch.clientX, endTouch.clientY);
        dragSystem.endDrag(position);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  const isFoodOnCooldown = (food: Food) => {
    const lastFeed = gameState.lastFeedTime[food.id] || 0;
    return Date.now() - lastFeed < CONFIG.FEED_COOLDOWN;
  };

  const getCooldownPercent = (food: Food) => {
    const lastFeed = gameState.lastFeedTime[food.id] || 0;
    const elapsed = Date.now() - lastFeed;
    if (elapsed >= CONFIG.FEED_COOLDOWN) return 0;
    return ((CONFIG.FEED_COOLDOWN - elapsed) / CONFIG.FEED_COOLDOWN) * 100;
  };

  return (
    <div className="bg-game-dark/90 border-4 border-game-primary rounded-lg p-4 backdrop-blur-sm">
      <h2 className="font-pixel text-game-primary text-sm mb-3 text-center">
        食物托盘
      </h2>
      <div className="flex gap-3 justify-center flex-wrap">
        {foods.map((food) => {
          const onCooldown = isFoodOnCooldown(food);
          const cooldownPercent = getCooldownPercent(food);

          return (
            <div
              key={food.id}
              className={`relative group ${onCooldown ? 'opacity-50' : 'cursor-grab active:cursor-grabbing'}`}
              onMouseDown={(e) => !onCooldown && handleMouseDown(e, food)}
              onTouchStart={(e) => !onCooldown && handleTouchStart(e, food)}
            >
              <div
                className={`w-16 h-16 rounded-lg border-4 border-game-accent flex flex-col items-center justify-center transition-all duration-200 ${
                  !onCooldown
                    ? 'bg-game-bg hover:scale-110 hover:border-game-primary hover:shadow-lg hover:shadow-game-primary/30'
                    : 'bg-game-dark cursor-not-allowed'
                }`}
                style={{ backgroundColor: food.color + '40' }}
              >
                <span className="text-3xl">{food.emoji}</span>
                <span className="font-pixel text-xs text-game-light mt-1">
                  {food.name}
                </span>
              </div>

              <div
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white font-pixel text-xs ${tasteColors[food.taste]}`}
              >
                {tasteLabels[food.taste]}
              </div>

              {onCooldown && (
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-black/60 transition-all duration-100"
                    style={{ height: `${cooldownPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-pixel text-white text-xs">
                      {Math.ceil((CONFIG.FEED_COOLDOWN - (Date.now() - (gameState.lastFeedTime[food.id] || 0))) / 1000)}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <p className="font-body text-game-light text-xs">
          拖拽食物到魅魔身上进行投喂
        </p>
      </div>
    </div>
  );
};
