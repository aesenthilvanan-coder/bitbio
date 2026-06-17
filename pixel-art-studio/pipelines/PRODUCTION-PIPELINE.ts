/**
 * BitBio Pixel Art Production Pipeline — Phase 5
 * Autonomous asset creation workflow
 *
 * This module is the canonical source of truth for all production tasks,
 * sprints, and milestones across the BitBio Pixel Art Studio.
 *
 * Usage:
 *   import { createTask, generateSprintReport, getCriticalPath } from './PRODUCTION-PIPELINE';
 */

// ─── Core Types ────────────────────────────────────────────────────────────────

export type AssetType = 'sprite' | 'tileset' | 'animation' | 'ui' | 'background' | 'boss';
export type Department = 'sprite' | 'animation' | 'environment' | 'qa' | 'art-research';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'backlog' | 'in-progress' | 'review' | 'done' | 'blocked';

export interface ProductionTask {
  id: string;
  title: string;
  description: string;
  assetType: AssetType;
  department: Department;
  priority: Priority;
  status: Status;
  estimatedHours: number;
  dependencies: string[];         // task IDs that must be done first
  assignedAgent?: string;
  realm?: 1 | 2 | 3 | 4;
  qualityScore?: number;          // 0-100 (QA rubric score × 10)
  iterationCount: number;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  tasks: string[];                // task IDs
  velocity: number;               // estimated story points (1 point ≈ 1 hour)
  status: 'planning' | 'active' | 'review' | 'done';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  requiredTasks: string[];
  completionCriteria: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

// ─── Internal Registry ─────────────────────────────────────────────────────────

const taskRegistry: Map<string, ProductionTask> = new Map();

// ─── Factory & Mutation ────────────────────────────────────────────────────────

/**
 * Create a new ProductionTask with generated ID and ISO timestamps.
 * Fields not supplied get sensible defaults.
 */
export function createTask(partial: Partial<ProductionTask>): ProductionTask {
  const now = new Date().toISOString();
  const id =
    partial.id ??
    `TASK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  const task: ProductionTask = {
    id,
    title: partial.title ?? 'Untitled Task',
    description: partial.description ?? '',
    assetType: partial.assetType ?? 'sprite',
    department: partial.department ?? 'sprite',
    priority: partial.priority ?? 'medium',
    status: partial.status ?? 'backlog',
    estimatedHours: partial.estimatedHours ?? 2,
    dependencies: partial.dependencies ?? [],
    assignedAgent: partial.assignedAgent,
    realm: partial.realm,
    qualityScore: partial.qualityScore,
    iterationCount: partial.iterationCount ?? 0,
    notes: partial.notes ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };

  taskRegistry.set(task.id, task);
  return task;
}

/**
 * Update an existing task by ID. Logs each mutation to the task's notes array.
 */
export function updateTask(id: string, update: Partial<ProductionTask>): void {
  const existing = taskRegistry.get(id);
  if (!existing) {
    console.warn(`[PIPELINE] updateTask: task ${id} not found in registry.`);
    return;
  }

  const changed: string[] = [];
  for (const [key, val] of Object.entries(update)) {
    const k = key as keyof ProductionTask;
    if (JSON.stringify(existing[k]) !== JSON.stringify(val)) {
      changed.push(`${k}: ${JSON.stringify(existing[k])} → ${JSON.stringify(val)}`);
    }
  }

  const now = new Date().toISOString();
  const updated: ProductionTask = {
    ...existing,
    ...update,
    updatedAt: now,
    notes: [
      ...existing.notes,
      ...(changed.length > 0
        ? [`[${now.slice(0, 10)}] Updated: ${changed.join('; ')}`]
        : []),
    ],
  };

  taskRegistry.set(id, updated);
}

// ─── Query Functions ───────────────────────────────────────────────────────────

/**
 * Return all tasks assigned to a given department.
 */
export function getTasksByDepartment(dept: Department): ProductionTask[] {
  return Array.from(taskRegistry.values()).filter((t) => t.department === dept);
}

/**
 * Return tasks that cannot proceed because at least one dependency has
 * not reached 'done' status.
 */
export function getBlockedTasks(tasks: ProductionTask[]): ProductionTask[] {
  const doneIds = new Set(tasks.filter((t) => t.status === 'done').map((t) => t.id));
  return tasks.filter(
    (t) =>
      t.status !== 'done' &&
      t.dependencies.length > 0 &&
      t.dependencies.some((dep) => !doneIds.has(dep)),
  );
}

/**
 * Topological sort of tasks by dependency chain.
 * Returns tasks ordered so that every dependency appears before the task
 * that requires it.  Cycles are broken arbitrarily (logged as warnings).
 */
export function getCriticalPath(tasks: ProductionTask[]): ProductionTask[] {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const visited = new Set<string>();
  const result: ProductionTask[] = [];

  function visit(id: string, ancestors: Set<string>): void {
    if (visited.has(id)) return;
    const task = byId.get(id);
    if (!task) return;

    if (ancestors.has(id)) {
      console.warn(`[PIPELINE] Dependency cycle detected at task ${id} — skipping.`);
      return;
    }

    ancestors.add(id);
    for (const dep of task.dependencies) {
      visit(dep, ancestors);
    }
    ancestors.delete(id);

    visited.add(id);
    result.push(task);
  }

  for (const task of tasks) {
    visit(task.id, new Set());
  }

  return result;
}

// ─── Reporting ─────────────────────────────────────────────────────────────────

/**
 * Generate a Markdown sprint report summarising completion, velocity,
 * blocked tasks, and quality scores for the given sprint and task list.
 */
export function generateSprintReport(sprint: Sprint, tasks: ProductionTask[]): string {
  const sprintTasks = tasks.filter((t) => sprint.tasks.includes(t.id));
  const done = sprintTasks.filter((t) => t.status === 'done');
  const inProgress = sprintTasks.filter((t) => t.status === 'in-progress');
  const blocked = getBlockedTasks(sprintTasks);
  const backlog = sprintTasks.filter((t) => t.status === 'backlog');

  const totalHours = sprintTasks.reduce((s, t) => s + t.estimatedHours, 0);
  const completedHours = done.reduce((s, t) => s + t.estimatedHours, 0);
  const velocityPct = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  const scoredTasks = sprintTasks.filter((t) => t.qualityScore !== undefined);
  const avgScore =
    scoredTasks.length > 0
      ? (scoredTasks.reduce((s, t) => s + (t.qualityScore ?? 0), 0) / scoredTasks.length / 10).toFixed(1)
      : 'N/A';

  const statusRow = (t: ProductionTask): string =>
    `| ${t.id} | ${t.title.slice(0, 50)} | ${t.status} | ${
      t.qualityScore !== undefined ? (t.qualityScore / 10).toFixed(1) : '—'
    } | ${t.estimatedHours}h |`;

  const lines = [
    `# Sprint Report — ${sprint.name}`,
    `**${sprint.startDate} → ${sprint.endDate}**`,
    '',
    `## Goal`,
    sprint.goal,
    '',
    `## Summary`,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total tasks | ${sprintTasks.length} |`,
    `| Done | ${done.length} (${velocityPct}% velocity) |`,
    `| In progress | ${inProgress.length} |`,
    `| Blocked | ${blocked.length} |`,
    `| Backlog | ${backlog.length} |`,
    `| Estimated hours | ${totalHours}h |`,
    `| Completed hours | ${completedHours}h |`,
    `| Average quality score | ${avgScore}/10 |`,
    '',
    `## Task Detail`,
    `| ID | Title | Status | Score | Hours |`,
    `|----|-------|--------|-------|-------|`,
    ...sprintTasks.map(statusRow),
    '',
  ];

