import { BirthdayPage, BirthdayPhoto } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const DB_NAME = 'HeartfeltDB';
const DB_VERSION = 1;
const STORE_PAGES = 'pages';
const STORE_PHOTOS = 'photos';

// Open IndexedDB database for persistent local storage
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PAGES)) {
        const pagesStore = db.createObjectStore(STORE_PAGES, { keyPath: 'id' });
        pagesStore.createIndex('slug', 'slug', { unique: true });
        pagesStore.createIndex('status', 'status', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        const photosStore = db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
        photosStore.createIndex('page_id', 'page_id', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generate unique readable slug
export function generateSlug(recipientName: string): string {
  const cleanName = recipientName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'special-someone';
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanName}-${randomSuffix}`;
}

// Generate secure edit token
export function generateToken(): string {
  return 'token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Save creator's owned pages list in localStorage
const CREATOR_PAGES_KEY = 'heartfelt_created_pages';
export function rememberCreatedPage(id: string, token: string) {
  try {
    const list = JSON.parse(localStorage.getItem(CREATOR_PAGES_KEY) || '{}');
    list[id] = token;
    localStorage.setItem(CREATOR_PAGES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to store creator page token', e);
  }
}

export function getCreatorToken(id: string): string | null {
  try {
    const list = JSON.parse(localStorage.getItem(CREATOR_PAGES_KEY) || '{}');
    return list[id] || null;
  } catch {
    return null;
  }
}

export function getCreatorPageIds(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(CREATOR_PAGES_KEY) || '{}');
    return Object.keys(list);
  } catch {
    return [];
  }
}

// Curated demo photos for preview/demo experience
export const DEMO_PHOTOS: BirthdayPhoto[] = [
  {
    id: 'demo-1',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    caption: 'That unforgettable sunset evening by the beach 🌅',
    sort_order: 0,
    alt_text: 'Smiling friend at sunset'
  },
  {
    id: 'demo-2',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    caption: 'Coffee dates and endless laughter ☕✨',
    sort_order: 1,
    alt_text: 'Coffee laughter'
  },
  {
    id: 'demo-3',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    caption: 'Celebrating life and spontaneous adventures 🌸',
    sort_order: 2,
    alt_text: 'Celebration smile'
  },
  {
    id: 'demo-4',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80',
    caption: 'Here is to another year of you shining bright! 🎂',
    sort_order: 3,
    alt_text: 'Birthday joy'
  }
];

export const ABHI_DEMO_PAGE: BirthdayPage = {
  id: 'demo-surprise-abhi',
  slug: 'abhi-celebration',
  secure_edit_token: 'demo-token-abhi',
  recipient_name: 'Abhiiii',
  creator_name: 'Your Favorite Person',
  relationship: 'Soulmate',
  birthday_date: '2026-11-10',
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
  photos: DEMO_PHOTOS,
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
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  view_count: 100,
};

export const DEMO_PAGE: BirthdayPage = ABHI_DEMO_PAGE;

// Unified Storage Service Implementation
export const storageService = {
  // Save or update page
  async savePage(page: BirthdayPage): Promise<BirthdayPage> {
    const updatedPage: BirthdayPage = {
      ...page,
      updated_at: new Date().toISOString(),
    };

    // If Supabase is configured, save there
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: pageError } = await supabase
          .from('birthday_pages')
          .upsert({
            id: updatedPage.id,
            slug: updatedPage.slug,
            secure_edit_token_hash: updatedPage.secure_edit_token,
            recipient_name: updatedPage.recipient_name,
            creator_name: updatedPage.creator_name,
            relationship: updatedPage.relationship,
            birthday_date: updatedPage.birthday_date || null,
            intro: updatedPage.intro,
            theme: updatedPage.theme,
            letter_heading: updatedPage.letter_heading,
            letter_font: updatedPage.letter_font,
            letter_animation: updatedPage.letter_animation,
            letter_text: updatedPage.letter_text,
            status: updatedPage.status,
            updated_at: updatedPage.updated_at,
          });

        if (pageError) throw pageError;

        // Upsert options
        const { error: optError } = await supabase
          .from('birthday_options')
          .upsert({
            page_id: updatedPage.id,
            music_track: updatedPage.options.music_track,
            music_title: updatedPage.options.music_title,
            music_enabled: updatedPage.options.music_enabled,
            confetti_enabled: updatedPage.options.confetti_enabled,
            cake_enabled: updatedPage.options.cake_enabled,
            candle_count: updatedPage.options.candle_count,
            floating_elements: updatedPage.options.floating_elements,
            final_surprise_text: updatedPage.options.final_surprise_text,
            final_surprise_subtext: updatedPage.options.final_surprise_subtext,
            surprise_button_label: updatedPage.options.surprise_button_label,
            surprise_button_link: updatedPage.options.surprise_button_link,
          });

        if (optError) throw optError;

        // Sync photos
        if (updatedPage.photos && updatedPage.photos.length > 0) {
          await supabase
            .from('birthday_photos')
            .delete()
            .eq('page_id', updatedPage.id);

          const photosData = updatedPage.photos.map((p, index) => ({
            id: p.id,
            page_id: updatedPage.id,
            storage_path: p.url,
            caption: p.caption,
            sort_order: p.sort_order ?? index,
            alt_text: p.alt_text || '',
          }));

          await supabase.from('birthday_photos').insert(photosData);
        }
      } catch (err) {
        console.warn('Supabase save error, persisting to IndexedDB fallback:', err);
      }
    }

    // Always persist to IndexedDB for high resilience & offline guarantee
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORE_PAGES, STORE_PHOTOS], 'readwrite');
        const pagesStore = tx.objectStore(STORE_PAGES);
        const photosStore = tx.objectStore(STORE_PHOTOS);

        pagesStore.put(updatedPage);

        // Store photos
        if (updatedPage.photos) {
          updatedPage.photos.forEach(photo => {
            photosStore.put({ ...photo, page_id: updatedPage.id });
          });
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('IndexedDB write error, falling back to localStorage:', e);
      try {
        localStorage.setItem(`heartfelt_page_${updatedPage.id}`, JSON.stringify(updatedPage));
        localStorage.setItem(`heartfelt_slug_${updatedPage.slug}`, updatedPage.id);
      } catch (lsErr) {
        console.error('LocalStorage error', lsErr);
      }
    }

    // Track ownership
    rememberCreatedPage(updatedPage.id, updatedPage.secure_edit_token);

    return updatedPage;
  },

  // Get page by unique public slug
  async getPageBySlug(slug: string): Promise<BirthdayPage | null> {
    if (slug === 'abhi-celebration' || slug === 'sophia-celebration' || slug === DEMO_PAGE.slug) {
      return ABHI_DEMO_PAGE;
    }

    // Check Supabase first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: pageData, error } = await supabase
          .from('birthday_pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (pageData && !error) {
          const { data: photosData } = await supabase
            .from('birthday_photos')
            .select('*')
            .eq('page_id', pageData.id)
            .order('sort_order', { ascending: true });

          const { data: optionsData } = await supabase
            .from('birthday_options')
            .select('*')
            .eq('page_id', pageData.id)
            .single();

          return {
            id: pageData.id,
            slug: pageData.slug,
            secure_edit_token: pageData.secure_edit_token_hash,
            recipient_name: pageData.recipient_name,
            creator_name: pageData.creator_name,
            relationship: pageData.relationship,
            birthday_date: pageData.birthday_date,
            intro: pageData.intro,
            theme: pageData.theme,
            letter_heading: pageData.letter_heading,
            letter_font: pageData.letter_font,
            letter_animation: pageData.letter_animation,
            letter_text: pageData.letter_text,
            status: pageData.status,
            view_count: (pageData.view_count || 0) + 1,
            created_at: pageData.created_at,
            updated_at: pageData.updated_at,
            photos: (photosData || []).map(p => ({
              id: p.id,
              page_id: p.page_id,
              url: p.storage_path,
              caption: p.caption,
              sort_order: p.sort_order,
              alt_text: p.alt_text,
            })),
            options: optionsData || {
              music_enabled: true,
              music_track: 'chimes',
              music_title: 'Dreamy Music Box',
              confetti_enabled: true,
              cake_enabled: true,
              candle_count: 3,
              floating_elements: 'hearts',
              final_surprise_text: 'May all your birthday wishes come true!',
            },
          };
        }
      } catch (err) {
        console.warn('Supabase fetch error, trying local IndexedDB:', err);
      }
    }

    // Try IndexedDB
    try {
      const db = await openDB();
      const page = await new Promise<BirthdayPage | null>((resolve) => {
        const tx = db.transaction([STORE_PAGES], 'readonly');
        const store = tx.objectStore(STORE_PAGES);
        const index = store.index('slug');
        const req = index.get(slug);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });

      if (page) {
        // Increment view count
        page.view_count = (page.view_count || 0) + 1;
        return page;
      }
    } catch (e) {
      console.warn('IndexedDB query error:', e);
    }

    // Fallback to localStorage
    try {
      const pageId = localStorage.getItem(`heartfelt_slug_${slug}`);
      if (pageId) {
        const raw = localStorage.getItem(`heartfelt_page_${pageId}`);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // ignore
    }

    return null;
  },

  // Get page by ID
  async getPageById(id: string): Promise<BirthdayPage | null> {
    if (id === DEMO_PAGE.id) return DEMO_PAGE;

    try {
      const db = await openDB();
      return await new Promise<BirthdayPage | null>((resolve) => {
        const tx = db.transaction([STORE_PAGES], 'readonly');
        const store = tx.objectStore(STORE_PAGES);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('IndexedDB get by ID error:', e);
      try {
        const raw = localStorage.getItem(`heartfelt_page_${id}`);
        if (raw) return JSON.parse(raw);
      } catch {}
    }

    return null;
  },

  // Get all user-created pages
  async getAllPages(): Promise<BirthdayPage[]> {
    const pages: BirthdayPage[] = [];

    try {
      const db = await openDB();
      const dbPages = await new Promise<BirthdayPage[]>((resolve) => {
        const tx = db.transaction([STORE_PAGES], 'readonly');
        const store = tx.objectStore(STORE_PAGES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
      pages.push(...dbPages);
    } catch (e) {
      console.warn('Failed to read all from IndexedDB:', e);
    }

    // Add demo page if not in list
    if (!pages.some(p => p.id === DEMO_PAGE.id)) {
      pages.push(DEMO_PAGE);
    }

    // Sort by created_at descending
    return pages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // Delete page
  async deletePage(id: string): Promise<boolean> {
    if (id === DEMO_PAGE.id) return true;

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORE_PAGES, STORE_PHOTOS], 'readwrite');
        tx.objectStore(STORE_PAGES).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      // Remove from localStorage
      localStorage.removeItem(`heartfelt_page_${id}`);
      return true;
    } catch (e) {
      console.error('Delete page error', e);
      return false;
    }
  },

  // Toggle publish / unpublish status
  async togglePublish(id: string): Promise<BirthdayPage | null> {
    const page = await this.getPageById(id);
    if (!page) return null;

    page.status = page.status === 'published' ? 'draft' : 'published';
    return await this.savePage(page);
  }
};

