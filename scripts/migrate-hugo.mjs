// One-off: draft content/{en,es}/{projects,blog}/*.mdx from the Hugo site + the polishmycv catalogue.
// Usage: node scripts/migrate-hugo.mjs /Users/dyada/Desktop/portfolio/david_portfolio
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const HUGO = process.argv[2];
if (!HUGO || !existsSync(join(HUGO, 'content/english'))) { console.error('usage: node scripts/migrate-hugo.mjs <hugo-root>'); process.exit(1); }
const CATALOGUE = '/Users/dyada/Desktop/Github/polishmycv/docs/portfolio-catalogue.json';
const TODAY = new Date().toISOString().slice(0, 10);
const FORCE = process.argv.includes('--force');

const SLUGS = {
  1: 'cluster-analysis-web-app', 2: 'stock-trend-sentiment-dashboard', 3: 'driver-fatigue-detection-edge-ai', 4: 'entity-resolution-deduplication',
  5: 'large-scale-web-scraping-aws', 6: 'image-background-removal-unet-aws', 7: 'crypto-trading-bot-python', 8: 'ai-web-scraper-lstm',
  9: 'hybrid-recommender-system-matchmaking', 10: 'lda-liwc-tweet-analysis', 11: 'scrapy-bigquery-pipeline', 12: 'stock-ticker-hypothesis-testing',
  13: 'marketing-kpi-dashboard-dash', 14: 'document-ocr-extraction-api', 15: 'automated-valuation-model-real-estate', 16: 'dash-app-deployment-aws',
  17: 'chatgpt-website-summarizer', 18: 'visual-product-search-google-vision', 19: 'sme-synergy-matching-platform', 20: 'resume-analysis-nlp',
  21: 'ai-persona-stable-diffusion', 22: 'mistral-7b-fine-tuning-api', 23: 'r-rest-api-medical-kpis', 24: 'billboard-recreation-stable-diffusion',
  25: 'recommender-api-gcp-chilldays', 26: 'yield-curve-pca-quant-pipeline', 27: 'industry-classification-bert', 28: 'legal-document-review-langgraph-agent',
  29: 'animated-data-visualization-d3', 30: 'ai-real-estate-development-platform', 31: 'crypto-regulation-rag-chatbot', 32: 'n8n-ai-assistant',
  33: 's1mple-ai-agent-platform', 34: 'virgil-ai-health-insurance-agent', 35: 'ai-lead-scoring-churn-crm', 36: 'ai-video-ads-improvtalk', 37: 'ai-marketing-ga4-seo-geo',
};
const TITLES = {
  1: 'Python Cluster Analysis Web App', 2: 'Stock Trend & Sentiment Dashboard', 3: 'Driver Fatigue Detection on Edge Devices', 4: 'Entity Resolution & Record Deduplication',
  5: 'Large-Scale Web Scraping on AWS (Scrapy, EC2, S3)', 6: 'Image Background Removal Service (U-Net on AWS)', 7: 'Crypto Trading Bots in Python', 8: 'AI-Powered Web Scraper (LSTM + Scrapy)',
  9: 'Hybrid Recommender System for a Matchmaking Platform', 10: 'LDA & LIWC Analysis of Tweets', 11: 'Scrapy + BigQuery Data Pipeline', 12: 'Stock Ticker Hypothesis Testing',
  13: 'Marketing KPI Dashboard (Meta, Google Ads, Stripe, GA)', 14: 'Document OCR & Data Extraction API', 15: 'Automated Valuation Model & Real Estate Bot', 16: 'Deploying a Dash ML App on AWS',
  17: 'ChatGPT Website Summariser & Extractor', 18: 'Visual Product Search with Google Vision AI', 19: 'AI-Powered SME Synergy Matching Platform', 20: 'Resume Analysis with NLP and LLMs',
  21: 'AI Persona Content Pipeline (Stable Diffusion)', 22: 'Multilingual Text Generation: Mistral 7B Fine-Tuning & API', 23: 'R REST API & Plotly Graphs for a Medical Testing Platform', 24: 'AI Billboard Recreation (Grounding DINO + Stable Diffusion)',
  25: 'Hybrid Recommender API on GCP (Chilldays)', 26: 'Yield-Curve PCA Quant Pipeline (Bloomberg)', 27: 'Industry Classification of Firms (BERT + GPT-4 Labelling)', 28: 'Legal Document Review Agent (Gemini + LangGraph)',
  29: 'Animated Data Visualisation (D3.js Race Charts)', 30: 'AI Real Estate Development Analysis Platform', 31: 'Crypto Regulation RAG Chatbot (GPT-4 + Pinecone)', 32: 'AI Productivity Assistant in n8n',
  33: 'S1mple.ai: Agentic AI Platform with MCP Tools', 34: 'Virgil.ai: Agentic Health-Insurance Assistant', 35: 'AI Lead Scoring & Churn Detection Engine (S1mple.ai)', 36: 'Generative AI Video Ads for ImprovTalk', 37: 'AI Marketing: GA4, Ads, SEO & GEO/AEO',
};
const CATS = {
  1: ['data-science-ml', 'fullstack-uiux', 'cloud-devops-llmops'], 2: ['data-science-ml', 'fullstack-uiux', 'finance-quant'], 3: ['computer-vision', 'cloud-devops-llmops'], 4: ['data-science-ml', 'databases-data-eng'],
  5: ['databases-data-eng', 'cloud-devops-llmops'], 6: ['computer-vision', 'cloud-devops-llmops'], 7: ['finance-quant', 'cloud-devops-llmops'], 8: ['databases-data-eng', 'data-science-ml', 'cloud-devops-llmops'],
  9: ['data-science-ml'], 10: ['data-science-ml'], 11: ['databases-data-eng', 'cloud-devops-llmops'], 12: ['finance-quant', 'data-science-ml'],
  13: ['ai-marketing', 'fullstack-uiux', 'databases-data-eng'], 14: ['computer-vision', 'cloud-devops-llmops'], 15: ['data-science-ml', 'databases-data-eng'], 16: ['cloud-devops-llmops', 'fullstack-uiux'],
  17: ['ai-agents', 'fullstack-uiux'], 18: ['computer-vision', 'cloud-devops-llmops'], 19: ['fullstack-uiux', 'data-science-ml', 'cloud-devops-llmops'], 20: ['data-science-ml', 'ai-agents'],
  21: ['computer-vision', 'ai-marketing'], 22: ['ai-agents', 'cloud-devops-llmops'], 23: ['fullstack-uiux', 'data-science-ml'], 24: ['computer-vision'],
  25: ['data-science-ml', 'cloud-devops-llmops', 'databases-data-eng'], 26: ['finance-quant', 'data-science-ml'], 27: ['data-science-ml', 'ai-agents'], 28: ['ai-agents', 'security-compliance', 'fullstack-uiux'],
  29: ['fullstack-uiux', 'databases-data-eng'], 30: ['data-science-ml', 'databases-data-eng', 'fullstack-uiux'], 31: ['ai-agents', 'databases-data-eng', 'cloud-devops-llmops'], 32: ['ai-agents'],
  33: ['ai-agents', 'ai-erp-saas', 'fullstack-uiux'], 34: ['ai-agents', 'ai-erp-saas', 'cloud-devops-llmops', 'security-compliance'], 35: ['ai-erp-saas', 'ai-agents', 'ai-marketing', 'databases-data-eng'], 36: ['ai-marketing', 'computer-vision'], 37: ['ai-marketing', 'databases-data-eng'],
};
const FEATURED = { 34: 1, 35: 2, 33: 3, 37: 4, 31: 5, 28: 6, 30: 7, 36: 8 };
const BLOG_SLUGS = {
  1: 'how-much-maths-for-data-science', 2: 'upwork-expert-vetted-data-scientist', 3: 'gre-ielts-data-science-masters', 4: 'accepted-barcelona-school-of-economics',
  5: 'freelancing-while-studying-masters', 6: 'graduating-bse-with-honours', 7: 'ai-crypto-trading-strategy-xgboost', 8: 'improvtalk-charisma-app',
};

