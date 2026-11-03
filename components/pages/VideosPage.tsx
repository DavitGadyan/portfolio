import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbNode, personNode, webPageNode, websiteNode } from '@/lib/seo/jsonld';
import { homePath, pagePath } from '@/lib/locale-path';
import { SITE_URL, absUrl } from '@/lib/site';
import { categoryById } from '@/data/categories';
import { VIDEOS_PATH, fmtDuration, isoDuration, loomEmbedUrl, loomShareUrl, shortLink, videoPath, videos, type Video } from '@/data/videos';
import { getProjects } from '@/lib/content/projects';
import type { Project } from '@/lib/content/types';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { VideoFacade } from '@/components/embeds/VideoFacade';
import { VideoGrid } from '@/components/materials/VideoCard';
import { ProjectCard } from '@/components/home/PortfolioGrid';

const MATERIALS = '/materials/';
export const videoIds = videos.map((v) => v.id);
export const getVideo = (id: string) => videos.find((v) => v.id === id);

// ---------------------------------------------------------------- the folder: one card per video

export function videosMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: VIDEOS_PATH, title: m.meta.videosTitle, description: m.meta.videosDescription });
}

export function VideosPage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const bc = breadcrumbNode(locale, VIDEOS_PATH, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: MATERIALS }, { name: m.videos.heading, path: VIDEOS_PATH }]);
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(),
    { ...webPageNode({ locale, path: VIDEOS_PATH, name: m.meta.videosTitle, description: m.meta.videosDescription, type: 'CollectionPage', breadcrumbId: bc['@id'] }),
      mainEntity: { '@type': 'ItemList', itemListElement: videos.map((v, i) => ({ '@type': 'ListItem', position: i + 1, name: v.title[locale], url: absUrl(pagePath(locale, videoPath(v.id))) })) } },
    bc] };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials, href: pagePath(locale, MATERIALS) }, { label: m.videos.heading }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{m.videos.heading}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{m.videos.intro}</p>
          </div>
          <VideoGrid videos={videos} locale={locale} />
        </div>
      </section>
    </SiteFrame>
  );
}

// ---------------------------------------------------------------- one video: player, the areas it introduces, projects, the other videos

export function videoMetadata(locale: Locale, id: string): Metadata {
  const v = getVideo(id);
  if (!v) return {};
  const m = getMessages(locale);
  return buildMetadata({ locale, path: videoPath(id), title: fmt(m.videos.pageTitle, { title: v.title[locale] }), description: v.description[locale], image: v.poster, imageAlt: v.title[locale] });
}

/** Projects of the video's areas: primary-category matches first, featured ones ahead, then newest. */
function relatedProjects(locale: Locale, v: Video, n = 3): Project[] {
  return getProjects(locale)
    .map((p) => ({ p, score: (v.categories.includes(p.categories[0]) ? 2 : 0) + p.categories.filter((c) => v.categories.includes(c)).length + (p.featured ? 1 : 0) }))
    .filter((x) => x.score > 1)
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, n)
    .map((x) => x.p);
}

export function VideoPage({ locale, id }: { locale: Locale; id: string }) {
  const m = getMessages(locale);
  const v = getVideo(id)!;
  const path = videoPath(v.id);
  const title = v.title[locale];
  const duration = fmtDuration(v.duration);
  const short = shortLink(v);
  const projects = relatedProjects(locale, v);
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: MATERIALS }, { name: m.videos.heading, path: VIDEOS_PATH }, { name: title, path }]);
  const page = webPageNode({ locale, path, name: title, description: v.description[locale], image: v.poster, breadcrumbId: bc['@id'] });
  const video = {
    '@type': 'VideoObject', '@id': `${page['@id']}#video`, name: title, description: v.description[locale], thumbnailUrl: [absUrl(v.poster)],
    uploadDate: v.uploadDate, duration: isoDuration(v.duration), embedUrl: loomEmbedUrl(v), url: loomShareUrl(v), author: { '@id': `${SITE_URL}/#person` }, publisher: { '@id': `${SITE_URL}/#person` },
  };
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(), { ...page, mainEntity: { '@id': video['@id'] }, video: { '@id': video['@id'] } }, video, bc] };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials, href: pagePath(locale, MATERIALS) }, { label: m.videos.heading, href: pagePath(locale, VIDEOS_PATH) }, { label: title }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{title}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{fmt(m.videos.lead, { duration })}</p>
          </div>
          <div className="vplayer">
            <VideoFacade provider="loom" id={v.loomId} title={title} playLabel={m.videos.play} poster={v.poster} priority />
            <p className="vmeta">
              <span><time dateTime={isoDuration(v.duration)}>{fmt(m.videos.minutes, { duration })}</time></span>
              <a href={loomShareUrl(v)} target="_blank" rel="noopener noreferrer">{m.videos.openLoom} ↗</a>
              {short && <span>{m.videos.shortLink}: <a href={`${SITE_URL}${short}/`}><code>{SITE_URL.replace(/^https?:\/\//, '')}{short}</code></a></span>}
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-5xl">
            <SectionTitle as="h2" align="center" size="sm">{m.videos.covers}</SectionTitle>
            <ul className="vcats" role="list">
              {v.categories.map((c) => (
                <li key={c}>
                  <Link href={pagePath(locale, `/portfolio/#f-${c}`)}><strong>{categoryById[c].label[locale]}</strong><p>{categoryById[c].blurb[locale]}</p></Link>
                </li>
              ))}
            </ul>
          </div>
          {projects.length > 0 && (
            <div className="mx-auto mt-14 max-w-5xl">
              <SectionTitle as="h2" align="center" size="sm">{m.videos.projects}</SectionTitle>
              <div className="vprojects">{projects.map((p) => <ProjectCard key={p.slug} p={p} locale={locale} />)}</div>
              <p className="mt-8 text-center"><Link href={pagePath(locale, '/portfolio/')} className="btn btn-outline-dark">{m.portfolio.seeMore}</Link></p>
            </div>
          )}
          <div className="mt-14">
            <SectionTitle as="h2" align="center" size="sm">{m.videos.more}</SectionTitle>
            <VideoGrid videos={videos} locale={locale} current={v.id} />
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
