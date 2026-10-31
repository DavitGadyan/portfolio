import type { ReactNode } from 'react';
import { Video } from '@/components/embeds/Video';

/**
 * One app screen in a walkthrough: the phone recording beside its explanation (markdown children), stacked on phones
 * and side by side from the tablet breakpoint (see .screen). The video itself stays poster-only until played.
 */
export function Screen({ src, poster, title, ratio = '9 / 19.5', children }: { src: string; poster?: string; title: string; ratio?: string; children?: ReactNode }) {
  return (
    <section className="screen" aria-label={title}>
      <div className="screen__phone">
        <Video src={src} poster={poster} ratio={ratio} title={title} />
      </div>
      <div className="screen__body">{children}</div>
    </section>
  );
}
