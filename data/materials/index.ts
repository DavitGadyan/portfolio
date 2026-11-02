import type { Material } from './types';
import { claude } from './claude';
import { aeo } from './aeo';
import { geo } from './geo';

export type { IconId, ImpactKind, Material, Technique } from './types';
/** Order = order of the strip on /materials/. Add OpenAI, AWS… here when their technique sets are ready. */
export const materials: Material[] = [claude, aeo, geo];
