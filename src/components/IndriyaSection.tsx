import React from 'react';
import { Eye, MessageSquare, Ear, Hand, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { IndriyavijayChecks } from '../types';

interface IndriyaSectionProps {
  checks: IndriyavijayChecks;
  onToggleCheck: (key: keyof IndriyavijayChecks) => void;
}

export const IndriyaSection: React.FC<IndriyaSectionProps> = ({ checks, onToggleCheck }) => {
  const totalItems = 6;
  const completedCount = Object.values(checks).filter(Boolean).length;
  const isAllGuarded = completedCount === totalItems;

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold block">
            Sense Mastery · Vash on Indriya
          </span>
          <h3 className="font-display text-lg font-bold text-stone-100">
            Indriyavijay Gates
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-400">
            Guarded: <strong className="text-amber-300">{completedCount}/{totalItems}</strong>
          </span>
          {isAllGuarded && (
            <span className="text-[11px] bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Vash Maintained</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Netra / Eyes Gate */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs border-b border-stone-800/80 pb-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-wide font-display">Eyes / Netra Gate</span>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => onToggleCheck('netraNoBadContent')}
              className="w-full text-left flex items-start gap-2.5 text-xs group"
            >
              {checks.netraNoBadContent ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <span className={checks.netraNoBadContent ? 'text-stone-200' : 'text-stone-400'}>
                Not seeing bad, suggestive, or inappropriate content/imagery.
              </span>
            </button>

            <button
              onClick={() => onToggleCheck('netraNoLustfulImagination')}
              className="w-full text-left flex items-start gap-2.5 text-xs group"
            >
              {checks.netraNoLustfulImagination ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <span className={checks.netraNoLustfulImagination ? 'text-stone-200' : 'text-stone-400'}>
                Not intentionally imagining or daydreaming lustful fantasies.
              </span>
            </button>

            <button
              onClick={() => onToggleCheck('netraNoLustfulGaze')}
              className="w-full text-left flex items-start gap-2.5 text-xs group"
            >
              {checks.netraNoLustfulGaze ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <span className={checks.netraNoLustfulGaze ? 'text-stone-200' : 'text-stone-400'}>
                Not relating things to lust or viewing people in a lustful way.
              </span>
            </button>
          </div>
        </div>

        {/* Vaani / Voice Gate */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs border-b border-stone-800/80 pb-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-wide font-display">Voice / Vaani Gate</span>
          </div>

          <button
            onClick={() => onToggleCheck('vaaniPureSpeech')}
            className="w-full text-left flex items-start gap-2.5 text-xs group pt-1"
          >
            {checks.vaaniPureSpeech ? (
              <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
            )}
            <span className={checks.vaaniPureSpeech ? 'text-stone-200' : 'text-stone-400'}>
              Not speaking badly, vulgarly, using coarse language, or engaging in sensual banter.
            </span>
          </button>
          <p className="text-[11px] text-stone-400 italic pl-6">
            Vaani should be truthful, gentle, beneficial, and soaked in divine remembrance.
          </p>
        </div>

        {/* Kaan / Ears Gate */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs border-b border-stone-800/80 pb-2">
            <Ear className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-wide font-display">Ears / Kaan Gate</span>
          </div>

          <button
            onClick={() => onToggleCheck('kaanPureListening')}
            className="w-full text-left flex items-start gap-2.5 text-xs group pt-1"
          >
            {checks.kaanPureListening ? (
              <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
            )}
            <span className={checks.kaanPureListening ? 'text-stone-200' : 'text-stone-400'}>
              Not listening to vulgar conversation, gossip, sensual songs, or being a party to such talks.
            </span>
          </button>
          <p className="text-[11px] text-stone-400 italic pl-6">
            Ears are doors to the mind. Close them immediately when vulgarity enters.
          </p>
        </div>

        {/* Touch / Sparsh Gate */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs border-b border-stone-800/80 pb-2">
            <Hand className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-wide font-display">Touch / Sparsh Gate</span>
          </div>

          <button
            onClick={() => onToggleCheck('sparshPureTouch')}
            className="w-full text-left flex items-start gap-2.5 text-xs group pt-1"
          >
            {checks.sparshPureTouch ? (
              <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
            )}
            <span className={checks.sparshPureTouch ? 'text-stone-200' : 'text-stone-400'}>
              Not touching or allowing myself to be touched with bad, sensual, or lustful intentions.
            </span>
          </button>
          <p className="text-[11px] text-stone-400 italic pl-6">
            Sacred boundary and strict physical purity preserved at all times.
          </p>
        </div>
      </div>
    </div>
  );
};
