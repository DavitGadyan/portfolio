import { AtSign, BookOpenText, Bot, CalendarClock, ChartLine, ClipboardCheck, CodeXml, Hash, Heading2, ListChecks, ListOrdered, ListTree, Megaphone, MessagesSquare, Network, Pilcrow, Quote, Repeat2, Rows3, Table2, Tags, type LucideIcon } from 'lucide-react';
import type { IconId } from '@/data/materials';

/** One line icon per technique card (AEO / GEO maps). Plain module: rendered by the server list and the client map alike. */
export const ICONS: Record<IconId, LucideIcon> = {
  heading: Heading2, paragraph: Pilcrow, rows: Rows3, book: BookOpenText, chat: MessagesSquare, ordered: ListOrdered, table: Table2, code: CodeXml, tags: Tags, tree: ListTree,
  clipboard: ClipboardCheck, at: AtSign, hash: Hash, quote: Quote, repeat: Repeat2, bot: Bot, calendar: CalendarClock, network: Network, megaphone: Megaphone, chart: ChartLine, checklist: ListChecks,
};

export function TechIcon({ id, size = 14 }: { id?: IconId; size?: number }) {
  if (!id) return null;
  const Icon = ICONS[id];
  return <span className="tg__icon" aria-hidden="true"><Icon size={size} strokeWidth={2} /></span>;
}
