import { SITE_NAME, SITE_URL, SOCIAL, absUrl } from '@/lib/site';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { localizePath } from '@/lib/locale-path';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { faq } from '@/data/faq';
import { categoryById } from '@/data/categories';
import type { Post, Project } from '@/lib/content/types';

const PERSON_ID = `${SITE_URL}/#person`;
const SERVICE_ID = `${SITE_URL}/#service`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const KNOWS_ABOUT = [
  'AI integration', 'Agentic AI', 'LangChain', 'LangGraph', 'Model Context Protocol', 'Retrieval-Augmented Generation', 'LLM fine-tuning',
  'Full-stack development', 'Next.js', 'React', 'React Native', 'FastAPI', 'TypeScript', 'Python', 'UI/UX design', 'SaaS development', 'ERP systems',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'BigQuery', 'Vector databases', 'Data engineering', 'Web scraping',
  'Machine learning', 'Deep learning', 'Computer vision', 'Natural language processing', 'Recommender systems', 'Quantitative finance',
  'Docker', 'Kubernetes', 'Amazon Web Services', 'Google Cloud', 'DevOps', 'MLOps', 'LLMOps', 'AIOps',
  'Penetration testing', 'Security auditing', 'GDPR', 'HIPAA', 'Google Analytics 4', 'Google Tag Manager', 'Google Ads', 'Technical SEO',
  'Generative Engine Optimization', 'Answer Engine Optimization',
];

export function personNode(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    alternateName: ['Davit Gadyan'],
    jobTitle: site.jobTitle[locale],
    description: getMessages(locale).meta.homeDescription,
    url: `${SITE_URL}/`,
    image: absUrl(site.shareCard[locale]),
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: site.country },
    knowsLanguage: site.languagesSpoken,
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Barcelona School of Economics', sameAs: 'https://bse.eu/' },
      { '@type': 'CollegeOrUniversity', name: 'American University of Armenia', sameAs: 'https://aua.am/' },
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', name: 'MSc Data Science for Decision Making (honours)', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Barcelona School of Economics' } },
      { '@type': 'EducationalOccupationalCredential', name: 'MBA (Finance & Data Science)', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'American University of Armenia' } },
    ],
    award: ['Upwork Expert-Vetted (top 1%)'],
    sameAs: [SOCIAL.twitter, SOCIAL.github, SOCIAL.linkedin, SOCIAL.upwork],
    knowsAbout: KNOWS_ABOUT,
    worksFor: { '@id': SERVICE_ID },
  };
}

export function serviceNode(locale: Locale) {
  return {
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: locale === 'es' ? 'David Gadyan — Ingeniero de IA EXPERT-VETTED | Científico de datos | Agentes de IA | IA generativa | SaaS' : 'David Gadyan — EXPERT-VETTED AI Engineer | Data Scientist | AI Agent | Generative AI | SaaS',
    url: `${SITE_URL}/`,
    founder: { '@id': PERSON_ID },
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: site.country },
    areaServed: ['Worldwide', 'Spain', 'European Union', 'United States', 'United Kingdom'],
    availableLanguage: ['English', 'Spanish', 'Russian', 'Armenian'],
    sameAs: [SOCIAL.linkedin, SOCIAL.upwork],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'es' ? 'Servicios' : 'Services',
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title[locale], description: s.blurb[locale] } })),
    },
  };
}

export function websiteNode() {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: ['en', 'es'], publisher: { '@id': PERSON_ID } };
}

export function webPageNode(o: { locale: Locale; path: string; name: string; description: string; dateModified?: string; image?: string; type?: string; breadcrumbId?: string }) {
  const url = absUrl(localizePath(o.path, o.locale));
  const alt = absUrl(localizePath(o.path, o.locale === 'en' ? 'es' : 'en'));
  return {
    '@type': o.type ?? 'WebPage',
    '@id': url,
    url,
    name: o.name,
    description: o.description,
    inLanguage: o.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
    ...(o.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: absUrl(o.image) } } : {}),
    ...(o.breadcrumbId ? { breadcrumb: { '@id': o.breadcrumbId } } : {}),
    ...(o.locale === 'es' ? { translationOfWork: { '@id': alt } } : { workTranslation: { '@id': alt } }),
  };
}

export function breadcrumbNode(locale: Locale, path: string, items: { name: string; path: string }[]) {
  const id = `${absUrl(localizePath(path, locale))}#breadcrumb`;
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absUrl(localizePath(it.path, locale)) })),
  };
}

