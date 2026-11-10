# Heartfelt — Personalised Birthday Website Generator 💌🎂

> **Make their birthday unforgettable.**
> A modern, emotional, and interactive platform to craft personalized birthday surprise websites for your loved ones.

---

## ✨ Features & Experiences

### 💌 The Recipient Journey
1. **Welcome Screen & 3D Envelope**: A personalized greeting for the birthday person with an interactive 3D envelope and authentic wax seal bearing their initial.
2. **Interactive Envelope Reveal**: Tapping the seal breaks the wax, opens the flap with 3D rotation, and slides out the personalized letter card with authentic paper rustle sound effects.
3. **Heartfelt Birthday Letter**: Custom typography (Classic Serif, Romantic Cursive, Handwritten Note, or Clean Modern), smooth typewriter or fade animation, and personal sign-off.
4. **Memory Scrapbook Gallery**: The creator's actual uploaded photographs arranged with washi-tape accents, Polaroid tilts, custom captions, and an interactive zoomable lightbox modal.
5. **Interactive Birthday Cake & Candles**: A beautifully animated multi-tier birthday cake with realistic flickering candle flames. The recipient can blow out individual candles or tap *"Blow Out All Candles"*, triggering realistic air breath sounds, drifting smoke puffs, celebratory chimes, and multi-stage confetti explosions.
6. **Final Surprise & Replay**: A warm celebratory finale note with an *"Experience Again ↺"* replay button to re-experience the magic anytime.
7. **Opt-in Ambient Music**: Soothing synthesized melodies (Music Box, Celestial Chimes, Cozy Lofi Piano, Joyful Festive Bells) powered by the Web Audio API — strictly recipient-initiated with zero missing asset failures.

---

## 🎨 6 Handcrafted Visual Themes

| Theme | Mood & Palette | Envelope & Cake Style |
|---|---|---|
| **Romantic Pink** | Soft blush, rose gold, and deep crimson warmth | Pink pastel envelope with crimson seal & berry cake |
| **Lavender Dreams** | Ethereal lilac, celestial purple mist & gold accents | Lilac envelope with royal violet seal & lavender cake |
| **Floral Aesthetic** | Botanical garden greens, soft blossoms & wild serenity | Sage & blossom envelope with garden accents |
| **Minimal Cream** | Understated linen textures, warm ivory & timeless serif | Warm parchment envelope with amber seal |
| **Midnight Celebration** | Deep velvet twilight, stardust & glowing golden stars | Indigo envelope with golden seal & starry cake |
| **Cute Scrapbook** | Playful washi tape, kraft paper & cheerful doodles | Kraft envelope with orange seal & joyful accents |

---

## 🛠️ Multi-Step Customisation Studio (`/create`)

- **Step 1: Personal Details**: Recipient name, creator name, relationship tag pills (Best Friend, Partner, Soulmate, Mom, etc.), birthday date picker, and introductory tagline.
- **Step 2: Theme Selection**: 6 interactive theme cards with live color swatches and mood indicators.
- **Step 3: Custom Memories & Photos**: Drag-and-drop file upload, file validation (JPG, PNG, WebP), live thumbnails, reordering via arrow buttons, caption editing, photo deletion, and replacement.
- **Step 4: Personalised Letter**: Heading editor, font selection with live font rendering, typewriter/fade animation toggles, prompt idea library (Romantic, Best Friend, Family, Cheerful), character counter, and live letter preview.
- **Step 5: Special Effects & Music**: Floating particles selector (Hearts, Sparkles, Flowers, Stars, Mix), interactive birthday cake & candle count toggle, background music selector with live audio preview, and final surprise note.
- **Step 6: Preview & Publish**: Mobile (390px) and Desktop viewport switchers, live interactive preview, one-click website publishing, unique non-guessable slug generation, downloadable high-res QR code (PNG), and instant WhatsApp & clipboard sharing.

---

## 📱 Mobile-First Responsive Design

- Optimized across **360px, 390px, 430px, 768px, 1024px, and 1440px** viewport widths.
- Touch-friendly action buttons (min 48px touch targets).
- Zero horizontal layout shift or overflow.
- Accessible ARIA labels, semantic markup, and `prefers-reduced-motion` compliance.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Database & Storage Architecture

Heartfelt is built with **High-Resilience Dual Persistence**:
1. **Local Persistent Mode (Out-of-the-Box)**:
   - Uses **IndexedDB** for storing high-resolution user photos and pages without the 5MB limits of localStorage.
   - Saves creator ownership tokens so users can edit their pages seamlessly from `/dashboard`.
   - Pre-loaded with an interactive demo celebration (`/b/sophia-celebration`).

2. **Supabase Cloud Mode (Optional)**:
   - To connect Supabase, copy `.env.example` to `.env`:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - Execute the SQL migration script located in `supabase/schema.sql` in your Supabase SQL Editor.
   - Create a public storage bucket named `birthday-photos`.

---

## 📂 Project Directory Structure

```
├── src/
│   ├── components/
│   │   ├── common/             # Navbar, Footer, Modal, ConfettiEffect, FloatingElements
│   │   ├── recipient/          # WelcomeEnvelope, LetterScene, PhotoGallery, BirthdayCake, FinalSurprise, AudioPlayer
│   │   ├── wizard/             # StepPersonalDetails, StepThemeSelection, StepCustomPhotos, StepPersonalisedLetter, StepSpecialEffects, StepPreviewAndPublish
│   │   └── dashboard/          # CelebrationCard, QRCodeModal
│   ├── context/
│   │   └── WizardContext.tsx   # Multi-step state, auto-save drafts, validation
│   ├── data/
│   │   ├── themes.ts           # 6 luxury theme specifications
│   │   └── prompts.ts          # Suggested letter inspirations & relationships
│   ├── services/
│   │   ├── audioSynthesizer.ts # Web Audio API music box, chimes & sound effects
│   │   ├── storageService.ts   # IndexedDB + LocalStorage unified persistence
│   │   └── supabase.ts         # Supabase client & connection checks
│   ├── types/
│   │   └── index.ts            # Strict TypeScript interfaces
│   ├── pages/
│   │   ├── LandingPage.tsx     # Hero, 3-step guide, visual previews, FAQ
│   │   ├── WizardPage.tsx      # Multi-step creation studio
│   │   ├── DashboardPage.tsx   # Celebration management & quick actions
│   │   ├── PreviewPage.tsx     # Viewport-switching preview screen
│   │   └── RecipientPage.tsx   # Public magical surprise experience (/b/:slug)
│   ├── App.tsx                 # Route declarations
│   ├── index.css               # 3D transforms, candle flame & glassmorphism
│   └── main.tsx                # Application root
├── supabase/
│   └── schema.sql              # PostgreSQL tables, indexes & RLS policies
├── .env.example                # Supabase configuration guide
└── tailwind.config.js          # Custom color palettes & keyframes
```

