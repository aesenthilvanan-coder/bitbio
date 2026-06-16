// ─── Web Audio Sound Synthesizer ─────────────────────────────────────────────
// All sounds are procedurally generated — no audio files required.

interface AudioState {
  ctx: AudioContext;
  masterGain: GainNode;
  musicGain: GainNode;
}

let audioState: AudioState | null = null;
let currentMusicOscillator: OscillatorNode | null = null;

let sfxVolume = 0.7;
let musicVolume = 0.05;

// ── Core initializer ─────────────────────────────────────────────────────────

function getAudio(): AudioState {
  if (!audioState) {
    const ctx = new AudioContext();

    const masterGain = ctx.createGain();
    masterGain.gain.value = sfxVolume;
    masterGain.connect(ctx.destination);

    const musicGain = ctx.createGain();
    musicGain.gain.value = musicVolume;
    musicGain.connect(ctx.destination);

    audioState = { ctx, masterGain, musicGain };
  }
  if (audioState.ctx.state === "suspended") {
    audioState.ctx.resume();
  }
  return audioState;
}

/** Call once on first user interaction to satisfy browser autoplay policy. */
export function initAudio(): void {
  getAudio();
}

// ── Shared helpers ────────────────────────────────────────────────────────────

/**
 * Schedule a single tone: ramps gain up to `gainValue` over 10ms then back
 * down to 0 at `startTime + duration`.
 */
function playTone(
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "sine",
  gainValue = 0.3,
  detune = 0,
): void {
  const { ctx, masterGain } = getAudio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;

  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
  g.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(g);
  g.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

// ── Sound effects ─────────────────────────────────────────────────────────────

/** Rising major arpeggio: C5 → E5 → G5, triangle wave — bright and satisfying. */
export function playCorrect(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(523.25, now, 0.08, "triangle", 0.3);
  playTone(659.25, now + 0.08, 0.08, "triangle", 0.3);
  playTone(784.0, now + 0.16, 0.14, "triangle", 0.35);
}

/** Descending minor: G4 → F4 → Eb4, sawtooth with slight detune — dull thud. */
export function playWrong(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(392.0, now, 0.1, "sawtooth", 0.2, -15);
  playTone(349.23, now + 0.1, 0.1, "sawtooth", 0.2, -20);
  playTone(311.13, now + 0.2, 0.18, "sawtooth", 0.2, -25);
}

/** Triumphant fanfare: C5-E5-G5-C6, square wave. */
export function playLevelUp(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(523.25, now, 0.12, "square", 0.25);
  playTone(659.25, now + 0.12, 0.12, "square", 0.25);
  playTone(784.0, now + 0.24, 0.12, "square", 0.25);
  playTone(1046.5, now + 0.36, 0.28, "square", 0.3);
}

/** Celebration jingle: C5-E5-G5-E5-C6, triangle wave. */
export function playNodeComplete(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(523.25, now, 0.1, "triangle", 0.3);
  playTone(659.25, now + 0.1, 0.1, "triangle", 0.3);
  playTone(784.0, now + 0.2, 0.1, "triangle", 0.3);
  playTone(659.25, now + 0.3, 0.1, "triangle", 0.3);
  playTone(1046.5, now + 0.4, 0.22, "triangle", 0.4);
}

/** Deep impact: 60 Hz sine + 120 Hz square, sharp attack/decay. */
export function playBossHit(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(60, now, 0.3, "sine", 0.6);
  playTone(120, now, 0.3, "square", 0.3);
}

/** Victory fanfare: rising E5→G5→A5→C6→E6 then sustained chord. */
export function playBossDefeated(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  const notes = [659.25, 784.0, 880.0, 1046.5, 1318.5];
  notes.forEach((freq, i) => {
    const dur = i < notes.length - 1 ? 0.12 : 0.4;
    playTone(freq, now + i * 0.15, dur, "square", 0.3);
  });
  const chordStart = now + notes.length * 0.15;
  playTone(523.25, chordStart, 0.55, "triangle", 0.22);
  playTone(659.25, chordStart, 0.55, "triangle", 0.22);
  playTone(784.0, chordStart, 0.55, "triangle", 0.22);
}

/** Soft blip at 800 Hz, 30 ms — typewriter character tick. */
export function playDialogueTick(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(800, now, 0.03, "sine", 0.05);
}

/** Tiny blip for menu navigation. */
export function playMenuMove(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(440, now, 0.03, "sine", 0.1);
}

/** Click/pop for menu selections. */
export function playMenuSelect(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(880, now, 0.02, "square", 0.2);
  playTone(1100, now + 0.02, 0.05, "sine", 0.15);
}

/** Sad descending tone: G4 → E4 → C4. */
export function playHeartLost(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(392.0, now, 0.15, "sine", 0.3);
  playTone(329.63, now + 0.15, 0.15, "sine", 0.3);
  playTone(261.63, now + 0.3, 0.28, "sine", 0.3);
}

/** Warm ascending tone: C4 → E4 → G4. */
export function playHeartGained(): void {
  const { ctx } = getAudio();
  const now = ctx.currentTime;
  playTone(261.63, now, 0.1, "sine", 0.25);
  playTone(329.63, now + 0.1, 0.1, "sine", 0.25);
  playTone(392.0, now + 0.2, 0.18, "sine", 0.3);
}

/** Whoosh frequency sweep (200 → 800 Hz) followed by a pop. */
export function playEnzymeThrow(): void {
  const { ctx, masterGain } = getAudio();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
  g.gain.setValueAtTime(0.2, now);
  g.gain.linearRampToValueAtTime(0, now + 0.3);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.32);

  playTone(1200, now + 0.3, 0.05, "square", 0.3);
}

