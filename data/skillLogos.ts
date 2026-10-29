/** Logo id → [file under public/logos/, label, optional size multiplier for wide marks]. Files come from scripts/prepare-logos.mjs (PNGs from assets/logos, SVGs from Simple Icons). */
export const logos = {
  figma: ['figma.png', 'Figma'], react: ['reactjs.png', 'React'], nextjs: ['nextjs.png', 'Next.js'], lovable: ['lovable.png', 'Lovable'], base44: ['base44.svg', 'Base44'], drawio: ['drawio.svg', 'draw.io'],
  reactnative: ['react-native.svg', 'React Native'], dash: ['dash.png', 'Plotly Dash'], plotly: ['plotly.svg', 'Plotly.js'], d3: ['d3.svg', 'D3.js'],
  typescript: ['typescript.svg', 'TypeScript'], tailwind: ['tailwind.svg', 'Tailwind CSS'], fastapi: ['fastapi.png', 'FastAPI'], python: ['python.png', 'Python'],
  nodejs: ['nodejs.svg', 'Node.js'], postgresql: ['postgresql.png', 'PostgreSQL'], redis: ['redis.png', 'Redis'], github: ['github.png', 'GitHub'],
  docker: ['docker.png', 'Docker'], stripe: ['stripe.svg', 'Stripe'], supabase: ['supabase.svg', 'Supabase'],
  openai: ['openai.png', 'OpenAI'], claude: ['claude.png', 'Claude'], claudecode: ['claudecode.png', 'Claude Code'], gemini: ['google-gemini.png', 'Gemini'], grok: ['grok.svg', 'Grok (xAI)'],
  langgraph: ['langgraph.png', 'LangGraph'], langchain: ['langchain.svg', 'LangChain'], mcp: ['mcp.svg', 'MCP'], n8n: ['n8n.svg', 'n8n'],
  huggingface: ['hugging-face.png', 'Hugging Face'], bedrock: ['bedrock.png', 'AWS Bedrock'], azureai: ['azureai.png', 'Azure AI'],
  pytorch: ['pytorch.png', 'PyTorch'], tensorflow: ['tensorflow.png', 'TensorFlow'], yolo: ['yolo.png', 'YOLO'], textract: ['textract.png', 'AWS Textract'],
  mysql: ['mysql.png', 'MySQL'], mongodb: ['mongodb.png', 'MongoDB'], neo4j: ['neo4j.png', 'Neo4j'], bigquery: ['googlebigquery.png', 'BigQuery'],
  azuresql: ['azure-sql-server.png', 'Azure SQL'], mssql: ['sql-server.png', 'SQL Server'], pandas: ['pandas.png', 'pandas'], numpy: ['numpy.png', 'NumPy'],
  scipy: ['scipy.png', 'SciPy'], sklearn: ['scikitlearn.png', 'scikit-learn'], xgboost: ['xgboost.png', 'XGBoost'], r: ['r.png', 'R'],
  kubernetes: ['kubernetes.png', 'Kubernetes'], aws: ['aws.png', 'AWS', 1.15], eks: ['eks-anywhere.png', 'EKS Anywhere'], gcp: ['gcp.png', 'Google Cloud'],
  azure: ['azure.png', 'Azure'], vercel: ['vercel.svg', 'Vercel'], linux: ['linux.png', 'Linux'], raspberrypi: ['raspberry-pi.png', 'Raspberry Pi'], namecheap: ['namecheap.png', 'Namecheap', 1.3],
  kali: ['kali-linux.svg', 'Kali Linux'], owasp: ['owasp.svg', 'OWASP'], burp: ['burp-suite.svg', 'Burp Suite'], wireshark: ['wireshark.svg', 'Wireshark'],
  metasploit: ['metasploit.svg', 'Metasploit'], gdpr: ['gdpr.png', 'GDPR'], hipaa: ['hipaa.png', 'HIPAA'], soc2: ['soc-2.png', 'SOC 2'],
  ga4: ['ga4.svg', 'GA4'], gtm: ['gtm.svg', 'Tag Manager'], gsc: ['search-console.svg', 'Search Console'], adsconv: ['google-ads-conversions.png', 'Google Ads Conversion Optimization'],
  adsmeasure: ['google-ads-measurement.png', 'Google Ads Measurement'], adsvideo: ['google-ads-video.png', 'Google Ads Video'], facebook: ['facebook.png', 'Facebook'],
  instagram: ['instagram.png', 'Instagram'], linkedin: ['linkedin.png', 'LinkedIn'], tiktok: ['tiktok.png', 'TikTok'], youtube: ['youtube.png', 'YouTube', 1.15],
  binance: ['binance.png', 'Binance', 1.3], bybit: ['bybit.png', 'Bybit', 1.3], ibkr: ['ibkr.png', 'Interactive Brokers', 1.6], quantconnect: ['quantconnect.png', 'QuantConnect'],
  tradingview: ['tradingview.png', 'TradingView'], bitcoin: ['bitcoin.png', 'Bitcoin'], metamask: ['metamask.png', 'MetaMask'],
} as const;
export type LogoId = keyof typeof logos;
export const logoSrc = (id: LogoId) => '/logos/' + logos[id][0];
export const logoScale = (id: LogoId): number => (logos[id] as readonly [string, string, number?])[2] ?? 1;
