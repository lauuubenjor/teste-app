export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  durationFormatted: string;
  audioFormat: string; // e.g., "1411kbps WAV / 24-bit"
  year: number;
  coverUrl: string;
  genre: string;
  mood: string;
  bpm: number;
  synthPreset: 'trance2008' | 'aquaticDreams' | 'crystalWaters' | 'biosphere' | 'submarineBeats' | 'pureOxygen';
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  trackCount: number;
  duration: string;
  coverUrl: string;
  description: string;
  curator: string;
}

export interface EqualizerState {
  bands: {
    f60: number;   // -12 to +12 dB
    f230: number;
    f910: number;
    f3600: number;
    f14000: number;
  };
  surround: number;    // 0 to 100%
  bassReflex: number;  // 0 to 100%
  qtsSurround: boolean;
  ultraClarity: boolean;
  spatialReverb: boolean;
  preset: string;
}
