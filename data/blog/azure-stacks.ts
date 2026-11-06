import type { Localized } from '@/lib/content/types';
import type { LogoId } from '@/data/skillLogos';

/**
 * The two interactive stack diagrams of the post "Azure, Fabric, Databricks or Foundry" (content/en|es/blog/azure-fabric-databricks-foundry-which-to-choose.mdx),
 * rendered by `<Stacks id="…" />` (components/content/Stacks.tsx): a tab per cloud or per reference stack, one bar per layer, a note per bar.
 * Service names follow the vendors' documentation as of 2026-11-06 (Microsoft Learn for Foundry, Fabric and Azure Databricks; AWS and Google Cloud docs for
 * the equivalents: Vertex AI became part of Gemini Enterprise Agent Platform on 2026-04-22, Agent Engine is now Agent Runtime). Product names are not translated.
 */
export type StackIcon = 'bot' | 'search' | 'workflow' | 'database' | 'warehouse' | 'server' | 'container' | 'zap' | 'network' | 'shield' | 'key' | 'activity' | 'cpu' | 'layers' | 'layout';
export interface StackItem { name: string; logo?: LogoId; icon?: StackIcon }
export interface StackLayer { id: string; label: Localized<string>; items: StackItem[]; note: Localized<string> }
export interface StackVariant { id: string; label: string; logo?: LogoId; summary: Localized<string>; useCase: Localized<string>; layers: StackLayer[] }
export interface StackDiagramData { id: string; title: Localized<string>; variants: StackVariant[] }

const L = (en: string, es: string): Localized<string> => ({ en, es });

