/* Ritual Lunar — "Una opción para ti"
 *
 * Une el filtro ya probado (js/seleccion.js) con la pantalla de registro.
 * Aquí no hay ni una regla de selección: todas viven en seleccion.js, que es lo
 * que cubren las 20 pruebas. Este fichero solo decide CUÁNDO preguntar y QUÉ
 * pintar.
 *
 * Decidido el 21 de agosto: no se ofrece nada hasta que hay necesidad elegida.
 * Sugerir antes es la app hablando por encima de ti, y la sección 1 va justo en
 * la dirección contraria.
 */

import { candidatas, elegir, textoDePauta, abreTemporizador } from './seleccion.js';

/* El estado del formulario vive en el <script> clásico de index.html.
   Ver la nota de instalación: allí se expone como window.estadoRegistro. */
const estado = window.estadoRegistro;

if (!estado) {
  console.error(
    '[registro-practica] falta window.estadoRegistro. ' +
    'Añade  window.estadoRegistro = seleccion;  al final del <script> clásico.'
  );
}

const NECESIDAD = document.getElementById('necesidad');
const ESCALAS = document.getElementById('escalas');
const CUERPO = document.getElementById('cuerpo');
const CAMPO_ACCION = document.getElementById('accion');

/* Lo que se guarda en checkins.accion_elegida. null = texto libre o nada. */
window.practicaElegida = null;

let catalogo = null;
let mostrada = null;      // la práctica en pantalla ahora mismo
/* La necesidad para la que se dijo "Hoy no". Guardar CUÁL, y no un simple
   booleano, es lo que hace que al cambiar de necesidad vuelva a ofrecer.
   Con un booleano, decir "Hoy no" una vez dejaba mudas todas las demás. */
let descartadaEn = null;

/* ---------- pintado ---------- */

const seccion = document.createElement('section');
seccion.id = 'bloque-practica';
seccion.className = 'bloque';
seccion.hidden = true;
seccion.setAttribute('aria-live', 'polite');
seccion.innerHTML = `
  <h2 class="bloque-titulo">Una opción para ti</h2>
  <p id="practica-texto"></p>
  <p id="practica-pauta" class="pastilla" hidden></p>
  <div class="fichas">
    <button type="button" class="ficha" data-accion="probar">Probar</button>
    <button type="button" class="ficha" data-accion="otra">Otra idea</button>
    <button type="button" class="ficha" data-accion="no">Hoy no</button>
  </div>
`;
/* Va justo detrás de "¿Qué necesito ahora?": el orden de la sección 2 es
   yo → necesidad → acción, y la sugerencia es parte de "acción". */
NECESIDAD.closest('section').after(seccion);

const TEXTO = seccion.querySelector('#practica-texto');
const PAUTA = seccion.querySelector('#practica-pauta');

function pintar(p) {
  mostrada = p;

  /* null significa «no muestres la sección», no «muestra un mensaje».
     Regla 0.1: si no hay nada que ofrecer, no se ofrece nada. */
  if (!p) {
    seccion.hidden = true;
    return;
  }

  TEXTO.textContent = p.texto;

  const pauta = textoDePauta(p.pauta);
  PAUTA.textContent = pauta ?? '';
  PAUTA.hidden = pauta === null;

  /* `evidencia` y `fuente` NO se pintan (sección 10): convertirían una
     sugerencia en receta. Quedan en el DOM solo para poder auditarlas. */
  seccion.dataset.practica = p.id;
  seccion.dataset.origen = p.origen;

  seccion.hidden = false;
}

/* ---------- decisión de qué mostrar ---------- */

function contexto() {
  return {
    necesidad: estado?.necesidad ?? null,
    energia: estado?.energia ?? null,
    activacion: estado?.activacion ?? null,
    senal_corporal: estado?.senal_corporal ?? [],
    hora: new Date().getHours()
  };
}

function revisar() {
  if (!catalogo || !estado) return;

  if (estado.necesidad === null) {
    descartadaEn = null;
    window.practicaElegida = null;
    pintar(null);
    return;
  }

  /* "Hoy no" solo silencia la necesidad para la que se dijo. */
  if (estado.necesidad !== descartadaEn) descartadaEn = null;
  if (descartadaEn) return;

  const lista = candidatas(catalogo, contexto());

  /* Si la que está en pantalla sigue siendo válida, se queda.
     Sin esto, subir un punto de tono cambiaría la sugerencia debajo de la mano
     y la pantalla se sentiría rota. */
  if (mostrada && lista.some((p) => p.id === mostrada.id)) return;

  pintar(elegir(catalogo, contexto()));
}

function otra() {
  const lista = candidatas(catalogo, contexto());
  const otras = lista.filter((p) => p.id !== mostrada?.id);
  /* Con una sola candidata, "Otra idea" no puede cumplir lo que promete.
     Se deja la misma en vez de fingir variedad. */
  pintar(otras.length ? elegir({ practicas: otras }, contexto()) : mostrada);
}

/* ---------- interacción ---------- */

seccion.addEventListener('click', (e) => {
  const b = e.target.closest('[data-accion]');
  if (!b) return;

  if (b.dataset.accion === 'otra') {
    window.practicaElegida = null;
    otra();
    return;
  }

  if (b.dataset.accion === 'no') {
    descartadaEn = estado.necesidad;
    window.practicaElegida = null;
    pintar(null);
    return;
  }

  /* Probar */
  window.practicaElegida = mostrada?.id ?? null;
  if (CAMPO_ACCION && !CAMPO_ACCION.value.trim()) CAMPO_ACCION.value = mostrada.texto;
  CAMPO_ACCION?.dispatchEvent(new Event('input', { bubbles: true }));

  /* El temporizador de respiración aún no existe en index.html. Cuando exista,
     basta con que se exponga como window.abrirTemporizador(pauta): hasta
     entonces esto no hace nada y no molesta. */
  if (abreTemporizador(mostrada) && typeof window.abrirTemporizador === 'function') {
    window.abrirTemporizador(mostrada.pauta);
  }
});

/* Si escribes tu propia acción, deja de ser la práctica sugerida. isTrusted
   distingue tus pulsaciones del evento que lanza el botón "Probar". */
CAMPO_ACCION?.addEventListener('input', (e) => {
  if (e.isTrusted) window.practicaElegida = null;
});

/* Los tres cambian el techo de coste o la necesidad, así que los tres revisan.
   Van en burbuja: cuando llegan aquí, los manejadores del formulario ya han
   actualizado el estado. */
for (const sitio of [NECESIDAD, ESCALAS, CUERPO]) {
  sitio?.addEventListener('click', revisar);
}

/* ---------- arranque ---------- */

fetch('./contenido/practicas.json')
  .then((r) => {
    if (!r.ok) throw new Error(`practicas.json: ${r.status}`);
    return r.json();
  })
  .then((d) => {
    catalogo = d;
    revisar();
  })
  .catch((err) => {
    /* Sin catálogo no se ofrece nada, y no se dice nada. El registro sigue
       funcionando entero: es la parte que no depende de esto. */
    console.error('[registro-practica]', err);
  });
