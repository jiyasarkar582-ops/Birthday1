import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { THEME_LIST } from '../../data/themes';
import { ThemeId } from '../../types';
import { Palette, Check, Sparkles } from 'lucide-react';

export const StepThemeSelection: React.FC = () => {
  const { pageData, updateField } = useWizard();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-rose-100 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">
          <Palette className="w-3.5 h-3.5" />
          <span>Step 2</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Choose a Visual Aesthetic
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          Select a luxury color palette and ambiance that best matches their personality and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {THEME_LIST.map((theme) => {
          const isSelected = pageData.theme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => updateField('theme', theme.id as ThemeId)}
              className={`relative p-5 rounded-3xl cursor-pointer transition-all duration-300 border-2 select-none group flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-rose-500 shadow-xl shadow-rose-200/50 bg-white ring-4 ring-rose-100'
                  : 'border-stone-200 hover:border-stone-300 bg-white/70 hover:bg-white shadow-xs hover:shadow-md'
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Select ${theme.name} theme`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  updateField('theme', theme.id as ThemeId);
                }
              }}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-in zoom-in-75">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Theme Header */}
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl filter drop-shadow-xs">{theme.icon}</span>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {theme.name}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed min-h-[36px]">
                  {theme.tagline}
                </p>
              </div>

              {/* Theme Mini Palette Swatch */}
              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.accentColor }}
                    title="Accent color"
                  />
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.envelopeColor.base }}
                    title="Envelope base"
                  />
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.envelopeColor.seal }}
                    title="Wax seal"
                  />
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.cakeStyle.frosting }}
                    title="Cake frosting"
                  />
                </div>

                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                  style={{
                    backgroundColor: `${theme.accentColor}15`,
                    color: theme.accentColor,
                  }}
                >
                  {theme.id.split('-')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

