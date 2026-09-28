import React from 'react';
import { Flame, Award, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { ChallengeData } from '../types';
import { calculateStreaks } from '../utils/storage';

interface AccountabilityDashboardProps {
  data: ChallengeData;
  onViewCalendar?: () => void;
}

export const AccountabilityDashboard: React.FC<AccountabilityDashboardProps> = ({
  data,
  onViewCalendar,
}) => {
  const streaks = calculateStreaks(data);
  const totalDays = data.targetDays || 180;

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-500 font-mono font-semibold block">
            Core Accountability · 180-Day Challenge
          </span>
          <h2 className="font-display text-lg font-bold text-stone-100">
            Accountability Dashboard
          </h2>
        </div>

        {onViewCalendar && (
          <button
            onClick={onViewCalendar}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View 6-Month Calendar Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* 1. Overall Completion Percentage */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/90 space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider text-amber-500/90 font-mono font-medium block">
            Overall 180-Day Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-stone-100">
              {streaks.overallCompletionRate}%
            </span>
            <span className="text-xs font-mono text-stone-400">
              ({streaks.totalCompletedDays} / {totalDays} Days)
            </span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, streaks.overallCompletionRate)}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-500 font-mono pt-0.5">
            Strictly complete days (both reviews + core Niyams)
          </p>
        </div>

        {/* 2. Current Consecutive-Day Streak */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/90 space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider text-orange-400 font-mono font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Current Consecutive Streak</span>
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-orange-300">
              {streaks.currentStreak}
            </span>
            <span className="text-xs font-mono text-stone-400">Days Unbroken</span>
          </div>
          <p className="text-[10px] text-stone-500 font-mono pt-1">
            {streaks.currentStreak > 0
              ? 'Unbroken chain of complete days'
              : 'Complete today’s Dincharya to build streak'}
          </p>
        </div>

        {/* 3. Longest Streak Achieved */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/90 space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-mono font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Longest Streak Achieved</span>
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-indigo-300">
              {streaks.longestStreak}
            </span>
            <span className="text-xs font-mono text-stone-400">Days Peak</span>
          </div>
          <p className="text-[10px] text-stone-500 font-mono pt-1">
            Highest uninterrupted discipline achieved
          </p>
        </div>
      </div>

      {/* Transparent "Complete Day" Definition */}
      <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between text-[11px] text-stone-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Complete Day Criteria: ≥ 70% of 7 Core Practices (≥ 5/7 adhered) + Both Morning &amp; Evening Reviews Sealed</span>
        </div>
        <span className="text-amber-400 font-semibold hidden sm:inline">Authoritative Standard</span>
      </div>
    </div>
  );
};
