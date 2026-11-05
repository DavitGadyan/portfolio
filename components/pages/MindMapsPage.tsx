import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbNode, personNode, webPageNode, websiteNode } from '@/lib/seo/jsonld';
import { homePath, pagePath } from '@/lib/locale-path';
import { absUrl, withBasePath } from '@/lib/site';
import { logoScale, logoSrc } from '@/data/skillLogos';
import { MINDMAPS_PATH, mapPath, mindmaps, type MindMap, type MindNode } from '@/data/mindmaps';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { TechIcon } from '@/components/materials/icons';
import { MindMapLab } from '@/components/materials/MindMapLab';
import type { MindMapView, MindStrings } from '@/components/materials/MindMapFlow';

const MATERIALS = '/materials/';
export const mapIds = mindmaps.map((m) => m.id);
export const getMindMap = (id: string) => mindmaps.find((m) => m.id === id);

// ---------------------------------------------------------------- the folder: one tile per map

export function mindmapsMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: MINDMAPS_PATH, title: m.meta.mindmapsTitle, description: m.meta.mindmapsDescription });
}

export function MindMapsPage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const bc = breadcrumbNode(locale, MINDMAPS_PATH, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: MATERIALS }, { name: m.mindmaps.heading, path: MINDMAPS_PATH }]);
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(),
    { ...webPageNode({ locale, path: MINDMAPS_PATH, name: m.meta.mindmapsTitle, description: m.meta.mindmapsDescription, type: 'CollectionPage', breadcrumbId: bc['@id'] }),
      mainEntity: { '@type': 'ItemList', itemListElement: mindmaps.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.title[locale], url: absUrl(pagePath(locale, mapPath(x.id))) })) } },
    bc] };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials, href: pagePath(locale, MATERIALS) }, { label: m.mindmaps.heading }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{m.mindmaps.heading}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{m.mindmaps.intro}</p>
          </div>
          <ul className="tg__tiles" role="list">
            {mindmaps.map((x) => (
              <li key={x.id}>
                <Link href={pagePath(locale, mapPath(x.id))} className="tg__tile" prefetch={false}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
                  <img src={withBasePath(logoSrc(x.logo))} alt="" width={56} height={56} style={{ '--k': logoScale(x.logo) } as CSSProperties} />
                  <strong>{x.name}</strong>
                  <p>{x.tagline[locale]}</p>
                  <small>{fmt(m.mindmaps.branches, { n: x.nodes.filter((n) => !n.parent).length })} · {fmt(m.mindmaps.concepts, { n: x.nodes.length })} · {m.mindmaps.openMap} →</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteFrame>
  );
}

// ---------------------------------------------------------------- one map: the nested list (no JS, crawlers), then the canvas

export function mindMapMetadata(locale: Locale, id: string): Metadata {
  const x = getMindMap(id);
  if (!x) return {};
  return buildMetadata({ locale, path: mapPath(id), title: x.title[locale], description: x.description[locale] });
}

function mapView(x: MindMap, locale: Locale): MindMapView {
  return {
    id: x.id, name: x.name, logo: withBasePath(logoSrc(x.logo)), scale: logoScale(x.logo), openAtStart: x.openAtStart,
    nodes: x.nodes.map((n) => ({
      id: n.id, kind: n.kind, title: n.title[locale], short: n.short[locale], what: n.what[locale],
      ...(n.parent ? { parent: n.parent } : {}), ...(n.icon ? { icon: n.icon } : {}), ...(n.logo ? { logo: withBasePath(logoSrc(n.logo)), logoScale: logoScale(n.logo) } : {}),
      ...(n.useCase ? { useCase: n.useCase[locale] } : {}), ...(n.ai ? { ai: n.ai[locale] } : {}), ...(n.commands ? { commands: n.commands } : {}),
      ...(n.facts ? { facts: n.facts.map((f) => ({ text: f.text[locale], at: f.at })) } : {}),
    })),
  };
}

function ListNode({ node, all, locale, s }: { node: MindNode; all: MindNode[]; locale: Locale; s: ReturnType<typeof getMessages>['mindmaps'] }) {
  const kids = all.filter((n) => n.parent === node.id);
  return (
    <li id={`c-${node.id}`}>
      <h3>
        {node.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos
          <img src={withBasePath(logoSrc(node.logo))} alt="" width={20} height={20} className="mm__plogo" style={{ '--k': logoScale(node.logo) } as CSSProperties} />
        ) : (
          <TechIcon id={node.icon} size={16} />
        )}
        {node.title[locale]}
      </h3>
      <p className="tglist__sub">{node.short[locale]}</p>
      <dl>
        <dt>{s.what}</dt><dd>{node.what[locale]}</dd>
        {node.useCase && <><dt>{s.useCase}</dt><dd>{node.useCase[locale]}</dd></>}
        {node.ai && <><dt>{s.ai}</dt><dd>{node.ai[locale]}</dd></>}
        {node.commands && <><dt>{s.commands}</dt><dd><pre className="tglist__code"><code>{node.commands.join('\n')}</code></pre></dd></>}
        {node.facts && <><dt>{s.facts}</dt><dd><ul className="mm__facts">{node.facts.map((f, i) => <li key={i}>{f.text[locale]}<small>{s.source}: {f.at}</small></li>)}</ul></dd></>}
      </dl>
      {kids.length > 0 && <ol role="list">{kids.map((k) => <ListNode key={k.id} node={k} all={all} locale={locale} s={s} />)}</ol>}
    </li>
  );
}

