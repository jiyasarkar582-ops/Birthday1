import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode } from 'lucide-react';

interface SafeQRCodeProps {
  id?: string;
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

export const SafeQRCode: React.FC<SafeQRCodeProps> = ({
  id,
  value,
  size = 140,
  level = 'M',
  includeMargin = true,
}) => {
  // If the URL is too long for a QR code (e.g., contains large base64 hash),
  // strip the hash so the QR code generates a crisp, clean URL without throwing.
  let safeValue = value;
  if (value.length > 900 && value.includes('#')) {
    safeValue = value.split('#')[0];
  }

  try {
    return (
      <QRCodeSVG
        id={id}
        value={safeValue}
        size={size}
        level={level}
        includeMargin={includeMargin}
      />
    );
  } catch (err) {
    console.warn('QRCodeSVG generation error, rendering fallback:', err);
    return (
      <div
        id={id}
        style={{ width: size, height: size }}
        className="flex flex-col items-center justify-center bg-stone-50 border border-stone-200 rounded-xl text-stone-400 p-2 text-center"
      >
        <QrCode className="w-8 h-8 mb-1 text-stone-400" />
        <span className="text-[10px] font-medium text-stone-500">Scan celebration link</span>
      </div>
    );
  }
};
