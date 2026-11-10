import { BirthdayPage } from '../types';

// Convert a BirthdayPage to a compact JSON representation for URL sharing
interface CompactPayload {
  id: string;
  s: string; // slug
  r: string; // recipient_name
  c: string; // creator_name
  rel?: string; // relationship
  bd?: string; // birthday_date
  in?: string; // intro
  th: string; // theme
  lh?: string; // letter_heading
  lf: string; // letter_font
  la: string; // letter_animation
  lt: string; // letter_text
  p: {
    id: string;
    u: string; // url
    c: string; // caption
    s: number; // sort_order
  }[];
  opt: {
    me: boolean;
    mt: string;
    mti: string;
    ce: boolean;
    ke: boolean;
    cc: number;
    fe: string;
    fst: string;
    fss?: string;
    sbl?: string;
    sblnk?: string;
    lqe?: boolean;
  };
}

export function compressPageToPayload(page: BirthdayPage): CompactPayload {
  return {
    id: page.id,
    s: page.slug,
    r: page.recipient_name,
    c: page.creator_name,
    rel: page.relationship,
    bd: page.birthday_date,
    in: page.intro,
    th: page.theme,
    lh: page.letter_heading,
    lf: page.letter_font,
    la: page.letter_animation,
    lt: page.letter_text,
    p: (page.photos || []).map((photo) => ({
      id: photo.id,
      u: photo.url,
      c: photo.caption || '',
      s: photo.sort_order ?? 0,
    })),
    opt: {
      me: page.options.music_enabled,
      mt: page.options.music_track,
      mti: page.options.music_title,
      ce: page.options.confetti_enabled,
      ke: page.options.cake_enabled,
      cc: page.options.candle_count,
      fe: page.options.floating_elements,
      fst: page.options.final_surprise_text,
      fss: page.options.final_surprise_subtext,
      sbl: page.options.surprise_button_label,
      sblnk: page.options.surprise_button_link,
      lqe: page.options.love_question_enabled ?? true,
    },
  };
}

export function decompressPayloadToPage(payload: CompactPayload): BirthdayPage {
  return {
    id: payload.id,
    slug: payload.s,
    secure_edit_token: 'shared',
    recipient_name: payload.r,
    creator_name: payload.c,
    relationship: payload.rel || 'Special Someone',
    birthday_date: payload.bd || '',
    intro: payload.in || '',
    theme: (payload.th as any) || 'romantic-pink',
    letter_heading: payload.lh || `Happy Birthday, ${payload.r}!`,
    letter_font: (payload.lf as any) || 'serif',
    letter_animation: (payload.la as any) || 'typewriter',
    letter_text: payload.lt || '',
    photos: (payload.p || []).map((item) => ({
      id: item.id,
      url: item.u,
      caption: item.c,
      sort_order: item.s,
    })),
    options: {
      music_enabled: payload.opt?.me ?? true,
      music_track: (payload.opt?.mt as any) || 'chimes',
      music_title: payload.opt?.mti || 'Dreamy Music Box',
      confetti_enabled: payload.opt?.ce ?? true,
      cake_enabled: payload.opt?.ke ?? true,
      candle_count: payload.opt?.cc ?? 3,
      floating_elements: (payload.opt?.fe as any) || 'hearts',
      final_surprise_text: payload.opt?.fst || 'Happy Birthday!',
      final_surprise_subtext: payload.opt?.fss || '',
      surprise_button_label: payload.opt?.sbl || '',
      surprise_button_link: payload.opt?.sblnk || '',
      love_question_enabled: payload.opt?.lqe ?? true,
    },
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Helper to resize a base64 image data URL to a compact thumbnail for URL transport
async function shrinkImageForUrl(dataUrl: string, maxDim = 360, quality = 0.55): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// Helper to compress a JSON string into a URL-safe base64 string
async function compressJsonToUrlSafe(jsonStr: string): Promise<string> {
  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Blob([new TextEncoder().encode(jsonStr)]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('deflate-raw'));
      const buffer = await new Response(compressedStream).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return 'c1_' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      console.warn('CompressionStream failed, using standard base64 fallback', e);
    }
  }

  // Standard safe base64 fallback
  return 'b1_' + btoa(encodeURIComponent(jsonStr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Compress to URL-safe string while preserving all photos and captions within safe limits
export async function encodePageToUrlString(page: BirthdayPage): Promise<string> {
  const baseCompact = compressPageToPayload(page);

  // Resize user-uploaded photos to compact web thumbnails for URL transport
  const optimizedPhotos = await Promise.all(
    (page.photos || []).map(async (photo) => {
      let compactUrl = photo.url;
      if (photo.url && photo.url.startsWith('data:image/')) {
        try {
          compactUrl = await shrinkImageForUrl(photo.url, 360, 0.55);
        } catch {
          compactUrl = photo.url;
        }
      }
      return {
        id: photo.id,
        u: compactUrl,
        c: photo.caption || '',
        s: photo.sort_order ?? 0,
      };
    })
  );

  const compact: CompactPayload = {
    ...baseCompact,
    p: optimizedPhotos,
  };

  let encoded = await compressJsonToUrlSafe(JSON.stringify(compact));

  // If still too large (> 50k chars) because there are many photos, shrink to 240px @ 0.45
  if (encoded.length > 50000 && optimizedPhotos.length > 0) {
    const microPhotos = await Promise.all(
      (page.photos || []).map(async (photo) => {
        let microUrl = photo.url;
        if (photo.url && photo.url.startsWith('data:image/')) {
          try {
            microUrl = await shrinkImageForUrl(photo.url, 240, 0.45);
          } catch {
            microUrl = photo.url;
          }
        }
        return {
          id: photo.id,
          u: microUrl,
          c: photo.caption || '',
          s: photo.sort_order ?? 0,
        };
      })
    );
    compact.p = microPhotos;
    encoded = await compressJsonToUrlSafe(JSON.stringify(compact));
  }

  // If even that exceeds 55000, keep as many photo images as fit while always preserving captions
  if (encoded.length > 55000 && compact.p.length > 1) {
    compact.p = compact.p.map((p, idx) => (idx < 2 ? p : { ...p, u: '' }));
    encoded = await compressJsonToUrlSafe(JSON.stringify(compact));
  }

  return encoded;
}

// Decode from URL-safe string
export async function decodePageFromUrlString(encoded: string): Promise<BirthdayPage | null> {
  try {
    let raw = encoded;
    try {
      raw = decodeURIComponent(raw);
    } catch {}

    let mode = '';
    if (raw.startsWith('c1_')) {
      mode = 'compressed';
      raw = raw.slice(3);
    } else if (raw.startsWith('b1_')) {
      mode = 'base64';
      raw = raw.slice(3);
    }

    let base64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';

    if (mode === 'compressed' && typeof DecompressionStream !== 'undefined') {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const stream = new Blob([bytes]).stream();
      const decompressedStream = stream.pipeThrough(new DecompressionStream('deflate-raw'));
      const text = await new Response(decompressedStream).text();
      const compact: CompactPayload = JSON.parse(text);
      return decompressPayloadToPage(compact);
    }

    // Base64 decode fallback
    const binary = atob(base64);
    let jsonText: string;
    try {
      jsonText = decodeURIComponent(binary);
    } catch {
      jsonText = binary;
    }
    const compact: CompactPayload = JSON.parse(jsonText);
    return decompressPayloadToPage(compact);
  } catch (err) {
    console.error('Failed to decode birthday page from URL', err);
    return null;
  }
}

