'use client';

import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Activity, Bot, Box, Container, Cpu, Database, KeyRound, Layers, LayoutDashboard, Network, Search, Server, Shield, Warehouse, Workflow, Zap, type LucideIcon } from 'lucide-react';
import type { StackIcon } from '@/data/blog/azure-stacks';

export type StackMark = { src: string; alt: string; k: number };
export type StackView = {
  id: string;
  pick: string;
  hint: string;
  use: string;
  variants: { id: string; label: string; logo?: StackMark; summary: string; useCase: string; layers: { id: string; label: string; note: string; items: { name: string; logo?: StackMark; icon?: StackIcon }[] }[] }[];
};

const ICONS: Record<StackIcon, LucideIcon> = { bot: Bot, search: Search, workflow: Workflow, database: Database, warehouse: Warehouse, server: Server, container: Container, zap: Zap, network: Network, shield: Shield, key: KeyRound, activity: Activity, cpu: Cpu, layers: Layers, layout: LayoutDashboard };

function Mark({ logo, icon, size }: { logo?: StackMark; icon?: StackIcon; size: number }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos
    return <img src={logo.src} alt="" width={size} height={size} style={{ '--k': logo.k } as CSSProperties} />;
  }
  const Icon = ICONS[icon ?? 'box' as StackIcon] ?? Box;
  return <Icon size={size - 2} strokeWidth={2} aria-hidden="true" />;
}

/**
 * Interactive stack diagram for blog posts: one tab per cloud or reference stack, one bar per layer from the application down to the
 * infrastructure, tap a bar to read what that technology does in this stack. Local state only; the server wrapper (Stacks.tsx) renders
 * the same content as plain tables for readers without JavaScript.
 */
export function StackDiagram({ view }: { view: StackView }) {
  const uid = useId();
  const [vi, setVi] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const v = view.variants[vi];

  function pick(i: number) {
    setVi(i);
    setOpen(null);
    document.getElementById(`${uid}-t-${view.variants[i].id}`)?.focus();
  }
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const n = view.variants.length;
    const next = e.key === 'ArrowRight' ? (vi + 1) % n : e.key === 'ArrowLeft' ? (vi - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    pick(next);
  }

  return (
    <div className="stk" data-diagram={view.id}>
      <div className="stk__tabs" role="tablist" aria-label={view.pick} onKeyDown={onKey}>
        {view.variants.map((x, i) => (
          <button key={x.id} type="button" role="tab" id={`${uid}-t-${x.id}`} className="stk__tab" aria-selected={i === vi} aria-controls={`${uid}-p`} tabIndex={i === vi ? 0 : -1} onClick={() => pick(i)}>
            {x.logo && <Mark logo={x.logo} size={22} />}
            {x.label}
          </button>
        ))}
      </div>
      <div key={v.id} className="stk__panel" role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t-${v.id}`}>
        <p className="stk__sum">{v.summary}</p>
        <ol className="stk__layers">
          {v.layers.map((l) => {
            const isOpen = open === l.id;
            return (
              <li key={l.id} className="stk__row" data-layer={l.id} data-open={isOpen || undefined}>
                <button type="button" className="stk__layer" aria-expanded={isOpen} aria-controls={`${uid}-n-${l.id}`} onClick={() => setOpen(isOpen ? null : l.id)}>
                  <span className="stk__lname">{l.label}</span>
                  <span className="stk__items">
                    {l.items.map((it) => (
                      <span key={it.name} className="stk__chip"><Mark logo={it.logo} icon={it.icon} size={18} />{it.name}</span>
                    ))}
                  </span>
                </button>
                <div id={`${uid}-n-${l.id}`} className="stk__note" hidden={!isOpen}><p>{l.note}</p></div>
              </li>
            );
          })}
        </ol>
        <p className="stk__use"><strong>{view.use}:</strong> {v.useCase}</p>
        <p className="stk__hint">{view.hint}</p>
      </div>
    </div>
  );
}
