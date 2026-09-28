import React from 'react';
import { Moon, CheckCircle2, Clock, Flame, Heart } from 'lucide-react';
import { DailyLog, MannPrasanna } from '../types';
import { playTempleGong } from '../utils/audio';
import { getTomorrowBrahmamuhurta } from '../utils/brahmamuhurta';
import { SolarLocation } from '../utils/solar';
import { VisualisationGuide } from './VisualisationGuide';
import { IndriyaSection } from './IndriyaSection';
import { DietSection } from './DietSection';
import { ExerciseLogger } from './ExerciseLogger';
import { TrapRadar } from './TrapRadar';

interface EveningReviewViewProps {
  currentLog: DailyLog;
  onUpdateLog: (updated: Partial<DailyLog>) => void;
  sankalpText: string;
  solarLocation?: SolarLocation;
  dayNumber: number;
  onOpenUrgeInterceptor: () => void;
  onGoToTab: (tab: 'today' | 'morning' | 'calendar') => void;
}

export const EveningReviewView: React.FC<EveningReviewViewProps> = ({
  currentLog,
  onUpdateLog,
  sankalpText,
  solarLocation,
  dayNumber,
  onOpenUrgeInterceptor,
  onGoToTab,
}) => {
  const tomorrowMuhurta = getTomorrowBrahmamuhurta(solarLocation);

  const handleToggleEveningComplete = () => {
    playTempleGong(432, 4.0);
    onUpdateLog({ eveningReviewCompleted: !currentLog.eveningReviewCompleted });
  };

  const handleMannPrasannaChange = (state: MannPrasanna) => {
    onUpdateLog({ mannPrasannaState: state });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Evening Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Moon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono font-semibold">
                Sayam Kalin Samiksha · Day {dayNumber} of 180
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-100">
                Evening Sacred Audit
              </h1>
            </div>
          </div>

          <button
            onClick={handleToggleEveningComplete}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              currentLog.eveningReviewCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {currentLog.eveningReviewCompleted
                ? 'Evening Audit Completed!'
                : 'Seal Evening Audit'}
            </span>
          </button>
        </div>

        {/* Sankalp Reaffirmation */}
        <div className="p-4 rounded-2xl bg-stone-950/80 border border-indigo-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>My Sankalp (Evening Recitation &amp; Self-Scrutiny):</span>
          </div>
          <p className="font-serif-prose text-xs md:text-sm text-stone-200 leading-relaxed italic pl-3 border-l-2 border-indigo-500">
            "{sankalpText}"
          </p>
        </div>

        {/* Tomorrow Morning Brahmamuhurta Reminder Alert */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-indigo-950/50 border border-amber-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Tomorrow Morning's Brahmamuhurta Window</span>
            </div>
            <span className="text-[11px] font-mono text-stone-400">
              Sunrise {tomorrowMuhurta.sunriseTime} · {tomorrowMuhurta.locationName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <p className="font-mono text-xl md:text-2xl font-bold text-amber-200">
                {tomorrowMuhurta.startTime} — {tomorrowMuhurta.endTime}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                Calculated for locked location (96m to 48m before sunrise).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300">
              <span className="text-stone-400 block text-[10px] uppercase">Recommended Bedtime Tonight:</span>
              <strong className="text-stone-100 font-mono text-sm">By {tomorrowMuhurta.recommendedBedtime}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Indriyavijay Sense Gate Audit */}
      <IndriyaSection
        checks={currentLog.indriyavijayChecks}
        onToggleCheck={(key) =>
          onUpdateLog({
            indriyavijayChecks: {
              ...currentLog.indriyavijayChecks,
              [key]: !currentLog.indriyavijayChecks[key],
            },
          })
        }
      />

      {/* Step 2: Trap Radar Audit (The user's key blocker) */}
      <TrapRadar
        audit={currentLog.trapAudit}
        onUpdateAudit={(audit) => onUpdateLog({ trapAudit: audit })}
        onOpenUrgeInterceptor={onOpenUrgeInterceptor}
      />

      {/* Step 3: Diet & Bath Check */}
      <DietSection
        diet={currentLog.dietChecks}
        onToggleDiet={(key) =>
          onUpdateLog({
            dietChecks: {
              ...currentLog.dietChecks,
              [key]: !currentLog.dietChecks[key],
            },
          })
        }
        bathWithoutHotWater={currentLog.bathWithoutHotWater}
        coldWaterBath={currentLog.coldWaterBath}
        onToggleBath={(val) => onUpdateLog({ bathWithoutHotWater: val, coldWaterBath: val })}
      />

      {/* Step 4: Exercise Session Log */}
      <ExerciseLogger
        exercise={currentLog.exercise}
        onUpdateExercise={(entry) => onUpdateLog({ exercise: entry })}
      />

      {/* Step 5: Evening Visualisation & Surrender */}
      <VisualisationGuide
        mode="evening"
        isCompleted={currentLog.eveningVisualisationDone}
        onToggleCompleted={(val) => onUpdateLog({ eveningVisualisationDone: val })}
      />

      {/* Step 6: Mann Prasanna & Evening Reflection */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Heart className="w-5 h-5 text-rose-400" />
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold block">
              Mann Prasanna Status
            </span>
            <h3 className="font-display text-base font-bold text-stone-100">
              State of Inner Joy &amp; Detachment Tonight
            </h3>
          </div>
        </div>

        <p className="text-xs text-stone-400">
          "Become the kind of person who knows how to keep his mann prasanna." Select how your mind rests tonight:
        </p>

        <div className="flex flex-wrap gap-2">
          {(['peaceful', 'calm', 'uplifted', 'restless', 'struggling'] as MannPrasanna[]).map((state) => (
            <button
              key={state}
              onClick={() => handleMannPrasannaChange(state)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                currentLog.mannPrasannaState === state
                  ? 'bg-amber-950/80 border border-amber-600/70 text-amber-200 shadow-sm'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {state === 'peaceful' && '🕊️ Peaceful (Prasanna)'}
              {state === 'calm' && '🌊 Calm & Centered'}
              {state === 'uplifted' && '✨ Uplifted (Bhagwan Ansh)'}
              {state === 'restless' && '🌪️ Slightly Restless'}
              {state === 'struggling' && '⚡ Battled Thoughts'}
            </button>
          ))}
        </div>

        {/* Evening Notes */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs text-stone-300 font-medium block">
            Evening Introspection &amp; Gratitude Note:
          </label>
          <textarea
            value={currentLog.eveningReviewNotes}
            onChange={(e) => onUpdateLog({ eveningReviewNotes: e.target.value })}
            rows={3}
            placeholder="Review how you lived your character and personality today. Acknowledge mistakes without self-loathing; offer all karma to the Lord."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed font-serif-prose"
          />
        </div>
      </div>

      {/* Completion CTA */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center space-y-4">
        <h4 className="font-display text-base font-bold text-indigo-300">
          Ready for Rest in Holy Peace
        </h4>
        <p className="text-xs text-stone-400 max-w-xl mx-auto leading-relaxed">
          Shut off screens now. Tomorrow's Brahmamuhurta begins at <strong>{tomorrowMuhurta.startTime}</strong>. Sleep with a joyous and pure heart.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleToggleEveningComplete}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{currentLog.eveningReviewCompleted ? 'Audit Sealed ✓' : 'Seal Audit & Sleep'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
