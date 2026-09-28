import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { playTempleGong } from '../utils/audio';

interface JapCounterProps {
  count: number; // total chants
  malasCount?: number;
  onUpdateCount: (newTotalChants: number, newMalasCount: number) => void;
}

export const JapCounter: React.FC<JapCounterProps> = ({
  count,
  malasCount,
  onUpdateCount,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [justAddedMala, setJustAddedMala] = useState(false);

  // Derive malas from malasCount or total count (1 Mala = 108 chants)
  const currentMalas = typeof malasCount === 'number' ? malasCount : Math.floor(count / 108);
  const totalChants = currentMalas * 108;

  const handleAddMala = () => {
    const nextMalas = currentMalas + 1;
    const nextTotalChants = nextMalas * 108;
    onUpdateCount(nextTotalChants, nextMalas);

    if (soundEnabled) {
      playTempleGong(528, 3.2);
      setJustAddedMala(true);
      setTimeout(() => setJustAddedMala(false), 2400);
    }
  };

  const handleSubtractMala = () => {
    if (currentMalas <= 0) return;
    const nextMalas = currentMalas - 1;
    onUpdateCount(nextMalas * 108, nextMalas);
  };

  const handleReset = () => {
    if (confirm('Reset today’s Mala count to 0?')) {
      onUpdateCount(0, 0);
    }
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-lg">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold block font-mono">
            Naam Jap Sadhana · Mala Tracker
          </span>
          <h3 className="font-display text-lg font-bold text-stone-100">
            Aum Gam Ganapataye Namaha
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? 'bg-amber-950/60 border-amber-600/40 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
            title={soundEnabled ? 'Temple chime enabled' : 'Chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            disabled={currentMalas === 0}
            className="p-1.5 rounded-lg border border-stone-800 text-stone-500 hover:text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Reset Malas to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sacred Mantra Focus Display */}
      <div className="text-center py-3 px-4 rounded-xl bg-stone-950/80 border border-amber-900/30">
        <p className="font-display text-xl md:text-2xl text-amber-300 tracking-wide font-semibold">
          ॐ गं गणपतये नमः
        </p>
        <p className="text-xs text-stone-400 mt-1 font-serif-prose italic">
          "Aum Gam Ganapataye Namaha" · Destroyer of Lust &amp; Obstacles, Bestower of Purity &amp; Will
        </p>
      </div>

      {/* Mala Display & Primary Action */}
      <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Large Mala Count */}
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">
            Completed Today
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="font-mono text-4xl md:text-5xl font-extrabold text-amber-300">
              {currentMalas}
            </span>
            <span className="font-display text-base md:text-lg font-semibold text-stone-300">
              {currentMalas === 1 ? 'Mala' : 'Malas'}
            </span>
          </div>
          <p className="text-xs text-stone-400 font-mono">
            {totalChants.toLocaleString()} Sacred Chants (108 per Mala)
          </p>
        </div>

        {/* Primary Action Button & Undo */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={handleAddMala}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add 1 Complete Mala</span>
          </button>

          <button
            onClick={handleSubtractMala}
            disabled={currentMalas === 0}
            className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:pointer-events-none text-xs flex items-center justify-center gap-1.5 transition-colors self-center"
            title="Undo 1 Mala in case of mis-click"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>Undo 1 Mala</span>
          </button>
        </div>
      </div>

      {/* Confirmation feedback */}
      {justAddedMala && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>1 Complete Mala (108 Chants) added!</span>
        </div>
      )}
    </div>
  );
};
