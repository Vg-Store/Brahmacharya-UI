import { ChallengeData, DailyLog, StreakInfo, NiyamAdherence, FailurePattern } from '../types';

const STORAGE_KEY = 'brahmacharya_challenge_v2';

export const DEFAULT_SANKALP = 
`I firmly resolve to undertake this 6-Month Brahmacharya Sadhana.
I recognize that I am Bhagwan ke Ansh.
My focus is Karma > Phala — detached from outcomes, anchoring in pure Execution.
I establish Indriyavijay over my Eyes, Speech, Ears, and Touch.
I rise in Brahmamuhurta, bathe without hot water, chant 'Aum Gam Ganapataye Namaha', and meditate in Siddhasana for 48 minutes.
I follow Sattvic diet: no non-veg, no junk food, no water before/during/after meals, no excessively hot or spicy food.
I strictly break the trap of: Planning → Information → Distraction → Overthinking → Living in the mind.
I live with pure Dincharya, noble Character, and decisive Execution, keeping my Mann Prasanna.`;

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createEmptyDailyLog(date: string): DailyLog {
  return {
    date,
    morningReviewCompleted: false,
    eveningReviewCompleted: false,
    brahmamuhurtaWakeUp: false,
    brahmamuhurtaTimeNoted: '',
    bathWithoutHotWater: false,
    coldWaterBath: false,
    morningVisualisationDone: false,
    eveningVisualisationDone: false,
    dhyanaMinutes: 0,
    dhyanaCompleted: false,
    japCount: 0,
    malasCount: 0,
    dietChecks: {
      noNonVeg: false,
      noJunkFood: false,
      noWaterDuringMeals: false,
      noExcessSpicyHot: false,
    },
    indriyavijayChecks: {
      netraNoBadContent: false,
      netraNoLustfulImagination: false,
      netraNoLustfulGaze: false,
      vaaniPureSpeech: false,
      kaanPureListening: false,
      sparshPureTouch: false,
    },
    exercise: {
      completed: false,
      activity: '',
      durationMinutes: 0,
      intensity: 'moderate',
      notes: '',
    },
    trapAudit: {
      fellIntoPlanningTrap: false,
      consumedDistractionMedia: false,
      mediaDetails: [],
      overthinkingLivingInMind: false,
      actionExecutionDone: false,
      reflectionNote: '',
    },
    missedDayReason: '',
    eveningReviewNotes: '',
  };
}


export function getInitialChallengeData(): ChallengeData {
  const today = getTodayDateString();
  const initialLog = createEmptyDailyLog(today);
  const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kolkata';

  return {
    startDate: today,
    targetDays: 180,
    sankalpText: DEFAULT_SANKALP,
    sunriseTime: '05:45',
    solarLocation: {
      name: 'Unconfirmed Location (Setup Required)',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: tz,
      isConfirmedAndLocked: false,
    },
    dailyLogs: {
      [today]: initialLog,
    },
    customAffirmations: [
      'I am Bhagwan ke Ansh; no cheap sensory urge has dominion over me.',
      'Karma > Phala: I execute without anxiety for the outcome.',
      'Siddhasana meditation purifies the dormant Ojas within.',
      'Naam Jap is my supreme armor against lower desires.',
      'Action over Planning: I do the physical work right now.',
    ],
  };
}

export function loadChallengeData(): ChallengeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialChallengeData();
    const parsed = JSON.parse(raw);
    if (!parsed.dailyLogs) {
      return getInitialChallengeData();
    }
    const today = getTodayDateString();
    if (!parsed.dailyLogs[today]) {
      parsed.dailyLogs[today] = createEmptyDailyLog(today);
    }
    return parsed;
  } catch {
    return getInitialChallengeData();
  }
}