const LAYERS = {
  frontend: /react|next\.?js|d3|dash|plotly|streamlit|vue|typescript|javascript|html|css|tailwind|bootstrap|front.?end|ui|dashboard|react native|ios|swift/i,
  backend: /fastapi|flask|node|express|rest|api|django|backend|websocket|graphql/i,
  ai: /langchain|langgraph|openai|gpt|claude|gemini|llm|rag|bert|xgboost|scikit|sklearn|tensorflow|pytorch|keras|yolo|u-net|unet|stable diffusion|controlnet|mistral|hugging|mcp|n8n|nlp|lda|lstm|ocr|textract|vision|whisper|higgsfield|kling|machine learning|deep learning|model|embedding|fine-tun|transformer|dino|clip|recommender|classif|cluster|pca|regression|time series|forecast|sentiment|liwc|topic/i,
  data: /postgres|mysql|mongo|supabase|bigquery|firebase|sql|scrapy|selenium|playwright|beautifulsoup|pandas|etl|airflow|redis|elasticsearch|pinecone|vector|database|data pipeline|scraping|crawl|sheets|csv|bloomberg|yfinance|binance|ccxt|hubspot|monday|zoho|stripe|ga4|google analytics|tag manager/i,
  infra: /aws|ec2|s3|lambda|gcp|google cloud|cloud run|docker|kubernetes|k8s|heroku|vercel|raspberry|ci\/cd|linux|nginx|deploy|devops|mlops|cloud|edge/i,
  security: /hipaa|gdpr|auth|oauth|jwt|encrypt|security|compliance|privacy|verification|abn|acn/i,
};
function bucket(skills) {
  const out = { frontend: [], backend: [], ai: [], data: [], infra: [], security: [] };
  for (const s of skills) {
    let placed = false;
    for (const [layer, re] of Object.entries(LAYERS)) if (re.test(s)) { out[layer].push(s); placed = true; break; }
    if (!placed) out.ai.push(s);
  }
  return out;
}

