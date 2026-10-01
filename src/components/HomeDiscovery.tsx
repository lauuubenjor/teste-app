import React, { useState } from 'react';
import { Play, Sparkles, Disc, Heart, Check, Clock, Radio } from 'lucide-react';
import { Track } from '../types/audio';
import { HERO_IMAGE, ALBUM_AQUATIC_IMAGE, ALBUM_CRYSTAL_IMAGE } from '../data/mockTracks';

interface HomeDiscoveryProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onGoToPlayer: () => void;
  onToggleFavorite: (trackId: string) => void;
}

const CLIMA_FILTERS = [
  'Todos',
  'Trance Clássico',
  'Aqua Ambient',
  'Vaporwave',
  'Liquid DnB',
  'Synth Chill',
];

export const HomeDiscovery: React.FC<HomeDiscoveryProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onGoToPlayer,
  onToggleFavorite,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [isSavedHero, setIsSavedHero] = useState(false);

  const filteredTracks = selectedFilter === 'Todos'
    ? tracks
    : tracks.filter(t => t.genre.toLowerCase() === selectedFilter.toLowerCase());

  const heroTrack = tracks.find(t => t.id === 'track-2') || tracks[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Bom dia, Alex ✨
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Harmonias cristalinas e sintetizadores aquáticos selecionados para hoje.
          </p>
        </div>

        {/* Ambient status indicator */}
        <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/90 shadow-xs text-xs text-sky-900 font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span>Fidelidade AeroHD 1411kbps Ativada</span>
        </div>
      </div>

      {/* HERO SECTION: Destaque da Semana (Frutiger Aero Green Hills & Glass) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/80 group">
        {/* Background Image with Measured Gradient Scrim for WCAG AA contrast */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Frutiger Aero Utopia"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Aero Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/80 via-transparent to-sky-950/30" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Destaque da Semana · Trance Sinfônico 2008</span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight drop-shadow-md text-balance">
              Trance Sinfônico 2008
            </h2>

            <p className="text-xs sm:text-sm text-sky-100/90 mt-2 max-w-xl leading-relaxed text-balance drop-shadow-xs">
              Harmonias cristalinas, arpeggios aquáticos e sintetizadores nostálgicos da era de ouro da internet clássica.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  onSelectTrack(heroTrack);
                  if (!isPlaying || currentTrack.id !== heroTrack.id) onTogglePlay();
                  onGoToPlayer();
                }}
                className="aero-btn-aqua px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Ouvir Agora</span>
              </button>

              <button
                onClick={() => setIsSavedHero(!isSavedHero)}
                className="aero-btn-glass px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md"
              >
                {isSavedHero ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Salvo na Coleção</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-sky-700" />
                    <span>Salvar na Coleção</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGAR POR CLIMA (Interactive Filter Tabs) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
            <span>Navegar por Clima</span>
          </h3>
          <span className="text-xs text-sky-700 font-medium">
            {filteredTracks.length} faixas disponíveis
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CLIMA_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                selectedFilter === filter
                  ? 'aero-btn-aqua shadow-sm scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-white shadow-xs'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* TOCADAS RECENTEMENTE (Jewel Case Album Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Tocadas Recentemente
          </h3>
          <button
            onClick={onGoToPlayer}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>Ver Tocador 3D</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredTracks.slice(0, 4).map((t) => {
            const isThisPlaying = isPlaying && currentTrack.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTrack(t);
                  if (!isPlaying || currentTrack.id !== t.id) onTogglePlay();
                }}
                className="group aero-glass-card aero-glass-card-interactive rounded-2xl p-3 cursor-pointer relative"
              >
                {/* Album Cover with Glass Reflection & Jewel Case Bezel */}
                <div className="relative aspect-square rounded-xl overflow-hidden border border-white/90 shadow-md mb-3 bg-sky-100">
                  <img
                    src={t.coverUrl}
                    alt={t.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gloss highlight arc overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none" />

                  {/* Play Overlay Button */}
                  <div className="absolute inset-0 bg-sky-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full aero-btn-aqua flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Playing Pulse Dot */}
                  {isThisPlaying && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Disc className="w-3 h-3 animate-spin" />
                      <span>TOCANDO</span>
                    </div>
                  )}
                </div>

                {/* Track Details */}
                <h4 className="font-semibold text-sm text-slate-900 truncate group-hover:text-sky-700 transition-colors">
                  {t.title}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {t.artist}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-sky-100/60 text-[11px] text-sky-800/80 font-mono-data">
                  <span>{t.durationFormatted}</span>
                  <span>{t.year}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MIXES DO DIA (Editorial Curated Sets) */}
      <section className="space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
          Mixes do Dia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mix 1 */}
          <div className="aero-glass-panel rounded-2xl p-5 border border-white/90 relative overflow-hidden group hover:border-cyan-300/80 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 p-0.5 shadow-md flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono-data font-semibold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-md">
                18 Faixas
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 mt-4 group-hover:text-cyan-700 transition-colors">
              Energia Cristalina
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Uplifting Trance & Progressive House com sintetizadores luminosos e viradas rápidas.
            </p>
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-sky-100">
              <span className="text-[11px] text-slate-500">1h 14m de duração</span>
              <button
                onClick={() => {
                  onSelectTrack(tracks[0]);
                  if (!isPlaying) onTogglePlay();
                }}
                className="aero-btn-aqua px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Ouvir</span>
              </button>
            </div>
          </div>

          {/* Mix 2 */}
          <div className="aero-glass-panel rounded-2xl p-5 border border-white/90 relative overflow-hidden group hover:border-cyan-300/80 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center text-white">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono-data font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                12 Faixas
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 mt-4 group-hover:text-emerald-700 transition-colors">
              Biosfera Matinal
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ambient sons da natureza, gotas cristalinas e texturas suaves para calmaria total.
            </p>
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-emerald-100">
              <span className="text-[11px] text-slate-500">52 min de duração</span>
              <button
                onClick={() => {
                  onSelectTrack(tracks[5] || tracks[0]);
                  if (!isPlaying) onTogglePlay();
                }}
                className="aero-btn-emerald px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Ouvir</span>
              </button>
            </div>
          </div>

          {/* Mix 3 */}
          <div className="aero-glass-panel rounded-2xl p-5 border border-white/90 relative overflow-hidden group hover:border-cyan-300/80 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 p-0.5 shadow-md flex items-center justify-center text-white">
                <Disc className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono-data font-semibold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md">
                15 Faixas
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 mt-4 group-hover:text-blue-700 transition-colors">
              Brisa Celeste
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Sintetizadores flutuantes inspirados no céu de verão para clareza mental e foco.
            </p>
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-blue-100">
              <span className="text-[11px] text-slate-500">1h 05m de duração</span>
              <button
                onClick={() => {
                  onSelectTrack(tracks[3] || tracks[0]);
                  if (!isPlaying) onTogglePlay();
                }}
                className="aero-btn-aqua px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Ouvir</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
