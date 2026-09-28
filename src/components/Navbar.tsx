import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles } from 'lucide-react';
import { tanpuraDrone } from '../utils/audio';

interface NavbarProps {
  activeTab: 'today' | 'morning' | 'evening' | 'calendar' | 'teachings';
  setActiveTab: (tab: 'today' | 'morning' | 'evening' | 'calendar' | 'teachings') => void;
  onOpenUrgeInterceptor: () => void;
  dayNumber: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUrgeInterceptor,
  dayNumber,
}) => {
  const [dronePlaying, setDronePlaying] = React.useState(false);

  const toggleDrone = () => {
    const isPlaying = tanpuraDrone.toggle();
    setDronePlaying(isPlaying);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('today')}
          className="text-left group flex items-baseline gap-2.5 focus:outline-none"
        >
          <span className="font-display text-lg md:text-xl font-bold tracking-widest text-amber-500 group-hover:text-amber-400 transition-colors uppercase">
            Brahmacharya
          </span>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Day {dayNumber} of 180
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs tracking-wider uppercase font-medium">
          <button
            onClick={() => setActiveTab('today')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'today'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Dincharya
          </button>
          <button
            onClick={() => setActiveTab('morning')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'morning'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Morning Review
          </button>
          <button
            onClick={() => setActiveTab('evening')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'evening'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Evening Review
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            180-Day Sadhana
          </button>
          <button
            onClick={() => setActiveTab('teachings')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'teachings'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Maharaj Ji Vani
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleDrone}
            title={dronePlaying ? 'Silence Meditative Tanpura Drone' : 'Play Meditative Tanpura Drone'}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs ${
              dronePlaying
                ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
            }`}
            aria-label="Toggle Tanpura Drone"
          >
            {dronePlaying ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden lg:inline text-[11px] font-mono">Tanpura</span>
          </button>

          <button
            onClick={onOpenUrgeInterceptor}
            className="px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 transition-all font-medium text-xs flex items-center gap-1.5 whitespace-nowrap shadow-sm active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Break the Loop</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-between pt-2.5 mt-2 border-t border-stone-800/60 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'today' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'
          }`}
        >
          Dincharya
        </button>
        <button
          onClick={() => setActiveTab('morning')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'morning' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'
          }`}
        >
          Morning
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'evening' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'
          }`}
        >
          Evening
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'calendar' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'
          }`}
        >
          180 Days
        </button>
        <button
          onClick={() => setActiveTab('teachings')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'teachings' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'
          }`}
        >
          Maharaj Ji
        </button>
      </div>
    </header>
  );
};
