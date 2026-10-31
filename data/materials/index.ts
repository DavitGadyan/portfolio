import type { Material } from './types';
import { claude } from './claude';

export type { Material, Technique, TechniqueGroup } from './types';
/** Order = order of the tool strip on /materials/. Add OpenAI, AWS… here when their technique sets are ready. */
export const materials: Material[] = [claude];
