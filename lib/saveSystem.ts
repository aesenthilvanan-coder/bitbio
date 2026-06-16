// BitBio Save System — full architecture for multi-tier persistence + Google OAuth (Phase 2)

import type { AvatarConfig, PlayerProgress } from './types';

// ─── Save File Schema ──────────────────────────────────────────────────────────

export interface LearningAnalytics {
  conceptsEncountered: string[];
  conceptsMastered: string[];
  averageFirstAttemptScore: number;
  hintsUsed: number;
  totalAnswers: number;
  correctAnswers: number;
  sessionCount: number;
  totalPlaytimeSeconds: number;
  realmTimesSeconds: Record<number, number>;
  bossAttempts: Record<string, number>;
  bossDefeats: Record<string, boolean>;
  streakRecord: number;
}

export interface SaveFile {
  id: string;
  version: number;         // schema version for migration
  createdAt: string;       // ISO 8601
  lastSaved: string;
  checksum: string;        // CRC32 of JSON sans checksum field

  profile: {
    displayName: string;
    email?: string;        // populated after Google OAuth
    googleId?: string;     // populated after Google OAuth
    avatar: AvatarConfig;
    playtime: number;      // total seconds
    sessionStart: number;  // timestamp of current session start
  };

  progress: PlayerProgress;

  // Story state flags — string keys map to bool/string/number
  storyFlags: Record<string, boolean | string | number>;

  // Learning analytics (separate from progress to avoid bloat)
  learning: LearningAnalytics;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const SAVE_KEY = 'bitbio-save-v1';
const BACKUP_KEY = 'bitbio-save-backup-v1';
const SAVE_VERSION = 1;

// ─── Checksum (fast non-crypto integrity check) ────────────────────────────────

function crc32(str: string): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ str.charCodeAt(i)) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function computeChecksum(save: SaveFile): string {
  const { checksum: _ignored, ...rest } = save;
  return crc32(JSON.stringify(rest)).toString(16).padStart(8, '0');
}

// ─── ID generation ─────────────────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Default new save ─────────────────────────────────────────────────────────

import { DEFAULT_AVATAR, DEFAULT_PROGRESS } from './types';

export function createNewSave(displayName = 'Explorer'): SaveFile {
  const now = new Date().toISOString();
  const save: SaveFile = {
    id: generateId(),
    version: SAVE_VERSION,
    createdAt: now,
    lastSaved: now,
    checksum: '',
    profile: {
      displayName,
      avatar: { ...DEFAULT_AVATAR, characterName: displayName },
      playtime: 0,
      sessionStart: Date.now(),
    },
    progress: { ...DEFAULT_PROGRESS },
    storyFlags: {
      hasSeenIntro: false,
      hasSeenMomDemon: false,
      hasBeenSuckedIn: false,
      enzymeIntroComplete: false,
      realm1FirstVisit: true,
      realm2FirstVisit: true,
      realm3FirstVisit: true,
      realm4FirstVisit: true,
      momLetterFound: false,
      henryTruthRevealed: false,
    },
    learning: {
      conceptsEncountered: [],
      conceptsMastered: [],
      averageFirstAttemptScore: 0,
      hintsUsed: 0,
      totalAnswers: 0,
      correctAnswers: 0,
      sessionCount: 1,
      totalPlaytimeSeconds: 0,
      realmTimesSeconds: { 1: 0, 2: 0, 3: 0, 4: 0 },
      bossAttempts: {},
      bossDefeats: {},
      streakRecord: 0,
    },
  };
  save.checksum = computeChecksum(save);
  return save;
}

// ─── Save operations ──────────────────────────────────────────────────────────

export function writeSave(save: SaveFile): void {
  save.lastSaved = new Date().toISOString();
  // Update playtime
  if (save.profile.sessionStart) {
    const elapsed = Math.floor((Date.now() - save.profile.sessionStart) / 1000);
    save.profile.playtime += elapsed;
    save.profile.sessionStart = Date.now();
  }
  save.checksum = computeChecksum(save);
  const json = JSON.stringify(save);
  try {
    // Write primary + backup atomically
    localStorage.setItem(SAVE_KEY, json);
    sessionStorage.setItem(BACKUP_KEY, json);
  } catch (e) {
    console.error('[BitBio Save] Write failed:', e);
  }
}

