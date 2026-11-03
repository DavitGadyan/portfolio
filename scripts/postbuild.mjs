// After `next build` + image optimisation: 404.html for GitHub Pages, .nojekyll, optional CNAME, required-file assertions.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'out');
if (!existsSync(out)) { console.error('[postbuild] out/ missing'); process.exit(1); }

const notFound = join(out, 'not-found-page', 'index.html');
if (existsSync(notFound)) {
  cpSync(notFound, join(out, '404.html'));
  rmSync(join(out, 'not-found-page'), { recursive: true, force: true });
}
writeFileSync(join(out, '.nojekyll'), '');
rmSync(join(out, '_not-found'), { recursive: true, force: true });
rmSync(join(out, '404'), { recursive: true, force: true }); // Next's default not-found with trailingSlash; 404.html (ours) is what GitHub Pages serves
const domain = (process.env.CUSTOM_DOMAIN ?? '').trim();
if (domain) writeFileSync(join(out, 'CNAME'), `${domain}\n`);
else if (existsSync(join(out, 'CNAME'))) rmSync(join(out, 'CNAME'));

const required = [
  'index.html', 'es/index.html', '404.html', '.nojekyll',
  'sitemap.xml', 'robots.txt', 'manifest.webmanifest', 'llms.txt', 'llms-full.txt', 'es/llms.txt', 'es/llms-full.txt',
  'portfolio/index.html', 'es/portfolio/index.html', 'blog/index.html', 'es/blog/index.html', 'materials/index.html', 'materials/videos/index.html', 'es/materials/videos/index.html',
  'cookies/index.html', 'es/cookies/index.html', 'privacy/index.html', 'es/privacy/index.html', 'thank-you/index.html', 'es/thank-you/index.html',
];
const missing = required.filter((f) => !existsSync(join(out, f)));
if (missing.length) { console.error('[postbuild] missing:', missing.join(', ')); process.exit(1); }

// Short links used in proposals (data/short-links.json): /GenAI/ → the page that hosts the video. GitHub Pages cannot send a
// 301, so a meta-refresh page whose canonical is the target is the static equivalent (same pattern as scripts/legacy-redirects.mjs).
// The refresh target is relative to the site (works on localhost and under a basePath); the canonical is absolute.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://davidgadyan.com').replace(/\/+$/, '');
const { links } = JSON.parse(readFileSync(join(process.cwd(), 'data', 'short-links.json'), 'utf8'));
for (const [from, to] of Object.entries(links)) {
  if (!existsSync(join(out, to, 'index.html'))) { console.error(`[postbuild] short link ${from} points at a missing page ${to}`); process.exit(1); }
  const dir = join(out, from), file = join(dir, 'index.html');
  if (existsSync(file) && !/http-equiv="refresh"/.test(readFileSync(file, 'utf8'))) { console.error(`[postbuild] short link ${from} collides with a built page`); process.exit(1); }
  mkdirSync(dir, { recursive: true });
  const href = `${basePath}${to}`, canonical = `${siteUrl}${to}`;
  writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>David Gadyan</title><meta http-equiv="refresh" content="0; url=${href}"><link rel="canonical" href="${canonical}"><script>location.replace(${JSON.stringify(href)})</script></head><body><p><a href="${href}">${canonical}</a></p></body></html>\n`);
}
console.log(`[postbuild] ok${domain ? ` (CNAME=${domain})` : ' (no CNAME)'}, ${Object.keys(links).length} short links`);
