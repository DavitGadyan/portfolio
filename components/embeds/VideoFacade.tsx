import { FacadeButton } from './FacadeButton';

/** Click-to-load YouTube/Loom embed: no third-party bytes until the visitor presses play. */
export function VideoFacade({ provider, id, title = 'Video', playLabel = 'Play video' }: { provider: 'youtube' | 'loom'; id: string; title?: string; playLabel?: string }) {
  const embedSrc = provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    : `https://www.loom.com/embed/${id}?autoplay=1&hide_owner=true&hide_share=true&hide_title=true`;
  return (
    <figure className="facade my-8">
      <FacadeButton embedSrc={embedSrc} label={`${playLabel}: ${title}`} provider={provider}>
        {provider === 'youtube' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-700 to-ink-900 text-sm uppercase tracking-[0.2em] text-ink-300">Loom</span>
        )}
      </FacadeButton>
      <figcaption className="visually-hidden">{title}</figcaption>
    </figure>
  );
}
