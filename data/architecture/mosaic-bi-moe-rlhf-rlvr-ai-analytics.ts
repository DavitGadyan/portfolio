import type { Flow } from './types';

/** Mosaic BI: a question flows through the MoE router to the analyst experts, every call through the AI Gateway, verified findings to the report. */
export const flow: Flow = {
  nodes: [
    {
      id: 'user', group: 'user', col: 0, row: 0,
      label: { en: 'Manager or analyst', es: 'Directivo o analista' },
      notes: {
        en: ['Asks a business question in plain English, for example why revenue fell this quarter.', 'Reviewers also rate findings and compare answers: the RLHF signal.'],
        es: ['Hace una pregunta de negocio en lenguaje natural, por ejemplo por qué han caído los ingresos.', 'Los revisores también valoran hallazgos y comparan respuestas: la señal de RLHF.'],
      },
    },
    {
      id: 'ui', group: 'frontend', col: 1, row: 0, tech: 'Next.js',
      label: { en: 'Executive UI', es: 'Interfaz ejecutiva' },
      notes: {
        en: ['Dashboard, live investigation timeline, evidence explorer, reports, Training Studio, MoE Lab and gateway admin.', 'KPIs come from SQL, never from the model.'],
        es: ['Panel, cronología en vivo, explorador de evidencia, informes, Training Studio, MoE Lab y administración del gateway.', 'Los KPI salen de SQL, nunca del modelo.'],
      },
    },
    {
      id: 'orch', group: 'backend', col: 2, row: 0, tech: 'FastAPI LangGraph',
      label: { en: 'Investigation engine', es: 'Motor de investigación' },
      notes: {
        en: ['A LangGraph state machine: clarify, plan, execute, report.', 'Stops with a clarification instead of guessing when an approved revenue metric is missing.'],
        es: ['Una máquina de estados de LangGraph: aclarar, planificar, ejecutar, informar.', 'Se detiene con una pregunta en lugar de adivinar si falta una métrica de ingresos aprobada.'],
      },
    },
    {
      id: 'router', group: 'ai', col: 3, row: 0,
      label: { en: 'MoE router (roles)', es: 'Router MoE (roles)' },
      notes: {
        en: ['Layer A: picks the minimum set of analyst experts for the question and the data that exists.', 'Builds the dependency graph; independent experts run in parallel.'],
        es: ['Capa A: elige el mínimo de expertos para la pregunta y los datos disponibles.', 'Construye el grafo de dependencias; los expertos independientes trabajan en paralelo.'],
      },
    },
    {
      id: 'experts', group: 'ai', col: 4, row: 0,
      label: { en: '7 analyst experts', es: '7 analistas expertos' },
      notes: {
        en: ['Data, Finance, Marketing, Sales, Customer, Statistician and Executive Advisor.', 'Each runs a deterministic analysis pack, then one bounded model pass with a strict output schema.'],
        es: ['Datos, Finanzas, Marketing, Ventas, Clientes, Estadístico y Asesor ejecutivo.', 'Cada uno ejecuta un paquete de análisis determinista y una pasada acotada del modelo con esquema estricto.'],
      },
    },
    {
      id: 'gw', group: 'security', col: 5, row: 0, tech: 'OWASP',
      label: { en: 'AI Gateway', es: 'Gateway de IA' },
      notes: {
        en: ['Deny by default: model, tool and SQL proxies, budgets, DLP, trust labels, audit.', 'Controls mapped to the OWASP Top 10 for LLM applications, 30+ security tests.'],
        es: ['Deniega por defecto: proxies de modelos, herramientas y SQL, presupuestos, DLP, etiquetas de confianza, auditoría.', 'Controles alineados con el OWASP Top 10 para aplicaciones LLM, más de 30 tests de seguridad.'],
      },
    },
    {
      id: 'models', group: 'ai', col: 6, row: 0, tech: 'Ollama Claude',
      label: { en: 'MoE models + Claude', es: 'Modelos MoE + Claude' },
      notes: {
        en: ['Layer B: DeepSeek-V2-Lite (64 routed experts) and Qwen MoE on Ollama, Claude over the API.', 'The MoE Lab shows router telemetry only when it is real.'],
        es: ['Capa B: DeepSeek-V2-Lite (64 expertos enrutados) y Qwen MoE en Ollama, Claude por API.', 'El MoE Lab solo muestra telemetría del router cuando es real.'],
      },
    },
    {
      id: 'duck', group: 'data', col: 6, row: 1, tech: 'DuckDB',
      label: { en: 'DuckDB per workspace', es: 'DuckDB por espacio' },
      notes: {
        en: ['One read-only file per tenant; SQL parsed with sqlglot against an allowlist; row filters added.', 'Every query result is stored as evidence.'],
        es: ['Un fichero de solo lectura por cliente; SQL analizado con sqlglot contra una lista permitida; filtros de filas añadidos.', 'Cada resultado se guarda como evidencia.'],
      },
    },
    {
      id: 'verify', group: 'backend', col: 5, row: 1,
      label: { en: 'Verifiers', es: 'Verificadores' },
      notes: {
        en: ['Numbers must match their evidence, the revenue bridge must reconcile, no unsupported causal claims.', 'The same checks are the RLVR rewards for training.'],
        es: ['Las cifras deben coincidir con su evidencia, el puente de ingresos debe cuadrar y no se admiten afirmaciones causales sin respaldo.', 'Las mismas comprobaciones son las recompensas de RLVR.'],
      },
    },
    {
      id: 'report', group: 'frontend', col: 6, row: 2,
      label: { en: 'Verified report', es: 'Informe verificado' },
      notes: {
        en: ['Executive and role reports, approved before viewers see them; PDF, XLSX and CSV export with formula escaping.'],
        es: ['Informes ejecutivo y por rol, aprobados antes de que los vean otros; exportación a PDF, XLSX y CSV con fórmulas escapadas.'],
      },
    },
    {
      id: 'train', group: 'infra', tech: 'PyTorch Hugging Face',
      label: { en: 'RLHF + RLVR training', es: 'Entrenamiento RLHF + RLVR' },
      notes: {
        en: ['Per-expert QLoRA adapters on an RTX 4090: SFT, GRPO with verifier rewards, DPO on preference pairs.', 'Pipeline built and tested; first GPU runs are the next step.'],
        es: ['Adaptadores QLoRA por experto en una RTX 4090: SFT, GRPO con recompensas de verificadores, DPO con pares de preferencia.', 'Pipeline construido y probado; las primeras ejecuciones en GPU son el siguiente paso.'],
      },
    },
    {
      id: 'registry', group: 'infra',
      label: { en: 'Model registry + gate', es: 'Registro + control' },
      notes: {
        en: ['An adapter must beat the baseline with no safety regression, then canary, promote, rollback.'],
        es: ['Un adaptador debe superar la línea base sin regresión de seguridad; después canary, promoción y vuelta atrás.'],
      },
    },
    {
      id: 'stores', group: 'infra', tech: 'Docker PostgreSQL Redis',
      label: { en: 'Docker Compose stack', es: 'Stack Docker Compose' },
      notes: {
        en: ['PostgreSQL, Redis, MinIO, Vault, the analysis sandbox, backend, worker and frontend.'],
        es: ['PostgreSQL, Redis, MinIO, Vault, el sandbox de análisis, backend, worker y frontend.'],
      },
    },
    {
      id: 'vault', group: 'security', tech: 'HashiCorp Vault',
      label: { en: 'HashiCorp Vault', es: 'HashiCorp Vault' },
      notes: {
        en: ['Every secret lives here; APIs return status, never values.'],
        es: ['Aquí vive cada secreto; las APIs devuelven el estado, nunca el valor.'],
      },
    },
    {
      id: 'audit', group: 'security',
      label: { en: 'RBAC + hash-chained audit', es: 'RBAC + auditoría encadenada' },
      notes: {
        en: ['Five roles, membership checked on every request, a SHA-256 audit chain that can be verified.'],
        es: ['Cinco roles, pertenencia comprobada en cada petición y una cadena de auditoría SHA-256 verificable.'],
      },
    },
  ],
  edges: [
    { from: 'user', to: 'ui', label: { en: 'question', es: 'pregunta' } },
    { from: 'ui', to: 'orch', label: { en: 'SSE', es: 'SSE' } },
    { from: 'orch', to: 'router', label: { en: 'plan', es: 'plan' } },
    { from: 'router', to: 'experts', label: { en: 'roles', es: 'roles' } },
    { from: 'experts', to: 'gw', label: { en: 'every call', es: 'cada llamada' } },
    { from: 'gw', to: 'models', label: { en: 'prompts', es: 'prompts' } },
    { from: 'gw', to: 'duck', label: { en: 'SQL', es: 'SQL' } },
    { from: 'experts', to: 'verify', label: { en: 'findings', es: 'hallazgos' } },
    { from: 'verify', to: 'report', label: { en: 'verified', es: 'verificado' } },
  ],
};
