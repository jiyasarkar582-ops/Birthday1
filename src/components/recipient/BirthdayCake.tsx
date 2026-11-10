import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Wind, RotateCcw, Heart } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { audioSynthesizer } from '../../services/audioSynthesizer';
import { fireCelebrationConfetti } from '../common/ConfettiEffect';

interface BirthdayCakeProps {
  candleCount?: number;
  recipientName: string;
  theme: ThemeConfig;
  onBlowOut?: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  candleCount = 3,
  recipientName,
  theme,
  onBlowOut,
}) => {
  // Array of boolean states for each candle (lit or unlit)
  const [candlesLit, setCandlesLit] = useState<boolean[]>(() =>
    Array(candleCount).fill(true)
  );
  const [hasBlownAll, setHasBlownAll] = useState(false);

  // Extinguish a single candle by index
  const blowCandle = (index: number) => {
    if (!candlesLit[index]) return;

    const nextLit = [...candlesLit];
    nextLit[index] = false;
    setCandlesLit(nextLit);

    audioSynthesizer.playCandleBlowSound();

    // Check if all candles are blown
    if (nextLit.every((lit) => !lit)) {
      setHasBlownAll(true);
      fireCelebrationConfetti();
      if (onBlowOut) onBlowOut();
    }
  };

  // Blow out all candles at once
  const blowAllCandles = () => {
    if (hasBlownAll) return;
    setCandlesLit(Array(candleCount).fill(false));
    setHasBlownAll(true);
    audioSynthesizer.playCandleBlowSound();
    fireCelebrationConfetti();
    if (onBlowOut) onBlowOut();
  };

  // Relight all candles
  const relightCandles = () => {
    setCandlesLit(Array(candleCount).fill(true));
    setHasBlownAll(false);
  };

  return (
    <section className="relative w-full max-w-xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Celebration Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-amber-200 shadow-xs mb-3 text-xs font-semibold text-amber-700 uppercase tracking-widest backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Birthday Ritual</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Make a Wish, {recipientName}!
        </h2>
        <p className="text-stone-600 text-sm mt-2 max-w-sm mx-auto">
          {hasBlownAll
            ? '✨ Your wish has been sent to the universe! Happy Birthday! ✨'
            : 'Close your eyes, think of your sweetest wish, and tap the candles to blow them out.'}
        </p>
      </div>

      {/* The Animated Cake Container */}
      <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex flex-col items-center justify-end select-none">
        {/* CANDLES ROW */}
        <div className="absolute top-8 z-20 flex items-end justify-center gap-4 sm:gap-6 w-full">
          {candlesLit.map((isLit, index) => (
            <div
              key={index}
              onClick={() => blowCandle(index)}
              className="relative flex flex-col items-center cursor-pointer group"
              role="button"
              tabIndex={0}
              aria-label={`Candle ${index + 1}: ${isLit ? 'Lit, tap to blow out' : 'Extinguished'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  blowCandle(index);
                }
              }}
            >
              {/* Flame or Smoke */}
              <div className="relative w-6 h-8 flex items-center justify-center">
                <AnimatePresence>
                  {isLit ? (
                    <motion.div
                      key="flame"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="candle-flame absolute bottom-1 w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200"
                    >
                      {/* Inner blue-white core */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2 rounded-full bg-blue-300 opacity-70" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="smoke"
                      initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -28, scale: 1.8 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="smoke-puff absolute bottom-1 w-3 h-3 rounded-full bg-stone-400"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-stone-700" />

              {/* Candle Body */}
              <div
                className="w-3.5 sm:w-4 h-14 sm:h-16 rounded-t-xs rounded-b-sm shadow-md border border-black/10 relative overflow-hidden"
                style={{
                  background:
                    index % 2 === 0
                      ? 'linear-gradient(135deg, #f43f5e 25%, #fda4af 25%, #fda4af 50%, #f43f5e 50%, #f43f5e 75%, #fda4af 75%)'
                      : 'linear-gradient(135deg, #38bdf8 25%, #bae6fd 25%, #bae6fd 50%, #38bdf8 50%, #38bdf8 75%, #bae6fd 75%)',
                  backgroundSize: '12px 12px',
                }}
              >
                {/* Candle highlight strip */}
                <div className="absolute top-0 left-0.5 bottom-0 w-1 bg-white/40" />
              </div>
            </div>
          ))}
        </div>

        {/* TOP CAKE LAYER */}
        <div
          className="relative w-44 sm:w-52 h-16 sm:h-20 rounded-2xl shadow-lg border border-black/10 z-10 flex flex-col justify-between overflow-hidden"
          style={{ backgroundColor: theme.cakeStyle.frosting }}
        >
          {/* Frosting Drips */}
          <div className="flex justify-around w-full">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-5 rounded-b-full shadow-xs"
                style={{ backgroundColor: theme.cakeStyle.toppings }}
              />
            ))}
          </div>

          {/* Strawberry / Cherry Toppings */}
          <div className="absolute -top-3 left-0 right-0 flex justify-around px-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-sm filter drop-shadow-xs">
                🍓
              </span>
            ))}
          </div>

          {/* Cream piping detail */}
          <div className="h-2 w-full bg-white/50 mb-1" />
        </div>

        {/* BOTTOM CAKE LAYER */}
        <div
          className="relative w-64 sm:w-72 h-20 sm:h-24 rounded-2xl shadow-xl border border-black/10 z-5 -mt-2 flex flex-col justify-between overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, ${theme.cakeStyle.frosting}, #fdf2f8)`,
          }}
        >
          {/* Bottom Drips */}
          <div className="flex justify-around w-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-7 h-6 rounded-b-full shadow-xs"
                style={{ backgroundColor: theme.cakeStyle.toppings }}
              />
            ))}
          </div>

          {/* Decorative Sparkle Dots */}
          <div className="flex justify-around px-4 my-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? theme.accentColor : '#fbbf24',
                }}
              />
            ))}
          </div>

          <div className="h-3 w-full bg-white/60 mb-1" />
        </div>

        {/* CAKE STAND / PLATE */}
        <div
          className="w-72 sm:w-84 h-5 rounded-full shadow-2xl border border-stone-300 z-1"
          style={{ backgroundColor: theme.cakeStyle.plate }}
        />
        <div className="w-28 h-4 rounded-b-xl bg-stone-300/80 shadow-md border-t border-stone-400" />
      </div>

      {/* INTERACTIVE CONTROLS */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        {!hasBlownAll ? (
          <button
            type="button"
            onClick={blowAllCandles}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-base font-semibold text-white shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-amber-200"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 10px 20px -5px ${theme.accentColor}50`,
            }}
          >
            <Wind className="w-5 h-5 animate-pulse" />
            <span>Blow Out All Candles 🎂</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Wish Granted! ✨</span>
            </div>

            <button
              type="button"
              onClick={relightCandles}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-stone-600 bg-white hover:bg-stone-50 border border-stone-200 shadow-xs hover:text-stone-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Relight Candles</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

