import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import type { ProjectStack } from '@/lib/content/types';
import { autoSpec, layoutArch } from '@/lib/content/architecture';
import { flowSpec } from '@/data/architecture';
import { ArchDiagram } from './ArchDiagram';

/** Server wrapper: picks the project's hand-written flow or builds one from its stack, lays it out at build time. */
export function Architecture({ slug, stack, locale }: { slug: string; stack: ProjectStack; locale: Locale }) {
  const m = getMessages(locale);
  const a = m.project.arch;
  const spec = flowSpec(slug, locale) ?? autoSpec(stack, a.user);
  if (spec.nodes.length < 2) return null;
  const layout = layoutArch(spec);
  const groups = { user: a.user, ...m.project.layers };
  return <ArchDiagram layout={layout} t={{ title: a.title, hint: a.hint, auto: a.auto, expand: a.expand, close: a.close, zoomIn: a.zoomIn, zoomOut: a.zoomOut, groups, roles: a.roles }} />;
}
