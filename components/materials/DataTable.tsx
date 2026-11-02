import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { Reveal } from '@/components/ui/Reveal';
import type { TableBlock } from '@/data/materials';

/**
 * A table under a map: a real <table> (the format LLMs cite most). Rows with `bar` get a bar in their second cell sized
 * to the largest value; the bars grow and the numbers slide in when the section scrolls into view (Reveal sets
 * data-inview; motion is CSS, gated by scripting + reduced-motion, so no-JS and reduced-motion get the final state).
 * On phones the rows stack via CSS; the explicit ARIA roles keep the table semantics when the cells are display: block.
 */
export function DataTable({ block: b, locale }: { block: TableBlock; locale: Locale }) {
  const max = Math.max(1e-9, ...b.rows.map((r) => r.bar ?? 0));
  const tid = `cr-${b.id}`;
  return (
    <Reveal as="section" group className="cr" aria-labelledby={tid}>
      <h2 id={tid} className="cr__title">{b.heading[locale]}</h2>
      <p className="cr__intro">{b.intro[locale]}</p>
      <div className="cr__scroll">
        <table className="cr__table" role="table" data-cols={b.columns.length}>
          <thead>
            <tr role="row">{b.columns.map((c, i) => <th key={i} scope="col" role="columnheader">{c[locale]}</th>)}</tr>
          </thead>
          <tbody>
            {b.rows.map((r, i) => (
              <tr key={r.id} role="row" data-baseline={r.muted ? '' : undefined} style={{ '--i': i, '--w': r.bar !== undefined ? r.bar / max : 1 } as CSSProperties}>
                {r.cells.map((c, j) => j === 0
                  ? <th key={j} scope="row" role="rowheader">{c[locale]}</th>
                  : j === 1 && r.bar !== undefined
                    ? <td key={j} className="cr__rate" role="cell"><span className="cr__bar" aria-hidden="true"><span className="cr__fill" /></span><span className="cr__num">{c[locale]}{r.note && <small> {r.note[locale]}</small>}</span></td>
                    : <td key={j} role="cell">{c[locale]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cr__caption">{b.caption[locale]}</p>
    </Reveal>
  );
}
