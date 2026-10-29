// Usage: node scripts/prepare-logos.mjs
// assets/logos/*.png (David's drop zone, any size) → public/logos/<slug>.png: trimmed, fitted in 160×160, max PNG compression.
// Also fetches the few marks we do not have as PNGs from Simple Icons (CC0) or the brand's own site as SVG. The Google Ads
// certificates live in assets/certs and go through scripts/prepare-certs.mjs instead. public/logos is outside public/images on
// purpose: these mount on demand in the capability graph and must not be multiplied by the image optimizer.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets/logos', DST = 'public/logos';
const slugMap = {
  'EKS Anywhere': 'eks-anywhere', 'microsoft-sql-server-light': 'sql-server', 'google-cloud-platform': 'gcp', 'github-light': 'github', 'XGBoost': 'xgboost', 'Textract': 'textract',
};
fs.mkdirSync(DST, { recursive: true });
let n = 0, bytes = 0;
for (const f of fs.readdirSync(SRC)) {
  if (!/\.png$/i.test(f)) continue;
  const base = f.replace(/\.png$/i, '');
  const slug = slugMap[base] ?? base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const buf = await sharp(path.join(SRC, f)).trim({ threshold: 10 })
    .resize({ width: 160, height: 160, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, withoutEnlargement: false })
    .png({ compressionLevel: 9, effort: 10 }).toBuffer();
  fs.writeFileSync(path.join(DST, slug + '.png'), buf); n++; bytes += buf.length;
}
console.log(`${n} PNG logos → ${DST} (${Math.round(bytes / 1024)} KB)`);

const svgs = { 'kali-linux': 'kalilinux/557C94', owasp: 'owasp/000000', 'burp-suite': 'burpsuite/FF6633', wireshark: 'wireshark/1679A7', metasploit: 'metasploit/2A6478',
  ga4: 'googleanalytics/E37400', gtm: 'googletagmanager/246FDB', 'search-console': 'googlesearchconsole/458CF5', n8n: 'n8n/EA4B71', supabase: 'supabase/3FCF8E',
  vercel: 'vercel/000000', mcp: 'modelcontextprotocol/000000', typescript: 'typescript/3178C6', tailwind: 'tailwindcss/06B6D4', nodejs: 'nodedotjs/5FA04E', stripe: 'stripe/635BFF', langchain: 'langchain/1C3C3C',
  drawio: 'diagramsdotnet/F08705', plotly: 'plotly/7A76FF', d3: 'd3/F9A03C' };
// official marks served by the brands themselves (no Simple Icons entry): name → URL
const direct = { grok: 'https://svgl.app/library/grok-dark.svg', base44: 'https://base44.com/logo_v2.svg', 'react-native': 'https://reactnative.dev/img/header_logo.svg' };
let fetched = 0;
const all = [...Object.entries(svgs).map(([n, slug]) => [n, 'https://cdn.simpleicons.org/' + slug]), ...Object.entries(direct)];
for (const [name, url] of all) {
  const out = path.join(DST, name + '.svg');
  if (fs.existsSync(out)) { fetched++; continue; }
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok || !text.trimStart().startsWith('<svg')) { console.error('svg fetch failed for', url, res.status); continue; }
  fs.writeFileSync(out, text); fetched++;
}
console.log(`${fetched}/${all.length} SVG logos present`);

// React Native shares React's atom; show it the way reactnative.dev does, on its navy tile, so the two marks read apart.
const rn = path.join(DST, 'react-native.svg');
const rnSvg = fs.readFileSync(rn, 'utf8');
if (!rnSvg.includes('<rect')) {
  const inner = rnSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  fs.writeFileSync(rn, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="#20232a"/><svg x="14" y="18" width="100" height="92" viewBox="0 0 112 102">${inner}</svg></svg>`);
  console.log('react-native.svg wrapped on its navy tile');
}
