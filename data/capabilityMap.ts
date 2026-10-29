import type { CapabilityStage } from '@/lib/content/types';
import type { LogoId } from './skillLogos';

export interface GraphStage extends CapabilityStage { skills: LogoId[] }

/** The seven stages of one engagement (the chain in the capability graph) plus their tools. */
export const capabilityStages: GraphStage[] = [
  { id: 'product', order: 1, categoryIds: ['fullstack-uiux'],
    title: { en: 'Product & UI/UX', es: 'Producto y UI/UX' }, short: { en: 'UI/UX', es: 'UI/UX' },
    line: { en: 'Idea to interface: flows, wireframes and a UI people actually use, in React/Next.js or mobile.',
            es: 'De la idea a la interfaz: flujos, wireframes y una UI que la gente usa de verdad, en React/Next.js o móvil.' },
    skills: ['figma', 'lovable', 'base44', 'drawio', 'react', 'nextjs', 'typescript', 'tailwind', 'github'] },
  { id: 'build', order: 2, categoryIds: ['fullstack-uiux', 'ai-erp-saas'],
    title: { en: 'Full-Stack Build', es: 'Desarrollo full-stack' }, short: { en: 'Full-Stack', es: 'Full-Stack' },
    line: { en: 'Next.js/React front end, FastAPI or Node back end, typed APIs, auth and payments.',
            es: 'Frontend en Next.js/React, backend en FastAPI o Node, APIs tipadas, autenticación y pagos.' },
    skills: ['nextjs', 'react', 'reactnative', 'typescript', 'nodejs', 'fastapi', 'python', 'dash', 'plotly', 'd3', 'postgresql', 'supabase', 'redis', 'stripe', 'docker', 'github'] },
  { id: 'ai', order: 3, categoryIds: ['ai-agents'],
    title: { en: 'AI Integration & Agents', es: 'Integración de IA y agentes' }, short: { en: 'AI Agents', es: 'Agentes IA' },
    line: { en: 'LLMs, RAG, agentic workflows with LangChain/LangGraph, MCP tools and n8n automations wired into your product.',
            es: 'LLM, RAG, flujos agénticos con LangChain/LangGraph, herramientas MCP y automatizaciones n8n conectadas a tu producto.' },
    skills: ['openai', 'claude', 'claudecode', 'gemini', 'grok', 'langgraph', 'langchain', 'mcp', 'n8n', 'huggingface', 'bedrock', 'azureai', 'pytorch', 'tensorflow', 'yolo'] },
  { id: 'data', order: 4, categoryIds: ['databases-data-eng', 'data-science-ml'],
    title: { en: 'Data & Databases', es: 'Datos y bases de datos' }, short: { en: 'Data Science', es: 'Ciencia de datos' },
    line: { en: 'Schema design, Postgres, MySQL, MongoDB or Supabase, vector stores, pipelines and scraping that keep the data clean.',
            es: 'Diseño de esquemas, Postgres, MySQL, MongoDB o Supabase, bases vectoriales, pipelines y scraping que mantienen los datos limpios.' },
    skills: ['python', 'postgresql', 'mysql', 'mongodb', 'supabase', 'redis', 'neo4j', 'bigquery', 'azuresql', 'mssql', 'pandas', 'numpy', 'scipy', 'sklearn', 'xgboost', 'r', 'textract'] },
  { id: 'deploy', order: 5, categoryIds: ['cloud-devops-llmops'],
    title: { en: 'Deployment, DevOps & LLMOps', es: 'Despliegue, DevOps y LLMOps' }, short: { en: 'DevOps', es: 'DevOps' },
    line: { en: 'Docker, Kubernetes, AWS, GCP or Vercel, CI/CD, monitoring, evals and cost control for models in production.',
            es: 'Docker, Kubernetes, AWS, GCP o Vercel, CI/CD, monitorización, evaluaciones y control de costes para modelos en producción.' },
    skills: ['docker', 'kubernetes', 'eks', 'aws', 'gcp', 'azure', 'vercel', 'linux', 'github', 'raspberrypi', 'namecheap'] },
  { id: 'security', order: 6, categoryIds: ['security-compliance'],
    title: { en: 'Security & Compliance', es: 'Seguridad y cumplimiento' }, short: { en: 'Security', es: 'Seguridad' },
    line: { en: 'Penetration testing, security audits, hardening and GDPR/HIPAA-aware data handling.',
            es: 'Pruebas de penetración (pentesting), auditorías de seguridad, hardening y tratamiento de datos conforme al RGPD/HIPAA.' },
    skills: ['kali', 'owasp', 'burp', 'wireshark', 'metasploit', 'gdpr', 'hipaa', 'soc2', 'linux'] },
  { id: 'growth', order: 7, categoryIds: ['ai-marketing'],
    title: { en: 'AI Marketing & Growth', es: 'Marketing con IA y crecimiento' }, short: { en: 'Marketing', es: 'Marketing' },
    line: { en: 'GA4/GTM/Ads conversion tracking, technical SEO and GEO/AEO so the product gets found, measured and improved.',
            es: 'Seguimiento de conversiones con GA4/GTM/Ads, SEO técnico y GEO/AEO para que el producto se encuentre, se mida y mejore.' },
    skills: ['ga4', 'gtm', 'gsc', 'adsconv', 'adsmeasure', 'adsvideo', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'namecheap'] },
];

/** Branch node: not part of the 1→7 chain, linked to AI and Data in the graph. */
export const capabilityBranch: GraphStage = {
  id: 'finance', order: 0, categoryIds: ['finance-quant'],
  title: { en: 'Algorithmic Trading & Finance', es: 'Trading algorítmico y finanzas' }, short: { en: 'Trading', es: 'Trading' },
  line: { en: 'Backtested strategies, exchange and broker APIs, factor research and risk controls on live market data.',
          es: 'Estrategias con backtesting, APIs de exchanges y brókers, investigación de factores y control de riesgo sobre datos de mercado en tiempo real.' },
  skills: ['python', 'pandas', 'xgboost', 'quantconnect', 'tradingview', 'ibkr', 'binance', 'bybit', 'bitcoin', 'metamask'],
};

