import React, { useState } from 'react';
import { 
  Palette, Sparkles, Check, Copy, Search, User, 
  Play, SkipBack, SkipForward, Disc3, Droplets
} from 'lucide-react';

export const AeroDesignSystem: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const primaryColors = [
    { label: 'Primary 500', hex: '#00A6FF' },
    { label: 'Primary 600', hex: '#0088EE' },
    { label: 'Primary 400', hex: '#38BDF8' },
    { label: 'Primary 100', hex: '#E0F2FE' },
  ];

  const secondaryColors = [
    { label: 'Secondary 500', hex: '#00D26A' },
    { label: 'Secondary 600', hex: '#10B981' },
    { label: 'Secondary 700', hex: '#059669' },
    { label: 'Secondary 100', hex: '#D1FAE5' },
  ];

  const tertiaryColors = [
    { label: 'Tertiary 500', hex: '#00E5FF' },
    { label: 'Tertiary 600', hex: '#06B6D4' },
    { label: 'Tertiary 700', hex: '#0891B2' },
    { label: 'Tertiary 100', hex: '#CFFAFE' },
  ];

  const neutralColors = [
    { label: 'Glass White', hex: '#FFFFFF' },
    { label: 'Ice Fog', hex: '#F0F8FF' },
    { label: 'Slate Aero', hex: '#64748B' },
    { label: 'Deep Abyss', hex: '#0F172A' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-cyan-600" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              AeroSound Design System
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-sky-800 font-medium mt-1">
            Especificações visuais, paleta de cores e componentes skeuomórficos Frutiger Aero.
          </p>
        </div>

        {copiedHex && (
          <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <Check className="w-3.5 h-3.5" />
            <span>Copiado: {copiedHex}</span>
          </div>
        )}
      </div>

      {/* Grid: Color Swatches & Typography (Screen 1 replica) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1A: Color Palettes */}
        <div className="aero-glass-panel rounded-3xl p-6 border border-white/90 shadow-xl space-y-5">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span>Paleta Cromática Aero</span>
          </h2>

          {/* Primary */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Primary (Sky Blue)</span>
              <span className="font-mono-data text-sky-700">#00A6FF</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-12 rounded-xl overflow-hidden p-1 bg-white/60 border border-white">
              {primaryColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex)}
                  className="rounded-lg h-full transition-transform active:scale-95 relative group"
                  style={{ backgroundColor: c.hex }}
                  title={`Copiar ${c.hex}`}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white bg-black/40 rounded-lg">
                    {c.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Secondary (Emerald Lime)</span>
              <span className="font-mono-data text-emerald-700">#00D26A</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-12 rounded-xl overflow-hidden p-1 bg-white/60 border border-white">
              {secondaryColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex)}
                  className="rounded-lg h-full transition-transform active:scale-95 relative group"
                  style={{ backgroundColor: c.hex }}
                  title={`Copiar ${c.hex}`}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white bg-black/40 rounded-lg">
                    {c.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tertiary */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Tertiary (Aqua Cyan)</span>
              <span className="font-mono-data text-cyan-700">#00E5FF</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-12 rounded-xl overflow-hidden p-1 bg-white/60 border border-white">
              {tertiaryColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex)}
                  className="rounded-lg h-full transition-transform active:scale-95 relative group"
                  style={{ backgroundColor: c.hex }}
                  title={`Copiar ${c.hex}`}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white bg-black/40 rounded-lg">
                    {c.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Neutral */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Neutral (Glass & Deep Slate)</span>
              <span className="font-mono-data text-slate-700">#F0F8FF</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-12 rounded-xl overflow-hidden p-1 bg-white/60 border border-white">
              {neutralColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex)}
                  className="rounded-lg h-full transition-transform active:scale-95 relative group border border-slate-200"
                  style={{ backgroundColor: c.hex }}
                  title={`Copiar ${c.hex}`}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-800 bg-white/80 rounded-lg">
                    {c.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 1B: Typographic Scale */}
        <div className="aero-glass-panel rounded-3xl p-6 border border-white/90 shadow-xl space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900">
            Escala Tipográfica Frutiger Aero
          </h2>

          <div className="space-y-4 divide-y divide-sky-100">
            <div className="pt-2 flex items-baseline justify-between gap-4">
              <div>
                <span className="text-3xl font-display font-bold text-slate-900">Aa</span>
                <span className="ml-3 text-sm font-semibold text-slate-800">Headline 32px</span>
              </div>
              <span className="text-xs text-slate-500 font-mono-data">Syne Bold</span>
            </div>

            <div className="pt-3 flex items-baseline justify-between gap-4">
              <div>
                <span className="text-2xl font-bold text-slate-800">Aa</span>
                <span className="ml-3 text-sm font-semibold text-slate-700">Subheadline 20px</span>
              </div>
              <span className="text-xs text-slate-500 font-mono-data">Jakarta 600</span>
            </div>

            <div className="pt-3 flex items-baseline justify-between gap-4">
              <div>
                <span className="text-base text-slate-700">Aa</span>
                <span className="ml-3 text-sm text-slate-600">Body Text 15px</span>
              </div>
              <span className="text-xs text-slate-500 font-mono-data">Jakarta 400</span>
            </div>

            <div className="pt-3 flex items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-semibold text-sky-800">Aa</span>
                <span className="ml-3 text-xs font-mono text-slate-500">Telemetry & Data 12px</span>
              </div>
              <span className="text-xs text-slate-500 font-mono-data">JetBrains Mono</span>
            </div>
          </div>
        </div>
      </div>

      {/* Component Library Specimens (Directly matching Screen 1 components) */}
      <div className="aero-glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl space-y-6">
        <h2 className="font-display font-bold text-lg text-slate-900">
          Componentes Interativos & Efeitos de Vidro
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Button Styles */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Variantes de Botão
            </span>
            <div className="space-y-2.5">
              <button className="aero-btn-aqua w-full py-2.5 px-4 rounded-xl text-xs font-bold">
                Primary Aqua Button
              </button>
              <button className="aero-btn-emerald w-full py-2.5 px-4 rounded-xl text-xs font-bold">
                Secondary Emerald Button
              </button>
              <button className="aero-btn-glass w-full py-2.5 px-4 rounded-xl text-xs font-bold">
                Frosted Glass Button
              </button>
            </div>
          </div>

          {/* Form & Search Controls */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Campo de Busca Aero
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-700" />
              <input
                type="text"
                readOnly
                value="Explorar o Universo Aero..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/80 border border-white shadow-inner text-xs font-medium text-slate-700 cursor-default"
              />
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-sky-100 to-cyan-100/60 border border-white flex items-center justify-between text-xs text-sky-900">
              <span>Palco Estéreo Ativo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Icon Orb Cluster (from Mockup Panel 1) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Orbs de Ação & Controles
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full aero-btn-aqua flex items-center justify-center shadow-md">
                <Search className="w-4 h-4 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full aero-btn-glass flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-sky-800" />
              </div>
              <div className="w-10 h-10 rounded-full aero-btn-emerald flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-sky-400 to-blue-600 border border-white flex items-center justify-center shadow-md text-white">
                <Disc3 className="w-4 h-4 animate-spin-cd" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
