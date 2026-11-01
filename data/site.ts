import type { Localized } from '@/lib/content/types';

export const site = {
  name: 'David Gadyan',
  firstName: 'David',
  lastName: 'Gadyan',
  jobTitle: { en: 'Expert-Vetted AI Engineer, Data Scientist & SaaS Developer', es: 'Ingeniero de IA Expert-Vetted, Científico de datos y Desarrollador SaaS' } as Localized<string>,
  city: 'Barcelona',
  region: 'Catalonia',
  country: 'ES',
  countryName: { en: 'Spain', es: 'España' } as Localized<string>,
  // Contact e-mail shown in the policy pages (GDPR controller contact). Change here only.
  email: 'david.gadyan@bse.eu',
  languagesSpoken: ['en', 'es', 'ru', 'hy'],
  since: 2018,
  stats: { projects: 190, clients: 50, hours: 8700, years: 8 },
  shareCard: { en: '/share-card.jpg', es: '/share-card-es.jpg' } as Localized<string>,
  about: {
    en: [
      "I'm David Gadyan, an Upwork **Expert-Vetted (top 1%)** AI Engineer and Data Scientist in Barcelona. I build AI agents, generative AI and machine learning products end to end: UX/UI, full-stack SaaS and ERP, databases, computer vision, algorithmic trading systems, DevOps with MLOps and LLMOps, security and compliance, and the marketing analytics that prove the result. One person from the idea to a product that moves a business number, for **mutual success**.",
      'That end-to-end scope is the point. There is no hand-off between a designer, an ML team, a DevOps contractor and a marketing agency, so nothing gets lost and nothing is anyone else\'s fault.',
      'Credentials: **190+ delivered projects**, **50+ long-term clients**, **8,700+ hours**, **Upwork Expert-Vetted (top 1%)**, **Toptal**, **$500k+ earned**. MSc Data Science (honours) from Barcelona School of Economics, MBA from the American University of Armenia.',
    ],
    es: [
      'Soy David Gadyan, Ingeniero de IA y Científico de datos **Expert-Vetted en Upwork (el 1 % mejor)**, afincado en Barcelona. Construyo agentes de IA y productos de IA generativa y machine learning de principio a fin: UX/UI, SaaS y ERP full-stack, bases de datos, visión artificial, sistemas de trading algorítmico, DevOps con MLOps y LLMOps, seguridad y cumplimiento, y la analítica de marketing que demuestra el resultado. Una sola persona desde la idea hasta un producto que mueve una cifra de negocio, para un **éxito mutuo**.',
      'Ese alcance de principio a fin es la clave. No hay traspasos entre un diseñador, un equipo de ML, un contratista de DevOps y una agencia de marketing, así que nada se pierde por el camino y nada es culpa de otro.',
      'Credenciales: **más de 190 proyectos entregados**, **más de 50 clientes de larga duración**, **más de 8.700 horas**, **Expert-Vetted en Upwork (el 1 % mejor)**, **Toptal**, **más de 500.000 $ facturados**. Máster en Ciencia de Datos (con honores) por la Barcelona School of Economics y MBA por la American University of Armenia.',
    ],
  } as Localized<string[]>,
};
