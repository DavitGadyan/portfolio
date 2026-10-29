// After `next build` + image optimisation: 404.html for GitHub Pages, .nojekyll, optional CNAME, required-file assertions.
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
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
  'portfolio/index.html', 'es/portfolio/index.html', 'blog/index.html', 'es/blog/index.html',
  'cookies/index.html', 'es/cookies/index.html', 'privacy/index.html', 'es/privacy/index.html', 'thank-you/index.html', 'es/thank-you/index.html',
];
const missing = required.filter((f) => !existsSync(join(out, f)));
if (missing.length) { console.error('[postbuild] missing:', missing.join(', ')); process.exit(1); }
console.log(`[postbuild] ok${domain ? ` (CNAME=${domain})` : ' (no CNAME)'}`);
