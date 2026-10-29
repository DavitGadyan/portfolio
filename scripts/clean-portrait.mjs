// Clean a cut-out portrait PNG that already has an alpha channel (e.g. rembg output): kill the low-alpha halo, snap the
// subject to fully opaque, feather the edge by ~1 px, trim, downscale to 1040 px wide and compress. Sharp edges, no fade.
// Usage: node scripts/clean-portrait.mjs <source.png> <dest.png> [preview-dir]
import sharp from 'sharp';
import fs from 'node:fs';

const [,, src, dst, previewDir] = process.argv;
if (!src || !dst) { console.error('usage: node scripts/clean-portrait.mjs <source.png> <dest.png> [preview-dir]'); process.exit(1); }
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;

// 1. alpha remap: <= 40 -> 0 (halo), >= 241 -> 1 (subject), linear in between
let a = new Float32Array(N);
for (let i = 0; i < N; i++) a[i] = Math.min(1, Math.max(0, (data[i * 4 + 3] - 40) / (241 - 40)));

// 2. light feather: one 3x3 box blur (~1 px soft edge, still a crisp silhouette)
const blur3 = (s) => { const o = new Float32Array(N); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let sum = 0, n = 0; for (let dy = -1; dy <= 1; dy++) { const yy = y + dy; if (yy < 0 || yy >= H) continue; for (let dx = -1; dx <= 1; dx++) { const xx = x + dx; if (xx < 0 || xx >= W) continue; sum += s[yy * W + xx]; n++; } } o[y * W + x] = sum / n; } return o; };
a = blur3(a);

// 3. compose, trim, downscale, compress
const rgba = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) { rgba[i * 4] = data[i * 4]; rgba[i * 4 + 1] = data[i * 4 + 1]; rgba[i * 4 + 2] = data[i * 4 + 2]; rgba[i * 4 + 3] = Math.round(a[i] * 255); }
const out = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 }).resize({ width: 1040, withoutEnlargement: true }).png({ compressionLevel: 9, effort: 10 }).toBuffer({ resolveWithObject: true });
fs.writeFileSync(dst, out.data);
console.log(`written ${dst} ${out.info.width}x${out.info.height} ${Math.round(out.data.length / 1024)} KB`);
if (previewDir) {
  for (const [name, bg] of [['paper', '#ffffff'], ['dark', '#2b2c2f']]) {
    await sharp({ create: { width: out.info.width, height: out.info.height, channels: 3, background: bg } }).composite([{ input: out.data }]).jpeg({ quality: 85 }).toFile(`${previewDir}/preview-${name}.jpg`);
  }
}
