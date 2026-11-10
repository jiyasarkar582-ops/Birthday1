import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../common/Modal';
import { Copy, Check, Download, Share2 } from 'lucide-react';
import { BirthdayPage } from '../../types';
import { storageService } from '../../services/storageService';

interface QRCodeModalProps {
  page: BirthdayPage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ page, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (page) {
      storageService.generateShareableUrl(page).then((url) => {
        if (isMounted) setShareableUrl(url);
      });
    }
    return () => { isMounted = false; };
  }, [page]);

  if (!page) return null;

  const publicUrl = shareableUrl || `${window.location.origin}/b/${page.slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById(`modal-qr-${page.id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx?.drawImage(img, 0, 0, 512, 512);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Heartfelt-QR-${page.recipient_name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareWhatsApp = () => {
    const text = `Hey ${page.recipient_name}! Open your surprise birthday website here 🎂: ${publicUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share ${page.recipient_name}'s Surprise`}>
      <div className="flex flex-col items-center text-center space-y-6">
        {/* QR Code Container with luxury styling */}
        <div className="p-4 bg-white rounded-3xl shadow-xl border border-rose-100 flex items-center justify-center">
          <QRCodeSVG
            id={`modal-qr-${page.id}`}
            value={publicUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <div>
          <h4 className="font-serif text-lg font-bold text-stone-900">
            Scan to Open Celebration
          </h4>
          <p className="text-stone-500 text-xs mt-1 max-w-xs">
            Anyone can scan this code with their smartphone camera or tap the link to experience the birthday surprise.
          </p>
        </div>

        {/* Copy Link Input */}
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={publicUrl}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 select-all"
          />
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Share & Download Actions */}
        <div className="w-full grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={downloadQRCode}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={shareWhatsApp}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

