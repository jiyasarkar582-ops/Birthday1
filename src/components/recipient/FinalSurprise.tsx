import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Share2, MessageCircleHeart, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BirthdayOptions, ThemeConfig } from '../../types';
import { fireCelebrationConfetti } from '../common/ConfettiEffect';

interface FinalSurpriseProps {
  options: BirthdayOptions;
  recipientName: string;
  creatorName: string;
  theme: ThemeConfig;
  onReplay: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  options,
  recipientName,
  creatorName,
  theme,
  onReplay,
}) => {
  const triggerConfettiAgain = () => {
    fireCelebrationConfetti();
  };

  return (
    <section className="relative w-full max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-rose-100"
      >
        {/* Floating Heart Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-rose-300/40 mb-6">
          <Heart className="w-8 h-8 fill-white animate-pulse" />
        </div>

        {/* Surprise Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug mb-4">
          Happy Birthday, {recipientName}!
        </h2>

        {/* Final Message */}
        <p className="text-stone-700 text-lg sm:text-xl font-medium leading-relaxed max-w-lg mx-auto mb-3">
          {options.final_surprise_text || 'May this year be filled with radiant joy, peace, and unforgettable moments!'}
        </p>

        {options.final_surprise_subtext && (
          <p className="text-stone-500 text-sm sm:text-base max-w-md mx-auto mb-8">
            {options.final_surprise_subtext}
          </p>
        )}

        {/* Optional Custom Action Button or Hug Back */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 mb-8">
          {options.surprise_button_link ? (
            <a
              href={options.surprise_button_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{options.surprise_button_label || 'A Special Gift For You'}</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={triggerConfettiAgain}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>More Confetti! 🎉</span>
            </button>
          )}

          {/* Replay Entire Experience */}
          <button
            type="button"
            onClick={onReplay}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Replay Experience ↺</span>
          </button>
        </div>

        {/* Creator Love Note */}
        <div className="pt-6 border-t border-rose-100/80 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <MessageCircleHeart className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Surprise created with love by <strong className="text-stone-700 font-semibold">{creatorName}</strong></span>
          </p>

          <Link
            to="/create"
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium hover:underline"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create one for your loved ones</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

