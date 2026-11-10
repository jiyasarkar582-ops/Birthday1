import React, { createContext, useContext, useState, useEffect } from 'react';
import { BirthdayPage, BirthdayPhoto, ThemeId, FontChoice, LetterAnimation, FloatingType } from '../types';
import { storageService, generateSlug, generateToken, getCreatorToken } from '../services/storageService';
import { THEMES } from '../data/themes';

interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  pageData: BirthdayPage;
  updateField: <K extends keyof BirthdayPage>(field: K, value: BirthdayPage[K]) => void;
  updateOptions: (newOptions: Partial<BirthdayPage['options']>) => void;
  addPhotos: (files: File[]) => Promise<void>;
  updatePhotoCaption: (photoId: string, caption: string) => void;
  removePhoto: (photoId: string) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  isSaving: boolean;
  saveDraft: () => Promise<BirthdayPage>;
  publishPage: () => Promise<BirthdayPage>;
  publishedSlug: string | null;
  loadPageForEditing: (pageId: string) => Promise<boolean>;
  resetWizard: () => void;
  stepErrors: Record<string, string>;
  validateStep: (step: number) => boolean;
}

const initialPageData: BirthdayPage = {
  id: '',
  slug: '',
  secure_edit_token: '',
  recipient_name: 'Abhiiii',
  creator_name: '',
  relationship: 'Soulmate',
  birthday_date: '',
  intro: 'A special surprise prepared with all my love for someone truly extraordinary ✨',
  theme: 'romantic-pink',
  letter_heading: 'Happy Birthday, Abhiiii ❤️',
  letter_font: 'cursive',
  letter_animation: 'typewriter',
  letter_text: `My dearest Abhiiii ❤️,

Happy Birthday to the most special person in my universe!

Every single moment with you is filled with smiles, warmth, and butterflies. You bring so much light and joy into my life, and I am so grateful to celebrate another wonderful year of you.

May all your dreams come true, may you achieve everything you desire, and may this year bring you endless love, happiness, and peace.

Always and forever yours with all my heart!
Love you loads! 🥰🎂✨`,
  photos: [],
  options: {
    music_enabled: true,
    music_track: 'chimes',
    music_title: 'Dreamy Music Box',
    confetti_enabled: true,
    cake_enabled: true,
    candle_count: 3,
    floating_elements: 'hearts',
    final_surprise_text: 'I love you so so much Abhiiii! Happy Birthday! ❤️🎂✨',
    final_surprise_subtext: 'You mean the absolute world to me! Make a wish right now 🌟',
    surprise_button_label: 'Send a Big Birthday Hug 🤗',
    love_question_enabled: true,
  },
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pageData, setPageData] = useState<BirthdayPage>(() => {
    // Check if there is an unsaved draft in localStorage
    try {
      const savedDraft = localStorage.getItem('heartfelt_wizard_draft');
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch {}

    const id = crypto.randomUUID ? crypto.randomUUID() : 'page_' + Math.random().toString(36).substring(2, 9);
    return {
      ...initialPageData,
      id,
      slug: generateSlug('special-someone'),
      secure_edit_token: generateToken(),
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // Auto-save draft on data changes
  useEffect(() => {
    try {
      localStorage.setItem('heartfelt_wizard_draft', JSON.stringify(pageData));
    } catch {}
  }, [pageData]);

  const updateField = <K extends keyof BirthdayPage>(field: K, value: BirthdayPage[K]) => {
    setPageData((prev) => {
      const updated = { ...prev, [field]: value };
      // If recipient name changes and slug is still based on default or empty, update slug
      if (field === 'recipient_name' && typeof value === 'string' && value.trim()) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const updateOptions = (newOptions: Partial<BirthdayPage['options']>) => {
    setPageData((prev) => ({
      ...prev,
      options: { ...prev.options, ...newOptions },
    }));
  };

  // Convert uploaded image file to high-quality base64 Data URL or compressed blob
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Optionally resize very large images (>2MB) to prevent browser memory spikes
        if (file.size > 2 * 1024 * 1024) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const maxDim = 1600;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          };
          img.onerror = () => resolve(result);
          img.src = result;
        } else {
          resolve(result);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addPhotos = async (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    const newPhotos: BirthdayPhoto[] = [];

    for (const file of validFiles) {
      try {
        const url = await fileToDataUrl(file);
        newPhotos.push({
          id: 'photo_' + Math.random().toString(36).substring(2, 9),
          page_id: pageData.id,
          url,
          caption: '',
          sort_order: pageData.photos.length + newPhotos.length,
          file_name: file.name,
        });
      } catch (err) {
        console.error('Error processing image upload', err);
      }
    }

    setPageData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const updatePhotoCaption = (photoId: string, caption: string) => {
    setPageData(prev => ({
      ...prev,
      photos: prev.photos.map(p => p.id === photoId ? { ...p, caption } : p),
    }));
  };

  const removePhoto = (photoId: string) => {
    setPageData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId).map((p, idx) => ({ ...p, sort_order: idx })),
    }));
  };

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    setPageData(prev => {
      const copy = [...prev.photos];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return {
        ...prev,
        photos: copy.map((p, idx) => ({ ...p, sort_order: idx })),
      };
    });
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!pageData.recipient_name.trim()) {
        errors.recipient_name = "Please enter the birthday person's name";
      }
      if (!pageData.creator_name.trim()) {
        errors.creator_name = 'Please enter your name';
      }
    } else if (step === 4) {
      if (!pageData.letter_text.trim()) {
        errors.letter_text = 'Please write a heartfelt birthday letter';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveDraft = async (): Promise<BirthdayPage> => {
    setIsSaving(true);
    try {
      const saved = await storageService.savePage({
        ...pageData,
        status: 'draft',
      });
      setPageData(saved);
      return saved;
    } finally {
      setIsSaving(false);
    }
  };

  const publishPage = async (): Promise<BirthdayPage> => {
    setIsSaving(true);
    try {
      // Ensure slug is clean
      const slug = pageData.slug || generateSlug(pageData.recipient_name || 'surprise');
      const pageToPublish: BirthdayPage = {
        ...pageData,
        slug,
        status: 'published',
      };

      const published = await storageService.savePage(pageToPublish);
      setPageData(published);
      setPublishedSlug(published.slug);
      // Clean temporary draft
      try {
        localStorage.removeItem('heartfelt_wizard_draft');
      } catch {}

      return published;
    } finally {
      setIsSaving(false);
    }
  };

  const loadPageForEditing = async (pageId: string): Promise<boolean> => {
    const existing = await storageService.getPageById(pageId);
    if (existing) {
      setPageData(existing);
      return true;
    }
    return false;
  };

  const resetWizard = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : 'page_' + Math.random().toString(36).substring(2, 9);
    const fresh: BirthdayPage = {
      ...initialPageData,
      id,
      slug: generateSlug('special-someone'),
      secure_edit_token: generateToken(),
    };
    setPageData(fresh);
    setCurrentStep(1);
    setPublishedSlug(null);
    setStepErrors({});
    try {
      localStorage.removeItem('heartfelt_wizard_draft');
    } catch {}
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        pageData,
        updateField,
        updateOptions,
        addPhotos,
        updatePhotoCaption,
        removePhoto,
        reorderPhotos,
        isSaving,
        saveDraft,
        publishPage,
        publishedSlug,
        loadPageForEditing,
        resetWizard,
        stepErrors,
        validateStep,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

