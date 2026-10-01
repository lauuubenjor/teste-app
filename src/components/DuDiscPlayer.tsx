import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, 
  Volume2, VolumeX, Sparkles, Upload, Radio, Heart
} from 'lucide-react';
import { Track } from '../types/audio';
import { audioEngine } from '../services/audioEngine';

interface DuDiscPlayerProps {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSelectTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
}

export const DuDiscPlayer: React.FC<DuDiscPlayerProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleFavorite,
}) => {
  const [currentTime, setCurrentTime] = useState(135); // 02:15 default
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [bars, setBars] = useState<number[]>(new Array(24).fill(12));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync real-time playback position
  useEffect(() => {
    audioEngine.setTimeUpdateListener((time) => {
      setCurrentTime(time);
    });
  }, []);

  // Real-time audio frequency analyser animation loop
  useEffect(() => {
    let animId: number;
    const freqData = new Uint8Array(64);

    const updateVisualizer = () => {
      if (isPlaying) {
        audioEngine.getFrequencyData(freqData);
        // sample 24 bands from the frequency spectrum
        const newBars: number[] = [];
        for (let i = 0; i < 24; i++) {
          const raw = freqData[Math.floor((i / 24) * 32)] || 0;
          // normalize between 8px and 64px
          const height = Math.max(8, Math.min(68, (raw / 255) * 64 + Math.random() * 4));
          newBars.push(height);
        }
        setBars(newBars);
      } else {
        // Idle gentle pulse
        setBars(prev => prev.map((_, i) => 10 + Math.sin(Date.now() / 300 + i * 0.4) * 6));
      }
      animId = requestAnimationFrame(updateVisualizer);
    };

    animId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioEngine.seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted) setIsMuted(false);
    audioEngine.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await audioEngine.loadAudioFile(file);
      // Play loaded custom buffer
      audioEngine.playTrack(track.synthPreset, buffer);
      if (!isPlaying) onTogglePlay();
    } catch (err) {
      console.error('Failed to load audio file', err);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto aero-glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Subtle glossy background light cone */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-300/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

      {/* Header bar of DuDisc Player */}
      <div className="flex items-center justify-between pb-4 border-b border-white/60 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-sky-800">
            DuDisc — Now Playing
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(track.id)}
            className={`p-2 rounded-full border transition-colors ${
              track.isFavorite
                ? 'bg-rose-50 text-rose-500 border-rose-200'
                : 'bg-white/60 text-slate-500 hover:text-rose-500 border-white/80'
            }`}
            title="Adicionar aos Favoritos"
          >
            <Heart className={`w-4 h-4 ${track.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-sky-700 text-xs font-semibold border border-white shadow-xs transition-colors"
            title="Importar faixa própria do seu computador"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Carregar MP3</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* THE 3D HOLOGRAPHIC COMPACT DISC (DuDisc) */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outer Jewel Case Tray / Aqua Well */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-3.5 bg-gradient-to-b from-white/90 via-sky-100/60 to-cyan-200/50 shadow-[inset_0_4px_12px_rgba(0,100,180,0.2),0_12px_32px_rgba(0,110,180,0.22)] border border-white flex items-center justify-center">
          
          {/* Subtle Water Caustic Ring */}
          <div className="absolute inset-1.5 rounded-full border border-sky-300/40 pointer-events-none" />

          {/* Rotating Holographic Disc Body */}
          <div
            className={`relative w-full h-full rounded-full cd-disc-surface flex items-center justify-center overflow-hidden transition-transform duration-700 ${
              isPlaying ? 'animate-spin-cd' : ''
            }`}
          >
            {/* Holographic Iridescent Sheen Layer */}
            <div className="absolute inset-0 cd-holographic-sheen pointer-events-none" />

            {/* Concentric Disc Grooves */}
            <div className="absolute inset-4 rounded-full border border-sky-200/40 pointer-events-none" />
            <div className="absolute inset-8 rounded-full border border-sky-200/30 pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-sky-100/40 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-white/30 pointer-events-none" />

            {/* Disc Printed Silk Screen Graphics */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-7 pointer-events-none select-none">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-950/80 drop-shadow-xs">
                AEROSOUND COMPACT DISC
              </span>
              <div className="flex items-center justify-between w-full px-4 text-[9px] font-bold text-sky-900/70">
                <span>DIGITAL AUDIO</span>
                <span>HD STEREO 24B</span>
              </div>
              <span className="text-[9.5px] font-semibold text-sky-950/75 truncate max-w-[170px] drop-shadow-xs">
                {track.title}
              </span>
            </div>

            {/* Chrome Hub Spindle */}
            <div className="relative w-20 h-20 rounded-full chrome-ring p-1 flex items-center justify-center shadow-lg">
              {/* Center Transparent Clamping Ring */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-white/95 to-sky-100/80 border border-white/90 flex items-center justify-center shadow-inner">
                {/* Center Spindle Hole */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-sky-900 via-sky-950 to-slate-900 border-2 border-white shadow-inner flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 shadow-[0_0_6px_#22d3ee]" />
                </div>
              </div>
            </div>

            {/* Specular Light Reflection Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Track Metadata Zone */}
      <div className="text-center mt-5 mb-4">
        {/* Specs kicker */}
        <p className="text-[11px] font-semibold tracking-wider text-sky-700 uppercase mb-1">
          {track.album} · {track.audioFormat}
        </p>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight text-balance">
          {track.title}
        </h2>
        <p className="text-sm font-medium text-slate-600 mt-0.5">
          {track.artist}
        </p>
      </div>

      {/* Real-time Dynamic Spectrum Visualizer */}
      <div className="my-4 px-2 py-3 rounded-2xl bg-gradient-to-b from-sky-950/10 to-sky-950/25 border border-sky-300/40 backdrop-blur-md">
        <div className="flex items-end justify-center gap-1.5 h-14 px-2">
          {bars.map((height, i) => (
            <div
              key={i}
              className="w-2 rounded-t-full transition-all duration-75"
              style={{
                height: `${height}px`,
                background: `linear-gradient(180deg, #67e8f9 0%, #06b6d4 40%, #10b981 100%)`,
                boxShadow: isPlaying ? '0 0 8px rgba(6, 182, 212, 0.45)' : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between px-3 mt-1.5 text-[10px] font-mono-data text-sky-800/80">
          <span>60Hz</span>
          <span>500Hz</span>
          <span>2.4kHz</span>
          <span>8kHz</span>
          <span>16kHz</span>
        </div>
      </div>

      {/* Time Scrubber */}
      <div className="space-y-1.5 mt-5">
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max={track.duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-sky-200/80 accent-cyan-500 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #0ea5e9 ${
                (currentTime / track.duration) * 100
              }%, #bae6fd ${(currentTime / track.duration) * 100}%)`,
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs font-mono-data font-semibold text-sky-900">
          <span>{formatSeconds(currentTime)}</span>
          <span>{track.durationFormatted}</span>
        </div>
      </div>

      {/* Transport Controls (Iconic Skeuomorphic Buttons) */}
      <div className="flex items-center justify-between gap-3 mt-6 pt-2">
        <button
          onClick={() => setIsShuffle(!isShuffle)}
          className={`p-3 rounded-full transition-colors ${
            isShuffle ? 'text-cyan-600 bg-cyan-100/80' : 'text-slate-500 hover:text-sky-700'
          }`}
          title="Modo Aleatório"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onPrevTrack}
            className="w-12 h-12 rounded-full aero-btn-glass flex items-center justify-center transition-transform active:scale-95 shadow-md"
            title="Faixa Anterior"
          >
            <SkipBack className="w-5 h-5 text-sky-900 fill-current" />
          </button>

          {/* Master Play/Pause Sphere (The centerpiece button) */}
          <button
            onClick={onTogglePlay}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full aero-btn-aqua flex items-center justify-center transition-transform active:scale-95 shadow-xl group"
            title={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current drop-shadow-md" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current drop-shadow-md ml-1" />
            )}
          </button>

          <button
            onClick={onNextTrack}
            className="w-12 h-12 rounded-full aero-btn-glass flex items-center justify-center transition-transform active:scale-95 shadow-md"
            title="Próxima Faixa"
          >
            <SkipForward className="w-5 h-5 text-sky-900 fill-current" />
          </button>
        </div>

        <button
          onClick={() => setIsRepeat(!isRepeat)}
          className={`p-3 rounded-full transition-colors ${
            isRepeat ? 'text-cyan-600 bg-cyan-100/80' : 'text-slate-500 hover:text-sky-700'
          }`}
          title="Repetir Faixa"
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Status / Volume Control */}
      <div className="mt-6 pt-4 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Audio Engine Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-900 font-semibold text-[11px]">
          <Radio className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
          <span>AquaBreeze 2.1 — Spatial Virtualizer Ativo</span>
        </div>

        {/* Volume Scrubber */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={toggleMute} className="text-sky-800 hover:text-sky-950 p-1">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1.5 rounded-lg appearance-none cursor-pointer bg-sky-200/80 accent-cyan-600"
          />
          <span className="text-[10px] font-mono-data text-sky-900 w-8">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
