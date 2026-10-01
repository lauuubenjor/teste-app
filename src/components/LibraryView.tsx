import React, { useState } from 'react';
import { 
  FolderHeart, HardDrive, Plus, Play, Heart, Disc3, 
  Search, Music, Check, Sparkles
} from 'lucide-react';
import { Track, Playlist } from '../types/audio';
import { FEATURED_PLAYLISTS } from '../data/mockTracks';

interface LibraryViewProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onToggleFavorite: (trackId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'albuns' | 'artistas' | 'favoritos'>('playlists');
  const [searchQuery, setSearchQuery] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>(FEATURED_PLAYLISTS);
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const filteredTracks = tracks.filter((t) => {
    if (activeTab === 'favoritos' && !t.isFavorite) return false;
    if (!searchQuery) return true;
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      trackCount: 0,
      duration: '0m',
      coverUrl: tracks[0]?.coverUrl || '',
      description: 'Playlist personalizada criada no AeroSound.',
      curator: 'Você'
    };

    setPlaylists([newPl, ...playlists]);
    setNewPlaylistName('');
    setShowNewPlaylistModal(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Minha Biblioteca
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-800 font-medium mt-1">
            <span>1.432 Músicas</span>
            <span aria-hidden="true">·</span>
            <span>48 Álbuns</span>
            <span aria-hidden="true">·</span>
            <span>62 Horas de Áudio</span>
          </div>
        </div>

        {/* Create playlist button */}
        <button
          onClick={() => setShowNewPlaylistModal(true)}
          className="aero-btn-aqua self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Playlist</span>
        </button>
      </div>

      {/* Storage & Local Cache Meter (Directly matching Screen 4) */}
      <div className="aero-glass-panel rounded-2xl p-4 sm:p-5 border border-white/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
            <HardDrive className="w-4 h-4 text-cyan-600" />
            <span>Armazenamento Local Aero (Cache Lossless)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-sky-800">
            <span className="font-bold text-cyan-700">65% preenchido</span>
            <span>·</span>
            <span>4.2 GB livres de 12.0 GB</span>
          </div>
        </div>

        {/* Glossy Aqua Progress Meter */}
        <div className="relative w-full h-3 rounded-full bg-sky-200/80 overflow-hidden p-0.5 border border-white/80 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 shadow-sm transition-all duration-500 relative"
            style={{ width: '65%' }}
          >
            {/* Top Gloss highlight line */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/50 rounded-t-full pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search and Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md rounded-xl border border-white/80 overflow-x-auto">
          {(['playlists', 'albuns', 'artistas', 'favoritos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'aero-btn-aqua shadow-xs'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/60'
              }`}
            >
              {tab === 'albuns' ? 'Álbuns' : tab === 'favoritos' ? 'Favoritos ❤️' : tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-700" />
          <input
            type="text"
            placeholder="Buscar por faixa ou artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/80 border border-white/90 focus:border-cyan-400 focus:bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-none shadow-xs transition-all"
          />
        </div>
      </div>

      {/* FEATURED PLAYLISTS SECTION (Screen 4) */}
      {activeTab === 'playlists' && (
        <section className="space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Playlists em Destaque
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => {
                  onSelectTrack(tracks[0]);
                  if (!isPlaying) onTogglePlay();
                }}
                className="group aero-glass-card aero-glass-card-interactive rounded-2xl p-3.5 cursor-pointer relative"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/90 shadow-md mb-3 bg-sky-200">
                  <img
                    src={pl.coverUrl}
                    alt={pl.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-mono-data">
                    <span className="font-semibold">{pl.trackCount} faixas</span>
                    <span>{pl.duration}</span>
                  </div>

                  <div className="absolute inset-0 bg-sky-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full aero-btn-aqua flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-cyan-700 transition-colors">
                  {pl.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {pl.description}
                </p>
                <div className="mt-2 pt-2 border-t border-sky-100/60 flex items-center justify-between text-[10.5px] text-sky-800 font-medium">
                  <span>{pl.curator}</span>
                  <span className="text-cyan-700 font-bold">AeroHD</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRACKS LIST SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            {activeTab === 'favoritos' ? 'Músicas Favoritas' : 'Músicas Recentes'}
          </h2>
          <span className="text-xs font-mono-data text-sky-800">
            {filteredTracks.length} faixas listadas
          </span>
        </div>

        <div className="aero-glass-panel rounded-2xl overflow-hidden border border-white/90 shadow-md divide-y divide-sky-100/70">
          {filteredTracks.length === 0 ? (
            <div className="p-8 text-center">
              <Music className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Nenhuma faixa encontrada</p>
              <p className="text-xs text-slate-500 mt-0.5">Tente ajustar o termo de pesquisa ou filtros.</p>
            </div>
          ) : (
            filteredTracks.map((t, index) => {
              const isThisPlaying = isPlaying && currentTrack.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTrack(t);
                    if (!isPlaying || currentTrack.id !== t.id) onTogglePlay();
                  }}
                  className={`flex items-center justify-between gap-3 p-3 sm:px-4 cursor-pointer transition-colors ${
                    isThisPlaying
                      ? 'bg-sky-100/80'
                      : 'hover:bg-white/60'
                  }`}
                >
                  {/* Left: Index / Play Icon & Artwork */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono-data text-slate-400 w-4 text-center shrink-0">
                      {index + 1}
                    </span>

                    <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white shadow-xs bg-sky-100">
                      <img
                        src={t.coverUrl}
                        alt={t.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isThisPlaying && (
                        <div className="absolute inset-0 bg-sky-900/60 flex items-center justify-center">
                          <Disc3 className="w-5 h-5 text-cyan-300 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className={`text-xs sm:text-sm font-semibold truncate ${
                        isThisPlaying ? 'text-sky-800 font-bold' : 'text-slate-900'
                      }`}>
                        {t.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {t.artist} · <span className="text-sky-700/80">{t.album}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Audio specs & actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block text-[11px] font-mono-data text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {t.audioFormat}
                    </span>

                    <span className="text-xs font-mono-data text-slate-500">
                      {t.durationFormatted}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(t.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        t.isFavorite
                          ? 'text-rose-500 hover:text-rose-600'
                          : 'text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${t.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Modal for creating a new playlist */}
      {showNewPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm">
          <div className="w-full max-w-md aero-glass-panel rounded-3xl p-6 border border-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Criar Nova Playlist Aero
              </h3>
              <button
                onClick={() => setShowNewPlaylistModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Playlist
                </label>
                <input
                  type="text"
                  placeholder="Ex: Noites de Verão 2008..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/90 border border-sky-200 text-sm focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlaylistModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="aero-btn-aqua px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Criar Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
