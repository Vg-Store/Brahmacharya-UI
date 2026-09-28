import React, { useState } from 'react';
import { Flame, CheckCircle, Edit3, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { playTempleGong } from '../utils/audio';

interface SankalpBannerProps {
  sankalpText: string;
  onUpdateSankalp: (newText: string) => void;
  dayNumber: number;
}

export const SankalpBanner: React.FC<SankalpBannerProps> = ({
  sankalpText,
  onUpdateSankalp,
  dayNumber,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(sankalpText);
  const [isExpanded, setIsExpanded] = useState(true);
  const [justReaffirmed, setJustReaffirmed] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  const handleReaffirm = () => {
    playTempleGong(432, 2.8);
    setJustReaffirmed(true);
    setTimeout(() => setJustReaffirmed(false), 2400);
  };

  const handleSave = () => {
    onUpdateSankalp(tempText);
    setIsEditing(false);
  };

  return (
    <section className="bg-stone-900/90 border border-amber-600/40 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Subtle warm amber ambient glow in the top-right corner */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base md:text-lg font-bold tracking-wide text-amber-300 uppercase">
                Sacred Sankalp
              </h2>
              <span className="text-[11px] font-mono text-stone-400 border border-stone-700/60 px-2 py-0.5 rounded">
                Day {dayNumber} of 180
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Review every morning and evening without exception
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setShowReminders(!showReminders)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
              showReminders
                ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Spiritual Reminders</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
            aria-label={isExpanded ? 'Collapse Sankalp' : 'Expand Sankalp'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                rows={5}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-sm text-stone-200 font-serif-prose focus:outline-none focus:border-amber-500 leading-relaxed"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold"
                >
                  Save Sankalp
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <p className="font-serif-prose text-stone-200 text-sm md:text-base leading-relaxed whitespace-pre-line italic pl-3 border-l-2 border-amber-500/60">
                "{sankalpText}"
              </p>
              <button
                onClick={() => {
                  setTempText(sankalpText);
                  setIsEditing(true);
                }}
                className="absolute top-0 right-0 text-stone-500 hover:text-stone-300 text-xs flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          )}

          {/* Core Reminders Drawer */}
          {showReminders && (
            <div className="mt-3 pt-3 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-amber-400 font-semibold block mb-0.5">Bhagwan ke Ansh</span>
                <span className="text-stone-300">You are a divine spark of the Supreme. Never degrade your consciousness in petty lust.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-amber-400 font-semibold block mb-0.5">Karma &gt; Phala</span>
                <span className="text-stone-300">The more Moha (attachment) to results, the weaker the execution. Detach completely from outcomes.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-amber-400 font-semibold block mb-0.5">Mann Prasanna</span>
                <span className="text-stone-300">Cultivate an ever-cheerful, tranquil mind. An agitated mind easily falls into sensory cravings.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-amber-400 font-semibold block mb-0.5">Restrain Planning → Focus on Execution</span>
                <span className="text-stone-300">Kill the cycle of YouTube / Anime / K-drama / overthinking by immediate physical action.</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-stone-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Naam Jap: <strong className="text-stone-200">Aum Gam Ganapataye Namaha</strong></span>
            </div>

            <button
              onClick={handleReaffirm}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                justReaffirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md active:scale-95'
              }`}
            >
              {justReaffirmed ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Sankalp Reaffirmed with Reverence!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Recite &amp; Reaffirm Sankalp Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
