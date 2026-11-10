import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BirthdayPage } from '../../types';
import { THEMES } from '../../data/themes';
import { storageService } from '../../services/storageService';
import { 
  Heart, 
  ExternalLink, 
  Edit3, 
  QrCode, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Calendar,
  Sparkles
} from 'lucide-react';

interface CelebrationCardProps {
  page: BirthdayPage;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShowQR: (page: BirthdayPage) => void;
}

export const CelebrationCard: React.FC<CelebrationCardProps> = ({
  page,
  onEdit,
  onDelete,
  onShowQR,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const theme = THEMES[page.theme] || THEMES['romantic-pink'];
  const publicUrl = `${window.location.origin}/b/${page.slug}`;
  const isDemo = page.id === 'demo-surprise-001' || page.id === 'demo-surprise-abhi';

  const copyLink = async () => {
    try {
      const url = await storageService.generateShareableUrl(page);
      navigator.clipboard.writeText(url);
    } catch {
      navigator.clipboard.writeText(publicUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(page.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-lg transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs"
              style={{
                backgroundColor: `${theme.accentColor}15`,
                color: theme.accentColor,
              }}
            >
              <span>{theme.icon}</span>
              <span>{theme.name}</span>
            </span>

            {isDemo && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Official Demo
              </span>
            )}
          </div>

          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              page.status === 'published'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {page.status}
          </span>
        </div>

        {/* Recipient Title */}
        <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
          {page.recipient_name}
        </h3>

        <p className="text-stone-500 text-xs mt-1">
          Surprise by <strong className="text-stone-700">{page.creator_name}</strong>
          {page.relationship ? ` (${page.relationship})` : ''}
        </p>

        {/* Meta Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
            <span>{page.photos?.length || 0} Photos</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{formattedDate}</span>
          </div>

          {page.view_count !== undefined && page.view_count > 0 && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>{page.view_count} views</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* View Public Live Site */}
          <Link
            to={`/b/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live</span>
          </Link>

          {/* Edit Page */}
          <button
            type="button"
            onClick={() => onEdit(page.id)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-stone-600" />
            <span>Edit</span>
          </button>
        </div>

        {/* Secondary utilities: Copy link, QR Code, Delete */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={copyLink}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs transition-colors"
              title="Copy public link"
              aria-label="Copy public link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onShowQR(page)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs transition-colors"
              title="Show QR Code"
              aria-label="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {!isDemo && (
            <div>
              {confirmDelete ? (
                <div className="flex items-center gap-1 animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => onDelete(page.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md text-[11px] font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-stone-500 hover:text-stone-800 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 text-xs transition-colors"
                  title="Delete page"
                  aria-label="Delete page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

