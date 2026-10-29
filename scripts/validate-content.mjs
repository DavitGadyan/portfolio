// Standalone content validator (mirror of lib/content/validate.ts) for writers: node scripts/validate-content.mjs projects <slug...>|all
import matter from 'gray-matter';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CATS = ['ai-agents', 'fullstack-uiux', 'ai-erp-saas', 'data-science-ml', 'computer-vision', 'databases-data-eng', 'cloud-devops-llmops', 'security-compliance', 'ai-marketing', 'finance-quant'];
const LAYERS = ['frontend', 'backend', 'ai', 'data', 'infra', 'security'];
const FOUR = new Set(['virgil-ai-health-insurance-agent', 'ai-lead-scoring-churn-crm']);
const P_INV = ['date', 'lastmod', 'client', 'cover', 'categories', 'stack', 'links', 'featured', 'order', 'draft'];
const B_INV = ['date', 'lastmod', 'cover', 'tags', 'articleSection', 'author', 'draft', 'readingMinutes'];
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '').slice(0, 10));

const [kind, ...slugArgs] = process.argv.slice(2);
if (!['projects', 'blog'].includes(kind)) { console.error('usage: node scripts/validate-content.mjs projects|blog <slug...>|all'); process.exit(2); }
const slugs = slugArgs.length && slugArgs[0] !== 'all' ? slugArgs : readdirSync(join('content/en', kind)).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));

let errors = 0, warnings = 0;
const err = (f, m) => { errors++; console.error(`ERROR ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.warn(`warn  ${f}: ${m}`); };

function mdxSafety(f, body) {
  const parts = body.split(/(```[\s\S]*?```)/g);
  parts.forEach((p, i) => {
    if (i % 2 === 1) return;
    const unescaped = p.match(/(?<!\\)[{}]/g);
    if (unescaped) err(f, `${unescaped.length} unescaped { or } in body (write \\{ and \\})`);
    const badLt = p.match(/<(?!\/?(YouTube|Loom)\b)(?![A-Za-z][A-Za-z0-9-]*(\s|>|\/))/g);
    if (badLt) err(f, `${badLt.length} raw "<" in body (use &lt; or a <YouTube/> / <Loom/> component)`);
    const htmlTags = p.match(/<\/?(?!YouTube|Loom)[a-z][a-z0-9-]*[\s>]/g);
    if (htmlTags) warn(f, `HTML tags in body: ${[...new Set(htmlTags)].join(' ')}`);
  });
  if (/^\s*#\s/m.test(body)) err(f, 'body must not contain an H1 (# ...); start at ## ');
}

function englishy(f, body) {
  const t = ` ${body.replace(/<[^>]+>/g, ' ').toLowerCase()} `;
  const hits = [' the ', ' and ', ' with ', ' for ', ' that '].filter((w) => (t.split(w).length - 1) >= 4).length;
  if (hits >= 3) err(f, 'ES body looks untranslated (English function words)');
}

for (const slug of slugs) {
  const enF = `content/en/${kind}/${slug}.mdx`, esF = `content/es/${kind}/${slug}.mdx`;
  if (!existsSync(enF)) { err(enF, 'missing'); continue; }
  if (!existsSync(esF)) { err(esF, 'missing ES sibling'); }
  if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 60) err(enF, 'bad slug');
  const en = matter(readFileSync(enF, 'utf8'));
  const es = existsSync(esF) ? matter(readFileSync(esF, 'utf8')) : null;
  const d = en.data;
  if (kind === 'projects') {
    if (!ISO.test(iso(d.date))) err(enF, 'date must be YYYY-MM-DD');
    if (d.lastmod !== undefined && !ISO.test(iso(d.lastmod))) err(enF, 'lastmod must be YYYY-MM-DD');
    if (typeof d.cover !== 'string' || !d.cover.startsWith('/images/')) err(enF, 'cover must start with /images/');
    else if (!existsSync(join('public', d.cover))) err(enF, `cover file not found: ${d.cover}`);
    const max = FOUR.has(slug) ? 4 : 3;
    if (!Array.isArray(d.categories) || d.categories.length < 1 || d.categories.length > max) err(enF, `categories must have 1–${max} entries`);
    else for (const c of d.categories) if (!CATS.includes(c)) err(enF, `unknown category ${c}`);
    for (const l of LAYERS) if (!Array.isArray(d.stack?.[l])) err(enF, `stack.${l} must be an array ([] allowed)`);
    if (!Array.isArray(d.outcomes) || d.outcomes.length < 2 || d.outcomes.length > 5) warn(enF, 'outcomes should have 2–5 entries');
    if (d.links && typeof d.links !== 'object') err(enF, 'links must be an object');
    if (es) for (const k of P_INV) if (es.data[k] !== undefined) err(esF, `ES must not declare invariant "${k}"`);
    for (const [f, doc] of [[enF, en], [esF, es]]) {
      if (!doc) continue;
      const x = doc.data;
      if (typeof x.title !== 'string' || !x.title.trim()) err(f, 'title required'); else if (x.title.length > 70) err(f, `title > 70 chars (${x.title.length})`);
      if (typeof x.description !== 'string') err(f, 'description required'); else if (x.description.length < 100 || x.description.length > 185) err(f, `description must be 100–185 chars (${x.description.length})`);
      if (typeof x.summary !== 'string' || x.summary.split(/\s+/).length < 25) warn(f, 'summary should be ~40–60 words');
      if (typeof x.coverAlt !== 'string') err(f, 'coverAlt required');
      if (!Array.isArray(x.outcomes)) err(f, 'outcomes required');
      mdxSafety(f, doc.content);
      if (!/^##\s/m.test(doc.content)) warn(f, 'body has no ## sections');
    }
  } else {
    if (!ISO.test(iso(d.date))) err(enF, 'date must be YYYY-MM-DD');
    if (typeof d.cover !== 'string' || !d.cover.startsWith('/images/')) err(enF, 'cover must start with /images/');
    if (es) for (const k of B_INV) if (es.data[k] !== undefined) err(esF, `ES must not declare invariant "${k}"`);
    for (const [f, doc] of [[enF, en], [esF, es]]) {
      if (!doc) continue;
      const x = doc.data;
      if (typeof x.title !== 'string') err(f, 'title required');
      if (typeof x.description !== 'string') err(f, 'description required'); else if (x.description.length < 80 || x.description.length > 230) err(f, `description must be 80–230 chars (${x.description.length})`);
      if (!Array.isArray(x.takeaways)) warn(f, 'takeaways missing');
      if (!Array.isArray(x.faq)) warn(f, 'faq missing');
      mdxSafety(f, doc.content);
    }
  }
  if (es) englishy(esF, es.content);
}
console.log(`[validate-content] ${slugs.length} ${kind}: ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
