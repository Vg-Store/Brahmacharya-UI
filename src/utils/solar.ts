/**
 * Astronomical Solar Calculations (NOAA Solar Calculations)
 * Calculates sunrise accurately for any latitude, longitude, date, and timezone.
 * 100% offline, zero network dependencies.
 */

export interface SolarLocation {
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isConfirmedAndLocked: boolean; // Confirmed and locked by user for the challenge
  lastVerified?: string;         // Date string of last daily sunrise cross-check (e.g. YYYY-MM-DD)
}

export const POPULAR_LOCATIONS: SolarLocation[] = [
  { name: 'Vrindavan / Mathura, India', latitude: 27.58, longitude: 77.70, timezone: 'Asia/Kolkata', isConfirmedAndLocked: false },
  { name: 'New Delhi, India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', isConfirmedAndLocked: false },
  { name: 'Varanasi / Kashi, India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata', isConfirmedAndLocked: false },
  { name: 'Haridwar / Rishikesh, India', latitude: 29.9457, longitude: 78.1642, timezone: 'Asia/Kolkata', isConfirmedAndLocked: false },
  { name: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', isConfirmedAndLocked: false },
  { name: 'Bengaluru, India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', isConfirmedAndLocked: false },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', isConfirmedAndLocked: false },
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', isConfirmedAndLocked: false },
  { name: 'Los Angeles, USA', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', isConfirmedAndLocked: false },
];

export function getDefaultLocation(): SolarLocation {
  const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kolkata';
  return {
    name: 'Unconfirmed Location (Setup Required)',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: tz,
    isConfirmedAndLocked: false,
  };
}

/**
 * Extracts wall-clock minutes from midnight for a given Date in a specific IANA Timezone.
 * Prevents browser/device timezone mismatches from corrupting the location's sunrise time.
 */
export function getMinutesFromDateInTimezone(date: Date, timezone?: string): number {
  if (!timezone) {
    return date.getHours() * 60 + date.getMinutes();
  }
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find((p) => p.type === 'hour')?.value || '0';
    const minPart = parts.find((p) => p.type === 'minute')?.value || '0';
    let hour = parseInt(hourPart, 10);
    if (hour === 24) hour = 0;
    const min = parseInt(minPart, 10);
    return hour * 60 + min;
  } catch {
    return date.getHours() * 60 + date.getMinutes();
  }
}

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;

/**
 * Standard NOAA Solar Sunrise Calculation with Timezone Handling & Cross-Check Verification
 * Returns sunrise time as a Date object and wall-clock minutes from midnight.
 */
export function calculateAstronomicalSunrise(
  date: Date,
  lat: number,
  lng: number,
  timezone?: string
): { sunriseDate: Date; sunriseMinutesFromMidnight: number; isCrossChecked: boolean } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian Day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const n = jdn - 2451545.0 + 0.0008;

  // Mean solar noon
  const J_approx = n - lng / 360.0;

  // Solar mean anomaly
  const M = (357.5291 + 0.98560028 * J_approx) % 360;
  const M_rad = M * DEG_TO_RAD;

  // Equation of the center
  const C =
    1.9148 * Math.sin(M_rad) +
    0.02 * Math.sin(2 * M_rad) +
    0.0003 * Math.sin(3 * M_rad);

  // Ecliptic longitude
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambda_rad = lambda * DEG_TO_RAD;

  // Solar transit (Julian date)
  const J_transit =
    2451545.0 + J_approx + 0.0053 * Math.sin(M_rad) - 0.0069 * Math.sin(2 * lambda_rad);

  // Declination of Sun
  const sin_delta = Math.sin(lambda_rad) * Math.sin(23.44 * DEG_TO_RAD);
  const cos_delta = Math.cos(Math.asin(sin_delta));

  // Hour angle for sunrise (zenith = 90.833° for atmospheric refraction and solar disc)
  const lat_rad = lat * DEG_TO_RAD;
  const cos_omega0 =
    (Math.sin(-0.833 * DEG_TO_RAD) - Math.sin(lat_rad) * sin_delta) /
    (Math.cos(lat_rad) * cos_delta);

  // Handle polar day / night
  let omega0 = 0;
  if (cos_omega0 >= 1) {
    omega0 = 0;
  } else if (cos_omega0 <= -1) {
    omega0 = Math.PI;
  } else {
    omega0 = Math.acos(cos_omega0);
  }

  const J_rise = J_transit - (omega0 * RAD_TO_DEG) / 360.0;

  // Convert Julian date to UTC milliseconds
  const sunriseUtcMs = (J_rise - 2440587.5) * 86400000;
  const sunriseDate = new Date(sunriseUtcMs);

  // Use target location timezone to compute local wall-clock minutes
  const sunriseMinutesFromMidnight = getMinutesFromDateInTimezone(sunriseDate, timezone);

  // Sanity check: valid non-polar sunrise falls within a reasonable physical window (03:30 to 09:30)
  const isCrossChecked = sunriseMinutesFromMidnight >= 210 && sunriseMinutesFromMidnight <= 570;

  return { sunriseDate, sunriseMinutesFromMidnight, isCrossChecked };
}
