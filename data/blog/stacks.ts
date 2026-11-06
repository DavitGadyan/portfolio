import { clouds, stacks } from './azure-stacks';
import { decisionFlows, llmRoutes } from './llm-stacks';
import type { StackDiagramData } from './stack-types';

export type { StackDiagramData, StackIcon, StackItem, StackLayer, StackVariant } from './stack-types';

/**
 * Interactive stack diagrams embedded in blog posts with `<Stacks id="…" caption="…" />` (components/content/Stacks.tsx renders the tabs and the
 * no-JS tables; components/content/StackDiagram.tsx is the client part). One data file per post, the shared types in ./stack-types.ts, the registry here.
 * Every string is bilingual (`L(en, es)`); product names stay as the vendors write them.
 */
export const stackDiagrams: Record<string, StackDiagramData> = { clouds, stacks, 'llm-routes': llmRoutes, 'decision-flows': decisionFlows };
