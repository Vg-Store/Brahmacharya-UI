import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  ArrowRight,
} from 'lucide-react';
import { ChallengeData, DailyLog } from './types';
import {
  loadChallengeData,
  saveChallengeData,
  getTodayDateString,
  createEmptyDailyLog,
  calculateCurrentDayNumber,
} from './utils/storage';
import { SolarLocation, getDefaultLocation } from './utils/solar';
import { Navbar } from './components/Navbar';
import { SankalpBanner } from './components/SankalpBanner';
import { AccountabilityDashboard } from './components/AccountabilityDashboard';
import { ChallengeProgress } from './components/ChallengeProgress';

import { MorningReviewView } from './components/MorningReviewView';
import { EveningReviewView } from './components/EveningReviewView';
import { JapCounter } from './components/JapCounter';
import { DhyanaTimer } from './components/DhyanaTimer';
import { BrahmamuhurtaCard } from './components/BrahmamuhurtaCard';
import { IndriyaSection } from './components/IndriyaSection';
import { DietSection } from './components/DietSection';
import { ExerciseLogger } from './components/ExerciseLogger';
import { TrapRadar } from './components/TrapRadar';
import { TeachingsSection } from './components/TeachingsSection';
import { CalendarHistory } from './components/CalendarHistory';
import { UrgeInterceptorModal } from './components/UrgeInterceptorModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';


