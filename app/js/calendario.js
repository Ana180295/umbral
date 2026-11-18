/* =====================================================================
   Umbral — el calendario personal  ·  app/js/calendario.js

   Decisión 0012 (el calendario), más lo cerrado el 26 de agosto sobre CÓMO
   se numeran las lunaciones — la 0012 decía «se reinicia en cada vuelta al
   Sol» y hoy se sustituye por un mecanismo puramente lunar, sin tocar el
   Sol salvo coincidencia (palabras de Ana).

   EL ESPIRAL. La luna llena no siempre cae a la misma distancia: oscila
   entre perigeo y apogeo con un periodo propio —el «ciclo de luna llena»,
   nombre del fenómeno astronómico real— de unos 413 días. Medido con este
   mismo motor sobre 2020-2034: el pico (la luna llena más cerca posible
   del perigeo) se repite cada 413,3-413,6 días, con 14 lunaciones dentro
   casi siempre y, una vez cada bastantes Espirales, 13 — el mismo patrón
   «12 o 13» que tenía la vuelta al Sol, pero nacido de la propia Luna.
   «Espiral» es el nombre que se le da en Umbral a este ciclo mayor,
   elegido el 26 de agosto para no chocar con «año lunar» (que ya significa
   otra cosa: doce lunaciones, ~354 días, el año islámico).

   EL ANCLAJE ES PERSONAL, no ambiental. La lunación en la que naces es
   SIEMPRE la Lunación 1 de tu calendario — igual que tu época ya es
   siempre el Día 1. No hay una cuenta compartida corriendo desde un cero
   inventado (eso habría sido otra vez una convención sin sujeción al
   cielo, como la octaeteris o Balliett). El primer Espiral de cada persona
   es corto —lo que falte hasta el próximo pico real tras su nacimiento—;
   los siguientes ya salen completos.

   EL REINICIO NO PARTE UNA LUNACIÓN POR LA MITAD. El pico cae en una luna
   llena, que está a mitad de una lunación (las lunaciones empiezan en luna
   nueva). La Lunación 1 del Espiral siguiente no empieza en el instante
   exacto del pico: empieza en la primera luna nueva real en o después del
   pico. La lunación que contenía el pico se queda con el número que ya
   tenía, hasta su propio final natural.

   Módulo puro: no toca el DOM, no lee el reloj del sistema. Todo entra por
   parámetro. Depende de diaLunar() de luna.js para el día dentro de cada
   lunación — no reinventa esa búsqueda.
   ===================================================================== */

import './deltat.js'; /* el ΔT medido del IERS, antes de cualquier cálculo (0034) */
import { diaLunar } from './luna.js';

const Astronomia = globalThis.Astronomy;
if (!Astronomia) {
  throw new Error(
    'calendario.js: falta el motor. Carga js/vendor/astronomy.browser.min.js ' +
    'con un <script> clásico antes que este módulo.'
  );
}

const DIA_MS = 86400000;

/* ---------------------------------------------------------------------
   Primitivas astronómicas: luna llena, luna nueva, distancia.
   ------------------------------------------------------------------- */

function lunaLlenaDesde(ms) {
  const t = Astronomia.SearchMoonPhase(180, Astronomia.MakeTime(new Date(ms)), 40);
  if (!t) throw new Error(`lunaLlenaDesde: no se encontró luna llena tras ${new Date(ms).toISOString()}`);
  return t.date.getTime();
}

function lunaNuevaDesde(ms) {
  const t = Astronomia.SearchMoonPhase(0, Astronomia.MakeTime(new Date(ms)), 40);
  if (!t) throw new Error(`lunaNuevaDesde: no se encontró luna nueva tras ${new Date(ms).toISOString()}`);
  return t.date.getTime();
}

function distanciaLunarEnMs(ms) {
  const v = Astronomia.GeoMoon(Astronomia.MakeTime(new Date(ms)));
  return Math.hypot(v.x, v.y, v.z) * Astronomia.KM_PER_AU;
}

