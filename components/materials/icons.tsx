import { Activity, AtSign, Bell, Blocks, BookOpenText, Bot, Boxes, Braces, Brackets, Brain, CalendarCheck, CalendarClock, ChartLine, ChartPie, ClipboardCheck, Cloud, CodeXml, Coins, Columns3, Component, Container, Copy, Cpu, Database, Download, Equal, ExternalLink, Eye, FileJson, FileSearch, FileText, FolderTree, Gauge, GitBranch, GitMerge, Globe, Group, Hash, Heading2, History, Hourglass, Image, KeyRound, Languages, Layers, LayoutDashboard, Library, Link2, ListChecks, ListOrdered, ListTree, Lock, Medal, Megaphone, Merge, MessagesSquare, Network, Orbit, Package, PanelsTopLeft, Pilcrow, Plug, Pointer, Quote, RefreshCw, Repeat2, Route, Rows3, Search, SearchCheck, Server, Share2, Shield, Sigma, Smartphone, Sparkles, Split, SquareFunction, Store, Table2, TableProperties, Tags, Target, Terminal, TextCursorInput, ThumbsUp, Timer, ToggleLeft, TrendingDown, Trophy, Users, Variable, Warehouse, Waypoints, Workflow, Zap, type LucideIcon } from 'lucide-react';
import type { IconId } from '@/data/materials';

/** One line icon per technique or cheatsheet card (AEO, GEO, KPIs and SEO maps; JavaScript, React and SQL quizzes). Plain module: rendered by the server list and the client map alike. */
export const ICONS: Record<IconId, LucideIcon> = {
  heading: Heading2, paragraph: Pilcrow, rows: Rows3, book: BookOpenText, chat: MessagesSquare, ordered: ListOrdered, table: Table2, code: CodeXml, tags: Tags, tree: ListTree,
  clipboard: ClipboardCheck, at: AtSign, hash: Hash, quote: Quote, repeat: Repeat2, bot: Bot, calendar: CalendarClock, network: Network, megaphone: Megaphone, chart: ChartLine, checklist: ListChecks,
  eye: Eye, medal: Medal, thumbs: ThumbsUp, pie: ChartPie, link: Link2, route: Route, library: Library, globe: Globe, 'calendar-check': CalendarCheck, coins: Coins, 'trending-down': TrendingDown, split: Split,
  'folder-tree': FolderTree, key: KeyRound, image: Image, 'external-link': ExternalLink, sitemap: Waypoints, smartphone: Smartphone, search: Search, target: Target,
  variable: Variable, equal: Equal, brackets: Brackets, braces: Braces, 'search-check': SearchCheck, shield: Shield, properties: TableProperties, boxes: Boxes, lock: Lock, hourglass: Hourglass, orbit: Orbit, workflow: Workflow,
  component: Component, toggle: ToggleLeft, copy: Copy, refresh: RefreshCw, server: Server, 'text-cursor': TextCursorInput, layers: Layers, gauge: Gauge, pointer: Pointer, blocks: Blocks, panels: PanelsTopLeft,
  sigma: Sigma, group: Group, columns: Columns3, 'git-merge': GitMerge, trophy: Trophy, 'file-json': FileJson, merge: Merge,
  warehouse: Warehouse, database: Database, cloud: Cloud, cpu: Cpu, sparkles: Sparkles, brain: Brain, 'file-text': FileText, terminal: Terminal, 'git-branch': GitBranch, share: Share2, bell: Bell, activity: Activity,
  history: History, languages: Languages, 'file-search': FileSearch, container: Container, store: Store, users: Users, zap: Zap, timer: Timer, package: Package, function: SquareFunction, plug: Plug, download: Download, layout: LayoutDashboard,
};

export function TechIcon({ id, size = 14 }: { id?: IconId; size?: number }) {
  if (!id) return null;
  const Icon = ICONS[id];
  return <span className="tg__icon" aria-hidden="true"><Icon size={size} strokeWidth={2} /></span>;
}
