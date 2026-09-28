/**
 * Pure Web Audio API Sound Synthesizer
 * 100% offline, zero external audio asset dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Sacred Tibetan Singing Bowl / Temple Gong Sound
 */
export function playTempleGong(baseFreq = 432, duration = 3.5): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const harmonics = [1, 2.02, 3.01, 4.2];
    const gains = [0.35, 0.15, 0.08, 0.04];

    harmonics.forEach((harmonic, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * harmonic, now);

      // Gentle pitch drift for organic metal resonance
      osc.frequency.exponentialRampToValueAtTime(baseFreq * harmonic * 0.998, now + duration);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(gains[i], now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Wooden Bead / Mala Click Chime
 */
export function playBeadChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // ignore
  }
}

/**
 * Complete Mala (108 beads) Celebration Bell
 */
export function playMalaComplete(): void {
  try {
    playTempleGong(528, 4.5);
  } catch {
    // ignore
  }
}

/**
 * Meditative Tanpura / Om Drone Synthesizer
 */
class DronePlayer {
  private active = false;
  private oscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;

  start(): void {
    if (this.active) return;
    try {
      const ctx = getAudioContext();
      this.active = true;
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
      this.masterGain.connect(ctx.destination);

      // Root note C#3 (~138.59 Hz) and 5th note G#3 (~207.65 Hz) - Traditional meditative drone
      const freqs = [138.59, 138.59 * 2, 207.65, 138.59 * 3];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.15 + idx * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.8, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        this.oscillators.push(lfo);

        oscGain.gain.setValueAtTime(0.25 / (idx + 1), ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);
        osc.start();
        this.oscillators.push(osc);
      });
    } catch {
      this.active = false;
    }
  }

  stop(): void {
    if (!this.active || !audioCtx || !this.masterGain) return;
    try {
      const ctx = audioCtx;
      this.masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        this.oscillators = [];
        this.active = false;
      }, 1600);
    } catch {
      this.active = false;
    }
  }

  toggle(): boolean {
    if (this.active) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  isPlaying(): boolean {
    return this.active;
  }
}

export const tanpuraDrone = new DronePlayer();
