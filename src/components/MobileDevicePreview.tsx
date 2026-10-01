import React, { useState } from 'react';
import { Sparkles, Music2, FolderHeart, Sliders, Battery, Wifi, Disc3 } from 'lucide-react';
import { Track, EqualizerState } from '../types/audio';
import { DuDiscPlayer } from './DuDiscPlayer';
import { HomeDiscovery } from './HomeDiscovery';
import { LibraryView } from './LibraryView';
import { AeroEqualizer } from './AeroEqualizer';

interface MobileDevicePreviewProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onToggleFavorite: (trackId: string) => void;
  eqState: EqualizerState;
  onChangeEqState: (newState: EqualizerState) => void;
}

export const MobileDevicePreview: React.FC<MobileDevicePreviewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleFavorite,
  eqState,
  onChangeEqState,
}) => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'player' | 'library' | 'equalizer'>('player');

  return (
    <div className="w-full py-6 flex flex-col items-center">
      {/* Screen Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/90 shadow-md mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeScreen === 'home' ? 'aero-btn-aqua shadow-sm' : 'text-slate-600 hover:text-sky-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Início</span>
        </button>

        <button
          onClick={() => setActiveScreen('player')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeScreen === 'player' ? 'aero-btn-aqua shadow-sm' : 'text-slate-600 hover:text-sky-800'
          }`}
        >
          <Music2 className="w-3.5 h-3.5" />
          <span>2. DuDisc Tocando</span>
        </button>

        <button
          onClick={() => setActiveScreen('library')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeScreen === 'library' ? 'aero-btn-aqua shadow-sm' : 'text-slate-600 hover:text-sky-800'
          }`}
        >
          <FolderHeart className="w-3.5 h-3.5" />
          <span>3. Biblioteca</span>
        </button>

        <button
          onClick={() => setActiveScreen('equalizer')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeScreen === 'equalizer' ? 'aero-btn-aqua shadow-sm' : 'text-slate-600 hover:text-sky-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>4. AeroEQ Pro</span>
        </button>
      </div>

      {/* Realistic Frutiger Aero Smartphone Frame */}
      <div className="relative w-full max-w-[390px] h-[810px] rounded-[48px] bg-gradient-to-b from-slate-200 via-sky-100 to-slate-300 p-3 shadow-[0_25px_60px_-15px_rgba(0,80,140,0.35),0_0_0_2px_rgba(255,255,255,0.9)] border-2 border-white flex flex-col overflow-hidden">
        
        {/* Inner Bezel Screen */}
        <div className="relative w-full h-full rounded-[38px] bg-gradient-to-b from-[#e8f7ff] via-[#d5eefc] to-[#bce1f7] overflow-hidden flex flex-col border border-white/60">
          
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-mono-data font-bold text-sky-950 shrink-0 z-30 select-none">
            <span>09:41</span>
            {/* Notch / Speaker bar */}
            <div className="w-24 h-4 bg-sky-950/15 rounded-full flex items-center justify-center">
              <div className="w-10 h-1 bg-sky-900/30 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5 text-sky-900">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Content Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-none pb-20">
            {activeScreen === 'home' && (
              <HomeDiscovery
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onSelectTrack={onSelectTrack}
                onTogglePlay={onTogglePlay}
                onGoToPlayer={() => setActiveScreen('player')}
                onToggleFavorite={onToggleFavorite}
              />
            )}

            {activeScreen === 'player' && (
              <DuDiscPlayer
                track={currentTrack}
                isPlaying={isPlaying}
                onTogglePlay={onTogglePlay}
                onNextTrack={onNextTrack}
                onPrevTrack={onPrevTrack}
                onSelectTrack={onSelectTrack}
                onToggleFavorite={onToggleFavorite}
              />
            )}

            {activeScreen === 'library' && (
              <LibraryView
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onSelectTrack={onSelectTrack}
                onTogglePlay={onTogglePlay}
                onToggleFavorite={onToggleFavorite}
              />
            )}

            {activeScreen === 'equalizer' && (
              <AeroEqualizer
                eqState={eqState}
                onChangeEqState={onChangeEqState}
                isPlaying={isPlaying}
              />
            )}
          </div>

          {/* Fixed Mobile Bottom Tab Bar (as in Screen 3 & 4 of the mockup) */}
          <nav aria-label="Navegação móvel" className="absolute bottom-0 left-0 right-0 h-16 bg-white/85 backdrop-blur-md border-t border-white/90 grid grid-cols-4 items-center px-2 z-30 shadow-lg">
            <button
              onClick={() => setActiveScreen('home')}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                activeScreen === 'home' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-sky-700'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Início</span>
            </button>

            <button
              onClick={() => setActiveScreen('library')}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                activeScreen === 'library' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-sky-700'
              }`}
            >
              <FolderHeart className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Biblioteca</span>
            </button>

            <button
              onClick={() => setActiveScreen('player')}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors relative ${
                activeScreen === 'player' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-sky-700'
              }`}
            >
              <div className="relative">
                <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
                {isPlaying && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Tocando</span>
            </button>

            <button
              onClick={() => setActiveScreen('equalizer')}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                activeScreen === 'equalizer' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-sky-700'
              }`}
            >
              <Sliders className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Equalizador</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