const clouds: StackDiagramData = {
  id: 'clouds',
  title: L('The same four layers in Azure, AWS and Google Cloud', 'Las mismas cuatro capas en Azure, AWS y Google Cloud'),
  variants: [
    {
      id: 'azure', label: 'Azure', logo: 'azure',
      summary: L('Microsoft Foundry on top, Microsoft Fabric or Azure Databricks in the middle, OneLake and ADLS Gen2 underneath, Azure infrastructure at the bottom.', 'Microsoft Foundry arriba, Microsoft Fabric o Azure Databricks en medio, OneLake y ADLS Gen2 debajo, la infraestructura de Azure en la base.'),
      useCase: L('A company that already runs Microsoft 365, Entra ID and Power BI and wants its AI agents next to that data.', 'Una empresa que ya usa Microsoft 365, Entra ID y Power BI y quiere sus agentes de IA junto a esos datos.'),
      layers: [
        { id: 'apps', label: L('AI applications and agents', 'Aplicaciones y agentes de IA'), items: [{ name: 'Microsoft Foundry', logo: 'azureai' }, { name: 'Foundry Agent Service', icon: 'bot' }, { name: 'Azure AI Search', icon: 'search' }],
          note: L('Foundry Models serve the LLM, Foundry Agent Service runs the agent, Azure AI Search holds the vectors and the hybrid index that RAG retrieves from.', 'Foundry Models sirve el LLM, Foundry Agent Service ejecuta el agente y Azure AI Search guarda los vectores y el índice híbrido del que recupera el RAG.') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'Microsoft Fabric', logo: 'microsoft' }, { name: 'Azure Databricks', logo: 'databricks' }, { name: 'Data Factory', icon: 'workflow' }],
          note: L('Fabric for managed SaaS pipelines, Spark and Power BI; Azure Databricks for large Spark jobs, Delta Lake and ML; Data Factory for ingestion from more than 200 connectors.', 'Fabric para pipelines SaaS gestionados, Spark y Power BI; Azure Databricks para trabajos Spark grandes, Delta Lake y ML; Data Factory para ingerir desde más de 200 conectores.') },
        { id: 'storage', label: L('Data storage', 'Almacenamiento de datos'), items: [{ name: 'OneLake', logo: 'microsoft' }, { name: 'ADLS Gen2 / Blob Storage', icon: 'database' }, { name: 'Fabric Warehouse', icon: 'warehouse' }, { name: 'Azure SQL', logo: 'azuresql' }],
          note: L('Object storage for files and Delta tables, OneLake as the logical lake every Fabric workload reads, a SQL warehouse for analytics, Azure SQL for transactions.', 'Almacenamiento de objetos para archivos y tablas Delta, OneLake como lago lógico que leen todas las cargas de Fabric, un almacén SQL para analítica y Azure SQL para transacciones.') },
        { id: 'infra', label: L('Cloud infrastructure', 'Infraestructura en la nube'), items: [{ name: 'Azure VMs', icon: 'server' }, { name: 'AKS', logo: 'kubernetes' }, { name: 'Container Apps', icon: 'container' }, { name: 'Azure Functions', icon: 'zap' }, { name: 'Virtual Network', icon: 'network' }, { name: 'Entra ID', icon: 'shield' }, { name: 'Key Vault', icon: 'key' }, { name: 'Azure Monitor', icon: 'activity' }],
          note: L('Compute, containers, serverless, networking, identity, secrets and monitoring: the part that neither Foundry nor Fabric replaces.', 'Cómputo, contenedores, serverless, red, identidad, secretos y monitorización: la parte que ni Foundry ni Fabric sustituyen.') },
      ],
    },
    {
      id: 'aws', label: 'AWS', logo: 'aws',
      summary: L('Amazon Bedrock on top, Glue, EMR or Databricks in the middle, S3 and Redshift underneath, EC2, EKS and Lambda at the bottom.', 'Amazon Bedrock arriba, Glue, EMR o Databricks en medio, S3 y Redshift debajo, EC2, EKS y Lambda en la base.'),
      useCase: L('Financial institutions, fintech, e-commerce and large data platforms that already run on AWS.', 'Instituciones financieras, fintech, comercio electrónico y grandes plataformas de datos que ya corren en AWS.'),
      layers: [
        { id: 'apps', label: L('AI applications and agents', 'Aplicaciones y agentes de IA'), items: [{ name: 'Amazon Bedrock', logo: 'bedrock' }, { name: 'Bedrock AgentCore', icon: 'bot' }, { name: 'OpenSearch', icon: 'search' }],
          note: L('Bedrock serves the foundation models, Knowledge Bases and Guardrails; AgentCore is the runtime for agents; OpenSearch is the usual vector store.', 'Bedrock sirve los modelos fundacionales, Knowledge Bases y Guardrails; AgentCore es el runtime de los agentes; OpenSearch es el almacén de vectores habitual.') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'AWS Glue', icon: 'workflow' }, { name: 'Amazon EMR', icon: 'cpu' }, { name: 'Databricks on AWS', logo: 'databricks' }],
          note: L('Glue for managed ETL and its Data Catalog, EMR for Spark clusters you size yourself, Databricks for the lakehouse with Unity Catalog.', 'Glue para ETL gestionado y su Data Catalog, EMR para clústeres Spark que dimensionas tú, Databricks para el lakehouse con Unity Catalog.') },
        { id: 'storage', label: L('Data storage', 'Almacenamiento de datos'), items: [{ name: 'Amazon S3', logo: 'aws' }, { name: 'Redshift', icon: 'warehouse' }, { name: 'RDS', icon: 'database' }],
          note: L('S3 is the data lake, Redshift the warehouse, RDS the managed relational database.', 'S3 es el lago de datos, Redshift el almacén y RDS la base de datos relacional gestionada.') },
        { id: 'infra', label: L('Cloud infrastructure', 'Infraestructura en la nube'), items: [{ name: 'EC2', icon: 'server' }, { name: 'EKS', logo: 'kubernetes' }, { name: 'Lambda', icon: 'zap' }, { name: 'VPC', icon: 'network' }, { name: 'IAM', icon: 'shield' }, { name: 'Secrets Manager', icon: 'key' }, { name: 'CloudWatch', icon: 'activity' }],
          note: L('Virtual machines, Kubernetes, serverless functions, networking, identity, secrets and monitoring.', 'Máquinas virtuales, Kubernetes, funciones serverless, red, identidad, secretos y monitorización.') },
      ],
    },
    {
      id: 'gcp', label: 'Google Cloud', logo: 'gcp',
      summary: L('Gemini Enterprise Agent Platform on top, Dataflow, Dataproc or Databricks in the middle, Cloud Storage and BigQuery underneath, Compute Engine, GKE and Cloud Run at the bottom.', 'Gemini Enterprise Agent Platform arriba, Dataflow, Dataproc o Databricks en medio, Cloud Storage y BigQuery debajo, Compute Engine, GKE y Cloud Run en la base.'),
      useCase: L('Companies with a large BigQuery investment, analytics-heavy workloads and Gemini-based applications.', 'Empresas con una gran inversión en BigQuery, cargas de trabajo analíticas y aplicaciones basadas en Gemini.'),
      layers: [
        { id: 'apps', label: L('AI applications and agents', 'Aplicaciones y agentes de IA'), items: [{ name: 'Gemini Enterprise Agent Platform', logo: 'gemini' }, { name: 'Agent Runtime', icon: 'bot' }, { name: 'Agent Search', icon: 'search' }],
          note: L('Since April 2026 Vertex AI is part of Gemini Enterprise Agent Platform: Model Garden and the Gemini models, Agent Runtime (formerly Agent Engine), RAG Engine, Vector Search and Agent Search (formerly Vertex AI Search).', 'Desde abril de 2026 Vertex AI forma parte de Gemini Enterprise Agent Platform: Model Garden y los modelos Gemini, Agent Runtime (antes Agent Engine), RAG Engine, Vector Search y Agent Search (antes Vertex AI Search).') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'Dataflow', icon: 'workflow' }, { name: 'Dataproc', icon: 'cpu' }, { name: 'Databricks on Google Cloud', logo: 'databricks' }],
          note: L('Dataflow for managed batch and streaming pipelines, Dataproc for Spark clusters, Databricks for the lakehouse with Unity Catalog.', 'Dataflow para pipelines gestionados por lotes y en streaming, Dataproc para clústeres Spark, Databricks para el lakehouse con Unity Catalog.') },
        { id: 'storage', label: L('Data storage', 'Almacenamiento de datos'), items: [{ name: 'Cloud Storage', icon: 'database' }, { name: 'BigQuery', logo: 'bigquery' }, { name: 'Cloud SQL', icon: 'database' }],
          note: L('Cloud Storage is the data lake, BigQuery the warehouse that many Google Cloud architectures revolve around, Cloud SQL the managed relational database.', 'Cloud Storage es el lago de datos, BigQuery el almacén alrededor del que giran muchas arquitecturas de Google Cloud y Cloud SQL la base de datos relacional gestionada.') },
        { id: 'infra', label: L('Cloud infrastructure', 'Infraestructura en la nube'), items: [{ name: 'Compute Engine', icon: 'server' }, { name: 'GKE', logo: 'kubernetes' }, { name: 'Cloud Run', icon: 'container' }, { name: 'Cloud Functions', icon: 'zap' }, { name: 'VPC', icon: 'network' }, { name: 'IAM', icon: 'shield' }, { name: 'Secret Manager', icon: 'key' }, { name: 'Cloud Monitoring', icon: 'activity' }],
          note: L('Virtual machines, Kubernetes, containers, serverless functions, networking, identity, secrets and monitoring.', 'Máquinas virtuales, Kubernetes, contenedores, funciones serverless, red, identidad, secretos y monitorización.') },
      ],
    },
  ],
};

