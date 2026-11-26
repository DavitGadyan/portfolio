import type { Flow } from './types';

/** NexusCall: the voice path (top row) and the email path (second row) meet at the AI gateway; CRM and campaigns below. */
export const flow: Flow = {
  nodes: [
    {
      id: 'caller', group: 'user', col: 0, row: 0,
      label: { en: 'Caller or lead', es: 'Cliente o lead' },
      notes: {
        en: ['Calls in, or is called by an outbound campaign.', 'Hears that the agent is an AI and can ask for a person.'],
        es: ['Llama, o recibe la llamada de una campaña saliente.', 'Oye que el agente es una IA y puede pedir hablar con una persona.'],
      },
    },
    {
      id: 'staff', group: 'user', col: 0, row: 1,
      label: { en: 'Agency and client staff', es: 'Equipo de agencia y cliente' },
      notes: {
        en: ['Three role-based interfaces: client workspace, client admin, platform admin.', 'Approves every AI-written email before it is sent.'],
        es: ['Tres interfaces por rol: espacio del cliente, administración del cliente y de la plataforma.', 'Aprueba cada correo escrito por la IA antes de enviarlo.'],
      },
    },
    {
      id: 'twilio', group: 'backend', col: 1, row: 0, tech: 'Twilio',
      label: { en: 'Twilio phone line', es: 'Línea de Twilio' },
      notes: {
        en: ['Inbound and outbound calls; webhooks checked by signature and replay window.', 'Outbound: calling window, pace and a do-not-call check just before each dial.'],
        es: ['Llamadas entrantes y salientes; webhooks verificados por firma y ventana de repetición.', 'Salientes: franja horaria, ritmo y comprobación de no llamar justo antes de marcar.'],
      },
    },
    {
      id: 'web', group: 'frontend', col: 1, row: 1, tech: 'Next.js',
      label: { en: 'Web app + BFF', es: 'Web + BFF' },
      notes: {
        en: ['Next.js app with 99 routes.', 'The backend-for-frontend keeps tokens on the server; the browser holds only an HttpOnly cookie, and changes need a CSRF token.'],
        es: ['Aplicación Next.js con 99 rutas.', 'El backend-for-frontend guarda los tokens en el servidor; el navegador solo tiene una cookie HttpOnly y los cambios piden token CSRF.'],
      },
    },
    {
      id: 'voice', group: 'ai', col: 2, row: 0, tech: 'Deepgram ElevenLabs',
      label: { en: 'Voice agent', es: 'Agente de voz' },
      notes: {
        en: ['Deepgram turns speech into text, ElevenLabs speaks the answer.', 'The caller can interrupt (barge-in); a live hand-off moves the call to a person.'],
        es: ['Deepgram pasa la voz a texto y ElevenLabs pronuncia la respuesta.', 'Quien llama puede interrumpir (barge-in); el traspaso en directo pasa la llamada a una persona.'],
      },
    },
    {
      id: 'inbox', group: 'backend', col: 2, row: 1, tech: 'Amazon SES',
      label: { en: 'Inbox + approval queue', es: 'Bandeja + aprobación' },
      notes: {
        en: ['Inbound email is classified and the AI drafts a reply from the client knowledge base.', 'Only the exact approved version can be sent: the send call takes a draft ID and version, never a recipient or body.'],
        es: ['Los correos entrantes se clasifican y la IA redacta una respuesta con la base de conocimiento del cliente.', 'Solo se envía la versión exacta aprobada: el envío recibe un ID de borrador y una versión, nunca un destinatario ni un cuerpo.'],
      },
    },
    {
      id: 'crm', group: 'backend', col: 2, row: 2, tech: 'FastAPI RabbitMQ',
      label: { en: 'CRM + campaigns', es: 'CRM y campañas' },
      notes: {
        en: ['16 FastAPI microservices, each with its own database.', 'Events over RabbitMQ with outbox and inbox, so none is lost or processed twice.', 'The calendar rejects double bookings; email campaigns pause above 5% bounces or 0.1% complaints.'],
        es: ['16 microservicios FastAPI, cada uno con su propia base de datos.', 'Eventos por RabbitMQ con outbox e inbox, así que ninguno se pierde ni se procesa dos veces.', 'El calendario rechaza reservas dobles; las campañas de correo se pausan con más del 5 % de rebotes o el 0,1 % de quejas.'],
      },
    },
    {
      id: 'gateway', group: 'ai', col: 3, row: 0, tech: 'Anthropic Claude OWASP',
      label: { en: 'AI gateway', es: 'Gateway de IA' },
      notes: {
        en: ['Every model call goes through it, built against the OWASP Top 10 for LLM applications.', 'Emails, transcripts and tool output always arrive as untrusted data.', 'Budgets as hard caps, rate and loop limits, a breaker per provider, kill switches.'],
        es: ['Toda llamada al modelo pasa por aquí, construido frente al OWASP Top 10 para aplicaciones LLM.', 'Correos, transcripciones y salida de herramientas llegan siempre como datos no fiables.', 'Presupuestos como topes estrictos, límites de uso y de bucles, cortacircuitos por proveedor e interruptores de parada.'],
      },
    },
    {
      id: 'tools', group: 'backend', col: 4, row: 0,
      label: { en: 'Tool execution', es: 'Ejecución de herramientas' },
      notes: {
        en: ['A tool runs only if it was granted to this agent, with arguments checked against a schema.', 'High-impact tools need a stored human approval; credentials are added here, never shown to the model.'],
        es: ['Una herramienta solo se ejecuta si se concedió a ese agente, con argumentos validados por esquema.', 'Las de alto impacto necesitan una aprobación humana guardada; las credenciales se añaden aquí, nunca las ve el modelo.'],
      },
    },
    {
      id: 'db', group: 'data', col: 4, row: 1, tech: 'PostgreSQL pgvector',
      label: { en: 'PostgreSQL per service', es: 'PostgreSQL por servicio' },
      notes: {
        en: ['Row-level security switched on and forced on every tenant table.', 'Knowledge search runs with the tenant filter inside the vector query.'],
        es: ['Seguridad a nivel de fila activada y forzada en cada tabla de cliente.', 'La búsqueda de conocimiento lleva el filtro de cliente dentro de la consulta vectorial.'],
      },
    },
    {
      id: 'k8s', group: 'infra', tech: 'Kubernetes Helm',
      label: { en: 'Kubernetes + Helm', es: 'Kubernetes + Helm' },
      notes: {
        en: ['Default-deny network policies, restricted pod security, migration jobs.', 'Terraform for cluster add-ons, k6 load tests.'],
        es: ['Políticas de red que deniegan todo por defecto, seguridad de pods restringida, jobs de migración.', 'Terraform para los complementos del clúster, pruebas de carga con k6.'],
      },
    },
    {
      id: 'obs', group: 'infra', tech: 'OpenTelemetry Grafana',
      label: { en: 'Observability', es: 'Observabilidad' },
      notes: {
        en: ['Traces, metrics and logs with emails, phones and tokens redacted.'],
        es: ['Trazas, métricas y logs con correos, teléfonos y tokens eliminados.'],
      },
    },
    {
      id: 'keycloak', group: 'security', tech: 'Keycloak',
      label: { en: 'Keycloak SSO + MFA', es: 'Keycloak SSO + MFA' },
      notes: {
        en: ['Single sign-on, with MFA asked again before sensitive actions.', 'Support access needs a reason, a ticket and MFA, and lasts at most 4 hours.'],
        es: ['Inicio de sesión único, con MFA de nuevo antes de las acciones sensibles.', 'El acceso de soporte pide motivo, ticket y MFA, y dura como máximo 4 horas.'],
      },
    },
    {
      id: 'vault', group: 'security', tech: 'HashiCorp Vault',
      label: { en: 'HashiCorp Vault', es: 'HashiCorp Vault' },
      notes: {
        en: ['Every provider key lives here; each service reads only its own paths.', 'Databases keep references, the console shows metadata only.'],
        es: ['Aquí vive cada clave de proveedor; cada servicio solo lee sus propias rutas.', 'Las bases de datos guardan referencias y la consola solo muestra metadatos.'],
      },
    },
    {
      id: 'audit', group: 'security',
      label: { en: 'Hash-chained audit log', es: 'Auditoría encadenada' },
      notes: {
        en: ['Append-only; records sensitive reads such as opening a transcript, and every admin action.'],
        es: ['Solo escritura; registra lecturas sensibles, como abrir una transcripción, y cada acción de administración.'],
      },
    },
  ],
  edges: [
    { from: 'caller', to: 'twilio', label: { en: 'call', es: 'llamada' } },
    { from: 'twilio', to: 'voice', label: { en: 'media stream', es: 'audio' } },
    { from: 'voice', to: 'gateway', label: { en: 'each turn', es: 'cada turno' } },
    { from: 'gateway', to: 'tools', label: { en: 'granted only', es: 'solo concedidas' } },
    { from: 'tools', to: 'db', label: { en: 'book, update', es: 'reservar' } },
    { from: 'staff', to: 'web', label: { en: 'SSO', es: 'SSO' } },
    { from: 'web', to: 'inbox', label: { en: 'approve', es: 'aprobar' } },
    { from: 'web', to: 'crm', label: { en: 'campaigns', es: 'campañas' } },
    { from: 'inbox', to: 'gateway', label: { en: 'draft', es: 'borrador' } },
    { from: 'crm', to: 'db' },
  ],
};
