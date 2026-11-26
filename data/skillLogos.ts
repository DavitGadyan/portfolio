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
  aeo: ['aeo.svg', 'AEO'], geo: ['geo.svg', 'GEO'], kpis: ['kpis.svg', 'KPIs'], seo: ['seo.svg', 'SEO'],
  javascript: ['javascript.svg', 'JavaScript'], snowflake: ['snowflake.svg', 'Snowflake'], databricks: ['databricks.svg', 'Databricks'],
  // tools named around Snowflake in the mind map (data/mindmaps/snowflake.ts)
  streamlit: ['streamlit.svg', 'Streamlit'], kafka: ['kafka.svg', 'Apache Kafka'], airflow: ['airflow.svg', 'Apache Airflow'], django: ['django.svg', 'Django'],
  mistral: ['mistral.svg', 'Mistral AI'], gitlab: ['gitlab.svg', 'GitLab'], bitbucket: ['bitbucket.svg', 'Bitbucket'], go: ['go.svg', 'Go'], php: ['php.svg', 'PHP'], prefect: ['prefect.svg', 'Prefect'],
  // the Azure / Fabric / Databricks / Foundry post's stack diagrams (data/blog/azure-stacks.ts)
  spark: ['apachespark.svg', 'Apache Spark'], mlflow: ['mlflow.svg', 'MLflow'], powerbi: ['powerbi.svg', 'Power BI'], sharepoint: ['sharepoint.svg', 'SharePoint'], microsoft: ['microsoft.svg', 'Microsoft'],
  // Microsoft data and AI services (official Azure architecture icons in assets/logos/azure, Fabric from @fabric-msft/svg-icons) for the skills map and the Azure post
  fabric: ['fabric.svg', 'Microsoft Fabric'], foundry: ['foundry.svg', 'Microsoft Foundry'], aisearch: ['azure-ai-search.svg', 'Azure AI Search'], datafactory: ['data-factory.svg', 'Azure Data Factory'],
  docintel: ['document-intelligence.svg', 'Azure AI Document Intelligence'], decision1: ['microsoft.svg', 'Microsoft Decision-1'],
  // LLM vendors (skills map "AI Agents" node and the model-comparison posts, data/blog/llm-stacks.ts)
  qwen: ['qwen.svg', 'Qwen (Alibaba)'], deepseek: ['deepseek.svg', 'DeepSeek'], llama: ['meta.svg', 'Meta Llama'], ollama: ['ollama.svg', 'Ollama'], nvidia: ['nvidia.svg', 'NVIDIA'], cohere: ['cohere.svg', 'Cohere'],
  // AI Gateways mind map (data/mindmaps/gateway.ts)
  cloudflare: ['cloudflare.svg', 'Cloudflare'], kong: ['kong.svg', 'Kong'], envoy: ['envoy.svg', 'Envoy'], vault: ['vault.svg', 'HashiCorp Vault'],
  opentelemetry: ['opentelemetry.svg', 'OpenTelemetry'], openrouter: ['openrouter.svg', 'OpenRouter'],
  // Project stack chips (lib/content/techLogos.ts): marks for the tools the case studies name, from Simple Icons (CC0)
  threejs: ['threejs.svg', 'Three.js'], keycloak: ['keycloak.svg', 'Keycloak'], terraform: ['terraform.svg', 'Terraform'], prometheus: ['prometheus.svg', 'Prometheus'], grafana: ['grafana.svg', 'Grafana'], argo: ['argo.svg', 'Argo'], opencv: ['opencv.svg', 'OpenCV'], scrapy: ['scrapy.svg', 'Scrapy'], sqlalchemy: ['sqlalchemy.svg', 'SQLAlchemy'], firebase: ['firebase.svg', 'Firebase'], vue: ['vue.svg', 'Vue.js'], hubspot: ['hubspot.svg', 'HubSpot'], duckdb: ['duckdb.svg', 'DuckDB'], rabbitmq: ['rabbitmq.svg', 'RabbitMQ'], ffmpeg: ['ffmpeg.svg', 'FFmpeg'], onnx: ['onnx.svg', 'ONNX'], gcal: ['gcal.svg', 'Google Calendar'], gmail: ['gmail.svg', 'Gmail'], gsheets: ['gsheets.svg', 'Google Sheets'], x: ['x.svg', 'X (Twitter)'], reddit: ['reddit.svg', 'Reddit'], kaggle: ['kaggle.svg', 'Kaggle'], digitalocean: ['digitalocean.svg', 'DigitalOcean'], helm: ['helm.svg', 'Helm'], tanstack: ['tanstack.svg', 'TanStack Query'], pydantic: ['pydantic.svg', 'Pydantic'], zoho: ['zoho.svg', 'Zoho'], resend: ['resend.svg', 'Resend'], apple: ['apple.svg', 'Apple'], trivy: ['trivy.svg', 'Trivy'], intel: ['intel.svg', 'Intel OpenVINO'], whatsapp: ['whatsapp.svg', 'WhatsApp'], pytest: ['pytest.svg', 'pytest'], ruff: ['ruff.svg', 'Ruff'], sqlite: ['sqlite.svg', 'SQLite'], paperspace: ['paperspace.svg', 'Paperspace'], mqtt: ['mqtt.svg', 'MQTT'],
  // DevOps/MLOps node (Nov 25 2026): queues, GPU and model serving, monitoring. NVIDIA's own tools have no separate marks, so they reuse the NVIDIA eye under their own names
  celery: ['celery.svg', 'Celery'], twilio: ['twilio.svg', 'Twilio'], deepgram: ['deepgram.svg', 'Deepgram'], elevenlabs: ['elevenlabs.svg', 'ElevenLabs'], traefik: ['traefik.svg', 'Traefik'],
  harness: ['harness-eng.svg', 'Harness Engineering'], loopeng: ['loop-eng.svg', 'Loop Engineering'], a2a: ['a2a.svg', 'A2A (Agent2Agent)'], owaspgenai: ['owasp.svg', 'OWASP Top 10 for LLM & GenAI'], aigateway: ['ai-gateway.svg', 'AI Gateway'], inferopt: ['inference-opt.svg', 'Inference Optimization'], gpu: ['nvidia.svg', 'GPU (NVIDIA)'], tp: ['tp.svg', 'Tensor Parallelism (TP)'], dp: ['dp.svg', 'Data Parallelism (DP)'], quant: ['quant.svg', 'Quantization (FP8, INT4, AWQ, GPTQ, NVFP4)'], moe: ['moe.svg', 'Mixture of Experts (MoE)'], rlhf: ['rlhf.svg', 'RLHF (reinforcement learning from human feedback)'], rlvr: ['rlvr.svg', 'RLVR (reinforcement learning with verifiable rewards)'], improveloop: ['improve-loop.svg', 'Improvement Loop'], cuda: ['nvidia.svg', 'NVIDIA CUDA'], vllm: ['vllm.svg', 'vLLM'], sglang: ['sglang.png', 'SGLang'], tensorrt: ['nvidia.svg', 'NVIDIA TensorRT-LLM'],
  triton: ['nvidia.svg', 'NVIDIA Triton Inference Server'], ray: ['ray.svg', 'Ray'], deepspeed: ['deepspeed.png', 'DeepSpeed'], nccl: ['nvidia.svg', 'NVIDIA NCCL'], llmd: ['llm-d.png', 'llm-d'],
  loki: ['loki.png', 'Grafana Loki'], datadog: ['datadog.svg', 'Datadog'], sentry: ['sentry.svg', 'Sentry'], dcgm: ['nvidia.svg', 'NVIDIA DCGM'],
  // open models measured in the Audit Pro benchmark (data/projects/auditproBench.ts): Phi has no mark of its own, so it reuses Microsoft's, Granite uses IBM's
  phi: ['microsoft.svg', 'Microsoft Phi'], granite: ['ibm.svg', 'IBM Granite'],
  // typed decision models (Jev and its open, Jev-compatible alternatives); Clef has no mark of its own, so it uses Cloudflare's
  framer: ['framer.svg', 'Framer'],
  jev: ['typesafe.svg', 'Jev (TypeSafe)'], laya: ['laya.svg', 'Laya (Convai Innovations)'], clef: ['cloudflare.svg', 'Cloudflare Clef'], h2o: ['h2o.png', 'H2O-Lightning (H2O.ai)'],
} as const;
export type LogoId = keyof typeof logos;
export const logoSrc = (id: LogoId) => '/logos/' + logos[id][0];
export const logoScale = (id: LogoId): number => (logos[id] as readonly [string, string, number?])[2] ?? 1;
