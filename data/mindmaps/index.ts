import type { MindMap } from './types';
import { snowflake } from './snowflake';
import { databricks } from './databricks';

export type { MindMap, MindNode, NodeKind } from './types';
export { NODE_KINDS } from './types';
export const MINDMAPS_PATH = '/materials/mindmaps/';
export const mapPath = (id: string) => `${MINDMAPS_PATH}${id}/`;
/** Order = order of the tiles on /materials/mindmaps/. */
export const mindmaps: MindMap[] = [snowflake, databricks];
