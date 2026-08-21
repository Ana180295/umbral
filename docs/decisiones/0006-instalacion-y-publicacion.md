# 0006 — Instalación en el móvil y publicación

**Fecha:** 20 de agosto de 2026 · **Estado:** cerrada

## Contexto

La Fase 0 está construida y su criterio de aceptación es *abrirla ocho días
seguidos*. Ese criterio no se puede cumplir en un portátil: un registro de
"¿cómo estás ahora?" a las once de la noche se hace en el móvil o no se hace.
La instalación no es un adorno de la Fase 0, es su prerrequisito.

## Decisión

**PWA instalada desde el navegador, servida por GitHub Pages desde la raíz del
repositorio.** La URL queda `https://USUARIA.github.io/umbral/app/`.

Motivo: es la única opción con cero configuración. Pages solo sabe publicar
desde la raíz o desde `docs/`; publicando desde la raíz, `app/` queda servida
tal cual y el alcance del service worker es exactamente `/umbral/app/`,
que es justo lo que se quiere. No hace falta rama `gh-pages`, ni acción de
GitHub, ni mover nada. El repositorio es público, así que `docs/` y `datos/`
quedan visibles: no hay nada ahí que no deba estarlo, y el `keystore` nunca
entra (`.gitignore`).

### Regla dura: ninguna ruta absoluta

En `manifest.webmanifest`, en `sw.js` y en el HTML, todas las rutas empiezan por
`./`. Una sola ruta que empiece por `/` funciona en `localhost`, se rompe bajo
el subdirectorio de Pages, y se vuelve a romper dentro de Capacitor en la
Fase 5. Hay una prueba dorada que lo comprueba.

### `.nojekyll`

Un fichero vacío en la raíz del repositorio. Sin él, Pages pasa todo por Jekyll
y descarta silenciosamente cualquier fichero o carpeta que empiece por `_`.

## Qué hay que añadir a `app/index.html`

Dentro de `<head>`, antes de las hojas de estilo:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#040618">
<link rel="manifest" href="./manifest.webmanifest">
<link rel="icon" href="./iconos/icono-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="./iconos/icono-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

`color-scheme: dark` evita el fogonazo blanco entre que abre el navegador y
pinta el CSS. En una app que se usa de noche, eso no es un detalle estético.

Al final de `<body>`:

```html
<script>
  if ('serviceWorker' in navigator) {
    addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js');
    });
  }
</script>
```

Sin `type="module"`, a propósito: es la única línea de la app que tiene que
funcionar aunque el navegador sea antiguo, porque es la que la hace instalable.

## Cómo se instala, en el móvil

1. Abrir la URL en **Chrome** (no en el navegador embebido de una app de
   mensajería: ahí no aparece el botón de instalar).
2. Menú ⋮ → **Añadir a pantalla de inicio** → *Instalar*.
3. Debe salir el icono de la brújula sobre el nocturno, y al abrir, **sin barra
   de direcciones**. Si aparece la barra, `display: standalone` no se ha
   aplicado: casi siempre es que el manifest da 404 o que `start_url` cae fuera
   de `scope`.
4. **Prueba de verdad:** modo avión, abrir la app. Si carga entera, el service
   worker hace su trabajo. Si no, mirar qué fichero falta en la consola.

## Actualizaciones

`skipWaiting()` + `clients.claim()`: la versión nueva entra en el siguiente
arranque, sin esperar a cerrar todas las pestañas.

Es una decisión de fase de pruebas, no permanente. Durante los ocho días
importa más "cambio un fichero y lo veo en el móvil" que la pureza de no
sustituir recursos a mitad de sesión. El riesgo real es bajo porque `addAll`
es atómico: o está la versión nueva completa, o sigue la anterior completa.
**Revisar esta línea cuando la app deje de estar en obra.**

`VERSION` en `sw.js` se sube a mano en cada cambio. Sin compilación no hay hash
de contenido, así que la fecha es el número de versión honesto. Si se olvida
subirla, el navegador no ve worker nuevo y no se actualiza nada: es el fallo
más común de este montaje, y no avisa.
