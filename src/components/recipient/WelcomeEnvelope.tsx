import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ArrowDown, ChevronRight } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { audioSynthesizer } from '../../services/audioSynthesizer';

interface WelcomeEnvelopeProps {
  recipientName: string;
  creatorName: string;
  intro?: string;
  theme: ThemeConfig;
  isOpen: boolean;
  onOpen: () => void;
  onSkip?: () => void;
  buttonLabel?: string;
}

export const WelcomeEnvelope: React.FC<WelcomeEnvelopeProps> = ({
  recipientName,
  creatorName,
  intro,
  theme,
  isOpen,
  onOpen,
  onSkip,
  buttonLabel,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const isAbhi = recipientName.toLowerCase().includes('abhi');
  const defaultLabel = isAbhi 
    ? 'open it abhiiii ❤️' 
    : `Open it ${recipientName} ❤️`;

  const handleEnvelopeClick = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    audioSynthesizer.playEnvelopeOpenSound();

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  const initialLetter = recipientName.charAt(0).toUpperCase() || '❤';

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 select-none">
      {/* Intro Greetings */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-lg mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-rose-100 shadow-xs mb-4 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            A Birthday Delivery
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-3">
          For Dearest{' '}
          <span
            className="italic underline decoration-rose-300 decoration-wavy decoration-2"
            style={{ color: theme.accentColor }}
          >
            {recipientName}
          </span>
        </h1>

        {intro ? (
          <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            {intro}
          </p>
        ) : (
          <p className="text-stone-500 text-sm sm:text-base">
            Prepared with all the love in the world by <span className="font-semibold text-stone-700">{creatorName}</span>
          </p>
        )}
      </motion.div>

      {/* 3D Envelope Container */}
      <div className="perspective-1000 w-full max-w-sm sm:max-w-md flex flex-col items-center">
        <motion.div
          animate={isOpening || isOpen ? { scale: 1.05, y: -10 } : { y: [0, -6, 0] }}
          transition={
            isOpening || isOpen
              ? { duration: 0.5 }
              : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
          }
          onClick={handleEnvelopeClick}
          className="relative w-72 sm:w-88 h-48 sm:h-56 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Open birthday surprise envelope"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEnvelopeClick();
            }
          }}
        >
          {/* Envelope Pocket Base */}
          <div
            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden border border-black/10"
            style={{ backgroundColor: theme.envelopeColor.base }}
          >
            {/* Inner envelope pattern lining */}
            <div
              className="absolute inset-1 rounded-xl opacity-40 bg-repeat"
              style={{
                backgroundColor: theme.envelopeColor.inner,
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '12px 12px',
                color: theme.accentColor,
              }}
            />

            {/* Left triangle fold */}
            <div
              className="absolute top-0 left-0 bottom-0 w-0 h-0 border-solid"
              style={{
                borderWidth: '96px 0 96px 144px',
                borderColor: `transparent transparent transparent ${theme.envelopeColor.base}`,
                filter: 'brightness(0.96)',
                zIndex: 2,
              }}
            />

            {/* Right triangle fold */}
            <div
              className="absolute top-0 right-0 bottom-0 w-0 h-0 border-solid"
              style={{
                borderWidth: '96px 144px 96px 0',
                borderColor: `transparent ${theme.envelopeColor.base} transparent transparent`,
                filter: 'brightness(0.94)',
                zIndex: 2,
              }}
            />

            {/* Bottom triangle flap */}
            <div
              className="absolute bottom-0 left-0 right-0 w-0 h-0 border-solid mx-auto"
              style={{
                borderWidth: '0 144px 96px 144px',
                borderColor: `transparent transparent ${theme.envelopeColor.flap} transparent`,
                filter: 'brightness(0.92)',
                zIndex: 3,
              }}
            />
          </div>

          {/* Letter Card sliding out of envelope */}
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={
              isOpening || isOpen
                ? { y: -100, opacity: 1, scale: 1.05 }
                : { y: 0, opacity: 0 }
            }
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="absolute left-4 right-4 top-2 h-44 rounded-xl bg-white shadow-xl border border-stone-200 p-4 flex flex-col justify-between z-1"
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <span className="font-serif italic font-bold text-rose-600 text-sm">
                Happy Birthday!
              </span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
            <div className="space-y-1.5 my-auto">
              <div className="h-2 w-3/4 bg-stone-200 rounded-full" />
              <div className="h-2 w-full bg-stone-200 rounded-full" />
              <div className="h-2 w-5/6 bg-stone-200 rounded-full" />
            </div>
            <div className="text-right text-[11px] font-medium text-stone-500">
              With love, {creatorName}
            </div>
          </motion.div>

          {/* Top Envelope Flap with 3D Flip */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={isOpening || isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 4 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top center' }}
            className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
          >
            <div
              className="w-0 h-0 border-solid mx-auto"
              style={{
                borderWidth: '110px 144px 0 144px',
                borderColor: `${theme.envelopeColor.flap} transparent transparent transparent`,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))',
              }}
            />
          </motion.div>

          {/* Golden / Crimson Wax Seal */}
          <AnimatePresence>
            {!isOpen && !isOpening && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-10 wax-seal w-14 h-14 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl cursor-pointer group-hover:scale-110 transition-transform shadow-xl"
                style={{ backgroundColor: theme.envelopeColor.seal }}
              >
                <span className="drop-shadow-xs">{initialLetter}</span>
                <div className="absolute inset-1 rounded-full border border-white/30" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Prompt */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col items-center space-y-3"
          >
            <button
              type="button"
              onClick={handleEnvelopeClick}
              disabled={isOpening}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-base font-semibold text-white shadow-lg transform hover:-translate-y-1 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-rose-300"
              style={{
                backgroundColor: theme.accentColor,
                boxShadow: `0 10px 25px -5px ${theme.accentColor}50`,
              }}
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isOpening ? 'Opening Surprise...' : (buttonLabel || defaultLabel)}</span>
              <Sparkles className="w-4 h-4 text-amber-200" />
            </button>

            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <span>Tap the envelope or button to unfold</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </p>
          </motion.div>
        )}

        {/* Skip to Full Celebration (Accessibility & Fast Track) */}
        {onSkip && !isOpen && (
          <button
            type="button"
            onClick={onSkip}
            className="mt-6 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors underline underline-offset-4"
          >
            <span>Skip animation and view letter</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

