import React, { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { THEMES } from '../../data/themes';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Smartphone, 
  Monitor, 
  Send, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Heart,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { WelcomeEnvelope } from '../recipient/WelcomeEnvelope';
import { LetterScene } from '../recipient/LetterScene';
import { PhotoGallery } from '../recipient/PhotoGallery';
import { BirthdayCake } from '../recipient/BirthdayCake';
import { FinalSurprise } from '../recipient/FinalSurprise';
import { FloatingElements } from '../common/FloatingElements';
import { LoveQuestionGate } from '../recipient/LoveQuestionGate';

export const StepPreviewAndPublish: React.FC = () => {
  const { pageData, publishPage, isSaving, publishedSlug } = useWizard();
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [copied, setCopied] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(!!publishedSlug);
  const [loveGatePassed, setLoveGatePassed] = useState(false);
  const [previewEnvelopeOpen, setPreviewEnvelopeOpen] = useState(false);

  const theme = THEMES[pageData.theme] || THEMES['romantic-pink'];
  const publicUrl = `${window.location.origin}/b/${publishedSlug || pageData.slug}`;

  const handlePublish = async () => {
    try {
      await publishPage();
      setPublishSuccess(true);
    } catch (e) {
      console.error('Failed to publish', e);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = `Hey ${pageData.recipient_name}! I made a special birthday surprise website for you 🎉 Open it here: ${publicUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Download QR code SVG as PNG
  const downloadQRCode = () => {
    const svg = document.getElementById('published-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx?.drawImage(img, 0, 0, 400, 400);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Heartfelt-Birthday-${pageData.recipient_name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-rose-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">
            <Send className="w-3.5 h-3.5" />
            <span>Step 6</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Preview & Publish Surprise
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Test the experience exactly as {pageData.recipient_name || 'they'} will see it, then launch your website.
          </p>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deviceView === 'mobile'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deviceView === 'desktop'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* PUBLISHED SUCCESS CARD */}
      {publishSuccess && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-pink-50 border-2 border-rose-300 shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-300/50">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Surprise Website is Live! 🎉
              </h3>
              <p className="text-stone-600 text-sm">
                Your personalized birthday website for <strong>{pageData.recipient_name}</strong> is ready to share.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Share Link Column */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Unique Birthday Website Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm font-medium text-stone-800 select-all"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-rose-200 transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Instant Share Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>

                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Website</span>
                </a>
              </div>
            </div>

            {/* QR Code Column */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-rose-100 shadow-xs">
              <div className="p-2 bg-white rounded-xl shadow-xs">
                <QRCodeSVG
                  id="published-qr-code"
                  value={publicUrl}
                  size={130}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button
                type="button"
                onClick={downloadQRCode}
                className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Action CTA (if not yet published) */}
      {!publishSuccess && (
        <div className="p-5 rounded-3xl bg-white border border-rose-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Ready to surprise them?</h4>
              <p className="text-xs text-stone-500">
                Click publish to generate the unique link and printable QR code.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handlePublish}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-300/50 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-rose-200"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{isSaving ? 'Publishing Surprise...' : 'Publish Birthday Website'}</span>
          </button>
        </div>
      )}

      {/* LIVE INTERACTIVE PREVIEW FRAME */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <span>Live Interactive Preview</span>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {theme.name}
            </span>
          </h4>
          <span className="text-xs text-stone-400">
            Interactive — click the envelope below to test!
          </span>
        </div>

        {/* Frame container */}
        <div className="w-full flex justify-center py-4 bg-stone-100/80 rounded-3xl border border-stone-200/80 overflow-hidden">
          <div
            className={`transition-all duration-300 shadow-2xl overflow-y-auto max-h-[750px] relative rounded-3xl ${
              deviceView === 'mobile'
                ? 'w-[360px] sm:w-[390px] border-[8px] border-stone-800 bg-white rounded-[36px]'
                : 'w-full max-w-4xl border-[4px] border-stone-700 bg-white'
            }`}
          >
            {/* Mobile speaker notch */}
            {deviceView === 'mobile' && (
              <div className="sticky top-0 z-30 flex justify-center w-full py-1 bg-transparent">
                <div className="w-24 h-4 bg-stone-800 rounded-b-xl" />
              </div>
            )}

            {/* Recipient Experience Container inside preview */}
            <div className={`min-h-[600px] ${theme.background} pb-16`}>
              <FloatingElements type={pageData.options.floating_elements} count={10} />

              {(pageData.options.love_question_enabled ?? true) && !loveGatePassed ? (
                <div className="py-8 flex justify-center">
                  <LoveQuestionGate
                    recipientName={pageData.recipient_name || 'Abhiiii'}
                    theme={theme}
                    onUnlocked={() => setLoveGatePassed(true)}
                  />
                </div>
              ) : (
                <>
                  <WelcomeEnvelope
                    recipientName={pageData.recipient_name || 'Abhiiii'}
                    creatorName={pageData.creator_name || 'Your Name'}
                    intro={pageData.intro}
                    theme={theme}
                    isOpen={previewEnvelopeOpen}
                    onOpen={() => setPreviewEnvelopeOpen(true)}
                  />

                  {previewEnvelopeOpen && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <LetterScene
                        heading={pageData.letter_heading}
                        letterText={pageData.letter_text}
                        recipientName={pageData.recipient_name || 'Abhiiii'}
                        creatorName={pageData.creator_name || 'Your Name'}
                        relationship={pageData.relationship}
                        birthdayDate={pageData.birthday_date}
                        font={pageData.letter_font}
                        animation="fade"
                        theme={theme}
                      />

                      {pageData.photos.length > 0 && (
                        <PhotoGallery
                          photos={pageData.photos}
                          theme={theme}
                          recipientName={pageData.recipient_name || 'Abhiiii'}
                        />
                      )}

                      {pageData.options.cake_enabled && (
                        <BirthdayCake
                          candleCount={pageData.options.candle_count}
                          recipientName={pageData.recipient_name || 'Abhiiii'}
                          theme={theme}
                        />
                      )}

                      <FinalSurprise
                        options={pageData.options}
                        recipientName={pageData.recipient_name || 'Abhiiii'}
                        creatorName={pageData.creator_name || 'Your Name'}
                        theme={theme}
                        onReplay={() => {
                          setPreviewEnvelopeOpen(false);
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
    </div>
  );
};

