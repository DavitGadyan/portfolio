import { C, L, Q, type Track } from './types';

/**
 * React: components, state, effects, forms, memoisation and the Next.js App Router basics that full-stack
 * assessments cover. Twelve cards and the question bank the practice quiz draws from.
 */
export const react: Track = {
  id: 'react',
  logo: 'react',
  name: 'React',
  tagline: L('Twelve React patterns behind most assessment questions: components, useState, immutable updates, effects, forms, memoisation and the Next.js App Router, with a 20-question practice quiz.',
    'Doce patrones de React detrás de la mayoría de preguntas de pruebas técnicas: componentes, useState, actualizaciones inmutables, efectos, formularios, memoización y el App Router de Next.js, con un quiz de práctica de 20 preguntas.'),
  title: L('React: Hooks Cheatsheet and Practice Quiz', 'React: chuleta de hooks y quiz de práctica'),
  description: L('Interactive React cheatsheet for coding assessments by David Gadyan: components and props, lists and keys, useState and functional updates, immutable state, useEffect and cleanup, data fetching, controlled forms, lifting state, useMemo and useCallback, useRef, context and reducers, and the Next.js App Router. Each pattern with syntax, gotcha and example, plus a 20-question quiz graded at the end.',
    'Chuleta interactiva de React para pruebas técnicas, de David Gadyan: componentes y props, listas y keys, useState y actualizaciones funcionales, estado inmutable, useEffect y limpieza, carga de datos, formularios controlados, elevar el estado, useMemo y useCallback, useRef, contexto y reducers, y el App Router de Next.js. Cada patrón con sintaxis, trampa y ejemplo, más un quiz de 20 preguntas corregido al final.'),
  groups: {
    basics: L('Basics', 'Básicos'), state: L('State', 'Estado'), effects: L('Effects', 'Efectos'), forms: L('Forms', 'Formularios'),
    performance: L('Performance', 'Rendimiento'), hooks: L('More hooks', 'Más hooks'), nextjs: L('Next.js', 'Next.js'),
  },
  sources: L('Practice material for timed coding assessments. Behaviour described follows the React 19 and Next.js 16 App Router documentation.',
    'Material de práctica para pruebas técnicas cronometradas. El comportamiento descrito sigue la documentación de React 19 y del App Router de Next.js 16.'),
  nodes: [
    { id: 'component-props', group: 'basics', icon: 'component',
      title: L('Components and props', 'Componentes y props'), short: L('Functions that return UI', 'Funciones que devuelven UI'),
      syntax: `function User({ name, age = 0, children }) {
  return <h1>Hello {name} ({age}){children}</h1>;
}
<User name="David" age={33}>!</User>`,
      when: L('Every piece of UI. Props flow from parent to child; a child reads its props and never edits them.',
        'Cada trozo de interfaz. Las props fluyen del padre al hijo; el hijo lee sus props y nunca las modifica.'),
      what: L('A component is a function of props that returns JSX. React calls it again whenever its props or state change. children is whatever sits between the opening and closing tags.',
        'Un componente es una función de props que devuelve JSX. React la vuelve a llamar cuando cambian sus props o su estado. children es lo que haya entre la etiqueta de apertura y la de cierre.'),
      gotcha: L('Props are read-only. Component names must start with a capital letter or JSX treats them as HTML tags. Return one root element or a fragment <>…</>.',
        'Las props son de solo lectura. Los nombres de componente deben empezar por mayúscula o JSX los trata como etiquetas HTML. Devuelve un solo elemento raíz o un fragmento <>…</>.'),
      example: `function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}` },
    { id: 'lists-conditional', group: 'basics', icon: 'ordered',
      title: L('Lists, keys and conditionals', 'Listas, keys y condicionales'), short: L('Render collections', 'Renderizar colecciones'),
      syntax: `{users.map(u => <User key={u.id} user={u} />)}
{loading ? <Spinner /> : <List />}
{error && <p role="alert">{error}</p>}`,
      when: L('Any array to display, and any UI that depends on state: loading, error, empty.',
        'Cualquier array que mostrar, y cualquier interfaz que dependa del estado: cargando, error, vacío.'),
      what: L('Keys let React match list items between renders so DOM nodes and state stay with the right item. Conditionals are plain JavaScript expressions inside braces.',
        'Las keys permiten a React emparejar los elementos de una lista entre renders para que los nodos del DOM y el estado sigan con el elemento correcto. Los condicionales son expresiones JavaScript normales entre llaves.'),
      gotcha: L('key={index} breaks when the list is reordered, filtered or has insertions: use a stable id. count && <X /> renders 0 when count is 0: write count > 0 &&.',
        'key={index} falla cuando la lista se reordena, se filtra o recibe inserciones: usa un id estable. count && <X /> renderiza 0 cuando count es 0: escribe count > 0 &&.'),
      example: `{items.length === 0
  ? <Empty />
  : <ul>{items.map(it => <li key={it.id}>{it.name}</li>)}</ul>}` },
    { id: 'use-state', group: 'state', icon: 'toggle',
      title: L('useState and functional updates', 'useState y actualizaciones funcionales'), short: L('Local state', 'Estado local'),
      syntax: `const [count, setCount] = useState(0);
setCount(count + 1);          // uses this render's value
setCount(prev => prev + 1);   // uses the latest value`,
      when: L('Any value that changes over time and should re-render the component: inputs, toggles, fetched data, counters.',
        'Cualquier valor que cambie con el tiempo y deba volver a renderizar el componente: inputs, interruptores, datos cargados, contadores.'),
      what: L('useState returns the current value and a setter; calling the setter schedules a re-render with the new value. Several updates inside one event are batched into one render.',
        'useState devuelve el valor actual y un setter; llamar al setter programa un nuevo render con el valor nuevo. Varias actualizaciones dentro de un mismo evento se agrupan en un solo render.'),
      gotcha: L('Two setCount(count + 1) calls in one handler add 1, not 2, because count is a snapshot of this render: use the functional form. State belongs to the component instance, it is not shared between instances.',
        'Dos llamadas setCount(count + 1) en un mismo manejador suman 1, no 2, porque count es una instantánea de este render: usa la forma funcional. El estado pertenece a la instancia del componente, no se comparte entre instancias.'),
      example: `function handleClick() {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);   // +2
}
const [form, setForm] = useState({ name: '', email: '' });
const [items, setItems] = useState(() => expensiveInitial());   // lazy initial state` },
    { id: 'immutability', group: 'state', icon: 'copy',
      title: L('Immutable state updates', 'Actualizaciones inmutables del estado'), short: L('Never mutate', 'Nunca mutar'),
      syntax: `setUser(prev => ({ ...prev, name: 'John' }));                              // change a field
setUsers(prev => [...prev, newUser]);                                        // add
setUsers(prev => prev.filter(u => u.id !== id));                             // remove
setUsers(prev => prev.map(u => u.id === id ? { ...u, done: true } : u));    // edit one`,
      when: L('Every object or array held in state.', 'Cada objeto o array guardado en el estado.'),
      what: L('React compares references to decide what changed; a new object or array signals an update, a mutated one looks identical and may be skipped.',
        'React compara referencias para decidir qué ha cambiado; un objeto o array nuevo señala una actualización, uno mutado parece idéntico y puede ignorarse.'),
      gotcha: L('user.name = "x"; setUser(user) re-uses the same reference and may not re-render. push, splice, sort and reverse mutate; spread, concat, filter, map and toSorted do not.',
        'user.name = "x"; setUser(user) reutiliza la misma referencia y puede no renderizar. push, splice, sort y reverse mutan; spread, concat, filter, map y toSorted no.'),
      example: `// wrong: same reference
users.push(newUser); setUsers(users);
// right: new array
setUsers(prev => [...prev, newUser]);
// nested field
setState(prev => ({ ...prev, address: { ...prev.address, city } }));` },
    { id: 'use-effect', group: 'effects', icon: 'refresh',
      title: L('useEffect and cleanup', 'useEffect y limpieza'), short: L('Sync with the outside', 'Sincronizar con el exterior'),
      syntax: `useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);   // cleanup
}, []);                              // deps: once after mount
useEffect(() => { fetchUser(userId); }, [userId]);   // when userId changes`,
      when: L('Subscriptions, timers, manual DOM APIs, fetching when an id changes. Not for deriving values from props or state: compute those during render.',
        'Suscripciones, temporizadores, APIs del DOM, cargar datos cuando cambia un id. No para derivar valores de props o estado: calcúlalos durante el render.'),
      what: L('The effect runs after the commit: with [] only after the first render, with [a, b] whenever a or b change, with no array after every render. The returned function runs before the next run and on unmount.',
        'El efecto se ejecuta después del commit: con [] solo tras el primer render, con [a, b] cuando cambian a o b, sin array tras cada render. La función devuelta se ejecuta antes de la siguiente ejecución y al desmontar.'),
      gotcha: L('A missing dependency reads stale values. Setting state unconditionally inside an effect that depends on that state loops forever. In development Strict Mode runs effects twice to test the cleanup.',
        'Una dependencia que falta lee valores obsoletos. Cambiar el estado sin condición dentro de un efecto que depende de ese estado crea un bucle infinito. En desarrollo, Strict Mode ejecuta los efectos dos veces para probar la limpieza.'),
      example: `useEffect(() => {
  const ctrl = new AbortController();
  fetch(\`/api/users/\${id}\`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(() => {});
  return () => ctrl.abort();
}, [id]);` },
    { id: 'data-fetching', group: 'effects', icon: 'server',
      title: L('Fetch with loading and error', 'Cargar datos con loading y error'), short: L('Three states', 'Tres estados'),
      syntax: `const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => {
  let alive = true;
  fetch('/api/users')
    .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
    .then(data => { if (alive) setUsers(data); })
    .catch(e => { if (alive) setError(e.message); })
    .finally(() => { if (alive) setLoading(false); });
  return () => { alive = false; };
}, []);`,
      when: L('A component that loads its own data. In Next.js prefer fetching in a Server Component and passing the data down as props.',
        'Un componente que carga sus propios datos. En Next.js, mejor cargar en un Server Component y pasar los datos como props.'),
      what: L('Loading, error and data are three explicit states and the component renders one of them. The alive flag ignores results that arrive after unmount or after the id has changed.',
        'Cargando, error y datos son tres estados explícitos y el componente renderiza uno de ellos. La bandera alive ignora resultados que llegan tras desmontar o tras cambiar el id.'),
      gotcha: L('fetch does not throw on 404 or 500: check r.ok. The effect callback itself cannot be async; define an async function inside it and call it.',
        'fetch no lanza error con 404 o 500: comprueba r.ok. El callback del efecto no puede ser async; define una función async dentro y llámala.'),
      example: `if (loading) return <p>Loading…</p>;
if (error) return <p role="alert">{error}</p>;
return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;` },
    { id: 'controlled-forms', group: 'forms', icon: 'text-cursor',
      title: L('Controlled inputs and forms', 'Inputs controlados y formularios'), short: L('State drives the input', 'El estado manda en el input'),
      syntax: `const [name, setName] = useState('');
<form onSubmit={e => { e.preventDefault(); save(name); }}>
  <input value={name} onChange={e => setName(e.target.value)} />
  <button type="submit">Save</button>
</form>`,
      when: L('Validation while typing, dependent fields, resetting a form, anything where React must know the value at all times.',
        'Validación mientras se escribe, campos dependientes, reiniciar un formulario, todo lo que exija que React conozca el valor en todo momento.'),
      what: L('A controlled input shows the state value and reports every change, so state is the single source of truth. An uncontrolled input keeps its own value, read through a ref when needed.',
        'Un input controlado muestra el valor del estado e informa de cada cambio, así que el estado es la única fuente de verdad. Un input no controlado guarda su propio valor, que se lee con una ref cuando hace falta.'),
      gotcha: L('value without onChange makes the input read-only and React warns. Forgetting preventDefault reloads the page on submit. Checkboxes bind with checked, not value.',
        'value sin onChange deja el input en solo lectura y React avisa. Olvidar preventDefault recarga la página al enviar. Los checkbox se enlazan con checked, no con value.'),
      example: `const [form, setForm] = useState({ email: '', agree: false });
const onChange = e => {
  const { name, type, value, checked } = e.target;
  setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
};
<input name="email" value={form.email} onChange={onChange} />
<input name="agree" type="checkbox" checked={form.agree} onChange={onChange} />` },
    { id: 'lifting-state', group: 'state', icon: 'layers',
      title: L('Props vs state, lifting state up', 'Props frente a estado, elevar el estado'), short: L('Where data lives', 'Dónde viven los datos'),
      syntax: `function Parent() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <Results query={query} />
    </>
  );
}`,
      when: L('Two siblings need the same value: move it to their closest common parent and pass it down with a setter callback.',
        'Dos componentes hermanos necesitan el mismo valor: súbelo al padre común más cercano y pásalo hacia abajo con un callback setter.'),
      what: L('Props are external input the parent owns; state is internal data the component owns. Lifting keeps one source of truth so the siblings can never disagree.',
        'Las props son entrada externa que posee el padre; el estado son datos internos que posee el componente. Elevar el estado mantiene una sola fuente de verdad para que los hermanos nunca discrepen.'),
      gotcha: L('Copying a prop into state (useState(props.value)) freezes it at mount. Do not store what you can compute: derive fullName from first and last during render.',
        'Copiar una prop al estado (useState(props.value)) la congela en el montaje. No guardes lo que puedas calcular: deriva fullName de first y last durante el render.'),
      example: `function SearchBox({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
const fullName = \`\${first} \${last}\`;   // derived, not state` },
    { id: 'memo', group: 'performance', icon: 'gauge',
      title: L('useMemo, useCallback, React.memo', 'useMemo, useCallback, React.memo'), short: L('Skip repeated work', 'Evitar trabajo repetido'),
      syntax: `const sorted = useMemo(() => [...items].sort(byName), [items]);
const onSelect = useCallback(id => setSelected(id), []);
const Row = React.memo(function Row({ item, onSelect }) { /* … */ });`,
      when: L('A calculation is measurably expensive, or a memoised child re-renders because it receives a new function or object on every render.',
        'Un cálculo es caro de forma medible, o un hijo memoizado vuelve a renderizar porque recibe una función u objeto nuevos en cada render.'),
      what: L('useMemo caches a value and useCallback a function until the dependencies change. React.memo skips re-rendering a component whose props are shallow-equal to last time.',
        'useMemo cachea un valor y useCallback una función hasta que cambian las dependencias. React.memo evita renderizar un componente cuyas props son iguales (comparación superficial) a las de la vez anterior.'),
      gotcha: L('Memoising everything costs more than it saves: measure first. An inline object or arrow function prop defeats React.memo. The React Compiler does most of this automatically in new projects.',
        'Memoizar todo cuesta más de lo que ahorra: mide primero. Una prop con objeto o arrow function en línea anula React.memo. El React Compiler hace la mayor parte de esto automáticamente en proyectos nuevos.'),
      example: `// new object every render: Row re-renders anyway
<Row style={{ color: 'red' }} />
// stable reference: hoist it or memoise it
const style = useMemo(() => ({ color: 'red' }), []);
<Row style={style} />` },
    { id: 'use-ref', group: 'hooks', icon: 'pointer',
      title: L('useRef', 'useRef'), short: L('A box that survives renders', 'Una caja que sobrevive a los renders'),
      syntax: `const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();           // in a handler or effect

const timer = useRef(null);         // mutable value, no re-render
timer.current = setTimeout(fn, 500);`,
      when: L('Focusing or measuring DOM nodes, holding timers, previous values or any mutable that must not trigger a render.',
        'Enfocar o medir nodos del DOM, guardar temporizadores, valores anteriores o cualquier dato mutable que no deba provocar un render.'),
      what: L('useRef returns the same { current } object on every render; changing current does not re-render, unlike state.',
        'useRef devuelve el mismo objeto { current } en cada render; cambiar current no vuelve a renderizar, a diferencia del estado.'),
      gotcha: L('Do not read or write ref.current during render (the React Compiler flags it): use it in handlers and effects. A ref is per instance, like state.',
        'No leas ni escribas ref.current durante el render (el React Compiler lo marca): úsalo en manejadores y efectos. Una ref es por instancia, como el estado.'),
      example: `useEffect(() => { inputRef.current?.focus(); }, []);

const prev = useRef(value);
useEffect(() => { prev.current = value; }, [value]);   // previous value` },
    { id: 'context-reducer', group: 'hooks', icon: 'blocks',
      title: L('useContext and useReducer', 'useContext y useReducer'), short: L('Shared and complex state', 'Estado compartido y complejo'),
      syntax: `const ThemeContext = createContext('light');
<ThemeContext value="dark"><App /></ThemeContext>
const theme = useContext(ThemeContext);

const [state, dispatch] = useReducer(reducer, initial);
dispatch({ type: 'add', item });`,
      when: L('Context for values many components need (theme, user, locale) without prop drilling. useReducer when several fields change together or an update depends on an action type.',
        'Contexto para valores que necesitan muchos componentes (tema, usuario, idioma) sin pasar props en cadena. useReducer cuando varios campos cambian a la vez o una actualización depende de un tipo de acción.'),
      what: L('Every consumer re-renders when the provided value changes. A reducer is a pure (state, action) => newState function, so updates are predictable and easy to test.',
        'Cada consumidor vuelve a renderizar cuando cambia el valor provisto. Un reducer es una función pura (state, action) => newState, así que las actualizaciones son predecibles y fáciles de probar.'),
      gotcha: L('A provider value created inline ({ user, setUser }) changes every render and re-renders all consumers: memoise it. Context is not a store; for frequent updates split contexts or use a state library.',
        'Un valor de provider creado en línea ({ user, setUser }) cambia en cada render y vuelve a renderizar todos los consumidores: memoízalo. El contexto no es un store; para actualizaciones frecuentes separa contextos o usa una librería de estado.'),
      example: `function reducer(state, action) {
  switch (action.type) {
    case 'add': return [...state, action.item];
    case 'remove': return state.filter(i => i.id !== action.id);
    default: return state;
  }
}` },
    { id: 'nextjs', group: 'nextjs', icon: 'panels',
      title: L('Next.js App Router essentials', 'Lo esencial del App Router de Next.js'), short: L('Server first', 'Servidor primero'),
      syntax: `app/page.tsx                    // route: /
app/users/[id]/page.tsx         // dynamic: /users/42
app/layout.tsx                  // shared shell
'use client';                   // first line: Client Component
export function generateStaticParams() { return ids.map(id => ({ id })); }
import { redirect } from 'next/navigation';`,
      when: L('Server Components by default (data access, zero client bundle); "use client" only for state, effects, browser APIs and event handlers.',
        'Server Components por defecto (acceso a datos, cero bundle en el cliente); "use client" solo para estado, efectos, APIs del navegador y manejadores de eventos.'),
      what: L('Folders under app/ define routes, [id] a dynamic segment, layout.tsx shared UI. generateStaticParams lists the dynamic pages to prerender; middleware runs request-time logic such as auth, rewrites and redirects.',
        'Las carpetas bajo app/ definen rutas, [id] un segmento dinámico, layout.tsx la interfaz compartida. generateStaticParams enumera las páginas dinámicas que se prerenderizan; el middleware ejecuta lógica en cada petición: autenticación, rewrites y redirecciones.'),
      gotcha: L('Secrets go in server-only env vars, never NEXT_PUBLIC_*. A Client Component cannot import a Server Component, but it can receive one as children. Use next/image for optimised images.',
        'Los secretos van en variables de entorno solo de servidor, nunca NEXT_PUBLIC_*. Un Client Component no puede importar un Server Component, pero puede recibirlo como children. Usa next/image para imágenes optimizadas.'),
      example: `// app/users/[id]/page.tsx (Server Component)
export default async function Page({ params }) {
  const { id } = await params;
  const user = await db.user.find(id);   // server only, never shipped
  return <Profile user={user} />;
}` },
  ],
  questions: [
    Q('r-usestate', 'use-state', L('Which hook stores local component state?', '¿Qué hook guarda el estado local de un componente?'),
      [C('useState'), C('useEffect'), C('useMemo'), C('useRef')],
      L('useState returns the value and its setter; useRef holds a mutable box without re-rendering, useMemo caches a computation.', 'useState devuelve el valor y su setter; useRef guarda una caja mutable sin renderizar, useMemo cachea un cálculo.')),
    Q('r-double-set', 'use-state', L('With `count` equal to 0, what is `count` after this handler runs?', 'Con `count` igual a 0, ¿cuánto vale `count` después de ejecutar este manejador?'),
      [C('1'), C('2'), C('0'), C('undefined')],
      L('Both calls read the same snapshot (0) and set 1; the functional form prev => prev + 1 would give 2.', 'Ambas llamadas leen la misma instantánea (0) y asignan 1; la forma funcional prev => prev + 1 daría 2.'),
      'function handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n}'),
    Q('r-functional-update', 'use-state', L('Why use `setCount(prev => prev + 1)`?', '¿Por qué usar `setCount(prev => prev + 1)`?'),
      [L('It uses the latest state even when several updates are batched', 'Usa el estado más reciente aunque se agrupen varias actualizaciones'), L('It skips the re-render', 'Evita el nuevo render'), L('It makes the state global', 'Hace global el estado'), L('It runs synchronously', 'Se ejecuta de forma síncrona')],
      L('React queues updater functions and feeds each the result of the previous one, so consecutive updates compose correctly.', 'React encola las funciones de actualización y pasa a cada una el resultado de la anterior, así que las actualizaciones consecutivas se componen bien.')),
    Q('r-shared-state', 'use-state', L('How is state shared between two instances of the same component?', '¿Cómo se comparte el estado entre dos instancias del mismo componente?'),
      [L('It is not: each instance has its own state', 'No se comparte: cada instancia tiene su propio estado'), L('Automatically, through the component name', 'Automáticamente, por el nombre del componente'), L('Through the key prop', 'A través de la prop key'), L('Only when the component is memoised', 'Solo cuando el componente está memoizado')],
      L('State is per instance; to share a value, lift it to a common parent or use context.', 'El estado es por instancia; para compartir un valor, súbelo a un padre común o usa contexto.')),
    Q('r-key-purpose', 'lists-conditional', L('What is the main purpose of `key` in a list?', '¿Cuál es el propósito principal de `key` en una lista?'),
      [L('Identifying items between renders', 'Identificar los elementos entre renders'), L('Styling items', 'Dar estilo a los elementos'), L('Sorting items', 'Ordenar los elementos'), L('Fetching the item data', 'Cargar los datos del elemento')],
      L('Keys tell React which DOM node and state belong to which item when the list changes.', 'Las keys indican a React qué nodo del DOM y qué estado pertenecen a cada elemento cuando la lista cambia.')),
    Q('r-key-index', 'lists-conditional', L('When is `key={index}` acceptable?', '¿Cuándo es aceptable `key={index}`?'),
      [L('For static lists that are never reordered, filtered or inserted into', 'En listas estáticas que nunca se reordenan, filtran ni reciben inserciones'), L('Always', 'Siempre'), L('Never', 'Nunca'), L('Only together with React.memo', 'Solo junto con React.memo')],
      L('With a changing list the index moves between items and React mixes up their state and DOM; a stable id avoids that.', 'Con una lista que cambia, el índice se mueve entre elementos y React mezcla su estado y su DOM; un id estable lo evita.')),
    Q('r-zero-and', 'lists-conditional', L('With `count` equal to 0, what does `{count && <Badge />}` render?', 'Con `count` igual a 0, ¿qué renderiza `{count && <Badge />}`?'),
      [C('0'), L('Nothing', 'Nada'), C('<Badge />'), L('An error', 'Un error')],
      L('&& returns the left operand when it is falsy, and React renders the number 0. Use count > 0 && or a ternary.', '&& devuelve el operando izquierdo cuando es falsy, y React renderiza el número 0. Usa count > 0 && o un ternario.')),
    Q('r-remove-user', 'immutability', L('Which update correctly removes a user by id?', '¿Qué actualización elimina correctamente un usuario por id?'),
      [C('setUsers(prev => prev.filter(u => u.id !== id))'), C('users.splice(i, 1); setUsers(users)'), C('delete users[i]; setUsers(users)'), C('setUsers(users.pop())')],
      L('filter returns a new array without the item; splice and delete mutate the array React already holds.', 'filter devuelve un array nuevo sin el elemento; splice y delete mutan el array que React ya tiene.')),
    Q('r-why-immutable', 'immutability', L('Why must state not be mutated directly?', '¿Por qué no se debe mutar el estado directamente?'),
      [L('React detects changes by reference and may skip the re-render', 'React detecta cambios por referencia y puede saltarse el render'), L('Mutation is a syntax error in JSX', 'Mutar es un error de sintaxis en JSX'), L('Mutated state is slower to serialise', 'El estado mutado se serializa más despacio'), L('Hooks only accept strings', 'Los hooks solo aceptan cadenas')],
      L('A mutated object keeps its reference, so comparisons see "no change"; a new object makes the change visible.', 'Un objeto mutado conserva su referencia, así que las comparaciones ven «sin cambios»; un objeto nuevo hace visible el cambio.')),
    Q('r-mutating-methods', 'immutability', L('Which group of array methods mutates the array?', '¿Qué grupo de métodos de array muta el array?'),
      [C('push, splice, sort'), C('map, filter, concat'), C('slice, toSorted, flat'), C('find, some, every')],
      L('push, splice, sort and reverse change the array in place; the others return a new array or a value.', 'push, splice, sort y reverse cambian el array en el sitio; los demás devuelven un array nuevo o un valor.')),
    Q('r-effect-empty', 'use-effect', L('`useEffect(fn, [])` runs `fn`…', '`useEffect(fn, [])` ejecuta `fn`…'),
      [L('once, after the first render', 'una vez, tras el primer render'), L('on every render', 'en cada render'), L('before the first render', 'antes del primer render'), L('never', 'nunca')],
      L('An empty dependency array means nothing can change, so the effect runs after mount only (twice in development Strict Mode).', 'Un array de dependencias vacío significa que nada puede cambiar, así que el efecto solo se ejecuta tras el montaje (dos veces en Strict Mode de desarrollo).')),
    Q('r-effect-cleanup', 'use-effect', L('What is the function returned from an effect for?', '¿Para qué sirve la función que devuelve un efecto?'),
      [L('Cleanup before the next run and on unmount', 'Limpieza antes de la siguiente ejecución y al desmontar'), L('Returning JSX', 'Devolver JSX'), L('Memoising the effect', 'Memoizar el efecto'), L('Cancelling the render', 'Cancelar el render')],
      L('Clear timers, abort requests and unsubscribe there, or the component leaks work after it is gone.', 'Ahí se limpian temporizadores, se abortan peticiones y se cancelan suscripciones; si no, el componente deja trabajo colgado tras desaparecer.')),
    Q('r-effect-loop', 'use-effect', L('An effect that calls `setCount(count + 1)` with `[count]` as dependencies…', 'Un efecto que llama a `setCount(count + 1)` con `[count]` como dependencias…'),
      [L('loops forever', 'entra en bucle infinito'), L('runs once', 'se ejecuta una vez'), L('never runs', 'nunca se ejecuta'), L('throws at compile time', 'falla al compilar')],
      L('Each run changes count, which re-triggers the effect; derive the value during render or add a stop condition.', 'Cada ejecución cambia count, lo que vuelve a disparar el efecto; deriva el valor durante el render o añade una condición de parada.')),
    Q('r-effect-derive', 'use-effect', L('Which is NOT a good use of `useEffect`?', '¿Cuál NO es un buen uso de `useEffect`?'),
      [L('Deriving fullName from first and last name', 'Derivar fullName a partir de nombre y apellido'), L('Subscribing to a websocket', 'Suscribirse a un websocket'), L('Setting a timer', 'Programar un temporizador'), L('Syncing document.title', 'Sincronizar document.title')],
      L('Derived values are computed during render; effects are for synchronising with systems outside React.', 'Los valores derivados se calculan durante el render; los efectos son para sincronizar con sistemas externos a React.')),
    Q('r-response-ok', 'data-fetching', L('Why check `response.ok` after `fetch`?', '¿Por qué comprobar `response.ok` después de `fetch`?'),
      [L('fetch resolves even on 404 and 500 responses', 'fetch resuelve incluso con respuestas 404 y 500'), L('It parses the JSON body', 'Analiza el cuerpo JSON'), L('It retries the request', 'Reintenta la petición'), L('It enables CORS', 'Activa CORS')],
      L('Only network failures reject; HTTP errors must be detected from the status and turned into thrown errors.', 'Solo los fallos de red rechazan; los errores HTTP hay que detectarlos por el estado y convertirlos en errores lanzados.')),
    Q('r-alive-flag', 'data-fetching', L('What is the `alive` flag for in a fetching effect?', '¿Para qué sirve la bandera `alive` en un efecto que carga datos?'),
      [L('Ignoring responses that arrive after unmount or after the id changed', 'Ignorar respuestas que llegan tras desmontar o tras cambiar el id'), L('Retrying failed requests', 'Reintentar peticiones fallidas'), L('Caching the response', 'Cachear la respuesta'), L('Running the effect twice', 'Ejecutar el efecto dos veces')],
      L('The cleanup flips it to false, so a late response cannot set state for a stale request.', 'La limpieza la pone a false, así que una respuesta tardía no puede escribir estado de una petición obsoleta.')),
    Q('r-three-states', 'data-fetching', L('A component that loads data should handle which states?', '¿Qué estados debe gestionar un componente que carga datos?'),
      [L('Loading, error and data', 'Cargando, error y datos'), L('Only data', 'Solo datos'), L('Mounted and unmounted', 'Montado y desmontado'), L('Hover and focus', 'Hover y foco')],
      L('Render a spinner while loading, an alert on error and the list when data is in; missing one leaves the user guessing.', 'Muestra un spinner mientras carga, un aviso si hay error y la lista cuando llegan los datos; faltar uno deja al usuario a ciegas.')),
    Q('r-controlled', 'controlled-forms', L('A controlled input is one whose…', 'Un input controlado es aquel cuyo…'),
      [L('value comes from React state', 'valor viene del estado de React'), L('value is read through a ref', 'valor se lee con una ref'), L('value is set by CSS', 'valor lo fija el CSS'), L('onChange is missing', 'onChange falta')],
      L('State is the single source of truth: value shows it and onChange updates it on every keystroke.', 'El estado es la única fuente de verdad: value lo muestra y onChange lo actualiza en cada pulsación.')),
    Q('r-prevent-default', 'controlled-forms', L('Submitting a form without `e.preventDefault()`…', 'Enviar un formulario sin `e.preventDefault()`…'),
      [L('reloads the page', 'recarga la página'), L('submits twice', 'lo envía dos veces'), L('does nothing', 'no hace nada'), L('throws an error', 'lanza un error')],
      L('The browser performs its native form submission and navigates, discarding the React state.', 'El navegador hace su envío nativo del formulario y navega, descartando el estado de React.')),
    Q('r-checkbox', 'controlled-forms', L('Which prop binds a checkbox to state?', '¿Qué prop enlaza un checkbox con el estado?'),
      [C('checked'), C('value'), C('selected'), C('toggled')],
      L('Checkboxes and radios use checked; value on a checkbox is the string sent with the form, not its state.', 'Los checkbox y los radio usan checked; value en un checkbox es la cadena que se envía con el formulario, no su estado.')),
    Q('r-lift', 'lifting-state', L('Two sibling components need the same value. Best approach?', 'Dos componentes hermanos necesitan el mismo valor. ¿Mejor enfoque?'),
      [L('Move it to the closest common parent and pass it down', 'Subirlo al padre común más cercano y pasarlo hacia abajo'), L('Copy it into both with useState', 'Copiarlo en ambos con useState'), L('Store it on window', 'Guardarlo en window'), L('Keep a ref in each', 'Guardar una ref en cada uno')],
      L('One owner means one source of truth; the siblings receive the value and a callback as props.', 'Un solo dueño significa una sola fuente de verdad; los hermanos reciben el valor y un callback como props.')),
    Q('r-props-readonly', 'lifting-state', L('Props are…', 'Las props son…'),
      [L('read-only input from the parent', 'entrada de solo lectura que llega del padre'), L('mutable local data', 'datos locales mutables'), L('always strings', 'siempre cadenas'), L('shared globally', 'compartidas globalmente')],
      L('A component never changes its props; to change the value it asks the owner through a callback.', 'Un componente nunca cambia sus props; para cambiar el valor se lo pide al dueño mediante un callback.')),
    Q('r-props-to-state', 'lifting-state', L('What is wrong with `const [value, setValue] = useState(props.value)` to mirror a prop?', '¿Qué problema tiene `const [value, setValue] = useState(props.value)` para reflejar una prop?'),
      [L('The initial value is read once; later prop changes are ignored', 'El valor inicial se lee una vez; los cambios posteriores de la prop se ignoran'), L('It is a syntax error', 'Es un error de sintaxis'), L('It re-renders on every prop change twice', 'Vuelve a renderizar dos veces por cada cambio de prop'), L('Props cannot be read inside hooks', 'Las props no se pueden leer dentro de hooks')],
      L('useState only uses its argument on the first render; read the prop directly or derive from it instead.', 'useState solo usa su argumento en el primer render; lee la prop directamente o deriva de ella.')),
    Q('r-usememo', 'memo', L('Which hook memoises a computed value?', '¿Qué hook memoiza un valor calculado?'),
      [C('useMemo'), C('useCallback'), C('useEffect'), C('useReducer')],
      L('useMemo re-runs the factory only when a dependency changes; useCallback does the same for a function reference.', 'useMemo vuelve a ejecutar la función solo cuando cambia una dependencia; useCallback hace lo mismo con la referencia de una función.')),
    Q('r-usecallback', 'memo', L('Which hook memoises a function reference?', '¿Qué hook memoiza la referencia de una función?'),
      [C('useCallback'), C('useMemo'), C('useState'), C('useId')],
      L('useCallback(fn, deps) is useMemo(() => fn, deps): the same function object until deps change.', 'useCallback(fn, deps) equivale a useMemo(() => fn, deps): la misma función hasta que cambian las dependencias.')),
    Q('r-react-memo', 'memo', L('`React.memo(Component)` skips a re-render when…', '`React.memo(Component)` evita un render cuando…'),
      [L('the props are shallow-equal to the previous ones', 'las props son iguales (comparación superficial) a las anteriores'), L('its own state changes', 'cambia su propio estado'), L('the parent unmounts', 'el padre se desmonta'), L('the key changes', 'cambia la key')],
      L('memo compares each prop with Object.is; a new object or function prop still re-renders.', 'memo compara cada prop con Object.is; una prop con objeto o función nuevos sigue renderizando.')),
    Q('r-inline-object', 'memo', L('Passing `style={{ color: "red" }}` to a memoised child…', 'Pasar `style={{ color: "red" }}` a un hijo memoizado…'),
      [L('defeats the memo: it is a new object on every render', 'anula la memoización: es un objeto nuevo en cada render'), L('is fine: objects are compared deeply', 'no pasa nada: los objetos se comparan en profundidad'), L('throws an error', 'lanza un error'), L('is cached by React automatically', 'lo cachea React automáticamente')],
      L('Hoist the object outside the component or wrap it in useMemo so the reference stays stable.', 'Saca el objeto fuera del componente o envuélvelo en useMemo para que la referencia sea estable.')),
    Q('r-ref-no-render', 'use-ref', L('Changing `ref.current`…', 'Cambiar `ref.current`…'),
      [L('does not trigger a re-render', 'no provoca un nuevo render'), L('re-renders the component', 'vuelve a renderizar el componente'), L('re-renders the parent', 'vuelve a renderizar el padre'), L('resets the state', 'reinicia el estado')],
      L('A ref is a mutable box React does not watch; use state for anything the UI must reflect.', 'Una ref es una caja mutable que React no vigila; usa estado para todo lo que la interfaz deba reflejar.')),
    Q('r-ref-dom', 'use-ref', L('Which hook gives access to a DOM node?', '¿Qué hook da acceso a un nodo del DOM?'),
      [C('useRef'), C('useState'), C('useContext'), C('useMemo')],
      L('Pass the ref object to the element\'s ref prop; React fills current after commit.', 'Pasa el objeto ref a la prop ref del elemento; React rellena current tras el commit.')),
    Q('r-context-use', 'context-reducer', L('`useContext` is best for…', '`useContext` es ideal para…'),
      [L('values many components need, such as theme or current user', 'valores que necesitan muchos componentes, como el tema o el usuario actual'), L('every piece of state', 'todo el estado'), L('fetching server data', 'cargar datos del servidor'), L('defining CSS variables', 'definir variables CSS')],
      L('Context removes prop drilling for widely shared values; every consumer re-renders when the value changes.', 'El contexto evita pasar props en cadena para valores muy compartidos; cada consumidor vuelve a renderizar cuando el valor cambia.')),
    Q('r-reducer', 'context-reducer', L('A reducer is…', 'Un reducer es…'),
      [L('a pure function (state, action) => newState', 'una función pura (state, action) => newState'), L('an async data fetcher', 'un cargador de datos asíncrono'), L('a React component', 'un componente de React'), L('a CSS rule', 'una regla CSS')],
      L('dispatch(action) calls the reducer with the current state; returning a new object keeps updates predictable.', 'dispatch(action) llama al reducer con el estado actual; devolver un objeto nuevo mantiene las actualizaciones predecibles.')),
    Q('r-use-client', 'nextjs', L('In the App Router, which directive marks a Client Component?', 'En el App Router, ¿qué directiva marca un Client Component?'),
      [C("'use client'"), C("'use browser'"), C("'client component'"), C("'use dom'")],
      L('The directive goes on the first line of the file; everything it imports becomes part of the client bundle.', 'La directiva va en la primera línea del archivo; todo lo que importa pasa a formar parte del bundle del cliente.')),
    Q('r-secrets', 'nextjs', L('Where should a database password live?', '¿Dónde debe vivir la contraseña de una base de datos?'),
      [L('In a server-only environment variable', 'En una variable de entorno solo de servidor'), L('In a NEXT_PUBLIC_* variable', 'En una variable NEXT_PUBLIC_*'), L('In React state', 'En el estado de React'), L('In localStorage', 'En localStorage')],
      L('NEXT_PUBLIC_* variables are inlined into the browser bundle; anything secret stays on the server.', 'Las variables NEXT_PUBLIC_* se incrustan en el bundle del navegador; todo lo secreto se queda en el servidor.')),
    Q('r-dynamic-route', 'nextjs', L('Which file defines the route `/users/42`?', '¿Qué archivo define la ruta `/users/42`?'),
      [C('app/users/[id]/page.tsx'), C('app/users/42.tsx'), C('pages/users/{id}.tsx'), C('app/users/(id)/page.tsx')],
      L('Square brackets make a dynamic segment; parentheses make a route group that does not appear in the URL.', 'Los corchetes crean un segmento dinámico; los paréntesis crean un grupo de rutas que no aparece en la URL.')),
    Q('r-static-params', 'nextjs', L('`generateStaticParams` is used to…', '`generateStaticParams` sirve para…'),
      [L('list the dynamic routes to prerender at build time', 'enumerar las rutas dinámicas que se prerenderizan al compilar'), L('create database tables', 'crear tablas en la base de datos'), L('register middleware', 'registrar middleware'), L('add CSS to a page', 'añadir CSS a una página')],
      L('It returns the param objects for every page of a dynamic segment; with a static export every page must be listed.', 'Devuelve los objetos de parámetros de cada página de un segmento dinámico; con exportación estática hay que enumerar todas.')),
    Q('r-server-components', 'nextjs', L('A major benefit of Server Components?', '¿Una ventaja principal de los Server Components?'),
      [L('Server-only logic and data access stay out of the client bundle', 'La lógica y el acceso a datos solo de servidor quedan fuera del bundle del cliente'), L('They handle click events', 'Gestionan los eventos de clic'), L('They replace CSS', 'Sustituyen al CSS'), L('They need no build step', 'No necesitan compilación')],
      L('They render on the server and ship HTML plus a small payload; hooks and event handlers need a Client Component.', 'Se renderizan en el servidor y envían HTML más una carga pequeña; los hooks y manejadores de eventos necesitan un Client Component.')),
    Q('r-children', 'component-props', L('What does a component receive as `children`?', '¿Qué recibe un componente como `children`?'),
      [L('Whatever sits between its opening and closing tags', 'Lo que haya entre su etiqueta de apertura y la de cierre'), L('Its own state', 'Su propio estado'), L('Its CSS classes', 'Sus clases CSS'), L('The parent\'s props', 'Las props del padre')],
      L('children is a regular prop, which is how layouts and wrappers compose other components.', 'children es una prop normal, y así es como los layouts y envoltorios componen otros componentes.')),
    Q('r-capital', 'component-props', L('Why must component names start with a capital letter?', '¿Por qué los nombres de componente deben empezar por mayúscula?'),
      [L('JSX treats lowercase names as HTML tags', 'JSX trata los nombres en minúscula como etiquetas HTML'), L('It is only a style preference', 'Es solo una preferencia de estilo'), L('Hooks require it', 'Lo exigen los hooks'), L('TypeScript requires it', 'Lo exige TypeScript')],
      L('<user /> compiles to a DOM element named "user"; <User /> refers to the component in scope.', '<user /> se compila como un elemento del DOM llamado «user»; <User /> hace referencia al componente en el ámbito.')),
  ],
};
