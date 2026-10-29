import { logos, logoSrc, type LogoId } from '@/data/skillLogos';

/** Maps a free-text stack entry ("FastAPI", "Postgres on AWS RDS", "GPT-4") to a brand logo when we have one. Order matters. */
const ALIASES: [RegExp, LogoId][] = [
  [/next\.?js/i, 'nextjs'], [/\breact\b/i, 'react'], [/typescript/i, 'typescript'], [/tailwind/i, 'tailwind'], [/\bnode(\.js)?\b/i, 'nodejs'],
  [/fastapi/i, 'fastapi'], [/\bpython\b/i, 'python'], [/postgres/i, 'postgresql'], [/mysql/i, 'mysql'], [/mongo/i, 'mongodb'], [/\bredis\b/i, 'redis'],
  [/neo4j/i, 'neo4j'], [/bigquery/i, 'bigquery'], [/supabase/i, 'supabase'], [/sql server|mssql/i, 'mssql'], [/pandas/i, 'pandas'], [/numpy/i, 'numpy'],
  [/scipy/i, 'scipy'], [/scikit|sklearn/i, 'sklearn'], [/xgboost/i, 'xgboost'], [/pytorch|\btorch\b/i, 'pytorch'], [/tensorflow|keras/i, 'tensorflow'],
  [/\byolo/i, 'yolo'], [/hugging ?face|transformers\b/i, 'huggingface'], [/langgraph/i, 'langgraph'], [/langchain/i, 'langchain'], [/\bmcp\b/i, 'mcp'],
  [/\bn8n\b/i, 'n8n'], [/openai|gpt|chatgpt|whisper|dall/i, 'openai'], [/claude|anthropic/i, 'claude'], [/gemini/i, 'gemini'], [/bedrock/i, 'bedrock'],
  [/azure (ai|openai)/i, 'azureai'], [/\bazure\b/i, 'azure'], [/docker/i, 'docker'], [/kubernetes|\bk8s\b|\beks\b/i, 'kubernetes'],
  [/\baws\b|\bec2\b|\bs3\b|lambda|sagemaker|\brds\b|cloudfront/i, 'aws'], [/\bgcp\b|google cloud|cloud run|vertex|app engine/i, 'gcp'], [/vercel/i, 'vercel'],
  [/linux|ubuntu/i, 'linux'], [/raspberry/i, 'raspberrypi'], [/github/i, 'github'], [/figma/i, 'figma'], [/stripe/i, 'stripe'], [/hipaa/i, 'hipaa'],
  [/gdpr|rgpd/i, 'gdpr'], [/soc ?2/i, 'soc2'], [/\bga4\b|google analytics/i, 'ga4'], [/tag manager|\bgtm\b/i, 'gtm'], [/search console/i, 'gsc'],
  [/google ads/i, 'adsconv'], [/facebook|meta ads/i, 'facebook'], [/instagram/i, 'instagram'], [/tiktok/i, 'tiktok'], [/youtube/i, 'youtube'],
  [/linkedin/i, 'linkedin'], [/binance/i, 'binance'], [/bybit/i, 'bybit'], [/interactive brokers|\bibkr\b/i, 'ibkr'], [/tradingview/i, 'tradingview'],
  [/quantconnect/i, 'quantconnect'], [/bitcoin|\bbtc\b/i, 'bitcoin'], [/metamask/i, 'metamask'], [/\bkali\b/i, 'kali'], [/owasp/i, 'owasp'],
  [/burp/i, 'burp'], [/wireshark/i, 'wireshark'], [/metasploit/i, 'metasploit'], [/^R\b|\bR (shiny|studio|package)/i, 'r'],
];

export function techLogo(name: string): { src: string; label: string } | null {
  for (const [re, id] of ALIASES) if (re.test(name)) return { src: logoSrc(id), label: logos[id][1] };
  return null;
}

/** Two-letter fallback monogram for stack entries without a logo. */
export function monogram(name: string): string {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}
