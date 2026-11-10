import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
import { FontChoice, LetterAnimation, ThemeConfig } from '../../types';

interface LetterSceneProps {
  heading: string;
  letterText: string;
  recipientName: string;
  creatorName: string;
  relationship?: string;
  birthdayDate?: string;
  font: FontChoice;
  animation: LetterAnimation;
  theme: ThemeConfig;
  onNext?: () => void;
}

export const LetterScene: React.FC<LetterSceneProps> = ({
  heading,
  letterText,
  recipientName,
  creatorName,
  relationship,
  birthdayDate,
  font,
  animation,
  theme,
  onNext,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(animation !== 'typewriter');

  // Typewriter effect handler
  useEffect(() => {
    if (animation !== 'typewriter') {
      setDisplayedText(letterText);
      setIsTypingDone(true);
      return;
    }

    let currentIdx = 0;
    const speed = 18; // ms per character
    setDisplayedText('');
    setIsTypingDone(false);

    const interval = setInterval(() => {
      if (currentIdx < letterText.length) {
        setDisplayedText(letterText.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [letterText, animation]);

  const skipTyping = () => {
    setDisplayedText(letterText);
    setIsTypingDone(true);
  };

  const fontClasses: Record<FontChoice, string> = {
    serif: 'font-serif text-lg sm:text-xl leading-relaxed',
    cursive: 'font-cursive text-2xl sm:text-3xl leading-relaxed tracking-wide',
    handwriting: 'font-handwriting text-2xl sm:text-3xl leading-relaxed tracking-wide',
    sans: 'font-sans text-base sm:text-lg leading-relaxed',
  };

  return (
    <section className="relative w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-rose-100/80 overflow-hidden"
      >
        {/* Subtle decorative vintage stamp and seal header */}
        <div className="flex items-start justify-between border-b border-rose-100/80 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Personal Letter</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
              {heading || `Happy Birthday, ${recipientName}!`}
            </h2>
            {relationship && (
              <span className="inline-block mt-1 text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                For my {relationship}
              </span>
            )}
          </div>

          {birthdayDate && (
            <div className="hidden sm:flex flex-col items-end text-xs text-stone-600 bg-rose-50/80 border border-rose-100 px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-1 font-medium text-rose-700">
                <Calendar className="w-3.5 h-3.5" />
                <span>Special Day</span>
              </div>
              <span className="font-bold text-stone-800">{birthdayDate}</span>
            </div>
          )}
        </div>

        {/* Letter Body Text */}
        <div className={`text-stone-800 whitespace-pre-line min-h-[160px] ${fontClasses[font] || fontClasses.serif}`}>
          {displayedText}
          {!isTypingDone && (
            <span className="inline-block w-2 h-5 bg-rose-500 ml-1 animate-pulse align-middle" />
          )}
        </div>

        {/* Skip typing button for typewriter mode */}
        {!isTypingDone && (
          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={skipTyping}
              className="text-xs text-stone-600 hover:text-stone-900 underline transition-colors"
            >
              Reveal entire message instantly
            </button>
          </div>
        )}

        {/* Sender Sign-off */}
        <div className="mt-8 pt-6 border-t border-rose-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">With all my love,</p>
              <p className="font-serif font-bold text-stone-800 text-base">{creatorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Handcrafted for you</span>
          </div>
        </div>

        {/* Action Button to Next Step */}
        {onNext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: theme.accentColor }}
            >
              <span>Explore Our Memories</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

