import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWizard } from '../context/WizardContext';
import { storageService } from '../services/storageService';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Sparkles, 
  User, 
  Palette, 
  Camera, 
  Mail, 
  Sliders, 
  Send 
} from 'lucide-react';
import { StepPersonalDetails } from '../components/wizard/StepPersonalDetails';
import { StepThemeSelection } from '../components/wizard/StepThemeSelection';
import { StepCustomPhotos } from '../components/wizard/StepCustomPhotos';
import { StepPersonalisedLetter } from '../components/wizard/StepPersonalisedLetter';
import { StepSpecialEffects } from '../components/wizard/StepSpecialEffects';
import { StepPreviewAndPublish } from '../components/wizard/StepPreviewAndPublish';

export const WizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const { 
    currentStep, 
    setCurrentStep, 
    loadPageForEditing, 
    validateStep, 
    saveDraft, 
    isSaving,
    pageData 
  } = useWizard();

  useEffect(() => {
    if (editId) {
      loadPageForEditing(editId);
    }
  }, [editId]);

  const stepMeta = [
    { step: 1, title: 'Details', icon: User },
    { step: 2, title: 'Theme', icon: Palette },
    { step: 3, title: 'Photos', icon: Camera },
    { step: 4, title: 'Letter', icon: Mail },
    { step: 5, title: 'Effects', icon: Sliders },
    { step: 6, title: 'Publish', icon: Send },
  ];

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = async () => {
    await saveDraft();
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Wizard Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 shadow-2xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-rose-100/80 shadow-xs">
          <div className="grid grid-cols-6 gap-2">
            {stepMeta.map((item) => {
              const Icon = item.icon;
              const isPassed = currentStep > item.step;
              const isCurrent = currentStep === item.step;

              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => {
                    // Allow navigating to any previous step or current
                    if (item.step < currentStep || validateStep(currentStep)) {
                      setCurrentStep(item.step);
                    }
                  }}
                  className="flex flex-col items-center text-center group focus:outline-none"
                >
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-rose-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-rose-100 text-rose-600 border-2 border-rose-500 ring-4 ring-rose-50 shadow-md font-bold'
                        : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs font-semibold mt-2 hidden sm:block ${
                      isCurrent
                        ? 'text-rose-600 font-bold'
                        : isPassed
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Linear Progress Indicator */}
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-rose-100/80 shadow-md">
          {currentStep === 1 && <StepPersonalDetails />}
          {currentStep === 2 && <StepThemeSelection />}
          {currentStep === 3 && <StepCustomPhotos />}
          {currentStep === 4 && <StepPersonalisedLetter />}
          {currentStep === 5 && <StepSpecialEffects />}
          {currentStep === 6 && <StepPreviewAndPublish />}
        </div>

        {/* STICKY BOTTOM NAVIGATION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-30 glass-panel border-t border-rose-100 p-3 sm:p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 shadow-2xs transition-colors disabled:opacity-40 disabled:hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="text-xs font-semibold text-stone-500">
              Step {currentStep} of 6
            </span>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-300/40 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  // Generate shareable URL with embedded page data (#d=...) so it works
                  // even if the page hasn't been saved to IndexedDB on this device.
                  // We MUST use window.location.href (not navigate) to preserve the #hash.
                  try {
                    const url = await storageService.generateShareableUrl(pageData);
                    window.location.href = url;
                  } catch {
                    window.location.href = `${window.location.origin}/b/${pageData.slug}`;
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Final Website</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