/* ---------------------------------------------------------------------
   El pico del ciclo de luna llena: la luna llena más cercana al perigeo,
   en o después de `ms`. Se detecta como mínimo local de la distancia real
   Tierra-Luna en el instante de cada luna llena — no con una fórmula de
   libro, con el motor real, luna llena a luna llena. Verificado contra
   siete picos medidos a mano entre 2020 y 2026: exacto en los siete.
   ------------------------------------------------------------------- */
export function picoDesde(ms) {
  let t = lunaLlenaDesde(ms);
  let d = distanciaLunarEnMs(t);
  let bajando = null;
  for (let i = 0; i < 20; i++) { // un ciclo entero son 13-14 lunaciones; 20 es margen amplio
    const tSig = lunaLlenaDesde(t + 3600e3);
    const dSig = distanciaLunarEnMs(tSig);
    const bajandoAhora = dSig < d;
    if (bajando === true && !bajandoAhora) return t; // veníamos bajando, ahora sube: t fue el mínimo
    bajando = bajandoAhora;
    t = tSig;
    d = dSig;
  }
  throw new Error('picoDesde: no se encontró un mínimo local en 20 lunaciones — no debería pasar nunca');
}

/* ---------------------------------------------------------------------
   Los límites de los Espirales de una persona, desde su época hasta cubrir
   `hastaMs`. limites[0] es la época (inicio del Espiral 1, personal, no
   una luna nueva real). limites[i] para i>0 es el inicio del Espiral i+1:
   la primera luna nueva en o después del pico que cierra el Espiral i.
   ------------------------------------------------------------------- */
export function limitesDeEspirales(epocaMs, hastaMs) {
  const limites = [epocaMs];
  let actual = epocaMs;
  while (limites[limites.length - 1] <= hastaMs) {
    const pico = picoDesde(actual);
    const inicioSiguiente = lunaNuevaDesde(pico);
    limites.push(inicioSiguiente);
    actual = inicioSiguiente;
  }
  return limites;
}

/* ---------------------------------------------------------------------
   calendarioPersonal: dada la época de una persona y un instante
   cualquiera (>= época), devuelve en qué Espiral, Lunación y Día cae.

   - "espiral" se numera desde 1 desde el nacimiento (ver cabecera).
   - "lunacion" se numera desde 1 dentro de cada Espiral.
   - "dia" se numera desde 1 dentro de cada lunación: el día lunar que
     contiene el arranque real de esa lunación (su luna nueva, o la época
     misma para la Lunación 1 del Espiral 1) es el Día 1.
   ------------------------------------------------------------------- */
