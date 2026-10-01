import { Track, Playlist, EqualizerState } from '../types/audio';

export const HERO_IMAGE = '/src/assets/images/hero_frutiger_vista_1790884670526.jpg';
export const ALBUM_AQUATIC_IMAGE = '/src/assets/images/album_aquatic_dreams_1790884682532.jpg';
export const ALBUM_CRYSTAL_IMAGE = '/src/assets/images/album_crystal_horizon_1790884691203.jpg';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Aquatic Dreams (Remastered)',
    artist: 'Solaris & TranceWaves',
    album: 'Aero Soundscape HD Audio',
    duration: 278, // 04:38
    durationFormatted: '04:38',
    audioFormat: '1411kbps WAV / 24-bit',
    year: 2008,
    coverUrl: ALBUM_AQUATIC_IMAGE,
    genre: 'Aqua Ambient',
    mood: 'Nostálgico & Cristalino',
    bpm: 128,
    synthPreset: 'aquaticDreams',
    isFavorite: true,
  },
  {
    id: 'track-2',
    title: 'Trance Sinfônico 2008',
    artist: 'NeoTrance Sanctuary',
    album: 'Utopian Web Chronicles',
    duration: 312,
    durationFormatted: '05:12',
    audioFormat: '1411kbps WAV / 24-bit',
    year: 2008,
    coverUrl: HERO_IMAGE,
    genre: 'Trance Clássico',
    mood: 'Eufórico & Energético',
    bpm: 138,
    synthPreset: 'trance2008',
    isFavorite: true,
  },
  {
    id: 'track-3',
    title: 'Crystal Waters',
    artist: 'Aero Vocal Trio',
    album: 'Pure Reflections',
    duration: 224,
    durationFormatted: '03:44',
    audioFormat: '96kHz FLAC / Lossless',
    year: 2007,
    coverUrl: ALBUM_CRYSTAL_IMAGE,
    genre: 'Aqua Ambient',
    mood: 'Relaxante & Sereno',
    bpm: 110,
    synthPreset: 'crystalWaters',
    isFavorite: false,
  },
  {
    id: 'track-4',
    title: 'Digital Horizon',
    artist: 'Solaris Panel',
    album: 'Vista Skylines',
    duration: 260,
    durationFormatted: '04:20',
    audioFormat: '1411kbps WAV / 24-bit',
    year: 2009,
    coverUrl: ALBUM_CRYSTAL_IMAGE,
    genre: 'Synth Chill',
    mood: 'Futurista & Otimista',
    bpm: 120,
    synthPreset: 'pureOxygen',
    isFavorite: true,
  },
  {
    id: 'track-5',
    title: 'Submarine Beats',
    artist: 'Breeze Nautical',
    album: 'Deep Ocean Odyssey',
    duration: 295,
    durationFormatted: '04:55',
    audioFormat: '320kbps MP3 Studio Pro',
    year: 2006,
    coverUrl: ALBUM_AQUATIC_IMAGE,
    genre: 'Liquid DnB',
    mood: 'Profundo & Rítmico',
    bpm: 165,
    synthPreset: 'submarineBeats',
    isFavorite: false,
  },
  {
    id: 'track-6',
    title: 'Biosfera Matinal',
    artist: 'Atmosphere 98',
    album: 'Natureza Sintética',
    duration: 215,
    durationFormatted: '03:35',
    audioFormat: '1411kbps WAV / 24-bit',
    year: 2008,
    coverUrl: HERO_IMAGE,
    genre: 'Aqua Ambient',
    mood: 'Revitalizante',
    bpm: 96,
    synthPreset: 'biosphere',
    isFavorite: true,
  },
  {
    id: 'track-7',
    title: 'Sol & Serenidade',
    artist: 'ClearWave & Mila Santos',
    album: 'Estação Cristal',
    duration: 242,
    durationFormatted: '04:02',
    audioFormat: '96kHz FLAC / Lossless',
    year: 2009,
    coverUrl: ALBUM_CRYSTAL_IMAGE,
    genre: 'Vaporwave',
    mood: 'Paz & Fluidez',
    bpm: 104,
    synthPreset: 'crystalWaters',
    isFavorite: false,
  },
  {
    id: 'track-8',
    title: 'Velocidade da Luz',
    artist: 'CyberDrift • Neo Disco',
    album: 'AeroPulse 2.0',
    duration: 208,
    durationFormatted: '03:28',
    audioFormat: '1411kbps WAV / 24-bit',
    year: 2007,
    coverUrl: ALBUM_AQUATIC_IMAGE,
    genre: 'Trance Clássico',
    mood: 'Velocidade & Adrenalina',
    bpm: 134,
    synthPreset: 'trance2008',
    isFavorite: true,
  }
];

