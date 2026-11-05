/**
 * Mind-map layout: the root in the middle, branches alternating right and left, every subtree stacked vertically next
 * to its parent, so nothing overlaps by construction. Pure and deterministic; the component calls it again whenever a
 * branch is folded or unfolded. Positions are React Flow coordinates (top-left corner of each node).
 */
export const NODE_W = 196;
export const NODE_H = 56;
export const ROOT_W = 180;
export const ROOT_H = 180;
const GAP_Y = 10;
const COL = NODE_W + 72; // horizontal distance between depths
const ROOT_GAP = ROOT_W / 2 + 90; // from the centre of the root to the near edge of a branch

export type Side = 'left' | 'right';
export interface TreeNode { id: string; parent?: string }
export interface Placed { id: string; x: number; y: number; side: Side; depth: number; hidden: boolean; children: number }

/** Tree from a node list: branches (no parent) in input order, children in input order. Unknown parents are treated as branches. */
export function childrenOf(nodes: TreeNode[]): Map<string | undefined, string[]> {
  const ids = new Set(nodes.map((n) => n.id));
  const map = new Map<string | undefined, string[]>();
  for (const n of nodes) {
    const key = n.parent && ids.has(n.parent) ? n.parent : undefined;
    const list = map.get(key) ?? [];
    list.push(n.id);
    map.set(key, list);
  }
  return map;
}

/** Height of a subtree whose folded nodes count as a single card. */
function height(id: string, kids: Map<string | undefined, string[]>, folded: Set<string>): number {
  const c = kids.get(id) ?? [];
  if (!c.length || folded.has(id)) return NODE_H;
  return c.reduce((sum, k) => sum + height(k, kids, folded), 0) + GAP_Y * (c.length - 1);
}

export function layoutTree(nodes: TreeNode[], folded: Set<string>): Placed[] {
  const kids = childrenOf(nodes);
  const branches = kids.get(undefined) ?? [];
  const out: Placed[] = [];
  const place = (id: string, side: Side, depth: number, top: number, hidden: boolean) => {
    const h = hidden ? NODE_H : height(id, kids, folded);
    const c = kids.get(id) ?? [];
    const x = side === 'right' ? ROOT_GAP + (depth - 1) * COL : -ROOT_GAP - (depth - 1) * COL - NODE_W;
    out.push({ id, x, y: top + h / 2 - NODE_H / 2, side, depth, hidden, children: c.length });
    const hideKids = hidden || folded.has(id);
    let y = top;
    for (const k of c) { place(k, side, depth + 1, y, hideKids); y += hideKids ? 0 : height(k, kids, folded) + GAP_Y; }
  };
  // alternate sides; odd counts put the extra branch on the right
  for (const side of ['right', 'left'] as Side[]) {
    const mine = branches.filter((_, i) => (side === 'right' ? i % 2 === 0 : i % 2 === 1));
    const total = mine.reduce((s, b) => s + height(b, kids, folded), 0) + GAP_Y * Math.max(0, mine.length - 1);
    let y = -total / 2;
    for (const b of mine) { place(b, side, 1, y, false); y += height(b, kids, folded) + GAP_Y; }
  }
  return out;
}

/** The ids on the way from the root to `id` (excluding the root), for lighting the path of the selected node. */
export function pathTo(id: string, nodes: TreeNode[]): string[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out: string[] = [];
  let cur: TreeNode | undefined = byId.get(id);
  const seen = new Set<string>();
  while (cur && !seen.has(cur.id)) { seen.add(cur.id); out.unshift(cur.id); cur = cur.parent ? byId.get(cur.parent) : undefined; }
  return out;
}
