/**
 * BitBio Pixel Art Studio — Tool Suite Index
 * All tools in one place. Import from here.
 *
 * CLI: npx ts-node pixel-art-studio/tools/index.ts <command> [args]
 *   Commands:
 *     analyze-palette #00ffcc,#050d10,...   — palette quality report
 *     validate-sprite <realm> <colors>      — sprite style check
 *     check-realm <realm> <colors>          — tile style check
 *     suggest-palette <mood>                — generate realm palette
 *     score-walk <frame-count>              — walk cycle timing guidance
 */

export * from './palette-analyzer';
export * from './sprite-validator';
export * from './tileset-generator';
export * from './animation-scorer';
export * from './style-checker';
export * from './sprite-generator';

// ─── CLI Runner ───────────────────────────────────────────────────────────────

if (typeof require !== 'undefined' && require.main === module) {
  const { analyzePalette, suggestPalette, buildColorRamp } = require('./palette-analyzer');
  const { checkConsistency, validateRealmAsset, BITBIO_STYLE_GUIDE } = require('./style-checker');

  const [,, cmd, ...args] = process.argv;

  switch (cmd) {
    case 'analyze-palette': {
      const colors = (args[0] ?? '').split(',').map(c => c.trim()).filter(Boolean);
      if (!colors.length) { console.error('Usage: analyze-palette #hex1,#hex2,...'); process.exit(1); }
      const report = analyzePalette(colors);
      console.log(JSON.stringify(report, null, 2));
      break;
    }

    case 'validate-sprite': {
      const realm = parseInt(args[0] ?? '1') as 1|2|3|4;
      const colors = (args[1] ?? '').split(',').map(c => c.trim()).filter(Boolean);
      const issues = validateRealmAsset(colors, realm, 'cli-check');
      if (issues.length === 0) {
        console.log('✓ No style issues found.');
      } else {
        issues.forEach(i => console.log(`[${i.severity.toUpperCase()}] ${i.rule}: ${i.description}`));
        console.log(`\n${issues.filter(i => i.severity === 'critical').length} critical, ${issues.filter(i => i.severity === 'warning').length} warnings`);
      }
      break;
    }

    case 'suggest-palette': {
      const mood = (args[0] as 'dark' | 'dream' | 'horror' | 'warm') ?? 'dark';
      const palette = suggestPalette(mood);
      console.log(`Suggested palette for mood "${mood}":`);
      palette.forEach((c: string) => console.log(`  ${c}`));
      break;
    }

    case 'build-ramp': {
      const base = args[0] ?? '#00ffcc';
      const steps = parseInt(args[1] ?? '5');
      const ramp = buildColorRamp(base, steps);
      console.log(`Color ramp from ${base} (${steps} steps):`);
      ramp.forEach((c: string) => console.log(`  ${c}`));
      break;
    }

    case 'score-walk': {
      const frames = parseInt(args[0] ?? '4');
      const timings: Record<number, string> = {
        2: '200ms/frame — Undertale style, minimal but functional',
        4: '150ms/frame — Pokemon B/W style, industry standard',
        6: '100ms/frame — Smooth, good for dynamic characters',
        8: '80ms/frame — Very smooth, near Stardew Valley quality',
      };
      console.log(timings[frames] ?? `${frames} frames: use ~${Math.round(800/frames)}ms/frame`);
      break;
    }

    default:
      console.log(`BitBio Pixel Art Studio CLI
Commands:
  analyze-palette #hex1,#hex2,...     Analyze palette quality
  validate-sprite <realm> <colors>    Check sprite against realm style
  suggest-palette <mood>              Get palette for mood (dark|dream|horror|warm)
  build-ramp <base-color> <steps>     Build hue-shifted color ramp
  score-walk <frame-count>            Walk cycle timing guidance
      `);
  }
}
