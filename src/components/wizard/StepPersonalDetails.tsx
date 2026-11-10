import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { RELATIONSHIPS } from '../../data/prompts';
import { User, Heart, Sparkles, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

export const StepPersonalDetails: React.FC = () => {
  const { pageData, updateField, stepErrors } = useWizard();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-rose-100 pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Who are we celebrating?
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          Tell us about the star of the day and who this special surprise is from.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Recipient Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Birthday Person's Name *
            </span>
            <span className="text-stone-400 font-normal lowercase">shown on envelope</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={pageData.recipient_name}
              onChange={(e) => updateField('recipient_name', e.target.value)}
              placeholder="e.g. Sophia, Lucas, Mom"
              className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                stepErrors.recipient_name
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
              } shadow-xs text-stone-900 placeholder:text-stone-400 transition-all text-base`}
            />
          </div>
          {stepErrors.recipient_name && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{stepErrors.recipient_name}</span>
            </p>
          )}
        </div>

        {/* Creator Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500" />
              Your Name *
            </span>
            <span className="text-stone-400 font-normal lowercase">signed with love</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={pageData.creator_name}
              onChange={(e) => updateField('creator_name', e.target.value)}
              placeholder="e.g. Alex, Emily"
              className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                stepErrors.creator_name
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
              } shadow-xs text-stone-900 placeholder:text-stone-400 transition-all text-base`}
            />
          </div>
          {stepErrors.creator_name && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{stepErrors.creator_name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Relationship Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Your Relationship
        </label>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIPS.map((rel) => {
            const isSelected = pageData.relationship === rel;
            return (
              <button
                key={rel}
                type="button"
                onClick={() => updateField('relationship', rel)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-200 hover:bg-rose-50/50'
                }`}
              >
                {rel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Birthday Date & Intro Message */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Birthday Date */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            Birthday Date (Optional)
          </label>
          <input
            type="date"
            value={pageData.birthday_date}
            onChange={(e) => updateField('birthday_date', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 shadow-xs text-stone-900 transition-all text-base"
          />
          <p className="text-xs text-stone-400">
            Helps personalize the greeting seal and milestone celebration.
          </p>
        </div>

        {/* Introductory Tagline */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
            Introductory Note
          </label>
          <input
            type="text"
            value={pageData.intro}
            onChange={(e) => updateField('intro', e.target.value)}
            placeholder="A special surprise prepared with all my love..."
            className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 shadow-xs text-stone-900 transition-all text-base"
          />
          <p className="text-xs text-stone-400">
            Displayed right above the animated envelope before it is opened.
          </p>
        </div>
      </div>
    </div>
  );
};

