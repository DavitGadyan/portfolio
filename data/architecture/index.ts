import type { Locale } from '@/lib/i18n/config';
import type { ArchSpec } from '@/lib/content/architecture';
import type { Flow } from './types';
import { flow as virgil } from './virgil-ai-health-insurance-agent';
import { flow as auditpro } from './auditpro-ifrs-audit-review-llm';
import { flow as improvtalk } from './ai-video-ads-improvtalk';
import { flow as yolo26 } from './computer-vision-yolo26-demos';
import { flow as cryptoBots } from './crypto-trading-bot-python';
import { flow as jev } from './jev-alphatrading-decision-models';
import { flow as nexuscall } from './nexuscall-ai-voice-call-center-crm';

/** slug → hand-written flow; projects without one get the diagram built from their stack (lib/content/architecture.ts). */
export const flows: Record<string, Flow> = {
  'virgil-ai-health-insurance-agent': virgil, 'auditpro-ifrs-audit-review-llm': auditpro, 'ai-video-ads-improvtalk': improvtalk,
  'computer-vision-yolo26-demos': yolo26, 'crypto-trading-bot-python': cryptoBots, 'jev-alphatrading-decision-models': jev,
  'nexuscall-ai-voice-call-center-crm': nexuscall,
};

export function flowSpec(slug: string, locale: Locale): ArchSpec | null {
  const f = flows[slug];
  if (!f) return null;
  return {
    kind: 'flow',
    nodes: f.nodes.map((n) => ({ id: n.id, group: n.group, label: n.label[locale], notes: n.notes[locale], text: n.tech ?? n.label.en, col: n.col, row: n.row })),
    edges: f.edges.map((e) => ({ from: e.from, to: e.to, label: e.label?.[locale] })),
  };
}
