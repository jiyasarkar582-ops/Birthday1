import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Gift, 
  ArrowRight, 
  Camera, 
  Mail, 
  Cake, 
  Music, 
  ShieldCheck, 
  Smartphone, 
  QrCode,
  CheckCircle2,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { FloatingElements } from '../components/common/FloatingElements';
import { THEME_LIST } from '../data/themes';

export const LandingPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Personalise Details',
      desc: 'Enter their name, your relationship, and choose from 6 hand-designed luxury visual aesthetics.',
      icon: Sparkles,
      color: 'bg-rose-100 text-rose-600',
    },
    {
      step: '02',
      title: 'Add Memories & Letter',
      desc: 'Upload cherished photographs, write custom captions, and craft a heartfelt birthday message.',
      icon: Camera,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      step: '03',
      title: 'Publish & Surprise',
      desc: 'Generate a unique private web link and QR code to share via WhatsApp, Instagram, or in person.',
      icon: Gift,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  const features = [
    {
      title: '3D Wax Seal Envelope',
      desc: 'An authentic interactive envelope that breaks its seal and slides open upon touch.',
      icon: Mail,
    },
    {
      title: 'Polaroid Memory Scrapbook',
      desc: 'Your actual photos arranged with washi tape accents and expandable lightbox viewing.',
      icon: Camera,
    },
    {
      title: 'Candle Blowing Experience',
      desc: 'Interactive cake candles that recipients blow out to unleash fireworks and confetti.',
      icon: Cake,
    },
    {
      title: 'Soothing Birthday Melody',
      desc: 'Sweet music-box background tunes that recipients can opt-in to play with one tap.',
      icon: Music,
    },
    {
      title: 'Instant QR Code Card',
      desc: 'Downloadable high-resolution QR codes to print on gift cards or greeting tags.',
      icon: QrCode,
    },
    {
      title: 'Mobile-First Delight',
      desc: 'Flawlessly optimized for iPhones, Android smartphones, tablets, and laptops.',
      icon: Smartphone,
    },
  ];

  const faqs = [
    {
      q: 'Will my uploaded photos remain private?',
      a: 'Yes. Only people with your unique generated website link or QR code can access the celebration. We do not publish your links to public directories.',
    },
    {
      q: 'Does it work smoothly on smartphones?',
      a: 'Absolutely! Heartfelt is designed mobile-first. The envelope opening, candle blowing, photo lightbox, and letters are touch-optimized for all screen sizes from 360px up.',
    },
    {
      q: 'Does the music autoplay automatically?',
      a: 'No. In adherence to modern audio best practices, background music never autoplays. A sweet, non-intrusive floating music pill lets the recipient press play whenever they wish.',
    },
    {
      q: 'Can I edit the page after sharing it?',
      a: 'Yes. You can edit your created pages anytime from your Dashboard, add more photos, update the letter, and your existing link will automatically reflect the changes!',
    },
  ];

  return (
    <div className="relative min-h-screen bg-stone-50 overflow-hidden">
      {/* Floating Ambient Particles */}
      <FloatingElements type="mixed" count={12} />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle decorative glowing backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-gradient-to-tr from-rose-200/40 via-pink-200/30 to-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Small Highlight Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-rose-200 shadow-sm mb-6 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs sm:text-sm font-semibold text-stone-700">
            A meaningful way to say Happy Birthday
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span className="text-xs text-rose-600 font-bold">100% Free</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Make their birthday{' '}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600">
              unforgettable.
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-rose-200/60 -rotate-1 rounded-full -z-1" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Create a personalized birthday surprise website in 3 minutes. Complete with an interactive 3D envelope, personal letter, memory scrapbook, and blowable cake candles.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 shadow-xl shadow-rose-300/50 hover:shadow-2xl hover:shadow-rose-400/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-rose-200"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Create a Birthday Surprise</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/b/abhi-celebration"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-stone-800 bg-white/90 hover:bg-white border border-stone-200 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Gift className="w-5 h-5 text-rose-500" />
            <span>See Live Recipient Demo</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-stone-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No sign-up required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Interactive candles & confetti</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Printable QR codes</span>
          </div>
        </div>

        {/* HERO VISUAL MOCKUP PREVIEW */}
        <div className="mt-16 sm:mt-20 relative max-w-4xl mx-auto rounded-3xl p-3 sm:p-5 bg-white/80 backdrop-blur-xl border border-rose-200/80 shadow-2xl shadow-rose-200/40">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6 sm:p-12 border border-rose-100 flex flex-col items-center">
            {/* Visual Mini Envelope Representation */}
            <div className="relative w-64 sm:w-80 h-44 sm:h-52 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-300 shadow-xl flex items-center justify-center border border-white/40">
              <div className="wax-seal w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center font-serif text-lg font-bold shadow-lg">
                ❤
              </div>
              <div className="absolute bottom-3 text-center text-white text-xs font-semibold drop-shadow-sm">
                Tap to Open Surprise
              </div>
            </div>

            <p className="mt-6 font-serif text-xl sm:text-2xl font-bold text-stone-800">
              "For Dearest Sophia..."
            </p>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md">
              The recipient taps the wax seal, and the envelope reveals a personal letter, photo memory wall, cake candles, and confetti.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section className="py-20 bg-white border-y border-rose-100/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">
              Simple 3-Step Studio
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Ready in under 3 minutes
            </h3>
            <p className="text-stone-500 text-sm sm:text-base mt-3">
              We guide you every step of the way, from choosing a design theme to writing inspiring birthday wishes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-8 rounded-3xl bg-stone-50/70 border border-stone-200/80 hover:border-rose-200 hover:bg-white shadow-xs hover:shadow-lg transition-all duration-300 group"
                >
                  <span className="font-serif font-black text-4xl text-rose-200 group-hover:text-rose-400 transition-colors">
                    {item.step}
                  </span>

                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mt-4 mb-4 shadow-xs`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h4 className="font-serif text-xl font-bold text-stone-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE EXPERIENCE FEATURES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">
            The Recipient Experience
          </h2>
          <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Designed to touch their heart
          </h3>
          <p className="text-stone-500 text-sm sm:text-base mt-3">
            Every screen is thoughtfully crafted with micro-interactions, warm aesthetics, and emotional delight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1.5">
                  {feat.title}
                </h4>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* THEMES SHOWCASE */}
      <section className="py-16 bg-gradient-to-b from-stone-100/80 to-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">
            Visual Aesthetics
          </h2>
          <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-10">
            6 Custom Luxury Themes
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {THEME_LIST.map((theme) => (
              <div
                key={theme.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col items-center text-center"
              >
                <span className="text-3xl mb-2">{theme.icon}</span>
                <h5 className="font-serif text-sm font-bold text-stone-900">
                  {theme.name}
                </h5>
                <div className="flex gap-1 mt-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.envelopeColor.base }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">
            Got Questions?
          </h2>
          <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs"
            >
              <h4 className="font-serif text-lg font-bold text-stone-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-2xl shadow-rose-300/40 relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center">
              <Gift className="w-7 h-7 text-white" />
            </div>

            <h3 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Start crafting their surprise today.
            </h3>

            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              No account required. In just 3 minutes, you will have a beautiful, emotional birthday website ready to gift.
            </p>

            <div className="pt-2">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base sm:text-lg font-bold text-rose-600 bg-white hover:bg-rose-50 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Heart className="w-5 h-5 fill-rose-600" />
                <span>Create a Birthday Surprise</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

