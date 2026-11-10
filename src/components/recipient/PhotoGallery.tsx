import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Maximize2, ChevronLeft, ChevronRight, X, Heart } from 'lucide-react';
import { BirthdayPhoto, ThemeConfig } from '../../types';
import { Modal } from '../common/Modal';

interface PhotoGalleryProps {
  photos: BirthdayPhoto[];
  theme: ThemeConfig;
  recipientName: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  theme,
  recipientName,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  // Pre-calculated slight rotation angles for authentic scrapbook feel
  const rotations = [-2.5, 1.8, -1.2, 2.8, -2, 1.5, -3, 2];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
  };

  const activePhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-rose-100 shadow-xs mb-3 text-xs font-semibold text-rose-500 uppercase tracking-widest backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Moments That Mean The World</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Memories of {recipientName}
        </h2>
        <p className="text-stone-600 text-sm mt-2">
          A little collection of smiles, adventures, and milestones. Tap any photo to take a closer look!
        </p>
      </div>

      {/* Polaroid Scrapbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {photos.map((photo, index) => {
          const rotation = rotations[index % rotations.length];
          return (
            <motion.div
              key={photo.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ transform: `rotate(${rotation}deg)` }}
              onClick={() => setSelectedPhotoIndex(index)}
              className="polaroid-card bg-white p-3.5 sm:p-4 rounded-2xl cursor-pointer group border border-stone-200/80 transition-all select-none"
            >
              {/* Photo Frame */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={photo.url}
                  alt={photo.caption || `Memory with ${recipientName}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-lg">
                    <Maximize2 className="w-5 h-5 text-rose-600" />
                  </div>
                </div>

                {/* Scrapbook Tape Accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/80 backdrop-blur-xs border border-amber-200/60 shadow-xs transform -rotate-1 rounded-xs pointer-events-none" />
              </div>

              {/* Caption */}
              <div className="pt-4 pb-2 px-1 text-center">
                <p className="font-handwriting text-xl sm:text-2xl text-stone-800 leading-tight">
                  {photo.caption || 'A special moment together ✨'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && activePhoto && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPhotoIndex(null)}
          maxWidth="4xl"
        >
          <div className="relative flex flex-col items-center">
            {/* Image Container */}
            <div className="relative w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-stone-950">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || 'Celebration Memory'}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Caption & Info */}
            <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 px-2">
              <div>
                <p className="font-handwriting text-2xl sm:text-3xl text-stone-900 font-bold">
                  {activePhoto.caption || 'Cherished Memory'}
                </p>
                <p className="text-xs text-stone-500">
                  Photo {selectedPhotoIndex + 1} of {photos.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                  {recipientName}'s Scrapbook
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

