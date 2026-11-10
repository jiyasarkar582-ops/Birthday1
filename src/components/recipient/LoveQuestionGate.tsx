import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Smile, Laugh, AlertCircle } from 'lucide-react';
import { fireHeartConfetti } from '../common/ConfettiEffect';
import { audioSynthesizer } from '../../services/audioSynthesizer';
import { ThemeConfig } from '../../types';

interface LoveQuestionGateProps {
  recipientName: string;
  theme: ThemeConfig;
  onUnlocked: () => void;
  isOpen?: boolean;
}

export const LoveQuestionGate: React.FC<LoveQuestionGateProps> = ({
  recipientName,
  theme,
  onUnlocked,
}) => {
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [noCount, setNoCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showNoWarning, setShowNoWarning] = useState(false);

  // Determine display name
  const isAbhi = recipientName.toLowerCase().includes('abhi');
  const displayTitle = isAbhi 
    ? 'open it abhiiii ❤️' 
    : `open it ${recipientName.toLowerCase()} ❤️`;

  const handlePositiveChoice = (optionLabel: string) => {
    setSelectedOption(optionLabel);
    setAnswered(true);
    setShowNoWarning(false);
    audioSynthesizer.playEnvelopeOpenSound();
    fireHeartConfetti();

    // Trigger unlocked after brief sweet animation
    setTimeout(() => {
      onUnlocked();
    }, 1800);
  };

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    setShowNoWarning(true);

    // Playful small position dodge
    const randomX = (Math.random() - 0.5) * 80;
    const randomY = (Math.random() - 0.5) * 40;
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  const handleNoHover = () => {
    // On hover, randomly nudge slightly to tease playfully
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 30;
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto px-4 py-8 select-none z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-rose-200/90 text-center overflow-hidden"
      >
        {/* Soft Pink Background Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Heart Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-rose-300/50 mb-5 animate-bounce">
          <Heart className="w-8 h-8 fill-white" />
        </div>

        {/* Heading: "open it abhiiii ❤️" */}
        <h2 className="font-serif text-3xl sm:text-4xl font-black text-rose-600 tracking-tight capitalize leading-tight mb-2">
          {displayTitle}
        </h2>

        {/* Question: "do u love me or not" */}
        <div className="my-4 py-2 px-4 rounded-2xl bg-rose-50 border border-rose-100 inline-block">
          <p className="font-serif text-lg sm:text-xl font-bold text-stone-800 flex items-center justify-center gap-2">
            <span>Do u love me or not?</span>
            <span className="text-xl">🥺👉👈</span>
          </p>
        </div>

        <p className="text-xs text-stone-500 mb-6 font-medium">
          Answer honestly before opening your surprise:
        </p>

        {/* Options State */}
        {!answered ? (
          <div className="space-y-3 relative">
            {/* Option 1: Yes */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handlePositiveChoice('yes')}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-base shadow-md shadow-rose-300/40 flex items-center justify-center gap-2 transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Yes 🥰</span>
            </motion.button>

            {/* Option 2: Absolutely yes */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handlePositiveChoice('absolutely yes')}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:opacity-95 text-white font-bold text-base shadow-md shadow-pink-300/40 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Absolutely yes 💖</span>
            </motion.button>

            {/* Option 3: No (Playfully runs away or shows warning) */}
            <div className="relative py-1">
              <motion.button
                animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseEnter={handleNoHover}
                type="button"
                onClick={handleNoClick}
                className="w-full py-2.5 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-sm transition-all border border-stone-200"
              >
                {noCount >= 2 ? 'No (wait... why is this still here? 😂)' : 'No 🙈'}
              </motion.button>
            </div>

            {/* Playful Warning Message if No is clicked */}
            <AnimatePresence>
              {showNoWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2 text-left"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {noCount === 1
                      ? 'Hey! "No" is not allowed! 😜 Look at the other options below!'
                      : 'There is literally NO option! You HAVE to choose yes! 😂❤️'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Option 4: I choose option 1 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handlePositiveChoice('i choose option 1')}
              className="w-full py-3 px-5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm border-2 border-rose-200 flex items-center justify-center gap-2 transition-all"
            >
              <Smile className="w-4 h-4 text-rose-500" />
              <span>I choose option 1 🤭</span>
            </motion.button>

            {/* Option 5: There is no option i have to choose yes */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handlePositiveChoice('there is no option i have to choose yes')}
              className="w-full py-3 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Laugh className="w-4 h-4 text-amber-300" />
              <span>There is no option, I have to choose yes! 🥹💘</span>
            </motion.button>
          </div>
        ) : (
          /* Success Animation state */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 space-y-3"
          >
            <div className="text-4xl animate-bounce">🥰❤️🎉</div>
            <h3 className="font-serif text-2xl font-extrabold text-stone-900">
              Hehehe I knew it!
            </h3>
            <p className="text-stone-600 text-sm max-w-xs mx-auto">
              You chose: <strong className="text-rose-600 font-bold capitalize">"{selectedOption}"</strong>!
            </p>
            <p className="text-xs text-rose-500 font-semibold animate-pulse">
              Unwrapping your birthday envelope now... ✨
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

