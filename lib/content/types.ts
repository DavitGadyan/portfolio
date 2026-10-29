import type { Locale } from '@/lib/i18n/config';
export type { Locale };
export type Localized<T> = Record<Locale, T>;

export type CategoryId =
  | 'ai-agents'
  | 'fullstack-uiux'
  | 'ai-erp-saas'
  | 'data-science-ml'
  | 'computer-vision'
  | 'databases-data-eng'
  | 'cloud-devops-llmops'
  | 'security-compliance'
  | 'ai-marketing'
  | 'finance-quant';

export const CATEGORY_IDS: readonly CategoryId[] = [
  'ai-agents', 'fullstack-uiux', 'ai-erp-saas', 'data-science-ml', 'computer-vision',
  'databases-data-eng', 'cloud-devops-llmops', 'security-compliance', 'ai-marketing', 'finance-quant',
];

export const STACK_LAYERS = ['frontend', 'backend', 'ai', 'data', 'infra', 'security'] as const;
export type StackLayer = (typeof STACK_LAYERS)[number];
export type ProjectStack = Record<StackLayer, string[]>;

export interface ProjectLinks {
  live?: string;
  github?: string;
  video?: string[];
  archived?: { label: string; note: string }[];
}

/** Locale-invariant — declared in content/en only. */
export interface ProjectInvariant {
  date: string;        // YYYY-MM-DD
  lastmod?: string;    // YYYY-MM-DD
  client?: string;
  cover: string;       // '/images/portfolio/<file>'
  categories: CategoryId[]; // first = primary
  stack: ProjectStack;
  links: ProjectLinks;
  featured: boolean;
  order?: number;
  draft?: boolean;
}

/** Translatable — declared in both locales. */
export interface ProjectLocalized {
  title: string;
  summary: string;
  description: string;
  coverAlt: string;
  outcomes: string[];
  /** Measurable results: short label + value, e.g. { label: 'Underwriting time', value: 'days → minutes' }. */
  metrics?: { label: string; value: string }[];
  clientNote?: string;
}

export interface Project extends ProjectInvariant, ProjectLocalized {
  slug: string;
  locale: Locale;
  body: string;
  readingMinutes: number;
}

export interface FaqItem { q: string; a: string; keywords?: string[] }

export interface PostInvariant {
  date: string;
  lastmod: string;
  cover: string;
  tags: string[];
  articleSection: string;
  author: string;
  draft?: boolean;
  readingMinutes?: number;
}

export interface PostLocalized {
  title: string;
  description: string;
  summary: string;
  coverAlt: string;
  about: string[];
  takeaways: string[];
  faq: FaqItem[];
}

export interface Post extends PostInvariant, PostLocalized {
  slug: string;
  locale: Locale;
  body: string;
  readingMinutes: number;
}

export interface PolicyPage {
  slug: 'cookies' | 'privacy';
  locale: Locale;
  title: string;
  description: string;
  lastmod: string;
  body: string;
}

// data/*.ts shapes
export interface Category { id: CategoryId; label: Localized<string>; blurb: Localized<string>; order: number }
export interface Service {
  id: string;
  categoryId: CategoryId;
  title: Localized<string>;
  blurb: Localized<string>;
  icon: { kind: 'lucide'; name: 'BrainCircuit' | 'Workflow' | 'CodeXml' | 'PenTool' | 'Boxes' | 'ScanEye' | 'Database' | 'ServerCog' | 'ShieldCheck' | 'TrendingUp' };
}
export interface CapabilityStage { id: string; order: number; title: Localized<string>; short: Localized<string>; line: Localized<string>; categoryIds: CategoryId[]; skills: string[] }
export interface Skill { label: Localized<string>; pct: number }
export interface ExperienceItem { role: Localized<string>; org: string; period: string; line: Localized<string> }
export interface Testimonial { name: string; image: string; role: Localized<string>; quote: Localized<string>; translated: boolean }
export interface FunFact { label: Localized<string>; value: number; suffix?: string; icon: string }
