import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Check, Plus, Minus } from 'lucide-react';
import { playTempleGong } from '../utils/audio';

interface DhyanaTimerProps {
  loggedMinutes: number;
  completed: boolean;
  onUpdateDhyana: (minutes: number, isComplete: boolean) => void;
}

export const DhyanaTimer: React.FC<DhyanaTimerProps> = ({
  loggedMinutes,
  onUpdateDhyana,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [justLogged, setJustLogged] = useState<string | null>(null);

  const handleAddSession = (mins: number) => {
    playTempleGong(432, 2.8);
    const newTotal = loggedMinutes + mins;
    onUpdateDhyana(newTotal, newTotal >= 48);
    setJustLogged(`+${mins} min session added! Total: ${newTotal} min`);
    setTimeout(() => setJustLogged(null), 2500);
  };

  const handleSubtractMinutes = (mins: number) => {
    const next = Math.max(0, loggedMinutes - mins);
    onUpdateDhyana(next, next >= 48);
  };

  const handleSetCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      handleAddSession(parsed);
      setShowInput(false);
      setCustomInput('');
    }
  };

  const handleReset = () => {
    if (confirm('Reset today’s Dhyana log to 0 minutes?')) {
      onUpdateDhyana(0, false);
    }
  };

  const isGoalMet = loggedMinutes >= 48;

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold block font-mono">
            Dhyana Sadhana · Siddhasana
          </span>
          <h3 className="font-display text-lg font-bold text-stone-100">
            Meditation in Siddhasana
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isGoalMet && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Goal Met (≥ 48m)</span>
            </span>
          )}
          <button
            onClick={handleReset}
            disabled={loggedMinutes === 0}
            className="p-1.5 rounded-lg border border-stone-800 text-stone-500 hover:text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Reset minutes to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-400">
        Goal: at least <strong>48 minutes</strong> daily in Siddhasana (can be completed in one sitting or split across morning &amp; evening sessions).
      </p>

      {/* Main Status & Multi-Session Logger */}
      <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">
            Logged Today (Multiple Sessions Supported)
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="font-mono text-4xl md:text-5xl font-extrabold text-amber-300">
              {loggedMinutes}
            </span>
            <span className="font-display text-base md:text-lg font-semibold text-stone-300">
              / 48 Min
            </span>
          </div>
          <p className="text-xs text-stone-400 font-mono">
            {isGoalMet
              ? '48-Minute Daily Target Fulfilled'
              : `${48 - loggedMinutes} min remaining to complete 48m goal`}
          </p>
        </div>

        {/* Multi-Session Action Buttons */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddSession(48)}
              className="flex-1 sm:flex-none px-4 lg:px-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-stone-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all lg:whitespace-nowrap"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>+ 48 min (Full Muhurta)</span>
            </button>

            <button
              onClick={() => handleAddSession(24)}
              className="flex-1 sm:flex-none px-4 lg:px-2 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 active:scale-95 text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all lg:whitespace-nowrap"
              title="Add 24 minutes (Half Muhurta) for split sessions"
            >
              <Plus className="w-4 h-4" />
              <span>+ 24 min (Half)</span>
            </button>
          </div>

          {/* Quick Adjustments */}
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={() => handleAddSession(15)}
              className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs font-mono transition-colors"
            >
              +15m
            </button>
            <button
              onClick={() => handleSubtractMinutes(12)}
              disabled={loggedMinutes === 0}
              className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:pointer-events-none text-xs flex items-center gap-1 transition-colors"
              title="Undo 12 minutes"
            >
              <Minus className="w-3 h-3" />
              <span>12m</span>
            </button>
            <button
              onClick={() => setShowInput(!showInput)}
              className="text-[11px] text-stone-400 hover:text-stone-300 underline px-1.5"
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      {showInput && (
        <form onSubmit={handleSetCustom} className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center gap-3 text-xs">
          <span className="text-stone-400">Add session minutes:</span>
          <input
            type="number"
            min="1"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. 30"
            className="w-24 bg-stone-900 border border-stone-700 text-amber-300 font-mono text-center px-2 py-1 rounded focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded"
          >
            Add Session
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="text-[11px] text-stone-400 hover:text-stone-200"
          >
            Cancel
          </button>
        </form>
      )}

      {justLogged && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{justLogged}</span>
        </div>
      )}
    </div>
  );
};
