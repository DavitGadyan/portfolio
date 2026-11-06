import type { Localized } from '@/lib/content/types';
import type { LogoId } from '@/data/skillLogos';

/** Shapes shared by the stack-diagram data files (azure-stacks.ts, llm-stacks.ts); the registry lives in ./stacks.ts. No runtime imports here, so the data files never form a cycle. */
export type StackIcon = 'bot' | 'search' | 'workflow' | 'database' | 'warehouse' | 'server' | 'container' | 'zap' | 'network' | 'shield' | 'key' | 'activity' | 'cpu' | 'layers' | 'layout'
  | 'user' | 'inbox' | 'check' | 'gauge' | 'scale' | 'file' | 'branch' | 'brain' | 'eye' | 'wrench';
export interface StackItem { name: string; logo?: LogoId; icon?: StackIcon }
export interface StackLayer { id: string; label: Localized<string>; items: StackItem[]; note: Localized<string> }
export interface StackVariant { id: string; label: string; logo?: LogoId; summary: Localized<string>; useCase: Localized<string>; layers: StackLayer[] }
export interface StackDiagramData { id: string; title: Localized<string>; variants: StackVariant[] }

export const L = (en: string, es: string): Localized<string> => ({ en, es });
