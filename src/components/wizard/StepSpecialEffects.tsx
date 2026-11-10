import React, { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { MUSIC_TRACKS } from '../../data/prompts';
import { FloatingType } from '../../types';
import { audioSynthesizer } from '../../services/audioSynthesizer';
import { Sparkles, Music, Cake, Heart, Play, Pause, Gift, Wind } from 'lucide-react';

export const StepSpecialEffects: React.FC = () => {
  const { pageData, updateOptions } = useWizard();
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);

  const floatingOptions: { id: FloatingType; label: string; icon: string }[] = [
    { id: 'hearts', label: 'Floating Hearts', icon: '💖' },
    { id: 'sparkles', label: 'Magic Sparkles', icon: '✨' },
    { id: 'flowers', label: 'Spring Flowers', icon: '🌸' },
    { id: 'stars', label: 'Starlight', icon: '⭐' },
    { id: 'mixed', label: 'Celebration Mix', icon: '🎈' },
  ];

  const handleTogglePreviewMusic = (trackId: 'chimes' | 'musicbox' | 'lofi-piano' | 'celebration') => {
    if (previewTrackId === trackId) {
      audioSynthesizer.stop();
      setPreviewTrackId(null);
    } else {
      audioSynthesizer.stop();
      audioSynthesizer.playTrack(trackId);
      setPreviewTrackId(trackId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-rose-100 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 5</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Celebration Effects & Music
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          Add delightful interactive touches: candles to blow, confetti, floating particles, and optional music.
        </p>
      </div>

      {/* Playful Love Question Gate */}
      <div className="p-5 rounded-3xl bg-white border border-rose-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Playful "Do you love me?" Question
              </h4>
              <p className="text-xs text-stone-500">
                Shows "open it abhiiii ❤️" and asks "Do u love me or not" with playful options before unlocking
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pageData.options.love_question_enabled ?? true}
              onChange={(e) => updateOptions({ love_question_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>
      </div>

      {/* Floating Ambient Elements */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Floating Ambient Particles
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {floatingOptions.map((opt) => {
            const isSelected = pageData.options.floating_elements === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateOptions({ floating_elements: opt.id })}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center border transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/60 shadow-xs ring-2 ring-rose-200'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-2xl mb-1.5">{opt.icon}</span>
                <span className="text-xs font-semibold text-stone-800">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Birthday Cake Settings */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Interactive Birthday Cake</h4>
              <p className="text-xs text-stone-500">
                Lets the recipient blow out candles with realistic air smoke and confetti
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pageData.options.cake_enabled}
              onChange={(e) => updateOptions({ cake_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        {pageData.options.cake_enabled && (
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-600">
              Number of Candles
            </label>
            <div className="flex items-center gap-2">
              {[1, 3, 5, 7].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => updateOptions({ candle_count: count })}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    pageData.options.candle_count === count
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Optional Background Music Settings */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Background Birthday Music</h4>
              <p className="text-xs text-stone-500">
                Gentle melody played only after the recipient taps the music button (no autoplay)
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pageData.options.music_enabled}
              onChange={(e) => updateOptions({ music_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        {pageData.options.music_enabled && (
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Select Background Tune
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MUSIC_TRACKS.map((track) => {
                const isSelected = pageData.options.music_track === track.id;
                const isPreviewing = previewTrackId === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() =>
                      updateOptions({
                        music_track: track.id,
                        music_title: track.name,
                      })
                    }
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-2 ring-rose-200'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">{track.name}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{track.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePreviewMusic(track.id);
                      }}
                      className="p-2 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-600 transition-colors ml-2"
                      title={isPreviewing ? 'Stop music preview' : 'Listen to preview'}
                    >
                      {isPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Final Surprise Message & Optional Link */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">Final Surprise Message</h4>
            <p className="text-xs text-stone-500">
              Shown after blowing the candles as the grand finale
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={pageData.options.final_surprise_text}
            onChange={(e) => updateOptions({ final_surprise_text: e.target.value })}
            placeholder="May all your birthday wishes come true this year! 🌟"
            className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm text-stone-800"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={pageData.options.surprise_button_label || ''}
              onChange={(e) => updateOptions({ surprise_button_label: e.target.value })}
              placeholder="Button label: e.g. Open Birthday Gift"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-xs text-stone-800"
            />
            <input
              type="url"
              value={pageData.options.surprise_button_link || ''}
              onChange={(e) => updateOptions({ surprise_button_link: e.target.value })}
              placeholder="Optional URL (gift card, spotify playlist, etc.)"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-xs text-stone-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

