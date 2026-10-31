import { withBasePath } from '@/lib/site';

/**
 * Self-hosted MP4 in the same frame as the YouTube/Loom facades: no bytes until the visitor presses play (preload="none"),
 * poster shown until then. A visible caption is optional; without one the title is read to screen readers only.
 */
export function Video({ src, poster, title = 'Video', ratio = '16 / 9', caption }: { src: string; poster?: string; title?: string; ratio?: string; caption?: string }) {
  return (
    <figure className="vid">
      <div className="facade" style={{ aspectRatio: ratio }}>
        <video className="absolute inset-0 h-full w-full bg-ink-900" controls preload="none" playsInline poster={poster ? withBasePath(poster) : undefined} aria-label={title}>
          <source src={withBasePath(src)} type="video/mp4" />
        </video>
      </div>
      <figcaption className={caption ? 'vid__cap' : 'visually-hidden'}>{caption ?? title}</figcaption>
    </figure>
  );
}
