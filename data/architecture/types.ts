import type { Localized } from '@/lib/content/types';
import type { ArchGroup } from '@/lib/content/architecture';

/**
 * A hand-written architecture flow for one project. Every label and note comes from that project's own case study
 * (content/en|es/projects/<slug>.mdx): no invented components, numbers or reasons. `tech` names the tools whose logos the
 * node shows (matched through lib/content/techLogos.ts). Nodes without `col` sit in the infrastructure or security lane.
 */
export interface FlowNode {
  id: string;
  group: ArchGroup;
  label: Localized<string>;
  notes: Localized<string[]>;
  tech?: string;
  col?: number;
  row?: number;
}
export interface Flow { nodes: FlowNode[]; edges: { from: string; to: string; label?: Localized<string> }[] }