export default function App() {
  const [data, setData] = useState<ChallengeData>(loadChallengeData);
  const todayDate = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [activeTab, setActiveTab] = useState<'today' | 'morning' | 'evening' | 'calendar' | 'teachings'>('today');
  const [isUrgeOpen, setIsUrgeOpen] = useState(false);

  // Auto-save whenever data changes
  useEffect(() => {
    saveChallengeData(data);
  }, [data]);

  // Current day log
  const currentLog: DailyLog = data.dailyLogs[selectedDate] || createEmptyDailyLog(selectedDate);
  const dayNumber = calculateCurrentDayNumber(data.startDate, selectedDate);
  const solarLocation = data.solarLocation || getDefaultLocation();

  const handleUpdateLog = (updatedFields: Partial<DailyLog>) => {
    setData((prev) => {
      const existing = prev.dailyLogs[selectedDate] || createEmptyDailyLog(selectedDate);
      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [selectedDate]: {
            ...existing,
            ...updatedFields,
          },
        },
      };
    });
  };

  const handleUpdateSankalp = (newText: string) => {
    setData((prev) => ({
      ...prev,
      sankalpText: newText,
    }));
  };

  const handleUpdateLocation = (loc: SolarLocation) => {
    setData((prev) => ({
      ...prev,
      solarLocation: loc,
    }));
  };

  const handleImportData = (newData: ChallengeData) => {
    setData(newData);
    saveChallengeData(newData);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600/30 selection:text-amber-200">
      {/* Top Bar following Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUrgeInterceptor={() => setIsUrgeOpen(true)}
        dayNumber={dayNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* PWA Offline / Install Prompt */}
        <PwaInstallPrompt />

        {/* Morning Review Tab */}

        {activeTab === 'morning' && (
          <MorningReviewView
            currentLog={currentLog}
            onUpdateLog={handleUpdateLog}
            sankalpText={data.sankalpText}
            solarLocation={solarLocation}
            onUpdateLocation={handleUpdateLocation}
            dayNumber={dayNumber}
            onGoToTab={setActiveTab}
          />
        )}

        {/* Evening Review Tab */}
        {activeTab === 'evening' && (
          <EveningReviewView
            currentLog={currentLog}
            onUpdateLog={handleUpdateLog}
            sankalpText={data.sankalpText}
            solarLocation={solarLocation}
            dayNumber={dayNumber}
            onOpenUrgeInterceptor={() => setIsUrgeOpen(true)}
            onGoToTab={setActiveTab}
          />
        )}

        {/* 180-Day Sadhana Tab */}
        {activeTab === 'calendar' && (
          <CalendarHistory
            data={data}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
            }}
            onImportData={handleImportData}
            onGoToTodayDincharya={() => setActiveTab('today')}
          />
        )}

        {/* Premanand Maharaj Ji Teachings Tab (Bhajan Marg Verified) */}
        {activeTab === 'teachings' && <TeachingsSection />}

        {/* Today's Active Dincharya Dashboard Tab */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Sankalp Banner (Shown Every Time as requested) */}
            <SankalpBanner
              sankalpText={data.sankalpText}
              onUpdateSankalp={handleUpdateSankalp}
              dayNumber={dayNumber}
            />

            {/* Accountability Dashboard (Overall 180-Day %, Current Streak, Longest Streak) */}
            <AccountabilityDashboard
              data={data}
              onViewCalendar={() => setActiveTab('calendar')}
            />

            {/* 180-Day Challenge Progress & Date Picker */}
            <ChallengeProgress

              dayNumber={dayNumber}
              totalDays={data.targetDays}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              currentLog={currentLog}
              todayDate={todayDate}
              data={data}
            />


            {/* Quick Review Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab('morning')}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left ${
                  currentLog.morningReviewCompleted
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                    : 'bg-stone-900/90 hover:bg-stone-900 border-amber-600/40 text-stone-100 hover:border-amber-500 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-amber-500 font-semibold block">
                      Step 1
                    </span>
                    <span className="font-display text-base font-bold">
                      Morning Sacred Review
                    </span>
                    <span className="text-[11px] text-stone-400 block">
                      {currentLog.morningReviewCompleted ? 'Completed ✓' : 'Pending review today'}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={() => setActiveTab('evening')}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left ${
                  currentLog.eveningReviewCompleted
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                    : 'bg-stone-900/90 hover:bg-stone-900 border-indigo-700/50 text-stone-100 hover:border-indigo-500 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-indigo-400 font-semibold block">
                      Step 2
                    </span>
                    <span className="font-display text-base font-bold">
                      Evening Sacred Audit
                    </span>
                    <span className="text-[11px] text-stone-400 block">
                      {currentLog.eveningReviewCompleted ? 'Completed ✓' : 'Includes tomorrow’s Brahmamuhurta timing'}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Core Sadhana Tools: Naam Jap Mala Tracker & 48m Siddhasana Dhyana */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JapCounter
                count={currentLog.japCount}
                malasCount={currentLog.malasCount}
                onUpdateCount={(totalChants, malas) =>
                  handleUpdateLog({ japCount: totalChants, malasCount: malas })
                }
              />

              <DhyanaTimer
                loggedMinutes={currentLog.dhyanaMinutes}
                completed={currentLog.dhyanaCompleted}
                onUpdateDhyana={(mins, completed) =>
                  handleUpdateLog({ dhyanaMinutes: mins, dhyanaCompleted: completed })
                }
              />
            </div>

            {/* Brahmamuhurta Astronomical Card & Exercise Session Logger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BrahmamuhurtaCard
                location={solarLocation}
                onUpdateLocation={handleUpdateLocation}
                wokeUpInBrahmamuhurta={currentLog.brahmamuhurtaWakeUp}
                onToggleWokeUp={(val) => handleUpdateLog({ brahmamuhurtaWakeUp: val })}
              />

              <ExerciseLogger
                exercise={currentLog.exercise}
                onUpdateExercise={(entry) => handleUpdateLog({ exercise: entry })}
              />
            </div>

            {/* Diet & Cold Bath */}
            <DietSection
              diet={currentLog.dietChecks}
              onToggleDiet={(key) =>
                handleUpdateLog({
                  dietChecks: {
                    ...currentLog.dietChecks,
                    [key]: !currentLog.dietChecks[key],
                  },
                })
              }
              bathWithoutHotWater={currentLog.bathWithoutHotWater}
              coldWaterBath={currentLog.coldWaterBath}
              onToggleBath={(val) => handleUpdateLog({ bathWithoutHotWater: val, coldWaterBath: val })}
            />



            {/* Indriyavijay Mastery */}
            <IndriyaSection
              checks={currentLog.indriyavijayChecks}
              onToggleCheck={(key) =>
                handleUpdateLog({
                  indriyavijayChecks: {
                    ...currentLog.indriyavijayChecks,
                    [key]: !currentLog.indriyavijayChecks[key],
                  },
                })
              }
            />

            {/* Root Cause Trap Radar (Direct answer to 'Why I Have Not Progressed') */}
            <TrapRadar
              audit={currentLog.trapAudit}
              onUpdateAudit={(audit) => handleUpdateLog({ trapAudit: audit })}
              onOpenUrgeInterceptor={() => setIsUrgeOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Emergency Urge & Distraction Breaker Modal */}
      <UrgeInterceptorModal
        isOpen={isUrgeOpen}
        onClose={() => setIsUrgeOpen(false)}
        onIncrementJap={(amount) => handleUpdateLog({ japCount: (currentLog.japCount || 0) + amount })}
      />

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 px-4 text-center text-xs text-stone-400 space-y-1">
        <p className="font-serif-prose italic">
          "We are Bhagwan ke Ansh. Karma &gt; Phala. Restrain planning; live in execution."
        </p>
        <p className="text-[11px] text-stone-400">
          Brahmacharya 6-Month Mahavrat · Inspired by Pujya Shri Hit Premanand Govind Sharan Ji Maharaj (Vrindavan, Bhajan Marg)
        </p>
      </footer>
    </div>
  );
}
