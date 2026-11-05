'use client';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Background, BackgroundVariant, Controls, Handle, MiniMap, Position, ReactFlow, ReactFlowProvider, useReactFlow, type Connection, type Edge, type EdgeChange, type Node, type NodeChange, type NodeProps, type XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { Check, Copy, Pencil, Plus, RotateCcw, X } from 'lucide-react';
import type { IconId } from '@/data/materials';
import { NODE_KINDS, type NodeKind } from '@/data/mindmaps/types';
import { childrenOf, layoutTree, pathTo, NODE_H, NODE_W, ROOT_H, ROOT_W, type Side } from '@/lib/mindmap/layout';
import { TechIcon } from './icons';

/** One concept, already localised; `logo` is a ready-to-use src. */
export type MindNodeView = { id: string; parent?: string; kind: NodeKind; icon?: IconId; logo?: string; logoScale?: number; title: string; short: string; what: string; useCase?: string; ai?: string; commands?: string[]; facts?: { text: string; at: string }[] };
export type MindMapView = { id: string; name: string; logo: string; scale: number; openAtStart: string[]; nodes: MindNodeView[] };
export type MindStrings = {
  label: string; hint: string; what: string; useCase: string; ai: string; commands: string; facts: string; source: string; close: string;
  edit: string; done: string; editHint: string; addNode: string; newNode: string; reset: string; copyJson: string; copied: string; copyFailed: string;
  fold: string; unfold: string; rename: string; legend: string; kinds: Record<NodeKind, string>;
};

const ROOT = '__root';
const KIND_COLOR: Record<NodeKind, string> = { concept: '#cfd3d8', feature: '#1faa55', data: '#4cc3ff', ai: '#ffd600', ml: '#c084fc', app: '#ff9f43', tool: '#35d0ba' };
const sub = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => (v[k] !== undefined ? String(v[k]) : `{${k}}`));
const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

type MindData = { view: MindNodeView; side: Side; depth: number; folded: boolean; descendants: number };
type RootData = { name: string; logo: string; scale: number };
type MindNode = Node<MindData, 'mind'>;
type RootNode = Node<RootData, 'root'>;
type AnyNode = MindNode | RootNode;

type Ctx = { edit: boolean; renaming: string | null; t: MindStrings; onFold: (id: string) => void; onRename: (id: string, title: string | null) => void };
const MindCtx = createContext<Ctx>({ edit: false, renaming: null, t: {} as MindStrings, onFold: () => {}, onRename: () => {} });

function MindCard({ id, data, selected }: NodeProps<MindNode>) {
  const { edit, renaming, t, onFold, onRename } = useContext(MindCtx);
  const { view, side, depth, folded, descendants } = data;
  const left = side === 'left';
  return (
    <div className="mm__card" data-kind={view.kind} data-depth={depth} data-selected={selected || undefined}>
      <Handle type="target" position={left ? Position.Right : Position.Left} className="mm__handle" isConnectable={edit} />
      {view.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos
        <img className="mm__logo" src={view.logo} alt="" width={24} height={24} style={{ '--k': view.logoScale ?? 1 } as CSSProperties} />
      ) : (
        <TechIcon id={view.icon} size={14} />
      )}
      <span className="mm__text">
        {renaming === id ? (
          <input
            className="mm__input nodrag nopan" defaultValue={view.title} aria-label={sub(t.rename, { title: view.title })} autoFocus
            onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') onRename(id, e.currentTarget.value); else if (e.key === 'Escape') onRename(id, null); }}
            onBlur={(e) => onRename(id, e.currentTarget.value)} onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="mm__title">{view.title}</span>
        )}
        {view.short && <span className="mm__short">{view.short}</span>}
      </span>
      {descendants > 0 && (
        <button
          type="button" className="mm__badge nodrag nopan" aria-expanded={!folded}
          aria-label={folded ? sub(t.unfold, { title: view.title, n: descendants }) : sub(t.fold, { title: view.title })}
          onClick={(e) => { e.stopPropagation(); onFold(id); }} onDoubleClick={(e) => e.stopPropagation()}
        >
          {folded ? descendants : '−'}
        </button>
      )}
      <Handle type="source" position={left ? Position.Left : Position.Right} className="mm__handle" isConnectable={edit} />
    </div>
  );
}

