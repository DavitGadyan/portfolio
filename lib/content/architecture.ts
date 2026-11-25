import { STACK_LAYERS, type ProjectStack, type StackLayer } from '@/lib/content/types';
import { techLogos } from '@/lib/content/techLogos';
import { withBasePath } from '@/lib/site';

/**
 * Architecture diagrams for project pages. Two sources, one layout:
 * - auto: built from the project's own `stack` frontmatter (user → front end → back end → AI and data, infrastructure and
 *   security as lanes), so every project gets a diagram without a single invented fact;
 * - flow: a hand-written data flow in data/architecture/<slug>.ts, taken from that case study's own text.
 * The layout is computed here at build time twice: a horizontal pipeline for wide screens and stacked bands for phones.
 */

export type ArchGroup = StackLayer | 'user';

/** Input: one component. `col`/`row` place it in the horizontal pipeline; lanes (infra, security) have no col. */
export interface ArchNodeSpec { id: string; group: ArchGroup; label: string; notes: string[]; text?: string; col?: number; row?: number }
export interface ArchEdgeSpec { from: string; to: string; label?: string }
export interface ArchSpec { kind: 'auto' | 'flow'; nodes: ArchNodeSpec[]; edges: ArchEdgeSpec[] }

export type ArchMark = { src: string; label: string; mono: boolean };
type Pt = { x: number; y: number };
export interface ArchNode { id: string; group: ArchGroup; label: string; notes: string[]; marks: ArchMark[]; lane: boolean; h: Pt; v: Pt; band: number }
export interface ArchEdge { id: string; from: string; to: string; label?: string; h: string; lh: Pt }
/** Phone layout: one connector per pair of linked bands (node-to-node curves would cross behind the cards). */
export interface ArchLink { id: string; a: number; b: number; d: string }
export interface ArchLane { group: ArchGroup; h: Pt & { w: number; ht: number }; v: Pt & { w: number; ht: number } }
export interface ArchLayout { kind: ArchSpec['kind']; nodes: ArchNode[]; edges: ArchEdge[]; links: ArchLink[]; lanes: ArchLane[]; hw: number; hh: number; vw: number; vh: number }

/* geometry (CSS px at scale 1): node box, column and row pitch, padding; the phone layout puts two nodes per row */
export const NW = 176, NH = 60, VNW = 146;
const RP = 78, PAD = 20, LANE_GAP = 26, LANE_HEAD = 22, VPAD = 10, VGAP = 12, VRP = 72, VBAND_GAP = 30;

const LANES: ArchGroup[] = ['infra', 'security'];

