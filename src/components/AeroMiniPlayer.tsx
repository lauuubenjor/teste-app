import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc3, Sliders, Maximize2 } from 'lucide-react';
import { Track } from '../types/audio';
import { audioEngine } from '../services/audioEngine';

interface AeroMiniPlayerProps {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onExpandPlayer: () => void;
  onOpenEQ: () => void;
}

export const AeroMiniPlayer: React.FC<AeroMiniPlayerProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onExpandPlayer,
  onOpenEQ,
}) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audioEngine.setTimeUpdateListener((time) => {
      setCurrentTime(time);
    });
  }, []);

  const progressPercent = Math.min(100, (currentTime / track.duration) * 100);

  return (
    <aside aria-label="Controles de reprodução" className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto aero-glass-panel rounded-2xl p-2.5 sm:px-4 sm:py-3 border border-white/95 shadow-2xl pointer-events-auto transition-all duration-200">
        
        {/* Micro progress line at top of mini bar */}
        <div className="w-full h-1 bg-sky-200/70 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-sky-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Left: Mini Spinning Disc & Track Info */}
          <div
            onClick={onExpandPlayer}
            className="flex items-center gap-3 min-w-0 cursor-pointer group"
            title="Expandir DuDisc Player"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full cd-disc-surface p-0.5 border border-white shadow-md flex items-center justify-center shrink-0">
              <Disc3 className={`w-6 h-6 text-sky-950 ${isPlaying ? 'animate-spin-cd' : ''}`} />
              <div className="absolute inset-0 cd-holographic-sheen rounded-full pointer-events-none" />
            </div>

            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-cyan-700 transition-colors">
                {track.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                {track.artist} · <span className="text-sky-700/80">{track.audioFormat}</span>
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenEQ}
              className="p-2 rounded-xl text-slate-600 hover:text-sky-800 hover:bg-white/80 transition-colors"
              title="Abrir AeroEQ Pro"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={onPrevTrack}
              className="p-1.5 rounded-full text-slate-600 hover:text-sky-800 transition-colors"
              title="Anterior"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full aero-btn-aqua flex items-center justify-center shadow-md active:scale-95 transition-transform"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-current" />
              ) : (
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={onNextTrack}
              className="p-1.5 rounded-full text-slate-600 hover:text-sky-800 transition-colors"
              title="Próxima"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onExpandPlayer}
              className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-sky-800 hover:bg-white/80 transition-colors"
              title="Tela Cheia DuDisc"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
