import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'content', 'diagrams');
const cache = new Map<string, string>();

function load(src: string): string {
  const name = path.basename(src); // never a path: the diagrams live in one folder
  const hit = cache.get(name);
  if (hit !== undefined) return hit;
  const file = path.join(DIR, name);
  if (!name.endsWith('.svg') || !fs.existsSync(file)) throw new Error(`[content] diagram not found: content/diagrams/${name}`);
  const svg = fs.readFileSync(file, 'utf8').replace(/^\s*<\?xml[^>]*>\s*/, '').trim();
  cache.set(name, svg);
  return svg;
}

/**
 * A hand-drawn SVG diagram from content/diagrams/, inlined at build time with its caption, for `<Figure src caption />` in
 * MDX posts: no JavaScript, selectable text, one file per locale (`name.en.svg`, `name.es.svg`). The SVG carries its own
 * role="img", aria-label and <title>; the caption is plain text.
 */
export function Figure({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="fig">
      <div className="fig__svg" dangerouslySetInnerHTML={{ __html: load(src) }} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