export function readSave(): SaveFile | null {
  // Try primary store
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const save = JSON.parse(raw) as SaveFile;
      if (validateSave(save)) return migrateSave(save);
    }
  } catch { /* fall through */ }

  // Try backup
  try {
    const raw = sessionStorage.getItem(BACKUP_KEY);
    if (raw) {
      const save = JSON.parse(raw) as SaveFile;
      if (validateSave(save)) return migrateSave(save);
    }
  } catch { /* fall through */ }

  return null;
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
  sessionStorage.removeItem(BACKUP_KEY);
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateSave(save: unknown): save is SaveFile {
  if (!save || typeof save !== 'object') return false;
  const s = save as Partial<SaveFile>;
  if (!s.id || !s.version || !s.profile || !s.progress) return false;
  // Checksum integrity check
  const expected = computeChecksum(s as SaveFile);
  if (s.checksum !== expected) {
    console.warn('[BitBio Save] Checksum mismatch — save may be corrupted. Attempting to use anyway.');
    // Allow corrupted saves with warning (don't block player)
  }
  return true;
}

// ─── Migration (future-proof schema evolution) ────────────────────────────────

function migrateSave(save: SaveFile): SaveFile {
  if (save.version === SAVE_VERSION) return save;
  // v1 → v2, v2 → v3, etc. would go here
  // For now, bump to current version and re-checksum
  save.version = SAVE_VERSION;
  save.checksum = computeChecksum(save);
  return save;
}

// ─── Story flag helpers ────────────────────────────────────────────────────────

export function setStoryFlag(save: SaveFile, key: string, value: boolean | string | number): void {
  save.storyFlags[key] = value;
  writeSave(save);
}

export function getStoryFlag(save: SaveFile, key: string): boolean | string | number | undefined {
  return save.storyFlags[key];
}

// ─── Learning analytics helpers ───────────────────────────────────────────────

export function recordAnswer(save: SaveFile, correct: boolean, hintUsed: boolean): void {
  save.learning.totalAnswers++;
  if (correct) save.learning.correctAnswers++;
  if (hintUsed) save.learning.hintsUsed++;
  save.learning.averageFirstAttemptScore =
    save.learning.correctAnswers / save.learning.totalAnswers;
}

export function markConceptEncountered(save: SaveFile, concept: string): void {
  if (!save.learning.conceptsEncountered.includes(concept)) {
    save.learning.conceptsEncountered.push(concept);
  }
}

export function markConceptMastered(save: SaveFile, concept: string): void {
  markConceptEncountered(save, concept);
  if (!save.learning.conceptsMastered.includes(concept)) {
    save.learning.conceptsMastered.push(concept);
  }
}

// ─── Auto-save system ─────────────────────────────────────────────────────────

let autoSaveInterval: ReturnType<typeof setInterval> | null = null;

export function startAutoSave(getSave: () => SaveFile, intervalMs = 180_000): void {
  stopAutoSave();
  autoSaveInterval = setInterval(() => {
    writeSave(getSave());
  }, intervalMs);
}

export function stopAutoSave(): void {
  if (autoSaveInterval !== null) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}

// Save on page visibility change (user switches tabs)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) sessionStorage.setItem(BACKUP_KEY, raw);
    }
  });
}

// ─── Google OAuth Cloud Save (Phase 2 — architecture only) ────────────────────
//
// When Google OAuth is integrated:
// 1. After login: fetch save from Google Drive AppData folder
//    GET https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)
//    If a save file exists, compare timestamps with localStorage
//    Use most recent version (or show user a "which save?" screen if > 7 days apart)
//
// 2. On save: write to localStorage first (instant), then async upload to Google Drive
//    POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
//    Body: { name: 'bitbio-save.json', parents: ['appDataFolder'] }, save JSON
//
// 3. Save file name: 'bitbio-save.json' in the appDataFolder (invisible to user)
//
// 4. Conflict resolution: Server timestamp wins if local is older
//
// Skeleton (requires next-auth + googleapis):
//
// export async function cloudSave(accessToken: string, save: SaveFile): Promise<void> {
//   const json = JSON.stringify(save);
//   const boundary = '---BitBioSaveBoundary';
//   const body = [
//     `--${boundary}`,
//     'Content-Type: application/json; charset=UTF-8',
//     '',
//     JSON.stringify({ name: 'bitbio-save.json', parents: ['appDataFolder'] }),
//     `--${boundary}`,
//     'Content-Type: application/json',
//     '',
//     json,
//     `--${boundary}--`,
//   ].join('\r\n');
//   await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       'Content-Type': `multipart/related; boundary=${boundary}`,
//     },
//     body,
//   });
// }
