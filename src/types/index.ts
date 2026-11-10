export type ThemeId = 
  | 'romantic-pink' 
  | 'lavender-dreams' 
  | 'floral-aesthetic' 
  | 'minimal-cream' 
  | 'midnight-celebration' 
  | 'cute-scrapbook';

export type FontChoice = 'serif' | 'cursive' | 'handwriting' | 'sans';

export type LetterAnimation = 'fade' | 'typewriter' | 'slide';

export type FloatingType = 'hearts' | 'sparkles' | 'flowers' | 'stars' | 'mixed';

export interface BirthdayPhoto {
  id: string;
  page_id?: string;
  url: string; // Base64 data URL, blob URL or Supabase storage URL
  caption: string;
  sort_order: number;
  alt_text?: string;
  file_name?: string;
}

export interface BirthdayOptions {
  music_enabled: boolean;
  music_track: 'chimes' | 'musicbox' | 'lofi-piano' | 'celebration';
  music_title: string;
  confetti_enabled: boolean;
  cake_enabled: boolean;
  candle_count: number;
  floating_elements: FloatingType;
  final_surprise_text: string;
  final_surprise_subtext?: string;
  surprise_button_label?: string;
  surprise_button_link?: string;
  love_question_enabled?: boolean;
}

export interface BirthdayPage {
  id: string;
  slug: string;
  secure_edit_token: string;
  recipient_name: string;
  creator_name: string;
  relationship: string;
  birthday_date: string;
  intro: string;
  theme: ThemeId;
  letter_heading: string;
  letter_font: FontChoice;
  letter_animation: LetterAnimation;
  letter_text: string;
  photos: BirthdayPhoto[];
  options: BirthdayOptions;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  view_count?: number;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  background: string;
  cardBg: string;
  accentColor: string;
  accentSecondary: string;
  textColor: string;
  mutedTextColor: string;
  borderStyle: string;
  envelopeColor: {
    base: string;
    flap: string;
    inner: string;
    seal: string;
  };
  cakeStyle: {
    frosting: string;
    toppings: string;
    plate: string;
  };
  icon: string;
}

