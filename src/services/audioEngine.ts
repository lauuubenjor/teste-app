/**
 * AeroSound Web Audio Engine
 * Real-time synthesis of Frutiger Aero / Trance / Aqua Ambient soundscapes
 * + 5-band Biquad Equalizer, Spatial 3D Surround, Bass Reflex, and AnalyserNode.
 */

import { EqualizerState } from '../types/audio';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  
  // Equalizer nodes
  private eq60: BiquadFilterNode | null = null;
  private eq230: BiquadFilterNode | null = null;
  private eq910: BiquadFilterNode | null = null;
  private eq3600: BiquadFilterNode | null = null;
  private eq14000: BiquadFilterNode | null = null;
  
  // Bass Reflex & Spatial modules
  private bassBooster: BiquadFilterNode | null = null;
  private clarityBooster: BiquadFilterNode | null = null;
  private delayNodeL: DelayNode | null = null;
  private delayNodeR: DelayNode | null = null;
  private pannerNode: StereoPannerNode | null = null;

  // Synthesis & Playback scheduling
  private isPlaying: boolean = false;
  private synthInterval: number | null = null;
  private synthStep: number = 0;
  private currentPreset: string = 'aquaticDreams';

  // Custom audio file playback
  private customBufferSource: AudioBufferSourceNode | null = null;
  private customBuffer: AudioBuffer | null = null;
  private playbackStartTime: number = 0;
  private pausedAtTime: number = 0;
  private isCustomAudio: boolean = false;

  private onTimeUpdateCallback: ((currentTime: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private animFrameId: number | null = null;

  constructor() {
    // Lazy init on first user interaction
  }

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.85;

    // 5-band EQ
    this.eq60 = this.ctx.createBiquadFilter();
    this.eq60.type = 'lowshelf';
    this.eq60.frequency.value = 60;
    this.eq60.gain.value = 2.0;

    this.eq230 = this.ctx.createBiquadFilter();
    this.eq230.type = 'peaking';
    this.eq230.frequency.value = 230;
    this.eq230.Q.value = 1.0;
    this.eq230.gain.value = 1.0;

    this.eq910 = this.ctx.createBiquadFilter();
    this.eq910.type = 'peaking';
    this.eq910.frequency.value = 910;
    this.eq910.Q.value = 1.0;
    this.eq910.gain.value = 0.0;

    this.eq3600 = this.ctx.createBiquadFilter();
    this.eq3600.type = 'peaking';
    this.eq3600.frequency.value = 3600;
    this.eq3600.Q.value = 1.0;
    this.eq3600.gain.value = 2.5;

    this.eq14000 = this.ctx.createBiquadFilter();
    this.eq14000.type = 'highshelf';
    this.eq14000.frequency.value = 14000;
    this.eq14000.gain.value = 3.0;

    // Bass Reflex Node
    this.bassBooster = this.ctx.createBiquadFilter();
    this.bassBooster.type = 'lowshelf';
    this.bassBooster.frequency.value = 90;
    this.bassBooster.gain.value = 3.5;

    // UltraClarity Node
    this.clarityBooster = this.ctx.createBiquadFilter();
    this.clarityBooster.type = 'peaking';
    this.clarityBooster.frequency.value = 4500;
    this.clarityBooster.Q.value = 0.7;
    this.clarityBooster.gain.value = 2.0;

    // Spatial panner
    if (this.ctx.createStereoPanner) {
      this.pannerNode = this.ctx.createStereoPanner();
      this.pannerNode.pan.value = 0;
    }

    // Connect DSP chain:
    // EQ Chain -> BassBooster -> ClarityBooster -> Panner -> Analyser -> MasterGain -> Destination
    this.eq60.connect(this.eq230);
    this.eq230.connect(this.eq910);
    this.eq910.connect(this.eq3600);
    this.eq3600.connect(this.eq14000);
    this.eq14000.connect(this.bassBooster);
    this.bassBooster.connect(this.clarityBooster);

    if (this.pannerNode) {
      this.clarityBooster.connect(this.pannerNode);
      this.pannerNode.connect(this.analyser);
    } else {
      this.clarityBooster.connect(this.analyser);
    }

    this.analyser.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  public getAudioInputNode(): AudioNode | null {
    this.init();
    return this.eq60;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public updateEqualizer(state: EqualizerState) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.eq60) this.eq60.gain.setTargetAtTime(state.bands.f60, now, 0.05);
    if (this.eq230) this.eq230.gain.setTargetAtTime(state.bands.f230, now, 0.05);
    if (this.eq910) this.eq910.gain.setTargetAtTime(state.bands.f910, now, 0.05);
    if (this.eq3600) this.eq3600.gain.setTargetAtTime(state.bands.f3600, now, 0.05);
    if (this.eq14000) this.eq14000.gain.setTargetAtTime(state.bands.f14000, now, 0.05);

    if (this.bassBooster) {
      const boostGain = (state.bassReflex / 100) * 8;
      this.bassBooster.gain.setTargetAtTime(boostGain, now, 0.05);
    }

    if (this.clarityBooster) {
      const clarityGain = state.ultraClarity ? 4.5 : 0;
      this.clarityBooster.gain.setTargetAtTime(clarityGain, now, 0.05);
    }
  }

  public getFrequencyData(array: Uint8Array): void {
    if (this.analyser) {
      // Type assertion for TS strict typed array compatibility
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    }
  }

  public playTrack(preset: string = 'aquaticDreams', customAudioBuffer?: AudioBuffer) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.currentPreset = preset;

    if (customAudioBuffer) {
      this.playCustomBuffer(customAudioBuffer);
    } else {
      this.isCustomAudio = false;
      this.startSynthEngine();
    }

    this.startTrackingLoop();
  }

  public pause() {
    this.isPlaying = false;
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.customBufferSource) {
      try {
        this.customBufferSource.stop();
      } catch {
        // ignore
      }
      this.customBufferSource = null;
      if (this.ctx) {
        this.pausedAtTime = (this.ctx.currentTime - this.playbackStartTime);
      }
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public resume() {
    if (this.isCustomAudio && this.customBuffer) {
      this.playCustomBuffer(this.customBuffer, this.pausedAtTime);
    } else {
      this.playTrack(this.currentPreset);
    }
  }

  public seek(seconds: number) {
    this.pausedAtTime = seconds;
    if (this.isPlaying) {
      if (this.isCustomAudio && this.customBuffer) {
        this.pause();
        this.playCustomBuffer(this.customBuffer, seconds);
      } else {
        this.playbackStartTime = (this.ctx?.currentTime || 0) - seconds;
      }
    }
  }

  public setTimeUpdateListener(callback: (currentTime: number) => void) {
    this.onTimeUpdateCallback = callback;
  }

  public setEndListener(callback: () => void) {
    this.onEndCallback = callback;
  }

  public async loadAudioFile(file: File): Promise<AudioBuffer> {
    this.init();
    if (!this.ctx) throw new Error('AudioContext not ready');
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.customBuffer = audioBuffer;
    return audioBuffer;
  }

  private playCustomBuffer(buffer: AudioBuffer, offset: number = 0) {
    if (!this.ctx || !this.eq60) return;
    this.isCustomAudio = true;
    this.customBuffer = buffer;

    if (this.customBufferSource) {
      try { this.customBufferSource.stop(); } catch {}
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.eq60);

    const safeOffset = Math.max(0, Math.min(offset, buffer.duration));
    source.start(0, safeOffset);
    this.playbackStartTime = this.ctx.currentTime - safeOffset;
    this.customBufferSource = source;

    source.onended = () => {
      if (this.isPlaying && this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  private startTrackingLoop() {
    const loop = () => {
      if (!this.isPlaying || !this.ctx) return;
      const current = this.ctx.currentTime - this.playbackStartTime;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(Math.max(0, current));
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(loop);
  }

  /**
   * Procedural Frutiger Aero Synthesizer Engine
   * Generates nostalgic uplifting trance arpeggios, warm water pads, and ocean bubbles!
   */
  private startSynthEngine() {
    if (!this.ctx || !this.eq60) return;
    if (this.synthInterval) window.clearInterval(this.synthInterval);

    this.playbackStartTime = this.ctx.currentTime - this.pausedAtTime;
    this.synthStep = 0;

    // Trance chord frequencies (D minor, F major, C major, Bb major)
    const chords = [
      [146.83, 220.00, 261.63, 349.23], // Dm7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [130.81, 196.00, 261.63, 329.63], // Cmaj
      [116.54, 174.61, 233.08, 349.23], // Bbmaj7
    ];

    // High arpeggio notes (D4, F4, A4, C5, E5, D5, A4, F4)
    const arpNotes = [293.66, 349.23, 440.00, 523.25, 659.25, 587.33, 440.00, 349.23];

    // Start background pad immediately
    this.playAmbientOceanPad();

    // 128 BPM 16th notes -> ~117ms per step
    const intervalMs = 117;
    this.synthInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.eq60) return;

      const step = this.synthStep % 32;
      const chordIdx = Math.floor(step / 8);
      const currentChord = chords[chordIdx];

      // Arpeggio note (every 16th note)
      const noteFreq = arpNotes[step % arpNotes.length] * (step % 16 > 8 ? 1.5 : 1.0);
      this.playArpPluck(noteFreq);

      // Bass note on beats 0, 4, 8, 12, etc. (syncopated offbeat trance bass)
      if (step % 2 === 1) {
        this.playTranceBass(currentChord[0] * 0.5);
      }

      // Water bubble / sparkle sound effect every 8 steps
      if (step % 8 === 0) {
        this.playWaterBubbleEffect();
      }

      // Soft rhythmic kick & hi-hat
      if (step % 4 === 0) {
        this.playKick();
      }
      if (step % 2 === 1) {
        this.playHiHat();
      }

      this.synthStep++;
    }, intervalMs);
  }

  private playArpPluck(freq: number) {
    if (!this.ctx || !this.eq60) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.02);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.16);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.eq60);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  private playTranceBass(freq: number) {
    if (!this.ctx || !this.eq60) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.eq60);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  private playWaterBubbleEffect() {
    if (!this.ctx || !this.eq60) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency chirp from 600Hz up to 1400Hz (classic bubble sound)
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.09);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(this.eq60);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  private playKick() {
    if (!this.ctx || !this.eq60) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.08);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.eq60);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  private playHiHat() {
    if (!this.ctx || !this.eq60) return;
    const now = this.ctx.currentTime;

    // Noise buffer for crisp hat
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.eq60);

    noise.start(now);
    noise.stop(now + 0.05);
  }

  private playAmbientOceanPad() {
    if (!this.ctx || !this.eq60) return;
    const now = this.ctx.currentTime;

    // Dual detuned supersaw pad
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(220, now); // A3
    osc2.frequency.setValueAtTime(221.8, now); // +detune

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.value = 3.0;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.eq60);

    osc1.start(now);
    osc2.start(now);

    // Stop after 16 seconds loop
    osc1.stop(now + 16);
    osc2.stop(now + 16);
  }
}

export const audioEngine = new AudioEngine();
