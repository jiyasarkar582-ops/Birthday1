-- =========================================================
-- HEARTFELT: Supabase Database Schema & Storage Setup
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Birthday Pages Table
CREATE TABLE IF NOT EXISTS public.birthday_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  secure_edit_token_hash TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  relationship TEXT,
  birthday_date DATE,
  intro TEXT,
  theme TEXT NOT NULL DEFAULT 'romantic-pink',
  letter_heading TEXT,
  letter_font TEXT DEFAULT 'serif',
  letter_animation TEXT DEFAULT 'fade',
  letter_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for public slug lookup
CREATE INDEX IF NOT EXISTS idx_birthday_pages_slug ON public.birthday_pages(slug);
CREATE INDEX IF NOT EXISTS idx_birthday_pages_status ON public.birthday_pages(status);

-- 2. Birthday Photos Table
CREATE TABLE IF NOT EXISTS public.birthday_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES public.birthday_pages(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_birthday_photos_page_id ON public.birthday_photos(page_id);

-- 3. Birthday Options & Extras Table
CREATE TABLE IF NOT EXISTS public.birthday_options (
  page_id UUID PRIMARY KEY REFERENCES public.birthday_pages(id) ON DELETE CASCADE,
  music_track TEXT DEFAULT 'chimes',
  music_title TEXT DEFAULT 'Dreamy Music Box',
  music_enabled BOOLEAN DEFAULT true,
  confetti_enabled BOOLEAN DEFAULT true,
  cake_enabled BOOLEAN DEFAULT true,
  candle_count INTEGER DEFAULT 3,
  floating_elements TEXT DEFAULT 'hearts',
  final_surprise_text TEXT,
  final_surprise_subtext TEXT,
  surprise_button_label TEXT,
  surprise_button_link TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.birthday_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_options ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Public read access: Anyone can read published pages
CREATE POLICY "Allow public read on published birthday pages"
  ON public.birthday_pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Allow public read on photos of published pages"
  ON public.birthday_photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.birthday_pages
    WHERE public.birthday_pages.id = public.birthday_photos.page_id
    AND public.birthday_pages.status = 'published'
  ));

CREATE POLICY "Allow public read on options of published pages"
  ON public.birthday_options FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.birthday_pages
    WHERE public.birthday_pages.id = public.birthday_options.page_id
    AND public.birthday_pages.status = 'published'
  ));

-- Creator permissions: Allow anonymous creation and edit via service or authenticated user
CREATE POLICY "Allow anonymous insert for birthday pages"
  ON public.birthday_pages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert for photos"
  ON public.birthday_photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert for options"
  ON public.birthday_options FOR INSERT
  WITH CHECK (true);

-- 6. Storage Bucket setup instructions:
-- In Supabase dashboard:
-- Navigate to Storage -> Create a new public bucket called "birthday-photos"
-- Enable public read access for the bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('birthday-photos', 'birthday-photos', true);

