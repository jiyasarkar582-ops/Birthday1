import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { decodePageFromUrlString } from '../services/urlSharing';
import { BirthdayPage } from '../types';
import { THEMES } from '../data/themes';
import { WelcomeEnvelope } from '../components/recipient/WelcomeEnvelope';
import { LetterScene } from '../components/recipient/LetterScene';
import { PhotoGallery } from '../components/recipient/PhotoGallery';
import { BirthdayCake } from '../components/recipient/BirthdayCake';
import { FinalSurprise } from '../components/recipient/FinalSurprise';
import { FloatingElements } from '../components/common/FloatingElements';
import { AudioPlayer } from '../components/recipient/AudioPlayer';
import { LoveQuestionGate } from '../components/recipient/LoveQuestionGate';
import { Gift, Heart, Home } from 'lucide-react';

export const RecipientPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<BirthdayPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [loveGatePassed, setLoveGatePassed] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);

      // 1. First try to decode page data from URL hash (#d=...)
      //    This is how cross-device sharing works without a backend.
      const hash = window.location.hash;
      if (hash && hash.includes('d=')) {
        try {
          const hashData = hash.split('d=')[1]?.split('&')[0];
          if (hashData) {
            const decoded = await decodePageFromUrlString(hashData);
            if (decoded) {
              setPage(decoded);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Failed to decode page from URL hash, falling back to local storage', err);
        }
      }

      // 2. Fall back to local IndexedDB / localStorage lookup (same device)
      if (slug) {
        const found = await storageService.getPageBySlug(slug);
        setPage(found);
      }

      setLoading(false);
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500 absolute animate-pulse" />
        </div>
        <p className="font-serif text-lg font-bold text-stone-800">
          Unwrapping your surprise...
        </p>
        <p className="text-stone-400 text-xs mt-1">
          Loading memories and birthday magic ✨
        </p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-md">
          <Gift className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-stone-900 mb-2">
          Celebration Not Found
        </h1>
        <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
          This birthday page might have been moved, unpublished, or the link has a typo.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-md transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Go to Heartfelt Home</span>
        </Link>
      </div>
    );
  }

  const theme = THEMES[page.theme] || THEMES['romantic-pink'];

  const handleReplay = () => {
    setIsEnvelopeOpen(false);
    setLoveGatePassed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isGateRequired = (page.options.love_question_enabled ?? true) && !loveGatePassed;

  return (
    <div className={`min-h-screen ${theme.background} relative overflow-x-hidden transition-colors duration-700`}>
      {/* Ambient Floating Elements */}
      <FloatingElements
        type={page.options.floating_elements || 'hearts'}
        count={18}
      />

      {/* Floating Audio Player (non-autoplay, strictly opt-in) */}
      <AudioPlayer options={page.options} accentColor={theme.accentColor} />

      {/* INITIAL GATE: "open it abhiiii ❤️" + "do u love me or not" */}
      {isGateRequired ? (
        <div className="min-h-[90vh] flex flex-col items-center justify-center">
          <LoveQuestionGate
            recipientName={page.recipient_name}
            theme={theme}
            onUnlocked={() => setLoveGatePassed(true)}
          />
        </div>
      ) : (
        <>
          {/* SCENE 1: Welcome Screen & 3D Envelope */}
          <WelcomeEnvelope
            recipientName={page.recipient_name}
            creatorName={page.creator_name}
            intro={page.intro}
            theme={theme}
            isOpen={isEnvelopeOpen}
            onOpen={() => setIsEnvelopeOpen(true)}
            onSkip={() => setIsEnvelopeOpen(true)}
          />

          {/* SCENES 2 - 5: Revealed Content */}
          {isEnvelopeOpen && (
            <div className="space-y-16 sm:space-y-24 pb-24 animate-in fade-in duration-700">
              {/* SCENE 2: Heartfelt Personal Letter */}
              <LetterScene
                heading={page.letter_heading}
                letterText={page.letter_text}
                recipientName={page.recipient_name}
                creatorName={page.creator_name}
                relationship={page.relationship}
                birthdayDate={page.birthday_date}
                font={page.letter_font}
                animation={page.letter_animation}
                theme={theme}
              />

              {/* SCENE 3: Memory Photo Gallery */}
              {page.photos && page.photos.length > 0 && (
                <PhotoGallery
                  photos={page.photos}
                  theme={theme}
                  recipientName={page.recipient_name}
                />
              )}

              {/* SCENE 4: Interactive Birthday Cake & Candles */}
              {page.options.cake_enabled && (
                <BirthdayCake
                  candleCount={page.options.candle_count || 3}
                  recipientName={page.recipient_name}
                  theme={theme}
                />
              )}

              {/* SCENE 5: Final Surprise & Replay Experience */}
              <FinalSurprise
                options={page.options}
                recipientName={page.recipient_name}
                creatorName={page.creator_name}
                theme={theme}
                onReplay={handleReplay}
              />
            </div>
          )}
        </>
      )}

      {/* Discreet bottom footer */}
      <div className="text-center pb-8 pt-4 text-xs text-stone-500/80">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" /> on{' '}
          <Link to="/" className="font-semibold hover:text-stone-800 underline underline-offset-2">
            Heartfelt
          </Link>
        </p>
      </div>
    </div>
  );
};
