import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { pagePath } from '@/lib/locale-path';
import { categoryById } from '@/data/categories';
import { fmtDuration, isoDuration, videoPath, type Video } from '@/data/videos';
import { Img } from '@/components/ui/Img';
import { Reveal } from '@/components/ui/Reveal';

export function PlayIcon({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>;
}

/** One video of /materials/videos/: a still frame with a play badge, the title and the areas it introduces. */
export function VideoCard({ v, locale, priority = false }: { v: Video; locale: Locale; priority?: boolean }) {
  return (
    <Link href={pagePath(locale, videoPath(v.id))} className="vcard">
      <span className="vcard__media">
        <Img src={v.poster} alt="" width={1024} height={576} sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw" priority={priority} loading={priority ? undefined : 'lazy'} />
        <span className="vcard__play" aria-hidden="true"><span><PlayIcon /></span></span>
        <time className="vcard__time" dateTime={isoDuration(v.duration)}>{fmtDuration(v.duration)}</time>
      </span>
      <span className="vcard__body">
        <strong>{v.title[locale]}</strong>
        <small>{v.categories.map((c) => categoryById[c].label[locale]).join(' · ')}</small>
      </span>
    </Link>
  );
}

/** The grid of cards; `current` leaves out the video of the page it sits on. */
export function VideoGrid({ videos, locale, current }: { videos: Video[]; locale: Locale; current?: string }) {
  return (
    <ul className="vcards" role="list">
      {videos.filter((v) => v.id !== current).map((v, i) => (
        <Reveal as="li" key={v.id} delay={(i % 3) * 80}><VideoCard v={v} locale={locale} priority={!current && i === 0} /></Reveal>
      ))}
    </ul>
  );
}
