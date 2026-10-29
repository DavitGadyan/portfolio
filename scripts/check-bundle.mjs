// Sum gzip size of the JS referenced by out/index.html; fail above the budget.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB ?? 170); // Next 16 + React 19 baseline is ~116 KB gz (module scripts only); app code must stay under ~50 KB
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const out = join(process.cwd(), 'out');
const html = readFileSync(join(out, 'index.html'), 'utf8');
const tags = [...html.matchAll(/<script([^>]*)src="([^"]+)"([^>]*)>/g)].filter((m) => !/nomodule/i.test(m[1] + m[3])); // nomodule polyfills are never fetched by modern browsers
const srcs = [...new Set(tags.map((m) => m[2]).filter((s) => s.includes('/_next/')))];
let total = 0;
const rows = [];
for (const s of srcs) {
  const rel = s.startsWith(base) ? s.slice(base.length) : s;
  const gz = gzipSync(readFileSync(join(out, rel))).length;
  total += gz;
  rows.push([rel, gz]);
}
rows.sort((a, b) => b[1] - a[1]);
for (const [s, gz] of rows) console.log(`${(gz / 1024).toFixed(1).padStart(7)} KB  ${s}`);
console.log(`[bundle] total ${(total / 1024).toFixed(1)} KB gzip across ${rows.length} scripts (budget ${BUDGET_KB} KB)`);
if (total > BUDGET_KB * 1024) { console.error('[bundle] over budget'); process.exit(1); }
