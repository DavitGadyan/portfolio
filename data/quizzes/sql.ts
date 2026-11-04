import { C, L, Q, type Track } from './types';

/**
 * SQL, Snowflake flavour: aggregation from GROUP BY to GROUPING SETS, joins, CTEs, the three window-function cards
 * (OVER, ranking + QUALIFY, frames + LAG/LEAD) and the Snowflake-specific VARIANT/FLATTEN and MERGE/PIVOT patterns.
 * Thirteen cards and the question bank the practice quiz draws from. The ORDERS and EMPLOYEES tables are fictional.
 */
export const sql: Track = {
  id: 'sql',
  logo: 'snowflake',
  name: 'SQL',
  tagline: L('Thirteen SQL patterns behind data-engineering and analytics assessments, Snowflake flavour: aggregation, GROUP BY and HAVING, window functions, QUALIFY, CTEs, JSON and MERGE, with a 20-question practice quiz.',
    'Trece patrones de SQL detrás de las pruebas de ingeniería y analítica de datos, en sabor Snowflake: agregación, GROUP BY y HAVING, funciones de ventana, QUALIFY, CTE, JSON y MERGE, con un quiz de práctica de 20 preguntas.'),
  title: L('SQL (Snowflake): Aggregation and Window Functions Cheatsheet with Quiz', 'SQL (Snowflake): chuleta de agregación y funciones de ventana con quiz'),
  description: L('Interactive Snowflake SQL cheatsheet for coding assessments by David Gadyan: WHERE vs HAVING, conditional aggregation with IFF and COUNT_IF, DATE_TRUNC, ROLLUP and GROUPING SETS, joins and EXISTS, CTEs, window functions with OVER and PARTITION BY, ROW_NUMBER and QUALIFY, running totals, LAG and LEAD, VARIANT and FLATTEN, MERGE and PIVOT. Each with syntax, gotcha and example, plus a 20-question quiz graded at the end.',
    'Chuleta interactiva de SQL de Snowflake para pruebas técnicas, de David Gadyan: WHERE frente a HAVING, agregación condicional con IFF y COUNT_IF, DATE_TRUNC, ROLLUP y GROUPING SETS, joins y EXISTS, CTE, funciones de ventana con OVER y PARTITION BY, ROW_NUMBER y QUALIFY, totales acumulados, LAG y LEAD, VARIANT y FLATTEN, MERGE y PIVOT. Cada una con sintaxis, trampa y ejemplo, más un quiz de 20 preguntas corregido al final.'),
  groups: {
    basics: L('Basics', 'Básicos'), aggregation: L('Aggregation', 'Agregación'), advanced: L('Advanced aggregation', 'Agregación avanzada'), joins: L('Joins', 'Joins'),
    structure: L('Query structure', 'Estructura de la consulta'), window: L('Window functions', 'Funciones de ventana'), snowflake: L('Snowflake', 'Snowflake'),
  },
  sources: L('Practice material for Snowflake Data Engineer and Analytics Engineer assessments. Syntax follows the Snowflake SQL reference; the ORDERS (order_id, customer_id, product_id, amount, status, order_date) and EMPLOYEES tables are fictional.',
    'Material de práctica para pruebas de Data Engineer y Analytics Engineer en Snowflake. La sintaxis sigue la referencia SQL de Snowflake; las tablas ORDERS (order_id, customer_id, product_id, amount, status, order_date) y EMPLOYEES son ficticias.'),
  nodes: [
    { id: 'select-basics', group: 'basics', icon: 'table',
      title: L('SELECT, WHERE, ORDER BY', 'SELECT, WHERE, ORDER BY'), short: L('Rows in, rows out', 'Filas que entran, filas que salen'),
      syntax: `SELECT order_id, customer_id, amount
FROM ORDERS
WHERE status = 'completed' AND amount > 100
ORDER BY amount DESC
LIMIT 10;

SELECT DISTINCT customer_id FROM ORDERS;`,
      when: L('Every query. WHERE filters single rows before any grouping happens.',
        'En cada consulta. WHERE filtra filas individuales antes de cualquier agrupación.'),
      what: L('Logical order of evaluation: FROM, WHERE, GROUP BY, HAVING, SELECT, QUALIFY, DISTINCT, ORDER BY, LIMIT. That order explains what each clause can see: WHERE sees raw rows, HAVING sees groups, QUALIFY sees window results.',
        'Orden lógico de evaluación: FROM, WHERE, GROUP BY, HAVING, SELECT, QUALIFY, DISTINCT, ORDER BY, LIMIT. Ese orden explica qué ve cada cláusula: WHERE ve filas, HAVING ve grupos, QUALIFY ve resultados de ventana.'),
      gotcha: L('An alias defined in SELECT cannot be used in WHERE (it runs earlier). NULL never equals anything: use IS NULL. LIMIT without ORDER BY returns an arbitrary set of rows.',
        'Un alias definido en SELECT no puede usarse en WHERE (se ejecuta antes). NULL nunca es igual a nada: usa IS NULL. LIMIT sin ORDER BY devuelve un conjunto arbitrario de filas.'),
      example: `SELECT customer_id, amount * 1.21 AS gross
FROM ORDERS
WHERE amount * 1.21 > 100      -- not: WHERE gross > 100
  AND status IS NOT NULL
ORDER BY gross DESC;` },
    { id: 'aggregates', group: 'aggregation', icon: 'sigma',
      title: L('COUNT, SUM, AVG, MIN, MAX', 'COUNT, SUM, AVG, MIN, MAX'), short: L('One number per group', 'Un número por grupo'),
      syntax: `SELECT COUNT(*)                    AS orders,
       COUNT(DISTINCT customer_id) AS customers,
       SUM(amount)                 AS revenue,
       AVG(amount)                 AS avg_order,
       MIN(amount), MAX(amount),
       MEDIAN(amount)
FROM ORDERS
WHERE status = 'completed';`,
      when: L('Totals, averages, counts and extremes over a set of rows, with or without GROUP BY.',
        'Totales, medias, recuentos y extremos sobre un conjunto de filas, con o sin GROUP BY.'),
      what: L('An aggregate collapses many rows into one value. Without GROUP BY the whole filtered table is one group and the query returns one row.',
        'Un agregado colapsa muchas filas en un valor. Sin GROUP BY, toda la tabla filtrada es un solo grupo y la consulta devuelve una fila.'),
      gotcha: L('COUNT(*) counts rows, COUNT(col) skips NULLs, COUNT(DISTINCT col) counts unique non-NULL values. AVG ignores NULLs, so AVG(col) is not SUM(col) / COUNT(*). MEDIAN resists outliers better than AVG.',
        'COUNT(*) cuenta filas, COUNT(col) omite los NULL, COUNT(DISTINCT col) cuenta valores únicos no nulos. AVG ignora los NULL, así que AVG(col) no es SUM(col) / COUNT(*). MEDIAN resiste mejor los valores extremos que AVG.'),
      example: `SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY amount) AS p90,
       APPROX_COUNT_DISTINCT(customer_id)                 AS est_customers,
       APPROX_PERCENTILE(amount, 0.95)                    AS p95_fast
FROM ORDERS;` },
    { id: 'group-by-having', group: 'aggregation', icon: 'group',
      title: L('GROUP BY and HAVING', 'GROUP BY y HAVING'), short: L('Filter groups, not rows', 'Filtrar grupos, no filas'),
      syntax: `SELECT customer_id, SUM(amount) AS total_spent, COUNT(*) AS orders
FROM ORDERS
WHERE status = 'completed'      -- rows, before grouping
GROUP BY customer_id
HAVING SUM(amount) > 300        -- groups, after aggregation
ORDER BY total_spent DESC;`,
      when: L('Per-customer, per-month or per-status metrics; any "customers with more than N orders" question.',
        'Métricas por cliente, por mes o por estado; cualquier pregunta de «clientes con más de N pedidos».'),
      what: L('GROUP BY makes one output row per distinct combination of the grouping columns. HAVING filters those rows using aggregates; WHERE cannot, because it runs before the groups exist.',
        'GROUP BY produce una fila de salida por cada combinación distinta de las columnas de agrupación. HAVING filtra esas filas usando agregados; WHERE no puede, porque se ejecuta antes de que existan los grupos.'),
      gotcha: L('Every non-aggregated SELECT column must appear in GROUP BY (or use GROUP BY ALL in Snowflake). GROUP BY 1, 2 refers to SELECT positions. A HAVING condition on a plain column is usually a WHERE in disguise and should move there.',
        'Toda columna del SELECT sin agregar debe estar en GROUP BY (o usa GROUP BY ALL en Snowflake). GROUP BY 1, 2 se refiere a posiciones del SELECT. Una condición HAVING sobre una columna normal suele ser un WHERE disfrazado y debería ir ahí.'),
      example: `SELECT customer_id, status, SUM(amount) AS total
FROM ORDERS
GROUP BY ALL;                   -- Snowflake: every non-aggregated column

SELECT customer_id, COUNT(DISTINCT product_id) AS products
FROM ORDERS
GROUP BY customer_id
HAVING COUNT(DISTINCT product_id) > 2;` },
    { id: 'conditional-agg', group: 'aggregation', icon: 'split',
      title: L('Conditional aggregation', 'Agregación condicional'), short: L('CASE, IFF, COUNT_IF', 'CASE, IFF, COUNT_IF'),
      syntax: `SELECT customer_id,
       SUM(IFF(status = 'completed', amount, 0))                  AS completed_revenue,
       SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END)  AS pending_revenue,
       COUNT_IF(status = 'cancelled')                             AS cancelled_orders,
       COUNT_IF(status = 'completed') * 100.0 / NULLIF(COUNT(*), 0) AS completion_pct
FROM ORDERS
GROUP BY customer_id;`,
      when: L('Several metrics with different filters in one pass (pivot-style columns), rates and percentages.',
        'Varias métricas con filtros distintos en una sola pasada (columnas tipo pivot), tasas y porcentajes.'),
      what: L('The condition selects which rows feed each aggregate, so one scan produces many filtered totals. NULLIF(x, 0) turns a zero divisor into NULL instead of an error; COALESCE replaces a NULL result.',
        'La condición elige qué filas alimentan cada agregado, así que un solo recorrido produce muchos totales filtrados. NULLIF(x, 0) convierte un divisor cero en NULL en vez de un error; COALESCE sustituye un resultado NULL.'),
      gotcha: L('SUM(CASE … END) without ELSE 0 still works (NULLs are ignored) but COUNT(CASE …) counts non-NULL results, not rows. Integer division truncates: multiply by 100.0, not 100.',
        'SUM(CASE … END) sin ELSE 0 funciona (los NULL se ignoran), pero COUNT(CASE …) cuenta resultados no nulos, no filas. La división entera trunca: multiplica por 100.0, no por 100.'),
      example: `SELECT COUNT(DISTINCT CASE WHEN status = 'completed' THEN customer_id END) AS buyers,
       COALESCE(SUM(amount), 0)                                           AS revenue
FROM ORDERS;` },
    { id: 'date-functions', group: 'aggregation', icon: 'calendar',
      title: L('Date truncation and arithmetic', 'Truncar fechas y aritmética'), short: L('Group by month', 'Agrupar por mes'),
      syntax: `DATE_TRUNC('MONTH', order_date)        -- 2026-01-01 for any January date
YEAR(order_date), MONTH(order_date), DAYNAME(order_date)
DATEDIFF(DAY, first_date, last_date)
DATEADD(DAY, -7, CURRENT_DATE)
order_date::DATE`,
      when: L('Monthly revenue, active customers per month, cohorts, "last 7 days" filters, gaps between orders.',
        'Ingresos mensuales, clientes activos por mes, cohortes, filtros de «últimos 7 días», intervalos entre pedidos.'),
      what: L('DATE_TRUNC keeps the type and snaps the value down to the unit, so grouping and ordering by it are correct across years. DATEDIFF counts unit boundaries crossed; DATEADD shifts a date.',
        'DATE_TRUNC conserva el tipo y baja el valor al inicio de la unidad, así que agrupar y ordenar por él es correcto entre años. DATEDIFF cuenta límites de unidad cruzados; DATEADD desplaza una fecha.'),
      gotcha: L('GROUP BY MONTH(order_date) merges January 2025 with January 2026: use DATE_TRUNC or group by year and month. DATEDIFF(MONTH, "2026-01-31", "2026-02-01") is 1 because a month boundary was crossed.',
        'GROUP BY MONTH(order_date) mezcla enero de 2025 con enero de 2026: usa DATE_TRUNC o agrupa por año y mes. DATEDIFF(MONTH, "2026-01-31", "2026-02-01") es 1 porque se cruza un límite de mes.'),
      example: `SELECT DATE_TRUNC('MONTH', order_date) AS month,
       SUM(amount)                     AS revenue,
       COUNT(DISTINCT customer_id)     AS active_customers
FROM ORDERS
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1;` },
    { id: 'rollup-cube', group: 'advanced', icon: 'layers',
      title: L('ROLLUP, CUBE, GROUPING SETS', 'ROLLUP, CUBE, GROUPING SETS'), short: L('Subtotals in one query', 'Subtotales en una consulta'),
      syntax: `GROUP BY ROLLUP(region, product)      -- (region, product), (region), ()
GROUP BY CUBE(region, product)        -- every combination, including ()
GROUP BY GROUPING SETS ((region), (product), ())
GROUPING(region)                      -- 1 on the rows where region was aggregated away`,
      when: L('Reports that need detail rows plus subtotals and a grand total without UNION ALL of several queries.',
        'Informes que necesitan filas de detalle más subtotales y un total general sin UNION ALL de varias consultas.'),
      what: L('Each grouping set produces its own aggregated rows in one result; a column aggregated away shows NULL on that row. GROUPING() tells a subtotal NULL from a real NULL.',
        'Cada conjunto de agrupación produce sus propias filas agregadas en un solo resultado; una columna agregada aparece como NULL en esa fila. GROUPING() distingue un NULL de subtotal de un NULL real.'),
      gotcha: L('ROLLUP is hierarchical (it drops columns from the right); CUBE produces 2ⁿ sets, which explodes with many columns. Sort with GROUPING() to keep totals last.',
        'ROLLUP es jerárquico (quita columnas por la derecha); CUBE produce 2ⁿ conjuntos, que se disparan con muchas columnas. Ordena con GROUPING() para dejar los totales al final.'),
      example: `SELECT region, product, SUM(amount) AS revenue, GROUPING(product) AS is_subtotal
FROM SALES
GROUP BY ROLLUP(region, product)
ORDER BY region NULLS LAST, is_subtotal, product;` },
    { id: 'joins', group: 'joins', icon: 'git-merge',
      title: L('JOINs and EXISTS', 'JOIN y EXISTS'), short: L('Combine tables', 'Combinar tablas'),
      syntax: `SELECT c.name, o.amount
FROM CUSTOMERS c
LEFT JOIN ORDERS o ON o.customer_id = c.customer_id;   -- keep every customer

SELECT c.customer_id
FROM CUSTOMERS c
WHERE NOT EXISTS (SELECT 1 FROM ORDERS o WHERE o.customer_id = c.customer_id);`,
      when: L('INNER for matches only, LEFT to keep every row of the left table, FULL for both sides, CROSS for all combinations. EXISTS for "has at least one" and NOT EXISTS for "has none".',
        'INNER solo para coincidencias, LEFT para conservar todas las filas de la tabla izquierda, FULL para ambos lados, CROSS para todas las combinaciones. EXISTS para «tiene al menos uno» y NOT EXISTS para «no tiene ninguno».'),
      what: L('A join pairs rows that satisfy the ON condition. LEFT JOIN fills missing right-side columns with NULL, so WHERE o.order_id IS NULL finds customers without orders.',
        'Un join empareja filas que cumplen la condición ON. LEFT JOIN rellena con NULL las columnas del lado derecho que faltan, así que WHERE o.order_id IS NULL encuentra clientes sin pedidos.'),
      gotcha: L('A filter on the right table in WHERE turns a LEFT JOIN into an INNER JOIN: put it in ON. Joining on a non-unique key multiplies rows (fan-out), which inflates SUM and COUNT.',
        'Un filtro sobre la tabla derecha en WHERE convierte un LEFT JOIN en INNER JOIN: ponlo en ON. Hacer join por una clave no única multiplica filas (fan-out), lo que infla SUM y COUNT.'),
      example: `-- customers with no completed order (the filter stays in ON)
SELECT c.customer_id
FROM CUSTOMERS c
LEFT JOIN ORDERS o ON o.customer_id = c.customer_id AND o.status = 'completed'
WHERE o.order_id IS NULL;` },
    { id: 'ctes-subqueries', group: 'structure', icon: 'tree',
      title: L('CTEs and subqueries', 'CTE y subconsultas'), short: L('Build in steps', 'Construir por pasos'),
      syntax: `WITH customer_revenue AS (
  SELECT customer_id, SUM(amount) AS revenue
  FROM ORDERS
  GROUP BY customer_id
),
avg_revenue AS (SELECT AVG(revenue) AS avg_rev FROM customer_revenue)
SELECT c.*
FROM customer_revenue c, avg_revenue a
WHERE c.revenue > a.avg_rev;`,
      when: L('Multi-step logic (aggregate, then compare, then rank), reuse of an intermediate result, readability in long queries.',
        'Lógica en varios pasos (agregar, comparar, clasificar), reutilizar un resultado intermedio, legibilidad en consultas largas.'),
      what: L('A CTE names a result set for the rest of the statement; several chain with commas and later ones can reference earlier ones. A subquery in WHERE returns a value or a list to compare against.',
        'Una CTE da nombre a un conjunto de resultados para el resto de la sentencia; varias se encadenan con comas y las posteriores pueden referirse a las anteriores. Una subconsulta en WHERE devuelve un valor o una lista con la que comparar.'),
      gotcha: L('The average of customer revenue is not the average order value: aggregate per customer first, then average. A CTE referenced twice may run twice; materialise heavy ones in a temporary table.',
        'La media de ingresos por cliente no es el importe medio del pedido: agrega por cliente primero y luego promedia. Una CTE referenciada dos veces puede ejecutarse dos veces; materializa las pesadas en una tabla temporal.'),
      example: `SELECT *
FROM ORDERS
WHERE amount > (SELECT AVG(amount) FROM ORDERS);   -- scalar subquery` },
    { id: 'window-over', group: 'window', icon: 'columns',
      title: L('Window functions and OVER()', 'Funciones de ventana y OVER()'), short: L('Aggregate without collapsing', 'Agregar sin colapsar'),
      syntax: `SELECT employee, department, salary,
       AVG(salary) OVER (PARTITION BY department)                   AS dept_avg,     -- per group, every row kept
       AVG(salary) OVER ()                                          AS company_avg,  -- whole table, on every row
       SUM(salary) OVER (PARTITION BY department ORDER BY salary)   AS running
FROM EMPLOYEES;`,
      when: L('You need a group-level number next to each row: share of the total, difference from the department average, position inside the group. GROUP BY would collapse the rows you still need.',
        'Necesitas un número de grupo junto a cada fila: cuota del total, diferencia con la media del departamento, posición dentro del grupo. GROUP BY colapsaría las filas que aún necesitas.'),
      what: L('OVER() defines the window. PARTITION BY splits the rows into independent groups, ORDER BY sets the order inside each one (needed for running totals, ranks, LAG and LEAD), and an empty OVER() means the whole result. The function runs once per row over that row\'s window, so the row count never changes.',
        'OVER() define la ventana. PARTITION BY divide las filas en grupos independientes, ORDER BY fija el orden dentro de cada uno (necesario para totales acumulados, rankings, LAG y LEAD) y un OVER() vacío abarca todo el resultado. La función se ejecuta una vez por fila sobre la ventana de esa fila, así que el número de filas no cambia.'),
      gotcha: L('GROUP BY returns one row per group; a window function returns every row. Without PARTITION BY the whole table is one group. Window functions are evaluated after WHERE, GROUP BY and HAVING, so they cannot appear in WHERE: filter them with QUALIFY (Snowflake) or a subquery.',
        'GROUP BY devuelve una fila por grupo; una función de ventana devuelve todas las filas. Sin PARTITION BY toda la tabla es un solo grupo. Las funciones de ventana se evalúan después de WHERE, GROUP BY y HAVING, así que no pueden ir en WHERE: fíltralas con QUALIFY (Snowflake) o con una subconsulta.'),
      example: `-- 5 employees in, 5 rows out (GROUP BY department would return 2)
SELECT employee, department, salary,
       AVG(salary) OVER (PARTITION BY department) AS avg_salary
FROM EMPLOYEES;
-- Finance: Andrew 50000 → 40000, Brian 50000 → 40000, Charles 20000 → 40000
-- Sales:   Daniel 30000 → 25000, Ethan 20000 → 25000` },
    { id: 'ranking-qualify', group: 'window', icon: 'trophy',
      title: L('ROW_NUMBER, RANK and QUALIFY', 'ROW_NUMBER, RANK y QUALIFY'), short: L('Latest row per group', 'Última fila por grupo'),
      syntax: `ROW_NUMBER()   OVER (PARTITION BY department ORDER BY salary DESC)  -- 1, 2, 3, 4, 5  (always unique)
RANK()         OVER (ORDER BY salary DESC)                           -- 1, 1, 3, 4, 4  (gaps after ties)
DENSE_RANK()   OVER (ORDER BY salary DESC)                           -- 1, 1, 2, 3, 3  (no gaps)
NTILE(4)       OVER (ORDER BY salary DESC)                           -- bucket 1–4 (quartiles)
PERCENT_RANK() OVER (ORDER BY salary DESC)                           -- (rank − 1) / (rows − 1)

SELECT *
FROM ORDERS
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC, order_id DESC) = 1;`,
      when: L('Latest or first record per customer, top-N per group, deduplication of staging data, leaderboards, quartiles for segmentation.',
        'Último o primer registro por cliente, top N por grupo, deduplicación de datos de staging, clasificaciones, cuartiles para segmentar.'),
      what: L('ROW_NUMBER is always unique; RANK gives ties the same number and skips the next ones; DENSE_RANK gives ties the same number without skipping. QUALIFY filters on the window result inside the same query, the way HAVING filters aggregates, replacing a wrapping subquery.',
        'ROW_NUMBER siempre es único; RANK da el mismo número a los empates y salta los siguientes; DENSE_RANK da el mismo número a los empates sin saltar. QUALIFY filtra por el resultado de ventana dentro de la misma consulta, como HAVING filtra agregados, y sustituye a la subconsulta envolvente.'),
      gotcha: L('ROW_NUMBER breaks ties arbitrarily unless the ORDER BY is unique (add order_id). GROUP BY customer_id with MAX(order_date) gives the date but not the rest of that row. Outside Snowflake, wrap the query in a subquery and filter rn = 1 in the outer WHERE.',
        'ROW_NUMBER rompe los empates de forma arbitraria salvo que el ORDER BY sea único (añade order_id). GROUP BY customer_id con MAX(order_date) da la fecha, pero no el resto de esa fila. Fuera de Snowflake, envuelve la consulta en una subconsulta y filtra rn = 1 en el WHERE exterior.'),
      example: `-- top 3 customers by revenue
SELECT customer_id, SUM(amount) AS revenue
FROM ORDERS
GROUP BY customer_id
QUALIFY ROW_NUMBER() OVER (ORDER BY SUM(amount) DESC) <= 3;

-- older duplicate registrations per e-mail (the latest one is rn = 1)
SELECT * FROM CUSTOMERS
QUALIFY ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) > 1;` },
    { id: 'running-lag', group: 'window', icon: 'chart',
      title: L('Running totals, frames, LAG and LEAD', 'Totales acumulados, marcos, LAG y LEAD'), short: L('Frames and offsets', 'Marcos y desplazamientos'),
      syntax: `SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)  -- running total
SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)          -- 3-row moving sum
LAG(amount)  OVER (PARTITION BY customer_id ORDER BY order_date)    -- previous row (NULL on the first)
LEAD(amount) OVER (PARTITION BY customer_id ORDER BY order_date)    -- next row (NULL on the last)
FIRST_VALUE(product_id) OVER (PARTITION BY customer_id ORDER BY order_date)   -- first purchase
amount * 100.0 / SUM(amount) OVER ()                                -- share of the total`,
      when: L('Cumulative revenue, moving averages, month-over-month change, percentage of total, gaps between consecutive dates, lifetime spending per customer.',
        'Ingresos acumulados, medias móviles, variación mes a mes, porcentaje del total, intervalos entre fechas consecutivas, gasto acumulado por cliente.'),
      what: L('The frame (ROWS BETWEEN start AND end) picks which rows of the ordered partition feed each row\'s aggregate: UNBOUNDED PRECEDING = from the first row, n PRECEDING / n FOLLOWING = n rows before or after, CURRENT ROW, UNBOUNDED FOLLOWING = to the last row. ROWS counts physical rows; RANGE groups rows with equal ORDER BY values. LAG and LEAD read a row at an offset without a self-join.',
        'El marco (ROWS BETWEEN inicio AND fin) elige qué filas de la partición ordenada alimentan el agregado de cada fila: UNBOUNDED PRECEDING = desde la primera fila, n PRECEDING / n FOLLOWING = n filas antes o después, CURRENT ROW, UNBOUNDED FOLLOWING = hasta la última fila. ROWS cuenta filas físicas; RANGE agrupa filas con el mismo valor de ORDER BY. LAG y LEAD leen una fila a cierta distancia sin self-join.'),
      gotcha: L('ORDER BY without an explicit frame defaults to RANGE … CURRENT ROW, so rows with the same date are summed together: write the frame. 2 PRECEDING is three rows, not three days (join a calendar first if days are missing). LAG on the first row is NULL: wrap divisions in NULLIF. LAST_VALUE needs … AND UNBOUNDED FOLLOWING or it returns the current row.',
        'ORDER BY sin marco explícito usa RANGE … CURRENT ROW por defecto, así que las filas con la misma fecha se suman juntas: escribe el marco. 2 PRECEDING son tres filas, no tres días (une un calendario primero si faltan días). LAG en la primera fila es NULL: envuelve las divisiones en NULLIF. LAST_VALUE necesita … AND UNBOUNDED FOLLOWING o devuelve la fila actual.'),
      example: `-- amounts 100, 200, 150, 300 → running total 100, 300, 450, 750
WITH m AS (SELECT DATE_TRUNC('MONTH', order_date) AS month, SUM(amount) AS revenue
           FROM ORDERS GROUP BY 1)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS previous_month,
       ROUND((revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100, 2) AS growth_pct
FROM m;` },
    { id: 'json-flatten', group: 'snowflake', icon: 'file-json',
      title: L('VARIANT and FLATTEN', 'VARIANT y FLATTEN'), short: L('JSON to rows', 'De JSON a filas'),
      syntax: `SELECT data:customer_id::NUMBER   AS customer_id,
       f.value:id::NUMBER         AS product_id,
       f.value:price::NUMBER      AS price
FROM RAW_ORDERS,
LATERAL FLATTEN(INPUT => data:products) f;

PARSE_JSON(raw_text)                                       -- string → VARIANT
ARRAY_AGG(DISTINCT product_id)                             -- rows → array
LISTAGG(product_id, ', ') WITHIN GROUP (ORDER BY product_id)  -- rows → string`,
      when: L('Semi-structured sources (events, API payloads) loaded as VARIANT; building arrays, objects or strings per group for output.',
        'Fuentes semiestructuradas (eventos, respuestas de API) cargadas como VARIANT; construir arrays, objetos o cadenas por grupo para la salida.'),
      what: L('data:field reads a key and :: casts it. FLATTEN turns each array element into a row joined to its parent (LATERAL), so ordinary aggregates and joins apply. OBJECT_AGG and ARRAY_AGG go the other way.',
        'data:field lee una clave y :: la convierte de tipo. FLATTEN convierte cada elemento del array en una fila unida a su padre (LATERAL), así que se aplican agregados y joins normales. OBJECT_AGG y ARRAY_AGG hacen el camino inverso.'),
      gotcha: L('Keys in the path are case-sensitive. A missing key returns NULL, not an error: COALESCE it. FLATTEN on an empty array yields no rows unless OUTER => TRUE; RECURSIVE => TRUE walks nested levels.',
        'Las claves de la ruta distinguen mayúsculas. Una clave ausente devuelve NULL, no un error: usa COALESCE. FLATTEN sobre un array vacío no produce filas salvo con OUTER => TRUE; RECURSIVE => TRUE recorre los niveles anidados.'),
      example: `SELECT data:customer_id::NUMBER     AS customer_id,
       SUM(f.value:price::NUMBER)   AS total
FROM RAW_ORDERS, LATERAL FLATTEN(INPUT => data:products) f
GROUP BY 1;` },
    { id: 'merge-reshape', group: 'snowflake', icon: 'merge',
      title: L('MERGE, PIVOT, GENERATOR', 'MERGE, PIVOT, GENERATOR'), short: L('Upsert and reshape', 'Upsert y remodelar'),
      syntax: `MERGE INTO ORDERS t
USING (SELECT * FROM STAGING_ORDERS
       QUALIFY ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY updated_at DESC) = 1) s
ON t.order_id = s.order_id
WHEN MATCHED THEN UPDATE SET t.amount = s.amount, t.status = s.status
WHEN NOT MATCHED THEN INSERT (order_id, amount, status) VALUES (s.order_id, s.amount, s.status);

SELECT * FROM (SELECT customer_id, status, amount FROM ORDERS)
PIVOT (SUM(amount) FOR status IN ('completed', 'pending', 'cancelled'));

SELECT DATEADD(DAY, SEQ4(), '2026-01-01'::DATE) AS day
FROM TABLE(GENERATOR(ROWCOUNT => 365));`,
      when: L('Incremental loads (upsert with dedupe), one column per status, calendar tables to zero-fill missing days, sampling a large table before a full run.',
        'Cargas incrementales (upsert con deduplicación), una columna por estado, tablas de calendario para rellenar días sin datos, muestreo de una tabla grande antes de una ejecución completa.'),
      what: L('MERGE matches source and target on a key and updates or inserts in one statement. PIVOT turns the values of one column into columns; UNPIVOT does the reverse. GENERATOR makes rows from nothing; SAMPLE returns a random subset.',
        'MERGE empareja origen y destino por una clave y actualiza o inserta en una sola sentencia. PIVOT convierte los valores de una columna en columnas; UNPIVOT hace lo contrario. GENERATOR crea filas de la nada; SAMPLE devuelve un subconjunto aleatorio.'),
      gotcha: L('Deduplicate the source before MERGE or it fails when one target row matches several source rows. PIVOT needs the value list spelled out (or a dynamic pivot). SAMPLE BERNOULLI(10) returns about 10 % of the rows, not exactly.',
        'Deduplica el origen antes del MERGE o fallará cuando una fila destino coincida con varias filas origen. PIVOT exige la lista de valores escrita (o un pivot dinámico). SAMPLE BERNOULLI(10) devuelve aproximadamente el 10 % de las filas, no exactamente.'),
      example: `WITH calendar AS (SELECT DATEADD(DAY, SEQ4(), '2026-01-01'::DATE) AS day
                  FROM TABLE(GENERATOR(ROWCOUNT => 365))),
daily AS (SELECT order_date::DATE AS day, SUM(amount) AS revenue FROM ORDERS GROUP BY 1)
SELECT c.day, COALESCE(d.revenue, 0) AS revenue
FROM calendar c
LEFT JOIN daily d ON d.day = c.day
ORDER BY c.day;` },
  ],
  questions: [
    Q('s-having', 'group-by-having', L('Which clause filters aggregated groups?', '¿Qué cláusula filtra grupos agregados?'),
      [C('HAVING'), C('WHERE'), C('QUALIFY'), C('ORDER BY')],
      L('HAVING runs after GROUP BY and can use aggregates; WHERE filters rows before grouping; QUALIFY filters window results.', 'HAVING se ejecuta después de GROUP BY y puede usar agregados; WHERE filtra filas antes de agrupar; QUALIFY filtra resultados de ventana.')),
    Q('s-where-rows', 'select-basics', L('Which clause filters rows before grouping?', '¿Qué cláusula filtra filas antes de agrupar?'),
      [C('WHERE'), C('HAVING'), C('GROUP BY'), C('LIMIT')],
      L('WHERE sees the raw rows; anything it removes never reaches GROUP BY or the aggregates.', 'WHERE ve las filas en bruto; lo que elimina nunca llega a GROUP BY ni a los agregados.')),
    Q('s-where-sum', 'group-by-having', L('Why does `WHERE SUM(amount) > 100` fail?', '¿Por qué falla `WHERE SUM(amount) > 100`?'),
      [L('WHERE runs before aggregation, so the aggregate does not exist yet', 'WHERE se ejecuta antes de la agregación, así que el agregado aún no existe'), L('SUM needs an alias', 'SUM necesita un alias'), L('amount is text', 'amount es texto'), L('WHERE accepts only one condition', 'WHERE solo acepta una condición')],
      L('Move the condition to HAVING, which is evaluated after the groups are built.', 'Lleva la condición a HAVING, que se evalúa después de construir los grupos.')),
    Q('s-group-by-all', 'group-by-having', L('`GROUP BY ALL` in Snowflake…', '`GROUP BY ALL` en Snowflake…'),
      [L('groups by every non-aggregated column in the SELECT list', 'agrupa por todas las columnas del SELECT que no están agregadas'), L('removes the grouping', 'elimina la agrupación'), L('groups by every column of the table', 'agrupa por todas las columnas de la tabla'), L('is another name for CUBE', 'es otro nombre de CUBE')],
      L('It saves repeating a long list of dimensions and keeps SELECT and GROUP BY in sync.', 'Evita repetir una lista larga de dimensiones y mantiene SELECT y GROUP BY sincronizados.')),
    Q('s-count-star', 'aggregates', L('What is the difference between `COUNT(*)` and `COUNT(col)`?', '¿Qué diferencia hay entre `COUNT(*)` y `COUNT(col)`?'),
      [L('COUNT(*) counts rows; COUNT(col) skips NULL values', 'COUNT(*) cuenta filas; COUNT(col) omite los valores NULL'), L('They are identical', 'Son idénticos'), L('COUNT(col) is faster and counts rows', 'COUNT(col) es más rápido y cuenta filas'), L('COUNT(*) skips rows with any NULL', 'COUNT(*) omite las filas con algún NULL')],
      L('COUNT(DISTINCT col) goes one step further and counts unique non-NULL values.', 'COUNT(DISTINCT col) va un paso más allá y cuenta valores únicos no nulos.')),
    Q('s-count-distinct', 'aggregates', L('Which expression counts unique customers?', '¿Qué expresión cuenta clientes únicos?'),
      [C('COUNT(DISTINCT customer_id)'), C('COUNT(customer_id)'), C('SUM(customer_id)'), C('UNIQUE(customer_id)')],
      L('For very large tables APPROX_COUNT_DISTINCT gives an estimate much faster.', 'En tablas muy grandes, APPROX_COUNT_DISTINCT da una estimación mucho más rápida.')),
    Q('s-median', 'aggregates', L('Which measure is least affected by a few huge orders?', '¿Qué medida se ve menos afectada por unos pocos pedidos enormes?'),
      [C('MEDIAN(amount)'), C('AVG(amount)'), C('SUM(amount)'), C('MAX(amount)')],
      L('The median is the middle value, so outliers move it little; the mean and the sum absorb them fully.', 'La mediana es el valor central, así que los extremos la mueven poco; la media y la suma los absorben por completo.')),
    Q('s-count-if', 'conditional-agg', L('Which expression counts completed orders in Snowflake?', '¿Qué expresión cuenta los pedidos completados en Snowflake?'),
      [C("COUNT_IF(status = 'completed')"), C("COUNT(status = 'completed')"), C("SUM(status = 'completed')"), C("COUNT(*) WHERE status = 'completed'")],
      L('COUNT_IF counts the rows where the condition is true; the portable form is SUM(CASE WHEN … THEN 1 ELSE 0 END).', 'COUNT_IF cuenta las filas donde la condición es cierta; la forma portable es SUM(CASE WHEN … THEN 1 ELSE 0 END).')),
    Q('s-nullif', 'conditional-agg', L('What does `NULLIF(COUNT(*), 0)` prevent?', '¿Qué evita `NULLIF(COUNT(*), 0)`?'),
      [L('Division by zero', 'La división por cero'), L('NULL counts', 'Recuentos NULL'), L('Duplicate rows', 'Filas duplicadas'), L('Empty strings', 'Cadenas vacías')],
      L('NULLIF returns NULL when both arguments are equal, so x / NULL gives NULL instead of an error.', 'NULLIF devuelve NULL cuando ambos argumentos son iguales, así que x / NULL da NULL en vez de un error.')),
    Q('s-sum-iff', 'conditional-agg', L('`SUM(IFF(status = "completed", amount, 0))` returns…', '`SUM(IFF(status = "completed", amount, 0))` devuelve…'),
      [L('the completed revenue of each group', 'los ingresos completados de cada grupo'), L('the number of completed orders', 'el número de pedidos completados'), L('the average completed amount', 'el importe medio completado'), L('all revenue', 'todos los ingresos')],
      L('IFF picks amount for completed rows and 0 for the rest, so the sum is a filtered total without a WHERE.', 'IFF elige amount en las filas completadas y 0 en el resto, así que la suma es un total filtrado sin WHERE.')),
    Q('s-date-trunc', 'date-functions', L('`DATE_TRUNC("MONTH", "2026-01-17"::DATE)` returns…', '`DATE_TRUNC("MONTH", "2026-01-17"::DATE)` devuelve…'),
      [C('2026-01-01'), C('2026-01-31'), C('2026-01'), C('1')],
      L('It keeps the date type and snaps to the first day of the month, which groups and sorts correctly.', 'Conserva el tipo fecha y lo lleva al primer día del mes, lo que agrupa y ordena correctamente.')),
    Q('s-month-vs-trunc', 'date-functions', L('Why group by `DATE_TRUNC("MONTH", d)` instead of `MONTH(d)`?', '¿Por qué agrupar por `DATE_TRUNC("MONTH", d)` en vez de por `MONTH(d)`?'),
      [L('MONTH merges the same month of different years', 'MONTH mezcla el mismo mes de años distintos'), L('MONTH is much slower', 'MONTH es mucho más lento'), L('MONTH returns text', 'MONTH devuelve texto'), L('There is no difference', 'No hay diferencia')],
      L('MONTH gives 1–12, so January 2025 and January 2026 land in the same bucket.', 'MONTH devuelve 1–12, así que enero de 2025 y enero de 2026 caen en el mismo grupo.')),
    Q('s-datediff', 'date-functions', L('`DATEDIFF(DAY, "2026-01-01", "2026-01-08")` returns…', '`DATEDIFF(DAY, "2026-01-01", "2026-01-08")` devuelve…'),
      [C('7'), C('8'), C('6'), C('1')],
      L('DATEDIFF counts the unit boundaries crossed from the first date to the second.', 'DATEDIFF cuenta los límites de unidad cruzados entre la primera fecha y la segunda.')),
    Q('s-cube', 'rollup-cube', L('`GROUP BY CUBE(a, b)` produces…', '`GROUP BY CUBE(a, b)` produce…'),
      [L('(a, b), (a), (b) and the grand total', '(a, b), (a), (b) y el total general'), L('only (a, b)', 'solo (a, b)'), L('(a, b), (a) and the grand total', '(a, b), (a) y el total general'), L('only the grand total', 'solo el total general')],
      L('CUBE generates every combination of the columns; ROLLUP is the hierarchical subset.', 'CUBE genera todas las combinaciones de las columnas; ROLLUP es el subconjunto jerárquico.')),
    Q('s-rollup', 'rollup-cube', L('`GROUP BY ROLLUP(a, b)` produces…', '`GROUP BY ROLLUP(a, b)` produce…'),
      [L('(a, b), (a) and the grand total', '(a, b), (a) y el total general'), L('every combination of a and b', 'todas las combinaciones de a y b'), L('only (a, b)', 'solo (a, b)'), L('(a, b) and (b)', '(a, b) y (b)')],
      L('ROLLUP drops columns from the right: detail, subtotal per a, grand total.', 'ROLLUP quita columnas por la derecha: detalle, subtotal por a, total general.')),
    Q('s-grouping-fn', 'rollup-cube', L('What does `GROUPING(region)` return on a subtotal row where region was aggregated away?', '¿Qué devuelve `GROUPING(region)` en una fila de subtotal donde region se ha agregado?'),
      [C('1'), C('0'), C('NULL'), L('The region name', 'El nombre de la región')],
      L('GROUPING is 1 when the column is not part of that grouping level, which separates subtotal NULLs from real NULLs.', 'GROUPING vale 1 cuando la columna no forma parte de ese nivel de agrupación, lo que separa los NULL de subtotal de los NULL reales.')),
    Q('s-left-join', 'joins', L('Which join keeps every customer, even those without orders?', '¿Qué join conserva todos los clientes, incluso los que no tienen pedidos?'),
      [L('LEFT JOIN with CUSTOMERS on the left', 'LEFT JOIN con CUSTOMERS a la izquierda'), C('INNER JOIN'), C('CROSS JOIN'), L('RIGHT JOIN with CUSTOMERS on the left', 'RIGHT JOIN con CUSTOMERS a la izquierda')],
      L('LEFT keeps all rows of the left table and fills the missing right-side columns with NULL.', 'LEFT conserva todas las filas de la tabla izquierda y rellena con NULL las columnas del lado derecho que faltan.')),
    Q('s-left-where', 'joins', L('`LEFT JOIN ORDERS o … WHERE o.status = "completed"` effectively becomes…', '`LEFT JOIN ORDERS o … WHERE o.status = "completed"` se convierte en…'),
      [L('an INNER JOIN: the NULL rows are filtered out', 'un INNER JOIN: las filas NULL se filtran'), L('a FULL JOIN', 'un FULL JOIN'), L('a CROSS JOIN', 'un CROSS JOIN'), L('still a LEFT JOIN', 'sigue siendo un LEFT JOIN')],
      L('Customers without orders have o.status NULL, which fails the WHERE; put the condition in ON to keep them.', 'Los clientes sin pedidos tienen o.status NULL, que no pasa el WHERE; pon la condición en ON para conservarlos.')),
    Q('s-no-orders', 'joins', L('Which query finds customers with no orders?', '¿Qué consulta encuentra clientes sin pedidos?'),
      [C('LEFT JOIN ORDERS o … WHERE o.order_id IS NULL'), C('INNER JOIN ORDERS o … WHERE o.order_id IS NULL'), C('CROSS JOIN ORDERS'), C('GROUP BY customer_id HAVING COUNT(*) = 0')],
      L('NOT EXISTS (SELECT 1 FROM ORDERS o WHERE o.customer_id = c.customer_id) is the equivalent, often clearer form.', 'NOT EXISTS (SELECT 1 FROM ORDERS o WHERE o.customer_id = c.customer_id) es la forma equivalente, a menudo más clara.')),
    Q('s-fan-out', 'joins', L('Joining on a non-unique key…', 'Hacer join por una clave no única…'),
      [L('multiplies rows and inflates SUM and COUNT', 'multiplica filas e infla SUM y COUNT'), L('is rejected by Snowflake', 'lo rechaza Snowflake'), L('is always faster', 'siempre es más rápido'), L('deduplicates the result', 'deduplica el resultado')],
      L('Aggregate the many side first (a CTE per key), then join, so each left row matches once.', 'Agrega primero el lado múltiple (una CTE por clave) y después haz el join, para que cada fila izquierda coincida una sola vez.')),
    Q('s-cte', 'ctes-subqueries', L('A CTE (`WITH name AS (…)`) is…', 'Una CTE (`WITH nombre AS (…)`) es…'),
      [L('a named result set available to the rest of the statement', 'un conjunto de resultados con nombre disponible para el resto de la sentencia'), L('a stored procedure', 'un procedimiento almacenado'), L('a temporary index', 'un índice temporal'), L('a materialised view', 'una vista materializada')],
      L('Several CTEs chain with commas and each can reference the earlier ones.', 'Varias CTE se encadenan con comas y cada una puede referirse a las anteriores.')),
    Q('s-avg-of-avg', 'ctes-subqueries', L('"Customers whose revenue is above the average customer revenue": what is computed first?', '«Clientes cuyos ingresos superan la media de ingresos por cliente»: ¿qué se calcula primero?'),
      [L('Revenue per customer, then the average of those values', 'Los ingresos por cliente y después la media de esos valores'), L('The average order amount', 'El importe medio de los pedidos'), L('The maximum amount', 'El importe máximo'), L('The number of orders', 'El número de pedidos')],
      L('The average order value is a different number; a CTE with SUM per customer feeds the AVG in the next step.', 'El importe medio del pedido es otro número; una CTE con SUM por cliente alimenta el AVG del paso siguiente.')),
    Q('s-scalar-subquery', 'ctes-subqueries', L('`WHERE amount > (SELECT AVG(amount) FROM ORDERS)` returns…', '`WHERE amount > (SELECT AVG(amount) FROM ORDERS)` devuelve…'),
      [L('orders above the overall average amount', 'los pedidos por encima del importe medio global'), L('one row with the average', 'una fila con la media'), L('an error: subqueries cannot go in WHERE', 'un error: las subconsultas no pueden ir en WHERE'), L('orders above their customer\'s average', 'los pedidos por encima de la media de su cliente')],
      L('A scalar subquery evaluates to one value; a per-customer comparison needs a window function or a correlated subquery.', 'Una subconsulta escalar vale un único valor; una comparación por cliente necesita una función de ventana o una subconsulta correlacionada.')),
    Q('s-window-purpose', 'window-over', L('What is the primary purpose of window functions?', '¿Cuál es el propósito principal de las funciones de ventana?'),
      [L('Analysing related rows without collapsing the result set', 'Analizar filas relacionadas sin colapsar el conjunto de resultados'), L('Returning one value and collapsing the rows', 'Devolver un valor y colapsar las filas'), L('Running nested queries', 'Ejecutar consultas anidadas'), L('Joining several databases', 'Unir varias bases de datos')],
      L('Every input row stays in the output with a value computed over its window; GROUP BY would return one row per group.', 'Cada fila de entrada permanece en la salida con un valor calculado sobre su ventana; GROUP BY devolvería una fila por grupo.')),
    Q('s-window-keep-rows', 'window-over', L('One million transactions: total revenue per customer, keeping all one million rows. What do you use?', 'Un millón de transacciones: ingresos totales por cliente, conservando el millón de filas. ¿Qué usas?'),
      [C('SUM(amount) OVER (PARTITION BY customer_id)'), C('SUM(amount) … GROUP BY customer_id'), C('SELECT DISTINCT customer_id'), C('COUNT(*) OVER ()')],
      L('PARTITION BY computes the sum per customer and repeats it on each of that customer\'s rows.', 'PARTITION BY calcula la suma por cliente y la repite en cada fila de ese cliente.')),
    Q('s-partition-by', 'window-over', L('What does `PARTITION BY` do inside `OVER()`?', '¿Qué hace `PARTITION BY` dentro de `OVER()`?'),
      [L('Divides the rows into independent groups for the calculation', 'Divide las filas en grupos independientes para el cálculo'), L('Deletes duplicate rows', 'Elimina filas duplicadas'), L('Sorts the whole table', 'Ordena toda la tabla'), L('Collapses the rows into one per group', 'Colapsa las filas en una por grupo')],
      L('Without PARTITION BY the whole result is one group; ORDER BY inside OVER sets the order within each partition.', 'Sin PARTITION BY todo el resultado es un solo grupo; ORDER BY dentro de OVER fija el orden dentro de cada partición.')),
    Q('s-over-empty', 'window-over', L('`AVG(salary) OVER ()` returns…', '`AVG(salary) OVER ()` devuelve…'),
      [L('the whole-table average, repeated on every row', 'la media de toda la tabla, repetida en cada fila'), L('one row with the average', 'una fila con la media'), L('the average per department', 'la media por departamento'), L('an error: PARTITION BY is required', 'un error: PARTITION BY es obligatorio')],
      L('An empty OVER() makes the whole result one window, which is how "share of total" columns are built.', 'Un OVER() vacío convierte todo el resultado en una sola ventana, y así se construyen las columnas de «cuota del total».')),
    Q('s-window-where', 'window-over', L('Why can a window function not be used in `WHERE`?', '¿Por qué una función de ventana no puede usarse en `WHERE`?'),
      [L('It is evaluated after WHERE, GROUP BY and HAVING', 'Se evalúa después de WHERE, GROUP BY y HAVING'), L('It returns text', 'Devuelve texto'), L('WHERE allows only one condition', 'WHERE solo admite una condición'), L('It requires an index', 'Requiere un índice')],
      L('Filter it with QUALIFY in Snowflake or with an outer query around a subquery elsewhere.', 'Fíltrala con QUALIFY en Snowflake o con una consulta exterior sobre una subconsulta en otros motores.')),
    Q('s-group-vs-window', 'window-over', L('Five employees in two departments. `AVG(salary) OVER (PARTITION BY department)` returns how many rows?', 'Cinco empleados en dos departamentos. ¿Cuántas filas devuelve `AVG(salary) OVER (PARTITION BY department)`?'),
      [C('5'), C('2'), C('1'), C('10')],
      L('A window function keeps every row; GROUP BY department would return 2.', 'Una función de ventana conserva todas las filas; GROUP BY department devolvería 2.')),
    Q('s-qualify', 'ranking-qualify', L('Which Snowflake clause filters on the result of a window function?', '¿Qué cláusula de Snowflake filtra por el resultado de una función de ventana?'),
      [C('QUALIFY'), C('HAVING'), C('WHERE'), C('DISTINCT')],
      L('QUALIFY is to window functions what HAVING is to aggregates; it removes the wrapping subquery.', 'QUALIFY es a las funciones de ventana lo que HAVING a los agregados; elimina la subconsulta envolvente.')),
    Q('s-latest-row', 'ranking-qualify', L('Best pattern for the latest order of every customer?', '¿Mejor patrón para el último pedido de cada cliente?'),
      [C('ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) … QUALIFY … = 1'), C('GROUP BY customer_id'), C('MAX(order_id) only'), C('SELECT DISTINCT customer_id')],
      L('Partition per customer, order newest first, keep row 1; add order_id to the ORDER BY so ties are deterministic.', 'Particiona por cliente, ordena del más reciente al más antiguo y quédate con la fila 1; añade order_id al ORDER BY para que los empates sean deterministas.')),
    Q('s-dense-rank', 'ranking-qualify', L('Revenues 500, 500, 400: `RANK` gives 1, 1, 3. `DENSE_RANK` gives…', 'Ingresos 500, 500, 400: `RANK` da 1, 1, 3. `DENSE_RANK` da…'),
      [C('1, 1, 2'), C('1, 2, 3'), C('1, 1, 3'), C('0, 0, 1')],
      L('DENSE_RANK never skips a number after a tie; ROW_NUMBER would give 1, 2, 3.', 'DENSE_RANK nunca salta un número tras un empate; ROW_NUMBER daría 1, 2, 3.')),
    Q('s-rank-gaps', 'ranking-qualify', L('Salaries 50k, 50k, 30k, 20k, 20k ordered DESC: which function gives 1, 1, 3, 4, 4?', 'Salarios 50k, 50k, 30k, 20k, 20k en orden DESC: ¿qué función da 1, 1, 3, 4, 4?'),
      [C('RANK()'), C('DENSE_RANK()'), C('ROW_NUMBER()'), C('NTILE(5)')],
      L('RANK shares the number on ties and skips the next ones; DENSE_RANK gives 1, 1, 2, 3, 3 and ROW_NUMBER 1 to 5.', 'RANK comparte el número en los empates y salta los siguientes; DENSE_RANK da 1, 1, 2, 3, 3 y ROW_NUMBER del 1 al 5.')),
    Q('s-ntile', 'ranking-qualify', L('`NTILE(4) OVER (ORDER BY revenue DESC)` assigns…', '`NTILE(4) OVER (ORDER BY revenue DESC)` asigna…'),
      [L('each row to one of four equal buckets (quartiles)', 'cada fila a uno de cuatro grupos iguales (cuartiles)'), L('a rank with gaps', 'un rango con saltos'), L('only the top four rows', 'solo las cuatro primeras filas'), L('a percentage between 0 and 1', 'un porcentaje entre 0 y 1')],
      L('NTILE(n) numbers buckets 1 to n of (almost) equal size; PERCENT_RANK is the one that returns 0 to 1.', 'NTILE(n) numera grupos de 1 a n de tamaño (casi) igual; PERCENT_RANK es la que devuelve de 0 a 1.')),
    Q('s-duplicates', 'ranking-qualify', L('Which pattern finds the older duplicate registrations per e-mail?', '¿Qué patrón encuentra los registros duplicados más antiguos por e-mail?'),
      [C('ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) … QUALIFY rn > 1'), C('WHERE COUNT(*) > 1'), C('SELECT DISTINCT email'), C('RANK() OVER (ORDER BY email) = 1')],
      L('The latest registration gets rn = 1; every other row of the same e-mail is an older duplicate.', 'El registro más reciente recibe rn = 1; cualquier otra fila del mismo e-mail es un duplicado más antiguo.')),
    Q('s-lag', 'running-lag', L('Which function returns the previous row\'s value?', '¿Qué función devuelve el valor de la fila anterior?'),
      [C('LAG()'), C('LEAD()'), C('FIRST_VALUE()'), C('RANK()')],
      L('LAG looks back and LEAD looks forward along the ORDER BY of the window; the first LAG is NULL.', 'LAG mira hacia atrás y LEAD hacia delante según el ORDER BY de la ventana; el primer LAG es NULL.')),
    Q('s-frame-rows', 'running-lag', L('`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` covers…', '`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` abarca…'),
      [L('the current row and the six rows before it (seven rows)', 'la fila actual y las seis anteriores (siete filas)'), L('the last seven calendar days', 'los últimos siete días naturales'), L('the six rows after the current one', 'las seis filas posteriores a la actual'), L('the whole partition', 'toda la partición')],
      L('ROWS counts physical rows; if days are missing, join a calendar table first to get a true seven-day window.', 'ROWS cuenta filas físicas; si faltan días, une primero una tabla de calendario para obtener una ventana real de siete días.')),
    Q('s-frame-2', 'running-lag', L('`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` means…', '`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` significa…'),
      [L('the current row and the two before it', 'la fila actual y las dos anteriores'), L('the current row and the next two', 'la fila actual y las dos siguientes'), L('all rows in the table', 'todas las filas de la tabla'), L('two rows only', 'solo dos filas')],
      L('That is a three-row moving window: on day 4 of 100, 200, 150, 300 the sum is 200 + 150 + 300 = 650.', 'Es una ventana móvil de tres filas: el día 4 de 100, 200, 150, 300 la suma es 200 + 150 + 300 = 650.')),
    Q('s-running-total', 'running-lag', L('Correct structure for a running total of revenue per customer?', '¿Estructura correcta para un total acumulado de ingresos por cliente?'),
      [C('SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date)'), C('SUM(amount) … GROUP BY customer_id'), C('SUM(amount) OVER ()'), C('SUM(amount) OVER (PARTITION BY order_date)')],
      L('Partition per customer and order by date; add ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW to make the frame explicit.', 'Particiona por cliente y ordena por fecha; añade ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW para hacer explícito el marco.')),
    Q('s-sum-sum-over', 'running-lag', L('In a grouped query, `SUM(SUM(amount)) OVER ()` gives…', 'En una consulta agrupada, `SUM(SUM(amount)) OVER ()` da…'),
      [L('the grand total, repeated on every group row', 'el total general, repetido en cada fila de grupo'), L('a syntax error', 'un error de sintaxis'), L('the group\'s own total', 'el total del propio grupo'), L('a running total', 'un total acumulado')],
      L('The inner SUM is the group total; the outer window SUM adds those totals across all groups, which gives share-of-total columns.', 'El SUM interior es el total del grupo; el SUM de ventana exterior suma esos totales de todos los grupos, lo que da columnas de cuota del total.')),
    Q('s-lag-first', 'running-lag', L('`LAG(revenue)` on the first row of a partition returns…', '`LAG(revenue)` en la primera fila de una partición devuelve…'),
      [C('NULL'), C('0'), L('the same row\'s value', 'el valor de la misma fila'), L('an error', 'un error')],
      L('There is no previous row; wrap growth divisions in NULLIF or give LAG a default third argument.', 'No hay fila anterior; envuelve las divisiones de crecimiento en NULLIF o da a LAG un tercer argumento por defecto.')),
    Q('s-first-value', 'running-lag', L('Which expression returns the product of a customer\'s first order, by date?', '¿Qué expresión devuelve el producto del primer pedido de un cliente, por fecha?'),
      [C('FIRST_VALUE(product_id) OVER (PARTITION BY customer_id ORDER BY order_date)'), C('MIN(product_id)'), C('LAG(product_id)'), C('LEAD(product_id)')],
      L('MIN(product_id) gives the smallest id, not the earliest order; FIRST_VALUE follows the window order.', 'MIN(product_id) da el id más pequeño, no el pedido más antiguo; FIRST_VALUE sigue el orden de la ventana.')),
    Q('s-variant-cast', 'json-flatten', L('Which expression reads a VARIANT key as a number?', '¿Qué expresión lee una clave VARIANT como número?'),
      [C('data:amount::NUMBER'), C('NUMBER(data.amount)'), C("data['amount'] AS NUMBER"), C('CAST data:amount')],
      L('The colon reads the key and the double colon casts; keys are case-sensitive.', 'Los dos puntos leen la clave y los cuatro puntos convierten el tipo; las claves distinguen mayúsculas.')),
    Q('s-flatten', 'json-flatten', L('`LATERAL FLATTEN(INPUT => data:items)` does…', '`LATERAL FLATTEN(INPUT => data:items)` hace…'),
      [L('one output row per array element', 'una fila de salida por elemento del array'), L('merges the array into a string', 'une el array en una cadena'), L('removes NULL elements', 'elimina los elementos NULL'), L('sorts the array', 'ordena el array')],
      L('Each element appears as f.value next to its parent row, so you can aggregate or join on it.', 'Cada elemento aparece como f.value junto a su fila padre, así que puedes agregar o hacer join sobre él.')),
    Q('s-array-agg', 'json-flatten', L('Which builds one array of product ids per customer?', '¿Qué construye un array de ids de producto por cliente?'),
      [C('ARRAY_AGG(DISTINCT product_id)'), C('LISTAGG(product_id)'), C('FLATTEN(product_id)'), C('SUM(product_id)')],
      L('ARRAY_AGG returns an ARRAY; LISTAGG returns a delimited string and FLATTEN goes the other way.', 'ARRAY_AGG devuelve un ARRAY; LISTAGG devuelve una cadena con separadores y FLATTEN hace el camino inverso.')),
    Q('s-merge', 'merge-reshape', L('`MERGE INTO … WHEN MATCHED THEN UPDATE … WHEN NOT MATCHED THEN INSERT` implements…', '`MERGE INTO … WHEN MATCHED THEN UPDATE … WHEN NOT MATCHED THEN INSERT` implementa…'),
      [L('an upsert for incremental loads', 'un upsert para cargas incrementales'), L('a full table reload', 'una recarga completa de la tabla'), L('a delete', 'un borrado'), L('a pivot', 'un pivot')],
      L('One statement updates existing keys and inserts new ones; it is the core of incremental ELT.', 'Una sola sentencia actualiza las claves existentes e inserta las nuevas; es el núcleo del ELT incremental.')),
    Q('s-merge-dedupe', 'merge-reshape', L('Before a MERGE, the source should be…', 'Antes de un MERGE, el origen debe estar…'),
      [L('deduplicated on the match key', 'deduplicado por la clave de coincidencia'), L('sorted by date', 'ordenado por fecha'), L('indexed', 'indexado'), L('pivoted', 'pivotado')],
      L('If one target row matches several source rows the MERGE fails; ROW_NUMBER with QUALIFY = 1 keeps the latest version.', 'Si una fila destino coincide con varias filas origen el MERGE falla; ROW_NUMBER con QUALIFY = 1 conserva la versión más reciente.')),
    Q('s-generator', 'merge-reshape', L('`GENERATOR(ROWCOUNT => 365)` with `DATEADD(DAY, SEQ4(), …)` builds…', '`GENERATOR(ROWCOUNT => 365)` con `DATEADD(DAY, SEQ4(), …)` construye…'),
      [L('a calendar table, one row per day', 'una tabla de calendario, una fila por día'), L('a random sample', 'una muestra aleatoria'), L('a pivot table', 'una tabla pivot'), L('a sequence of orders', 'una secuencia de pedidos')],
      L('LEFT JOIN daily revenue to it and COALESCE to 0 to fill the days without sales.', 'Haz LEFT JOIN de los ingresos diarios con ella y COALESCE a 0 para rellenar los días sin ventas.')),
    Q('s-pivot', 'merge-reshape', L('`PIVOT` converts…', '`PIVOT` convierte…'),
      [L('rows into columns', 'filas en columnas'), L('columns into rows', 'columnas en filas'), L('JSON into rows', 'JSON en filas'), L('a table into a view', 'una tabla en una vista')],
      L('PIVOT (SUM(amount) FOR status IN (…)) gives one column per status; UNPIVOT is the reverse.', 'PIVOT (SUM(amount) FOR status IN (…)) da una columna por estado; UNPIVOT es lo contrario.')),
    Q('s-eval-order', 'select-basics', L('Logical order of evaluation of a query?', '¿Orden lógico de evaluación de una consulta?'),
      [C('FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY'), C('SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY'), C('FROM, SELECT, WHERE, GROUP BY, ORDER BY'), C('WHERE, FROM, SELECT, GROUP BY')],
      L('That order is why a SELECT alias cannot be used in WHERE and why HAVING can see aggregates.', 'Ese orden explica por qué un alias del SELECT no puede usarse en WHERE y por qué HAVING ve los agregados.')),
    Q('s-is-null', 'select-basics', L('Which condition finds rows where `status` is missing?', '¿Qué condición encuentra las filas donde falta `status`?'),
      [C('WHERE status IS NULL'), C('WHERE status = NULL'), C('WHERE status == NULL'), C('WHERE NULL(status)')],
      L('NULL is not a value, so = NULL is never true; IS NULL and IS NOT NULL are the tests.', 'NULL no es un valor, así que = NULL nunca es cierto; las comprobaciones son IS NULL e IS NOT NULL.')),
  ],
};
