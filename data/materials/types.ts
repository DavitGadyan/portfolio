import type { Localized } from '@/lib/content/types';
import type { LogoId } from '@/data/skillLogos';

/** Small line icon on a technique card; the drawings are mapped in components/materials/icons.tsx. */
export type IconId =
  | 'heading' | 'paragraph' | 'rows' | 'book' | 'chat' | 'ordered' | 'table' | 'code' | 'tags' | 'tree'
  | 'clipboard' | 'at' | 'hash' | 'quote' | 'repeat' | 'bot' | 'calendar' | 'network' | 'megaphone' | 'chart' | 'checklist'
  | 'eye' | 'medal' | 'thumbs' | 'pie' | 'link' | 'route' | 'library' | 'globe' | 'calendar-check' | 'coins' | 'trending-down' | 'split'
  | 'folder-tree' | 'key' | 'image' | 'external-link' | 'sitemap' | 'smartphone' | 'search' | 'target'
  // code quizzes (data/quizzes/*)
  | 'variable' | 'equal' | 'brackets' | 'braces' | 'search-check' | 'shield' | 'properties' | 'boxes' | 'lock' | 'hourglass' | 'orbit' | 'workflow'
  | 'component' | 'toggle' | 'copy' | 'refresh' | 'server' | 'text-cursor' | 'layers' | 'gauge' | 'pointer' | 'blocks' | 'panels'
  | 'sigma' | 'group' | 'columns' | 'git-merge' | 'trophy' | 'file-json' | 'merge'
  // mind maps (data/mindmaps/*)
  | 'warehouse' | 'database' | 'cloud' | 'cpu' | 'sparkles' | 'brain' | 'file-text' | 'terminal' | 'git-branch' | 'share' | 'bell' | 'activity'
  | 'history' | 'languages' | 'file-search' | 'container' | 'store' | 'users' | 'zap' | 'timer' | 'package' | 'function' | 'plug' | 'download' | 'layout';

/** `official` = documented by the vendor; `study` = a published analysis; `estimate` = a third-party or experience-based range. */
export type ImpactKind = 'official' | 'estimate' | 'study';

export interface Technique {
  id: string;
  /** Key into the material's `groups` (the Claude Code workflow vs the API, a GEO layer…). */
  group: string;
  icon?: IconId;
  title: Localized<string>;
  /** 2–4 words shown under the title on the card. */
  short: Localized<string>;
  when: Localized<string>;
  action: Localized<string>;
  why: Localized<string>;
  /** A short concrete case: a before/after pair or a snippet; line breaks are kept when rendered. */
  example?: Localized<string>;
  /** The figure behind the technique (a saving, a citation multiplier…). */
  impact?: { label: Localized<string>; kind: ImpactKind };
}

/** A table shown under a map (a real <table>, the format LLMs cite most). A row with `bar` gets a bar in its second cell, sized relative to the largest `bar`. */
export interface TableBlock {
  id: string;
  heading: Localized<string>;
  intro: Localized<string>;
  columns: Localized<string>[];
  rows: { id: string; cells: Localized<string>[]; bar?: number; note?: Localized<string>; muted?: boolean }[];
  caption: Localized<string>;
}

export interface Material {
  id: string;
  logo: LogoId;
  name: string;
  tagline: Localized<string>;
  /** <title> and meta description of the map's own page (/materials/<id>/). */
  title: Localized<string>;
  description: Localized<string>;
  /** Group key → label shown above each technique. */
  groups: Record<string, Localized<string>>;
  /** Heading of the figure chip ("Typical saving", "Reported lift"). */
  impactLabel: Localized<string>;
  /** Where the figures come from; printed under the map. */
  sources: Localized<string>;
  techniques: Technique[];
  /** Tables shown under the map and its sources line. */
  tables?: TableBlock[];
}
