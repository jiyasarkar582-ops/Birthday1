import React, { useRef, useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { UploadCloud, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, Sparkles, AlertCircle, Wand2 } from 'lucide-react';
import { DEMO_PHOTOS } from '../../services/storageService';

export const StepCustomPhotos: React.FC = () => {
  const { pageData, addPhotos, updatePhotoCaption, removePhoto, reorderPhotos } = useWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadError(null);
      const files = Array.from(e.target.files);
      await addPhotos(files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadError(null);
      const files = Array.from(e.dataTransfer.files);
      await addPhotos(files);
    }
  };

  // Quick helper to populate demo photos for testing
  const handleLoadSamplePhotos = () => {
    DEMO_PHOTOS.forEach(p => {
      // Avoid duplicates
      if (!pageData.photos.some(existing => existing.caption === p.caption)) {
        pageData.photos.push({
          ...p,
          id: 'demo_' + Math.random().toString(36).substring(2, 9),
        });
      }
    });
    // Trigger update
    reorderPhotos(0, 0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-rose-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Step 3</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Memory Scrapbook Photos
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Upload your favorite photographs of {pageData.recipient_name || 'them'}. Add sweet captions and reorder as you like.
          </p>
        </div>

        {pageData.photos.length === 0 && (
          <button
            type="button"
            onClick={handleLoadSamplePhotos}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors w-fit shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Add Sample Memories</span>
          </button>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          isDragging
            ? 'border-rose-500 bg-rose-50/70 scale-[1.01]'
            : 'border-rose-200 hover:border-rose-400 bg-white hover:bg-rose-50/20 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-500 flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-stone-800">
          Click to upload or drag & drop photographs
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm">
          Supports JPG, PNG, and WebP. You can select multiple pictures at once.
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-100/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Actual photos will be featured in the scrapbook gallery
        </span>
      </div>

      {uploadError && (
        <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Photo List & Management */}
      {pageData.photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Uploaded Photos ({pageData.photos.length})
            </h4>
            <span className="text-xs text-stone-400">
              Use arrows to arrange sequence
            </span>
          </div>

          <div className="space-y-3">
            {pageData.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-rose-200"
              >
                {/* Photo Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Memory preview'}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-stone-900/70 text-white text-[10px] font-bold">
                    #{index + 1}
                  </span>
                </div>

                {/* Caption Input */}
                <div className="w-full flex-1 space-y-1">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                    Caption / Memory Note
                  </label>
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                    placeholder="e.g. That spontaneous beach sunset trip 🌅"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm text-stone-800 transition-all placeholder:text-stone-400"
                  />
                </div>

                {/* Actions: Reorder & Delete */}
                <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderPhotos(index, index - 1)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move photo up"
                      aria-label="Move photo up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === pageData.photos.length - 1}
                      onClick={() => reorderPhotos(index, index + 1)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move photo down"
                      aria-label="Move photo down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Remove photo"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

