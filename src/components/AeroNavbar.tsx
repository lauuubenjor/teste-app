import React from 'react';
import { Disc3, CloudSun, Smartphone, Monitor, Sparkles, Sliders, Music2, FolderHeart, Palette } from 'lucide-react';

interface AeroNavbarProps {
  activeTab: 'home' | 'player' | 'library' | 'equalizer' | 'design';
  onSelectTab: (tab: 'home' | 'player' | 'library' | 'equalizer' | 'design') => void;
  isMobileFrameMode: boolean;
  onToggleFrameMode: () => void;
  isPlaying: boolean;
  activeTrackTitle: string;
}

export const AeroNavbar: React.FC<AeroNavbarProps> = ({
  activeTab,
  onSelectTab,
  isMobileFrameMode,
  onToggleFrameMode,
  isPlaying,
  activeTrackTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full aero-glass-panel border-b border-white/70 px-4 md:px-8 py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-400 to-cyan-200 p-0.5 shadow-md shadow-cyan-500/25 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-sky-400 to-blue-600 flex items-center justify-center overflow-hidden border border-white/60">
                <Disc3 className={`w-5 h-5 text-white drop-shadow ${isPlaying ? 'animate-spin-cd' : ''}`} />
                {/* Gloss reflection overlay */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 rounded-t-full pointer-events-none" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-b from-sky-700 via-sky-800 to-blue-950 bg-clip-text text-transparent">
                  AeroSound
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-100/90 text-cyan-800 border border-cyan-200 shadow-xs">
                  DuDisc
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-medium hidden sm:block">
                HD Audio Engine & Spatial Visualizer
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, Anti-Slop) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-xl border border-white/80 shadow-xs">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'home'
                ? 'aero-btn-aqua shadow-sm'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Início</span>
          </button>

          <button
            onClick={() => onSelectTab('player')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'player'
                ? 'aero-btn-aqua shadow-sm'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>DuDisc Player</span>
            {isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('library')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'library'
                ? 'aero-btn-aqua shadow-sm'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Biblioteca</span>
          </button>

          <button
            onClick={() => onSelectTab('equalizer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'equalizer'
                ? 'aero-btn-aqua shadow-sm'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>AeroEQ Pro</span>
          </button>

          <button
            onClick={() => onSelectTab('design')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === 'design'
                ? 'aero-btn-aqua shadow-sm'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Design System</span>
          </button>
        </nav>

        {/* Zone 3: Weather Widget & Device Frame Mode */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Authentic Frutiger Aero Weather Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-100/90 to-cyan-50/90 border border-sky-200/80 shadow-xs text-xs font-medium text-sky-900">
            <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-sky-950">24°C</span>
            <span className="text-sky-700 text-[11px]">· Brisa Solar</span>
          </div>

          {/* Toggle between Web Desktop Layout & Direct Mobile Screen Frame */}
          <button
            onClick={onToggleFrameMode}
            title={isMobileFrameMode ? "Alternar para Modo Web Expandido" : "Alternar para Visão Celular (Mockup Exato)"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isMobileFrameMode
                ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                : 'bg-white/80 hover:bg-white text-slate-700 border-white/90 shadow-xs'
            }`}
          >
            {isMobileFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modo Web</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Visão Celular</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
