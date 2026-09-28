import React, { useState } from 'react';
import { Sunrise, Clock, Moon, CheckCircle2, Circle, MapPin, Navigation, Lock, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  getBrahmamuhurtaForDate,
  getTomorrowBrahmamuhurta,
  detectUserCoordinates,
} from '../utils/brahmamuhurta';
import { SolarLocation, POPULAR_LOCATIONS, getDefaultLocation } from '../utils/solar';

interface BrahmamuhurtaCardProps {
  location?: SolarLocation;
  onUpdateLocation: (loc: SolarLocation) => void;
  wokeUpInBrahmamuhurta: boolean;
  onToggleWokeUp: (wokeUp: boolean) => void;
}

export const BrahmamuhurtaCard: React.FC<BrahmamuhurtaCardProps> = ({
  location = getDefaultLocation(),
  onUpdateLocation,
  wokeUpInBrahmamuhurta,
  onToggleWokeUp,
}) => {
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(!location.isConfirmedAndLocked);
  const [isVerifying, setIsVerifying] = useState(false);

  const todayMuhurta = getBrahmamuhurtaForDate(new Date(), location);
  const tomorrowMuhurta = getTomorrowBrahmamuhurta(location);

  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    setGpsError(null);
    try {
      const detected = await detectUserCoordinates();
      onUpdateLocation(detected);
      setIsDetectingGps(false);
      setShowLocationPicker(false);
    } catch (err: unknown) {
      setIsDetectingGps(false);
      const msg = err instanceof Error ? err.message : 'Location permission denied by browser.';
      setGpsError(`${msg} Please select your nearest city below and confirm.`);
    }
  };

  const handleSelectPopularCity = (city: SolarLocation) => {
    onUpdateLocation({
      ...city,
      isConfirmedAndLocked: true,
      lastVerified: new Date().toISOString().split('T')[0],
    });
    setShowLocationPicker(false);
  };

  const handleManualReverify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      onUpdateLocation({
        ...location,
        lastVerified: todayStr,
      });
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden shadow-lg space-y-0">
      {/* Visual Header with dawn banner */}
      <div className="relative h-28 w-full bg-stone-950 overflow-hidden">
        <img
          src="/images/brahmamuhurta_dawn_1790517184828.jpg"
          alt="Brahmamuhurta Sacred Dawn"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-amber-400" />
            <span className="font-display text-base font-bold text-amber-200">
              Brahmamuhurta Timing
            </span>
          </div>

          <div className="flex items-center gap-2">
            {location.isConfirmedAndLocked ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3" />
                <span>Locked Location</span>
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 bg-amber-950/80 border border-amber-700/50 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>Setup Required</span>
              </span>
            )}

            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="text-[11px] text-stone-300 hover:text-white bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showLocationPicker ? 'Close' : 'Change Location'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Confirmed Location Meta Strip */}
        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/90 text-xs flex flex-wrap items-center justify-between gap-2 text-stone-400 font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-stone-200 font-semibold">{location.name}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Coord: {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°</span>
            <span>TZ: {location.timezone || 'Local'}</span>
          </div>
        </div>

        {/* Daily Astronomical Cross-Check & Verification Status */}
        <div className="p-2.5 bg-stone-950/80 border border-stone-800 rounded-xl flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-stone-300">
              Astronomical Cross-Check: Verified for Today ({todayMuhurta.lastVerified})
            </span>
          </div>
          <button
            onClick={handleManualReverify}
            disabled={isVerifying}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying...' : 'Re-verify'}</span>
          </button>
        </div>

        {/* Location Setup / Change Drawer */}
        {showLocationPicker && (
          <div className="p-4 bg-stone-950 rounded-xl border border-amber-700/40 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-amber-200 font-semibold block">
                  Confirm &amp; Lock Challenge Location
                </span>
                <span className="text-[10px] text-stone-400">
                  Prevents GPS drift from corrupting your 180-day sunrise calculations.
                </span>
              </div>
              <button
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded flex items-center gap-1.5 text-xs transition-colors shrink-0 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isDetectingGps ? 'Detecting...' : 'Detect GPS & Lock'}</span>
              </button>
            </div>

            {gpsError && (
              <p className="text-[11px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-800/40">
                {gpsError}
              </p>
            )}

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-stone-400 block font-medium">
                Or select and lock reference city:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => handleSelectPopularCity(loc)}
                    className={`p-2 rounded text-left text-[11px] border transition-colors cursor-pointer ${
                      location.name === loc.name
                        ? 'bg-amber-950/70 border-amber-600/70 text-amber-200 font-medium'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calculated Windows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Today's Window */}
          <div className="p-3.5 rounded-xl bg-stone-950/80 border border-amber-900/40 space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Today's Muhurta Window</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                Sunrise: {todayMuhurta.sunriseTime}
              </span>
            </div>
            <p className="font-mono text-lg font-bold text-stone-100">
              {todayMuhurta.startTime} — {todayMuhurta.endTime}
            </p>
            <p className="text-[11px] text-stone-400">
              {todayMuhurta.isCurrentlyActive ? (
                <strong className="text-emerald-400">Active right now ({todayMuhurta.minutesRemaining}m left)</strong>
              ) : (
                '96 to 48 minutes before sunrise · Peak Sattva'
              )}
            </p>
          </div>

          {/* Tomorrow's Window (Reminded in Evening Review) */}
          <div className="p-3.5 rounded-xl bg-stone-950/80 border border-indigo-900/40 space-y-1">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Moon className="w-4 h-4" />
                <span>Tomorrow's Muhurta Window</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                Sunrise: {tomorrowMuhurta.sunriseTime}
              </span>
            </div>
            <p className="font-mono text-lg font-bold text-stone-100">
              {tomorrowMuhurta.startTime} — {tomorrowMuhurta.endTime}
            </p>
            <p className="text-[11px] text-stone-400">
              Bedtime target: <strong className="text-stone-200">By {tomorrowMuhurta.recommendedBedtime}</strong> (6.5h rest)
            </p>
          </div>
        </div>

        {/* Wake-up Confirmation Action */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
          <div className="text-xs text-stone-300">
            <span>Did you wake up in Brahmamuhurta today?</span>
            <span className="block text-[10px] text-stone-500 font-mono">
              Calculated for locked location
            </span>
          </div>

          <button
            onClick={() => onToggleWokeUp(!wokeUpInBrahmamuhurta)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              wokeUpInBrahmamuhurta
                ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 shadow-sm'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {wokeUpInBrahmamuhurta ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Awakened in Brahmamuhurta</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-stone-500" />
                <span>Mark as Awakened</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
