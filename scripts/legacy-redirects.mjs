// Usage: node scripts/legacy-redirects.mjs <target-origin> [out-dir]
//   e.g. node scripts/legacy-redirects.mjs https://davidgadyan.com legacy-out
// Writes an HTML redirect page for every old Hugo URL of davitgadyan.github.io/portfolio_app (data/legacy-redirects.json)
// that sends visitors and search engines to the same content on the new site. Deploy the folder as the old repo's site
// when the Hugo site is retired: GitHub Pages cannot send 301s, so meta refresh + canonical is the static equivalent.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const origin = (process.argv[2] ?? '').replace(/\/+$/, '');
if (!/^https?:\/\//.test(origin)) { console.error('usage: node scripts/legacy-redirects.mjs <https://target-origin[/base-path]> [out-dir]'); process.exit(1); }
const dir = process.argv[3] ?? 'legacy-out';
const { redirects } = JSON.parse(readFileSync(join(process.cwd(), 'data', 'legacy-redirects.json'), 'utf8'));
let n = 0;
for (const [from, to] of Object.entries(redirects)) {
  const target = `${origin}${to}`;
  mkdirSync(join(dir, from), { recursive: true });
  writeFileSync(join(dir, from, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Moved · David Gadyan</title><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><script>location.replace(${JSON.stringify(target)})</script></head><body><p>This page has moved to <a href="${target}">${target}</a>.</p></body></html>\n`);
  n++;
}
writeFileSync(join(dir, '.nojekyll'), '');
console.log(`${n} redirect pages → ${dir}/ (targets on ${origin})`);
