export type Intensity = 'light' | 'moderate' | 'high';
export type MannPrasanna = 'uplifted' | 'calm' | 'peaceful' | 'restless' | 'struggling';

export interface ExerciseEntry {
  completed: boolean;
  activity: string;
  durationMinutes: number;
  intensity: Intensity;
  notes: string;
}

/**
 * Diagnostic Diet Sub-Rules
 * Tracks exactly which rule broke when diet adherence slips.
 */
export interface DietChecks {
  noNonVeg: boolean;           // ❌ Non-vegetarian food
  noJunkFood: boolean;         // ❌ Junk / artificial processed food
  noWaterDuringMeals: boolean; // ❌ Water before, during, or after eating
  noExcessSpicyHot: boolean;   // ❌ Excessively hot or spicy food
}

/**
 * Diagnostic Indriyavijay Sub-Gates
 * Tracks exactly which sense gate experienced temptation or failure.
 */
export interface IndriyavijayChecks {
  // Netra / Eyes
  netraNoBadContent: boolean;        // Not viewing inappropriate/lustful content
  netraNoLustfulImagination: boolean;// Not intentionally indulging lustful mental images
  netraNoLustfulGaze: boolean;       // Not projecting lust onto people in daily life
  // Vaani / Voice
  vaaniPureSpeech: boolean;          // Pure, dignified speech without vulgarity or gossiping
  // Kaan / Ears
  kaanPureListening: boolean;        // Not indulging in vulgar discussions or gossip
  // Sparsh / Touch
  sparshPureTouch: boolean;          // Physical sanctity, modesty, and strict boundary restraint
}

export interface TrapAudit {
  fellIntoPlanningTrap: boolean;         // Planning instead of executing
  consumedDistractionMedia: boolean;     // YouTube, K-drama, C-drama, K-pop, Anime, Manhua, XXX
  mediaDetails: string[];
  overthinkingLivingInMind: boolean;     // Living in mind, overthinking
  actionExecutionDone: boolean;          // Focus on Dincharya, character, personality & execution
  reflectionNote: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  morningReviewCompleted: boolean;
  eveningReviewCompleted: boolean;
  brahmamuhurtaWakeUp: boolean;
  brahmamuhurtaTimeNoted: string;
  bathWithoutHotWater: boolean; // Bath without hot water
  coldWaterBath?: boolean;      // Legacy alias for backward compatibility
  morningVisualisationDone: boolean;
  eveningVisualisationDone: boolean;
  dhyanaMinutes: number; // goal >= 48 min

  dhyanaCompleted: boolean;
  japCount: number; // total repetitions of Aum Gam Ganapataye Namaha
  malasCount?: number; // total complete Malas (1 Mala = 108 repetitions)
  dietChecks: DietChecks;
  indriyavijayChecks: IndriyavijayChecks;
  exercise: ExerciseEntry;
  trapAudit: TrapAudit;
  mannPrasannaState?: MannPrasanna;
  missedDayReason?: string; // Short reflection: Why did I fail/slip today?
  eveningReviewNotes: string;
}

export interface SolarLocationConfig {
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isConfirmedAndLocked: boolean; // Confirmed by user; locked to prevent drift
  lastVerified?: string;
}

export interface ChallengeData {
  startDate: string; // YYYY-MM-DD
  targetDays: number; // 180
  sankalpText: string;
  sunriseTime: string; // fallback string e.g. "05:45"
  solarLocation?: SolarLocationConfig;
  dailyLogs: Record<string, DailyLog>;
  customAffirmations: string[];
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
  totalDaysElapsed: number;
  overallCompletionRate: number;
}

export interface NiyamAdherence {
  key: string;
  label: string;
  category: 'Spiritual' | 'Physical' | 'Indriyavijay';
  completedDays: number;
  totalDays: number;
  percent: number;
  subRuleFailures?: string[];
}

export interface FailurePattern {
  trap: string;
  label: string;
  count30Days: number;
  countTotal: number;
}
