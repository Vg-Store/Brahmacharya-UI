import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Sparkles, Wind, CheckCircle2, RotateCw } from 'lucide-react';
import { playTempleGong, playBeadChime } from '../utils/audio';

interface UrgeInterceptorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncrementJap: (count: number) => void;
}

export const UrgeInterceptorModal: React.FC<UrgeInterceptorModalProps> = ({
  isOpen,
  onClose,
  onIncrementJap,
}) => {
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold Out'>('Inhale');
  const [secondsInPhase, setSecondsInPhase] = useState(4);
  const [emergencyChants, setEmergencyChants] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Play grounding gong
    playTempleGong(380, 4);

    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Hold Out'> = ['Inhale', 'Hold', 'Exhale', 'Hold Out'];
    let curPhaseIdx = 0;
    let sec = 4;

    const interval = window.setInterval(() => {
      sec -= 1;
      if (sec <= 0) {
        curPhaseIdx = (curPhaseIdx + 1) % phases.length;
        setBreathingPhase(phases[curPhaseIdx]);
        sec = 4;
      }
      setSecondsInPhase(sec);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuickJap = () => {
    playBeadChime();
    setEmergencyChants((prev) => prev + 1);
    onIncrementJap(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-950 border border-red-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-100 p-2 rounded-xl hover:bg-stone-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Banner */}
        <div className="flex items-center gap-3 border-b border-red-900/50 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-950 border border-red-700 flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-lg md:text-xl font-bold text-red-300">
              Break The Loop Now
            </h2>
            <p className="text-xs text-stone-400">
              Intercepting: Planning → Distraction → Overthinking → Neglected Execution
            </p>
          </div>
        </div>

        {/* Maharaj Ji Stern Reminder */}
        <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 text-stone-300 space-y-2">
          <p className="font-serif-prose text-sm italic text-amber-200 leading-relaxed">
            "You are Bhagwan ke Ansh. Why demean yourself by bowing before a 5-second phantom impulse or sinking into useless YouTube, K-drama, Anime, or lustful thoughts? The moment you observe the urge with detachment, it turns to ashes. Stand up immediately and execute!"
          </p>
          <p className="text-[11px] text-stone-400 text-right font-medium">
            — Pujya Shri Hit Premanand Govind Sharan Ji Maharaj
          </p>
        </div>

        {/* Box Breathing Guide (4-4-4-4) */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-cyan-400 font-semibold">
            <Wind className="w-4 h-4" />
            <span>Pranayama Reset · Box Breathing</span>
          </div>

          <div className="py-2">
            <div className="inline-block p-4 px-8 rounded-2xl bg-stone-950 border border-cyan-500/30 text-center">
              <span className="text-xl md:text-2xl font-display font-bold text-cyan-200 block">
                {breathingPhase}
              </span>
              <span className="font-mono text-3xl font-extrabold text-cyan-400 mt-1 block">
                {secondsInPhase}s
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Follow the breath cycle. Feel your nervous system cool down immediately.
          </p>
        </div>

        {/* Emergency Ganapati Jap */}
        <div className="p-4 rounded-2xl bg-stone-900/70 border border-amber-900/30 space-y-3 text-center">
          <span className="text-xs font-semibold text-amber-400 block uppercase tracking-wider">
            Transmute Sensory Energy into Tejas
          </span>
          <p className="font-display text-base font-bold text-stone-100">
            Aum Gam Ganapataye Namaha
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleQuickJap}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Chant 1 Bead ({emergencyChants} Logged)</span>
            </button>
          </div>
        </div>

        {/* Physical Directive */}
        <div className="space-y-2 text-xs text-stone-300">
          <span className="font-semibold text-stone-200 block">
            Immediate Physical Actions To Take Right Now:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Wash face with cold water immediately.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Drop for 10 pushups / Surya Namaskar.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Drink a fresh glass of water.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Leave screen; go outdoors or focus on real work.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-xs transition-colors"
        >
          I Am In Control · Return to Real Execution
        </button>
      </div>
    </div>
  );
};
