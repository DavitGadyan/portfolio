import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbNode, personNode, webPageNode, websiteNode } from '@/lib/seo/jsonld';
import { homePath, pagePath } from '@/lib/locale-path';
import { withBasePath } from '@/lib/site';
import { materials, type Material } from '@/data/materials';
import { logoScale, logoSrc } from '@/data/skillLogos';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { TechniqueGraph, type ToolView } from '@/components/materials/TechniqueGraph';

const INDEX = '/materials/';
const toolPath = (id: string) => `${INDEX}${id}/`;
export const materialIds = materials.map((m) => m.id);
export const getMaterial = (id: string) => materials.find((m) => m.id === id);

// ---------------------------------------------------------------- index: one tile per tool

export function materialsMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: INDEX, title: m.meta.materialsTitle, description: m.meta.materialsDescription });
}

export function MaterialsPage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const bc = breadcrumbNode(locale, INDEX, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: INDEX }]);
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(),
    { ...webPageNode({ locale, path: INDEX, name: m.meta.materialsTitle, description: m.meta.materialsDescription, type: 'CollectionPage', breadcrumbId: bc['@id'] }),
      mainEntity: { '@type': 'ItemList', itemListElement: materials.map((mat, i) => ({ '@type': 'ListItem', position: i + 1, name: mat.title[locale], url: `${webPageNode({ locale, path: toolPath(mat.id), name: '', description: '' }).url}` })) } },
    bc] };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{m.sections.materials}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{m.materials.intro}</p>
          </div>
          <ul className="tg__tiles" role="list">
            {materials.map((mat) => (
              <li key={mat.id}>
                <Link href={pagePath(locale, toolPath(mat.id))} className="tg__tile">
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
                  <img src={withBasePath(logoSrc(mat.logo))} alt="" width={56} height={56} style={{ '--k': logoScale(mat.logo) } as React.CSSProperties} />
                  <strong>{mat.name}</strong>
                  <p>{mat.tagline[locale]}</p>
                  <small>{fmt(m.materials.count, { n: mat.techniques.length })} · {m.materials.open} →</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteFrame>
  );
}

// ---------------------------------------------------------------- one tool: the technique map

export function materialMetadata(locale: Locale, id: string): Metadata {
  const mat = getMaterial(id);
  if (!mat) return {};
  return buildMetadata({ locale, path: toolPath(id), title: mat.title[locale], description: mat.description[locale] });
}

function toolView(mat: Material, locale: Locale, groups: Record<string, string>): ToolView {
  return {
    id: mat.id, name: mat.name, logo: withBasePath(logoSrc(mat.logo)), scale: logoScale(mat.logo),
    techniques: mat.techniques.map((k) => ({
      id: k.id, group: groups[k.group], title: k.title[locale], sub: k.short[locale], when: k.when[locale], what: k.action[locale], why: k.why[locale],
      ...(k.saving ? { saving: k.saving.label[locale], savingKind: k.saving.kind } : {}),
    })),
  };
}

export function MaterialPage({ locale, id }: { locale: Locale; id: string }) {
  const m = getMessages(locale);
  const mat = getMaterial(id)!;
  const path = toolPath(mat.id);
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: INDEX }, { name: mat.name, path }]);
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(),
    { ...webPageNode({ locale, path, name: mat.title[locale], description: mat.description[locale], breadcrumbId: bc['@id'] }),
      mainEntity: { '@type': 'ItemList', itemListElement: mat.techniques.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: k.title[locale] })) } },
    bc] };
  const t = { label: m.materials.graphLabel, close: m.materials.close, when: m.materials.when, what: m.materials.action, why: m.materials.why, saving: m.materials.saving, estimate: m.materials.estimate, official: m.materials.official, hint: m.materials.hint };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials, href: pagePath(locale, INDEX) }, { label: mat.name }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{mat.title[locale]}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{mat.tagline[locale]}</p>
          </div>
          <ul className="tg__tools" role="list" aria-label={m.materials.pick}>
            {materials.map((x) => (
              <li key={x.id}>
                <Link href={pagePath(locale, toolPath(x.id))} className="tg__tool" aria-current={x.id === mat.id ? 'page' : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
                  <img src={withBasePath(logoSrc(x.logo))} alt="" width={32} height={32} style={{ '--k': logoScale(x.logo) } as React.CSSProperties} />
                  <span>{x.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="tgwrap">
            <ol className="tglist" role="list">
              {mat.techniques.map((k) => (
                <li key={k.id}>
                  <p className="m-0 text-[0.68rem] uppercase tracking-[0.14em] text-ink-400">{m.materials.groups[k.group]}</p>
                  <h3>{k.title[locale]}</h3>
                  <p className="tglist__sub">{k.short[locale]}</p>
                  <dl>
                    <dt>{m.materials.when}</dt><dd>{k.when[locale]}</dd>
                    <dt>{m.materials.action}</dt><dd>{k.action[locale]}</dd>
                    <dt>{m.materials.why}</dt><dd>{k.why[locale]}</dd>
                    {k.saving && <><dt>{m.materials.saving}</dt><dd>{k.saving.label[locale]} ({k.saving.kind === 'official' ? m.materials.official : m.materials.estimate})</dd></>}
                  </dl>
                </li>
              ))}
            </ol>
            <TechniqueGraph tool={toolView(mat, locale, m.materials.groups)} t={t} />
          </div>
          <p className="tg__sources mx-auto max-w-3xl text-center">{m.materials.sources}</p>
        </div>
      </section>
    </SiteFrame>
  );
}