const stacks: StackDiagramData = {
  id: 'stacks',
  title: L('Five reference stacks for enterprise AI', 'Cinco pilas de referencia para IA empresarial'),
  variants: [
    {
      id: 'ms', label: 'Microsoft enterprise AI', logo: 'microsoft',
      summary: L('Everything inside the Microsoft ecosystem: Fabric for data, Foundry for AI, Power BI for the business, Entra ID for identity.', 'Todo dentro del ecosistema Microsoft: Fabric para los datos, Foundry para la IA, Power BI para el negocio, Entra ID para la identidad.'),
      useCase: L('A large enterprise that wants SharePoint, Microsoft 365, databases, internal documents, analytics and AI agents connected.', 'Una gran empresa que quiere conectar SharePoint, Microsoft 365, bases de datos, documentos internos, analítica y agentes de IA.'),
      layers: [
        { id: 'cloud', label: L('Cloud', 'Nube'), items: [{ name: 'Azure', logo: 'azure' }], note: L('Subscriptions, regions, networking and the enterprise agreement the company already has.', 'Suscripciones, regiones, red y el acuerdo empresarial que la compañía ya tiene.') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'Microsoft Fabric', logo: 'microsoft' }, { name: 'Data Factory', icon: 'workflow' }], note: L('Data Factory pipelines ingest from SharePoint, SQL and SaaS sources; Fabric Spark notebooks transform them into bronze, silver and gold tables.', 'Los pipelines de Data Factory ingieren desde SharePoint, SQL y fuentes SaaS; los notebooks de Fabric Spark los transforman en tablas bronce, plata y oro.') },
        { id: 'lake', label: L('Data lake', 'Lago de datos'), items: [{ name: 'OneLake', logo: 'microsoft' }], note: L('One logical lake per tenant on ADLS Gen2, organised in workspaces and lakehouses, read by every Fabric workload without copies.', 'Un lago lógico por tenant sobre ADLS Gen2, organizado en workspaces y lakehouses, leído por todas las cargas de Fabric sin copias.') },
        { id: 'warehouse', label: L('Data warehouse', 'Almacén de datos'), items: [{ name: 'Fabric Warehouse', icon: 'warehouse' }], note: L('SQL analytics over Delta tables in OneLake, with compute and storage scaled separately.', 'Analítica SQL sobre tablas Delta en OneLake, con cómputo y almacenamiento escalados por separado.') },
        { id: 'ai', label: L('AI models', 'Modelos de IA'), items: [{ name: 'Microsoft Foundry', logo: 'azureai' }], note: L('Foundry Models for the LLM and the embeddings, evaluations and tracing from the same project.', 'Foundry Models para el LLM y los embeddings, con evaluaciones y trazas desde el mismo proyecto.') },
        { id: 'search', label: L('RAG and search', 'RAG y búsqueda'), items: [{ name: 'Azure AI Search', icon: 'search' }], note: L('Hybrid retrieval: keyword, vector and semantic ranking over the chunked documents, with document-level security.', 'Recuperación híbrida: palabras clave, vectores y ranking semántico sobre los documentos troceados, con seguridad a nivel de documento.') },
        { id: 'agents', label: L('AI agents', 'Agentes de IA'), items: [{ name: 'Foundry Agent Service', icon: 'bot' }], note: L('Prompt agents defined in the portal or the SDK, or hosted agents running your own code with a managed endpoint.', 'Agentes de prompt definidos en el portal o el SDK, o agentes alojados que ejecutan tu propio código con un endpoint gestionado.') },
        { id: 'backend', label: L('Backend', 'Backend'), items: [{ name: 'Python / FastAPI', logo: 'fastapi' }], note: L('The application-specific business logic, the tool endpoints the agent calls and the API the front end uses.', 'La lógica de negocio propia de la aplicación, los endpoints de herramientas que llama el agente y la API que usa el front end.') },
        { id: 'hosting', label: L('Hosting', 'Alojamiento'), items: [{ name: 'Azure Container Apps', icon: 'container' }], note: L('Containers with scale-to-zero, managed identity and no cluster to run.', 'Contenedores con escalado a cero, identidad gestionada y sin clúster que operar.') },
        { id: 'bi', label: L('BI', 'BI'), items: [{ name: 'Power BI', logo: 'powerbi' }], note: L('Dashboards over the gold tables, delivered through the Power BI service, Teams and Excel.', 'Cuadros de mando sobre las tablas oro, entregados a través del servicio Power BI, Teams y Excel.') },
        { id: 'security', label: L('Security', 'Seguridad'), items: [{ name: 'Entra ID', icon: 'shield' }, { name: 'Key Vault', icon: 'key' }], note: L('Identity, managed identities and RBAC from Entra ID; secrets and keys in Key Vault.', 'Identidad, identidades gestionadas y RBAC desde Entra ID; secretos y claves en Key Vault.') },
      ],
    },
    {
      id: 'dbx', label: 'Azure Databricks + Foundry', logo: 'databricks',
      summary: L('Each platform owns one job: Azure Databricks the data-heavy work, Microsoft Foundry the managed models and agents.', 'Cada plataforma tiene un trabajo: Azure Databricks el trabajo intensivo en datos, Microsoft Foundry los modelos y agentes gestionados.'),
      useCase: L('Millions of records cleaned in PySpark and stored as Delta tables, then an agent answering questions over the processed documents.', 'Millones de registros limpiados en PySpark y guardados como tablas Delta, y después un agente que responde preguntas sobre los documentos procesados.'),
      layers: [
        { id: 'cloud', label: L('Cloud', 'Nube'), items: [{ name: 'Azure', logo: 'azure' }], note: L('Azure Databricks is a first-party Azure service, billed and secured through the Azure subscription.', 'Azure Databricks es un servicio de primera parte de Azure, facturado y asegurado a través de la suscripción de Azure.') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'Azure Databricks', logo: 'databricks' }, { name: 'PySpark', logo: 'spark' }], note: L('Notebooks and Lakeflow jobs ingest millions of records and run the PySpark transformations.', 'Notebooks y trabajos de Lakeflow ingieren millones de registros y ejecutan las transformaciones en PySpark.') },
        { id: 'lake', label: L('Data lake', 'Lago de datos'), items: [{ name: 'ADLS Gen2', icon: 'database' }], note: L('Your own storage account: the files stay in your Azure subscription.', 'Tu propia cuenta de almacenamiento: los archivos se quedan en tu suscripción de Azure.') },
        { id: 'format', label: L('Storage format', 'Formato de almacenamiento'), items: [{ name: 'Delta Lake', icon: 'layers' }], note: L('Bronze, silver and gold tables as Parquet files plus a transaction log, with time travel and MERGE.', 'Tablas bronce, plata y oro como archivos Parquet más un log de transacciones, con viaje en el tiempo y MERGE.') },
        { id: 'governance', label: L('Governance', 'Gobernanza'), items: [{ name: 'Unity Catalog', icon: 'shield' }], note: L('Permissions, lineage and metadata for every table, volume and model.', 'Permisos, linaje y metadatos de cada tabla, volumen y modelo.') },
        { id: 'ai', label: L('AI models', 'Modelos de IA'), items: [{ name: 'Microsoft Foundry', logo: 'azureai' }], note: L('Foundry Models provides the LLM and the embeddings; the data never has to leave Azure.', 'Foundry Models aporta el LLM y los embeddings; los datos nunca tienen que salir de Azure.') },
        { id: 'vectors', label: L('Vector search', 'Búsqueda vectorial'), items: [{ name: 'Azure AI Search', icon: 'search' }, { name: 'Databricks Vector Search', logo: 'databricks' }], note: L('Azure AI Search when you need enterprise hybrid retrieval; Databricks Vector Search when the index should live next to the Delta tables.', 'Azure AI Search cuando necesitas recuperación híbrida empresarial; Databricks Vector Search cuando el índice debe vivir junto a las tablas Delta.') },
        { id: 'agents', label: L('Agent orchestration', 'Orquestación de agentes'), items: [{ name: 'Foundry Agent Service', icon: 'bot' }, { name: 'LangGraph', logo: 'langgraph' }], note: L('A managed prompt agent in Foundry, or your own LangGraph graph packaged as a container and run as a Foundry hosted agent.', 'Un agente de prompt gestionado en Foundry, o tu propio grafo de LangGraph empaquetado como contenedor y ejecutado como agente alojado de Foundry.') },
        { id: 'backend', label: L('Backend', 'Backend'), items: [{ name: 'Python / FastAPI', logo: 'fastapi' }], note: L('Exposes the application: authentication, tool endpoints, the chat API.', 'Expone la aplicación: autenticación, endpoints de herramientas, la API de chat.') },
        { id: 'hosting', label: L('Deployment', 'Despliegue'), items: [{ name: 'Azure Container Apps', icon: 'container' }, { name: 'AKS', logo: 'kubernetes' }], note: L('Container Apps for most services; AKS when you need a full Kubernetes cluster.', 'Container Apps para la mayoría de servicios; AKS cuando necesitas un clúster Kubernetes completo.') },
        { id: 'monitoring', label: L('Monitoring', 'Monitorización'), items: [{ name: 'Azure Monitor', icon: 'activity' }], note: L('Logs, metrics and alerts for the app; Foundry adds traces and evaluations for the agent.', 'Logs, métricas y alertas de la app; Foundry añade trazas y evaluaciones del agente.') },
      ],
    },
    {
      id: 'hybrid', label: 'Fabric + Databricks + Foundry', logo: 'microsoft',
      summary: L('The hybrid: Azure Databricks for complex Spark processing, Microsoft Fabric for business analytics, Microsoft Foundry for agents. Worth it only when both data platforms are already there.', 'La híbrida: Azure Databricks para el procesamiento Spark complejo, Microsoft Fabric para la analítica de negocio, Microsoft Foundry para los agentes. Solo merece la pena cuando ambas plataformas de datos ya existen.'),
      useCase: L('Databricks processes hundreds of millions of transactions, Fabric exposes business-ready tables, Power BI serves the executives, a Foundry agent answers questions about customer activity.', 'Databricks procesa cientos de millones de transacciones, Fabric expone tablas listas para el negocio, Power BI sirve a la dirección y un agente de Foundry responde preguntas sobre la actividad de los clientes.'),
      layers: [
        { id: 'cloud', label: L('Cloud', 'Nube'), items: [{ name: 'Azure', logo: 'azure' }], note: L('Infrastructure, identity and billing for all three platforms.', 'Infraestructura, identidad y facturación de las tres plataformas.') },
        { id: 'analytics', label: L('Business analytics', 'Analítica de negocio'), items: [{ name: 'Microsoft Fabric', logo: 'microsoft' }, { name: 'Power BI', logo: 'powerbi' }], note: L('Fabric exposes the curated tables to analysts; Power BI serves the reports.', 'Fabric expone las tablas curadas a los analistas; Power BI sirve los informes.') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'Azure Databricks', logo: 'databricks' }], note: L('Complex Spark processing, streaming and ML pipelines with the compute you configure.', 'Procesamiento Spark complejo, streaming y pipelines de ML con el cómputo que tú configuras.') },
        { id: 'lake', label: L('Data lake', 'Lago de datos'), items: [{ name: 'OneLake', logo: 'microsoft' }, { name: 'ADLS Gen2', icon: 'database' }], note: L('Unity Catalog tables mirrored into OneLake as a read-only catalog, no data movement; Databricks can also query OneLake through catalog federation.', 'Tablas de Unity Catalog reflejadas en OneLake como catálogo de solo lectura, sin mover datos; Databricks también puede consultar OneLake mediante federación de catálogos.') },
        { id: 'governance', label: L('Governance', 'Gobernanza'), items: [{ name: 'Unity Catalog', icon: 'shield' }, { name: 'Microsoft Purview', icon: 'shield' }], note: L('Unity Catalog governs the Databricks side; OneLake Catalog and Purview govern discovery, labels and compliance on the Fabric side.', 'Unity Catalog gobierna el lado de Databricks; OneLake Catalog y Purview gobiernan el descubrimiento, las etiquetas y el cumplimiento en el lado de Fabric.') },
        { id: 'ai', label: L('AI platform', 'Plataforma de IA'), items: [{ name: 'Microsoft Foundry', logo: 'azureai' }], note: L('LLMs, agents, evaluations and the control plane for governance.', 'LLM, agentes, evaluaciones y el plano de control para la gobernanza.') },
        { id: 'search', label: L('Search', 'Búsqueda'), items: [{ name: 'Azure AI Search', icon: 'search' }], note: L('RAG retrieval over documents and curated data.', 'Recuperación RAG sobre documentos y datos curados.') },
        { id: 'app', label: L('Application', 'Aplicación'), items: [{ name: 'Python / FastAPI', logo: 'fastapi' }], note: L('Business logic and the bridge between the agent and the business systems.', 'Lógica de negocio y el puente entre el agente y los sistemas de la empresa.') },
        { id: 'hosting', label: L('Hosting', 'Alojamiento'), items: [{ name: 'Azure Container Apps', icon: 'container' }], note: L('Production deployment of the API and the agent tools.', 'Despliegue en producción de la API y las herramientas del agente.') },
      ],
    },
    {
      id: 'aws', label: 'AWS + Databricks + Bedrock', logo: 'aws',
      summary: L('The same pattern on AWS: Databricks or EMR for engineering, S3 and Redshift for storage, Amazon Bedrock for models and agents.', 'El mismo patrón en AWS: Databricks o EMR para la ingeniería, S3 y Redshift para el almacenamiento, Amazon Bedrock para modelos y agentes.'),
      useCase: L('Financial institutions, fintech, e-commerce and large-scale data platforms already running on AWS.', 'Instituciones financieras, fintech, comercio electrónico y plataformas de datos a gran escala que ya corren en AWS.'),
      layers: [
        { id: 'cloud', label: L('Cloud', 'Nube'), items: [{ name: 'AWS', logo: 'aws' }], note: L('Accounts, regions, VPCs and IAM.', 'Cuentas, regiones, VPC e IAM.') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'Databricks', logo: 'databricks' }, { name: 'Amazon EMR', icon: 'cpu' }], note: L('Databricks for the lakehouse and Unity Catalog; EMR for Spark clusters you manage yourself.', 'Databricks para el lakehouse y Unity Catalog; EMR para clústeres Spark que gestionas tú.') },
        { id: 'lake', label: L('Data lake', 'Lago de datos'), items: [{ name: 'Amazon S3', logo: 'aws' }], note: L('Object storage for files and Delta tables.', 'Almacenamiento de objetos para archivos y tablas Delta.') },
        { id: 'warehouse', label: L('Data warehouse', 'Almacén de datos'), items: [{ name: 'Redshift', icon: 'warehouse' }], note: L('SQL analytics; Databricks SQL warehouses are the alternative inside the lakehouse.', 'Analítica SQL; los SQL warehouses de Databricks son la alternativa dentro del lakehouse.') },
        { id: 'governance', label: L('Governance', 'Gobernanza'), items: [{ name: 'Unity Catalog', icon: 'shield' }, { name: 'AWS Glue Data Catalog', icon: 'shield' }], note: L('Unity Catalog for Databricks assets, the Glue Data Catalog for the rest of the AWS data estate.', 'Unity Catalog para los activos de Databricks, el Glue Data Catalog para el resto del patrimonio de datos en AWS.') },
        { id: 'ai', label: L('AI models', 'Modelos de IA'), items: [{ name: 'Amazon Bedrock', logo: 'bedrock' }], note: L('Foundation models, Knowledge Bases for RAG, Guardrails and model evaluation.', 'Modelos fundacionales, Knowledge Bases para RAG, Guardrails y evaluación de modelos.') },
        { id: 'vectors', label: L('Vector search', 'Búsqueda vectorial'), items: [{ name: 'OpenSearch', icon: 'search' }, { name: 'Databricks Vector Search', logo: 'databricks' }], note: L('OpenSearch for the existing AWS ecosystem; Databricks Vector Search close to the Delta tables.', 'OpenSearch para el ecosistema AWS existente; Databricks Vector Search junto a las tablas Delta.') },
        { id: 'agents', label: L('AI agents', 'Agentes de IA'), items: [{ name: 'Bedrock AgentCore', icon: 'bot' }, { name: 'LangGraph', logo: 'langgraph' }], note: L('Bedrock Agents and the AgentCore runtime, or your own LangGraph application.', 'Bedrock Agents y el runtime AgentCore, o tu propia aplicación LangGraph.') },
        { id: 'backend', label: L('Backend', 'Backend'), items: [{ name: 'Python / FastAPI', logo: 'fastapi' }], note: L('Application logic and tool endpoints.', 'Lógica de la aplicación y endpoints de herramientas.') },
        { id: 'hosting', label: L('Hosting', 'Alojamiento'), items: [{ name: 'ECS', icon: 'container' }, { name: 'EKS', logo: 'kubernetes' }, { name: 'Lambda', icon: 'zap' }], note: L('Containers on ECS or EKS, functions on Lambda.', 'Contenedores en ECS o EKS, funciones en Lambda.') },
        { id: 'monitoring', label: L('Monitoring', 'Monitorización'), items: [{ name: 'CloudWatch', icon: 'activity' }], note: L('Logs, metrics and alarms.', 'Logs, métricas y alarmas.') },
      ],
    },
    {
      id: 'gcp', label: 'Google Cloud + Databricks + Gemini', logo: 'gcp',
      summary: L('BigQuery at the centre, Databricks or Dataflow for engineering, Gemini models and Agent Runtime on Gemini Enterprise Agent Platform.', 'BigQuery en el centro, Databricks o Dataflow para la ingeniería, modelos Gemini y Agent Runtime en Gemini Enterprise Agent Platform.'),
      useCase: L('Companies with a significant BigQuery investment, analytics-heavy workloads and Gemini-based AI applications.', 'Empresas con una inversión importante en BigQuery, cargas de trabajo analíticas y aplicaciones de IA basadas en Gemini.'),
      layers: [
        { id: 'cloud', label: L('Cloud', 'Nube'), items: [{ name: 'Google Cloud', logo: 'gcp' }], note: L('Projects, regions, VPCs and IAM.', 'Proyectos, regiones, VPC e IAM.') },
        { id: 'data', label: L('Data engineering', 'Ingeniería de datos'), items: [{ name: 'Databricks', logo: 'databricks' }, { name: 'Dataflow', icon: 'workflow' }], note: L('Databricks for the lakehouse; Dataflow for managed batch and streaming pipelines.', 'Databricks para el lakehouse; Dataflow para pipelines gestionados por lotes y en streaming.') },
        { id: 'lake', label: L('Data lake', 'Lago de datos'), items: [{ name: 'Cloud Storage', icon: 'database' }], note: L('Object storage for files and Delta tables.', 'Almacenamiento de objetos para archivos y tablas Delta.') },
        { id: 'warehouse', label: L('Data warehouse', 'Almacén de datos'), items: [{ name: 'BigQuery', logo: 'bigquery' }], note: L('The serverless warehouse most Google Cloud analytics is built on.', 'El almacén serverless sobre el que se construye la mayor parte de la analítica en Google Cloud.') },
        { id: 'governance', label: L('Governance', 'Gobernanza'), items: [{ name: 'Unity Catalog', icon: 'shield' }, { name: 'Dataplex', icon: 'shield' }], note: L('Unity Catalog for Databricks assets, Dataplex for the Google Cloud data estate.', 'Unity Catalog para los activos de Databricks, Dataplex para el patrimonio de datos de Google Cloud.') },
        { id: 'ai', label: L('AI models', 'Modelos de IA'), items: [{ name: 'Gemini Enterprise Agent Platform', logo: 'gemini' }], note: L('Gemini models and the Model Garden, tuning and evaluation; the platform Vertex AI became part of in April 2026.', 'Modelos Gemini y el Model Garden, ajuste y evaluación; la plataforma de la que Vertex AI pasó a formar parte en abril de 2026.') },
        { id: 'vectors', label: L('Vector search', 'Búsqueda vectorial'), items: [{ name: 'Vector Search', icon: 'search' }], note: L('Managed vector index for RAG, next to RAG Engine and Agent Search.', 'Índice vectorial gestionado para RAG, junto a RAG Engine y Agent Search.') },
        { id: 'agents', label: L('AI agents', 'Agentes de IA'), items: [{ name: 'Agent Runtime', icon: 'bot' }, { name: 'LangGraph', logo: 'langgraph' }], note: L('Agent Runtime (formerly Agent Engine) hosts agents built with the ADK or LangGraph.', 'Agent Runtime (antes Agent Engine) aloja agentes construidos con el ADK o LangGraph.') },
        { id: 'backend', label: L('Backend', 'Backend'), items: [{ name: 'Python / FastAPI', logo: 'fastapi' }], note: L('Application logic and tool endpoints.', 'Lógica de la aplicación y endpoints de herramientas.') },
        { id: 'hosting', label: L('Hosting', 'Alojamiento'), items: [{ name: 'Cloud Run', icon: 'container' }, { name: 'GKE', logo: 'kubernetes' }], note: L('Cloud Run for containers with scale-to-zero, GKE for a full Kubernetes cluster.', 'Cloud Run para contenedores con escalado a cero, GKE para un clúster Kubernetes completo.') },
        { id: 'monitoring', label: L('Monitoring', 'Monitorización'), items: [{ name: 'Cloud Monitoring', icon: 'activity' }], note: L('Logs, metrics and alerting.', 'Logs, métricas y alertas.') },
      ],
    },
  ],
};

export const stackDiagrams: Record<string, StackDiagramData> = { clouds, stacks };