/** "FastAPI audit API, asyncio agent pipeline" → label "FastAPI audit API", bullets for the rest. */
function split(item: string): { label: string; rest: string[] } {
  const lead = item.split(/[,(;]/, 1)[0].trim() || item.trim();
  const label = lead.length > 30 ? lead.slice(0, 30).replace(/\s+\S*$/, '') + '…' : lead;
  const tail = item.slice(lead.length).replace(/^[\s,;]+/, '').replace(/^\((.*)\)$/, '$1').trim();
  const rest = tail ? [lead.length > 30 ? item : tail] : lead.length > 30 ? [item] : [];
  return { label, rest };
}

/** The diagram a project gets when it has no hand-written flow: one node per stack entry. */
export function autoSpec(stack: ProjectStack, userLabel: string): ArchSpec {
  const nodes: ArchNodeSpec[] = [];
  const of = (g: StackLayer) => (stack[g] ?? []).map((item, i) => {
    const { label, rest } = split(item);
    return { id: `${g}-${i}`, group: g, label, notes: rest, text: item } as ArchNodeSpec;
  });
  const fe = of('frontend'), be = of('backend'), ai = of('ai'), data = of('data');
  const cols: ArchNodeSpec[][] = [];
  if (fe.length || be.length) {
    cols.push([{ id: 'user', group: 'user', label: userLabel, notes: [] }]);
    if (fe.length) cols.push(fe);
    if (be.length) cols.push(be);
    if (ai.length || data.length) cols.push([...ai, ...data]);
  } else {
    if (data.length) cols.push(data);
    if (ai.length) cols.push(ai);
  }
  cols.forEach((c, ci) => c.forEach((n, ri) => nodes.push({ ...n, col: ci, row: ri })));
  for (const g of LANES) nodes.push(...of(g as StackLayer));
  // consecutive columns: one-to-many fans out, many-to-one fans in, many-to-many goes through each side's first node
  const edges: ArchEdgeSpec[] = [];
  const seen = new Set<string>();
  const add = (a: string, b: string) => { const k = a + '>' + b; if (!seen.has(k)) { seen.add(k); edges.push({ from: a, to: b }); } };
  for (let i = 0; i + 1 < cols.length; i++) {
    const A = cols[i], B = cols[i + 1];
    if (A.length === 1) B.forEach((b) => add(A[0].id, b.id));
    else if (B.length === 1) A.forEach((a) => add(a.id, B[0].id));
    else { A.forEach((a) => add(a.id, B[0].id)); B.forEach((b) => add(A[0].id, b.id)); }
  }
  return { kind: 'auto', nodes, edges };
}

const hCurve = (a: Pt, b: Pt): string => {
  const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2;
  if (x2 <= x1) { // same column or backwards: loop around below
    const yb = Math.max(a.y, b.y) + NH + 18;
    return `M${x1 - NW / 2} ${a.y + NH} C${x1 - NW / 2} ${yb} ${x2 + NW / 2} ${yb} ${x2 + NW / 2} ${b.y + NH}`;
  }
  const dx = (x2 - x1) / 2;
  return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
};

const mid = (a: Pt, b: Pt, w: number): Pt => ({ x: (a.x + b.x + w) / 2, y: (a.y + b.y + NH) / 2 });

export function layoutArch(spec: ArchSpec): ArchLayout {
  const main = spec.nodes.filter((n) => n.col !== undefined);
  const laneNodes = spec.nodes.filter((n) => n.col === undefined);
  const ncols = main.length ? Math.max(...main.map((n) => n.col!)) + 1 : 0;
  const rowsIn = (c: number) => main.filter((n) => n.col === c);
  const maxRows = Math.max(1, ...Array.from({ length: ncols }, (_, c) => Math.max(...rowsIn(c).map((n) => n.row! + 1), 0)));
  // the gap between columns grows with the longest edge label (10.5 px bold text) so labels never sit on a card
  const longest = Math.max(0, ...spec.edges.map((e) => e.label?.length ?? 0));
  const CP = NW + Math.round(Math.max(60, Math.min(120, longest * 6.4 + 22)));
  const hw = Math.max(PAD * 2 + Math.max(ncols - 1, 0) * CP + NW, PAD * 2 + 2 * NW + 16);
  const h = new Map<string, Pt>(), v = new Map<string, Pt>();
  // horizontal: each column centred on the tallest one
  for (let c = 0; c < ncols; c++) {
    const col = rowsIn(c), span = Math.max(...col.map((n) => n.row! + 1));
    const off = ((maxRows - span) * RP) / 2;
    for (const n of col) h.set(n.id, { x: PAD + c * CP, y: PAD + off + n.row! * RP });
  }
  let hy = main.length ? PAD + maxRows * RP - (RP - NH) + LANE_GAP : PAD;
  const lanes: ArchLane[] = [];
  const perLane = Math.max(1, Math.floor((hw - PAD * 2 + 14) / (NW + 14)));
  const laneGroups = LANES.filter((g) => laneNodes.some((n) => n.group === g));
  const hLane: Record<string, Pt & { w: number; ht: number }> = {};
  for (const g of laneGroups) {
    const ns = laneNodes.filter((n) => n.group === g);
    const rows = Math.ceil(ns.length / perLane);
    const ht = LANE_HEAD + rows * (NH + 12) + 6;
    hLane[g] = { x: PAD - 10, y: hy, w: hw - PAD * 2 + 20, ht };
    ns.forEach((n, i) => {
      const r = Math.floor(i / perLane);
      h.set(n.id, { x: PAD + (i % perLane) * (NW + 14), y: hy + LANE_HEAD + r * (NH + 12) });
    });
    hy += ht + 12;
  }
  const hh = laneGroups.length ? hy - 12 + PAD : PAD + maxRows * RP - (RP - NH) + PAD;
  // phone: one band per column top to bottom, two nodes per row, lanes last
  const vw = VPAD * 2 + 2 * VNW + VGAP;
  let vy = VPAD;
  const bandOf = new Map<string, number>();
  const bands: { top: number; bottom: number }[] = [];
  const band = (ns: ArchNodeSpec[]) => {
    const top = vy;
    ns.forEach((n) => bandOf.set(n.id, bands.length));
    ns.forEach((n, i) => {
      const last = i === ns.length - 1 && ns.length % 2 === 1;
      v.set(n.id, { x: last ? (vw - VNW) / 2 : VPAD + (i % 2) * (VNW + VGAP), y: vy + Math.floor(i / 2) * VRP });
    });
    vy += Math.ceil(ns.length / 2) * VRP - (VRP - NH);
    bands.push({ top, bottom: vy });
  };
  for (let c = 0; c < ncols; c++) { band(rowsIn(c).sort((a, b) => a.row! - b.row!)); vy += VBAND_GAP; }
  const vLane: Record<string, Pt & { w: number; ht: number }> = {};
  for (const g of laneGroups) {
    const y0 = vy; vy += LANE_HEAD;
    band(laneNodes.filter((n) => n.group === g));
    vLane[g] = { x: 2, y: y0, w: vw - 4, ht: vy - y0 + 8 };
    vy += 20;
  }
  const vh = vy - (laneGroups.length ? 12 : VBAND_GAP) + VPAD;
  for (const g of laneGroups) lanes.push({ group: g, h: hLane[g], v: vLane[g] });

  const nodes: ArchNode[] = spec.nodes.map((n) => ({
    id: n.id, group: n.group, label: n.label, notes: n.notes, lane: n.col === undefined,
    marks: techLogos(n.text ?? n.label, 2).map((m) => ({ ...m, src: withBasePath(m.src) })),
    h: h.get(n.id)!, v: v.get(n.id)!, band: bandOf.get(n.id)!,
  }));
  const edges: ArchEdge[] = spec.edges.map((e, i) => ({
    id: `e${i}`, from: e.from, to: e.to, label: e.label,
    h: hCurve(h.get(e.from)!, h.get(e.to)!), lh: mid(h.get(e.from)!, h.get(e.to)!, NW),
  }));
  const pairs = new Set<string>();
  const links: ArchLink[] = [];
  for (const e of spec.edges) {
    const a = bandOf.get(e.from)!, b = bandOf.get(e.to)!;
    if (a === b || pairs.has(a + '>' + b)) continue;
    pairs.add(a + '>' + b);
    const [hi, lo] = a < b ? [bands[a], bands[b]] : [bands[b], bands[a]];
    const k = links.length, x = vw / 2 + (k % 2 ? 1 : -1) * Math.min(28, Math.floor(k / 2) * 14 + (k ? 14 : 0)) * (k ? 1 : 0);
    const d = a < b ? `M${x} ${hi.bottom + 2} L${x} ${lo.top - 2}` : `M${x} ${lo.top - 2} L${x} ${hi.bottom + 2}`;
    links.push({ id: `l${k}`, a, b, d });
  }
  return { kind: spec.kind, nodes, edges, links, lanes, hw, hh, vw, vh };
}

export const ARCH_GROUPS: ArchGroup[] = ['user', ...STACK_LAYERS];
