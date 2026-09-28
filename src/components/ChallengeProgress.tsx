import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame, Award } from 'lucide-react';
import { calculateSadhanaScore, calculateStreaks } from '../utils/storage';
import { ChallengeData, DailyLog } from '../types';

interface ChallengeProgressProps {
  dayNumber: number;
  totalDays: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  currentLog: DailyLog;
  todayDate: string;
  data: ChallengeData;
}

const MILESTONES = [
  { day: 7, label: '7 Days', title: 'Inertia Shattered' },
  { day: 21, label: '21 Days', title: 'Habit Rebirth' },
  { day: 40, label: '40 Days', title: '1 Mandala Purified' },
  { day: 90, label: '90 Days', title: 'Ojas Radiance' },
  { day: 180, label: '180 Days', title: 'Brahmacharya Siddhi' },
];

export const ChallengeProgress: React.FC<ChallengeProgressProps> = ({
  dayNumber,
  totalDays,
  selectedDate,
  onSelectDate,
  currentLog,
  todayDate,
  data,
}) => {
  const streaks = calculateStreaks(data);
  const score = calculateSadhanaScore(currentLog);

  const handlePrevDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() - 1);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${d}`);
  };

  const handleNextDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + 1);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${d}`);
  };

  const isToday = selectedDate === todayDate;

  return (
    <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 md:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Prominent Day Counter & Streaks */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl font-extrabold text-amber-400">
              Day {dayNumber} / {totalDays}
            </span>
            <span className="text-xs text-amber-500/90 font-mono ml-2 border border-amber-500/30 px-2.5 py-0.5 rounded-full bg-amber-500/10 font-semibold">
              {streaks.overallCompletionRate}% Overall
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 font-mono">
            <span className="flex items-center gap-1 text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Streak: <strong>{streaks.currentStreak}d</strong></span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-indigo-300">
              <Award className="w-3.5 h-3.5" />
              <span>Longest: <strong>{streaks.longestStreak}d</strong></span>
            </span>
            <span>·</span>
            <span>{streaks.totalCompletedDays} Complete Days</span>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-2 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-stone-200">{selectedDate}</span>
            {isToday && (
              <span className="ml-1 text-[10px] text-amber-400 font-semibold bg-amber-950/70 px-1.5 py-0.5 rounded">
                TODAY
              </span>
            )}
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => onSelectDate(todayDate)}
              className="text-[11px] text-amber-400 hover:underline px-2 font-medium"
            >
              Back to Today
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (Overall 180-day challenge) */}
      <div className="space-y-1.5">
        <div className="w-full bg-stone-950 rounded-full h-2.5 overflow-hidden border border-stone-800/80">
          <div
            className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(2, (dayNumber / totalDays) * 100)}%` }}
          />
        </div>

        {/* Milestones markers */}
        <div className="grid grid-cols-5 text-center gap-1 pt-1">
          {MILESTONES.map((m) => {
            const reached = dayNumber >= m.day;
            return (
              <div key={m.day} className="flex flex-col items-center">
                <span
                  className={`text-[11px] font-mono font-medium ${
                    reached ? 'text-amber-400' : 'text-stone-500'
                  }`}
                >
                  {m.label}
                </span>
                <span className="text-[10px] text-stone-400 hidden sm:inline truncate max-w-[80px]">
                  {m.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Score Strip for selected date */}
      <div className="pt-2 border-t border-stone-800/70 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="text-stone-400">Selected Day Score:</span>
          <span className="font-mono font-bold text-amber-300 text-sm">{score}%</span>
          <span className="text-stone-400 text-[11px]">
            {score >= 70 ? '· Complete Day' : score >= 25 ? '· Partial Progress' : '· Action Needed'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-stone-400 text-xs">
          <span className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                currentLog.morningReviewCompleted ? 'bg-emerald-400' : 'bg-stone-600'
              }`}
            />
            <span>Morning Review</span>
          </span>
          <span className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                currentLog.eveningReviewCompleted ? 'bg-emerald-400' : 'bg-stone-600'
              }`}
            />
            <span>Evening Review</span>
          </span>
        </div>
      </div>
    </div>
  );
};
