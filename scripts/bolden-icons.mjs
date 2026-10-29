// Usage: node scripts/bolden-icons.mjs [ratio]   (run ONCE on the original line icons; keep a backup)
// Thickens the strokes of the transparent line-art service icons by compositing each icon over itself shifted in 8
// directions (a cheap morphological dilation), radius = ratio × icon size (default 0.012 → ≈2–3 px on a 200–240 px source).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'public/images/icons';
const files = ['gen-ai', 'web-development', 'graphic-design', 'software-development', 'machine-learning', 'dbms', 'mlops', 'marketing'];
const ratio = Number(process.argv[2] ?? 0.012);
for (const f of files) {
  const p = path.join(DIR, f + '.png');
  const meta = await sharp(p).metadata();
  const base = await sharp(p).ensureAlpha().png().toBuffer();
  const r = Math.max(2, Math.round(Math.max(meta.width, meta.height) * ratio)), r2 = Math.max(1, Math.round(r / 2));
  const layers = [];
  for (const d of [r, r2]) for (const [dx, dy] of [[d, 0], [-d, 0], [0, d], [0, -d], [d, d], [-d, -d], [d, -d], [-d, d]]) {
    // two separate pipelines: in one chain sharp applies extract before extend
    const extended = await sharp(base).extend({ top: Math.max(0, dy), bottom: Math.max(0, -dy), left: Math.max(0, dx), right: Math.max(0, -dx), background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const shifted = await sharp(extended).extract({ left: Math.max(0, -dx), top: Math.max(0, -dy), width: meta.width, height: meta.height }).png().toBuffer();
    layers.push({ input: shifted, blend: 'over' });
  }
  const out = await sharp(base).composite(layers).png({ compressionLevel: 9, effort: 10 }).toBuffer();
  fs.writeFileSync(p, out);
  console.log(f, meta.width + 'x' + meta.height, 'dilated by', r, 'px');
}
