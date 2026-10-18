/**
 * QuizMaster Pro - Audio Synthesizer (Web Audio API)
 * Zero external audio files required. Generates pleasant micro-sound effects
 * dynamically using standard browser Web Audio API oscillators.
 * Sound is DISABLED by default as per specification.
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.enabled = false; // Default OFF as requested
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("Web Audio API not supported in this browser:", e);
    }
  }

  resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setEnabled(state) {
    this.enabled = !!state;
    if (this.enabled && !this.initialized) {
      this.init();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  // Play a pleasant two-tone chime for correct answers
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5
    osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.28); // C6

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.25);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);
  }

  // Play a soft low tone for incorrect answers (gentle, not harsh or jarring)
  playIncorrect() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    // Apply lowpass filter to soften sawtooth
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Soft micro-click for navigation / button click
  playClick() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Realistic mechanical typewriter keystroke click
  playTypewriterKey() {
    this.init();
    this.resume();
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Subtle pitch variation for realistic tactile typewriter effect
      const freq = 1050 + (Math.random() * 260 - 130);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.022);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.032);
    } catch (e) {
      // Audio playback fails silently if not permitted
    }
  }

  // Subtle urgency blip for countdown warning in last 10 seconds
  playWarningTick() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Victorious short melody when quiz completes
  playComplete() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const start = now + (idx * 0.09);
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.1, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(start);
      osc.stop(start + 0.3);
    });
  }
}

const soundManager = new SoundController();
