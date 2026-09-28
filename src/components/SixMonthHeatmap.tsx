import React from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { ChallengeData } from '../types';
import { getDayStatus, getTodayDateString } from '../utils/storage';

interface SixMonthHeatmapProps {
  data: ChallengeData;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const SixMonthHeatmap: React.FC<SixMonthHeatmapProps> = ({
  data,
  selectedDate,
  onSelectDate,
}) => {
  const totalDays = data.targetDays || 180;
  const startDate = new Date(data.startDate);
  const todayStr = getTodayDateString();

  // Map all 180 days by their YYYY-MM-DD string with their Challenge Day number (1 to 180)
  const challengeDaysMap = new Map<string, { dayNumber: number; dateStr: string }>();
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    challengeDaysMap.set(dateStr, { dayNumber: i + 1, dateStr });
  }

  // End date of the 180-day challenge
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDays - 1);

  // Collect all Gregorian calendar months from start date to end date
  interface MonthCalendar {
    year: number;
    monthIndex: number; // 0-11
    monthName: string;
    weeks: Array<Array<{
      dateStr: string;
      dayOfMonth: number;
      isCurrentMonth: boolean;
      challengeDayNumber?: number;
      status?: 'complete' | 'partial' | 'missed' | 'upcoming';
      isToday: boolean;
    } | null>>;
  }

  const calendarMonths: MonthCalendar[] = [];
  const curMonthCursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endMonthCursor = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  while (curMonthCursor <= endMonthCursor) {
    const y = curMonthCursor.getFullYear();
    const m = curMonthCursor.getMonth();
    const firstDayWeekday = new Date(y, m, 1).getDay(); // 0 = Sun, 1 = Mon ...
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const weeks: MonthCalendar['weeks'] = [];
    let currentWeek: MonthCalendar['weeks'][0] = [];

    // Pad days before the 1st
    for (let pad = 0; pad < firstDayWeekday; pad++) {
      currentWeek.push(null);
    }

    // Days of the month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const challengeInfo = challengeDaysMap.get(dateStr);
      const isToday = dateStr === todayStr;
      const isFuture = dateStr > todayStr;
      const log = data.dailyLogs[dateStr];
      const status = isFuture ? 'upcoming' : getDayStatus(log);

      currentWeek.push({
        dateStr,
        dayOfMonth: dayNum,
        isCurrentMonth: true,
        challengeDayNumber: challengeInfo?.dayNumber,
        status: challengeInfo ? status : undefined,
        isToday,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Pad remaining days of the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    calendarMonths.push({
      year: y,
      monthIndex: m,
      monthName: `${monthNames[m]} ${y}`,
      weeks,
    });

    curMonthCursor.setMonth(curMonthCursor.getMonth() + 1);
  }

  const dayOfWeekHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-500 font-mono font-semibold block">
            Gregorian Calendar Grid · 180-Day Sadhana
          </span>
          <h2 className="font-display text-xl font-bold text-stone-100">
            6-Month Calendar Heatmap
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-500" />
            <span>Complete (≥70% + Reviews)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-950 border border-amber-600" />
            <span>Partial</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-stone-900 border border-stone-700" />
            <span>Missed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-stone-950 border border-stone-800 opacity-40" />
            <span>Upcoming</span>
          </span>
        </div>
      </div>

      {/* Calendar Months Grid (Actual calendar months with Sun-Sat alignment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {calendarMonths.map((cal) => (
          <div
            key={cal.monthName}
            className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800/90 space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <span className="font-display text-xs font-bold text-stone-200">
                {cal.monthName}
              </span>
              <span className="text-[10px] font-mono text-stone-500">
                Calendar View
              </span>
            </div>

            {/* Sun-Sat Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-stone-500 font-bold pb-1">
              {dayOfWeekHeaders.map((header, idx) => (
                <span key={idx}>{header}</span>
              ))}
            </div>

            {/* Month Weeks Grid */}
            <div className="space-y-1">
              {cal.weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 gap-1">
                  {week.map((cell, cIdx) => {
                    if (!cell) {
                      return <div key={cIdx} className="h-7 rounded opacity-0" />;
                    }

                    const isSelected = cell.dateStr === selectedDate;
                    const inChallenge = cell.challengeDayNumber !== undefined;

                    let cellStyle = 'bg-stone-950/50 text-stone-700 border border-transparent';

                    if (inChallenge) {
                      if (cell.status === 'complete') {
                        cellStyle = 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold border border-amber-400 shadow-sm';
                      } else if (cell.status === 'partial') {
                        cellStyle = 'bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/70 text-amber-300';
                      } else if (cell.status === 'missed') {
                        cellStyle = 'bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-500';
                      } else if (cell.status === 'upcoming') {
                        cellStyle = 'bg-stone-950 border border-stone-850 text-stone-600 opacity-60';
                      }
                    }

                    if (cell.isToday) {
                      cellStyle += ' ring-2 ring-white ring-offset-1 ring-offset-stone-950';
                    }

                    if (isSelected) {
                      cellStyle += ' scale-110 z-10 ring-2 ring-amber-400';
                    }

                    return (
                      <button
                        key={cIdx}
                        onClick={() => onSelectDate(cell.dateStr)}
                        disabled={!inChallenge}
                        className={`h-7 rounded-md flex flex-col items-center justify-center text-[10px] font-mono transition-transform ${cellStyle} ${
                          inChallenge ? 'cursor-pointer' : 'cursor-default opacity-20'
                        }`}
                        title={
                          inChallenge
                            ? `Day ${cell.challengeDayNumber} (${cell.dateStr}) · Status: ${cell.status?.toUpperCase()}`
                            : cell.dateStr
                        }
                      >
                        <span>{cell.dayOfMonth}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Day Inspector */}
      <div className="p-3.5 bg-stone-950/90 border border-stone-800 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-stone-300">
            Selected Date: <strong className="text-stone-100 font-mono">{selectedDate}</strong>
          </span>
          <span className="text-stone-500 font-mono">
            ({getDayStatus(data.dailyLogs[selectedDate]).toUpperCase()})
          </span>
        </div>
      </div>
    </div>
  );
};
