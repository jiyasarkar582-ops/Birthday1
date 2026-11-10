// Web Audio API music synthesizer for zero-dependency, 100% reliable background tunes & sound effects

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private currentVolume: number = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle bell / music box tone
  private playBellTone(freq: number, startTime: number, duration: number = 0.8) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Primary fundamental sine wave
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Subtle sweet metallic overtone (chime characteristic)
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.76, startTime);

    // ADSR Envelope: crisp attack, delicate exponential decay
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    overtone.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    overtone.start(startTime);
    osc.stop(startTime + duration);
    overtone.stop(startTime + duration);
  }

  // Play a soft warm piano chord tone
  private playPianoTone(freq: number, startTime: number, duration: number = 1.4) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Happy Birthday melody notes in Hz (Key of C)
  private getHappyBirthdayMelody(): { freq: number; duration: number }[] {
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const B4 = 493.88;
    const C5 = 523.25;

    return [
      { freq: C4, duration: 0.35 },
      { freq: C4, duration: 0.35 },
      { freq: D4, duration: 0.7 },
      { freq: C4, duration: 0.7 },
      { freq: F4, duration: 0.7 },
      { freq: E4, duration: 1.2 },

      { freq: C4, duration: 0.35 },
      { freq: C4, duration: 0.35 },
      { freq: D4, duration: 0.7 },
      { freq: C4, duration: 0.7 },
      { freq: G4, duration: 0.7 },
      { freq: F4, duration: 1.2 },

      { freq: C4, duration: 0.35 },
      { freq: C4, duration: 0.35 },
      { freq: C5, duration: 0.7 },
      { freq: A4, duration: 0.7 },
      { freq: F4, duration: 0.7 },
      { freq: E4, duration: 0.7 },
      { freq: D4, duration: 1.2 },

      { freq: B4, duration: 0.35 },
      { freq: B4, duration: 0.35 },
      { freq: A4, duration: 0.7 },
      { freq: F4, duration: 0.7 },
      { freq: G4, duration: 0.7 },
      { freq: F4, duration: 1.4 },
    ];
  }

  // Celestial Chimes sequence
  private getCelestialMelody(): { freq: number; duration: number }[] {
    const notes = [
      523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
      587.33, 739.99, 880.00, 1174.66, // D5, F#5, A5, D6
      440.00, 523.25, 659.25, 880.00,  // A4, C5, E5, A5
      392.00, 493.88, 587.33, 783.99,  // G4, B4, D5, G5
    ];
    return notes.map(f => ({ freq: f, duration: 1.0 }));
  }

  // Start playing chosen track
  public playTrack(trackId: 'chimes' | 'musicbox' | 'lofi-piano' | 'celebration' = 'chimes', onNote?: (noteIndex: number) => void) {
    this.initContext();
    if (!this.ctx) return;

    this.stop();
    this.isPlaying = true;

    const melody = trackId === 'musicbox' || trackId === 'celebration'
      ? this.getCelestialMelody()
      : this.getHappyBirthdayMelody();

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlaying || !this.ctx) return;

      const current = melody[noteIdx];
      const now = this.ctx.currentTime;

      if (trackId === 'lofi-piano') {
        this.playPianoTone(current.freq, now, current.duration * 1.5);
      } else {
        this.playBellTone(current.freq, now, current.duration * 1.2);
      }

      if (onNote) onNote(noteIdx);

      noteIdx = (noteIdx + 1) % melody.length;
      const delayMs = (current.duration + (trackId === 'celebration' ? 0.05 : 0.2)) * 1000;
      this.timerId = window.setTimeout(playNext, delayMs);
    };

    playNext();
  }

  // Stop music
  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  // Sound effect: Candle blowing out with realistic breath & sparkling chime
  public playCandleBlowSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Breath / air gust: white noise through bandpass
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(1.5, now);

    const breathGain = this.ctx.createGain();
    breathGain.gain.setValueAtTime(0, now);
    breathGain.gain.linearRampToValueAtTime(0.4, now + 0.1);
    breathGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(filter);
    filter.connect(breathGain);
    breathGain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.8);

    // Celebratory chime when extinguished
    const chimeFreqs = [880, 1174.66, 1396.91, 1760];
    chimeFreqs.forEach((freq, idx) => {
      this.playBellTone(freq, now + 0.4 + idx * 0.08, 1.2);
    });
  }

  // Sound effect: Wax seal break & envelope open paper rustle
  public playEnvelopeOpenSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Crisp parchment paper rustle
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, now);

    const paperGain = this.ctx.createGain();
    paperGain.gain.setValueAtTime(0, now);
    paperGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    paperGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(paperGain);
    paperGain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.5);

    // Gentle harp flourish
    const flourish = [523.25, 659.25, 783.99, 1046.50];
    flourish.forEach((f, i) => {
      this.playBellTone(f, now + 0.1 + i * 0.07, 0.9);
    });
  }
}

export const audioSynthesizer = new AudioSynthesizer();
