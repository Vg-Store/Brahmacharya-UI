import React from 'react';
import { Sun, CheckCircle2, Circle, Flame, Droplets, ArrowRight } from 'lucide-react';
import { DailyLog } from '../types';
import { playTempleGong } from '../utils/audio';
import { BrahmamuhurtaCard } from './BrahmamuhurtaCard';
import { VisualisationGuide } from './VisualisationGuide';
import { JapCounter } from './JapCounter';
import { DhyanaTimer } from './DhyanaTimer';
import { SolarLocation } from '../utils/solar';

interface MorningReviewViewProps {
  currentLog: DailyLog;
  onUpdateLog: (updated: Partial<DailyLog>) => void;
  sankalpText: string;
  solarLocation?: SolarLocation;
  onUpdateLocation: (loc: SolarLocation) => void;
  dayNumber: number;
  onGoToTab: (tab: 'today' | 'evening' | 'calendar') => void;
}

export const MorningReviewView: React.FC<MorningReviewViewProps> = ({
  currentLog,
  onUpdateLog,
  sankalpText,
  solarLocation,
  onUpdateLocation,
  dayNumber,
  onGoToTab,
}) => {
  const handleToggleMorningComplete = () => {
    playTempleGong(528, 3.5);
    onUpdateLog({ morningReviewCompleted: !currentLog.morningReviewCompleted });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Morning Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-semibold">
                Pratah Kalin Samiksha · Day {dayNumber} of 180
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-100">
                Morning Sacred Review
              </h1>
            </div>
          </div>

          <button
            onClick={handleToggleMorningComplete}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              currentLog.morningReviewCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {currentLog.morningReviewCompleted
                ? 'Morning Review Completed!'
                : 'Complete Morning Review'}
            </span>
          </button>
        </div>

        {/* Sankalp Reaffirmation */}
        <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>My Sacred Sankalp (Recite with Full Conviction):</span>
          </div>
          <p className="font-serif-prose text-xs md:text-sm text-stone-200 leading-relaxed italic pl-3 border-l-2 border-amber-500">
            "{sankalpText}"
          </p>
        </div>
      </div>

      {/* Step 1: Brahmamuhurta Card */}
      <BrahmamuhurtaCard
        location={solarLocation}
        onUpdateLocation={onUpdateLocation}
        wokeUpInBrahmamuhurta={currentLog.brahmamuhurtaWakeUp}
        onToggleWokeUp={(val) => onUpdateLog({ brahmamuhurtaWakeUp: val })}
      />

      {/* Step 2: Bath Without Hot Water */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold block">
                Niyam · Snan
              </span>
              <h3 className="font-display text-base font-bold text-stone-100">
                Bath Without Hot Water
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              const isBathDone = Boolean(currentLog.bathWithoutHotWater || currentLog.coldWaterBath);
              onUpdateLog({ bathWithoutHotWater: !isBathDone, coldWaterBath: !isBathDone });
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              currentLog.bathWithoutHotWater || currentLog.coldWaterBath
                ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {currentLog.bathWithoutHotWater || currentLog.coldWaterBath ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bath Taken (No Hot Water)</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-stone-500" />
                <span>Mark Bath Done</span>
              </>
            )}
          </button>

        </div>
        <p className="text-xs text-stone-400">
          Bath taken without hot water to maintain physical discipline, vigour, and clear awareness.
        </p>
      </div>

      {/* Step 3: Morning Visualisation & Manifestation */}
      <VisualisationGuide
        mode="morning"
        isCompleted={currentLog.morningVisualisationDone}
        onToggleCompleted={(val) => onUpdateLog({ morningVisualisationDone: val })}
      />

      {/* Step 4: Naam Jap (Mala Tracker) */}
      <JapCounter
        count={currentLog.japCount}
        malasCount={currentLog.malasCount}
        onUpdateCount={(totalChants, malas) => onUpdateLog({ japCount: totalChants, malasCount: malas })}
      />

      {/* Step 5: Dhyana in Siddhasana (Min 48 mins) */}
      <DhyanaTimer
        loggedMinutes={currentLog.dhyanaMinutes}
        completed={currentLog.dhyanaCompleted}
        onUpdateDhyana={(mins, completed) => onUpdateLog({ dhyanaMinutes: mins, dhyanaCompleted: completed })}
      />

      {/* Morning Action Directives & Conclusion */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center space-y-4">
        <h4 className="font-display text-base font-bold text-amber-300">
          Ready to Step into Today's Execution
        </h4>
        <p className="text-xs text-stone-400 max-w-xl mx-auto leading-relaxed">
          Remember the core trap: <em>Planning → Information (YouTube/Shows) → Distraction → Overthinking → Living in the Mind</em>.
          Restrain the urge to plan endlessly. Jump directly into your daily actionable work and maintain pure Dincharya.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onGoToTab('today')}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>Proceed to Dincharya Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
