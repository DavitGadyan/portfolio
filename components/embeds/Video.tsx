import { withBasePath } from '@/lib/site';

/** Self-hosted MP4 in the same frame as the YouTube/Loom facades: no bytes until the visitor presses play (preload="none"), poster shown until then. */
export function Video({ src, poster, title = 'Video', ratio = '16 / 9' }: { src: string; poster?: string; title?: string; ratio?: string }) {
  return (
    <figure className="facade my-8" style={{ aspectRatio: ratio }}>
      <video className="absolute inset-0 h-full w-full bg-ink-900" controls preload="none" playsInline poster={poster ? withBasePath(poster) : undefined} aria-label={title}>
        <source src={withBasePath(src)} type="video/mp4" />
      </video>
      <figcaption className="visually-hidden">{title}</figcaption>
    </figure>
  );
}
