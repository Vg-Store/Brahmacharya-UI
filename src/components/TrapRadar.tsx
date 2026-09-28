import React from 'react';
import { AlertTriangle, ArrowRight, ShieldCheck, Zap, XCircle, CheckCircle2 } from 'lucide-react';
import { TrapAudit } from '../types';

interface TrapRadarProps {
  audit: TrapAudit;
  onUpdateAudit: (audit: TrapAudit) => void;
  onOpenUrgeInterceptor: () => void;
}

const DISTRACTION_TAGS = [
  'YouTube',
  'K-drama',
  'C-drama',
  'K-pop',
  'Anime',
  'Manhua',
  'XXX Content',
  'Senseless Browsing',
];

export const TrapRadar: React.FC<TrapRadarProps> = ({
  audit,
  onUpdateAudit,
  onOpenUrgeInterceptor,
}) => {
  const toggleMediaTag = (tag: string) => {
    const current = audit.mediaDetails || [];
    const exists = current.includes(tag);
    const updated = exists ? current.filter((t) => t !== tag) : [...current, tag];

    onUpdateAudit({
      ...audit,
      consumedDistractionMedia: updated.length > 0,
      mediaDetails: updated,
    });
  };

  const handleToggle = (field: keyof Omit<TrapAudit, 'mediaDetails' | 'reflectionNote'>) => {
    onUpdateAudit({
      ...audit,
      [field]: !audit[field],
    });
  };

  return (
    <div className="bg-stone-900/90 border border-red-950/60 rounded-2xl p-5 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-red-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Root Cause Audit · The Mental Trap</span>
          </span>
          <h3 className="font-display text-lg font-bold text-stone-100">
            Execution vs. Living in the Mind
          </h3>
        </div>

        <button
          onClick={onOpenUrgeInterceptor}
          className="text-xs px-3 py-1.5 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 hover:bg-red-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto font-medium"
        >
          <Zap className="w-3.5 h-3.5 text-red-400" />
          <span>Intercept Impulse Now</span>
        </button>
      </div>

      {/* The Mental Trap Loop Visualization */}
      <div className="p-4 rounded-xl bg-stone-950/90 border border-stone-800 space-y-3">
        <span className="text-[11px] font-mono uppercase text-stone-500 tracking-wider block">
          The Destructive Pattern to Restrain:
        </span>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="px-2 py-1 bg-red-950/40 border border-red-900/40 text-red-300 rounded">
            Planning
          </span>
          <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
          <span className="px-2 py-1 bg-red-950/40 border border-red-900/40 text-red-300 rounded">
            Information
          </span>
          <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
          <span className="px-2 py-1 bg-red-950/40 border border-red-900/40 text-red-300 rounded">
            Distraction
          </span>
          <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
          <span className="px-2 py-1 bg-red-950/40 border border-red-900/40 text-red-300 rounded">
            Overthinking
          </span>
          <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
          <span className="px-2 py-1 bg-red-950/40 border border-red-900/40 text-red-300 rounded">
            Living in Mind
          </span>
          <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
          <span className="px-2 py-1 bg-red-900/80 text-white font-bold rounded">
            Execution Neglected
          </span>
        </div>

        {/* The Solution */}
        <div className="pt-2 border-t border-stone-900 text-xs text-amber-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>The Antidote:</strong> Restrain endless planning. Channel all energy immediately into: <strong>Dincharya</strong>, <strong>Character</strong>, <strong>Personality</strong>, and <strong>Actionable Execution</strong>.
          </span>
        </div>
      </div>

      {/* Daily Trap Audit Check-in */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-stone-300 block">
          Today's Reality Check:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => handleToggle('fellIntoPlanningTrap')}
            className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-colors ${
              audit.fellIntoPlanningTrap
                ? 'bg-red-950/30 border-red-800/60 text-red-200'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
            }`}
          >
            {audit.fellIntoPlanningTrap ? (
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-xs font-medium block">
                Fell into the Endless Planning Trap
              </span>
              <span className="text-[11px] text-stone-500">
                Spent energy structuring, theorizing, or endlessly reading instead of doing.
              </span>
            </div>
          </button>

          <button
            onClick={() => handleToggle('overthinkingLivingInMind')}
            className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-colors ${
              audit.overthinkingLivingInMind
                ? 'bg-red-950/30 border-red-800/60 text-red-200'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
            }`}
          >
            {audit.overthinkingLivingInMind ? (
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-xs font-medium block">
                Got caught up overthinking / living in the mind
              </span>
              <span className="text-[11px] text-stone-500">
                Mental rumination, imagined conversations, or drifting instead of grounded reality.
              </span>
            </div>
          </button>
        </div>

        {/* Media Distraction Radar */}
        <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-300">
              Did you consume any distraction media today?
            </span>
            <span className="text-[11px] text-stone-500 font-mono">
              {audit.mediaDetails.length} Detected
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DISTRACTION_TAGS.map((tag) => {
              const active = audit.mediaDetails.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleMediaTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    active
                      ? 'bg-red-950/80 border-red-700 text-red-300 font-medium'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Positive Execution Confirmation */}
        <button
          onClick={() => handleToggle('actionExecutionDone')}
          className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
            audit.actionExecutionDone
              ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
              : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
          }`}
        >
          {audit.actionExecutionDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-stone-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-xs font-bold text-stone-100 block">
              I anchored today in real Execution &amp; Dincharya
            </span>
            <span className="text-[11px] text-stone-400">
              I lived the discipline in physical reality, keeping my Mann Prasanna, rather than staying in my head.
            </span>
          </div>
        </button>

        {/* Reflection Note */}
        <div>
          <label className="text-xs text-stone-400 block mb-1">
            Execution Notes &amp; Mindset Shift:
          </label>
          <input
            type="text"
            value={audit.reflectionNote}
            onChange={(e) => onUpdateAudit({ ...audit, reflectionNote: e.target.value })}
            placeholder="What concrete action did you take today to kill overthinking?"
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-stone-700"
          />
        </div>
      </div>
    </div>
  );
};
