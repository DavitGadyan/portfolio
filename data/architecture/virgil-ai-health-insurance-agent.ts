import type { Flow } from './types';

export const flow: Flow = {
  nodes: [
    {
      id: 'applicant', group: 'user', col: 0, row: 0,
      label: { en: 'US applicant', es: 'Solicitante en EE. UU.' },
      notes: {
        en: ['Has to check medication coverage, compare plans and wait days for underwriting without the agent.'],
        es: ['Sin el agente debe comprobar la cobertura de medicamentos, comparar planes y esperar días a la suscripción.'],
      },
    },
    {
      id: 'onboarding-ui', group: 'frontend', col: 1, row: 0,
      label: { en: 'Conversational onboarding', es: 'Alta conversacional' },
      notes: {
        en: ['Collects the applicant details and drives plan selection without forms to fill in by hand.'],
        es: ['Recoge los datos del solicitante y guía la selección del plan sin formularios que rellenar a mano.'],
      },
    },
    {
      id: 'api', group: 'backend', col: 2, row: 0, tech: 'FastAPI Python',
      label: { en: 'FastAPI service', es: 'Servicio FastAPI' },
      notes: {
        en: ['Exposes the agent to the web app over REST.'],
        es: ['Expone el agente a la aplicación web por REST.'],
      },
    },
    {
      id: 'agent', group: 'ai', col: 3, row: 0, tech: 'LangChain',
      label: { en: 'LangChain agents', es: 'Agentes LangChain' },
      notes: {
        en: ['Agents call MCP and custom tools to price medications and check coverage across candidate plans.'],
        es: ['Los agentes usan herramientas MCP y propias para consultar precios y comprobar la cobertura de los planes.'],
      },
    },
    {
      id: 'model', group: 'ai', col: 4, row: 0, tech: 'OpenAI',
      label: { en: 'OpenAI reasoning model', es: 'Modelo de razonamiento' },
      notes: {
        en: ['The reasoning model the LangChain agents run on.'],
        es: ['El modelo de razonamiento de OpenAI sobre el que funcionan los agentes LangChain.'],
      },
    },
    {
      id: 'med-price', group: 'data', col: 4, row: 1, tech: 'MCP',
      label: { en: 'Medication-price lookup', es: 'Precios de medicamentos' },
      notes: {
        en: ['MCP and custom tools look up medication prices.'],
        es: ['Herramientas MCP y propias consultan precios de medicamentos.'],
      },
    },
    {
      id: 'coverage', group: 'data', col: 4, row: 2,
      label: { en: 'Plan coverage check', es: 'Cobertura de planes' },
      notes: {
        en: ['Medication coverage is checked automatically across the candidate plans, instead of manually.'],
        es: ['La cobertura de medicamentos se comprueba automáticamente en los planes candidatos, no a mano.'],
      },
    },
    {
      id: 'underwriting', group: 'backend', col: 4, row: 3,
      label: { en: 'Automated underwriting', es: 'Suscripción automatizada' },
      notes: {
        en: ['Returns an underwriting decision in minutes rather than days.'],
        es: ['Devuelve una decisión de suscripción en minutos, no en días.'],
      },
    },
    {
      id: 'plan', group: 'ai', col: 5, row: 0,
      label: { en: 'Best plan and quote', es: 'Mejor plan y oferta' },
      notes: {
        en: ['Applicant is onboarded, checked and quoted in a single session.'],
        es: ['El solicitante se da de alta, es evaluado y recibe una oferta en una sola sesión.'],
      },
    },
    {
      id: 'decision', group: 'backend', col: 5, row: 1,
      label: { en: 'Underwriting decision', es: 'Decisión de suscripción' },
      notes: {
        en: ['Underwriting time went from days to minutes.', 'Onboarding automated end to end for the broker partner One Health.'],
        es: ['El tiempo de suscripción pasó de días a minutos.', 'Alta automatizada de principio a fin para el bróker asociado One Health.'],
      },
    },
    {
      id: 'docker', group: 'infra', tech: 'Docker',
      label: { en: 'Docker images', es: 'Imágenes Docker' },
      notes: {
        en: ['The service ships as Docker images.'],
        es: ['El servicio se distribuye como imágenes Docker.'],
      },
    },
    {
      id: 'kubernetes', group: 'infra', tech: 'Kubernetes AWS',
      label: { en: 'Kubernetes on AWS', es: 'Kubernetes en AWS' },
      notes: {
        en: ['Orchestrates the images so the service scales with a potentially large user base.'],
        es: ['Orquesta las imágenes para que el servicio escale con una base de usuarios potencialmente grande.'],
      },
    },
    {
      id: 'hipaa', group: 'security', tech: 'HIPAA',
      label: { en: 'HIPAA-guided handling', es: 'Datos conforme a HIPAA' },
      notes: {
        en: ['Health data is regulated, so storage and transfer were designed around HIPAA requirements.', 'This made the product usable by a licensed broker rather than a demo.'],
        es: ['Los datos sanitarios están regulados: almacenamiento y transmisión se diseñaron conforme a HIPAA.', 'Eso hizo el producto utilizable por un bróker autorizado y no solo una demo.'],
      },
    },
    {
      id: 'secure-data', group: 'security',
      label: { en: 'Secure applicant data', es: 'Datos del solicitante' },
      notes: {
        en: ['AI and applicant data stored and transferred following general security best practice.'],
        es: ['Datos de IA y de solicitantes almacenados y transmitidos según buenas prácticas de seguridad.'],
      },
    },
  ],
  edges: [
    { from: 'applicant', to: 'onboarding-ui', label: { en: 'Chat', es: 'Chat' } },
    { from: 'onboarding-ui', to: 'api', label: { en: 'REST', es: 'REST' } },
    { from: 'api', to: 'agent' },
    { from: 'agent', to: 'model', label: { en: 'Reasoning', es: 'Razonamiento' } },
    { from: 'agent', to: 'med-price', label: { en: 'Tool call', es: 'Herramienta' } },
    { from: 'agent', to: 'coverage', label: { en: 'Tool call', es: 'Herramienta' } },
    { from: 'agent', to: 'underwriting' },
    { from: 'med-price', to: 'plan', label: { en: 'Prices', es: 'Precios' } },
    { from: 'coverage', to: 'plan', label: { en: 'Coverage', es: 'Cobertura' } },
    { from: 'underwriting', to: 'decision', label: { en: 'Minutes', es: 'Minutos' } },
  ],
};
