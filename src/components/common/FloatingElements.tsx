import React, { useMemo } from 'react';
import { FloatingType } from '../../types';

interface FloatingElementsProps {
  type?: FloatingType;
  count?: number;
  color?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  type = 'hearts',
  count = 16,
}) => {
  const elements = useMemo(() => {
    const symbols = {
      hearts: ['💖', '💕', '💗', '💓', '✨'],
      sparkles: ['✨', '⭐', '💫', '🌟', '✦'],
      flowers: ['🌸', '🌺', '🌷', '🌼', '💐'],
      stars: ['⭐', '🌟', '✨', '🪐', '💫'],
      mixed: ['💖', '✨', '🌸', '🎂', '⭐', '🎈'],
    };

    const icons = symbols[type] || symbols.hearts;

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 94 + 3, // 3% to 97%
      size: Math.random() * 14 + 14, // 14px to 28px
      duration: Math.random() * 8 + 7, // 7s to 15s
      delay: Math.random() * 5, // 0s to 5s
      drift: (Math.random() - 0.5) * 60, // horizontal drift
    }));
  }, [type, count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute opacity-0 select-none animate-float-particle"
          style={{
            left: `${el.left}%`,
            bottom: '-40px',
            fontSize: `${el.size}px`,
            animation: `floatUp ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))',
          }}
        >
          {el.icon}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.65;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-110vh) scale(1.1) rotate(25deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