  if (blocked.length > 0) {
    lines.push(`## Blocked Tasks`, '');
    for (const t of blocked) {
      const unmet = t.dependencies.filter(
        (dep) => !done.some((d) => d.id === dep),
      );
      lines.push(`- **${t.id}** ${t.title} — waiting on: ${unmet.join(', ')}`);
    }
    lines.push('');
  }

  if (done.length > 0) {
    lines.push(`## Completed This Sprint`, '');
    for (const t of done) {
      const score = t.qualityScore !== undefined ? ` [QA: ${(t.qualityScore / 10).toFixed(1)}/10]` : '';
      lines.push(`- ✓ **${t.id}** ${t.title}${score}`);
      if (t.notes.length > 0) {
        lines.push(`  > ${t.notes[t.notes.length - 1]}`);
      }
    }
    lines.push('');
  }

  lines.push(
    `## Recommendations`,
    '',
    `- Priority next sprint: ${backlog[0]?.title ?? 'None remaining'}`,
    `- Unblock: ${blocked.map((t) => t.id).join(', ') || 'Nothing blocked'}`,
    `- Raise quality bar for any scored asset below 7.5/10`,
  );

  return lines.join('\n');
}

/**
 * Assess risk factors for a single task.
 * Returns a list of plain-English risk strings.
 */
export function assessRisk(task: ProductionTask): string[] {
  const risks: string[] = [];

  if (task.dependencies.length > 2) {
    risks.push(`High dependency count (${task.dependencies.length}) — risk of cascading delay`);
  }

  if (task.estimatedHours > 8) {
    risks.push(`Large task (${task.estimatedHours}h estimated) — consider splitting into sub-tasks`);
  }

  if (task.iterationCount > 2) {
    risks.push(`Task has been iterated ${task.iterationCount} times — underlying design issue likely`);
  }

  if (task.priority === 'critical' && task.status === 'backlog') {
    risks.push(`Critical priority task still in backlog — schedule immediately`);
  }

  if (task.qualityScore !== undefined && task.qualityScore < 70) {
    risks.push(`Current quality score (${task.qualityScore / 10}/10) below ship threshold of 7.0`);
  }

  if (task.department === 'sprite' && task.assetType === 'boss') {
    risks.push(`Boss sprites are high-visibility — visual regression risk on every game update`);
  }

  if (task.realm === undefined && task.assetType !== 'ui') {
    risks.push(`No realm assigned — asset may lack proper palette context during development`);
  }

  if (task.status === 'blocked') {
    risks.push(`Task is currently blocked — check dependencies before assigning`);
  }

  if (risks.length === 0) {
    risks.push(`No significant risks identified — standard pipeline applies`);
  }

  return risks;
}

// ─── Pre-populated Task Registry ──────────────────────────────────────────────
// 25 tasks organized across all department categories.
// Run this file to load the registry; import task objects directly for use in other tools.

// === WorldEntryAnimation Backgrounds (one per realm) ===

