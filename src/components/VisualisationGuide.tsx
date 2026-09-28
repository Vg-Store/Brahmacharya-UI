import React, { useState, useEffect } from 'react';
import { Eye, Sun, Moon, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { playTempleGong } from '../utils/audio';

interface VisualisationGuideProps {
  mode: 'morning' | 'evening';
  isCompleted: boolean;
  onToggleCompleted: (completed: boolean) => void;
}

export const VisualisationGuide: React.FC<VisualisationGuideProps> = ({
  mode,
  isCompleted,
  onToggleCompleted,
}) => {
  const [seconds, setSeconds] = useState(300); // 5 minutes = 300 seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIsActive(false);
            playTempleGong(528, 4.0);
            onToggleCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onToggleCompleted]);

  const toggle = () => {
    if (!isActive) playTempleGong(432, 2.0);
    setIsActive(!isActive);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const isMorning = mode === 'morning';

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          {isMorning ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400" />
          )}
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold block">
              {isMorning ? 'Pratah Manthan' : 'Sayam Shanti'} · Inner Vision
            </span>
            <h3 className="font-display text-lg font-bold text-stone-100">
              {isMorning ? 'Morning Visualisation & Manifestation' : 'Evening Visualisation & Surrender'}
            </h3>
          </div>
        </div>

        <button
          onClick={() => onToggleCompleted(!isCompleted)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all self-start sm:self-auto ${
            isCompleted
              ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300'
              : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-stone-600'}`} />
          <span>{isCompleted ? 'Visualisation Complete' : 'Mark Completed'}</span>
        </button>
      </div>

      {/* Guided Visualisation Text */}
      <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 text-xs md:text-sm text-stone-300 leading-relaxed font-serif-prose space-y-2.5">
        {isMorning ? (
          <>
            <p className="text-amber-200 font-semibold italic">
              "Close your eyes. Envision the person you are becoming through Brahmacharya:"
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-300">
              <li>See yourself rooted in absolute composure, radiant with Ojas and spiritual Tejas.</li>
              <li>You are <strong>Bhagwan ke Ansh</strong> — noble, pure, unshakable before petty temptations.</li>
              <li>Envision yourself executing every Dincharya task without hesitation, moving smoothly from action to action.</li>
              <li>Feel your mind cheerful, light, and full of <strong>Mann Prasanna</strong>.</li>
            </ul>
          </>
        ) : (
          <>
            <p className="text-indigo-200 font-semibold italic">
              "Release the day. Envision total surrender of fruits (Karma &gt; Phala):"
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-300">
              <li>Recall: The more Moha (attachment) to results, the more anxiety. Let go of every outcome.</li>
              <li>Dissolve all sensory impressions gathered during the day into the sacred flame of awareness.</li>
              <li>Feel divine protection enveloping you as you prepare to sleep on time for tomorrow's Brahmamuhurta.</li>
              <li>Rest in unconditioned peace, knowing you acted with integrity and truth.</li>
            </ul>
          </>
        )}
      </div>

      {/* 5-Minute Meditative Timer */}
      <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-transform active:scale-95"
            title={isActive ? 'Pause' : 'Start 5m Timer'}
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <div>
            <span className="font-mono text-base font-bold text-amber-300 block">
              {formatTime(seconds)}
            </span>
            <span className="text-[10px] text-stone-400">
              5-Minute Guided Immersion
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsActive(false);
            setSeconds(300);
          }}
          className="p-2 text-stone-500 hover:text-stone-300 rounded-lg hover:bg-stone-900 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
