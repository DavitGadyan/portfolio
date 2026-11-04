import type { Localized } from '@/lib/content/types';
import type { IconId } from '@/data/materials';
import type { LogoId } from '@/data/skillLogos';

/** One card of a syntax map: the pattern, its syntax, when to reach for it, what it does and the trap people fall into. Code is language-neutral, so it is not localised. */
export interface CheatNode {
  id: string;
  /** Key into the track's `groups`. */
  group: string;
  icon: IconId;
  title: Localized<string>;
  /** 2–4 words under the title on the card. */
  short: Localized<string>;
  /** The syntax itself; shown as a code block at the top of the details panel. */
  syntax: string;
  when: Localized<string>;
  what: Localized<string>;
  /** What people get wrong in assessments. */
  gotcha: Localized<string>;
  /** A worked snippet. */
  example: string;
}

/** A multiple-choice question. By convention the FIRST option is the correct one; the quiz shuffles the options on screen. */
export interface Question {
  id: string;
  /** The map card the question practises; the review links back to it. */
  node: string;
  q: Localized<string>;
  /** Optional snippet shown under the question. */
  code?: string;
  options: Localized<string>[];
  why: Localized<string>;
}

export interface Track {
  id: string;
  logo: LogoId;
  name: string;
  tagline: Localized<string>;
  /** <title> and meta description of /materials/quizzes/<id>/. */
  title: Localized<string>;
  description: Localized<string>;
  groups: Record<string, Localized<string>>;
  /** Printed under the map. */
  sources: Localized<string>;
  nodes: CheatNode[];
  questions: Question[];
}

export const L = (en: string, es: string): Localized<string> => ({ en, es });
/** Code or a proper name: the same in both languages. */
export const C = (s: string): Localized<string> => ({ en: s, es: s });
/** Shorthand for a question; `options[0]` is the correct answer. */
export const Q = (id: string, node: string, q: Localized<string>, options: Localized<string>[], why: Localized<string>, code?: string): Question => ({ id, node, q, options, why, ...(code ? { code } : {}) });
