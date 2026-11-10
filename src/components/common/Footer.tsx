import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Sparkles, Shield, Gift } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();

  // Omit footer on public recipient page /b/:slug to maintain full immersive enchantment!
  if (location.pathname.startsWith('/b/')) {
    return null;
  }

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-900/30">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Heartfelt
              </span>
            </Link>
            <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
              Craft unforgettable, emotional birthday surprise websites for your loved ones. Personalize with animated envelopes, personal letters, memory galleries, and interactive birthday cakes.
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-300/80 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2 w-fit">
              <Shield className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Private & secure: only people with your unique link can open the celebration.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 font-sans">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-rose-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-rose-400 transition-colors">
                  Create a Surprise
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-rose-400 transition-colors">
                  My Celebrations
                </Link>
              </li>
              <li>
                <Link to="/b/abhi-celebration" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-rose-400" />
                  <span>Interactive Demo</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Themes Showcase */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 font-sans">
              Themes Available
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>🌹 Romantic Pink</li>
              <li>💜 Lavender Dreams</li>
              <li>🌸 Floral Aesthetic</li>
              <li>✨ Minimal Cream</li>
              <li>🌙 Midnight Celebration</li>
              <li>🧸 Cute Scrapbook</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" /> for the people who matter most.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 100% Mobile Optimized
            </span>
            <span>•</span>
            <span>No Account Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