export const FEATURED_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    name: 'Coleção AquaChill',
    trackCount: 24,
    duration: '1h 48m',
    coverUrl: ALBUM_AQUATIC_IMAGE,
    description: 'Imersão líquida, reverberações suaves e arpeggios transparentes para meditação e relaxamento.',
    curator: 'AeroSound Curadoria'
  },
  {
    id: 'pl-2',
    name: 'Vibrações de Verão 2008',
    trackCount: 32,
    duration: '2h 15m',
    coverUrl: HERO_IMAGE,
    description: 'A trilha sonora solar definitiva dos anos 2000: batidas uplifting, sintetizadores e céu azul infinito.',
    curator: 'Alex Silva'
  },
  {
    id: 'pl-3',
    name: 'Trance Sinfônico',
    trackCount: 18,
    duration: '1h 22m',
    coverUrl: ALBUM_CRYSTAL_IMAGE,
    description: 'Grandes progressões de acordes épicos e orquestrações eletrônicas com fidelidade 1411kbps.',
    curator: 'DuDisc Masters'
  },
  {
    id: 'pl-4',
    name: 'Foco & Relaxamento',
    trackCount: 40,
    duration: '3h 10m',
    coverUrl: HERO_IMAGE,
    description: 'Frequências binaurais de clareza mental e texturas sonoras de águas calmas para produtividade máxima.',
    curator: 'Biosfera Labs'
  }
];

export const INITIAL_EQ_STATE: EqualizerState = {
  bands: {
    f60: 3.5,
    f230: 1.5,
    f910: 0.0,
    f3600: 2.8,
    f14000: 4.0,
  },
  surround: 65,
  bassReflex: 75,
  qtsSurround: true,
  ultraClarity: true,
  spatialReverb: true,
  preset: 'Frutiger Euphoria'
};

export const EQ_PRESETS: Record<string, { bands: EqualizerState['bands']; surround: number; bassReflex: number }> = {
  'Frutiger Euphoria': {
    bands: { f60: 4.0, f230: 2.0, f910: 0.5, f3600: 3.5, f14000: 4.5 },
    surround: 70,
    bassReflex: 80,
  },
  'Trance Club 2008': {
    bands: { f60: 6.0, f230: 3.0, f910: -1.0, f3600: 4.0, f14000: 5.5 },
    surround: 85,
    bassReflex: 95,
  },
  'Crystal Vocal': {
    bands: { f60: -1.0, f230: 1.0, f910: 3.5, f3600: 4.5, f14000: 3.0 },
    surround: 45,
    bassReflex: 40,
  },
  'Deep Water Bass': {
    bands: { f60: 8.0, f230: 5.0, f910: 0.0, f3600: -1.5, f14000: 0.5 },
    surround: 60,
    bassReflex: 100,
  },
  'Flat Studio': {
    bands: { f60: 0.0, f230: 0.0, f910: 0.0, f3600: 0.0, f14000: 0.0 },
    surround: 0,
    bassReflex: 0,
  }
};