function convertBody(md) {
  let s = md.replace(/\r\n/g, '\n');
  s = s.replace(/\{\{<\s*youtube\s+([A-Za-z0-9_-]+)\s*>\}\}/g, '<YouTube id="$1" />');
  s = s.replace(/\{\{<\s*loom\s+"?([^">\s]+)"?[^>]*>\}\}/g, (_, v) => `<Loom id="${v.replace(/.*\/(share|embed)\//, '').replace(/\?.*$/, '')}" />`);
  // escape MDX-sensitive characters outside fenced code
  const parts = s.split(/(```[\s\S]*?```)/g);
  s = parts.map((p, i) => (i % 2 === 1 ? p : p.replace(/[{}]/g, (c) => `\\${c}`).replace(/<(?![A-Za-z\/!])/g, '&lt;'))).join('');
  return s.trim();
}

function isoDate(v) { return v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10); }
function clamp(s, max) { if (!s) return ''; s = s.replace(/\s+/g, ' ').trim(); return s.length <= max ? s : s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'; }

const cat = JSON.parse(readFileSync(CATALOGUE, 'utf8'));
const byImage = new Map(cat.projects.map((p) => [String(p.image ?? '').split('/').pop(), p]));

mkdirSync('content/_source/projects', { recursive: true });
mkdirSync('content/_source/blog', { recursive: true });
for (const loc of ['en', 'es']) { mkdirSync(`content/${loc}/projects`, { recursive: true }); mkdirSync(`content/${loc}/blog`, { recursive: true }); }

let written = 0;
for (let n = 1; n <= 37; n++) {
  const file = join(HUGO, 'content/english/portfolio', `project-${n}.md`);
  if (!existsSync(file)) { console.warn('missing', file); continue; }
  const { data, content } = matter(readFileSync(file, 'utf8'));
  const slug = SLUGS[n];
  const img = String(data.image ?? '').split('/').pop();
  const c = byImage.get(img) ?? {};
  const links = {};
  const info = Array.isArray(data.project_info) ? data.project_info : [];
  const videos = [];
  for (const i of info) {
    const v = String(i?.content ?? '');
    if (!/^https?:\/\//.test(v)) continue;
    if (/loom\.com|youtu/.test(v)) videos.push(v);
    else if (/github\.com/.test(v)) links.github = v;
    else if (!links.live) links.live = v;
  }
  for (const l of c.links ?? []) {
    const v = String(l.url ?? '');
    if (/loom\.com|youtu/.test(v)) { if (!videos.includes(v)) videos.push(v); }
    else if (/github\.com/.test(v)) links.github ??= v;
    else if (!/davidgadyan\.com|davitgadyan/.test(v)) links.live ??= v;
  }
  for (const m of content.matchAll(/youtube\s+([A-Za-z0-9_-]+)/g)) videos.push(`https://youtu.be/${m[1]}`);
  if (videos.length) links.video = [...new Set(videos)];
  const summary = clamp(c.summary ?? content.split('\n\n')[0], 320);
  const description = clamp(c.summary ?? content.split('\n\n')[0], 155);
  const fm = {
    title: TITLES[n],
    date: isoDate(data.date),
    lastmod: TODAY,
    ...(c.client ? { client: String(c.client) } : {}),
    cover: `/images/portfolio/${img}`,
    coverAlt: `${TITLES[n]} — project cover`,
    summary,
    description: description.length >= 100 ? description : clamp(`${description} ${(c.outcomes ?? []).join(' ')}`, 155),
    categories: CATS[n],
    stack: bucket(c.skills ?? []),
    links,
    outcomes: (c.outcomes ?? []).slice(0, 5),
    featured: Boolean(FEATURED[n]),
    ...(FEATURED[n] ? { order: FEATURED[n] } : {}),
  };
  const body = convertBody(content);
  const enPath = `content/en/projects/${slug}.mdx`;
  if (FORCE || !existsSync(enPath)) { writeFileSync(enPath, matter.stringify(`\n${body}\n`, fm)); written++; }
  const esPath = `content/es/projects/${slug}.mdx`;
  if (FORCE || !existsSync(esPath)) {
    const esFm = { title: fm.title, coverAlt: fm.coverAlt, summary: fm.summary, description: fm.description, outcomes: fm.outcomes };
    writeFileSync(esPath, matter.stringify(`\n${body}\n`, esFm)); written++;
  }
  writeFileSync(`content/_source/projects/${slug}.md`, `# project-${n} → ${slug}\n\n## Hugo front matter\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n## Hugo body\n\n${content.trim()}\n\n## Catalogue entry\n\n\`\`\`json\n${JSON.stringify(c, null, 2)}\n\`\`\`\n`);
}

for (let n = 1; n <= 8; n++) {
  const file = join(HUGO, 'content/english/blog', `blog-${n}.md`);
  if (!existsSync(file)) { console.warn('missing', file); continue; }
  const { data, content } = matter(readFileSync(file, 'utf8'));
  const slug = BLOG_SLUGS[n];
  const img = String(data.image ?? '').split('/').pop();
  const fm = {
    title: data.title,
    date: isoDate(data.date),
    lastmod: data.lastmod ? isoDate(data.lastmod) : isoDate(data.date),
    author: data.author ?? 'David Gadyan',
    cover: `/images/portfolio/${img}`,
    coverAlt: String(data.title),
    tags: data.tags ?? [],
    articleSection: data.articleSection ?? 'Blog',
    description: data.description ?? '',
    summary: data.summary ?? data.description ?? '',
    about: data.about ?? [],
    takeaways: data.takeaways ?? [],
    faq: data.faq ?? [],
  };
  const body = convertBody(content);
  const enPath = `content/en/blog/${slug}.mdx`;
  if (FORCE || !existsSync(enPath)) { writeFileSync(enPath, matter.stringify(`\n${body}\n`, fm)); written++; }
  const esPath = `content/es/blog/${slug}.mdx`;
  if (FORCE || !existsSync(esPath)) {
    const esFm = { title: fm.title, description: fm.description, summary: fm.summary, coverAlt: fm.coverAlt, about: fm.about, takeaways: fm.takeaways, faq: fm.faq };
    writeFileSync(esPath, matter.stringify(`\n${body}\n`, esFm)); written++;
  }
  writeFileSync(`content/_source/blog/${slug}.md`, `# blog-${n} → ${slug}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n${content.trim()}\n`);
}
console.log(`[migrate] wrote ${written} files`);
