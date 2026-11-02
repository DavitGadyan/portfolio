import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { Reveal } from '@/components/ui/Reveal';
import { citationRates as d } from '@/data/materials/citation-rates';

/**
 * "How do LLMs rank content?": a real <table> (the format LLMs cite most) with a bar per row sized to the multiplier.
 * The bars grow and the numbers slide in when the section scrolls into view (Reveal sets data-inview; motion is CSS,
 * gated by scripting + reduced-motion, so no-JS and reduced-motion get the final state). On phones the rows stack via CSS;
 * the explicit ARIA roles keep the table semantics when the cells are display: block.
 */
export function CitationRates({ locale }: { locale: Locale }) {
  const max = Math.max(...d.rows.map((r) => r.rate));
  const fmt = (n: number) => `${n.toLocaleString(locale === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}×`;
  return (
    <Reveal as="section" group className="cr" aria-labelledby="cr-title">
      <h2 id="cr-title" className="cr__title">{d.heading[locale]}</h2>
      <p className="cr__intro">{d.intro[locale]}</p>
      <div className="cr__scroll">
        <table className="cr__table" role="table">
          <thead>
            <tr role="row"><th scope="col" role="columnheader">{d.columns.format[locale]}</th><th scope="col" role="columnheader">{d.columns.rate[locale]}</th><th scope="col" role="columnheader">{d.columns.bestFor[locale]}</th></tr>
          </thead>
          <tbody>
            {d.rows.map((r, i) => (
              <tr key={r.id} role="row" data-baseline={r.rate === 1 ? '' : undefined} style={{ '--i': i, '--w': r.rate / max } as CSSProperties}>
                <th scope="row" role="rowheader">{r.format[locale]}</th>
                <td className="cr__rate" role="cell">
                  <span className="cr__bar" aria-hidden="true"><span className="cr__fill" /></span>
                  <span className="cr__num">{fmt(r.rate)}{r.rate === 1 && <small> {d.baseline[locale]}</small>}</span>
                </td>
                <td role="cell">{r.bestFor[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cr__caption">{d.caption[locale]}</p>
    </Reveal>
  );
}
