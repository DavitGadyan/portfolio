import type { Localized } from '@/lib/content/types';
import type { IconId } from '@/data/materials';
import type { LogoId } from '@/data/skillLogos';

/** Colour family of a node on the map (and of the legend chip): what kind of thing the concept is. */
export type NodeKind = 'concept' | 'feature' | 'data' | 'ai' | 'ml' | 'app' | 'tool';
export const NODE_KINDS: NodeKind[] = ['concept', 'feature', 'data', 'ai', 'ml', 'app', 'tool'];

/** One concept of a mind map. Branches have no `parent`; everything else hangs off another node. */
export interface MindNode {
  id: string;
  parent?: string;
  kind: NodeKind;
  /** Small line icon (components/materials/icons.tsx) or a brand mark (public/logos); a brand mark wins when both are set. */
  icon?: IconId;
  logo?: LogoId;
  title: Localized<string>;
  /** 2–4 words under the title. */
  short: Localized<string>;
  /** The definition, as the course gives it. */
  what: Localized<string>;
  /** When you reach for it. */
  useCase?: Localized<string>;
  /** The AI angle, only where the course states one. */
  ai?: Localized<string>;
  /** SQL, Python or CLI exactly as used in the course; not localised. */
  commands?: string[];
  /** Figures quoted in the course, each with the lesson it comes from. */
  facts?: { text: Localized<string>; at: string }[];
}

export interface MindMap {
  id: string;
  logo: LogoId;
  name: string;
  tagline: Localized<string>;
  /** <title> and meta description of /materials/mindmaps/<id>/. */
  title: Localized<string>;
  description: Localized<string>;
  /** Printed under the map. */
  sources: Localized<string>;
  /** Branches unfolded when the map opens; everything else starts folded so the first view stays legible. */
  openAtStart: string[];
  nodes: MindNode[];
}

export const L = (en: string, es: string): Localized<string> => ({ en, es });
/** A proper name or code: the same in both languages. */
export const C = (s: string): Localized<string> => ({ en: s, es: s });
