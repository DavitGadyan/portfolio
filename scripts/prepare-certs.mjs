// Usage: node scripts/prepare-certs.mjs
// assets/certs/*.png (Google Skillshop certificate pages, ~1600×1200, round badge on top) → two outputs each:
//   public/logos/<badge slug>.png  the badge alone, cropped from the top of the page, trimmed and fitted in 160×160 (the icon in the skills map)
//   public/certs/<name>.webp       the whole certificate at 1200 px wide, loaded only when the certificate card opens
// public/certs sits outside public/images on purpose so the image optimizer never multiplies these files.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets/certs', LOGOS = 'public/logos', CERTS = 'public/certs';
// certificate file name → badge icon slug (the names data/skillLogos.ts already references)
const badgeSlug = { 'google-ads-measurement': 'google-ads-measurement', 'google-ads-conversion-optimization': 'google-ads-conversions', 'google-ads-video': 'google-ads-video' };
fs.mkdirSync(LOGOS, { recursive: true });
fs.mkdirSync(CERTS, { recursive: true });
for (const f of fs.readdirSync(SRC)) {
  if (!/\.png$/i.test(f)) continue;
  const base = f.replace(/\.png$/i, '');
  const src = path.join(SRC, f);
  const { width, height } = await sharp(src).metadata();
  // the badge sits alone in the top third of the page; crop that band, then trim the white around it (two pipelines: sharp always trims before it extracts)
  const band = await sharp(src).extract({ left: Math.round(width * 0.28), top: Math.round(height * 0.02), width: Math.round(width * 0.44), height: Math.round(height * 0.32) }).toBuffer();
  const badge = await sharp(band).trim({ threshold: 30 }).toBuffer();
  const icon = await sharp(badge).resize({ width: 160, height: 160, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9, effort: 10 }).toBuffer();
  fs.writeFileSync(path.join(LOGOS, (badgeSlug[base] ?? base) + '.png'), icon);
  const full = await sharp(src).resize({ width: 1200 }).webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(path.join(CERTS, base + '.webp'), full);
  console.log(`${base}: badge ${Math.round(icon.length / 1024)} KB, certificate ${Math.round(full.length / 1024)} KB`);
}
