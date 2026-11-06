import { stackDiagrams } from '@/data/blog/azure-stacks';
import { logoScale, logoSrc, logos, type LogoId } from '@/data/skillLogos';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { withBasePath } from '@/lib/site';
import { StackDiagram, type StackMark, type StackView } from './StackDiagram';

/**
 * `<Stacks id="clouds" caption="…" />` in an MDX post: the interactive stack diagram (StackDiagram.tsx, client) plus the same content as
 * one plain table per stack for readers without JavaScript; CSS shows one or the other (`.stk` / `.stk-nojs` in globals.css).
 */
export function Stacks({ id, caption, locale }: { id: string; caption?: string; locale: Locale }) {
  const d = stackDiagrams[id];
  if (!d) throw new Error(`[content] stack diagram not found: ${id} (data/blog/azure-stacks.ts)`);
  const m = getMessages(locale);
  const mark = (l?: LogoId): StackMark | undefined => (l ? { src: withBasePath(logoSrc(l)), alt: logos[l][1], k: logoScale(l) } : undefined);
  const view: StackView = {
    id: d.id,
    pick: m.blog.stackPick,
    hint: m.blog.stackHint,
    use: m.blog.stackUse,
    variants: d.variants.map((v) => ({
      id: v.id,
      label: v.label,
      logo: mark(v.logo),
      summary: v.summary[locale],
      useCase: v.useCase[locale],
      layers: v.layers.map((l) => ({ id: l.id, label: l.label[locale], note: l.note[locale], items: l.items.map((it) => ({ name: it.name, logo: mark(it.logo), icon: it.icon })) })),
    })),
  };
  return (
    <figure className="fig fig--stacks">
      <StackDiagram view={view} />
      <div className="stk-nojs">
        {d.variants.map((v) => (
          <table key={v.id}>
            <caption>{v.label}. {v.summary[locale]} {m.blog.stackUse}: {v.useCase[locale]}</caption>
            <thead><tr><th scope="col">{m.blog.stackLayer}</th><th scope="col">{m.blog.stackTech}</th><th scope="col">{m.blog.stackRole}</th></tr></thead>
            <tbody>
              {v.layers.map((l) => (
                <tr key={l.id}><th scope="row">{l.label[locale]}</th><td>{l.items.map((it) => it.name).join(', ')}</td><td>{l.note[locale]}</td></tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