export const WEA_001 = createTask({
  id: 'WEA-001',
  title: 'Cytoplasm WorldEntryAnimation background — organelle parallax',
  description:
    'A procedurally animated background for the Cytoplasm realm (Realm 1) entry sequence. ' +
    'Layered organelles (mitochondria, ribosomes, ER membrane, nucleus glow) animate at different ' +
    'speeds as the player enters, creating a parallax depth illusion. Must use only Realm 1 palette. ' +
    'No radial gradients — all shapes built from fillRect blocks.',
  assetType: 'background',
  department: 'environment',
  priority: 'high',
  status: 'in-progress',
  estimatedHours: 6,
  dependencies: [],
  realm: 1,
  qualityScore: 75,
  iterationCount: 1,
  notes: [
    'Reference: CytoplasmRealm.tsx already has animated organelle background at score 7.5/10.',
    'Upgrade needed: replace radial gradients with fillRect blocks, increase organelle opacity.',
    'Target: 8.0+ score. Key fix: make organelles blockier to match pixel art aesthetic.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-15T14:30:00.000Z',
});

export const WEA_002 = createTask({
  id: 'WEA-002',
  title: 'Genome Forest WorldEntryAnimation background — DNA canopy flythrough',
  description:
    'A background for the Genome Forest realm (Realm 2) entry sequence. The camera flies ' +
    'through a forest of DNA double-helix trees with a primordial gene-pool floor visible below. ' +
    'Base pairs (AT/GC) visible in the helices. Palette: greens, dark browns, forest floor.',
  assetType: 'background',
  department: 'environment',
  priority: 'high',
  status: 'backlog',
  estimatedHours: 7,
  dependencies: ['ENV-006'],
  realm: 2,
  iterationCount: 0,
  notes: [
    'Blocked until ENV-006 (DNA helix tree animation) is complete — reuse that asset here.',
    'The DNA helix T-tile is currently the strongest science-art asset in the game. Foreground it.',
    'Background layers: distant forest silhouette, mid-range helix trees, foreground leaf-litter floor.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const WEA_003 = createTask({
  id: 'WEA-003',
  title: 'Neural Nebula WorldEntryAnimation background — synaptic void',
  description:
    'A background for the Neural Nebula realm (Realm 3) entry sequence. Deep black void ' +
    'with crystal neural spires receding into distance. Pulses of light travel along synaptic ' +
    'bridges visible in the background. Star field with twinkling 1px dots.',
  assetType: 'background',
  department: 'environment',
  priority: 'high',
  status: 'backlog',
  estimatedHours: 5,
  dependencies: ['ENV-007', 'ENV-008'],
  realm: 3,
  iterationCount: 0,
  notes: [
    'Reference: Hyper Light Drifter void areas, Undertale Void.',
    'Neural light bridge path tile (currently strong — score ~7.5) should be featured prominently.',
    'Keep color palette cool: purple, indigo, near-black. No warm tones in this realm.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const WEA_004 = createTask({
  id: 'WEA-004',
  title: 'Protein Cathedral WorldEntryAnimation background — gothic nave descent',
  description:
    'A background for the Protein Cathedral realm (Realm 4) entry sequence. Player descends ' +
    'from a nave ceiling past gothic pillars with amber candlelight. Stained-glass window visible ' +
    'in background with protein fold silhouette pattern.',
  assetType: 'background',
  department: 'environment',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 8,
  dependencies: ['ENV-009', 'ENV-010'],
  realm: 4,
  iterationCount: 0,
  notes: [
    'Most complex background — gothic architecture requires precise vertical and horizontal geometry.',
    'Reference: Castlevania: Aria of Sorrow castle backgrounds, Final Fantasy VI throne room.',
    'Amber/gold accent color (#ffaa22) should be the only warm color against near-black walls.',
    'Protein Cathedral realm score currently 5.0/10 — this background will set the tone for an upgrade.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

// === Boss Sprite Completion (VIRON, OVERFIT, AMYLOID — LYSO is Sprint 1/SPR-001) ===

export const BSS_001 = createTask({
  id: 'BSS-001',
  title: 'VIRON boss sprite — icosahedral virus 3-phase redesign',
  description:
    'Redesign drawViron() in BossBattle.tsx. Phase 1: clear icosahedron with 5 triangular face ' +
    'planes, 6 spike proteins, 3 orbiting nucleocapsid rings, green glowing receptor-binding eye. ' +
    'Phase 2: 2 spikes broken, one cracked face. Phase 3: half the icosahedron missing, core exposed.',
  assetType: 'boss',
  department: 'sprite',
  priority: 'critical',
  status: 'backlog',
  estimatedHours: 10,
  dependencies: [],
  realm: 2,
  qualityScore: 40,
  iterationCount: 0,
  notes: [
    'Current score: 4.0/10. Reads as overlapping rectangles, not a virus.',
    'Key fix: explicitly draw 5 face planes as rect clusters with distinct shading each.',
    'The orbital rings ARE good — keep but increase radius and particle count.',
    'Reference: T4 bacteriophage structure. Biological basis: icosahedral capsid virus.',
    'Sprint 2 target. Blocked by nothing — can start immediately.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-15T14:30:00.000Z',
});

export const BSS_002 = createTask({
  id: 'BSS-002',
  title: 'OVERFIT boss sprite — neural network skull 3-phase redesign',
  description:
    'Redesign drawOverfit() in BossBattle.tsx. Phase 1: large skull (32px wide at jaw) with ' +
    'glowing neural circuitry on surface, dual-color eye sockets (purple overfitted / cyan validation), ' +
    'binary-code mouth. 8 pulsing neural nodes. Phase 2: validation eye dark, static pixels. ' +
    'Phase 3: 50% static, only obsessively overfitted purple eye remains.',
  assetType: 'boss',
  department: 'sprite',
  priority: 'critical',
  status: 'backlog',
  estimatedHours: 10,
  dependencies: [],
  realm: 3,
  qualityScore: 50,
  iterationCount: 0,
  notes: [
    'Current score: 5.0/10. Best concept of the 4 bosses — "neural network that became the data."',
    'Key fix: skull must use top 60% of canvas area — currently too small.',
    'Neural nodes: 4x4 game pixels with 1px connecting lines between them.',
    '"ERROR ERROR ERROR" should render as pixel text in the eye socket at Phase 3.',
    'Reference: overfitted ML models losing generalization — visual metaphor of rigid, broken recall.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-15T14:30:00.000Z',
});

export const BSS_003 = createTask({
  id: 'BSS-003',
  title: 'AMYLOID TYRANT boss sprite — fibril accumulation 3-phase redesign',
  description:
    'Redesign drawAmyloid() in BossBattle.tsx. Phase 1: 6 beta-sheet stacks of increasing width ' +
    '(top 8px to base 26px), 16 fibril tendrils animated with sin(t+i). Phase 2: 3 sheets cracked, ' +
    'fibrils droop sideways. Phase 3: sheets fragment to 2x2 blocks, fibrils 24-32px covering canvas top.',
  assetType: 'boss',
  department: 'sprite',
  priority: 'critical',
  status: 'backlog',
  estimatedHours: 9,
  dependencies: [],
  realm: 4,
  qualityScore: 45,
  iterationCount: 0,
  notes: [
    'Current score: 4.5/10. Looks like a filing cabinet, not a protein tyrant.',
    'Key fix: change color from gray (#cccccc) to ivory/warm-white (#f5f0e8) to read as protein.',
    'Increase fibril count from 12 → 16, vary height range from 8-16px → 8-32px.',
    'Personality signal: EVERYTHING accumulates over time — more fibrils, more sheets, more mass.',
    'Reference: Alzheimer\'s amyloid-beta aggregates, tau tangles. Prion diseases.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-15T14:30:00.000Z',
});

// === Character Animations (8 tasks) ===

export const CANIM_001 = createTask({
  id: 'CANIM-001',
  title: 'Player walk cycle — 4-frame upgrade (all 4 directions)',
  description:
    'Upgrade drawPlayer() in PixelWorldEngine.tsx from 2-frame (head-bob only) to 4-frame ' +
    'walk cycle. Frame 0: neutral. Frame 1: left foot forward + right arm forward. Frame 2: ' +
    'neutral (crossed). Frame 3: right foot forward + left arm forward. All 4 directions.',
  assetType: 'animation',
  department: 'animation',
  priority: 'high',
  status: 'in-progress',
  estimatedHours: 3,
  dependencies: [],
  iterationCount: 1,
  notes: [
    'Current state: 2-frame walk (vertical head-bob only). Industry minimum is 4 frames.',
    'Technique: walkFrame 0-3 cycling. Feet and arms must be LINKED (left foot = right arm).',
    'Reference: Pokemon B/W walk cycle (4-frame, 150ms/frame). Undertale Frisk.',
    'Head bob: +1px up on frames 1 and 3 (stride frames). This is the most visible change.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-15T14:30:00.000Z',
});

export const CANIM_002 = createTask({
  id: 'CANIM-002',
  title: 'Player idle animation — breathing and blink cycle',
  description:
    'Add idle animation to drawPlayer() when player is stationary for >500ms. ' +
    'Frame 0: neutral stance. Frame 1: weight shift (body 1px right, left foot 1px forward). ' +
    'Frame 2: eyes look up. Frame 3: return neutral. Blink every ~6 seconds.',
  assetType: 'animation',
  department: 'animation',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 2,
  dependencies: ['CANIM-001'],
  iterationCount: 0,
  notes: [
    'Triggered when: player is stationary > 500ms.',
    'Uses animFrame clock (not walkFrame) to avoid interfering with walk.',
    'Blink: eyes-closed frame (dark rectangle over eye pixels) every 6s = every 36 idle frames at 6fps.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CANIM_003 = createTask({
  id: 'CANIM-003',
  title: 'Enzyme floating idle — bob, blink, and mood expressions',
  description:
    'Tune Enzyme\'s floating animation in PixelWorldEngine.tsx / IntroEngine.tsx. ' +
    'Float bob: 2px sinusoidal vertical movement at 1Hz. Blink every 4-8 seconds. ' +
    'Mood expressions: happy (default), annoyed (during hints), excited (correct answer), surprised (boss encounter).',
  assetType: 'animation',
  department: 'animation',
  priority: 'high',
  status: 'in-progress',
  estimatedHours: 2,
  dependencies: [],
  iterationCount: 1,
  notes: [
    'Enzyme is rendered in-game but float animation timing needs tuning.',
    'Bob formula: yOffset = Math.sin(t * Math.PI * 2) * 2 (2 game pixels amplitude, 1Hz)',
    'Mood system: Enzyme checks game state each render frame to select expression.',
    'Expressions implemented via eye/mouth rect changes only — body shape is constant.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-15T14:30:00.000Z',
});

export const CANIM_004 = createTask({
  id: 'CANIM-004',
  title: 'Enzyme talking animation — mouth syncs to dialogue',
  description:
    'Add mouth-movement animation to Enzyme while dialogue is playing. ' +
    'Mouth alternates open/closed every 100ms while dialogue text is being typed. ' +
    'Stops when player is reading (text complete, waiting for keypress).',
  assetType: 'animation',
  department: 'animation',
  priority: 'low',
  status: 'backlog',
  estimatedHours: 2,
  dependencies: ['CANIM-003'],
  iterationCount: 0,
  notes: [
    'Triggered by: dialogue typewriter active flag in game state.',
    'Open mouth: 3x2 dark rect at mouth position. Closed: same rect not drawn.',
    'Alternates at 100ms — use Math.floor(t * 10) % 2 for toggling.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CANIM_005 = createTask({
  id: 'CANIM-005',
  title: 'Elliot NPC idle animation — glasses adjustment',
  description:
    'Add idle animation to drawElliot() in PixelWorldEngine.tsx. ' +
    'Every 8 seconds: Elliot\'s right arm moves up toward face (arm rect shifts 2px upward) ' +
    'for 4 frames, then returns. Represents adjusting glasses.',
  assetType: 'animation',
  department: 'animation',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 1,
  dependencies: [],
  realm: 1,
  iterationCount: 0,
  notes: [
    'Current state: Elliot has 2-frame walk with mismatched sock color shift (score 6.5/10).',
    'Idle is separate from walk — uses animFrame, not walkFrame.',
    'The 8-second cadence means it fires rarely enough to feel like a natural habit.',
    'Optional: vary idle cadence slightly per NPC instance to avoid synchronization.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CANIM_006 = createTask({
  id: 'CANIM-006',
  title: 'Ben NPC idle animation — sandwich bite',
  description:
    'Add idle animation to drawBen() in PixelWorldEngine.tsx. ' +
    'Every 10 seconds: sandwich rises toward Ben\'s mouth over 3 frames, mouth opens, ' +
    'sandwich lowers. Brief "chewing" — body bobs 1px for 2 frames.',
  assetType: 'animation',
  department: 'animation',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 1,
  dependencies: [],
  iterationCount: 0,
  notes: [
    'Ben\'s sandwich is already drawn in his right hand (armSwing sway with walk). Reuse that rect.',
    'Bite sequence: sandwich rect y offset: -2 → -4 → -2, mouth rect appears for 2 frames.',
    '10-second cadence differentiates from Elliot\'s 8-second glasses push.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CANIM_007 = createTask({
  id: 'CANIM-007',
  title: 'Alex NPC idle animation — coffee sip',
  description:
    'Add idle animation to drawAlex() in PixelWorldEngine.tsx. ' +
    'Every 6 seconds: coffee cup in left hand tilts (1px down rotation approximation) ' +
    'for 3 frames. Alex\'s head tilts 1px toward cup. Returns to neutral.',
  assetType: 'animation',
  department: 'animation',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 1,
  dependencies: [],
  iterationCount: 0,
  notes: [
    'Alex is the most precise character — coffee cup tilt should be a small, controlled motion.',
    'Tilt effect: shift coffee cup rect 1px down + 1px right (approximates tilting toward mouth).',
    'Do NOT use randomization — Alex\'s animations are clockwork-precise at 6-second intervals.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CANIM_008 = createTask({
  id: 'CANIM-008',
  title: 'Henry NPC glitch-burst idle animation — holographic malfunction',
  description:
    'Add rare glitch-burst idle to drawHenry() in PixelWorldEngine.tsx. ' +
    'Every 12 seconds: 4-frame full-body glitch sequence — opacity drops to 0.1, ' +
    'then 0.8, then 0.3, then returns to normal flicker cycle. ' +
    'Additionally: scanline gaps shift horizontally by 2px during glitch.',
  assetType: 'animation',
  department: 'animation',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 1,
  dependencies: [],
  iterationCount: 0,
  notes: [
    'Henry\'s holographic flicker (3-opacity cycle) is already implemented — score 7.0/10.',
    'Glitch burst is a RARER event (every 12s) separate from the continuous flicker cycle.',
    'Reference: Undertale Gaster encounters. OMORI Stranger entity.',
    'Scanline shift: during glitch, yOffset of alternating scanlines shifts by ±2px.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

// === Environmental Animations (4 tasks, one per realm) ===

export const EANIM_001 = createTask({
  id: 'EANIM-001',
  title: 'Cytoplasm mitochondria tile — ATP production glow sequence',
  description:
    'Animate the mitochondria T-tile in Realm 1 (PixelWorldEngine.tsx drawTile()). ' +
    'ATP synthase dots glow in sequence: left → center → right over 4 animation frames. ' +
    'Inner matrix breathes (subtle brightness cycle). Outer membrane pulses with teal accent.',
  assetType: 'animation',
  department: 'environment',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 2,
  dependencies: ['ENV-003'],
  realm: 1,
  iterationCount: 0,
  notes: [
    'Blocked by ENV-003 (mitochondria tile upgrade) — must have the upgraded tile before animating.',
    'ATP synthase dots are the 3 bright yellow dots on the inner membrane.',
    'Frame sequencing: frame 0 = left dot bright, frame 1 = center, frame 2 = right, frame 3 = all dim.',
    'Outer membrane pulse: use shiftColor(membraneBase, Math.sin(t*2)*30) for the teal glow.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const EANIM_002 = createTask({
  id: 'EANIM-002',
  title: 'Genome Forest DNA helix tree — animated rotation illusion',
  description:
    'Animate the DNA helix T-tile in Realm 2. Use animFrame to offset the zigzag backbone ' +
    'lX/rX arrays by 1px per frame — creates the illusion of a rotating helix without trig. ' +
    'Base pair colors cycle in sequence with the rotation.',
  assetType: 'animation',
  department: 'environment',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 2,
  dependencies: ['ENV-006'],
  realm: 2,
  iterationCount: 0,
  notes: [
    'The DNA helix T-tile is currently the best science-art asset in the game — this makes it even better.',
    'Technique: animFrame offsets the left/right backbone arrays by (animFrame % 4) pixels.',
    'Result: the helix appears to rotate, base pairs appear to cross the center alternately.',
    'Do NOT add new colors — rotate existing geometry only.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const EANIM_003 = createTask({
  id: 'EANIM-003',
  title: 'Neural Nebula crystal spire — synaptic pulse wave',
  description:
    'Add pulse animation to the crystal neural spire T-tile and the neural light bridge ' +
    'path tile in Realm 3. Pulse travels from spire top downward over 4 frames. ' +
    'Bridge tiles: light pulse moves left-to-right staggered by tile X position.',
  assetType: 'animation',
  department: 'environment',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 2,
  dependencies: ['ENV-007', 'ENV-008'],
  realm: 3,
  iterationCount: 0,
  notes: [
    'Neural light bridge path tile is already the strongest path tile in the game.',
    'Stagger formula: (animFrame + tx) % 4 for bridge tiles to create wave effect.',
    'Crystal spire pulse: top node glows brightest at frame 0, fades over frames 1-3.',
    'Connection tendrils should also pulse in sync with the spire.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const EANIM_004 = createTask({
  id: 'EANIM-004',
  title: 'Protein Cathedral — candlelight flicker and pillar aura',
  description:
    'Animate the cathedral aisle path tile and gothic pillar T-tile in Realm 4. ' +
    'Candlelight: flame particle flickers using animFrame-based brightness variation. ' +
    'Pillar aura: amber gold edge glow pulses at 0.5Hz.',
  assetType: 'animation',
  department: 'environment',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 2,
  dependencies: ['ENV-009', 'ENV-010'],
  realm: 4,
  iterationCount: 0,
  notes: [
    'Candlelight flicker: use alternating brightness levels per animFrame — not random.',
    'Frame 0: candle at 100% brightness. Frame 1: 70%. Frame 2: 90%. Frame 3: 80%.',
    'Pillar aura: 1px amber rect at highlight edge, opacity cycles with sin(t*Math.PI).',
    'This is the subtlest of the 4 realm environmental animations — atmospheric, not flashy.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

// === Curriculum Expansion (4 tasks, one per realm) ===

export const CUR_001 = createTask({
  id: 'CUR-001',
  title: 'Cytoplasm curriculum expansion — organelle function lessons',
  description:
    'Expand lesson nodes in Realm 1 (Cytoplasm) to cover: (1) Mitochondria ATP synthesis, ' +
    '(2) Lysosome autophagy pathway, (3) Endoplasmic reticulum protein processing, ' +
    '(4) Ribosome translation steps. Each lesson: 5 questions minimum, per BITBIO educational standard.',
  assetType: 'ui',
  department: 'art-research',
  priority: 'high',
  status: 'backlog',
  estimatedHours: 8,
  dependencies: [],
  realm: 1,
  iterationCount: 0,
  notes: [
    'Lesson node assets already exist — this task is content expansion, not new visual assets.',
    'Each lesson node must have an associated pixel art visual cue in the tile near the node.',
    'LYSO boss battle IS the capstone for Realm 1 curriculum — lessons must lead to that encounter.',
    'Biology accuracy requirement: review against Alberts Cell Biology textbook before shipping.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CUR_002 = createTask({
  id: 'CUR-002',
  title: 'Genome Forest curriculum expansion — DNA/RNA/gene expression lessons',
  description:
    'Expand lesson nodes in Realm 2 (Genome Forest) to cover: (1) DNA replication, ' +
    '(2) Transcription (DNA → mRNA), (3) RNA splicing, (4) Gene regulation and promoters. ' +
    'VIRON boss battle is the capstone — lessons must build to understanding viral DNA injection.',
  assetType: 'ui',
  department: 'art-research',
  priority: 'high',
  status: 'backlog',
  estimatedHours: 8,
  dependencies: [],
  realm: 2,
  iterationCount: 0,
  notes: [
    'DNA helix T-tile is the visual metaphor for this realm — lesson nodes should reference it.',
    'Unique to Realm 2: lesson questions should reference visual elements the player sees in the world.',
    'Example: "The colored tiles in the path represent DNA base pairs. Which pairs with Adenine?"',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CUR_003 = createTask({
  id: 'CUR-003',
  title: 'Neural Nebula curriculum expansion — neural signaling lessons',
  description:
    'Expand lesson nodes in Realm 3 (Neural Nebula) to cover: (1) Action potential mechanics, ' +
    '(2) Synaptic transmission, (3) Neurotransmitter types, (4) Neural network models and overfitting. ' +
    'OVERFIT boss battle is the capstone — lessons must build to understanding ML/biology parallel.',
  assetType: 'ui',
  department: 'art-research',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 10,
  dependencies: [],
  realm: 3,
  iterationCount: 0,
  notes: [
    'Unique to Realm 3: bridge between biological neural networks and artificial neural networks.',
    'The ML/biology parallel (overfitting) is a novel educational angle — handle carefully.',
    'Neurotransmitter lesson should appear BEFORE reaching the neural bridge path tiles (visual link).',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const CUR_004 = createTask({
  id: 'CUR-004',
  title: 'Protein Cathedral curriculum expansion — protein folding lessons',
  description:
    'Expand lesson nodes in Realm 4 (Protein Cathedral) to cover: (1) Protein primary/secondary structure, ' +
    '(2) Alpha helix and beta sheet formation, (3) Protein folding and chaperones, ' +
    '(4) Amyloid fibril formation and disease. AMYLOID TYRANT boss battle is the capstone.',
  assetType: 'ui',
  department: 'art-research',
  priority: 'medium',
  status: 'backlog',
  estimatedHours: 10,
  dependencies: [],
  realm: 4,
  iterationCount: 0,
  notes: [
    'The gothic cathedral aesthetic is a metaphor for protein\'s structural hierarchy.',
    'Alpha-helix column tiles (ENV-010 upgrade) should visually complement lesson content.',
    'Beta-sheet lesson must appear before the AMYLOID TYRANT boss room — narrative throughline.',
    'Hardest curriculum to simplify — protein folding is graduate-level. Use visual analogies.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

// === QA and Testing (2 tasks) ===

export const QA_001 = createTask({
  id: 'QA-001',
  title: 'Cytoplasm realm full QA audit — all assets scored',
  description:
    'Run every current Cytoplasm realm asset through QUALITY-RUBRIC.json. ' +
    'Document scores in departments/qa-division/cytoplasm-audit.json. ' +
    'Flag anything below 7.0 for improvement. Generate before/after delta from baseline.',
  assetType: 'sprite',
  department: 'qa',
  priority: 'critical',
  status: 'backlog',
  estimatedHours: 4,
  dependencies: ['ENV-001', 'ENV-002', 'ENV-003'],
  realm: 1,
  iterationCount: 0,
  notes: [
    'Baseline scores (pre-audit): Floor 7/10, Wall TBD, Mitochondria 6/10, Acid Pool 7/10, Path 7.5/10.',
    'Must run validateRealmAsset() for palette compliance and scoreWalkCycle() for any animated tiles.',
    'Gate criterion: ALL Cytoplasm assets must score >= 7.0 before realm is considered "Sprint 1 complete".',
    'Output: cytoplasm-audit.json with per-asset scores and improvement tickets for anything < 7.0.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

export const QA_002 = createTask({
  id: 'QA-002',
  title: 'All-realm visual benchmark test — 5 pass/fail criteria',
  description:
    'Run the 5 visual benchmark tests from MASTER-PLAN.md. ' +
    '(1) Cytoplasm → stranger says "cell biology". (2) LYSO sprite looks threatening alone. ' +
    '(3) Player walk cycle feels Undertale-quality. (4) Genome Forest helix visible immediately. ' +
    '(5) NPC dialogue art matches writing quality. Document pass/fail with screenshot evidence.',
  assetType: 'sprite',
  department: 'qa',
  priority: 'high',
  status: 'backlog',
  estimatedHours: 6,
  dependencies: [
    'BSS-001', 'BSS-002', 'BSS-003',
    'CANIM-001',
    'ENV-001', 'ENV-002', 'ENV-003',
    'ENV-004', 'ENV-005', 'ENV-006',
    'WEA-001',
  ],
  iterationCount: 0,
  notes: [
    'This is the FINAL gate before any sprint is declared "done" in the quality sense.',
    'Tests 1 and 2 require a human observer — cannot be automated.',
    'Tests 3-5 can be partially automated using scoreWalkCycle() and validateRealmAsset().',
    'Current benchmark pass rate: 0/5. Sprint 1 target: 2/5. Sprint 5 target: 5/5.',
  ],
  createdAt: '2026-06-10T09:00:00.000Z',
  updatedAt: '2026-06-10T09:00:00.000Z',
});

// ─── Sprint Definitions ────────────────────────────────────────────────────────

export const SPRINT_1: Sprint = {
  id: 'sprint-1',
  name: 'Sprint 1 — Cytoplasm and LYSO',
  startDate: '2026-06-10',
  endDate: '2026-06-24',
  goal: 'Bring Cytoplasm realm and LYSO boss to QA score 8.0+. Ship player HP bar upgrade and heart redesign.',
  tasks: ['WEA-001', 'CANIM-001', 'CANIM-003', 'EANIM-001', 'QA-001'],
  velocity: 17,
  status: 'active',
};

export const SPRINT_2: Sprint = {
  id: 'sprint-2',
  name: 'Sprint 2 — Boss Visual Overhaul',
  startDate: '2026-06-24',
  endDate: '2026-07-08',
  goal: 'Redesign VIRON, OVERFIT, and AMYLOID TYRANT to 8.0+ quality. Add phase-transition animations for all 4 bosses.',
  tasks: ['BSS-001', 'BSS-002', 'BSS-003', 'WEA-002', 'WEA-003'],
  velocity: 32,
  status: 'planning',
};

export const SPRINT_3: Sprint = {
  id: 'sprint-3',
  name: 'Sprint 3 — Player and NPC Polish',
  startDate: '2026-07-08',
  endDate: '2026-07-22',
  goal: 'Player walk cycle at 4 frames. All NPC idle animations implemented. Henry CRT scanline added.',
  tasks: ['CANIM-002', 'CANIM-004', 'CANIM-005', 'CANIM-006', 'CANIM-007', 'CANIM-008'],
  velocity: 8,
  status: 'planning',
};

export const SPRINT_4: Sprint = {
  id: 'sprint-4',
  name: 'Sprint 4 — Environment Division',
  startDate: '2026-07-22',
  endDate: '2026-08-05',
  goal: 'Genome Forest, Neural Nebula, and Protein Cathedral tileset upgrades. WorldEntryAnimation backgrounds for Realms 2-4.',
  tasks: ['WEA-004', 'EANIM-002', 'EANIM-003', 'EANIM-004', 'CUR-001', 'CUR-002'],
  velocity: 37,
  status: 'planning',
};

export const SPRINT_5: Sprint = {
  id: 'sprint-5',
  name: 'Sprint 5 — Curriculum and Final QA',
  startDate: '2026-08-05',
  endDate: '2026-08-19',
  goal: 'All 16 lesson node topics written. 5/5 visual benchmark tests passing. Game ready for external playtest.',
  tasks: ['CUR-003', 'CUR-004', 'QA-002'],
  velocity: 24,
  status: 'planning',
};

// ─── Milestone Definitions ─────────────────────────────────────────────────────

export const MILESTONES: Milestone[] = [
  {
    id: 'M1',
    name: 'Cytoplasm Realm — Visual Certification',
    description: 'Every Cytoplasm realm asset scores 7.0+ on QUALITY-RUBRIC.json. LYSO boss scores 8.0+.',
    targetDate: '2026-06-24',
    requiredTasks: ['WEA-001', 'EANIM-001', 'QA-001'],
    completionCriteria: [
      'All Cytoplasm tiles score >= 7.0 in cytoplasm-audit.json',
      'LYSO boss qualityScore >= 80',
      'Visual benchmark test #2 (LYSO looks threatening) passes',
      'No TypeScript errors in PixelWorldEngine.tsx or BossBattle.tsx',
    ],
    riskLevel: 'medium',
  },
  {
    id: 'M2',
    name: 'Boss Roster — All 4 Bosses Visually Certified',
    description: 'All four bosses score 8.0+ and have 3-phase art variants.',
    targetDate: '2026-07-08',
    requiredTasks: ['BSS-001', 'BSS-002', 'BSS-003'],
    completionCriteria: [
      'LYSO qualityScore >= 80',
      'VIRON qualityScore >= 80',
      'OVERFIT qualityScore >= 80',
      'AMYLOID TYRANT qualityScore >= 80',
      'All bosses have Phase 1/2/3 art variants (not just tint changes)',
    ],
    riskLevel: 'high',
  },
  {
    id: 'M3',
    name: 'Character Animation Complete',
    description: 'Player walk cycle at 4 frames. All NPC idle animations implemented.',
    targetDate: '2026-07-22',
    requiredTasks: ['CANIM-001', 'CANIM-002', 'CANIM-005', 'CANIM-006', 'CANIM-007', 'CANIM-008'],
    completionCriteria: [
      'Player walk cycle is 4 frames in all 4 directions',
      'scoreWalkCycle() returns overall > 80 for player',
      'All 4 NPC idle animations implemented and distinct',
      'Henry CRT scanline effect implemented',
    ],
    riskLevel: 'low',
  },
  {
    id: 'M4',
    name: 'All Realms — Visual Certification',
    description: 'All 4 realms score 7.5+ average. WorldEntryAnimation backgrounds exist for all 4 realms.',
    targetDate: '2026-08-05',
    requiredTasks: ['WEA-001', 'WEA-002', 'WEA-003', 'WEA-004', 'EANIM-001', 'EANIM-002', 'EANIM-003', 'EANIM-004'],
    completionCriteria: [
      'All 4 WorldEntryAnimation backgrounds implemented and scoring 7.5+',
      'All 4 realm environmental animations implemented',
      'Visual benchmark tests #1 and #4 pass',
      'No realm has an asset scoring below 6.5',
    ],
    riskLevel: 'high',
  },
  {
    id: 'M5',
    name: 'External Playtest Ready',
    description: '5/5 visual benchmark tests passing. All 16 lesson node topics complete. Game is playtest-ready.',
    targetDate: '2026-08-19',
    requiredTasks: ['CUR-001', 'CUR-002', 'CUR-003', 'CUR-004', 'QA-002'],
    completionCriteria: [
      'All 5 visual benchmark tests pass with screenshot evidence',
      'All 16 curriculum lesson topics have 5+ questions each',
      'Average quality score across all assets >= 7.5',
      'Zero TypeScript errors (tsc --noEmit clean)',
      'Game runs at 60fps on mid-tier laptop at 1080p',
    ],
    riskLevel: 'high',
  },
];

// ─── Convenience Exports ───────────────────────────────────────────────────────

/** All pre-populated tasks as an array */
export const ALL_TASKS: ProductionTask[] = [
  WEA_001, WEA_002, WEA_003, WEA_004,
  BSS_001, BSS_002, BSS_003,
  CANIM_001, CANIM_002, CANIM_003, CANIM_004,
  CANIM_005, CANIM_006, CANIM_007, CANIM_008,
  EANIM_001, EANIM_002, EANIM_003, EANIM_004,
  CUR_001, CUR_002, CUR_003, CUR_004,
  QA_001, QA_002,
];

export const ALL_SPRINTS: Sprint[] = [SPRINT_1, SPRINT_2, SPRINT_3, SPRINT_4, SPRINT_5];
export const ALL_MILESTONES: Milestone[] = MILESTONES;