function RootCard({ data }: NodeProps<RootNode>) {
  const { edit } = useContext(MindCtx);
  return (
    <div className="mm__root">
      <Handle type="source" id="l" position={Position.Left} className="mm__handle" isConnectable={edit} />
      {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
      <img src={data.logo} alt="" width={72} height={72} style={{ '--k': data.scale } as CSSProperties} />
      <strong>{data.name}</strong>
      <Handle type="source" id="r" position={Position.Right} className="mm__handle" isConnectable={edit} />
    </div>
  );
}

const nodeTypes = { mind: MindCard, root: RootCard };

/** Everything with children starts folded except the branches the map names (and the way down to `reveal`), so the first view stays legible. */
function foldedAtStart(view: MindMapView, reveal = ''): Set<string> {
  const parents = new Set(view.nodes.flatMap((n) => (n.parent ? [n.parent] : [])));
  const keep = new Set([...view.openAtStart, ...(reveal ? pathTo(reveal, view.nodes).slice(0, -1) : [])]);
  return new Set([...parents].filter((id) => !keep.has(id)));
}
/** The card named by a `#c-<id>` fragment (the Materials search links this way); client-only component, so reading the URL here is safe. */
const hashAtLoad = () => (typeof window !== 'undefined' && window.location.hash.startsWith('#c-') ? window.location.hash.slice(3) : '');

type Size = { width: number; height: number };

/**
 * Controlled React Flow keeps a node's measured size only on the node object it is given, so the sizes reported through
 * `dimensions` changes are stored and handed back here; without them a rebuilt node is invisible until re-measured.
 */
function buildNodes(view: MindMapView, model: MindNodeView[], folded: Set<string>, pinned: Record<string, XYPosition>, measured: Record<string, Size>, selected: string | null): AnyNode[] {
  const byId = new Map(model.map((n) => [n.id, n]));
  const kids = childrenOf(model);
  const descendants = (id: string): number => (kids.get(id) ?? []).reduce((s, k) => s + 1 + descendants(k), 0);
  const root: RootNode = { id: ROOT, type: 'root', position: { x: -ROOT_W / 2, y: -ROOT_H / 2 }, data: { name: view.name, logo: view.logo, scale: view.scale }, draggable: false, selectable: false, deletable: false, focusable: false, initialWidth: ROOT_W, initialHeight: ROOT_H, measured: measured[ROOT] };
  const placed = layoutTree(model, folded).map<MindNode>((p) => ({
    id: p.id, type: 'mind', position: pinned[p.id] ?? { x: p.x, y: p.y }, hidden: p.hidden, selected: selected === p.id, initialWidth: NODE_W, initialHeight: NODE_H, measured: measured[p.id],
    sourcePosition: p.side === 'right' ? Position.Right : Position.Left, targetPosition: p.side === 'right' ? Position.Left : Position.Right,
    data: { view: byId.get(p.id)!, side: p.side, depth: p.depth, folded: folded.has(p.id), descendants: descendants(p.id) },
  }));
  return [root, ...placed];
}

function buildEdges(nodes: AnyNode[], lit: Set<string>, selEdge: string | null, edit: boolean): Edge[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out: Edge[] = [];
  for (const n of nodes) {
    if (n.type !== 'mind') continue;
    const parent = n.data.view.parent && byId.has(n.data.view.parent) ? n.data.view.parent : ROOT;
    const id = `e:${n.id}`;
    const on = lit.has(n.id);
    out.push({
      id, source: parent, target: n.id, sourceHandle: parent === ROOT ? (n.data.side === 'right' ? 'r' : 'l') : undefined,
      hidden: n.hidden, animated: on, className: on ? 'mm__edge mm__edge--lit' : 'mm__edge', selected: selEdge === id, selectable: edit, deletable: edit, focusable: edit,
      style: on ? ({ '--mm-c': KIND_COLOR[n.data.view.kind] } as CSSProperties) : undefined,
    });
  }
  return out;
}

function Flow({ view, t }: { view: MindMapView; t: MindStrings }) {
  const rf = useReactFlow<AnyNode, Edge>();
  const [fromHash] = useState(() => { const h = hashAtLoad(); return view.nodes.some((n) => n.id === h) ? h : null; });
  const [model, setModel] = useState<MindNodeView[]>(view.nodes);
  const [folded, setFolded] = useState(() => foldedAtStart(view, fromHash ?? ''));
  const [pinned, setPinned] = useState<Record<string, XYPosition>>({});
  const [measured, setMeasured] = useState<Record<string, Size>>({});
  const [selected, setSelected] = useState<string | null>(fromHash);
  const [selEdge, setSelEdge] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [fitKey, setFitKey] = useState(0);
  const counter = useRef(0);
  const timer = useRef(0);
  const panel = useRef<HTMLDivElement>(null);

  const nodes = useMemo(() => buildNodes(view, model, folded, pinned, measured, selected), [view, model, folded, pinned, measured, selected]);
  const lit = useMemo(() => new Set(selected ? pathTo(selected, model) : []), [selected, model]);
  const edges = useMemo(() => buildEdges(nodes, lit, selEdge, edit), [nodes, lit, selEdge, edit]);
  const active = selected ? model.find((n) => n.id === selected) : undefined;
  const branchOf = (n: MindNodeView | undefined): string => {
    const byId = new Map(model.map((x) => [x.id, x]));
    let cur = n;
    const seen = new Set<string>();
    while (cur?.parent && byId.has(cur.parent) && !seen.has(cur.id)) { seen.add(cur.id); cur = byId.get(cur.parent); }
    return cur && cur !== n ? cur.title : '';
  };

  useEffect(() => { if (fitKey) rf.fitView({ padding: 0.06, maxZoom: 1, duration: reduceMotion() ? 0 : 450 }); }, [fitKey, rf]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { if (fromHash) panel.current?.scrollIntoView({ block: 'center' }); }, [fromHash]); // arrived through a search result: show the details
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape' && !renaming) setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, renaming]);

  const toggleFold = (id: string) => {
    setFolded((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    if (selected && !folded.has(id) && pathTo(selected, model).includes(id) && selected !== id) setSelected(null); // the selected card is about to disappear
    setFitKey((k) => k + 1);
  };
  const rename = (id: string, title: string | null) => {
    setRenaming((cur) => (cur === id ? null : cur));
    const clean = title?.trim();
    if (clean) setModel((m) => m.map((n) => (n.id === id ? { ...n, title: clean } : n)));
  };
  const removeSubtree = (id: string) => {
    setModel((m) => {
      const kids = childrenOf(m);
      const gone = new Set<string>();
      const walk = (x: string) => { gone.add(x); for (const k of kids.get(x) ?? []) walk(k); };
      walk(id);
      return m.filter((n) => !gone.has(n.id));
    });
    setSelected((prev) => (prev === id ? null : prev));
  };
  const onNodesChange = (changes: NodeChange<AnyNode>[]) => {
    for (const c of changes) {
      if (c.type === 'position' && c.position) { const p = c.position; setPinned((prev) => ({ ...prev, [c.id]: p })); }
      else if (c.type === 'dimensions' && c.dimensions) { const d = c.dimensions; setMeasured((prev) => (prev[c.id]?.width === d.width && prev[c.id]?.height === d.height ? prev : { ...prev, [c.id]: { width: d.width, height: d.height } })); }
      else if (c.type === 'select') setSelected((prev) => (c.selected ? c.id : prev === c.id ? null : prev));
      else if (c.type === 'remove' && c.id !== ROOT) removeSubtree(c.id);
    }
  };
  const onEdgesChange = (changes: EdgeChange[]) => {
    for (const c of changes) {
      if (c.type === 'select') setSelEdge((prev) => (c.selected ? c.id : prev === c.id ? null : prev));
      else if (c.type === 'remove' && c.id === selEdge) { // only the edge the user picked: a deleted card takes its wires along by itself
        const child = c.id.slice(2);
        setModel((m) => m.map((n) => (n.id === child ? { ...n, parent: undefined } : n)));
        setSelEdge(null);
      }
    }
  };
  const onConnect = (c: Connection) => {
    if (!c.source || !c.target || c.target === ROOT) return;
    const target = c.target, source = c.source === ROOT ? undefined : c.source;
    setModel((m) => {
      if (source) { // never hang a card under its own descendant
        const byId = new Map(m.map((n) => [n.id, n]));
        const seen = new Set<string>();
        for (let cur = byId.get(source); cur && !seen.has(cur.id); cur = cur.parent ? byId.get(cur.parent) : undefined) { if (cur.id === target) return m; seen.add(cur.id); }
      }
      return m.map((n) => (n.id === target ? { ...n, parent: source } : n));
    });
    setPinned((p) => { const next = { ...p }; delete next[target]; return next; }); // snap into the new branch
  };
  const addNode = () => {
    counter.current += 1;
    const id = `new-${counter.current}`;
    const parent = active?.id;
    setModel((m) => [...m, { id, parent, kind: active?.kind ?? 'concept', title: t.newNode, short: '', what: '' }]);
    if (parent) setFolded((f) => { if (!f.has(parent)) return f; const next = new Set(f); next.delete(parent); return next; });
    setSelected(id);
    setRenaming(id);
  };
  const reset = () => { setModel(view.nodes); setFolded(foldedAtStart(view)); setPinned({}); setSelected(null); setSelEdge(null); setRenaming(null); setFitKey((k) => k + 1); };
  const copy = async () => {
    const out = { map: view.id, nodes: model.map((n) => ({ id: n.id, parent: n.parent ?? null, kind: n.kind, title: n.title })) };
    try { await navigator.clipboard.writeText(JSON.stringify(out, null, 2)); setStatus(t.copied); } catch { setStatus(t.copyFailed); }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(''), 2000);
  };
  const ctx: Ctx = { edit, renaming, t, onFold: toggleFold, onRename: rename };

  return (
    <div className="mm" data-edit={edit ? '' : undefined} role="group" aria-label={sub(t.label, { tool: view.name })}>
      <div className="mm__bar">
        <button type="button" className="mm__btn" aria-pressed={edit} onClick={() => { setEdit((e) => !e); setRenaming(null); setSelEdge(null); }}>
          {edit ? <Check size={14} aria-hidden="true" /> : <Pencil size={14} aria-hidden="true" />}{edit ? t.done : t.edit}
        </button>
        {edit && (
          <>
            <button type="button" className="mm__btn" onClick={addNode}><Plus size={14} aria-hidden="true" />{t.addNode}</button>
            <button type="button" className="mm__btn" onClick={reset}><RotateCcw size={14} aria-hidden="true" />{t.reset}</button>
            <button type="button" className="mm__btn" onClick={copy}><Copy size={14} aria-hidden="true" />{t.copyJson}</button>
          </>
        )}
        <span className="mm__status" role="status">{status}</span>
        {edit && <p className="mm__edithint">{t.editHint}</p>}
      </div>
      <div className="tg__layout">
        <div className="mm__stage">
          <MindCtx.Provider value={ctx}>
            <ReactFlow<AnyNode, Edge>
              nodes={nodes} edges={edges} nodeTypes={nodeTypes} colorMode="dark"
              onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
              onNodeClick={() => { // phones: the panel sits under the stage, bring it up; never while editing, a scroll between two clicks breaks the double-click
                if (!edit && matchMedia('(max-width: 63.99rem)').matches) panel.current?.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
              }}
              onNodeDoubleClick={(_, n) => { if (edit && n.type === 'mind') setRenaming(n.id); }}
              fitView fitViewOptions={{ padding: 0.06, maxZoom: 1 }} minZoom={0.15} maxZoom={1.75}
              nodesDraggable={edit} nodesConnectable={edit} elementsSelectable edgesFocusable={edit} edgesReconnectable={false}
              deleteKeyCode={edit ? ['Delete', 'Backspace'] : null} multiSelectionKeyCode={null} selectionOnDrag={false} zoomOnDoubleClick={!edit}
            >
              <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="rgba(255,255,255,.14)" />
              <Controls showInteractive={false} position="bottom-right" />
              <MiniMap pannable zoomable position="top-right" style={{ width: 150, height: 100 }} bgColor="#141416" maskColor="rgba(0,0,0,.55)" nodeColor={(n) => (n.type === 'mind' ? KIND_COLOR[(n.data as MindData).view.kind] : '#ffffff')} />
            </ReactFlow>
          </MindCtx.Provider>
        </div>
        <div ref={panel} id="tg-panel" className="tg__panel" role="region" aria-live="polite" aria-labelledby="tg-panel-title" data-state={active ? 'open' : 'empty'}>
          {active ? (
            <>
              <p className="tg__group">{branchOf(active) || t.kinds[active.kind]}</p>
              <h3 id="tg-panel-title" className="tg__ptitle">
                {active.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos
                  <img className="mm__plogo" src={active.logo} alt="" width={20} height={20} style={{ '--k': active.logoScale ?? 1 } as CSSProperties} />
                ) : (
                  <TechIcon id={active.icon} size={16} />
                )}
                {active.title}
              </h3>
              {active.short && <p className="tg__psub">{active.short}</p>}
              <dl className="tg__dl">
                {active.what && <><dt>{t.what}</dt><dd>{active.what}</dd></>}
                {active.useCase && <><dt>{t.useCase}</dt><dd>{active.useCase}</dd></>}
                {active.ai && <><dt>{t.ai}</dt><dd className="mm__ai">{active.ai}</dd></>}
                {!!active.commands?.length && <><dt>{t.commands}</dt><dd><pre className="tg__code"><code>{active.commands.join('\n')}</code></pre></dd></>}
                {!!active.facts?.length && (
                  <><dt>{t.facts}</dt><dd><ul className="mm__facts">{active.facts.map((f, i) => <li key={i}>{f.text}<small>{t.source}: {f.at}</small></li>)}</ul></dd></>
                )}
              </dl>
              <button type="button" className="tg__close" aria-label={t.close} onClick={() => setSelected(null)}><X size={18} aria-hidden="true" /></button>
            </>
          ) : (
            <p id="tg-panel-title" className="tg__hint">{t.hint}</p>
          )}
        </div>
      </div>
      <ul className="mm__legend" aria-label={t.legend}>
        {NODE_KINDS.map((k) => <li key={k} data-kind={k}><i aria-hidden="true" />{t.kinds[k]}</li>)}
      </ul>
    </div>
  );
}

/**
 * Mind map on a React Flow canvas: the map's logo in the middle, branches alternating right and left, every subtree
 * stacked beside its parent (lib/mindmap/layout.ts). Click a card for its details, the badge folds a branch, the edges on
 * the way to the selected card light up. Edit mode lets the visitor drag, rename, connect, add and delete; the state
 * lives in this component only and "Copy JSON" hands it back. Loaded client-side only (components/materials/MindMapLab.tsx);
 * the page renders the same content as a nested list for crawlers and no-JS visitors.
 */
export default function MindMapFlow(props: { view: MindMapView; t: MindStrings }) {
  return <ReactFlowProvider><Flow {...props} /></ReactFlowProvider>;
}
