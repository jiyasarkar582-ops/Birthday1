import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { audioSynthesizer } from '../../services/audioSynthesizer';
import { BirthdayOptions } from '../../types';

interface AudioPlayerProps {
  options: BirthdayOptions;
  accentColor?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  options,
  accentColor = '#f43f5e',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    return () => {
      audioSynthesizer.stop();
    };
  }, []);

  if (!options.music_enabled) return null;

  const togglePlay = () => {
    setHasInteracted(true);
    if (isPlaying) {
      audioSynthesizer.stop();
      setIsPlaying(false);
    } else {
      audioSynthesizer.playTrack(options.music_track);
      setIsPlaying(true);
      setIsMuted(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      audioSynthesizer.setVolume(0.35);
      setIsMuted(false);
    } else {
      audioSynthesizer.setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 max-w-[280px]">
      <div
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePlay();
          }
        }}
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full cursor-pointer transition-all duration-300 shadow-lg ${
          isPlaying
            ? 'bg-white/95 text-stone-800 shadow-rose-400/20 ring-2 ring-rose-400/50 backdrop-blur-md'
            : 'bg-stone-900/80 text-white/90 hover:bg-stone-900 hover:text-white backdrop-blur-md hover:scale-105'
        }`}
        title={isPlaying ? 'Pause background music' : 'Play sweet background music'}
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isPlaying ? 'bg-rose-500 text-white animate-spin' : 'bg-white/20 text-white'
          }`}
          style={isPlaying ? { animationDuration: '6s' } : {}}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </div>

        <div className="flex flex-col text-left overflow-hidden">
          <div className="flex items-center gap-1.5">
            <Music className="w-3 h-3 text-rose-500 shrink-0" />
            <span className="text-xs font-semibold truncate max-w-[120px]">
              {options.music_title || 'Birthday Melody'}
            </span>
          </div>
          <span className="text-[10px] text-stone-500 truncate">
            {isPlaying ? 'Now playing' : hasInteracted ? 'Tap to resume' : 'Tap to play music'}
          </span>
        </div>

        {/* Sound waves when playing */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3.5 ml-1 mr-0.5">
            <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-3" style={{ animationDelay: '75ms' }} />
          </div>
        )}

        {/* Mute button */}
        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 hover:bg-stone-100 rounded-full text-stone-500 hover:text-stone-800 transition-colors ml-1"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
};

