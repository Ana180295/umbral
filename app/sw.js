/* Umbral — service worker
 *
 * Hace exactamente dos cosas:
 *   1. Guardar una copia de todo lo que hay en app/, para que la app abra sin red.
 *   2. Apartarse de en medio en todo lo demás.
 *
 * No hay caché dinámica, ni "stale-while-revalidate", ni heurísticas. Si un
 * fichero no está en PRECACHE, este worker no lo toca. La prueba dorada
 * pruebas/precache.test.mjs falla si algún fichero de app/ falta en la lista.
 */

/* Se sube a mano en cada cambio. Sin compilación no hay hash de contenido,
   así que la fecha es el número de versión honesto. */
const VERSION = '2026-08-28b';
const CACHE = `umbral-${VERSION}`;

/* Rutas relativas a la carpeta del worker, no absolutas: así funciona igual en
   localhost, bajo el subdirectorio de GitHub Pages y dentro de Capacitor.

   Esta lista refleja app/ tal y como está hoy. Cuando saques algo más a un
   fichero aparte, añádelo aquí. La prueba dorada te avisará si se te olvida
   — a propósito no se cuentan los módulos en este comentario: un número
   escrito a mano se queda obsoleto en el primer módulo que se añada y nadie
   lo nota hasta que falla la prueba.

   OFL.txt entra a propósito: la licencia SIL exige que acompañe a la fuente,
   pesa nada, y así los créditos también funcionan sin cobertura. */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',

  './js/registro.js',
  './js/exportacion.js',
  './js/perfil.js',

  /* Compañero de perfil.js desde esta noche (28 de agosto): resuelve el
     nombre de una localidad a lat/lon/altitud una sola vez, al crear el
     perfil de nacimiento (decisión pendiente de numerar — Opción B: red
     puntual en ese momento, coordenadas guardadas fijas después, nunca
     se vuelve a pedir red para el mismo perfil). Sin esta línea, el
     fichero cargaría en la app pero no funcionaría sin cobertura la
     primera vez que alguien fuera a crear su perfil. */
  './js/geocodificacion.js',

  './js/calendario.js',
  './js/seleccion.js',
  './js/registro-practica.js',
  './js/compas.js',
  './js/luna.js',

  /* fuentes.js entra sin enseñarse: todavía no lo pinta ninguna pantalla.
     Va aquí desde el primer día porque el día que exista la hoja, la
     atribución tiene que funcionar sin cobertura — y una atribución que no
     carga sin red no cumple la §10 (decisión 0016 §5).
     luna.js y el motor de aquí abajo SÍ se cargan ya, desde el 26 de
     agosto: los pide la pantalla `calendario` (js/perfil.js,
     js/calendario.js). Se quedan en el mismo sitio de la lista porque el
     orden de PRECACHE no importa para el cacheo, solo importa el de las
     etiquetas <script> en index.html. */
  './js/fuentes.js',
  './js/dia.js',

  /* astronomy-engine 2.1.19, Don Cross, MIT. La licencia va dentro del propio
     fichero, en la cabecera, así que no hace falta una copia aparte.
     116 KB · 45,5 KB comprimidos. Se copia, no se resuelve en ejecución. */
  './js/vendor/astronomy.browser.min.js',
  './js/vendor/LICENCIA-astronomy-engine.txt',
  './contenido/practicas.json',

  './fuentes/cormorant-500.woff2',
  './fuentes/cormorant-italic-500.woff2',
  './fuentes/OFL.txt',

  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/icono-maskable-512.png',
  './iconos/icono-180.png',
  './iconos/icono-32.png',

  './imagenes/portada-720.webp'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    /* addAll es atómico a propósito: si falta un solo fichero, la instalación
       falla entera y se sigue usando la versión anterior. Es preferible a
       quedarse con media app guardada y descubrirlo sin cobertura. */
    await cache.addAll(PRECACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(
      nombres
        .filter((n) => n.startsWith('umbral-') && n !== CACHE)
        .map((n) => caches.delete(n))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;

  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);

  /* REGLA DURA — nada de otro origen se guarda jamás.
   *
   * Open-Meteo, GFZ, AEMET y compañía pasan directas a la red. Si no hay
   * cobertura, la petición falla y la app escribe estado "sin_conexion", que es
   * la verdad. Un worker que devolviera aquí una copia guardada convertiría un
   * dato viejo en un dato aparentemente fresco: rompería la regla 1 y borraría
   * la distinción sin_conexion / sin_cobertura de la sección 4.
   *
   * El caché legítimo de esos datos ya existe y es el almacén `cache_externa`
   * de IndexedDB, que sí guarda el timestamp y lo enseña en pantalla. */
  if (url.origin !== self.location.origin) return;

  /* FALLO REAL, encontrado el 28 de agosto: `caches.match()` sin decir de
     qué caché busca en TODAS las cachés del origen a la vez, no solo en la
     de la VERSION actual. Si por lo que sea queda una caché de una versión
     vieja sin borrar —por ejemplo, un ciclo de `activate` que nunca llegó
     a correr porque se hizo *Unregister* a mitad de una actualización—,
     esa caché vieja se seguía encontrando y ganaba la búsqueda, sirviendo
     código de hace días con la versión nueva ya instalada al lado. Costó
     una noche entera de persecución encontrarlo.

     La corrección: abrir explícitamente `CACHE` —la de esta versión, la
     única que `install` acaba de rellenar— y buscar SOLO ahí. Si esta
     versión no tiene el fichero, no hay copia guardada legítima que
     ofrecer, y se va a red; nunca se cae a una caché antigua por
     accidente. */
  if (peticion.mode === 'navigate') {
    evento.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const guardado = await cache.match('./index.html', { ignoreSearch: true });
      return guardado ?? fetch(peticion);
    })());
    return;
  }

  /* El resto del mismo origen: copia primero, y solo de la caché de esta
     versión; si no está en la lista, red. */
  evento.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const guardado = await cache.match(peticion, { ignoreSearch: true });
    return guardado ?? fetch(peticion);
  })());
});
