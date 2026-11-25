import type { Flow } from './types';

export const flow: Flow = {
  nodes: [
    {
      id: 'auditor', group: 'user', col: 0, row: 0,
      label: { en: 'Auditor', es: 'Auditor' },
      notes: {
        en: ['Gives Audit Pro a PDF, a link or pasted text.', 'Findings are drafts for an auditor to verify, not a verdict.'],
        es: ['Le da a Audit Pro un PDF, un enlace o texto pegado.', 'Los hallazgos son borradores que el auditor verifica, no un veredicto.'],
      },
    },
    {
      id: 'reports', group: 'data', col: 0, row: 1,
      label: { en: 'Synthetic IFRS reports', es: 'Informes NIIF sintéticos' },
      notes: {
        en: ['A generator builds reports for invented companies and injects errors into the printed figures.', 'It keeps the exact answer for each one, so scoring needs no LLM judge.'],
        es: ['Un generador crea informes de empresas inventadas e inyecta errores en las cifras impresas.', 'Guarda la respuesta exacta de cada uno, así que puntuar no necesita un LLM como juez.'],
      },
    },
    {
      id: 'ui', group: 'frontend', col: 1, row: 0, tech: 'Next.js React',
      label: { en: 'Audit UI', es: 'Auditar un informe' },
      notes: {
        en: ['Upload a report and read the errors and points of interest.', 'The dashboard uses basic auth and keeps the API key on the server.'],
        es: ['Sube un informe y lee los errores y los puntos de interés.', 'El dashboard usa autenticación básica y guarda la clave en el servidor.'],
      },
    },
    {
      id: 'api', group: 'backend', col: 1, row: 1, tech: 'FastAPI Pydantic',
      label: { en: 'OpenAI-compatible API', es: 'API compatible con OpenAI' },
      notes: {
        en: ['POST /v1/chat/completions takes the report as text or a base64 PDF and returns the audit JSON.', 'Admits at most four audits at once, left of the goodput knee.', 'A partial result is marked 206, so no half answer looks complete.'],
        es: ['POST /v1/chat/completions recibe el informe como texto o PDF en base64 y devuelve el JSON de la auditoría.', 'Admite como mucho cuatro auditorías a la vez, antes del codo del goodput.', 'Un resultado parcial se marca con 206, así que media respuesta nunca parece completa.'],
      },
    },
    {
      id: 'lab', group: 'frontend', col: 1, row: 2, tech: 'Next.js',
      label: { en: 'Benchmark lab', es: 'Laboratorio de benchmarks' },
      notes: {
        en: ['Where the model is chosen and served: 76 setups of 19 open models measured on one RTX 4090.', 'A capacity planner shows free VRAM, weights, KV cache and how many users fit.', 'A/B decisions with bootstrap intervals and Holm-corrected p-values.'],
        es: ['Donde se elige y se sirve el modelo: 76 configuraciones de 19 modelos abiertos medidas en una RTX 4090.', 'Un planificador de capacidad muestra la VRAM libre, los pesos, la caché KV y cuántos usuarios caben.', 'Decisiones A/B con intervalos bootstrap y p-valores corregidos con Holm.'],
      },
    },
    {
      id: 'ingest', group: 'backend', col: 2, row: 0,
      label: { en: 'Ingest', es: 'Ingesta' },
      notes: {
        en: ['Reads the PDF page by page, a web page or pasted text.', 'Page and size limits, and an SSRF guard for links.'],
        es: ['Lee el PDF página a página, una página web o texto pegado.', 'Límites de páginas y tamaño, y una protección SSRF para los enlaces.'],
      },
    },
    {
      id: 'extract', group: 'ai', col: 3, row: 0,
      label: { en: 'Classifier + extractor', es: 'Clasificador + extractor' },
      notes: {
        en: ['The classifier finds company, currency, unit, period end and the statement type of every page.', 'The extractor turns each page into line items; a value not printed on its cited page is dropped.'],
        es: ['El clasificador encuentra empresa, moneda, unidad, cierre del periodo y tipo de estado de cada página.', 'El extractor convierte cada página en partidas; un valor que no está en su página citada se descarta.'],
      },
    },
    {
      id: 'checks', group: 'backend', col: 4, row: 0,
      label: { en: 'Deterministic checks', es: 'Verificador determinista' },
      notes: {
        en: ['Exact decimal maths and no model: accounting equation, totals, cash-flow chain, retained earnings.', 'Produces the "page X does not correspond with page Y" findings.'],
        es: ['Aritmética decimal exacta y sin modelo: ecuación contable, totales, flujos de efectivo, reservas.', 'De aquí salen los hallazgos "la página X no corresponde con la página Y".'],
      },
    },
    {
      id: 'specialists', group: 'ai', col: 4, row: 1,
      label: { en: 'IFRS specialist agents', es: 'Agentes especialistas NIIF' },
      notes: {
        en: ['Run in parallel, each on the pages routed to it.', 'Presentation, revenue and receivables, assets and impairment, cash flow, provisions and tax.'],
        es: ['Trabajan en paralelo, cada uno con las páginas que le corresponden.', 'Presentación, ingresos y deudores, activos y deterioro, flujos de efectivo, provisiones e impuestos.'],
      },
    },
    {
      id: 'critic', group: 'ai', col: 5, row: 0,
      label: { en: 'Grounding, critic, schema', es: 'Anclaje, crítico, esquema' },
      notes: {
        en: ["A finding's quote must match the cited page, or it is dropped.", 'Below 0.5 confidence a finding becomes a point of interest instead of an error.', 'Remove duplicates, sort by severity, validate the answer against the JSON Schema.'],
        es: ['La cita de un hallazgo debe coincidir con la página citada o se descarta.', 'Con confianza por debajo de 0,5 pasa a ser un punto de interés en lugar de un error.', 'Quitar duplicados, ordenar por gravedad y validar la respuesta contra el JSON Schema.'],
      },
    },
    {
      id: 'vllm', group: 'ai', col: 5, row: 1, tech: 'vLLM Qwen3',
      label: { en: 'vLLM, Qwen3-14B FP8', es: 'vLLM, Qwen3-14B FP8' },
      notes: {
        en: ['Highest quality score (70.8); the paired A/B test rejected 4-bit AWQ on numeric accuracy.', 'Every call asks for schema-constrained JSON at temperature 0.', 'Qwen3-14B AWQ and Phi-4 FP8 sit on disk as fallbacks, a one-minute switch.'],
        es: ['La mejor puntuación de calidad (70,8); la prueba A/B emparejada rechazó AWQ de 4 bits por exactitud numérica.', 'Cada llamada pide JSON restringido por esquema con temperatura 0.', 'Qwen3-14B AWQ y Phi-4 FP8 están en disco como respaldo, a un minuto de cambio.'],
      },
    },
    {
      id: 'gpu', group: 'infra', tech: 'NVIDIA RTX 4090',
      label: { en: "Firm's own GPU", es: 'GPU de la propia firma' },
      notes: {
        en: ["Client reports cannot go to an outside API, so all inference runs on the firm's own GPU.", 'Benchmarks on rented RTX 4090s use synthetic reports only.'],
        es: ['Los informes del cliente no pueden ir a una API externa, así que toda la inferencia corre en su GPU.', 'Los benchmarks en RTX 4090 alquiladas usan solo informes sintéticos.'],
      },
    },
    {
      id: 'deploy', group: 'infra', tech: 'Docker Helm',
      label: { en: 'Docker + Helm', es: 'Docker + Helm' },
      notes: {
        en: ['One image holds vLLM, the API, the dashboard, Prometheus and Grafana for a single GPU server.', 'The Helm chart runs them as separate pods with KEDA autoscaling.'],
        es: ['Una sola imagen reúne vLLM, la API, el dashboard, Prometheus y Grafana para un servidor con una GPU.', 'El chart de Helm los ejecuta como pods separados con autoescalado con KEDA.'],
      },
    },
    {
      id: 'ci', group: 'infra', tech: 'GitHub Actions',
      label: { en: 'CI, signed images', es: 'CI, imágenes firmadas' },
      notes: {
        en: ['GitHub Actions builds the images, signs them by digest with cosign and scans them.', '251 tests run without a GPU against a stand-in engine.'],
        es: ['GitHub Actions construye las imágenes, las firma por digest con cosign y las escanea.', '251 tests se ejecutan sin GPU contra un motor simulado.'],
      },
    },
    {
      id: 'monitoring', group: 'infra', tech: 'Prometheus Grafana',
      label: { en: 'Prometheus + Grafana', es: 'Prometheus + Grafana' },
      notes: {
        en: ['Grafana dashboards for vLLM, the GPU and audit quality behind the Live tiles.'],
        es: ['Dashboards de Grafana para vLLM, la GPU y la calidad de las auditorías detrás de los paneles en directo.'],
      },
    },
    {
      id: 'auth', group: 'security',
      label: { en: 'Keys, network policies', es: 'Claves, políticas de red' },
      notes: {
        en: ['The API needs a key on every audit and metrics route.', 'Request bodies and prompts are never logged; non-root containers and network policies.'],
        es: ['La API pide una clave en cada ruta de auditoría y de métricas.', 'Nunca se registran cuerpos ni prompts; contenedores sin root y políticas de red.'],
      },
    },
    {
      id: 'weights', group: 'security', tech: 'Hugging Face',
      label: { en: 'Verified model weights', es: 'Pesos verificados' },
      notes: {
        en: ["Weights are downloaded once and checked against Hugging Face's SHA-256 hashes.", 'The engine then runs offline.'],
        es: ['Los pesos se descargan una vez y se comprueban con los hashes SHA-256 de Hugging Face.', 'Después el motor funciona sin conexión.'],
      },
    },
  ],
  edges: [
    { from: 'auditor', to: 'ui', label: { en: 'upload', es: 'subida' } },
    { from: 'auditor', to: 'api', label: { en: 'OpenAI format', es: 'formato OpenAI' } },
    { from: 'ui', to: 'ingest', label: { en: 'report', es: 'informe' } },
    { from: 'api', to: 'ingest', label: { en: 'PDF, link, text', es: 'PDF, enlace, texto' } },
    { from: 'reports', to: 'lab', label: { en: 'ground truth', es: 'respuesta exacta' } },
    { from: 'ingest', to: 'extract', label: { en: 'pages', es: 'páginas' } },
    { from: 'extract', to: 'checks', label: { en: 'line items', es: 'partidas' } },
    { from: 'extract', to: 'specialists', label: { en: 'routed pages', es: 'páginas' } },
    { from: 'extract', to: 'vllm', label: { en: 'JSON calls', es: 'llamadas JSON' } },
    { from: 'specialists', to: 'vllm' },
    { from: 'checks', to: 'critic', label: { en: 'findings', es: 'hallazgos' } },
    { from: 'specialists', to: 'critic', label: { en: 'findings', es: 'hallazgos' } },
    { from: 'lab', to: 'vllm', label: { en: 'picks model', es: 'elige modelo' } },
  ],
};
