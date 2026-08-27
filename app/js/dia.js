/* =====================================================================
   Umbral — nivel 2 de las tradiciones  ·  app/js/dia.js

   fuentes.js (decisión 0016) guarda los niveles 1, 3, 4 y 5 — estáticos,
   iguales cada vez que se abren. El nivel 2, «dónde cae hoy», NO puede
   vivir ahí: es de clase ① y se recalcula del instante, como dice la
   propia cabecera de fuentes.js. Este módulo es ese cálculo, y nada más.

   NADA DE ESTO SE INVENTA. Cada fórmula está copiada literalmente de
   herramientas/hoja-de-cielo.mjs, que ya las tiene verificadas contra la
   carta de referencia del proyecto — no se reescriben de memoria.

   `casas` NO está aquí a propósito. El ascendente depende del tiempo
   sidéreo, que cambia minuto a minuto: tiene sentido para un instante de
   nacimiento, no para "todo el día de hoy". Vive en la carta natal del
   anclaje de origen, no en la vista de un día cualquiera.

   `tzolkin` y `numerologia` tampoco están: los dos siguen en
   `estado: "sin_verificar"` en fuentes.js, y sin nivel1-5 visible no
   tiene sentido calcular su nivel2.
   ===================================================================== */

const Astronomia = globalThis.Astronomy;
if (!Astronomia) {
  throw new Error(
    'dia.js: falta el motor. Carga js/vendor/astronomy.browser.min.js ' +
    'con un <script> clásico antes que este módulo.'
  );
}

const norm = x => ((x % 360) + 360) % 360;

/* Spica J2000, la misma estrella y las mismas coordenadas que
   herramientas/hoja-de-cielo.mjs línea 187 — Star1 solo se puede definir
   una vez por proceso, así que se hace aquí, al cargar el módulo. */
Astronomia.DefineStar(Astronomia.Body.Star1, 13.419883, -11.161319, 250);

function ayanamsaLahiri(t) {
  return norm(Astronomia.Ecliptic(Astronomia.GeoVector(Astronomia.Body.Star1, t, true)).elon - 180);
}

const lonSol = t => Astronomia.Ecliptic(Astronomia.GeoVector('Sun', t, true)).elon;
const lonLuna = t => Astronomia.EclipticGeoMoon(t).lon;

const SIGNOS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

const NAK = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];

const TERM = [
  'Lichun', 'Yushui', 'Jingzhe', 'Chunfen', 'Qingming', 'Guyu', 'Lixia', 'Xiaoman',
  'Mangzhong', 'Xiazhi', 'Xiaoshu', 'Dashu', 'Liqiu', 'Chushu', 'Bailu', 'Qiufen',
  'Hanlu', 'Shuangjiang', 'Lidong', 'Xiaoxue', 'Daxue', 'Dongzhi', 'Xiaohan', 'Dahan'
];
const TRAD = [
  'comienzo de la primavera', 'agua de lluvia', 'despertar de los insectos',
  'equinoccio de primavera', 'pura claridad', 'lluvia de grano', 'comienzo del verano',
  'grano lleno', 'grano en la espiga', 'solsticio de verano', 'calor menor', 'calor mayor',
  'comienzo del otoño', 'fin del calor', 'rocío blanco', 'equinoccio de otoño',
  'rocío frío', 'caída de la escarcha', 'comienzo del invierno', 'nieve menor',
  'nieve mayor', 'solsticio de invierno', 'frío menor', 'frío mayor'
];

const FASES_RUDHYAR = [
  'Nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente',
  'Llena', 'Diseminadora', 'Cuarto menguante', 'Balsámica'
];

/* --- zodiaco_tropical ------------------------------------------------ */
export function solTropical(ms) {
  const t = Astronomia.MakeTime(new Date(ms));
  const l = norm(lonSol(t));
  return { grados: l % 30, signo: SIGNOS[Math.floor(l / 30)] };
}

/* --- zodiaco_sidereo --------------------------------------------------
   Mismo cálculo, fijando Spica en 180° — igual que hoja-de-cielo.mjs. */
export function solSidereo(ms) {
  const t = Astronomia.MakeTime(new Date(ms));
  const ayan = ayanamsaLahiri(t);
  const l = norm(lonSol(t) - ayan);
  return { grados: l % 30, signo: SIGNOS[Math.floor(l / 30)], ayanamsa: ayan };
}

/* --- jieqi -------------------------------------------------------------
   24 tramos de 15°, desde el mismo equinoccio que el zodiaco tropical. */
export function terminoSolar(ms) {
  const t = Astronomia.MakeTime(new Date(ms));
  const i = Math.floor(norm(lonSol(t) - 315) / 15);
  return {
    termino: TERM[i], tradicional: TRAD[i],
    siguiente: TERM[(i + 1) % 24], siguiente_tradicional: TRAD[(i + 1) % 24]
  };
}

/* --- tithi --------------------------------------------------------------
   30 tramos de 12° sobre la elongación Luna-Sol. shukla (creciente) por
   debajo de 180°, krishna (menguante) por encima — Sūrya-Siddhānta I.12-13,
   trad. Burgess 1860. */
export function tithiDelDia(ms) {
  const t = Astronomia.MakeTime(new Date(ms));
  const sep = norm(lonLuna(t) - lonSol(t));
  return { numero: Math.floor(sep / 12) + 1, paksha: sep < 180 ? 'shukla' : 'krishna' };
}

/* --- fases_rudhyar -------------------------------------------------------
   El mismo ángulo Luna-Sol que tithi, partido en 8 en vez de en 30 — es
   la misma medida, otra rejilla (hoja-de-cielo.mjs, "un solo número,
   cuatro rejillas"). No se reutiliza fase_grados de luna.js a propósito:
   esa viene de Astronomia.MoonPhase(t), un cálculo distinto aunque el
   resultado numérico coincida — aquí se usa la misma resta que tithi para
   que las dos rejillas sean, de verdad, la misma medida partida distinto. */
export function faseRudhyarDelDia(ms) {
  const t = Astronomia.MakeTime(new Date(ms));
  const sep = norm(lonLuna(t) - lonSol(t));
  return { nombre: FASES_RUDHYAR[Math.floor(sep / 45)], indice: Math.floor(sep / 45) + 1 };
}

/* --- nakshatra -----------------------------------------------------------
   27 tramos de 13°20′ sobre la longitud sidérea de la Luna. Los grados y
   los padas siguen en estado DÉBIL (falta cotejar el cap. VIII de
   Burgess) — la ficha lo dice, el número no espera a que se cierre eso. */
export function nakshatraDeLaLuna(ms) {
  const t = Astronomia.MakeTime(new Date(ms));
  const ayan = ayanamsaLahiri(t);
  const lunaS = norm(lonLuna(t) - ayan);
  const ancho = 360 / 27;
  const i = Math.floor(lunaS / ancho);
  return { nombre: NAK[i], numero: i + 1, pada: Math.floor((lunaS % ancho) / (ancho / 4)) + 1 };
}

/* --- calendario_islamico -----------------------------------------------
   Civil tabular, vía Intl — el mismo Intl.DateTimeFormat('islamic-civil')
   de hoja-de-cielo.mjs, no una tabla propia. */
export function fechaIslamica(ms, zona) {
  try {
    return new Intl.DateTimeFormat('es-ES', { calendar: 'islamic-civil', dateStyle: 'long', timeZone: zona }).format(new Date(ms));
  } catch {
    return null;
  }
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
