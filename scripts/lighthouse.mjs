// Serve out/ and run mobile Lighthouse on the key URLs. Usage: node scripts/lighthouse.mjs [baseUrl]
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';

const base = process.argv[2] ?? '';
const PATHS = ['/', '/es/', '/portfolio/', '/portfolio/ai-marketing-ga4-seo-geo/', '/blog/improvtalk-charisma-app/'];
const MIN = { performance: Number(process.env.LH_MIN_PERF ?? 80), accessibility: 95, 'best-practices': 95, seo: 95 };
mkdirSync('.lighthouse', { recursive: true });

let server = null;
let origin = base;
if (!origin) {
  server = spawn('npx', ['serve', 'out', '-l', '4173'], { stdio: 'ignore' });
  origin = 'http://localhost:4173';
  await new Promise((r) => setTimeout(r, 2500));
}
let failed = false;
try {
  for (const p of PATHS) {
    const out = `.lighthouse/${p.replace(/[^a-z0-9]+/gi, '_') || 'home'}.json`;
    execFileSync('npx', ['lighthouse', `${origin}${p}`, '--output=json', `--output-path=${out}`, '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new --no-sandbox', '--quiet'], { stdio: 'ignore' });
    const r = JSON.parse(readFileSync(out, 'utf8'));
    const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
    const lcp = r.audits['largest-contentful-paint']?.displayValue ?? '';
    const cls = r.audits['cumulative-layout-shift']?.displayValue ?? '';
    const bad = Object.entries(MIN).filter(([k, min]) => s[k] < min).map(([k]) => k);
    if (bad.length) failed = true;
    console.log(`${p.padEnd(42)} perf ${s.performance}  a11y ${s.accessibility}  bp ${s['best-practices']}  seo ${s.seo}  LCP ${lcp}  CLS ${cls}${bad.length ? `  <-- below min: ${bad.join(', ')}` : ''}`);
  }
} finally {
  server?.kill();
}
process.exit(failed ? 1 : 0);
