import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Download,
  Upload,
  Award,
  CheckCircle2,
  Flame,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckSquare,
  Square,
  Droplets,
  Heart
} from 'lucide-react';
import { ChallengeData } from '../types';
import {
  getDayStatus,
  calculateStreaks,
  getWeeklyPerformance,
  calculateNiyamConsistency,
  calculateFailurePatterns,
  calculateCurrentDayNumber,
  getTodayDateString,
  calculateSadhanaScore,
} from '../utils/storage';
import { SixMonthHeatmap } from './SixMonthHeatmap';

interface CalendarHistoryProps {
  data: ChallengeData;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onImportData: (data: ChallengeData) => void;
  onGoToTodayDincharya?: () => void;
}

export const CalendarHistory: React.FC<CalendarHistoryProps> = ({
  data,
  selectedDate,
  onSelectDate,
  onImportData,
  onGoToTodayDincharya,
}) => {
  const todayStr = getTodayDateString();
  const currentDayNumber = calculateCurrentDayNumber(data.startDate, todayStr);
  const totalDays = data.targetDays || 180;

  // Unified metrics from the exact same daily records
  const streakInfo = calculateStreaks(data);
  const weeklyData = getWeeklyPerformance(data);
  const niyamConsistency = calculateNiyamConsistency(data, 30);
  const failurePatterns = calculateFailurePatterns(data);

  // Selected date log
  const selectedLog = data.dailyLogs[selectedDate];
  const selectedStatus = getDayStatus(selectedLog);
  const selectedScore = selectedLog ? calculateSadhanaScore(selectedLog) : 0;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brahmacharya-sadhana-backup-${data.startDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.startDate && parsed.dailyLogs) {
          onImportData(parsed);
          alert('Sadhana records restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header with Prominent Challenge Day Counter & Unified Streaks */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl md:text-3xl font-extrabold text-amber-400">
                Day {currentDayNumber} / {totalDays}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300 font-semibold">
                6-Month Mahavrat
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Started on {data.startDate} · Real-time accountability across all 180 days
            </p>
          </div>

          {/* Backup & Restore */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <label className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Automatic Backup Protection Prompt */}
        <div className="p-3.5 bg-stone-950/80 border border-amber-600/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-stone-300">
              <strong className="text-amber-300">Protect Your 6-Month Sadhana Data:</strong> Save a periodic offline backup snapshot to ensure your streaks and records are never lost.
            </span>
          </div>
          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Unified Accountability Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Overall Challenge Completion % */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-amber-500/90 font-mono block">
              Overall Completion %
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-extrabold text-stone-100">
                {streakInfo.overallCompletionRate}%
              </span>
              <span className="text-xs font-mono text-stone-500">
                ({streakInfo.totalCompletedDays}/{totalDays}d)
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono">
              Calculated from unified daily records
            </p>
          </div>

          {/* Current Streak */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-orange-400 font-mono block flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Current Streak</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-orange-300">
                {streakInfo.currentStreak}
              </span>
              <span className="text-xs font-mono text-stone-400">Days</span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono">
              Active consecutive complete days
            </p>
          </div>

          {/* Longest Streak */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-mono block flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Longest Streak</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-indigo-300">
                {streakInfo.longestStreak}
              </span>
              <span className="text-xs font-mono text-stone-400">Days</span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono">
              Highest unbroken discipline record
            </p>
          </div>

          {/* Days Elapsed */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-mono block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Days Elapsed</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-cyan-200">
                {streakInfo.totalDaysElapsed}
              </span>
              <span className="text-xs font-mono text-stone-400">/ 180</span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono">
              {Math.max(0, totalDays - streakInfo.totalDaysElapsed)} days remaining
            </p>
          </div>
        </div>
      </div>

      {/* 2. 6-Month Calendar Heatmap (All 180 Days) */}
      <SixMonthHeatmap
        data={data}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* 3. Granular Selected Day Inspector (Supplementing Heatmap with Detailed Daily Audit) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-500 font-mono font-semibold block">
                Daily Record Inspector
              </span>
              <h3 className="font-display text-lg font-bold text-stone-100">
                Date: {selectedDate}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase ${
                selectedStatus === 'complete'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : selectedStatus === 'partial'
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                  : 'bg-stone-800 text-stone-500'
              }`}
            >
              Status: {selectedStatus} ({selectedScore}%)
            </span>

            {onGoToTodayDincharya && (
              <button
                onClick={onGoToTodayDincharya}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Edit in Dincharya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Day Quick Checklist Overview */}
        {selectedLog ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase">Brahmamuhurta:</span>
              <strong className={selectedLog.brahmamuhurtaWakeUp ? 'text-emerald-400' : 'text-stone-500'}>
                {selectedLog.brahmamuhurtaWakeUp ? '✓ Awakened' : '— Not Logged'}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase">Bath Without Hot Water:</span>
              <strong className={selectedLog.bathWithoutHotWater || selectedLog.coldWaterBath ? 'text-emerald-400' : 'text-stone-500'}>
                {selectedLog.bathWithoutHotWater || selectedLog.coldWaterBath ? '✓ Completed' : '— Not Logged'}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase">Dhyana (Siddhasana):</span>
              <strong className={selectedLog.dhyanaMinutes >= 48 ? 'text-emerald-400' : 'text-amber-300'}>
                {selectedLog.dhyanaMinutes}m logged
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase">Naam Jap (Malas):</span>
              <strong className="text-amber-300">
                {selectedLog.malasCount || Math.floor((selectedLog.japCount || 0) / 108)} Malas ({selectedLog.japCount || 0})
              </strong>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic">
            No entries recorded for this date yet.
          </p>
        )}
      </div>

      {/* 4. Weekly Performance (Last 7 Days) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-500 font-mono font-semibold block">
                7-Day Momentum
              </span>
              <h3 className="font-display text-lg font-bold text-stone-100">
                Weekly Performance (Last 7 Days)
              </h3>
            </div>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Naam Jap Malas &amp; Dhyana Minutes
          </span>
        </div>

        {/* 7-day Bar/Card Layout */}
        <div className="grid grid-cols-7 gap-2 pt-1">
          {weeklyData.map((w) => {
            const isToday = w.date === todayStr;
            return (
              <div
                key={w.date}
                onClick={() => onSelectDate(w.date)}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between gap-2 transition-all cursor-pointer ${
                  isToday
                    ? 'bg-amber-950/50 border-amber-600/70 shadow-md'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                }`}
              >
                <span className={`text-[11px] font-mono font-bold ${isToday ? 'text-amber-300' : 'text-stone-400'}`}>
                  {w.dayLabel}
                </span>

                <div className="space-y-1 my-1">
                  <div className="text-xs font-mono font-extrabold text-amber-400">
                    {w.malas} <span className="text-[10px] font-normal text-stone-500">Mala</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-indigo-300">
                    {w.dhyanaMinutes}m
                  </div>
                </div>

                <span
                  className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ${
                    w.status === 'complete'
                      ? 'bg-amber-500/20 text-amber-300'
                      : w.status === 'partial'
                      ? 'bg-stone-800 text-stone-400'
                      : 'bg-stone-900 text-stone-600'
                  }`}
                >
                  {w.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Monthly Niyam Consistency (Individual Niyam Adherence) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-500 font-mono font-semibold block">
              30-Day Diagnostic
            </span>
            <h3 className="font-display text-lg font-bold text-stone-100">
              Monthly Niyam Consistency
            </h3>
          </div>
          <p className="text-xs text-stone-400">
            Identifies which specific Niyams are consistently honored vs. repeatedly missed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {niyamConsistency.map((item) => {
            const isHigh = item.percent >= 80;
            const isLow = item.percent < 50;

            return (
              <div
                key={item.key}
                className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-200">
                    {item.label}
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      isHigh ? 'text-amber-400' : isLow ? 'text-red-400' : 'text-stone-300'
                    }`}
                  >
                    {item.percent}% ({item.completedDays}/{item.totalDays}d)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh ? 'bg-amber-500' : isLow ? 'bg-red-500' : 'bg-stone-400'
                    }`}
                    style={{ width: `${Math.max(2, item.percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Failure Pattern Tracking (Recurring Root Cause Analysis) */}
      <div className="bg-stone-900/90 border border-red-950/60 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <span className="text-xs uppercase tracking-wider text-red-400 font-mono font-semibold block">
                Root Cause Recurrence
              </span>
              <h3 className="font-display text-lg font-bold text-stone-100">
                Failure Pattern Tracking
              </h3>
            </div>
          </div>
          <p className="text-xs text-stone-400">
            Frequency of your exact mental traps across the challenge
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {failurePatterns.map((f) => (
            <div
              key={f.trap}
              className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5"
            >
              <span className="text-xs font-semibold text-stone-200 block">
                {f.label}
              </span>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-[11px] text-stone-500">Past 30 Days:</span>
                <span className={`font-mono text-sm font-bold ${f.count30Days > 0 ? 'text-red-400' : 'text-stone-400'}`}>
                  {f.count30Days} times
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-stone-900 pt-1">
                <span className="text-[11px] text-stone-500">All-Time Total:</span>
                <span className="font-mono text-xs text-stone-300 font-semibold">
                  {f.countTotal} times
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
