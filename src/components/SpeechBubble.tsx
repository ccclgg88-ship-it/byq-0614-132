import React from 'react';

interface SpeechBubbleProps {
  text: string;
  visible: boolean;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce-in">
      <div className="relative bg-game-light border-4 border-game-primary rounded-lg px-4 py-2 max-w-xs shadow-lg">
        <p className="font-body text-game-dark text-sm leading-relaxed text-center">
          {text}
        </p>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <svg width="24" height="12" viewBox="0 0 24 12">
            <polygon
              points="0,0 24,0 12,12"
              fill="#ff6b9d"
              stroke="#2d1b4e"
              strokeWidth="2"
            />
            <polygon
              points="2,1 22,1 12,10"
              fill="#f5e6ff"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
