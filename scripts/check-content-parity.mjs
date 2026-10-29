// Prebuild gate: every content/en/{projects,blog,pages}/*.mdx must have an ES sibling with the same filename.
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'content');
const kinds = ['projects', 'blog', 'pages'];
const mode = process.env.CONTENT_PARITY ?? 'strict'; // 'strict' | 'warn'
let problems = 0;
for (const kind of kinds) {
  const enDir = join(root, 'en', kind);
  const esDir = join(root, 'es', kind);
  if (!existsSync(enDir)) continue;
  const en = readdirSync(enDir).filter((f) => f.endsWith('.mdx'));
  const es = existsSync(esDir) ? new Set(readdirSync(esDir).filter((f) => f.endsWith('.mdx'))) : new Set();
  for (const f of en) if (!es.has(f)) { problems++; console[mode === 'strict' ? 'error' : 'warn'](`[content] missing content/es/${kind}/${f}`); }
  for (const f of es) if (!en.includes(f)) { problems++; console.error(`[content] orphan content/es/${kind}/${f} has no EN source`); }
}
if (problems && mode === 'strict') { console.error(`[content] ${problems} parity problem(s). Set CONTENT_PARITY=warn to build anyway.`); process.exit(1); }
console.log(`[content] parity ok${problems ? ` (${problems} warning(s))` : ''}`);
