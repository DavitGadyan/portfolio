import type { Flow } from './types';

export const flow: Flow = {
  nodes: [
    {
      id: 'user', group: 'user', col: 0, row: 0,
      label: { en: 'User speaking aloud', es: 'Usuario hablando' },
      notes: {
        en: ['Picks a real-world scene, holds one button and talks; there is no typing.', 'App in English, Spanish and Russian.'],
        es: ['Elige una escena real, mantiene pulsado un botón y habla; no se escribe nada.', 'App en inglés, español y ruso.'],
      },
    },
    {
      id: 'brief', group: 'user', col: 0, row: 1,
      label: { en: 'Campaign brief', es: 'Brief de campaña' },
      notes: {
        en: ['One brief produces tailored ad variants for each customer segment and platform.'],
        es: ['Un solo brief produce variantes de anuncio por segmento de cliente y plataforma.'],
      },
    },
    {
      id: 'app', group: 'frontend', col: 1, row: 0, tech: 'React Native',
      label: { en: 'React Native app (Expo)', es: 'App React Native (Expo)' },
      notes: {
        en: ['Expo on the New Architecture for iOS and Android, dark and derived light themes.', 'One session path: setup, live voice call, score, history.', 'Only the portrait flexes on the live screen, so controls never leave the screen.'],
        es: ['Expo sobre la New Architecture para iOS y Android, tema oscuro y claro derivado.', 'Un único camino de sesión: configuración, llamada de voz en directo, puntuación, historial.', 'En la pantalla en directo solo se estira el retrato, así los controles nunca salen de la pantalla.'],
      },
    },
    {
      id: 'claude', group: 'ai', col: 1, row: 1, tech: 'Claude',
      label: { en: 'Claude creative direction', es: 'Dirección creativa Claude' },
      notes: {
        en: ['Claude drives the prompts and creative direction for each customer segment and platform.'],
        es: ['Claude dirige los prompts y la dirección creativa para cada segmento y plataforma.'],
      },
    },
    {
      id: 'persona', group: 'ai', col: 2, row: 0, tech: 'OpenAI',
      label: { en: 'Live AI persona', es: 'Personaje de IA en directo' },
      notes: {
        en: ['Answers aloud in real time over OpenAI real-time voice and WebRTC.', 'Simulate runs multi-round scenarios against different personality blends.'],
        es: ['Responde en voz alta y en tiempo real sobre OpenAI real-time voice y WebRTC.', 'Simulate ejecuta escenarios de varias rondas contra distintas mezclas de personalidad.'],
      },
    },
    {
      id: 'api', group: 'backend', col: 2, row: 1, tech: 'FastAPI',
      label: { en: 'FastAPI back end', es: 'Back end FastAPI' },
      notes: {
        en: ['FastAPI with Postgres and Redis behind it.'],
        es: ['FastAPI con Postgres y Redis detrás.'],
      },
    },
    {
      id: 'higgsfield', group: 'ai', col: 2, row: 2,
      label: { en: 'Higgsfield API pipeline', es: 'Pipeline API de Higgsfield' },
      notes: {
        en: ['A pipeline on the Higgsfield API turns the brief into video ads; the code is on GitHub.'],
        es: ['Un pipeline sobre la API de Higgsfield convierte el brief en anuncios; el código está en GitHub.'],
      },
    },
    {
      id: 'score', group: 'ai', col: 3, row: 0,
      label: { en: 'Charisma Score', es: 'Charisma Score' },
      notes: {
        en: ['Pace, pauses, intonation and fillers, measured from your own voice rather than guessed.', 'Weighs fluency, confidence and improvisation (40 / 35 / 25 %).', 'Line-level feedback: what worked and what to work on.'],
        es: ['Ritmo, pausas, entonación y muletillas, medidos desde tu propia voz y no estimados.', 'Pondera fluidez, confianza e improvisación (40 / 35 / 25 %).', 'Feedback línea a línea: qué funcionó y qué mejorar.'],
      },
    },
    {
      id: 'profile', group: 'backend', col: 3, row: 1,
      label: { en: 'Profile reader', es: 'Lector de perfiles' },
      notes: {
        en: ['Playwright-based reader for Custom Practice.', 'Builds a persona from a description or a public Instagram profile.'],
        es: ['Lector basado en Playwright para Custom Practice.', 'Crea un personaje a partir de una descripción o de un perfil público de Instagram.'],
      },
    },
    {
      id: 'db', group: 'data', col: 3, row: 2, tech: 'Postgres Redis',
      label: { en: 'Postgres and Redis', es: 'Postgres y Redis' },
      notes: {
        en: ['128 scenarios, 104 techniques and 27 catalogs of things to talk about.'],
        es: ['128 escenarios, 104 técnicas y 27 catálogos de temas de conversación.'],
      },
    },
    {
      id: 'models', group: 'ai', col: 3, row: 3,
      label: { en: 'Seedance vs Kling 2.6 Pro', es: 'Seedance vs Kling 2.6 Pro' },
      notes: {
        en: ['The same brief runs through both so the difference is visible before a campaign commits to one model.'],
        es: ['El mismo brief pasa por ambos para ver la diferencia antes de comprometer una campaña con un modelo.'],
      },
    },
    {
      id: 'history', group: 'frontend', col: 4, row: 0,
      label: { en: 'History and Stats', es: 'Historial y Stats' },
      notes: {
        en: ['The look back and see progress step: sessions, average, best and the score trend.', 'Home summarises streak, Charisma Score and closed rate.'],
        es: ['El paso de revisar y ver el progreso: sesiones, media, mejor y tendencia de la puntuación.', 'Home resume racha, Charisma Score y tasa de cierre.'],
      },
    },
    {
      id: 'plans', group: 'backend', col: 4, row: 1, tech: 'Apple In-App Purchase Stripe',
      label: { en: 'Free, Pro and Max plans', es: 'Planes Free, Pro y Max' },
      notes: {
        en: ['Three-plan paywall on Apple In-App Purchase and Stripe.', 'A MAX badge marks the Learn items that come with the Max plan.'],
        es: ['Paywall de tres planes sobre Apple In-App Purchase y Stripe.', 'Una insignia MAX marca los elementos de Learn que vienen con el plan Max.'],
      },
    },
    {
      id: 'ads', group: 'frontend', col: 4, row: 2, tech: 'Instagram TikTok YouTube',
      label: { en: 'Platform video ads', es: 'Anuncios por plataforma' },
      notes: {
        en: ['Tailored variants for Instagram, Meta, TikTok and YouTube.', 'The ads are generated rather than produced by hand.'],
        es: ['Variantes adaptadas a Instagram, Meta, TikTok y YouTube.', 'Los anuncios se generan en lugar de producirse a mano.'],
      },
    },
    {
      id: 'monitoring', group: 'infra', tech: 'Prometheus Grafana',
      label: { en: 'Prometheus and Grafana', es: 'Prometheus y Grafana' },
      notes: { en: ['Monitoring for the app back end.'], es: ['Monitorización del back end de la app.'] },
    },
    {
      id: 'testflight', group: 'infra', tech: 'TestFlight',
      label: { en: 'TestFlight', es: 'TestFlight' },
      notes: { en: ['The app is in TestFlight with the App Store release in progress.'], es: ['La app está en TestFlight y el lanzamiento en App Store está en curso.'] },
    },
    {
      id: 'tokens-ci', group: 'infra',
      label: { en: 'Design tokens in CI', es: 'Tokens de diseño en CI' },
      notes: {
        en: ['A CI check fails the build on any colour literal outside the token file.'],
        es: ['Una comprobación en CI hace fallar el build ante cualquier color literal fuera del archivo de tokens.'],
      },
    },
    {
      id: 'privacy', group: 'security',
      label: { en: 'Voice used only to score', es: 'Voz solo para puntuar' },
      notes: {
        en: ['Voice recordings are used only to score sessions.', 'No access to contacts, photos or location, and no ads in the app.'],
        es: ['Las grabaciones de voz se usan solo para puntuar las sesiones.', 'Sin acceso a contactos, fotos ni ubicación, y sin anuncios en la app.'],
      },
    },
  ],
  edges: [
    { from: 'user', to: 'app', label: { en: 'voice', es: 'voz' } },
    { from: 'app', to: 'persona', label: { en: 'WebRTC', es: 'WebRTC' } },
    { from: 'app', to: 'api' },
    { from: 'persona', to: 'score', label: { en: 'your voice', es: 'tu voz' } },
    { from: 'api', to: 'profile', label: { en: 'Custom Practice', es: 'Custom Practice' } },
    { from: 'api', to: 'db' },
    { from: 'api', to: 'plans' },
    { from: 'score', to: 'history', label: { en: 'score', es: 'puntuación' } },
    { from: 'db', to: 'history' },
    { from: 'brief', to: 'claude' },
    { from: 'claude', to: 'higgsfield', label: { en: 'prompts', es: 'prompts' } },
    { from: 'higgsfield', to: 'models' },
    { from: 'models', to: 'ads', label: { en: 'variants', es: 'variantes' } },
  ],
};