export function calendarioPersonal(epocaMs, instanteMs, obs) {
  if (!Number.isFinite(epocaMs) || !Number.isFinite(instanteMs)) {
    throw new Error('calendarioPersonal necesita epocaMs e instanteMs numéricos');
  }
  if (instanteMs < epocaMs) {
    throw new Error('calendarioPersonal: el instante es anterior a la época — no hay calendario antes de nacer');
  }

  /* 1. En qué Espiral cae el instante. */
  const limites = limitesDeEspirales(epocaMs, instanteMs);
  let espiralIndice = 0;
  for (let i = 0; i < limites.length; i++) {
    if (limites[i] <= instanteMs) espiralIndice = i; else break;
  }
  const inicioEspiralActual = limites[espiralIndice];

  /* 2. Dentro de ese Espiral, en qué lunación real cae el instante. La
     Lunación 1 es la que CONTIENE inicioEspiralActual — no hace falta
     buscar el arranque real de esa lunación por separado: para el Espiral
     1, inicioEspiralActual es la época (el Math.max del paso 3 ya la usa
     como suelo para el día); para el resto, inicioEspiralActual YA es una
     luna nueva real, por construcción de limitesDeEspirales. Verificado a
     mano contra los cinco primeros Espirales de la carta de referencia:
     coinciden siempre salvo en el primero, donde no hacía falta que
     coincidieran. */
  let lunacion = 1;
  let inicioLunacionActual = inicioEspiralActual;
  /* Mismo cálculo que antes, solo reordenado: `finLunacionActual` guarda
     el valor que el bucle original descartaba al hacer break (era una
     variable local `inicioSiguienteLunacion` sin nombre fuera del
     bucle). Aquí se necesita después, para el paso 3b. El número de
     llamadas a lunaNuevaDesde() y el resultado final de lunacion /
     inicioLunacionActual son idénticos al original: se puede comprobar
     siguiendo la traza a mano, iteración a iteración. */
  let finLunacionActual = lunaNuevaDesde(inicioLunacionActual + 3600e3);
  while (finLunacionActual <= instanteMs) {
    lunacion++;
    inicioLunacionActual = finLunacionActual;
    finLunacionActual = lunaNuevaDesde(inicioLunacionActual + 3600e3);
  }

  /* 3. Dentro de esa lunación, qué día lunar. El Día 1 es el día lunar que
     contiene el arranque de la lunación (inicioLunacionActual, o la época
     si es la Lunación 1 del ciclo 1 y el arranque real cae antes de que
     empezara el calendario de esta persona). */
  const inicioBusquedaDia = Math.max(inicioLunacionActual, epocaMs);
  let dia = 1;
  let d = diaLunar(inicioBusquedaDia, obs);
  while (d && d.termina <= instanteMs) {
    dia++;
    d = diaLunar(d.termina + 1, obs);
  }

  /* 3b. Cuántos días lunares caben en TODA la lunación actual, no solo
     hasta instanteMs — para dibujar un anillo con un punto por cada día
     real de esta lunación (espiral entrelazado, 28 de agosto). Continúa
     el mismo recorrido de arriba en vez de reiniciarlo: `d` ya está
     posicionado en el día que contiene instanteMs, así que solo hace
     falta seguir contando hasta que su fin alcance finLunacionActual.

     Si diaLunar() alguna vez no encuentra una salida (el caso `null` que
     ya declara su propia cabecera), el conteo se corta ahí con lo que
     lleve en vez de lanzar: un anillo con algún punto de menos es mejor
     que un calendario que deja de abrir por un hueco astronómico
     aislado. No se ha visto nunca en las pruebas de luna.js, pero la
     función ya contempla que puede pasar. */
  let diasEnLunacion = dia;
  let dFinal = d;
  while (dFinal && dFinal.termina < finLunacionActual) {
    const siguiente = diaLunar(dFinal.termina + 1, obs);
    /* Solo se cuenta un día una vez CONFIRMADO, no al anticiparlo: contar
       antes de comprobar el resultado de diaLunar() metía un día de más
       exactamente cuando el hueco astronómico caía en el último paso del
       recorrido — cazado por la prueba, no por mutación. */
    if (!siguiente) break;
    diasEnLunacion++;
    dFinal = siguiente;
  }

  return {
    /* "Espiral", el nombre elegido el 26 de agosto para el ciclo mayor —
       no "ciclo" a secas (poco evocador) ni "año lunar" (ya significa otra
       cosa en calendarios reales: doce lunaciones, ~354 días, el año
       islámico). Esto es distinto: 13-14 lunaciones, ~413 días, gobernado
       por el pico de luna llena, no por una cuenta de lunaciones fija
       (ver cabecera del archivo). */
    espiral: espiralIndice + 1,
    lunacion,
    dia,
    /* Cuántos días lunares tiene ESTA lunación entera, no una media —
       mismo criterio que el resto del proyecto ("NO SE USA NINGUNA
       DURACIÓN MEDIA, NI AQUÍ NI EN NINGUNA PARTE", luna.js). Se usa
       para el anillo de Día del espiral entrelazado: N puntos reales,
       no ~29,5 inventados. */
    diasEnLunacion,
    inicioEspiral: inicioEspiralActual,
    inicioLunacion: inicioLunacionActual
  };
}

if (typeof window !== 'undefined') {
  window.picoDesde = picoDesde;
  window.limitesDeEspirales = limitesDeEspirales;
  window.calendarioPersonal = calendarioPersonal;
}
