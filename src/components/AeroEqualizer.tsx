import React, { useEffect, useRef, useState } from 'react';
import { Sliders, Sparkles, Volume2, Activity, RotateCcw, Zap } from 'lucide-react';
import { EqualizerState } from '../types/audio';
import { audioEngine } from '../services/audioEngine';
import { EQ_PRESETS } from '../data/mockTracks';

interface AeroEqualizerProps {
  eqState: EqualizerState;
  onChangeEqState: (newState: EqualizerState) => void;
  isPlaying: boolean;
}

export const AeroEqualizer: React.FC<AeroEqualizerProps> = ({
  eqState,
  onChangeEqState,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live Spectrogram canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const freqData = new Uint8Array(64);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let y = 20; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (isPlaying) {
        audioEngine.getFrequencyData(freqData);
      }

      // Draw dynamic glowing spectrum bars
      const numBars = 32;
      const barWidth = (w - (numBars - 1) * 3) / numBars;

      for (let i = 0; i < numBars; i++) {
        let val = isPlaying ? freqData[i] || 0 : 15 + Math.sin(Date.now() / 400 + i * 0.3) * 10;
        // Apply EQ band influence visually
        if (i < 6) val = Math.min(255, val * (1 + eqState.bands.f60 / 18));
        else if (i < 12) val = Math.min(255, val * (1 + eqState.bands.f230 / 18));
        else if (i < 18) val = Math.min(255, val * (1 + eqState.bands.f910 / 18));
        else if (i < 24) val = Math.min(255, val * (1 + eqState.bands.f3600 / 18));
        else val = Math.min(255, val * (1 + eqState.bands.f14000 / 18));

        const barHeight = Math.max(4, (val / 255) * (h - 20));
        const x = i * (barWidth + 3);
        const y = h - barHeight;

        // Gradient from cyan to lime green
        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, '#67e8f9');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, '#10b981');

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
        ctx.shadowBlur = isPlaying ? 6 : 0;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, eqState]);

  const handleBandChange = (band: keyof EqualizerState['bands'], val: number) => {
    const updated: EqualizerState = {
      ...eqState,
      preset: 'Personalizado',
      bands: {
        ...eqState.bands,
        [band]: val,
      },
    };
    onChangeEqState(updated);
    audioEngine.updateEqualizer(updated);
  };

  const handlePresetSelect = (name: string) => {
    const presetData = EQ_PRESETS[name];
    if (!presetData) return;
    const updated: EqualizerState = {
      ...eqState,
      preset: name,
      bands: presetData.bands,
      surround: presetData.surround,
      bassReflex: presetData.bassReflex,
    };
    onChangeEqState(updated);
    audioEngine.updateEqualizer(updated);
  };

  const handleKnobChange = (param: 'surround' | 'bassReflex', val: number) => {
    const updated: EqualizerState = {
      ...eqState,
      preset: 'Personalizado',
      [param]: val,
    };
    onChangeEqState(updated);
    audioEngine.updateEqualizer(updated);
  };

  const handleToggleModule = (param: 'qtsSurround' | 'ultraClarity' | 'spatialReverb') => {
    const updated: EqualizerState = {
      ...eqState,
      [param]: !eqState[param],
    };
    onChangeEqState(updated);
    audioEngine.updateEqualizer(updated);
  };

  const bandsConfig = [
    { key: 'f60' as const, label: '60 Hz', sub: 'Sub-Grave' },
    { key: 'f230' as const, label: '230 Hz', sub: 'Grave' },
    { key: 'f910' as const, label: '910 Hz', sub: 'Médio' },
    { key: 'f3600' as const, label: '3.6 kHz', sub: 'Médio-Alto' },
    { key: 'f14000' as const, label: '14 kHz', sub: 'Agudo' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              AeroEQ Pro — Equalizador & Visualizador
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-sky-800 font-medium mt-1">
            Controle analógico paramétrico e processamento de áudio espacial em tempo real.
          </p>
        </div>

        {/* Current Preset Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/90 border border-cyan-200 text-xs font-bold text-sky-950">
          <Zap className="w-3.5 h-3.5 text-cyan-600" />
          <span>Preset: {eqState.preset}</span>
        </div>
      </div>

      {/* Preset Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {Object.keys(EQ_PRESETS).map((pName) => (
          <button
            key={pName}
            onClick={() => handlePresetSelect(pName)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              eqState.preset === pName
                ? 'aero-btn-aqua shadow-sm scale-102'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-white shadow-xs'
            }`}
          >
            {pName}
          </button>
        ))}
      </div>

      {/* 3D Spectrogram Screen (Screen 5) */}
      <div className="aero-glass-panel rounded-3xl p-5 border border-white/90 shadow-xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-900">
            <Activity className="w-4 h-4 text-cyan-600" />
            <span>AeroFX Spectrogram 3D — Real-Time FFT</span>
          </div>
          <span className="text-[11px] font-mono-data text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md">
            24-Bit Lossless DSP
          </span>
        </div>

        {/* Canvas Screen with Dark Aero Glass background */}
        <div className="relative rounded-2xl bg-gradient-to-b from-sky-950/90 via-slate-900 to-sky-950 p-2 border border-sky-400/30 shadow-inner">
          <canvas
            ref={canvasRef}
            width={720}
            height={140}
            className="w-full h-32 sm:h-36 block rounded-xl"
          />
          <div className="absolute top-3 left-4 text-[10px] font-mono-data text-cyan-300/70 tracking-widest">
            FREQUENCY RESPONSE: 20Hz - 22kHz
          </div>
        </div>
      </div>

      {/* 5-Band Analog Graphic Faders */}
      <div className="aero-glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-sky-100">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Bandas Analógicas Gráficas
            </h3>
            <p className="text-xs text-slate-500">Escala de Ganho em Decibéis (+12dB a -12dB)</p>
          </div>
          <button
            onClick={() => handlePresetSelect('Flat Studio')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 hover:text-sky-950 hover:bg-sky-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar Flat</span>
          </button>
        </div>

        {/* Faders Grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-6 py-2">
          {bandsConfig.map((band) => {
            const val = eqState.bands[band.key];
            return (
              <div key={band.key} className="flex flex-col items-center">
                {/* dB value reading */}
                <span className="text-xs font-mono-data font-bold text-sky-900 mb-2">
                  {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}dB
                </span>

                {/* Vertical Slider Track Container */}
                <div className="relative h-44 sm:h-52 w-10 sm:w-12 bg-gradient-to-b from-sky-200/90 to-sky-100/90 rounded-2xl p-2 border border-white shadow-inner flex flex-col items-center justify-between">
                  {/* Tick Marks */}
                  <div className="absolute inset-y-4 left-1.5 flex flex-col justify-between text-[8px] font-mono-data text-sky-800/60 pointer-events-none select-none">
                    <span>+12</span>
                    <span>+6</span>
                    <span>0</span>
                    <span>-6</span>
                    <span>-12</span>
                  </div>

                  {/* Vertical Range Input */}
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={val}
                    onChange={(e) => handleBandChange(band.key, parseFloat(e.target.value))}
                    className="w-36 sm:w-44 h-8 appearance-none cursor-pointer bg-transparent -rotate-90 origin-center absolute top-1/2 -translate-y-1/2 accent-cyan-500"
                    style={{
                      WebkitAppearance: 'none',
                    }}
                  />
                </div>

                {/* Frequency Labels */}
                <span className="text-xs font-bold text-slate-800 mt-3">{band.label}</span>
                <span className="text-[10px] text-slate-500">{band.sub}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analog Rotary Potentiometers (Screen 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Potentiometer 1: 3D Surround Aqua */}
        <div className="aero-glass-panel rounded-3xl p-6 border border-white/90 shadow-xl flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
            Potenciômetro Analógico 01
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900">
            3D Surround Aqua
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-6">
            Espacialização tridimensional com reverberação estéreo emulada.
          </p>

          {/* Rotary Dial Visualizer */}
          <div className="relative w-32 h-32 rounded-full chrome-ring p-2 flex items-center justify-center shadow-2xl mb-4">
            {/* LED Arc Indicator */}
            <div
              className="absolute inset-0 rounded-full border-4 border-cyan-400 shadow-[0_0_12px_#38bdf8] pointer-events-none"
              style={{
                clipPath: `polygon(50% 50%, 0 0, ${eqState.surround}% 0, 100% 100%, 0 100%)`,
              }}
            />

            {/* Inner Metallic Knob */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-b from-slate-100 to-slate-300 border border-white shadow-md flex items-center justify-center">
              {/* Center Gloss Highlight */}
              <div
                className="w-1.5 h-7 rounded-full bg-cyan-600 shadow-sm transition-transform duration-100"
                style={{
                  transform: `rotate(${(eqState.surround / 100) * 270 - 135}deg)`,
                  transformOrigin: 'bottom center',
                }}
              />
            </div>
          </div>

          {/* Slider input */}
          <div className="w-full max-w-xs space-y-1.5">
            <input
              type="range"
              min="0"
              max="100"
              value={eqState.surround}
              onChange={(e) => handleKnobChange('surround', parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-sky-200 accent-cyan-600"
            />
            <div className="flex justify-between text-xs font-mono-data font-semibold text-sky-900">
              <span>0% (Mono)</span>
              <span className="text-cyan-700 font-bold">{eqState.surround}%</span>
              <span>100% (Imersivo)</span>
            </div>
          </div>
        </div>

        {/* Potentiometer 2: Bass Reflex MegaBoost */}
        <div className="aero-glass-panel rounded-3xl p-6 border border-white/90 shadow-xl flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
            Potenciômetro Analógico 02
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900">
            Bass Reflex MegaBoost
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-6">
            Realce sub-grave analógico 90Hz para punch e profundidade visceral.
          </p>

          {/* Rotary Dial Visualizer */}
          <div className="relative w-32 h-32 rounded-full chrome-ring p-2 flex items-center justify-center shadow-2xl mb-4">
            {/* LED Arc Indicator */}
            <div
              className="absolute inset-0 rounded-full border-4 border-emerald-400 shadow-[0_0_12px_#34d399] pointer-events-none"
              style={{
                clipPath: `polygon(50% 50%, 0 0, ${eqState.bassReflex}% 0, 100% 100%, 0 100%)`,
              }}
            />

            {/* Inner Metallic Knob */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-b from-slate-100 to-slate-300 border border-white shadow-md flex items-center justify-center">
              <div
                className="w-1.5 h-7 rounded-full bg-emerald-600 shadow-sm transition-transform duration-100"
                style={{
                  transform: `rotate(${(eqState.bassReflex / 100) * 270 - 135}deg)`,
                  transformOrigin: 'bottom center',
                }}
              />
            </div>
          </div>

          {/* Slider input */}
          <div className="w-full max-w-xs space-y-1.5">
            <input
              type="range"
              min="0"
              max="100"
              value={eqState.bassReflex}
              onChange={(e) => handleKnobChange('bassReflex', parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-emerald-200 accent-emerald-600"
            />
            <div className="flex justify-between text-xs font-mono-data font-semibold text-emerald-900">
              <span>0 dB</span>
              <span className="text-emerald-700 font-bold">+{((eqState.bassReflex / 100) * 8).toFixed(1)} dB</span>
              <span>+8.0 dB Max</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialized Audio Modules (Switches from Screen 5) */}
      <div className="aero-glass-panel rounded-3xl p-6 border border-white/90 shadow-xl space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900">
          Módulos de Áudio Especializados
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Module 1: QTS Aero Surround */}
          <div className="aero-glass-card rounded-2xl p-4 flex items-center justify-between gap-3 border border-white">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">QTS Aero Surround</h4>
              <p className="text-[11px] text-slate-500">Virtualizador de palco sonoro</p>
            </div>
            <button
              onClick={() => handleToggleModule('qtsSurround')}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                eqState.qtsSurround ? 'bg-cyan-500 shadow-sm' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  eqState.qtsSurround ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Module 2: UltraClarity */}
          <div className="aero-glass-card rounded-2xl p-4 flex items-center justify-between gap-3 border border-white">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">UltraClarity</h4>
              <p className="text-[11px] text-slate-500">Destaque de agudos cristalinos</p>
            </div>
            <button
              onClick={() => handleToggleModule('ultraClarity')}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                eqState.ultraClarity ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  eqState.ultraClarity ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Module 3: Spatial Reverb */}
          <div className="aero-glass-card rounded-2xl p-4 flex items-center justify-between gap-3 border border-white">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Spatial Reverb</h4>
              <p className="text-[11px] text-slate-500">Emulação de ambiente aquático</p>
            </div>
            <button
              onClick={() => handleToggleModule('spatialReverb')}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                eqState.spatialReverb ? 'bg-cyan-500 shadow-sm' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  eqState.spatialReverb ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
