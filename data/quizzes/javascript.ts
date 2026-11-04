import { C, L, Q, type Track } from './types';

/**
 * JavaScript: the syntax timed coding assessments (HackerRank, Codility, TestGorilla and company tests) ask about most.
 * Twelve cards, from variables to the event loop, and the question bank the practice quiz draws from.
 */
export const javascript: Track = {
  id: 'javascript',
  logo: 'javascript',
  name: 'JavaScript',
  tagline: L('Twelve syntax patterns behind most JavaScript assessment questions: arrays, objects, closures, promises and the event loop, with a 20-question practice quiz.',
    'Doce patrones de sintaxis detrás de la mayoría de preguntas de JavaScript en pruebas técnicas: arrays, objetos, closures, promesas y el event loop, con un quiz de práctica de 20 preguntas.'),
  title: L('JavaScript: Syntax Cheatsheet and Practice Quiz', 'JavaScript: chuleta de sintaxis y quiz de práctica'),
  description: L('Interactive JavaScript cheatsheet for coding assessments by David Gadyan: const and let, strict equality, map, filter and reduce, spread and destructuring, optional chaining, Map and Set, closures, promises, async/await and the event loop. Each pattern has its syntax, a gotcha and an example, plus a 20-question quiz graded at the end.',
    'Chuleta interactiva de JavaScript para pruebas técnicas, de David Gadyan: const y let, igualdad estricta, map, filter y reduce, spread y destructuring, encadenamiento opcional, Map y Set, closures, promesas, async/await y el event loop. Cada patrón con su sintaxis, su trampa y un ejemplo, más un quiz de 20 preguntas corregido al final.'),
  groups: {
    basics: L('Basics', 'Básicos'), arrays: L('Arrays', 'Arrays'), objects: L('Objects', 'Objetos'), collections: L('Collections', 'Colecciones'),
    functions: L('Functions', 'Funciones'), async: L('Async', 'Asíncrono'), patterns: L('Patterns', 'Patrones'),
  },
  sources: L('Practice material for timed coding assessments (HackerRank, Codility, TestGorilla and similar). Behaviour described follows the ECMAScript specification as implemented in current browsers and Node.js.',
    'Material de práctica para pruebas técnicas cronometradas (HackerRank, Codility, TestGorilla y similares). El comportamiento descrito sigue la especificación ECMAScript tal como la implementan los navegadores actuales y Node.js.'),
  nodes: [
    { id: 'variables', group: 'basics', icon: 'variable',
      title: L('const, let and var', 'const, let y var'), short: L('Scope and reassignment', 'Ámbito y reasignación'),
      syntax: `const x = 10;   // no reassignment (an object inside can still change)
let y = 20;     // block-scoped, reassignable
var z = 30;     // function-scoped, hoisted as undefined: avoid`,
      when: L('Default to const; switch to let only when the binding must be reassigned (counters, loop indexes). Never var in new code.',
        'Usa const por defecto; cambia a let solo cuando la variable deba reasignarse (contadores, índices de bucle). Nunca var en código nuevo.'),
      what: L('const and let are block-scoped and sit in the temporal dead zone until their line runs. var is function-scoped and hoisted to the top of the function with the value undefined. Function declarations hoist whole, so they can be called before their line.',
        'const y let tienen ámbito de bloque y están en la zona muerta temporal hasta que se ejecuta su línea. var tiene ámbito de función y se eleva (hoisting) al principio con valor undefined. Las declaraciones de función se elevan enteras, así que pueden llamarse antes de su línea.'),
      gotcha: L('const freezes the binding, not the value: const user = {} still allows user.name = "x". Reading a let before its declaration throws a ReferenceError; reading a var gives undefined.',
        'const congela la variable, no el valor: const user = {} sigue permitiendo user.name = "x". Leer un let antes de su declaración lanza ReferenceError; leer un var da undefined.'),
      example: `console.log(a); // undefined (var is hoisted)
var a = 1;
console.log(b); // ReferenceError (temporal dead zone)
let b = 2;
hello();        // works: function declarations hoist whole
function hello() {}` },
    { id: 'equality', group: 'basics', icon: 'equal',
      title: L('=== and truthy / falsy', '=== y truthy / falsy'), short: L('Strict comparison', 'Comparación estricta'),
      syntax: `5 === "5"   // false  (value AND type)
5 == "5"    // true   (coerces: avoid)
// falsy: false, 0, -0, "", null, undefined, NaN
// truthy: everything else, including [], {}, "0", "false"`,
      when: L('Every comparison. The one accepted use of == is x == null, which matches both null and undefined.',
        'En cada comparación. El único uso aceptado de == es x == null, que coincide con null y con undefined.'),
      what: L('=== compares value and type without coercion. Boolean contexts (if, &&, ||, !) convert the value using the falsy list: seven falsy values, everything else is truthy.',
        '=== compara valor y tipo sin coerción. Los contextos booleanos (if, &&, ||, !) convierten el valor según la lista de falsy: siete valores falsy, todo lo demás es truthy.'),
      gotcha: L('An empty array and an empty object are truthy, so if (arr) does not test emptiness: use arr.length === 0. NaN !== NaN, so use Number.isNaN(). [] == false is true because of coercion.',
        'Un array vacío y un objeto vacío son truthy, así que if (arr) no comprueba si está vacío: usa arr.length === 0. NaN !== NaN, usa Number.isNaN(). [] == false es true por la coerción.'),
      example: `[] == false   // true  (coercion)
[] === false  // false
if (arr.length === 0) {}   // the right emptiness check
Number.isNaN(NaN)          // true
null == undefined          // true;  null === undefined // false` },
    { id: 'array-transform', group: 'arrays', icon: 'brackets',
      title: L('map, filter, reduce', 'map, filter, reduce'), short: L('Transform, keep, fold', 'Transformar, filtrar, plegar'),
      syntax: `nums.map(x => x * 2)                 // same length, new values
nums.filter(x => x % 2 === 0)        // a subset
nums.reduce((acc, x) => acc + x, 0)  // one value`,
      when: L('map to transform every element, filter to keep a subset, reduce to produce one value: a sum, a lookup object, grouped data.',
        'map para transformar cada elemento, filter para quedarte con un subconjunto, reduce para producir un solo valor: una suma, un objeto de búsqueda, datos agrupados.'),
      what: L('All three return a new array or value and leave the original untouched, so they chain top to bottom like a pipeline. The callback receives (element, index, array).',
        'Los tres devuelven un array o valor nuevo y no tocan el original, así que se encadenan de arriba abajo como una tubería. El callback recibe (elemento, índice, array).'),
      gotcha: L('Always pass reduce an initial value: without it the first element becomes the accumulator and an empty array throws. A map callback with braces and no return gives an array of undefined. forEach returns undefined, so it cannot be chained.',
        'Pasa siempre un valor inicial a reduce: sin él, el primer elemento hace de acumulador y un array vacío lanza error. Un callback de map con llaves y sin return da un array de undefined. forEach devuelve undefined: no se encadena.'),
      example: `const total = orders
  .filter(o => o.status === 'completed')
  .map(o => o.amount)
  .reduce((sum, a) => sum + a, 0);

const byId = users.reduce((acc, u) => { acc[u.id] = u; return acc; }, {});` },
    { id: 'array-search', group: 'arrays', icon: 'search-check',
      title: L('find, some, every, sort', 'find, some, every, sort'), short: L('Search and order', 'Buscar y ordenar'),
      syntax: `users.find(u => u.id === 5)      // first match or undefined
users.some(u => u.age >= 18)     // at least one → boolean
users.every(u => u.age >= 18)    // all → boolean
[1, 2, 3].includes(2)            // true
nums.sort((a, b) => a - b)       // ascending numbers (in place)`,
      when: L('find for one item, some and every for yes/no checks, includes for primitives, sort with a comparator for anything numeric or by field.',
        'find para un elemento, some y every para comprobaciones sí/no, includes para primitivos, sort con comparador para todo lo numérico o por campo.'),
      what: L('find and some stop at the first hit; every stops at the first miss. sort reorders the array in place using the sign of the comparator: negative keeps a before b.',
        'find y some se detienen en el primer acierto; every se detiene en el primer fallo. sort reordena el array en el sitio según el signo del comparador: negativo deja a antes de b.'),
      gotcha: L('sort() without a comparator sorts as strings (10 before 9) and it mutates: copy first with [...nums].sort() or use toSorted(). findIndex returns -1 when nothing matches, find returns undefined.',
        'sort() sin comparador ordena como cadenas (10 antes que 9) y muta el array: copia primero con [...nums].sort() o usa toSorted(). findIndex devuelve -1 si no hay coincidencia, find devuelve undefined.'),
      example: `const sorted = [...users].sort((a, b) => a.age - b.age);   // original untouched
const desc = [...nums].sort((a, b) => b - a);
users.sort((a, b) => a.name.localeCompare(b.name));
[10, 9, 1].sort()   // [1, 10, 9]  (string order!)` },
    { id: 'spread-destructure', group: 'objects', icon: 'braces',
      title: L('Spread and destructuring', 'Spread y destructuring'), short: L('Copy, merge, unpack', 'Copiar, combinar, desempaquetar'),
      syntax: `const b = [...a, 3, 4];                 // array copy + append
const updated = { ...user, age: 34 };   // object copy + override
const { name, age = 0 } = user;         // unpack with a default
const [first, , third] = list;          // skip a position
const { id, ...rest } = obj;            // rest must be last
function User({ name, age }) {}         // destructured parameter`,
      when: L('Immutable updates (React state), merging defaults with options, pulling fields out of API responses and props.',
        'Actualizaciones inmutables (estado de React), combinar valores por defecto con opciones, extraer campos de respuestas de API y de props.'),
      what: L('Spread copies own enumerable properties or iterable items into a new array or object; later keys override earlier ones. Destructuring binds variables to positions or keys in one line.',
        'Spread copia las propiedades propias enumerables o los elementos iterables en un array u objeto nuevo; las claves posteriores sobrescriben las anteriores. Destructuring asigna variables a posiciones o claves en una línea.'),
      gotcha: L('Spread is shallow: nested objects are still shared references. Rest must be the last element. Destructuring a missing key gives undefined unless you add a default.',
        'Spread es superficial: los objetos anidados siguen siendo referencias compartidas. Rest debe ir el último. Desestructurar una clave inexistente da undefined salvo que añadas un valor por defecto.'),
      example: `const defaults = { theme: 'light', lang: 'en' };
const opts = { ...defaults, lang: 'es' };   // { theme: 'light', lang: 'es' }

const { data: { items = [] } = {} } = response;   // nested with defaults
const [x, y] = [y, x];                            // swap` },
    { id: 'optional-nullish', group: 'objects', icon: 'shield',
      title: L('?. and ??', '?. y ??'), short: L('Safe access, real defaults', 'Acceso seguro, valores por defecto'),
      syntax: `user?.address?.city        // undefined instead of a TypeError
user.getName?.()           // call only if it exists
items?.[0]
const name = user.name ?? 'Unknown';   // only null / undefined fall back
count ??= 10;              // assign only when null / undefined`,
      when: L('Reading nested API data that may be missing; defaults for values where 0, "" or false are legitimate.',
        'Leer datos anidados de una API que pueden faltar; valores por defecto donde 0, "" o false son válidos.'),
      what: L('?. short-circuits to undefined when the left side is null or undefined. ?? returns the right side only for null or undefined, unlike ||, which also replaces 0, "" and false.',
        '?. corta y devuelve undefined cuando el lado izquierdo es null o undefined. ?? devuelve el lado derecho solo para null o undefined, a diferencia de ||, que también sustituye 0, "" y false.'),
      gotcha: L('0 || 10 is 10 but 0 ?? 10 is 0. Optional chaining does not catch errors thrown inside the call, only a missing receiver. Mixing ?? with || or && needs parentheses.',
        '0 || 10 es 10, pero 0 ?? 10 es 0. El encadenamiento opcional no captura errores lanzados dentro de la llamada, solo un receptor ausente. Mezclar ?? con || o && exige paréntesis.'),
      example: `const port = config.port ?? 3000;     // keeps an explicit 0
const label = config.label || 'n/a';  // '' becomes 'n/a'
const city = order?.customer?.address?.city ?? '—';` },
    { id: 'object-methods', group: 'objects', icon: 'properties',
      title: L('Object.keys, values, entries', 'Object.keys, values, entries'), short: L('Iterate objects', 'Recorrer objetos'),
      syntax: `Object.keys(obj)       // ['a', 'b']
Object.values(obj)     // [1, 2]
Object.entries(obj)    // [['a', 1], ['b', 2]]
Object.fromEntries(pairs)
Object.hasOwn(obj, 'a')`,
      when: L('Looping over a lookup object, converting between arrays and objects, filtering or mapping an object\'s fields.',
        'Recorrer un objeto de búsqueda, convertir entre arrays y objetos, filtrar o mapear los campos de un objeto.'),
      what: L('The three accessors return arrays of own enumerable string keys in insertion order, so every array method becomes available; fromEntries reverses entries.',
        'Los tres accesores devuelven arrays con las claves propias enumerables en orden de inserción, así que todos los métodos de array quedan disponibles; fromEntries invierte entries.'),
      gotcha: L('Keys are strings even for numeric-looking properties. for...in also walks inherited properties: prefer Object.keys. Use Object.hasOwn instead of obj.hasOwnProperty.',
        'Las claves son cadenas aunque parezcan números. for...in recorre también las propiedades heredadas: prefiere Object.keys. Usa Object.hasOwn en vez de obj.hasOwnProperty.'),
      example: `const prices = { a: 10, b: 25, c: 7 };
const expensive = Object.fromEntries(
  Object.entries(prices).filter(([, p]) => p > 9)
);   // { a: 10, b: 25 }
for (const [k, v] of Object.entries(prices)) console.log(k, v);` },
    { id: 'map-set', group: 'collections', icon: 'boxes',
      title: L('Map and Set', 'Map y Set'), short: L('Counting and dedupe', 'Contar y deduplicar'),
      syntax: `const freq = new Map();
for (const x of arr) freq.set(x, (freq.get(x) ?? 0) + 1);
freq.has(x); freq.size; [...freq.entries()]

const unique = [...new Set(arr)];`,
      when: L('Frequency counts, O(1) lookups by any key type, removing duplicates, caching results, detecting duplicates in one pass.',
        'Conteos de frecuencia, búsquedas O(1) por cualquier tipo de clave, eliminar duplicados, cachear resultados, detectar duplicados en una pasada.'),
      what: L('Map keeps insertion order, allows object keys and has O(1) average get, set and has. Set stores unique values with the same operations. Both are iterable with for...of.',
        'Map conserva el orden de inserción, admite claves objeto y tiene get, set y has en O(1) de media. Set guarda valores únicos con las mismas operaciones. Ambos se recorren con for...of.'),
      gotcha: L('Map.get on a missing key returns undefined, hence the ?? 0. Object keys are compared by reference, not by shape, so Set does not dedupe objects with equal contents. A plain object also works as a counter but turns keys into strings.',
        'Map.get con una clave inexistente devuelve undefined, de ahí el ?? 0. Las claves objeto se comparan por referencia, no por contenido: Set no deduplica objetos iguales. Un objeto normal también sirve de contador, pero convierte las claves en cadenas.'),
      example: `const count = {};
for (const w of words) count[w] = (count[w] || 0) + 1;

const hasDuplicate = new Set(nums).size !== nums.length;
const top = [...freq.entries()].sort((a, b) => b[1] - a[1])[0];   // most frequent` },
    { id: 'closures', group: 'functions', icon: 'lock',
      title: L('Closures, this and debounce', 'Closures, this y debounce'), short: L('Functions that remember', 'Funciones que recuerdan'),
      syntax: `function counter() {
  let count = 0;
  return () => ++count;      // remembers count
}
const inc = counter(); inc(); inc();   // 2

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}`,
      when: L('Private state without classes, memoisation, handlers that need context, search boxes (debounce) and scroll or resize handlers (throttle).',
        'Estado privado sin clases, memoización, manejadores que necesitan contexto, buscadores (debounce) y manejadores de scroll o resize (throttle).'),
      what: L('An inner function keeps a live reference to its outer scope after the outer function has returned. Arrow functions take this from the surrounding scope; regular functions get this from how they are called.',
        'Una función interna mantiene una referencia viva a su ámbito exterior después de que la función externa haya terminado. Las arrow functions toman this del ámbito que las rodea; las funciones normales reciben this según cómo se llaman.'),
      gotcha: L('Debounce fires once after the user stops; throttle fires at most once per interval. A var in a loop shares one binding across all closures; let creates one per iteration.',
        'Debounce se dispara una vez cuando el usuario para; throttle como mucho una vez por intervalo. Un var en un bucle comparte una sola variable entre todos los closures; let crea una por iteración.'),
      example: `function throttle(fn, delay) {
  let last = 0;
  return (...args) => { const now = Date.now(); if (now - last >= delay) { last = now; fn(...args); } };
}
const search = debounce(q => fetch('/api?q=' + q), 300);   // one request after typing stops` },
    { id: 'async', group: 'async', icon: 'hourglass',
      title: L('Promises and async / await', 'Promesas y async / await'), short: L('Waiting without blocking', 'Esperar sin bloquear'),
      syntax: `async function getUsers() {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Request failed');
    return await res.json();
  } catch (err) { console.error(err); }
}
const [users, posts] = await Promise.all([getUsers(), getPosts()]);`,
      when: L('Any I/O: HTTP calls, timers, file reads. Promise.all for independent requests, allSettled when some may fail, race for timeouts, any for the first success.',
        'Cualquier E/S: llamadas HTTP, temporizadores, lectura de archivos. Promise.all para peticiones independientes, allSettled cuando alguna puede fallar, race para timeouts, any para el primer éxito.'),
      what: L('await pauses the async function, not the thread, and unwraps the promise. An async function always returns a promise; a thrown error becomes a rejection that .catch or try/catch receives.',
        'await pausa la función async, no el hilo, y extrae el valor de la promesa. Una función async siempre devuelve una promesa; un error lanzado se convierte en un rechazo que recibe .catch o try/catch.'),
      gotcha: L('fetch only rejects on network failure, so check res.ok for 404 and 500. Promise.all rejects as soon as one promise rejects. await inside a for loop runs sequentially; collect promises and Promise.all them to run in parallel.',
        'fetch solo rechaza si falla la red: comprueba res.ok para 404 y 500. Promise.all rechaza en cuanto una promesa rechaza. await dentro de un for se ejecuta en secuencia; reúne las promesas y usa Promise.all para paralelizar.'),
      example: `Promise.resolve(1).then(x => x + 1)      // resolves to 2
const results = await Promise.allSettled(tasks);
const ok = results.filter(r => r.status === 'fulfilled').map(r => r.value);
await Promise.race([fetchData(), timeout(5000)]);` },
    { id: 'event-loop', group: 'async', icon: 'orbit',
      title: L('Event loop order', 'Orden del event loop'), short: L('Sync, microtasks, macrotasks', 'Síncrono, microtareas, macrotareas'),
      syntax: `console.log('A');
setTimeout(() => console.log('B'), 0);            // macrotask
Promise.resolve().then(() => console.log('C'));   // microtask
console.log('D');
// A D C B`,
      when: L('Every "what is printed?" question, and every bug where a callback runs later than expected.',
        'En cada pregunta de «¿qué se imprime?» y en cada bug donde un callback se ejecuta más tarde de lo esperado.'),
      what: L('The call stack runs synchronous code to the end, then all queued microtasks (promise callbacks, queueMicrotask), then one macrotask (setTimeout, setInterval, I/O), then the microtasks again, and so on.',
        'La pila ejecuta el código síncrono hasta el final, después todas las microtareas en cola (callbacks de promesas, queueMicrotask), después una macrotarea (setTimeout, setInterval, E/S), después otra vez las microtareas, y así sucesivamente.'),
      gotcha: L('setTimeout(fn, 0) is never immediate. An await splits the function: the code after it is a microtask. A long synchronous loop blocks everything, including rendering and timers.',
        'setTimeout(fn, 0) nunca es inmediato. Un await parte la función: el código posterior es una microtarea. Un bucle síncrono largo bloquea todo, incluido el renderizado y los temporizadores.'),
      example: `async function f() { console.log(1); await null; console.log(3); }
f();
console.log(2);
// 1 2 3` },
    { id: 'patterns', group: 'patterns', icon: 'workflow',
      title: L('Two pointers, sliding window, Big-O', 'Dos punteros, ventana deslizante, Big-O'), short: L('From O(n²) to O(n)', 'De O(n²) a O(n)'),
      syntax: `let l = 0, r = arr.length - 1;            // two pointers
while (l < r) { /* compare arr[l], arr[r] */ l++; r--; }

let left = 0;                              // sliding window
for (let right = 0; right < arr.length; right++) {
  while (/* window invalid */) left++;
  // arr[left..right] is a valid window
}`,
      when: L('Pairs in a sorted array, palindromes, longest substring without repeats, max sum of k elements, duplicates in O(n).',
        'Pares en un array ordenado, palíndromos, subcadena más larga sin repetidos, suma máxima de k elementos, duplicados en O(n).'),
      what: L('Two pointers move inward or in step over sorted data. A sliding window keeps a valid range and only moves its ends forward. A Set or Map turns a nested-loop search into one pass.',
        'Dos punteros avanzan hacia dentro o al compás sobre datos ordenados. Una ventana deslizante mantiene un rango válido y solo mueve sus extremos hacia delante. Un Set o Map convierte una búsqueda con bucles anidados en una sola pasada.'),
      gotcha: L('Array index, push, pop and Map/Set operations are O(1); shift and unshift are O(n); sorting is O(n log n). Use a head index instead of shift() for a queue.',
        'Indexar un array, push, pop y las operaciones de Map/Set son O(1); shift y unshift son O(n); ordenar es O(n log n). Usa un índice de cabeza en vez de shift() para una cola.'),
      example: `function isPalindrome(s) {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = t.length - 1;
  while (l < r) { if (t[l++] !== t[r--]) return false; }
  return true;
}
const seen = new Set();
const firstDup = nums.find(n => seen.has(n) || (seen.add(n), false));` },
  ],
  questions: [
    Q('js-const', 'variables', L('Which keyword should be the default for a variable that is never reassigned?', '¿Qué palabra clave debe ser la opción por defecto para una variable que nunca se reasigna?'),
      [C('const'), C('let'), C('var'), C('static')],
      L('const forbids reassigning the binding and states the intent; use let only when the value must change.', 'const impide reasignar la variable y deja clara la intención; usa let solo cuando el valor deba cambiar.')),
    Q('js-var-hoist', 'variables', L('What is printed?', '¿Qué se imprime?'),
      [C('undefined'), C('10'), C('ReferenceError'), C('null')],
      L('var declarations are hoisted to the top of the function with the value undefined; the assignment stays where it is.', 'Las declaraciones var se elevan al principio de la función con valor undefined; la asignación se queda donde está.'),
      'console.log(x);\nvar x = 10;'),
    Q('js-let-tdz', 'variables', L('What happens here?', '¿Qué ocurre aquí?'),
      [C('ReferenceError'), L('undefined is printed', 'Se imprime undefined'), L('5 is printed', 'Se imprime 5'), L('null is printed', 'Se imprime null')],
      L('A let binding exists from the top of the block but is in the temporal dead zone until its line runs, so reading it throws.', 'Un let existe desde el principio del bloque pero está en la zona muerta temporal hasta que se ejecuta su línea, así que leerlo lanza error.'),
      'console.log(y);\nlet y = 5;'),
    Q('js-const-object', 'variables', L('Given `const user = { name: "Ann" }`, which line throws?', 'Dado `const user = { name: "Ann" }`, ¿qué línea lanza error?'),
      [C('user = { name: "Bo" }'), C('user.name = "Bo"'), C('user.age = 30'), C('delete user.name')],
      L('const protects the binding, not the object: properties can still be added, changed or deleted.', 'const protege la variable, no el objeto: sus propiedades se pueden añadir, cambiar o borrar.')),
    Q('js-strict-eq', 'equality', L('What does `5 === "5"` evaluate to?', '¿Qué devuelve `5 === "5"`?'),
      [C('false'), C('true'), C('5'), C('TypeError')],
      L('=== compares type as well as value; a number is never strictly equal to a string.', '=== compara el tipo además del valor; un número nunca es estrictamente igual a una cadena.')),
    Q('js-falsy', 'equality', L('Which value is falsy?', '¿Qué valor es falsy?'),
      [C('0'), C('[]'), C('{}'), C('"0"')],
      L('The falsy values are false, 0, -0, "", null, undefined and NaN. Empty arrays, empty objects and the string "0" are truthy.', 'Los valores falsy son false, 0, -0, "", null, undefined y NaN. Los arrays vacíos, los objetos vacíos y la cadena "0" son truthy.')),
    Q('js-empty-array', 'equality', L('Which check correctly tests whether an array is empty?', '¿Qué comprobación detecta correctamente que un array está vacío?'),
      [C('if (arr.length === 0)'), C('if (!arr)'), C('if (arr === [])'), C('if (arr == false)')],
      L('An empty array is truthy and two arrays are never === (different references); arr == false is also true for [0]. Only the length is reliable.', 'Un array vacío es truthy y dos arrays nunca son === (referencias distintas); arr == false también es true para [0]. Solo la longitud es fiable.')),
    Q('js-filter', 'array-transform', L('Which method returns a new array with only the elements that pass a test?', '¿Qué método devuelve un array nuevo solo con los elementos que pasan una condición?'),
      [C('filter()'), C('map()'), C('reduce()'), C('forEach()')],
      L('filter keeps the elements whose callback returns a truthy value; map keeps the length, reduce returns one value, forEach returns undefined.', 'filter conserva los elementos cuyo callback devuelve un valor truthy; map mantiene la longitud, reduce devuelve un valor y forEach devuelve undefined.')),
    Q('js-reduce-sum', 'array-transform', L('What does this return?', '¿Qué devuelve esto?'),
      [C('10'), C('24'), C('"1234"'), C('undefined')],
      L('reduce folds the array left to right starting from the initial value 0: 0+1+2+3+4 = 10.', 'reduce pliega el array de izquierda a derecha partiendo del valor inicial 0: 0+1+2+3+4 = 10.'),
      '[1, 2, 3, 4].reduce((acc, x) => acc + x, 0)'),
    Q('js-map-braces', 'array-transform', L('What does `[1, 2, 3].map(x => { x * 2 })` return?', '¿Qué devuelve `[1, 2, 3].map(x => { x * 2 })`?'),
      [C('[undefined, undefined, undefined]'), C('[2, 4, 6]'), C('[1, 2, 3]'), C('SyntaxError')],
      L('An arrow function with braces needs an explicit return; without it every callback returns undefined.', 'Una arrow function con llaves necesita un return explícito; sin él, cada callback devuelve undefined.')),
    Q('js-reduce-initial', 'array-transform', L('Why pass an initial value to `reduce`?', '¿Por qué pasar un valor inicial a `reduce`?'),
      [L('Without it an empty array throws and the first element becomes the accumulator', 'Sin él, un array vacío lanza error y el primer elemento hace de acumulador'), L('It makes reduce run faster', 'Hace que reduce sea más rápido'), L('It is required by the syntax', 'Lo exige la sintaxis'), L('It converts the result to a string', 'Convierte el resultado en cadena')],
      L('With an initial value the callback runs for every element and the type of the result is explicit; without it reduce on [] throws a TypeError.', 'Con valor inicial el callback se ejecuta para todos los elementos y el tipo del resultado queda explícito; sin él, reduce sobre [] lanza TypeError.')),
    Q('js-sort-default', 'array-search', L('What does `[10, 9, 1].sort()` return?', '¿Qué devuelve `[10, 9, 1].sort()`?'),
      [C('[1, 10, 9]'), C('[1, 9, 10]'), C('[10, 9, 1]'), C('TypeError')],
      L('Without a comparator sort converts the elements to strings, and "10" comes before "9".', 'Sin comparador, sort convierte los elementos a cadenas, y "10" va antes que "9".')),
    Q('js-sort-immutable', 'array-search', L('Which call sorts numbers ascending without mutating the original array?', '¿Qué llamada ordena números de forma ascendente sin mutar el array original?'),
      [C('[...nums].sort((a, b) => a - b)'), C('nums.sort((a, b) => a - b)'), C('nums.sort()'), C('nums.toString().sort()')],
      L('sort works in place, so copy first; the comparator a - b gives numeric ascending order. toSorted() does the same in one call.', 'sort trabaja en el sitio, así que copia primero; el comparador a - b da orden numérico ascendente. toSorted() hace lo mismo en una llamada.')),
    Q('js-find-miss', 'array-search', L('What does `users.find(u => u.id === 99)` return when no user matches?', '¿Qué devuelve `users.find(u => u.id === 99)` cuando ningún usuario coincide?'),
      [C('undefined'), C('null'), C('-1'), C('[]')],
      L('find returns the first matching element or undefined; findIndex is the one that returns -1.', 'find devuelve el primer elemento que coincide o undefined; el que devuelve -1 es findIndex.')),
    Q('js-every', 'array-search', L('Which method tells whether every element satisfies a condition?', '¿Qué método indica si todos los elementos cumplen una condición?'),
      [C('every()'), C('some()'), C('includes()'), C('find()')],
      L('every returns true only if the callback is truthy for all elements and stops at the first failure; some needs just one.', 'every devuelve true solo si el callback es truthy para todos los elementos y se detiene en el primer fallo; a some le basta uno.')),
    Q('js-spread-update', 'spread-destructure', L('After this code, what is `next.age`, and has `user` changed?', 'Tras este código, ¿cuánto vale `next.age` y ha cambiado `user`?'),
      [L('31, and user is unchanged', '31, y user no cambia'), L('30, and user is unchanged', '30, y user no cambia'), L('31, and user.age is also 31', '31, y user.age también es 31'), C('SyntaxError')],
      L('Spread copies the properties into a new object and a later key overrides the copied one; the original is untouched.', 'Spread copia las propiedades en un objeto nuevo y una clave posterior sobrescribe la copiada; el original no se toca.'),
      "const user = { name: 'Ann', age: 30 };\nconst next = { ...user, age: 31 };"),
    Q('js-destructure-skip', 'spread-destructure', L('Which destructuring gives `a = 1` and `c = 3` while skipping the second item?', '¿Qué destructuring da `a = 1` y `c = 3` saltándose el segundo elemento?'),
      [C('const [a, , c] = [1, 2, 3]'), C('const [a, c] = [1, 2, 3]'), C('const (a, c) = [1, 2, 3]'), C('const [a..c] = [1, 2, 3]')],
      L('An empty slot between commas skips a position; [a, c] would give c = 2.', 'Un hueco vacío entre comas salta una posición; [a, c] daría c = 2.')),
    Q('js-spread-shallow', 'spread-destructure', L('The spread operator copies an object…', 'El operador spread copia un objeto…'),
      [L('shallowly: nested objects stay shared', 'de forma superficial: los objetos anidados siguen compartidos'), L('deeply: nested objects are cloned too', 'en profundidad: los objetos anidados también se clonan'), L('by reference: nothing is copied', 'por referencia: no se copia nada'), L('only its methods', 'solo sus métodos')],
      L('Spread copies one level; a nested object is the same reference in both copies, so use structuredClone for deep copies.', 'Spread copia un nivel; un objeto anidado es la misma referencia en ambas copias, así que usa structuredClone para copias profundas.')),
    Q('js-nullish-zero', 'optional-nullish', L('What does `0 ?? 10` return?', '¿Qué devuelve `0 ?? 10`?'),
      [C('0'), C('10'), C('undefined'), C('false')],
      L('?? only falls back for null or undefined; 0 is a real value, so it is kept.', '?? solo recurre al valor alternativo con null o undefined; 0 es un valor real, así que se conserva.')),
    Q('js-or-zero', 'optional-nullish', L('What does `0 || 10` return?', '¿Qué devuelve `0 || 10`?'),
      [C('10'), C('0'), C('true'), C('undefined')],
      L('|| replaces any falsy value, and 0 is falsy. That is why ?? exists for defaults where 0 or "" are valid.', '|| sustituye cualquier valor falsy, y 0 es falsy. Por eso existe ?? para valores por defecto donde 0 o "" son válidos.')),
    Q('js-optional-null', 'optional-nullish', L('With `user` equal to null, what does `user?.address?.city` give?', 'Con `user` igual a null, ¿qué da `user?.address?.city`?'),
      [C('undefined'), C('TypeError'), C('null'), C('""')],
      L('Optional chaining stops at the first null or undefined and the whole expression becomes undefined instead of throwing.', 'El encadenamiento opcional se detiene en el primer null o undefined y toda la expresión vale undefined en vez de lanzar error.')),
    Q('js-entries', 'object-methods', L('Which call turns `{ a: 1, b: 2 }` into `[["a", 1], ["b", 2]]`?', '¿Qué llamada convierte `{ a: 1, b: 2 }` en `[["a", 1], ["b", 2]]`?'),
      [C('Object.entries(obj)'), C('Object.keys(obj)'), C('Object.values(obj)'), C('Object.fromEntries(obj)')],
      L('entries gives [key, value] pairs; keys gives the names, values the values, and fromEntries goes the other way.', 'entries da pares [clave, valor]; keys da los nombres, values los valores, y fromEntries hace el camino inverso.')),
    Q('js-from-entries', 'object-methods', L('Which call rebuilds an object from an array of `[key, value]` pairs?', '¿Qué llamada reconstruye un objeto a partir de un array de pares `[clave, valor]`?'),
      [C('Object.fromEntries(pairs)'), C('Object.assign(pairs)'), C('Object.entries(pairs)'), C('new Object(pairs)')],
      L('fromEntries is the inverse of entries, which makes filter-then-rebuild on objects a one-liner.', 'fromEntries es el inverso de entries, lo que convierte el patrón filtrar y reconstruir un objeto en una sola línea.')),
    Q('js-dedupe', 'map-set', L('Which one-liner removes duplicates from an array?', '¿Qué expresión de una línea elimina los duplicados de un array?'),
      [C('[...new Set(arr)]'), C('arr.filter(x => x)'), C('new Map(arr)'), C('arr.unique()')],
      L('A Set keeps each value once; spreading it back gives an array. There is no unique() method on arrays.', 'Un Set conserva cada valor una sola vez; al expandirlo vuelve a ser un array. Los arrays no tienen método unique().')),
    Q('js-map-lookup', 'map-set', L('Which structure gives average O(1) key/value lookup?', '¿Qué estructura da una búsqueda clave/valor en O(1) de media?'),
      [C('Map'), C('Array'), L('Linked list', 'Lista enlazada'), L('Sorted array', 'Array ordenado')],
      L('Map (and a plain object) hash the key; arrays and lists need a scan, and a sorted array needs a binary search.', 'Map (y un objeto normal) usan un hash de la clave; los arrays y las listas requieren un recorrido, y un array ordenado una búsqueda binaria.')),
    Q('js-map-count', 'map-set', L('What is `m.get("a")` at the end?', '¿Cuánto vale `m.get("a")` al final?'),
      [C('2'), C('1'), C('NaN'), C('undefined')],
      L('The first get returns undefined, ?? 0 turns it into 0, so the value goes 1 then 2. With || 0 the result is the same here.', 'El primer get devuelve undefined, ?? 0 lo convierte en 0, así que el valor pasa a 1 y luego a 2. Con || 0 el resultado aquí es el mismo.'),
      "const m = new Map();\nm.set('a', (m.get('a') ?? 0) + 1);\nm.set('a', (m.get('a') ?? 0) + 1);"),
    Q('js-closure-counter', 'closures', L('What is printed?', '¿Qué se imprime?'),
      [C('3'), C('1'), C('undefined'), C('0')],
      L('The returned function closes over count, which lives on after counter() returned, so each call increments the same variable.', 'La función devuelta captura count, que sigue viva después de que counter() termine, así que cada llamada incrementa la misma variable.'),
      'function counter() {\n  let count = 0;\n  return () => ++count;\n}\nconst inc = counter();\ninc(); inc();\nconsole.log(inc());'),
    Q('js-debounce', 'closures', L('A search handler debounced with 300 ms…', 'Un manejador de búsqueda con debounce de 300 ms…'),
      [L('runs once, 300 ms after the user stops typing', 'se ejecuta una vez, 300 ms después de que el usuario deje de teclear'), L('runs at most once every 300 ms while typing', 'se ejecuta como mucho una vez cada 300 ms mientras se teclea'), L('runs on every keystroke, delayed 300 ms', 'se ejecuta en cada pulsación, con 300 ms de retraso'), L('runs only when the form is submitted', 'se ejecuta solo al enviar el formulario')],
      L('Each keystroke clears the pending timer and starts a new one; only the last timer survives. "At most once per interval" describes throttle.', 'Cada pulsación cancela el temporizador pendiente y arranca otro; solo sobrevive el último. «Como mucho una vez por intervalo» describe throttle.')),
    Q('js-arrow-this', 'closures', L('Inside an arrow function, `this` is…', 'Dentro de una arrow function, `this` es…'),
      [L('taken from the surrounding scope', 'el del ámbito que la rodea'), L('the object the function is called on', 'el objeto sobre el que se llama la función'), L('always undefined', 'siempre undefined'), L('always the global object', 'siempre el objeto global')],
      L('Arrow functions do not bind their own this (or arguments); they use the this of the enclosing function or module.', 'Las arrow functions no tienen this propio (ni arguments); usan el this de la función o módulo que las contiene.')),
    Q('js-event-loop', 'event-loop', L('In what order is the output printed?', '¿En qué orden se imprime la salida?'),
      [C('A D C B'), C('A B C D'), C('A D B C'), C('A C D B')],
      L('Synchronous code first (A, D), then the microtask queue (the promise callback C), then the macrotask (the timeout B).', 'Primero el código síncrono (A, D), luego la cola de microtareas (el callback de la promesa, C), luego la macrotarea (el timeout, B).'),
      "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');"),
    Q('js-await-split', 'event-loop', L('What is printed?', '¿Qué se imprime?'),
      [C('1 2 3'), C('1 3 2'), C('2 1 3'), C('3 1 2')],
      L('f runs synchronously until the await, which yields; console.log(2) runs, then the rest of f resumes as a microtask.', 'f se ejecuta de forma síncrona hasta el await, que cede el control; se ejecuta console.log(2) y después el resto de f continúa como microtarea.'),
      'async function f() { console.log(1); await null; console.log(3); }\nf();\nconsole.log(2);'),
    Q('js-timeout-zero', 'event-loop', L('`setTimeout(fn, 0)` runs `fn`…', '`setTimeout(fn, 0)` ejecuta `fn`…'),
      [L('after the current synchronous code and all pending microtasks', 'después del código síncrono actual y de todas las microtareas pendientes'), L('immediately, before the next line', 'inmediatamente, antes de la siguiente línea'), L('before any promise callback', 'antes que cualquier callback de promesa'), L('only when the page unloads', 'solo cuando se descarga la página')],
      L('A timeout is a macrotask; the event loop drains the microtask queue before taking the next macrotask.', 'Un timeout es una macrotarea; el event loop vacía la cola de microtareas antes de tomar la siguiente macrotarea.')),
    Q('js-promise-all-reject', 'async', L('`Promise.all([p1, p2])` when `p2` rejects…', '`Promise.all([p1, p2])` cuando `p2` rechaza…'),
      [L('rejects immediately with p2\'s reason', 'rechaza inmediatamente con el motivo de p2'), L('resolves with [value, undefined]', 'resuelve con [valor, undefined]'), L('waits for p1 and then resolves', 'espera a p1 y después resuelve'), L('returns an array of statuses', 'devuelve un array de estados')],
      L('all is all-or-nothing; allSettled is the combinator that waits for every promise and reports each status.', 'all es todo o nada; allSettled es el combinador que espera a todas las promesas e informa del estado de cada una.')),
    Q('js-fetch-reject', 'async', L('`fetch("/api")` rejects its promise when…', '`fetch("/api")` rechaza su promesa cuando…'),
      [L('the network fails; a 404 or 500 response still resolves', 'falla la red; una respuesta 404 o 500 sigue resolviendo'), L('the response status is not 200', 'el estado de la respuesta no es 200'), L('the body is not valid JSON', 'el cuerpo no es JSON válido'), L('the request takes longer than 30 s', 'la petición tarda más de 30 s')],
      L('fetch resolves for any HTTP response; check response.ok (status 200–299) and throw yourself.', 'fetch resuelve con cualquier respuesta HTTP; comprueba response.ok (estado 200–299) y lanza el error tú.')),
    Q('js-all-settled', 'async', L('Which combinator waits for every promise and reports each one\'s status?', '¿Qué combinador espera a todas las promesas e informa del estado de cada una?'),
      [C('Promise.allSettled'), C('Promise.all'), C('Promise.race'), C('Promise.any')],
      L('allSettled resolves with { status, value | reason } objects; race and any settle on the first result.', 'allSettled resuelve con objetos { status, value | reason }; race y any se resuelven con el primer resultado.')),
    Q('js-then-value', 'async', L('What does `Promise.resolve(1).then(x => x + 1)` resolve to?', '¿Con qué valor resuelve `Promise.resolve(1).then(x => x + 1)`?'),
      [C('2'), C('1'), C('undefined'), L('A rejected promise', 'Una promesa rechazada')],
      L('then returns a new promise resolved with the callback\'s return value, so chains keep transforming the value.', 'then devuelve una promesa nueva resuelta con el valor que devuelve el callback, así que las cadenas van transformando el valor.')),
    Q('js-dup-on', 'patterns', L('Which approach finds duplicates in O(n) average time?', '¿Qué enfoque encuentra duplicados en O(n) de media?'),
      [L('A Set or Map in a single pass', 'Un Set o Map en una sola pasada'), L('Two nested loops', 'Dos bucles anidados'), L('Sort, then compare neighbours', 'Ordenar y comparar vecinos'), L('Recursion over every pair', 'Recursión sobre cada par')],
      L('Membership checks in a Set are O(1), so one pass is O(n). Nested loops are O(n²) and sorting is O(n log n).', 'Comprobar pertenencia en un Set es O(1), así que una pasada es O(n). Los bucles anidados son O(n²) y ordenar es O(n log n).')),
    Q('js-shift', 'patterns', L('Typical complexity of removing the first element with `arr.shift()`?', '¿Complejidad típica de quitar el primer elemento con `arr.shift()`?'),
      [C('O(n)'), C('O(1)'), C('O(log n)'), C('O(n log n)')],
      L('shift re-indexes every remaining element. For a queue keep a head index and read arr[head++] instead.', 'shift reindexa todos los elementos restantes. Para una cola, mantén un índice de cabeza y lee arr[head++].')),
    Q('js-sliding', 'patterns', L('"Longest substring without repeating characters" is a classic case for…', '«Subcadena más larga sin caracteres repetidos» es un caso clásico de…'),
      [L('a sliding window', 'ventana deslizante'), L('binary search', 'búsqueda binaria'), L('bubble sort', 'ordenación burbuja'), L('depth-first search', 'búsqueda en profundidad')],
      L('Grow the right end, shrink the left end while the window has a repeat, track the best length: O(n) with a Set.', 'Avanza el extremo derecho, encoge el izquierdo mientras la ventana tenga un repetido, guarda la mejor longitud: O(n) con un Set.')),
    Q('js-binary-search', 'patterns', L('Typical complexity of binary search on sorted data?', '¿Complejidad típica de la búsqueda binaria sobre datos ordenados?'),
      [C('O(log n)'), C('O(n)'), C('O(n²)'), C('O(1)')],
      L('Each step halves the remaining range, so the number of steps grows with the logarithm of n.', 'Cada paso reduce el rango a la mitad, así que el número de pasos crece con el logaritmo de n.')),
  ],
};
