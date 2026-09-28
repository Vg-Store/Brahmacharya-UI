import React from 'react';
import { Utensils, Droplets, CheckSquare, Square, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DietChecks } from '../types';

interface DietSectionProps {
  diet: DietChecks;
  onToggleDiet: (key: keyof DietChecks) => void;
  bathWithoutHotWater?: boolean;
  coldWaterBath?: boolean;
  onToggleBath: (val: boolean) => void;
}

export const DietSection: React.FC<DietSectionProps> = ({
  diet,
  onToggleDiet,
  bathWithoutHotWater,
  coldWaterBath,
  onToggleBath,
}) => {
  const isBathDone = Boolean(bathWithoutHotWater || coldWaterBath);

  // Calculate diagnostic diet adherence

  const rules = [
    { key: 'noWaterDuringMeals' as const, label: 'No water before, during, or after eating', failed: !diet.noWaterDuringMeals, reason: 'Water timing during meals' },
    { key: 'noExcessSpicyHot' as const, label: 'No excessively hot or spicy food', failed: !diet.noExcessSpicyHot, reason: 'Excessively hot/spicy food' },
    { key: 'noJunkFood' as const, label: 'No junk food / processed artificial snacks', failed: !diet.noJunkFood, reason: 'Junk food consumption' },
    { key: 'noNonVeg' as const, label: 'Strictly no non-vegetarian food', failed: !diet.noNonVeg, reason: 'Non-vegetarian food' },
  ];

  const adheredCount = rules.filter((r) => !r.failed).length;
  const failedRules = rules.filter((r) => r.failed);

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold block font-mono">
            Sharira Shuddhi · Body Purity
          </span>
          <h3 className="font-display text-lg font-bold text-stone-100">
            Dietary Niyams &amp; Bath Without Hot Water
          </h3>
        </div>

        {/* Diagnostic Diet Summary */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
              adheredCount === 4
                ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300'
                : 'bg-amber-950/80 border-amber-600/50 text-amber-300'
            }`}
          >
            Diet: {adheredCount}/4 Adhered
          </span>
        </div>
      </div>

      {/* Failure Diagnostic Alert if any diet rule failed */}
      {failedRules.length > 0 && failedRules.length < 4 && (
        <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Specific Diet Slip Identified:</span>
            <span className="text-stone-300">
              {failedRules.map((f) => f.reason).join(', ')} was missed.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Dietary Niyams */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs border-b border-stone-800/80 pb-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-wide font-display">Dietary Sub-Rules (Diagnostic)</span>
          </div>

          <div className="space-y-2.5">
            {/* 1. No water before, during, or after eating */}
            <button
              onClick={() => onToggleDiet('noWaterDuringMeals')}
              className="w-full text-left flex items-start gap-2.5 text-xs group"
            >
              {diet.noWaterDuringMeals ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <div>
                <span className={diet.noWaterDuringMeals ? 'text-stone-200 font-medium' : 'text-stone-400'}>
                  No water before, during, or after eating
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Protects digestive fire (Jatharagni); drink water between meals only.
                </p>
              </div>
            </button>

            {/* 2. No excessively hot or spicy food */}
            <button
              onClick={() => onToggleDiet('noExcessSpicyHot')}
              className="w-full text-left flex items-start gap-2.5 text-xs group"
            >
              {diet.noExcessSpicyHot ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <div>
                <span className={diet.noExcessSpicyHot ? 'text-stone-200 font-medium' : 'text-stone-400'}>
                  No excessively hot or spicy food
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Rajasic heat excites animalistic passions and restless mental agitation.
                </p>
              </div>
            </button>

            {/* 3. No junk food */}
            <button
              onClick={() => onToggleDiet('noJunkFood')}
              className="w-full text-left flex items-start gap-2.5 text-xs group"
            >
              {diet.noJunkFood ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <div>
                <span className={diet.noJunkFood ? 'text-stone-200 font-medium' : 'text-stone-400'}>
                  No junk food / processed artificial items
                </span>
              </div>
            </button>

            {/* 4. Strictly no non-veg */}
            <button
              onClick={() => onToggleDiet('noNonVeg')}
              className="w-full text-left flex items-start gap-2.5 text-xs group"
            >
              {diet.noNonVeg ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <div>
                <span className={diet.noNonVeg ? 'text-stone-200 font-medium' : 'text-stone-400'}>
                  Strictly no non-vegetarian food
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Complete Ahimsa and purity of conscious prana.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Bath Niyam */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="uppercase tracking-wide font-display">Bath / Snan Niyam</span>
              </div>
              <span className="text-[11px] text-stone-500">Physical Discipline</span>
            </div>

            <button
              onClick={() => onToggleBath(!isBathDone)}
              className="w-full text-left flex items-start gap-2.5 text-xs group pt-1 cursor-pointer"
            >
              {isBathDone ? (
                <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5 group-hover:text-stone-400" />
              )}
              <div>
                <span className={isBathDone ? 'text-stone-200 font-medium' : 'text-stone-400'}>
                  Bath taken without hot water
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Preserves physical vigour, alertness, and nervous system discipline.
                </p>
              </div>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/60 text-xs text-stone-400 space-y-1">
            <span className="text-stone-300 font-semibold block">
              Diagnostic Focus
            </span>
            <p className="text-[11px] leading-relaxed">
              If diet slips, the app tracks exactly which rule broke so you can correct your behavior without confusion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