/** White noise burst + sub-bass kick — Realm 3 tackle crash. */
export function playImpact(): void {
  const { ctx, masterGain } = getAudio();
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.3);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.4, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  source.connect(filter);
  filter.connect(g);
  g.connect(masterGain);
  source.start(now);

  // sub-bass punch
  playTone(80, now, 0.2, "sine", 0.55);
}

/** LFO-modulated sweep from 200 → 800 Hz over 1.2 s — mystical portal whoosh. */
export function playPortalWoosh(): void {
  const { ctx, masterGain } = getAudio();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const g = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 1.2);

  lfo.type = "sine";
  lfo.frequency.value = 8;
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.3, now + 0.1);
  g.gain.setValueAtTime(0.3, now + 1.0);
  g.gain.linearRampToValueAtTime(0, now + 1.2);

  osc.connect(g);
  g.connect(masterGain);

  lfo.start(now);
  osc.start(now);
  lfo.stop(now + 1.3);
  osc.stop(now + 1.3);
}

// ── Realm music ───────────────────────────────────────────────────────────────

const REALM_FREQUENCIES: Record<1 | 2 | 3 | 4, number> = {
  1: 110.0,   // deep teal drone  (A2)
  2: 130.8,   // forest green     (C3)
  3: 146.8,   // cosmic purple    (D3)
  4: 123.5,   // cathedral gold   (B2)
};

/** Start a low-volume ambient drone for the given realm. Call stopMusic() first if switching. */
export function startRealmMusic(realm: 1 | 2 | 3 | 4): void {
  stopMusic();
  const { ctx, musicGain } = getAudio();
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = REALM_FREQUENCIES[realm];
  osc.connect(musicGain);
  osc.start();
  currentMusicOscillator = osc;
}

/** Stop the current ambient music loop. */
export function stopMusic(): void {
  if (currentMusicOscillator) {
    try {
      currentMusicOscillator.stop();
    } catch {
      // already stopped or never started
    }
    currentMusicOscillator = null;
  }
}

/** Set music volume (0–1). Default is 0.05. */
export function setMusicVolume(vol: number): void {
  musicVolume = Math.max(0, Math.min(1, vol));
  if (audioState) {
    audioState.musicGain.gain.value = musicVolume;
  }
}

// ── Global volume ─────────────────────────────────────────────────────────────

/** Set sound effects volume (0–1). Default is 0.7. */
export function setSFXVolume(vol: number): void {
  sfxVolume = Math.max(0, Math.min(1, vol));
  if (audioState) {
    audioState.masterGain.gain.value = sfxVolume;
  }
}

/** Returns the current SFX master volume (0–1). */
export function getMasterVolume(): number {
  return sfxVolume;
}