export function MindMapPage({ locale, id }: { locale: Locale; id: string }) {
  const m = getMessages(locale);
  const s = m.mindmaps;
  const x = getMindMap(id)!;
  const path = mapPath(x.id);
  const branches = x.nodes.filter((n) => !n.parent);
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: MATERIALS }, { name: s.heading, path: MINDMAPS_PATH }, { name: x.name, path }]);
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(),
    { ...webPageNode({ locale, path, name: x.title[locale], description: x.description[locale], breadcrumbId: bc['@id'] }),
      mainEntity: { '@type': 'ItemList', itemListElement: branches.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.title[locale] })) } },
    bc] };
  const t: MindStrings = {
    label: s.graphLabel, hint: s.hint, what: s.what, useCase: s.useCase, ai: s.ai, commands: s.commands, facts: s.facts, source: s.source, close: s.close,
    edit: s.edit, done: s.done, editHint: s.editHint, addNode: s.addNode, newNode: s.newNode, reset: s.reset, copyJson: s.copyJson, copied: s.copied, copyFailed: s.copyFailed,
    fold: s.fold, unfold: s.unfold, rename: s.rename, legend: s.legend,
    kinds: { concept: s.kindConcept, feature: s.kindFeature, data: s.kindData, ai: s.kindAi, ml: s.kindMl, app: s.kindApp, tool: s.kindTool },
  };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials, href: pagePath(locale, MATERIALS) }, { label: s.heading, href: pagePath(locale, MINDMAPS_PATH) }, { label: x.name }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{x.title[locale]}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{x.tagline[locale]}</p>
          </div>
          <ul className="tg__tools" role="list" aria-label={s.pick}>
            {mindmaps.map((y) => (
              <li key={y.id}>
                <Link href={pagePath(locale, mapPath(y.id))} className="tg__tool" aria-current={y.id === x.id ? 'page' : undefined} prefetch={false}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
                  <img src={withBasePath(logoSrc(y.logo))} alt="" width={32} height={32} style={{ '--k': logoScale(y.logo) } as CSSProperties} />
                  <span>{y.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="tgwrap tgwrap--mm">
            <ol className="tglist mmlist" role="list" aria-label={s.list}>
              {branches.map((b) => <ListNode key={b.id} node={b} all={x.nodes} locale={locale} s={s} />)}
            </ol>
            <MindMapLab view={mapView(x, locale)} t={t} />
          </div>
          <p className="tg__sources mx-auto max-w-3xl text-center">{x.sources[locale]}</p>
        </div>
      </section>
    </SiteFrame>
  );
}
