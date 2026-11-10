import React, { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { LETTER_PROMPTS } from '../../data/prompts';
import { FontChoice, LetterAnimation } from '../../types';
import { Mail, Sparkles, BookOpen, AlertCircle, Type, Play } from 'lucide-react';

export const StepPersonalisedLetter: React.FC = () => {
  const { pageData, updateField, stepErrors } = useWizard();
  const [showPrompts, setShowPrompts] = useState(false);

  const fonts: { id: FontChoice; label: string; preview: string; sampleClass: string }[] = [
    { id: 'serif', label: 'Classic Serif', preview: 'Playfair Display', sampleClass: 'font-serif' },
    { id: 'cursive', label: 'Romantic Cursive', preview: 'Dancing Script', sampleClass: 'font-cursive text-xl' },
    { id: 'handwriting', label: 'Handwritten Note', preview: 'Caveat', sampleClass: 'font-handwriting text-xl' },
    { id: 'sans', label: 'Clean Modern', preview: 'Plus Jakarta Sans', sampleClass: 'font-sans' },
  ];

  const animations: { id: LetterAnimation; label: string; desc: string }[] = [
    { id: 'typewriter', label: 'Typewriter Animation', desc: 'Letters reveal character by character' },
    { id: 'fade', label: 'Smooth Fade In', desc: 'Gentle, romantic emotional unfold' },
  ];

  const applyPrompt = (prompt: { heading: string; text: string }) => {
    updateField('letter_heading', prompt.heading);
    updateField('letter_text', prompt.text);
    setShowPrompts(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-rose-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Step 4</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Write Your Birthday Letter
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            The heart of your surprise. Express your love, cherished memories, and warm wishes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPrompts(!showPrompts)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors w-fit shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{showPrompts ? 'Hide Inspiration' : 'Need Inspiration?'}</span>
        </button>
      </div>

      {/* Suggested Prompts Accordion */}
      {showPrompts && (
        <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200/80 space-y-4 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Heartfelt Message Ideas (Click to Apply)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LETTER_PROMPTS.map((prompt, i) => (
              <div
                key={i}
                onClick={() => applyPrompt(prompt)}
                className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                    {prompt.category}
                  </span>
                  <span className="text-xs text-stone-400 group-hover:text-rose-600 font-semibold">
                    Use this →
                  </span>
                </div>
                <h5 className="font-serif font-bold text-stone-800 text-sm mb-1">
                  {prompt.heading}
                </h5>
                <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                  {prompt.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heading Input */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-rose-500" />
          Letter Heading / Salutation
        </label>
        <input
          type="text"
          value={pageData.letter_heading}
          onChange={(e) => updateField('letter_heading', e.target.value)}
          placeholder="e.g. To the love of my life, Happy Birthday Beautiful Soul!"
          className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 shadow-xs text-stone-900 font-serif font-bold text-lg sm:text-xl transition-all"
        />
      </div>

      {/* Font & Animation Choosers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Font Chooser */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Typography Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map((f) => {
              const isSelected = pageData.letter_font === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateField('letter_font', f.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-2 ring-rose-200'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="text-[11px] font-bold text-stone-500 uppercase">{f.label}</p>
                  <p className={`mt-1 text-stone-900 truncate ${f.sampleClass}`}>
                    Happy Birthday
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animation Chooser */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Letter Reveal Animation
          </label>
          <div className="grid grid-cols-2 gap-2">
            {animations.map((a) => {
              const isSelected = pageData.letter_animation === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => updateField('letter_animation', a.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-2 ring-rose-200'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="text-xs font-bold text-stone-800">{a.label}</p>
                  <p className="text-[10px] text-stone-500 mt-1">{a.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Letter Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Your Personal Birthday Letter *
          </label>
          <span className="text-xs text-stone-400">
            {pageData.letter_text.length} characters
          </span>
        </div>
        <textarea
          rows={9}
          value={pageData.letter_text}
          onChange={(e) => updateField('letter_text', e.target.value)}
          placeholder="Pour your heart out here..."
          className={`w-full p-4 rounded-2xl bg-white border ${
            stepErrors.letter_text
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
          } shadow-xs text-stone-900 transition-all text-base leading-relaxed resize-y`}
        />
        {stepErrors.letter_text && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{stepErrors.letter_text}</span>
          </p>
        )}
      </div>
    </div>
  );
};

