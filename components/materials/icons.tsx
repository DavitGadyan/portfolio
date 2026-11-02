import { AtSign, BookOpenText, Bot, CalendarCheck, CalendarClock, ChartLine, ChartPie, ClipboardCheck, CodeXml, Coins, ExternalLink, Eye, FolderTree, Globe, Hash, Heading2, Image, KeyRound, Library, Link2, ListChecks, ListOrdered, ListTree, Medal, Megaphone, MessagesSquare, Network, Pilcrow, Quote, Repeat2, Route, Rows3, Search, Smartphone, Split, Table2, Tags, Target, ThumbsUp, TrendingDown, Waypoints, type LucideIcon } from 'lucide-react';
import type { IconId } from '@/data/materials';

/** One line icon per technique card (AEO, GEO, KPIs and SEO maps). Plain module: rendered by the server list and the client map alike. */
export const ICONS: Record<IconId, LucideIcon> = {
  heading: Heading2, paragraph: Pilcrow, rows: Rows3, book: BookOpenText, chat: MessagesSquare, ordered: ListOrdered, table: Table2, code: CodeXml, tags: Tags, tree: ListTree,
  clipboard: ClipboardCheck, at: AtSign, hash: Hash, quote: Quote, repeat: Repeat2, bot: Bot, calendar: CalendarClock, network: Network, megaphone: Megaphone, chart: ChartLine, checklist: ListChecks,
  eye: Eye, medal: Medal, thumbs: ThumbsUp, pie: ChartPie, link: Link2, route: Route, library: Library, globe: Globe, 'calendar-check': CalendarCheck, coins: Coins, 'trending-down': TrendingDown, split: Split,
  'folder-tree': FolderTree, key: KeyRound, image: Image, 'external-link': ExternalLink, sitemap: Waypoints, smartphone: Smartphone, search: Search, target: Target,
};

export function TechIcon({ id, size = 14 }: { id?: IconId; size?: number }) {
  if (!id) return null;
  const Icon = ICONS[id];
  return <span className="tg__icon" aria-hidden="true"><Icon size={size} strokeWidth={2} /></span>;
}
