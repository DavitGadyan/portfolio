import type { Localized } from '@/lib/content/types';
import type { LogoId } from '@/data/skillLogos';

export type TechniqueGroup = 'code' | 'api';

export interface Technique {
  id: string;
  /** Where it applies: the Claude Code workflow or the API/platform. */
  group: TechniqueGroup;
  title: Localized<string>;
  /** 2–4 words shown under the title on the card. */
  short: Localized<string>;
  when: Localized<string>;
  action: Localized<string>;
  why: Localized<string>;
  /** Typical saving. `official` = documented by the vendor; `estimate` = a third-party or experience-based range. */
  saving?: { label: Localized<string>; kind: 'official' | 'estimate' };
}

export interface Material {
  id: string;
  logo: LogoId;
  name: string;
  tagline: Localized<string>;
  /** <title> and meta description of the tool's own page (/materials/<id>/). */
  title: Localized<string>;
  description: Localized<string>;
  techniques: Technique[];
}