export function faqNode(locale: Locale, items: { q: string; a: string }[], id = `${SITE_URL}/#faq`) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    inLanguage: locale,
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function homeGraph(locale: Locale) {
  const m = getMessages(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(locale),
      serviceNode(locale),
      websiteNode(),
      {
        ...webPageNode({ locale, path: '/', name: m.meta.homeTitle, description: m.meta.homeDescription, image: site.shareCard[locale] }),
        mainEntity: { '@id': PERSON_ID },
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.faq-q', '.faq-a'] },
      },
      faqNode(locale, faq.map((f) => ({ q: f.q[locale], a: f.a[locale] }))),
    ],
  };
}

export function portfolioGraph(locale: Locale, projects: Project[]) {
  const m = getMessages(locale);
  const path = '/portfolio/';
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.portfolio, path }]);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(locale), websiteNode(),
      { ...webPageNode({ locale, path, name: m.meta.portfolioTitle, description: m.meta.portfolioDescription, type: 'CollectionPage', breadcrumbId: bc['@id'] }),
        mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: absUrl(localizePath(`/portfolio/${p.slug}/`, locale)) })) } },
      bc,
    ],
  };
}

export function projectGraph(locale: Locale, p: Project) {
  const m = getMessages(locale);
  const path = `/portfolio/${p.slug}/`;
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.portfolio, path: '/portfolio/' }, { name: p.title, path }]);
  const videos = (p.links.video ?? []).map((v) => ({ '@type': 'VideoObject', name: p.title, description: p.summary, url: v, thumbnailUrl: absUrl(p.cover), uploadDate: p.date }));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(locale), websiteNode(),
      webPageNode({ locale, path, name: p.title, description: p.description, dateModified: p.lastmod ?? p.date, image: p.cover, breadcrumbId: bc['@id'] }),
      {
        '@type': 'CreativeWork',
        '@id': `${absUrl(localizePath(path, locale))}#work`,
        name: p.title,
        headline: p.title,
        genre: 'Case study',
        description: p.description,
        abstract: p.summary,
        url: absUrl(localizePath(path, locale)),
        image: absUrl(p.cover),
        inLanguage: locale,
        dateCreated: p.date,
        datePublished: p.date,
        dateModified: p.lastmod ?? p.date,
        author: { '@id': PERSON_ID },
        creator: { '@id': PERSON_ID },
        about: p.categories.map((c) => categoryById[c].label[locale]),
        keywords: Object.values(p.stack).flat().join(', '),
        isPartOf: { '@id': WEBSITE_ID },
        ...(videos.length ? { subjectOf: videos } : {}),
      },
      bc,
    ],
  };
}

export function blogGraph(locale: Locale, posts: Post[]) {
  const m = getMessages(locale);
  const path = '/blog/';
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.blog, path }]);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(locale), websiteNode(),
      { ...webPageNode({ locale, path, name: m.meta.blogTitle, description: m.meta.blogDescription, type: 'CollectionPage', breadcrumbId: bc['@id'] }),
        mainEntity: { '@type': 'ItemList', itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: absUrl(localizePath(`/blog/${p.slug}/`, locale)) })) } },
      bc,
    ],
  };
}

export function postGraph(locale: Locale, p: Post, wordCount: number) {
  const m = getMessages(locale);
  const path = `/blog/${p.slug}/`;
  const url = absUrl(localizePath(path, locale));
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.blog, path: '/blog/' }, { name: p.title, path }]);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(locale), websiteNode(),
      webPageNode({ locale, path, name: p.title, description: p.description, dateModified: p.lastmod, image: p.cover, breadcrumbId: bc['@id'] }),
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: p.title,
        description: p.description,
        abstract: p.summary,
        image: absUrl(p.cover),
        url,
        mainEntityOfPage: { '@id': url },
        datePublished: p.date,
        dateModified: p.lastmod,
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        inLanguage: locale,
        articleSection: p.articleSection,
        keywords: p.tags.join(', '),
        about: p.about.map((a) => ({ '@type': 'Thing', name: a })),
        wordCount,
        timeRequired: `PT${p.readingMinutes}M`,
        isPartOf: { '@id': WEBSITE_ID },
      },
      ...(p.faq.length ? [faqNode(locale, p.faq, `${url}#faq`)] : []),
      bc,
    ],
  };
}
