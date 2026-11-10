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

// Compress to URL-safe string
export async function encodePageToUrlString(page: BirthdayPage): Promise<string> {
  const compact = compressPageToPayload(page);
  const jsonStr = JSON.stringify(compact);

  // Modern browser compression with CompressionStream (Deflate)
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

// Decode from URL-safe string
export async function decodePageFromUrlString(encoded: string): Promise<BirthdayPage | null> {
  try {
    let mode = '';
    let raw = encoded;
    if (encoded.startsWith('c1_')) {
      mode = 'compressed';
      raw = encoded.slice(3);
    } else if (encoded.startsWith('b1_')) {
      mode = 'base64';
      raw = encoded.slice(3);
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
