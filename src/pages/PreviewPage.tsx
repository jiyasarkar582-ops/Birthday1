import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { storageService, DEMO_PAGE } from '../services/storageService';
import { BirthdayPage } from '../types';
import { THEMES } from '../data/themes';
import { 
  Smartphone, 
  Monitor, 
  ArrowLeft, 
  Edit3, 
  ExternalLink, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { WelcomeEnvelope } from '../components/recipient/WelcomeEnvelope';
import { LetterScene } from '../components/recipient/LetterScene';
import { PhotoGallery } from '../components/recipient/PhotoGallery';
import { BirthdayCake } from '../components/recipient/BirthdayCake';
import { FinalSurprise } from '../components/recipient/FinalSurprise';
import { FloatingElements } from '../components/common/FloatingElements';
import { AudioPlayer } from '../components/recipient/AudioPlayer';
import { LoveQuestionGate } from '../components/recipient/LoveQuestionGate';

export const PreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<BirthdayPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [loveGatePassed, setLoveGatePassed] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      if (id) {
        const found = await storageService.getPageById(id);
        setPage(found);
      }
      setLoading(false);
    };
    fetchPage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          Celebration Not Found
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          The requested birthday page preview does not exist or may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-semibold text-sm shadow-xs hover:bg-rose-600 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const theme = THEMES[page.theme] || THEMES['romantic-pink'];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col">
      {/* Top Preview Control Bar */}
      <div className="glass-panel-dark border-b border-stone-800 px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-sm font-bold text-white truncate max-w-[180px] sm:max-w-md">
              Preview: {page.recipient_name}'s Surprise
            </h1>
            <span className="text-[10px] text-stone-400 capitalize">
              Theme: {theme.name}
            </span>
          </div>
        </div>

        {/* Viewport Toggles & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-stone-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                deviceView === 'mobile' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'
              }`}
              title="Mobile viewport"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                deviceView === 'desktop' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'
              }`}
              title="Desktop viewport"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <Link
            to={`/create?edit=${page.id}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          <Link
            to={`/b/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live URL</span>
          </Link>
        </div>
      </div>

      {/* Frame Preview Container */}
      <div className="flex-1 flex justify-center items-start p-4 sm:p-8 overflow-y-auto">
        <div
          className={`transition-all duration-300 shadow-2xl relative overflow-hidden rounded-3xl ${
            deviceView === 'mobile'
              ? 'w-[375px] sm:w-[414px] border-[10px] border-stone-800 bg-white rounded-[40px] my-4 shadow-rose-950/50'
              : 'w-full max-w-5xl border border-stone-800 bg-white'
          }`}
        >
          {/* Mobile top notch */}
          {deviceView === 'mobile' && (
            <div className="sticky top-0 z-50 flex justify-center w-full py-1 bg-stone-800/10 backdrop-blur-xs">
              <div className="w-28 h-4 bg-stone-800 rounded-b-xl" />
            </div>
          )}

          {/* Actual Recipient Content */}
          <div className={`min-h-[800px] ${theme.background} pb-20 relative select-none text-stone-900`}>
            <AudioPlayer options={page.options} accentColor={theme.accentColor} />
            <FloatingElements type={page.options.floating_elements} count={14} />

            {(page.options.love_question_enabled ?? true) && !loveGatePassed ? (
              <div className="py-12 flex justify-center">
                <LoveQuestionGate
                  recipientName={page.recipient_name}
                  theme={theme}
                  onUnlocked={() => setLoveGatePassed(true)}
                />
              </div>
            ) : (
              <>
                <WelcomeEnvelope
                  recipientName={page.recipient_name}
                  creatorName={page.creator_name}
                  intro={page.intro}
                  theme={theme}
                  isOpen={isEnvelopeOpen}
                  onOpen={() => setIsEnvelopeOpen(true)}
                  onSkip={() => setIsEnvelopeOpen(true)}
                />

                {isEnvelopeOpen && (
                  <div className="space-y-16 animate-in fade-in duration-500">
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

                    {page.photos && page.photos.length > 0 && (
                      <PhotoGallery
                        photos={page.photos}
                        theme={theme}
                        recipientName={page.recipient_name}
                      />
                    )}

                    {page.options.cake_enabled && (
                      <BirthdayCake
                        candleCount={page.options.candle_count}
                        recipientName={page.recipient_name}
                        theme={theme}
                      />
                    )}

                    <FinalSurprise
                      options={page.options}
                      recipientName={page.recipient_name}
                      creatorName={page.creator_name}
                      theme={theme}
                      onReplay={() => {
                        setIsEnvelopeOpen(false);
                        setLoveGatePassed(false);
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

