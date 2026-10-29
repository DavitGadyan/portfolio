import Link from 'next/link';

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-ink-400">
      <ol className="flex flex-wrap items-center gap-2" role="list">
        {items.map((it, i) => (
          <li key={it.label + i} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className="hover:underline">{it.label}</Link> : <span aria-current="page" className="text-ink-700">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
