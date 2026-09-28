import React from 'react';
import { Activity, Clock, Flame, CheckCircle2, Circle } from 'lucide-react';
import { ExerciseEntry, Intensity } from '../types';

interface ExerciseLoggerProps {
  exercise: ExerciseEntry;
  onUpdateExercise: (entry: ExerciseEntry) => void;
}

const PRESET_ACTIVITIES = [
  'Surya Namaskar',
  'Bodyweight & Calisthenics',
  'Running / Jogging',
  'Yoga Asanas',
  'Strength & Weights',
  'Brisk Walking',
];

export const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({ exercise, onUpdateExercise }) => {
  const handleChange = (fields: Partial<ExerciseEntry>) => {
    onUpdateExercise({
      ...exercise,
      ...fields,
    });
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold block">
            Vyayama · Physical Vigour
          </span>
          <h3 className="font-display text-lg font-bold text-stone-100">
            Exercise Session Log
          </h3>
        </div>

        <button
          onClick={() => handleChange({ completed: !exercise.completed })}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all self-start sm:self-auto ${
            exercise.completed
              ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300'
              : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          {exercise.completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Exercise Completed Today</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-stone-500" />
              <span>Mark Session as Done</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-stone-400">
        Record what you did and duration. Physical exertion channels raw vitality into pure stamina and prevents pent-up restlessness.
      </p>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Activity Field */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs text-stone-300 font-medium block">
            What did you do? (Activity)
          </label>
          <input
            type="text"
            value={exercise.activity}
            onChange={(e) => handleChange({ activity: e.target.value, completed: true })}
            placeholder="e.g. 24 Surya Namaskars, Calisthenics, Running"
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_ACTIVITIES.map((act) => (
              <button
                key={act}
                onClick={() => handleChange({ activity: act, completed: true })}
                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-stone-700 transition-colors"
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Field */}
        <div className="space-y-1.5">
          <label className="text-xs text-stone-300 font-medium block">
            Duration (Minutes)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={exercise.durationMinutes || ''}
              onChange={(e) => handleChange({ durationMinutes: parseInt(e.target.value, 10) || 0, completed: true })}
              placeholder="e.g. 45"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
            />
            <Clock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
          </div>

          {/* Intensity selector */}
          <div className="flex items-center gap-1 pt-1">
            {(['light', 'moderate', 'high'] as Intensity[]).map((level) => (
              <button
                key={level}
                onClick={() => handleChange({ intensity: level })}
                className={`flex-1 py-1 rounded text-[10px] capitalize transition-colors ${
                  exercise.intensity === level
                    ? 'bg-amber-950/80 border border-amber-600/50 text-amber-300 font-medium'
                    : 'bg-stone-950 border border-stone-800 text-stone-500'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Field */}
      <div className="space-y-1">
        <label className="text-xs text-stone-400 block">
          Session Reflection / Notes
        </label>
        <input
          type="text"
          value={exercise.notes}
          onChange={(e) => handleChange({ notes: e.target.value })}
          placeholder="e.g. Felt focused, sweat purged toxins, feeling grounded and energised."
          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-stone-700"
        />
      </div>
    </div>
  );
};
