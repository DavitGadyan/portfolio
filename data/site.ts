import type { Localized } from '@/lib/content/types';

export const site = {
  name: 'David Gadyan',
  firstName: 'David',
  lastName: 'Gadyan',
  jobTitle: { en: 'Full-Stack AI Engineer', es: 'Ingeniero Full-Stack de IA' } as Localized<string>,
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
      "I'm David Gadyan, a Data Scientist & AI SaaS Engineer based in Barcelona. For eight years I have been the one person clients call when an idea has to become a working product: I design the interface, build the front end and back end, wire in the AI (LLMs, RAG, agents, MCP tools), design the database, deploy it on AWS, GCP or Kubernetes, harden it with security audits and GDPR-aware data handling, and then set up the analytics and ads tracking that show whether it moved a business number. All of this for **mutual success**.",
      'That end-to-end scope is the point. There is no hand-off between a designer, an ML team, a DevOps contractor and a marketing agency, so nothing gets lost and nothing is anyone else\'s fault.',
      'Credentials: **190+ delivered projects**, **50+ long-term clients**, **8,700+ hours**, **Upwork Expert-Vetted (top 1%)**, **Toptal**, **$500k+ earned**. MSc Data Science (honours) from Barcelona School of Economics, MBA from the American University of Armenia.',
    ],
    es: [
      'Soy David Gadyan, Científico de datos e Ingeniero de SaaS con IA afincado en Barcelona. Desde hace ocho años soy la persona a la que mis clientes llaman cuando una idea tiene que convertirse en un producto que funcione: diseño la interfaz, construyo el frontend y el backend, integro la IA (LLM, RAG, agentes, herramientas MCP), diseño la base de datos, lo despliego en AWS, GCP o Kubernetes, lo protejo con auditorías de seguridad y un tratamiento de datos conforme al RGPD, y después monto la analítica y el seguimiento de anuncios que demuestran si ha movido una cifra de negocio. Todo ello para un **éxito mutuo**.',
      'Ese alcance de principio a fin es la clave. No hay traspasos entre un diseñador, un equipo de ML, un contratista de DevOps y una agencia de marketing, así que nada se pierde por el camino y nada es culpa de otro.',
      'Credenciales: **más de 190 proyectos entregados**, **más de 50 clientes de larga duración**, **más de 8.700 horas**, **Expert-Vetted en Upwork (el 1 % mejor)**, **Toptal**, **más de 500.000 $ facturados**. Máster en Ciencia de Datos (con honores) por la Barcelona School of Economics y MBA por la American University of Armenia.',
    ],
  } as Localized<string[]>,
};
