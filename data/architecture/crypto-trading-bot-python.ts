import type { Flow } from './types';

export const flow: Flow = {
  nodes: [
    {
      id: 'client', group: 'user', col: 0, row: 0,
      label: { en: 'Client', es: 'Cliente' },
      notes: {
        en: ['Wanted bots to trade crypto automatically on a few exchanges instead of watching charts by hand.'],
        es: ['Quería bots que operasen cripto automáticamente en varios exchanges en lugar de vigilar gráficos a mano.'],
      },
    },
    {
      id: 'big-markets', group: 'data', col: 1, row: 0,
      label: { en: 'Larger markets', es: 'Mercados grandes' },
      notes: {
        en: ['Where a general trend in a coin such as BTC was already visible.'],
        es: ['Donde una tendencia general en una moneda como BTC ya era visible.'],
      },
    },
    {
      id: 'target-data', group: 'data', col: 1, row: 1,
      label: { en: 'Target exchange data', es: 'Datos del exchange objetivo' },
      notes: {
        en: ['A smaller exchange that lagged behind the larger markets.'],
        es: ['Un exchange pequeño que iba por detrás de los mercados grandes.'],
      },
    },
    {
      id: 'tv-strategy', group: 'data', col: 1, row: 2, tech: 'TradingView',
      label: { en: 'TradingView strategy', es: 'Estrategia TradingView' },
      notes: {
        en: ["A custom TradingView strategy holding the client's own strategy rules."],
        es: ['Una estrategia personalizada de TradingView con las reglas propias del cliente.'],
      },
    },
    {
      id: 'lag-analysis', group: 'data', col: 2, row: 0,
      label: { en: 'Market lag analysis', es: 'Análisis del retardo' },
      notes: {
        en: [
          'Showed the target exchange lagged because of its time zone and relatively small size.',
          'That lag could be traded once a trend was visible elsewhere.',
        ],
        es: [
          'Mostró que el exchange objetivo iba por detrás por su zona horaria y su tamaño relativamente pequeño.',
          'Ese retardo se podía operar cuando la tendencia ya era visible en otros mercados.',
        ],
      },
    },
    {
      id: 'tv-webhook', group: 'backend', col: 2, row: 1, tech: 'TradingView',
      label: { en: 'Webhook signal', es: 'Señal por webhook' },
      notes: {
        en: ['The strategy fires, the webhook arrives, the order goes out.'],
        es: ['La estrategia se dispara, llega el webhook y sale la orden.'],
      },
    },
    {
      id: 'lag-bot', group: 'backend', col: 3, row: 0, tech: 'Python',
      label: { en: 'Lag trading bot', es: 'Bot del retardo' },
      notes: {
        en: ['A Python bot that trades on the observed lag through the exchange API.'],
        es: ['Un bot en Python que opera el retardo observado a través de la API del exchange.'],
      },
    },
    {
      id: 'signal-bot', group: 'backend', col: 3, row: 1, tech: 'Python',
      label: { en: 'Signal bot', es: 'Bot de señales' },
      notes: {
        en: [
          'Always-on listener that executes the matching orders automatically.',
          "Lets the client's strategy rules run without anyone at the keyboard.",
        ],
        es: [
          'Oyente permanente que ejecuta automáticamente las órdenes correspondientes.',
          'Las reglas de la estrategia del cliente funcionan sin nadie al teclado.',
        ],
      },
    },
    {
      id: 'exchange-api', group: 'backend', col: 4, row: 0, tech: 'Binance',
      label: { en: 'Exchange API', es: 'API del exchange' },
      notes: {
        en: ['Both bots trade through exchange APIs such as Binance.'],
        es: ['Ambos bots operan a través de API de exchanges como Binance.'],
      },
    },
    {
      id: 'trades', group: 'data', col: 5, row: 0,
      label: { en: 'Trades', es: 'Operaciones' },
      notes: {
        en: ['Profitable at times, but high trading fees and a changing market meant the edge was not stable.'],
        es: ['Rentables por momentos, pero las altas comisiones y un mercado cambiante hicieron la ventaja inestable.'],
      },
    },
    {
      id: 'monitoring', group: 'user', col: 5, row: 1,
      label: { en: 'Monitoring and tuning', es: 'Monitorización y ajustes' },
      notes: {
        en: [
          'Keeping the process alive and monitoring what it did mattered as much as the strategy.',
          'The algorithm needed constant monitoring and tweaking to stay ahead.',
        ],
        es: [
          'Mantener el proceso vivo y monitorizar lo que hacía importó tanto como la estrategia.',
          'El algoritmo necesitaba monitorización y ajustes constantes para mantenerse por delante.',
        ],
      },
    },
    {
      id: 'cloud', group: 'infra',
      label: { en: 'Cloud deployment', es: 'Despliegue en la nube' },
      notes: {
        en: ['The signal bot runs in the cloud so it stays connected to the exchange and TradingView around the clock.'],
        es: ['El bot de señales corre en la nube para seguir conectado al exchange y a TradingView las 24 horas.'],
      },
    },
    {
      id: 'unattended', group: 'infra',
      label: { en: 'Unattended operation', es: 'Operación desatendida' },
      notes: {
        en: [
          'A trading bot is only useful if it is running when the signal arrives.',
          'Both bots were built to run unattended rather than from a laptop.',
        ],
        es: [
          'Un bot de trading solo sirve si está en marcha cuando llega la señal.',
          'Ambos bots se construyeron para funcionar desatendidos y no desde un portátil.',
        ],
      },
    },
  ],
  edges: [
    { from: 'big-markets', to: 'lag-analysis', label: { en: 'BTC trend', es: 'Tendencia BTC' } },
    { from: 'target-data', to: 'lag-analysis' },
    { from: 'lag-analysis', to: 'lag-bot', label: { en: 'Lag', es: 'Retardo' } },
    { from: 'client', to: 'tv-strategy', label: { en: 'Strategy rules', es: 'Reglas' } },
    { from: 'tv-strategy', to: 'tv-webhook', label: { en: 'Signal', es: 'Señal' } },
    { from: 'tv-webhook', to: 'signal-bot' },
    { from: 'lag-bot', to: 'exchange-api', label: { en: 'Orders', es: 'Órdenes' } },
    { from: 'signal-bot', to: 'exchange-api', label: { en: 'Orders', es: 'Órdenes' } },
    { from: 'exchange-api', to: 'trades' },
    { from: 'trades', to: 'monitoring' },
    { from: 'monitoring', to: 'lag-bot', label: { en: 'Tweaks', es: 'Ajustes' } },
  ],
};
