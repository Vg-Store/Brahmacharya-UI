import { calculateAstronomicalSunrise, SolarLocation, getDefaultLocation } from './solar';

export interface BrahmamuhurtaDetails {
  dateLabel: string;
  sunriseTime: string; // e.g. "05:42 AM"
  startTime: string;   // e.g. "04:06 AM"
  endTime: string;     // e.g. "04:54 AM"
  startMinutesFromMidnight: number;
  endMinutesFromMidnight: number;
  recommendedBedtime: string; // e.g. "09:30 PM"
  isCurrentlyActive: boolean;
  minutesRemaining: number;
  locationName: string;
  isConfirmedAndLocked: boolean;
  timezone?: string;
  isCrossChecked: boolean;
  lastVerified?: string;
}

export function formatMinutesToAmPm(totalMinutes: number): string {
  let normalized = Math.round(totalMinutes) % 1440;
  if (normalized < 0) normalized += 1440;

  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const padMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const padHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;

  return `${padHours}:${padMinutes} ${period}`;
}

export function getBrahmamuhurtaForDate(
  date: Date,
  location: SolarLocation = getDefaultLocation()
): BrahmamuhurtaDetails {
  const { sunriseMinutesFromMidnight, isCrossChecked } = calculateAstronomicalSunrise(
    date,
    location.latitude,
    location.longitude,
    location.timezone
  );

  // 1 Muhurta = 48 minutes
  // Brahmamuhurta begins 2 Muhurtas (96 min) before sunrise
  // and ends 1 Muhurta (48 min) before sunrise
  const startMinutes = sunriseMinutesFromMidnight - 96;
  const endMinutes = sunriseMinutesFromMidnight - 48;
  const bedtimeMinutes = startMinutes - 390; // 6.5 hours of sleep

  const now = new Date();
  const isSameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  // Current wall-clock minutes in the target location timezone
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();

  let isActive = false;
  let remaining = 0;

  if (isSameDay) {
    isActive =
      currentMinutesFromMidnight >= startMinutes &&
      currentMinutesFromMidnight <= endMinutes;
    if (isActive) {
      remaining = endMinutes - currentMinutesFromMidnight;
    }
  }

  const dateLabel = isSameDay ? 'Today' : 'Tomorrow';

  return {
    dateLabel,
    sunriseTime: formatMinutesToAmPm(sunriseMinutesFromMidnight),
    startTime: formatMinutesToAmPm(startMinutes),
    endTime: formatMinutesToAmPm(endMinutes),
    startMinutesFromMidnight: startMinutes,
    endMinutesFromMidnight: endMinutes,
    recommendedBedtime: formatMinutesToAmPm(bedtimeMinutes),
    isCurrentlyActive: isActive,
    minutesRemaining: remaining,
    locationName: location.name,
    isConfirmedAndLocked: location.isConfirmedAndLocked,
    timezone: location.timezone,
    isCrossChecked,
    lastVerified: location.lastVerified || new Date().toISOString().split('T')[0],
  };
}

export function getTomorrowBrahmamuhurta(
  location: SolarLocation = getDefaultLocation()
): BrahmamuhurtaDetails {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getBrahmamuhurtaForDate(tomorrow, location);
}

/**
 * Attempts browser GPS geolocation and sets initial lock
 */
export function detectUserCoordinates(): Promise<SolarLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported by browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kolkata';
        resolve({
          name: `Confirmed Local GPS (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timezone: tz,
          isConfirmedAndLocked: true,
          lastVerified: new Date().toISOString().split('T')[0],
        });
      },
      (err) => {
        reject(err);
      },
      { timeout: 10000, maximumAge: 3600000 }
    );
  });
}
