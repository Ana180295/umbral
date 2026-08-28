# 11 · Hoja de ruta complementaria — 27 y 28 de agosto de 2026

Continuación directa de la sesión del 26-27 de agosto. Empezó con la
pantalla `calendario` recién cableada y un botón que no encendía, y
terminó con el perfil de nacimiento resuelto por nombre de localidad y el
dibujo del Espiral en tres anillos.

---

## 1 · El botón que no encendía — tres fallos reales, uno detrás de otro

«Tu calendario personal →» se quedaba deshabilitado para siempre. No era
un solo fallo: eran tres, y cada uno tapaba al siguiente.

**El arranque no esperaba a los módulos diferidos.** El `<script>` clásico
de `index.html` leía `window.observador()` (de `luna.js`) nada más abrir
IndexedDB, dando por hecho que los módulos `type="module"` ya habían
cargado. Es una carrera, no una garantía, y esa noche la ganaba
IndexedDB. El propio comentario del código afirmaba —incorrectamente— que
«este es el primer punto del arranque donde ya se sabe que los módulos
diferidos han cargado». Corregido envolviendo el arranque entero en
`window.addEventListener("DOMContentLoaded", ...)`, que sí lo garantiza
por especificación: los `<script type="module">` se evalúan antes de que
se dispare `DOMContentLoaded`. Los dos comentarios que afirmaban la
garantía falsa se reescribieron para decir la razón real.

**`luna.js` nunca había tenido el puente con `window`.** Es el único de
los seis módulos de la pantalla `calendario` sin el patrón `if (typeof
window !== "undefined") { window.algo = algo; }` que ya usan `fuentes.js`,
`perfil.js`, `calendario.js`, `dia.js` y `exportacion.js`. Se le olvidó
porque es del 22 de agosto — el más antiguo del lote, escrito antes de que
ninguna pantalla lo necesitara. Añadido el puente, solo con lo que el
`<script>` clásico lee de verdad: `observador()` y `diaLunar()`.
`perfil.js` y `calendario.js` ya importaban `diaLunar` como módulo real y
no les afecta.

**El service worker servía código de días atrás, con la versión nueva ya
instalada al lado.** Con los dos fallos anteriores corregidos, el botón
seguía sin encenderse. La causa: el `fetch` handler de `sw.js` llamaba a
`caches.match()` sin decir de qué caché, y eso busca en **todas** las
cachés del origen a la vez, no solo en la de la versión actual. Una
caché vieja que se hubiera quedado sin borrar —por ejemplo, tras un
*Unregister* a mitad de un ciclo de actualización, que corta el `activate`
que es quien las limpia— podía ganar la búsqueda. Costó una noche entera
de capturas de pantalla y comprobaciones de consola encontrarlo.
Corregido: `caches.open(CACHE)` explícito antes de `match()`, en las dos
rutas del handler, para que solo se busque en la caché de la versión que
`install` acaba de rellenar.

## 2 · El renderizador de tradiciones — el fallo pendiente de la sesión anterior

Sección 5 del traspaso: el nivel4 de cuatro datos (`zodiaco_tropical`,
`zodiaco_sidereo`, `nakshatra`, `numerologia`) se pintaba siempre, incluso
en el día de hoy sin cerrar, rompiendo la regla de la 0018. La decisión
0019, ya escrita, definía `bloque_nivel4` aparte de `bloque`; lo que
faltaba era que el renderizador de `index.html` lo respetara.
Corregido: el nivel4 se separa a una ficha propia cuando su bloque
difiere del resto del dato, verificado con siete mutaciones deliberadas
contra un doble mínimo de `document` — no jsdom, que no está instalado en
el árbol del proyecto, solo un `createElement` de treinta líneas que no
decide nada, solo acumula el texto que decide el código real.

## 3 · El lugar de nacimiento, por localidad — decisión 0025

Detalle completo en la decisión. Resumen: tres campos numéricos
sustituidos por un buscador de nombre, resuelto una vez con la API de
Open-Meteo (investigada esa misma noche, no elegida de memoria), guardado
fijo. Probado contra la API real, no contra dobles: «Springfield» dio
cinco candidatas reales en distintos estados de EE. UU.; «San José»,
cuatro en tres continentes; «Albacete», dos —la ciudad y su aeropuerto—,
lo que expuso un fallo real de interfaz (la lista de candidatas se quedaba
visible debajo de la elección ya hecha) corregido en el momento.

## 4 · El Espiral, en tres anillos — decisión 0026

Detalle completo en la decisión. Resumen: Día, Lunación y Espiral,
dibujados en paralelo sin desfase de ángulo entre ellos —probado primero
con desfase, descartado tras verlo—, con Espiral reducido a una sola
marca porque contar cada Espiral vivido durante años de uso dejaría de
leerse como dibujo. Exigió un derivable nuevo en `calendario.js`,
`diasEnLunacion`, y encontró un fallo real de conteo escribiendo su
prueba: se contaba un día antes de confirmar que `diaLunar()` lo había
encontrado.

## 5 · Estado al cerrar esta sesión

- **Sin commitear todavía:** todo lo de esta noche — el arreglo de
  nivel4/bloque de la sesión anterior, y los tres fallos y dos decisiones
  de esta.
- **Push previsto:** hoy, 28 de agosto, después de las 23:00. Las
  comprobaciones finales se harán en el móvil, no en el navegador de
  escritorio.
- **Sin resolver, anotado en ambas decisiones nuevas:** dónde va la
  atribución CC BY 4.0 a GeoNames en la interfaz.
- **Sin resolver:** los radios exactos de las tres bandas del Espiral
  entrelazado se eligieron a ojo, sin verlos con datos reales en el
  navegador todavía.
- **Sin resolver:** `02-inventario-de-datos.md` necesita que alguien con
  el documento completo delante recalcule el total de «1.171 valores
  derivables» tras sumar `diasEnLunacion` a la clase C2 — no se ha hecho
  a ciegas, ver el parche correspondiente.
