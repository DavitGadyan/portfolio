export type PageType = 'home' | 'portfolio' | 'project' | 'blog' | 'post' | 'page';

/** Analytics content group for a site path (with or without the /es prefix; basePath is never part of usePathname()). */
export function pageType(pathname: string): PageType {
  let p = pathname.replace(/\/+$/, '') || '/';
  p = p.replace(/^\/es(?=\/|$)/, '') || '/';
  if (p === '/') return 'home';
  if (p === '/portfolio') return 'portfolio';
  if (p.startsWith('/portfolio/')) return 'project';
  if (p === '/blog') return 'blog';
  if (p.startsWith('/blog/')) return 'post';
  return 'page';
}