export function saveChallengeData(data: ChallengeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Authoritative Core Practices Adherence Calculation
 * Evaluates strictly across the 7 Core Foundational Practices:
 * 1. Brahmamuhurta Wakeup
 * 2. Bath Without Hot Water
 * 3. Sattvic Diet (all 4 diagnostic sub-rules adhered)
 * 4. Indriyavijay (all 6 sense gates adhered, strictly including lustful imagination)
 * 5. Siddhasana Dhyana (>= 48 minutes)
 * 6. Naam Jap (>= 1 Mala / 108 counts)
 * 7. Physical Exercise Session
 */
export function calculateCorePracticesScore(log: DailyLog | undefined): { adheredCount: number; totalCount: number; percent: number } {
  if (!log) return { adheredCount: 0, totalCount: 7, percent: 0 };
  let score = 0;
  const totalCount = 7;

  // 1. Brahmamuhurta Wakeup
  if (log.brahmamuhurtaWakeUp) score += 1;

  // 2. Bath Without Hot Water (with legacy coldWaterBath support)
  if (log.bathWithoutHotWater || log.coldWaterBath) score += 1;

  // 3. Sattvic Diet (all 4 diagnostic sub-rules)
  const diet = log.dietChecks;
  if (diet.noNonVeg && diet.noJunkFood && diet.noWaterDuringMeals && diet.noExcessSpicyHot) {
    score += 1;
  }

  // 4. Indriyavijay (all 6 sense gates, strictly including lustful imagination)
  const ind = log.indriyavijayChecks;
  if (
    ind.netraNoBadContent &&
    ind.netraNoLustfulGaze &&
    ind.netraNoLustfulImagination &&
    ind.vaaniPureSpeech &&
    ind.kaanPureListening &&
    ind.sparshPureTouch
  ) {
    score += 1;
  }

  // 5. Siddhasana Dhyana (>= 48 min)
  if (log.dhyanaMinutes >= 48 || log.dhyanaCompleted) score += 1;

  // 6. Naam Jap (>= 1 Mala / 108 counts)
  if ((log.malasCount && log.malasCount >= 1) || log.japCount >= 108) score += 1;

  // 7. Physical Exercise Session
  if (log.exercise.completed) score += 1;

  const percent = Math.min(100, Math.round((score / totalCount) * 100));
  return { adheredCount: score, totalCount, percent };
}

export function calculateDailyCompletionPercent(log: DailyLog | undefined): number {
  return calculateCorePracticesScore(log).percent;
}

export const calculateSadhanaScore = calculateDailyCompletionPercent;

/**
 * Transparent Day Status Definition:
 * - Complete: Core Practices >= 70% (>= 5 out of 7 adhered) + Both Morning & Evening Reviews Sealed
 * - Partial: At least 1 core practice adhered or at least 1 review sealed
 * - Missed: 0 practices and no review sealed
 */
export function getDayStatus(log: DailyLog | undefined): 'complete' | 'partial' | 'missed' {
  if (!log) return 'missed';
  const { adheredCount } = calculateCorePracticesScore(log);
  // 5 out of 7 is 71.4%, satisfying the >= 70% of core practices standard
  if (adheredCount >= 5 && log.morningReviewCompleted && log.eveningReviewCompleted) {
    return 'complete';
  }
  if (adheredCount >= 1 || log.morningReviewCompleted || log.eveningReviewCompleted) {
    return 'partial';
  }
  return 'missed';
}


export function calculateCurrentDayNumber(startDateStr: string, todayStr: string): number {
  const start = new Date(startDateStr);
  const current = new Date(todayStr);
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export function calculateStreaks(data: ChallengeData): StreakInfo {
  const totalDays = data.targetDays || 180;
  const todayStr = getTodayDateString();
  const start = new Date(data.startDate);
  const today = new Date(todayStr);

  const diffTime = today.getTime() - start.getTime();
  const totalDaysElapsed = Math.min(totalDays, Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));

  let totalCompletedDays = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < totalDaysElapsed; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const log = data.dailyLogs[dateStr];
    const status = getDayStatus(log);

    if (status === 'complete') {
      totalCompletedDays++;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak backwards from today or yesterday
  let currentStreak = 0;
  const todayLog = data.dailyLogs[todayStr];
  const todayStatus = getDayStatus(todayLog);

  let checkDate = new Date(today);
  if (todayStatus !== 'complete') {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const checkDateStr = checkDate.toISOString().split('T')[0];
    if (checkDateStr < data.startDate) break;

    const log = data.dailyLogs[checkDateStr];
    if (getDayStatus(log) === 'complete') {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const overallCompletionRate = Math.min(100, Math.round((totalCompletedDays / totalDays) * 100));

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays,
    totalDaysElapsed,
    overallCompletionRate,
  };
}

export interface DayPerformance {
  date: string;
  dayLabel: string;
  malas: number;
  dhyanaMinutes: number;
  status: 'complete' | 'partial' | 'missed';
}

export function getWeeklyPerformance(data: ChallengeData): DayPerformance[] {
  const result: DayPerformance[] = [];
  const today = new Date(getTodayDateString());
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = data.dailyLogs[dateStr];
    const malas = log?.malasCount || (log?.japCount ? Math.floor(log.japCount / 108) : 0);
    const dhyanaMinutes = log?.dhyanaMinutes || 0;
    const status = getDayStatus(log);
    const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

    result.push({
      date: dateStr,
      dayLabel,
      malas,
      dhyanaMinutes,
      status,
    });
  }

  return result;
}

/**
 * Calculates consistency % for each individual Niyam for the current month (or past 30 days)
 * Identifies which specific Niyam is repeatedly being missed with sub-rule diagnostics.
 */
export function calculateNiyamConsistency(
  data: ChallengeData,
  daysCount = 30
): NiyamAdherence[] {
  const today = new Date(getTodayDateString());
  const dates: string[] = [];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  let brahmamuhurta = 0;
  let bathWithoutHotWater = 0;
  let dhyana = 0;
  let naamJap = 0;
  let netraBad = 0;
  let netraGaze = 0;
  let netraImagination = 0;
  let vaani = 0;
  let kaan = 0;
  let touch = 0;
  let dietNoWater = 0;
  let dietNoSpicy = 0;
  let dietNoJunk = 0;
  let dietNoNonVeg = 0;
  let exercise = 0;
  let morningRev = 0;
  let eveningRev = 0;

  dates.forEach((dateStr) => {
    const log = data.dailyLogs[dateStr];
    if (!log) return;
    if (log.brahmamuhurtaWakeUp) brahmamuhurta++;
    if (log.bathWithoutHotWater || log.coldWaterBath) bathWithoutHotWater++;
    if (log.dhyanaMinutes >= 48 || log.dhyanaCompleted) dhyana++;
    if ((log.malasCount && log.malasCount >= 1) || log.japCount >= 108) naamJap++;
    if (log.indriyavijayChecks.netraNoBadContent) netraBad++;
    if (log.indriyavijayChecks.netraNoLustfulGaze) netraGaze++;
    if (log.indriyavijayChecks.netraNoLustfulImagination) netraImagination++;
    if (log.indriyavijayChecks.vaaniPureSpeech) vaani++;
    if (log.indriyavijayChecks.kaanPureListening) kaan++;
    if (log.indriyavijayChecks.sparshPureTouch) touch++;
    if (log.dietChecks.noWaterDuringMeals) dietNoWater++;
    if (log.dietChecks.noExcessSpicyHot) dietNoSpicy++;
    if (log.dietChecks.noJunkFood) dietNoJunk++;
    if (log.dietChecks.noNonVeg) dietNoNonVeg++;
    if (log.exercise.completed) exercise++;
    if (log.morningReviewCompleted) morningRev++;
    if (log.eveningReviewCompleted) eveningRev++;
  });

  const toAdherence = (
    key: string,
    label: string,
    category: 'Spiritual' | 'Physical' | 'Indriyavijay',
    count: number
  ): NiyamAdherence => ({
    key,
    label,
    category,
    completedDays: count,
    totalDays: daysCount,
    percent: Math.round((count / daysCount) * 100),
  });

  return [
    toAdherence('brahmamuhurta', 'Brahmamuhurta Awakening', 'Spiritual', brahmamuhurta),
    toAdherence('dhyana', 'Dhyana in Siddhasana (≥ 48m)', 'Spiritual', dhyana),
    toAdherence('naamJap', 'Naam Jap (Aum Gam Ganapataye)', 'Spiritual', naamJap),
    toAdherence('bathWithoutHot', 'Bath Without Hot Water', 'Physical', bathWithoutHotWater),
    toAdherence('dietNoWater', 'Diet: No water before/during/after meals', 'Physical', dietNoWater),
    toAdherence('dietNoSpicy', 'Diet: No excessively hot/spicy food', 'Physical', dietNoSpicy),
    toAdherence('dietNoJunk', 'Diet: No junk food', 'Physical', dietNoJunk),
    toAdherence('dietNoNonVeg', 'Diet: Strictly no non-vegetarian food', 'Physical', dietNoNonVeg),
    toAdherence('exercise', 'Physical Exercise Session', 'Physical', exercise),
    toAdherence('netraBad', 'Netra: No inappropriate content', 'Indriyavijay', netraBad),
    toAdherence('netraGaze', 'Netra: No lustful gaze or projection', 'Indriyavijay', netraGaze),
    toAdherence('netraImagination', 'Netra: No lustful mental fantasy', 'Indriyavijay', netraImagination),
    toAdherence('vaani', 'Vaani: Pure speech, no vulgarity', 'Indriyavijay', vaani),
    toAdherence('kaan', 'Kaan: Pure listening, no vulgar topics', 'Indriyavijay', kaan),
    toAdherence('touch', 'Touch: Physical sanctity & restraint', 'Indriyavijay', touch),
    toAdherence('morningRev', 'Morning Review Sealed', 'Spiritual', morningRev),
    toAdherence('eveningRev', 'Evening Review Sealed', 'Spiritual', eveningRev),
  ];

}

export function calculateFailurePatterns(data: ChallengeData): FailurePattern[] {
  const today = new Date(getTodayDateString());
  const dates30: string[] = [];

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates30.push(d.toISOString().split('T')[0]);
  }

  const traps = [
    { trap: 'planning', label: 'Endless Planning Loop' },
    { trap: 'youtube', label: 'YouTube / Consuming Info' },
    { trap: 'media', label: 'Distraction Media (Dramas/Anime/XXX)' },
    { trap: 'overthinking', label: 'Overthinking & Worry' },
    { trap: 'livingInMind', label: 'Living in the Mind' },
    { trap: 'neglectedExecution', label: 'Neglected Execution' },
  ];

  const allDates = Object.keys(data.dailyLogs);

  return traps.map((t) => {
    let count30 = 0;
    let countTotal = 0;

    dates30.forEach((d) => {
      const log = data.dailyLogs[d];
      if (!log) return;
      if (t.trap === 'planning' && log.trapAudit.fellIntoPlanningTrap) count30++;
      if (t.trap === 'youtube' && log.trapAudit.consumedDistractionMedia && log.trapAudit.mediaDetails.includes('youtube')) count30++;
      if (t.trap === 'media' && log.trapAudit.consumedDistractionMedia) count30++;
      if (t.trap === 'overthinking' && log.trapAudit.overthinkingLivingInMind) count30++;
      if (t.trap === 'livingInMind' && log.trapAudit.overthinkingLivingInMind) count30++;
      if (t.trap === 'neglectedExecution' && !log.trapAudit.actionExecutionDone && (log.morningReviewCompleted || log.eveningReviewCompleted)) count30++;
    });

    allDates.forEach((d) => {
      const log = data.dailyLogs[d];
      if (!log) return;
      if (t.trap === 'planning' && log.trapAudit.fellIntoPlanningTrap) countTotal++;
      if (t.trap === 'youtube' && log.trapAudit.consumedDistractionMedia && log.trapAudit.mediaDetails.includes('youtube')) countTotal++;
      if (t.trap === 'media' && log.trapAudit.consumedDistractionMedia) countTotal++;
      if (t.trap === 'overthinking' && log.trapAudit.overthinkingLivingInMind) countTotal++;
      if (t.trap === 'livingInMind' && log.trapAudit.overthinkingLivingInMind) countTotal++;
      if (t.trap === 'neglectedExecution' && !log.trapAudit.actionExecutionDone && (log.morningReviewCompleted || log.eveningReviewCompleted)) countTotal++;
    });

    return {
      trap: t.trap,
      label: t.label,
      count30Days: count30,
      countTotal: countTotal,
    };
  });
}
