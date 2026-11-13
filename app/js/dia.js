/* =====================================================================
   Umbral — nivel 2 de las tradiciones  ·  app/js/dia.js

   fuentes.js (decisión 0016) guarda los niveles 1, 3, 4 y 5 — estáticos,
   iguales cada vez que se abren. El nivel 2, «dónde cae hoy», NO puede
   vivir ahí: es de clase ① y se recalcula del instante, como dice la
   propia cabecera de fuentes.js. Este módulo es ese cálculo, y nada más.

   DESDE EL 13 DE NOVIEMBRE DE 2026 NO CALCULA NADA POR SU CUENTA. Hasta
   entonces copiaba «literalmente» las fórmulas de
   herramientas/hoja-de-cielo.mjs; ahora las importa de app/js/carta.js,
   que es el único original (pendiente 43). Lo que queda aquí es la forma
   que espera la pantalla `dia`: los mismos nombres de función y los
   mismos campos que antes, para que index.html no tenga que cambiar.
   Las diez pruebas doradas de pruebas/dia.test.mjs, que se escribieron
   contra la salida real del script, son las que garantizan que el
   traslado no ha movido ningún número.

   `casas` NO está aquí a propósito. El ascendente depende del tiempo
   sidéreo, que cambia minuto a minuto: tiene sentido para un instante de
   nacimiento, no para "todo el día de hoy". Vive en la carta natal del
   anclaje de origen, no en la vista de un día cualquiera.

   `tzolkin` y `numerologia` tampoco están: los dos siguen en
   `estado: "sin_verificar"` en fuentes.js, y sin nivel1-5 visible no
   tiene sentido calcular su nivel2.
   ===================================================================== */

import {
  norm, longitudTropical, ayanamsaTrueChitra, signoDe,
  rejillasLunaSol, nakshatra, terminoSolar as terminoSolarDeCarta, fechaEnCalendario
} from './carta.js';

/* --- zodiaco_tropical ------------------------------------------------ */
export function solTropical(ms) {
  const l = norm(longitudTropical('Sun', ms));
  return { grados: l % 30, signo: signoDe(l) };
}

/* --- zodiaco_sidereo --------------------------------------------------
   True Chitra: Spica fijada en 180° (pendiente 41). Hasta el 12 de
   noviembre de 2026 esta cabecera lo llamaba Lahiri, y no lo es. */
export function solSidereo(ms) {
  const ayan = ayanamsaTrueChitra(ms);
  const l = norm(longitudTropical('Sun', ms) - ayan);
  return { grados: l % 30, signo: signoDe(l), ayanamsa: ayan };
}

/* --- jieqi -------------------------------------------------------------
   24 tramos de 15°, desde el mismo equinoccio que el zodiaco tropical. */
export function terminoSolar(ms) {
  return terminoSolarDeCarta(ms);
}

/* --- tithi --------------------------------------------------------------
   30 tramos de 12° sobre la elongación Luna-Sol. shukla (creciente) por
   debajo de 180°, krishna (menguante) por encima — Sūrya-Siddhānta I.12-13,
   trad. Burgess 1860. */
export function tithiDelDia(ms) {
  return rejillasLunaSol(ms).tithi;
}

/* --- fases_rudhyar -------------------------------------------------------
   El mismo ángulo Luna-Sol que tithi, partido en 8 en vez de en 30: las
   dos salen de la MISMA llamada a rejillasLunaSol() en carta.js, que es
   una sola resta. No se reutiliza fase_grados de luna.js a propósito: esa
   viene de MoonPhase(), un cálculo distinto aunque el resultado coincida
   casi siempre (difieren hasta 21″, medido en 2026). */
export function faseRudhyarDelDia(ms) {
  return rejillasLunaSol(ms).rudhyar;
}

/* --- nakshatra -----------------------------------------------------------
   27 tramos de 13°20′ sobre la longitud sidérea de la Luna. Los grados y
   los padas siguen en estado DÉBIL (falta cotejar el cap. VIII de
   Burgess) — la ficha lo dice, el número no espera a que se cierre eso. */
export function nakshatraDeLaLuna(ms) {
  return nakshatra(ms);
}

/* --- calendario_islamico -----------------------------------------------
   Civil tabular, vía Intl('islamic-civil'), no una tabla propia. */
export function fechaIslamica(ms, zona) {
  return fechaEnCalendario(ms, 'islamic-civil', zona);
}

if (typeof window !== 'undefined') {
  window.solTropical = solTropical;
  window.solSidereo = solSidereo;
  window.terminoSolar = terminoSolar;
  window.tithiDelDia = tithiDelDia;
  window.faseRudhyarDelDia = faseRudhyarDelDia;
  window.nakshatraDeLaLuna = nakshatraDeLaLuna;
  window.fechaIslamica = fechaIslamica;
}
