import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

/** Section heading with the 5px bar. The inner mask lets the text slide up into view once a surrounding Reveal (or the title itself, with `reveal`) is in view. */
export function SectionTitle({ children, align = 'left', light = false, size = 'md', as: Tag = 'h2', className = '', id, reveal = false }: {
  children: ReactNode; align?: 'left' | 'center'; light?: boolean; size?: 'md' | 'sm'; as?: 'h1' | 'h2' | 'h3'; className?: string; id?: string; reveal?: boolean;
}) {
  const cls = ['section-title', align === 'center' ? 'section-title--center' : '', light ? 'section-title--light' : '', size === 'sm' ? 'section-title--sm' : '', className].filter(Boolean).join(' ');
  const inner = <span className="section-title__mask"><span className="section-title__text">{children}</span></span>;
  return reveal ? <Reveal as={Tag} id={id} className={cls}>{inner}</Reveal> : <Tag id={id} className={cls}>{inner}</Tag>;
}
