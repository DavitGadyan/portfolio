import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { withBasePath } from '@/lib/site';
import { STACK_LAYERS, type ProjectStack } from '@/lib/content/types';
import { techLogos } from '@/lib/content/techLogos';

/** Stack by layer as bare icons, spaced out: a brand logo for every tool an entry names (the tool's name on hover), each logo once per project.
 * Entries without a known logo and the entry text stay in the markup for screen readers and search only. */
export function StackTable({ stack, locale }: { stack: ProjectStack; locale: Locale }) {
  const m = getMessages(locale);
  // every logo appears once per project: the first entry that names a tool (in layer order) keeps its mark
  const seen = new Set<string>();
  const marks: Record<string, ReturnType<typeof techLogos>> = {};
  for (const l of STACK_LAYERS) for (const s of stack[l] ?? []) {
    marks[`${l}|${s}`] = techLogos(s).filter((m) => !seen.has(m.src) && seen.add(m.src));
  }
  const rows = STACK_LAYERS.filter((l) => stack[l]?.some((s) => marks[`${l}|${s}`].length));
  if (!rows.length) return null;
  return (
    <dl className="m-0 space-y-4">
      {rows.map((l) => (
        <div key={l}>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{m.project.layers[l]}</dt>
          <dd className="m-0 mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-3">
            {stack[l].map((s) => {
              const own = marks[`${l}|${s}`];
              if (!own.length) return <span key={s} className="sr-only">{s}</span>;
              return (
                <span key={s} className="tchip">
                  <span className="tchip__marks">{own.map((logo) => (
                    <span key={logo.src} className="tchip__disc" data-tip={logo.label}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- tiny brand marks served from public/logos */}
                      <img src={withBasePath(logo.src)} alt={logo.label} width={22} height={22} decoding="async" loading="lazy" data-mono={logo.mono ? '' : undefined} />
                    </span>
                  ))}</span>
                  <span className="sr-only">{s}</span>
                </span>
              );
            })}
          </dd>
        </div>
      ))}
    </dl>
  );
}
