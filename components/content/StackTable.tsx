import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { withBasePath } from '@/lib/site';
import { STACK_LAYERS, type ProjectStack } from '@/lib/content/types';
import { techLogos, monogram } from '@/lib/content/techLogos';

/** Stack by layer as round glass chips: a brand logo for every tool the entry names (its name on hover), a monogram otherwise. */
export function StackTable({ stack, locale }: { stack: ProjectStack; locale: Locale }) {
  const m = getMessages(locale);
  const rows = STACK_LAYERS.filter((l) => stack[l]?.length);
  if (!rows.length) return null;
  return (
    <dl className="m-0 space-y-4">
      {rows.map((l) => (
        <div key={l}>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{m.project.layers[l]}</dt>
          <dd className="m-0 mt-2 flex flex-wrap gap-2">
            {stack[l].map((s) => {
              const marks = techLogos(s);
              return (
                <span key={s} className="tchip">
                  {marks.length
                    ? <span className="tchip__marks">{marks.map((logo) => (
                        <span key={logo.src} className="tchip__disc" data-tip={logo.label} title={logo.label}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- tiny brand marks served from public/logos */}
                          <img src={withBasePath(logo.src)} alt={logo.label} width={22} height={22} decoding="async" loading="lazy" data-mono={logo.mono ? '' : undefined} />
                        </span>
                      ))}</span>
                    : <span className="tchip__disc" aria-hidden="true"><span>{monogram(s)}</span></span>}
                  {s}
                </span>
              );
            })}
          </dd>
        </div>
      ))}
    </dl>
  );
}
