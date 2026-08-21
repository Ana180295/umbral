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
const VERSION = '2026-08-21d';
const CACHE = `umbral-${VERSION}`;

/* Rutas relativas a la carpeta del worker, no absolutas: así funciona igual en
   localhost, bajo el subdirectorio de GitHub Pages y dentro de Capacitor.

   Esta lista refleja app/ tal y como está hoy: un index.html monolítico, sin
   css/ ni módulos js/ todavía. Cuando saques el estilo o la lógica a ficheros
   aparte, añádelos aquí. La prueba dorada te avisará si se te olvida.

   OFL.txt entra a propósito: la licencia SIL exige que acompañe a la fuente,
   pesa nada, y así los créditos también funcionan sin cobertura. */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',

  './js/seleccion.js',
  './js/registro-practica.js',
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

  /* Navegaciones: siempre el index guardado. */
  if (peticion.mode === 'navigate') {
    evento.respondWith((async () => {
      const guardado = await caches.match('./index.html', { ignoreSearch: true });
      return guardado ?? fetch(peticion);
    })());
    return;
  }

  /* El resto del mismo origen: copia primero; si no está en la lista, red. */
  evento.respondWith((async () => {
    const guardado = await caches.match(peticion, { ignoreSearch: true });
    return guardado ?? fetch(peticion);
  })());
});
