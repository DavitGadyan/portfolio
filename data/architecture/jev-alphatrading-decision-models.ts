import type { Flow } from './types';

/** Jev AlphaTrading: sourced only from content/en|es/projects/jev-alphatrading-decision-models.mdx (engineering only). */
export const flow: Flow = {
  nodes: [
    {
      id: 'trader', group: 'user', col: 0, row: 0,
      label: { en: 'Trader', es: 'Trader' },
      notes: {
        en: ['Wanted a discretionary day-trading strategy a machine can decide, test and improve.'],
        es: ['Quería una estrategia discrecional de day trading que una máquina pudiera decidir, probar y mejorar.'],
      },
    },
    {
      id: 'market-data', group: 'data', col: 0, row: 1, tech: 'Binance MongoDB',
      label: { en: 'Binance market data', es: 'Datos de Binance' },
      notes: {
        en: ['1-minute candles in MongoDB with a Parquet cache.', 'Market data is read-only.'],
        es: ['Velas de 1 minuto en MongoDB con caché Parquet.', 'Los datos de mercado son de solo lectura.'],
      },
    },
    {
      id: 'console', group: 'frontend', col: 1, row: 0, tech: 'Next.js React TradingView',
      label: { en: 'Research console', es: 'Consola de investigación' },
      notes: {
        en: ['Live decisions per coin, backtests, learning loop, question editor, strategy research, settings.', 'Next.js with TradingView charts.'],
        es: ['Decisiones en vivo por moneda, backtests, ciclo de aprendizaje, editor de preguntas, investigación y ajustes.', 'Next.js con gráficos de TradingView.'],
      },
    },
    {
      id: 'api', group: 'backend', col: 1, row: 1, tech: 'FastAPI',
      label: { en: 'API and job runner', es: 'API y ejecutor de tareas' },
      notes: {
        en: ['FastAPI with a job runner and a progress stream for backtests.', 'Refuses runs that exceed the evaluation budget.'],
        es: ['FastAPI con ejecutor de tareas y progreso en tiempo real de los backtests.', 'Rechaza las ejecuciones que superan el presupuesto.'],
      },
    },
    {
      id: 'rule-engine', group: 'backend', col: 2, row: 0,
      label: { en: 'Rule engine', es: 'Motor de reglas' },
      notes: {
        en: ['Deterministic: processes 1-minute candles one bar at a time and produces exact facts.', 'Trend on daily, hourly and 5-minute frames, stop and target levels, reward-to-risk after costs.', 'Rebuilt incrementally, proven equal to the original on 500 random price series.'],
        es: ['Determinista: procesa velas de 1 minuto barra a barra y produce hechos exactos.', 'Tendencia diaria, horaria y de 5 minutos, niveles de stop y objetivo, beneficio-riesgo tras costes.', 'Reconstruido incremental, igual al original en 500 series de precios aleatorias.'],
      },
    },
    {
      id: 'questions', group: 'backend', col: 2, row: 1,
      label: { en: 'Typed question set', es: 'Preguntas tipadas' },
      notes: {
        en: ['Versioned set of 32 typed questions in 8 stages: the engine answers 25, the model 7.', 'Each records who answers it, its role and whether it is a rule or a hypothesis.', 'The question editor validates every change before it can go live.'],
        es: ['Conjunto versionado de 32 preguntas tipadas en 8 etapas: el motor responde 25, el modelo 7.', 'Cada una registra quién la responde, su papel y si es regla o hipótesis.', 'El editor de preguntas valida cada cambio antes de que entre en vivo.'],
      },
    },
    {
      id: 'decision-model', group: 'ai', col: 3, row: 0, tech: 'Jev 1.14, Microsoft Decision-1.1',
      label: { en: 'Decision models', es: 'Modelos de decisión' },
      notes: {
        en: ['Jev 1.14 and Microsoft Decision-1.1 through the OpenRouter Decisions API, switched in settings.', 'Chooses among candidates the engine built; it never invents a price.', 'Cached answers, a hard spend cap, and a refusal always counts as no.'],
        es: ['Jev 1.14 y Microsoft Decision-1.1 a través de la API Decisions de OpenRouter, elegidos en configuración.', 'Elige entre candidatos que construyó el motor; nunca inventa un precio.', 'Respuestas en caché, tope fijo de gasto, y una negativa siempre cuenta como no.'],
      },
    },
    {
      id: 'backtester', group: 'backend', col: 3, row: 1,
      label: { en: '1-minute backtester', es: 'Backtester de 1 minuto' },
      notes: {
        en: ['Fills at the next minute open, stop before target inside a minute, 0.10% fees plus slippage per side.', 'Compared with buy-and-hold, random entries and trend-filtered random entries.'],
        es: ['Llena en la apertura del minuto siguiente, stop antes que objetivo, 0,10 % de comisión más deslizamiento.', 'Comparado con comprar y mantener, entradas aleatorias y aleatorias filtradas por tendencia.'],
      },
    },
    {
      id: 'ledger', group: 'backend', col: 4, row: 0,
      label: { en: 'Trial ledger', es: 'Registro de pruebas' },
      notes: {
        en: ['Every evaluation is written to a hash-chained ledger.', 'Budgets: 40 evaluations on 2021-2024, 12 looks on 2025, a single test look on 2026.'],
        es: ['Cada evaluación se escribe en un registro encadenado por hash.', 'Presupuestos: 40 evaluaciones en 2021-2024, 12 consultas en 2025, una sola consulta de prueba en 2026.'],
      },
    },
    {
      id: 'rlvr', group: 'ai', col: 4, row: 1,
      label: { en: 'RLVR learning loop', es: 'Ciclo RLVR' },
      notes: {
        en: ['Scores every decision by its realised outcome, net of fees, and proposes one change at a time.', 'Promotes a version only when confidence bound, folds and coins agree on unseen data.', 'First accepted change cut the loss per trade by 63%; any version can be rolled back.'],
        es: ['Puntúa cada decisión con su resultado real, neto de comisiones, y propone un cambio cada vez.', 'Promueve una versión solo si cota de confianza, tramos y monedas coinciden en datos no vistos.', 'El primer cambio aceptado redujo la pérdida por operación un 63 %; toda versión se puede revertir.'],
      },
    },
    {
      id: 'results', group: 'data', col: 4, row: 2, tech: 'SQLite Postgres',
      label: { en: 'Results store', es: 'Resultados' },
      notes: {
        en: ['Backtest and research results in SQLite or Postgres.'],
        es: ['Resultados de backtests e investigación en SQLite o Postgres.'],
      },
    },
    {
      id: 'paper', group: 'backend', col: 5, row: 0,
      label: { en: 'Live paper trading', es: 'Paper trading en vivo' },
      notes: {
        en: ['The trend rule decides once a day from closed Binance bars with exactly the backtest code.', 'Fills at the live price, charges fees and marks the portfolio at the close.', 'Live since 18 November 2026.'],
        es: ['La regla de tendencia decide una vez al día con barras cerradas de Binance y el código del backtest.', 'Llena al precio en vivo, cobra comisiones y valora la cartera al cierre.', 'En vivo desde el 18 de noviembre de 2026.'],
      },
    },
    {
      id: 'tests', group: 'infra', tech: 'pytest',
      label: { en: '837 automated tests', es: '837 tests automáticos' },
      notes: {
        en: ['pytest and Vitest: 837 tests.'],
        es: ['pytest y Vitest: 837 tests.'],
      },
    },
    {
      id: 'servers', group: 'infra', tech: 'Ubuntu MongoDB',
      label: { en: 'Ubuntu services', es: 'Servicios en Ubuntu' },
      notes: {
        en: ['Runs as Ubuntu services, with MongoDB reached over an SSH tunnel.'],
        es: ['Se ejecuta como servicios de Ubuntu, con MongoDB a través de un túnel SSH.'],
      },
    },
    {
      id: 'anon', group: 'security',
      label: { en: 'Anonymised model input', es: 'Entrada anonimizada' },
      notes: {
        en: ['The model never sees the coin, the date or a price, so it cannot recall what happened next.'],
        es: ['El modelo nunca ve la moneda, la fecha ni un precio, así que no puede recordar qué pasó después.'],
      },
    },
    {
      id: 'keys', group: 'security',
      label: { en: 'Server-side API key', es: 'Clave de API en servidor' },
      notes: {
        en: ['The API key stays on the server and market data is read-only.'],
        es: ['La clave de API se queda en el servidor y los datos de mercado son de solo lectura.'],
      },
    },
    {
      id: 'no-lookahead', group: 'security',
      label: { en: 'Look-ahead tests', es: 'Tests sin mirar el futuro' },
      notes: {
        en: ['A test checks that no decision changes when all later data is removed.', 'Data is split once and frozen to stop over-fitting.'],
        es: ['Un test comprueba que ninguna decisión cambia al quitar todos los datos posteriores.', 'Los datos se dividen una vez y se congelan para impedir el sobreajuste.'],
      },
    },
  ],
  edges: [
    { from: 'trader', to: 'console' },
    { from: 'console', to: 'api' },
    { from: 'console', to: 'questions', label: { en: 'Editor', es: 'Editor' } },
    { from: 'market-data', to: 'rule-engine', label: { en: '1-min candles', es: 'Velas 1 min' } },
    { from: 'api', to: 'rule-engine', label: { en: 'Jobs', es: 'Tareas' } },
    { from: 'rule-engine', to: 'decision-model', label: { en: 'Candidates', es: 'Candidatos' } },
    { from: 'questions', to: 'decision-model', label: { en: '7 questions', es: '7 preguntas' } },
    { from: 'rule-engine', to: 'backtester', label: { en: 'Facts', es: 'Hechos' } },
    { from: 'decision-model', to: 'backtester', label: { en: 'Decision', es: 'Decisión' } },
    { from: 'backtester', to: 'ledger', label: { en: 'Evaluation', es: 'Evaluación' } },
    { from: 'backtester', to: 'results' },
    { from: 'backtester', to: 'rlvr', label: { en: 'Outcomes', es: 'Resultados' } },
    { from: 'rlvr', to: 'questions', label: { en: 'New version', es: 'Nueva versión' } },
    { from: 'api', to: 'paper', label: { en: 'Daily', es: 'Diario' } },
    { from: 'market-data', to: 'paper', label: { en: 'Closed bars', es: 'Barras cerradas' } },
  ],
};
