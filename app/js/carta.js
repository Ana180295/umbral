/* =====================================================================
   Umbral — la carta del cielo  ·  app/js/carta.js

   EL ÚNICO ORIGINAL. Pendiente 43, decidido el 12 de noviembre de 2026:
   todo cálculo astrológico vive aquí, y los demás lo importan:
     · app/js/dia.js — el nivel 2 de la pantalla `dia`
     · herramientas/hoja-de-cielo.mjs — la hoja de nacimiento en markdown
   Hasta hoy dia.js copiaba las fórmulas del script «literalmente», que es
   exactamente lo que prohíbe la regla 7 del 25 de agosto (fuente única de
   verdad): dos copias de la misma fórmula se separan el día que alguien
   corrige una sola.

   LAS FÓRMULAS SON LAS DE hoja-de-cielo.mjs, SIN CAMBIAR NINGÚN NÚMERO.
   Se movieron, no se reescribieron, y la prueba es que la hoja de la
   carta de referencia sale idéntica antes y después de moverlas
   (pruebas/carta.test.mjs, y el cotejo línea a línea del 13 de noviembre).
   Lo que SÍ cambia, y se dice:
     · el cumpleaños lunar se busca con SearchMoonPhase —el instante
       exacto, pendiente 43— y no con un barrido de 15 minutos que
       dependía de la hora a la que se ejecutara el script;
     · el ayanamsa se llama por lo que es: True Chitra, Spica fijada en
       180° (pendiente 41). El número no cambia; el nombre sí.

   LO QUE NO SE HA DECIDIDO Y POR ESO SIGUE COMO ESTABA:
     · los paralelos usan declinación topocéntrica y las longitudes son
       geocéntricas (pendiente 44, en conversación aparte);
     · las horas planetarias no están aquí: tienen tres fallos medidos
       y se decide antes si entran (pendiente 45). Se quedan en el script.

   Módulo puro: todo instante entra como epoch en milisegundos, el
   observador por parámetro, sin DOM, sin red, sin reloj del sistema.
   ===================================================================== */

import { vectorAparenteQuiron } from './quiron.js';

const Astronomia = globalThis.Astronomy;
if (!Astronomia) {
  throw new Error(
    'carta.js: falta el motor. Carga js/vendor/astronomy.browser.min.js ' +
    'con un <script> clásico antes que este módulo (o, en Node, ponlo en ' +
    'globalThis.Astronomy con require() antes de importarlo).'
  );
}

const RAD = Math.PI / 180, DEG = 180 / Math.PI;
export const norm = (x) => ((x % 360) + 360) % 360;
const tiempo = (ms) => Astronomia.MakeTime(new Date(ms));

/* =====================================================================
   1. CONSTANTES
   ===================================================================== */

/* Orbes, fichados con su método en 03-registro-de-datos.md, sección
   «Aspectos». No se cambian aquí sin cambiar antes la ficha. */
export const ORBE = 1;
export const ORBE_PARALELO = 0.75;

/* Quirón (Chiron) desde el 15 de noviembre de 2026, decisión 0031: entra
   en las posiciones, los aspectos, los paralelos y las casas, como pidió
   Ana. El motor no lo trae; lo calcula quiron.js. SOLO EXISTE ENTRE 1900 Y
   2100: fuera de ese rango no aparece en ninguna lista —ni como null ni
   como hueco—, porque no hay datos de JPL para calcularlo. Por eso todo lo
   de este módulo recorre los cuerpos PRESENTES en cada instante, no la
   lista fija. */
export const CUERPOS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];
export const NOMBRES = {
  Sun: 'Sol', Moon: 'Luna', Mercury: 'Mercurio', Venus: 'Venus', Mars: 'Marte',
  Jupiter: 'Júpiter', Saturn: 'Saturno', Uranus: 'Urano', Neptune: 'Neptuno', Pluto: 'Plutón',
  Chiron: 'Quirón'
};
/* Los cuerpos de CUERPOS que tienen valor en `obj`, en el orden de CUERPOS. */
const presentes = (obj) => CUERPOS.filter((c) => obj[c] !== undefined && obj[c] !== null);
export const SIGNOS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Shravishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];
export const TERMINOS_SOLARES = [
  'Lichun', 'Yushui', 'Jingzhe', 'Chunfen', 'Qingming', 'Guyu', 'Lixia', 'Xiaoman',
  'Mangzhong', 'Xiazhi', 'Xiaoshu', 'Dashu', 'Liqiu', 'Chushu', 'Bailu', 'Qiufen',
  'Hanlu', 'Shuangjiang', 'Lidong', 'Xiaoxue', 'Daxue', 'Dongzhi', 'Xiaohan', 'Dahan'
];
export const TERMINOS_SOLARES_TRADUCIDOS = [
  'comienzo de la primavera', 'agua de lluvia', 'despertar de los insectos',
  'equinoccio de primavera', 'pura claridad', 'lluvia de grano', 'comienzo del verano',
  'grano lleno', 'grano en la espiga', 'solsticio de verano', 'calor menor', 'calor mayor',
  'comienzo del otoño', 'fin del calor', 'rocío blanco', 'equinoccio de otoño',
  'rocío frío', 'caída de la escarcha', 'comienzo del invierno', 'nieve menor',
  'nieve mayor', 'solsticio de invierno', 'frío menor', 'frío mayor'
];
export const FASES_RUDHYAR = [
  'Nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente',
  'Llena', 'Diseminadora', 'Cuarto menguante', 'Balsámica'
];
export const FASES_POPULARES = ['nueva', 'creciente', 'llena', 'menguante'];
export const ASPECTOS = [['conjunción', 0], ['sextil', 60], ['cuadratura', 90], ['trígono', 120], ['oposición', 180]];
export const TZOLKIN_NOMBRES = [
  'Imix', 'Ik', 'Akbal', 'Kan', 'Chikchan', 'Kimi', 'Manik', 'Lamat', 'Muluk', 'Ok',
  'Chuwen', 'Eb', 'Ben', 'Ix', 'Men', 'Kib', 'Kaban', 'Etznab', 'Kawak', 'Ajaw'
];

/* =====================================================================
   2. LONGITUDES Y AYANAMSA
   ===================================================================== */

/* Longitud eclíptica tropical geocéntrica, de la fecha. La Luna por su
   función propia; el resto por el vector geocéntrico con aberración.
   Mismo cálculo que `lon()` de hoja-de-cielo.mjs. */
export function longitudTropical(cuerpo, ms) {
  if (cuerpo === 'Chiron') {
    const v = vectorAparenteQuiron(ms);
    return v ? Astronomia.Ecliptic(v).elon : null;      // null fuera de 1900-2100
  }
  const t = tiempo(ms);
  return cuerpo === 'Moon'
    ? Astronomia.EclipticGeoMoon(t).lon
    : Astronomia.Ecliptic(Astronomia.GeoVector(cuerpo, t, true)).elon;
}

/* Spica J2000 —AR 13h 25m 11,579s, Dec −11° 09′ 40,75″—, ficha de
   `zodiaco_sidereo` en fuentes.js. Star1 se define UNA vez, aquí, al
   cargar el módulo: antes la definían dia.js y el script por separado.
   El motor tiene ocho ranuras de estrella (Star1…Star8); esta ocupa la
   primera. */
Astronomia.DefineStar(Astronomia.Body.Star1, 13.419883, -11.161319, 250);

/* AYANAMSA TRUE CHITRA: Spica fijada en 180°. No es el Lahiri oficial
   (pendiente 41, cotejado el 12 de noviembre de 2026): el comité de
   reforma del calendario indio lo definió por un valor en una fecha
   (23°15′00″ el 21 de marzo de 1956) y con esa definición Spica cae en
   179°58′59″ en el año 2000. Medido con este motor: 61″ por debajo del
   Lahiri habitual en 2000. El número de esta función no cambia con el
   nombre; el nombre es el que deja de mentir. */
export function ayanamsaTrueChitra(ms) {
  return norm(Astronomia.Ecliptic(Astronomia.GeoVector(Astronomia.Body.Star1, tiempo(ms), true)).elon - 180);
}

/* Retrógrado si la longitud decrece entre doce horas antes y doce horas
   después. El Sol y la Luna no lo son nunca vistos desde la Tierra. */
export function retrogrado(cuerpo, ms) {
  if (cuerpo === 'Sun' || cuerpo === 'Moon') return false;
  const despues = longitudTropical(cuerpo, ms + 43200000), antes = longitudTropical(cuerpo, ms - 43200000);
  if (despues === null || antes === null) return null;      // Quirón en el borde de su rango
  let v = despues - antes;
  if (v > 180) v -= 360;
  if (v < -180) v += 360;
  return v < 0;
}

export const signoDe = (longitud) => SIGNOS[Math.floor(norm(longitud) / 30)];

/* Las diez longitudes de un instante, tropicales, más el ayanamsa del
   mismo instante. Todo lo demás de este módulo sale de aquí. */
export function longitudes(ms) {
  const L = {};
  for (const c of CUERPOS) {
    const l = longitudTropical(c, ms);
    if (l !== null) L[c] = l;
  }
  return L;
}

/* =====================================================================
   3. EL ÁNGULO LUNA − SOL Y SUS REJILLAS
   «Un solo número, cuatro rejillas» (hoja-de-cielo.mjs): fases
   populares, Rudhyar, tithi y karana no son cuatro datos, son el mismo
   ángulo partido de cuatro maneras. Por eso salen todas de una sola
   resta y no de cuatro cálculos.
   ===================================================================== */

export function separacionLunaSol(ms) {
  return norm(longitudTropical('Moon', ms) - longitudTropical('Sun', ms));
}

export function rejillasLunaSol(ms) {
  const sep = separacionLunaSol(ms);
  return {
    separacion: sep,
    fase_popular: FASES_POPULARES[Math.floor(sep / 90)],
    rudhyar: { nombre: FASES_RUDHYAR[Math.floor(sep / 45)], indice: Math.floor(sep / 45) + 1 },
    tithi: { numero: Math.floor(sep / 12) + 1, paksha: sep < 180 ? 'shukla' : 'krishna' },
    karana: { numero: Math.floor(sep / 6) + 1 }
  };
}

/* 27 tramos de 13°20′ sobre la longitud sidérea de la Luna, con cuatro
   padas de 3°20′. Grados en estado DÉBIL (falta cotejar el cap. VIII de
   Burgess, pendiente 15). */
export function nakshatra(ms) {
  const lunaS = norm(longitudTropical('Moon', ms) - ayanamsaTrueChitra(ms));
  const ancho = 360 / 27;
  const i = Math.floor(lunaS / ancho);
  return { nombre: NAKSHATRAS[i], numero: i + 1, pada: Math.floor((lunaS % ancho) / (ancho / 4)) + 1 };
}

/* 24 tramos de 15° desde el mismo equinoccio que el zodiaco tropical;
   Lichun abre en los 315°. */
export function terminoSolar(ms) {
  const i = Math.floor(norm(longitudTropical('Sun', ms) - 315) / 15);
  return {
    termino: TERMINOS_SOLARES[i], tradicional: TERMINOS_SOLARES_TRADUCIDOS[i],
    siguiente: TERMINOS_SOLARES[(i + 1) % 24], siguiente_tradicional: TERMINOS_SOLARES_TRADUCIDOS[(i + 1) % 24]
  };
}

/* =====================================================================
   4. ÁNGULOS Y CASAS — solo con hora exacta (pendiente 43)
   ===================================================================== */

export function angulos(ms, obs) {
  const t = tiempo(ms);
  const eps = Math.acos(Astronomia.Rotation_EQD_ECT(t).rot[1][1]);
  const ramc = norm(Astronomia.SiderealTime(t) * 15 + obs.longitude);
  const phi = obs.latitude * RAD;
  const MC = norm(Math.atan2(Math.sin(ramc * RAD), Math.cos(ramc * RAD) * Math.cos(eps)) * DEG);
  let ASC = ascBajoPolo(ramc, phi, eps);
  if (norm(ASC - MC) > 180) ASC = norm(ASC + 180);
  return { ASC, MC, DSC: norm(ASC + 180), IC: norm(MC + 180), eps, ramc, phi };
}

function ascBajoPolo(Rg, P, eps) {
  const r = Rg * RAD;
  return norm(Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(eps) + Math.tan(P) * Math.sin(eps))) * DEG);
}

/* Las cúspides de los seis sistemas. Un sistema que no existe a esta
   latitud (Placidus por encima del círculo polar) o que no pasa sus
   controles no aparece: no se devuelve una cúspide inventada. */
export function cuspides(ms, obs) {
  const { ASC, MC, eps, ramc, phi } = angulos(ms, obs);
  const decDe = (l) => Math.asin(Math.sin(eps) * Math.sin(l * RAD));
  const lonDeRA = (ra) => norm(Math.atan2(Math.sin(ra * RAD) / Math.cos(eps), Math.cos(ra * RAD)) * DEG);

  const sistemas = {};
  sistemas['Signos enteros'] = Array.from({ length: 12 }, (_, i) => norm(Math.floor(ASC / 30) * 30 + i * 30));
  sistemas['Iguales'] = Array.from({ length: 12 }, (_, i) => norm(ASC + i * 30));
  {
    const IC = norm(MC + 180), DSC = norm(ASC + 180);
    const q = [norm(IC - ASC) / 3, norm(DSC - IC) / 3, norm(MC - DSC) / 3, norm(ASC - MC) / 3];
    sistemas['Porfirio'] = [ASC, norm(ASC + q[0]), norm(ASC + 2 * q[0]), IC, norm(IC + q[1]), norm(IC + 2 * q[1]),
      DSC, norm(DSC + q[2]), norm(DSC + 2 * q[2]), MC, norm(MC + q[3]), norm(MC + 2 * q[3])];
  }
  function placidus(diurno, frac) {
    let l = lonDeRA(norm(ramc + (diurno ? 90 : 270)));
    for (let i = 0; i < 80; i++) {
      const t = Math.tan(phi) * Math.tan(decDe(l));
      if (Math.abs(t) >= 1) return null;                  // circumpolar: Placidus no existe
      const AD = Math.asin(t) * DEG, SD = diurno ? 90 + AD : 90 - AD;
      const nueva = lonDeRA(norm(ramc + (diurno ? frac * SD : 180 - frac * SD)));
      if (Math.abs(norm(nueva - l + 180) - 180) < 1e-9) return nueva;
      l = nueva;
    }
    return l;
  }
  {
    const c11 = placidus(true, 1 / 3), c12 = placidus(true, 2 / 3), c3 = placidus(false, 1 / 3), c2 = placidus(false, 2 / 3);
    if ([c11, c12, c2, c3].every((x) => x !== null)) {
      sistemas['Placidus'] = [ASC, c2, c3, norm(MC + 180), norm(c11 + 180), norm(c12 + 180),
        norm(ASC + 180), norm(c2 + 180), norm(c3 + 180), MC, c11, c12];
    }
  }
  for (const [nombre, off] of [
    ['Regiomontano', (H) => H],
    ['Campano', (H) => norm(Math.atan2(Math.sin(H * RAD), Math.cos(H * RAD) * Math.cos(phi)) * DEG)]]) {
    const c = Array.from({ length: 12 }, (_, i) => {
      const H = norm(90 + 30 * i), D = off(H);
      return ascBajoPolo(norm(ramc + D - 90), Math.atan(Math.tan(phi) * Math.sin(D * RAD)), eps);
    });
    /* Controles: cúspide 1 = ASC, cúspide 10 = MC, y ninguna fuera de
       orden. «Un control que solo mira donde la respuesta es obvia no es
       un control» (23 de agosto): por eso el tercero mira las doce. */
    const e1 = Math.abs(norm(c[0] - ASC + 180) - 180), e10 = Math.abs(norm(c[9] - MC + 180) - 180);
    let mal = 0;
    for (let i = 0; i < 12; i++) { const p = norm(c[(i + 1) % 12] - c[i]); if (p < 5 || p > 75) mal++; }
    if (e1 < 1e-6 && e10 < 1e-6 && mal === 0) sistemas[nombre] = c;
  }
  return sistemas;
}

export function casaDe(longitud, cusp) {
  for (let h = 0; h < 12; h++) {
    const a = cusp[h], b = cusp[(h + 1) % 12];
    if (norm(longitud - a) < norm(b - a)) return h + 1;
  }
  return 12;
}

/* =====================================================================
   5. ASPECTOS Y PARALELOS — entre los cuerpos de una misma carta
   ===================================================================== */

export function aspectos(L, orbe = ORBE) {
  const asp = [];
  const cs = presentes(L);
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    let x = Math.abs(norm(L[cs[i]] - L[cs[j]])); if (x > 180) x = 360 - x;
    for (const [nombre, angulo] of ASPECTOS) {
      const o = Math.abs(x - angulo);
      if (o <= orbe) asp.push({ a: cs[i], b: cs[j], aspecto: nombre, orbe: o });
    }
  }
  return asp.sort((p, q) => p.orbe - q.orbe);
}

/* OJO, pendiente 44: la declinación es TOPOCÉNTRICA (Equator con el
   observador) mientras las longitudes son geocéntricas. Se deja así
   porque es lo que se usó para medir ORBE_PARALELO y nadie ha decidido
   todavía cambiarlo. Medido: hasta 0,93° de diferencia en la Luna. */
export function declinaciones(ms, obs) {
  const t = tiempo(ms);
  const D = {};
  for (const c of CUERPOS) {
    if (c === 'Chiron') {
      /* Quirón: declinación aparente GEOCÉNTRICA, del vector de quiron.js
         llevado al ecuador de la fecha. A 8-19 ua el paralaje de Albacete
         no llega a 1″, así que geocéntrica y topocéntrica coinciden a la
         precisión del orbe; pero se dice, por el pendiente 44. */
      const v = vectorAparenteQuiron(ms);
      if (v) D[c] = Astronomia.EquatorFromVector(Astronomia.RotateVector(Astronomia.Rotation_EQJ_EQD(t), v)).dec;
    } else {
      D[c] = Astronomia.Equator(c, t, obs, true, true).dec;
    }
  }
  return D;
}

export function paralelos(DEC, orbe = ORBE_PARALELO) {
  const par = [];
  const cs = presentes(DEC);
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j];
    const p = Math.abs(DEC[a] - DEC[b]), cp = Math.abs(DEC[a] + DEC[b]);
    if (p < orbe) par.push({ a, b, tipo: 'paralelo', orbe: p });
    if (cp < orbe) par.push({ a, b, tipo: 'contraparalelo', orbe: cp });
  }
  return par.sort((p, q) => p.orbe - q.orbe);
}

/* =====================================================================
   6. CALENDARIOS DE CUENTA
   ===================================================================== */

/* Vía Intl y nada más. «islamic-civil», nunca «islamic» a secas (ficha
   de calendario_islamico). Devuelve null si el navegador no tiene ese
   calendario: no se rellena con una tabla propia. */
export function fechaEnCalendario(ms, calendario, zona) {
  try {
    return new Intl.DateTimeFormat('es-ES', { calendar: calendario, dateStyle: 'long', timeZone: zona }).format(new Date(ms));
  } catch {
    return null;
  }
}

/* Tzolk'in desde la fecha CIVIL local (no desde el instante): el
   número de día juliano de esa fecha menos la correlación. Sigue en
   sin_verificar en fuentes.js; se calcula para la hoja, no se enseña. */
export function tzolkin(fechaCivil, correlacion = 584283) {
  const [Y, M, D] = fechaCivil.split('-').map(Number);
  const jdn = Math.floor(Date.UTC(Y, M - 1, D) / 86400000) + 2440588;
  const dd = jdn - correlacion;
  return { numero: ((dd + 3) % 13 + 13) % 13 + 1, nombre: TZOLKIN_NOMBRES[((dd + 19) % 20 + 20) % 20], correlacion };
}

/* =====================================================================
   7. EL CUMPLEAÑOS LUNAR — el instante exacto (pendiente 43)
   El ángulo Luna−Sol del nacimiento vuelve cada mes. Se mide con
   MoonPhase y se busca con SearchMoonPhase, que es la búsqueda del
   motor para ese mismo ángulo, así que el ángulo de partida y el que se
   busca son la misma magnitud. OJO: MoonPhase y la resta de
   separacionLunaSol() difieren hasta 21″ —medido en 2026—, unos 40 s
   de tiempo. Para un instante exacto, las dos mitades tienen que ser el
   mismo cálculo, y por eso aquí no se usa separacionLunaSol().
   `desdeMs` entra por parámetro: el módulo no lee el reloj.
   ===================================================================== */
export function cumpleanosLunar(nacimientoMs, desdeMs) {
  const angulo = Astronomia.MoonPhase(tiempo(nacimientoMs));
  const r = Astronomia.SearchMoonPhase(angulo, tiempo(desdeMs), 40);
  return r ? { instante: r.date.getTime(), angulo } : null;
}

/* =====================================================================
   8. LA CARTA ENTERA — de un instante, o de una ventana de tiempo
   Pendiente 43, decidido por Ana el 12 de noviembre de 2026: sin hora
   exacta, «calculamos en los dos extremos», y el Ascendente, el Medio
   Cielo y las casas solo con hora exacta (decisión 0030).
   ===================================================================== */

/* Todo lo de una carta en un instante: lo mismo que la hoja enseña, en
   datos. Con `obs` hacen falta las coordenadas del NACIMIENTO, no las del
   lugar habitual (decisión 0027 y corrección de la época). */
export function cartaEnInstante(ms, obs) {
  const L = longitudes(ms);
  const ayan = ayanamsaTrueChitra(ms);
  const cuerpos = {};
  for (const c of presentes(L)) {
    cuerpos[c] = {
      longitud: L[c],
      signo_tropical: signoDe(L[c]),
      signo_sidereo: signoDe(L[c] - ayan),
      retrogrado: retrogrado(c, ms)
    };
  }
  const ang = angulos(ms, obs);
  const sistemas = cuspides(ms, obs);
  const casas = {};
  for (const [n, cusp] of Object.entries(sistemas)) {
    casas[n] = { cuspides: cusp, de: Object.fromEntries(presentes(L).map((c) => [c, casaDe(L[c], cusp)])) };
  }
  return {
    instante: ms,
    ayanamsa: ayan,
    cuerpos,
    rejillas: rejillasLunaSol(ms),
    nakshatra: nakshatra(ms),
    termino_solar: terminoSolar(ms),
    angulos: { ASC: ang.ASC, MC: ang.MC, DSC: ang.DSC, IC: ang.IC },
    casas,
    aspectos: aspectos(L),
    paralelos: paralelos(declinaciones(ms, obs))
  };
}

/* ---------------------------------------------------------------------
   La ventana: los dos extremos, y lo que se puede DECIR de lo de dentro.

   Para cada valor con nombre (signo, nakshatra, tithi…) se compara el del
   principio con el del final. Si coinciden, se da el valor. Si no, se da
   { entre: [principio, final] }. Nunca se elige uno, y nunca se da el del
   medio de la ventana: eso sería suponer una hora.

   POR QUÉ BASTAN DOS EXTREMOS, y hasta dónde. Funciona porque, en una
   ventana corta, todo lo que se mide se mueve en un solo sentido. En 3 h
   la Luna avanza como mucho ~1,9° (medido: 1,7° en la carta de
   referencia), y ninguna rejilla de las que se usan tiene tramos tan
   estrechos —el más estrecho es el karana, 6°—, así que no puede cruzar
   dos fronteras y volver: si los dos extremos coinciden, no ha cambiado
   en medio. La excepción teórica es un planeta que se para y da la vuelta
   (estación) justo encima de una frontera dentro de la ventana; se avisa
   en `retrogrado`, que sale como { entre: [..] } si cambia.

   LOS ASPECTOS, con más cuidado. Un aspecto puede estar dentro del orbe en
   un extremo y fuera en el otro, o en NINGUNO de los dos extremos y aun
   así hacerse exacto en medio si la distancia angular cruza el ángulo
   exacto. Para no perder ese caso se usa la desviación CON SIGNO respecto
   al ángulo exacto: si cambia de signo entre los dos extremos, el aspecto
   se hizo exacto dentro de la ventana. Con eso cada aspecto sale como:
     · seguro   — dentro del orbe en los dos extremos, y por tanto en toda
                  la ventana (la desviación cambia en un solo sentido);
     · posible  — dentro del orbe en solo una parte de la ventana: depende
                  de la hora que no se sabe.
   Lo mismo para los paralelos, sobre la diferencia (o la suma) de
   declinaciones.
   ------------------------------------------------------------------- */

const ANGULOS_CON_SIGNO = [[0, 'conjunción'], [60, 'sextil'], [300, 'sextil'], [90, 'cuadratura'], [270, 'cuadratura'],
  [120, 'trígono'], [240, 'trígono'], [180, 'oposición']];

/* Desviación con signo, en (−180, 180], de la separación a−b respecto a θ. */
const desviacion = (sep, theta) => ((sep - theta) % 360 + 540) % 360 - 180;

function clasificar(d0, d1, orbe, estricto) {
  const dentro = (d) => (estricto ? Math.abs(d) < orbe : Math.abs(d) <= orbe);
  const enDos = dentro(d0) && dentro(d1);
  const cruza = (d0 < 0) !== (d1 < 0) && Math.abs(d0 - d1) < 180;
  if (enDos) return { seguro: true, orbe_min: (d0 < 0) !== (d1 < 0) ? 0 : Math.min(Math.abs(d0), Math.abs(d1)) };
  if (dentro(d0) || dentro(d1) || cruza) {
    return { seguro: false, orbe_min: cruza ? 0 : Math.min(Math.abs(d0), Math.abs(d1)) };
  }
  return null;
}

const igualOEntre = (a, b, igual = (x, y) => JSON.stringify(x) === JSON.stringify(y)) =>
  (igual(a, b) ? a : { entre: [a, b] });

/* EL LÍMITE DE LA VENTANA. Todo lo de arriba vale porque la ventana es
   corta, y se escribe como límite y no como esperanza. Las franjas son de
   3 h, pero la del día que se atrasa la hora en otoño dura 4 h reales, así
   que el límite es 4 h. En 4 h la Luna se mueve como mucho ~2,6° respecto
   a cualquier otro cuerpo: menos que el tramo más estrecho (karana, 6°),
   así que ninguna rejilla puede cruzar dos fronteras. Con una ventana de
   24 h el tithi sí podría (hasta ~15° al día contra tramos de 12°), y
   «entre a y b» se comería el del medio. Por eso no se acepta: si un día
   hace falta una ventana más ancha —«No lo sé», por ejemplo—, hace falta
   otro método, y una decisión. */
export const VENTANA_MAXIMA_MS = 4 * 3600e3;

export function cartaEnVentana(inicioMs, finMs, obs, orbe = ORBE, orbeParalelo = ORBE_PARALELO) {
  if (!(finMs >= inicioMs)) throw new Error('cartaEnVentana: el final de la ventana no puede ser anterior al principio');
  if (finMs - inicioMs > VENTANA_MAXIMA_MS) {
    throw new Error('cartaEnVentana: la ventana pasa de 4 h y el método de los dos extremos deja de valer');
  }
  const A = cartaEnInstante(inicioMs, obs), B = cartaEnInstante(finMs, obs);
  /* Solo los cuerpos que existen en los dos extremos: Quirón en el borde
     de 1900 o de 2100 podría estar en uno y no en el otro. */
  const cs = CUERPOS.filter((c) => A.cuerpos[c] && B.cuerpos[c]);

  const cuerpos = {};
  for (const c of cs) {
    cuerpos[c] = {
      longitud: { desde: A.cuerpos[c].longitud, hasta: B.cuerpos[c].longitud },
      signo_tropical: igualOEntre(A.cuerpos[c].signo_tropical, B.cuerpos[c].signo_tropical),
      signo_sidereo: igualOEntre(A.cuerpos[c].signo_sidereo, B.cuerpos[c].signo_sidereo),
      retrogrado: igualOEntre(A.cuerpos[c].retrogrado, B.cuerpos[c].retrogrado)
    };
  }

  const asp = [];
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j];
    const s0 = norm(A.cuerpos[a].longitud - A.cuerpos[b].longitud);
    const s1 = norm(B.cuerpos[a].longitud - B.cuerpos[b].longitud);
    for (const [theta, nombre] of ANGULOS_CON_SIGNO) {
      const r = clasificar(desviacion(s0, theta), desviacion(s1, theta), orbe, false);
      if (r) asp.push({ a, b, aspecto: nombre, ...r });
    }
  }

  const DA = declinaciones(inicioMs, obs), DB = declinaciones(finMs, obs);
  const par = [];
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j];
    const p = clasificar(DA[a] - DA[b], DB[a] - DB[b], orbeParalelo, true);
    if (p) par.push({ a, b, tipo: 'paralelo', ...p });
    const cp = clasificar(DA[a] + DA[b], DB[a] + DB[b], orbeParalelo, true);
    if (cp) par.push({ a, b, tipo: 'contraparalelo', ...cp });
  }

  const porOrbe = (p, q) => (q.seguro - p.seguro) || (p.orbe_min - q.orbe_min);
  return {
    ventana: { inicio: inicioMs, fin: finMs },
    ayanamsa: { desde: A.ayanamsa, hasta: B.ayanamsa },
    cuerpos,
    rejillas: {
      fase_popular: igualOEntre(A.rejillas.fase_popular, B.rejillas.fase_popular),
      rudhyar: igualOEntre(A.rejillas.rudhyar, B.rejillas.rudhyar),
      tithi: igualOEntre(A.rejillas.tithi, B.rejillas.tithi),
      karana: igualOEntre(A.rejillas.karana, B.rejillas.karana)
    },
    nakshatra: igualOEntre(A.nakshatra, B.nakshatra),
    termino_solar: igualOEntre(A.termino_solar, B.termino_solar),
    /* Sin hora exacta no se dan, ni como intervalo: en 3 h el tiempo
       sidéreo avanza 45°, así que el Ascendente recorre del orden de signo
       y medio. Un intervalo tan ancho no es un dato. */
    angulos: null,
    casas: null,
    motivo_sin_angulos: 'el Ascendente, el Medio Cielo y las casas necesitan la hora exacta',
    aspectos: asp.sort(porOrbe),
    paralelos: par.sort(porOrbe)
  };
}

/* =====================================================================
   9. LOS TRAMOS DE UN INTERVALO — lo que cambia dentro de un día lunar
   Pendiente 42, opción (iii), elegida por Ana el 12 de noviembre de 2026:
   la cifra de cada tradición no se calcula en un instante suelto sino
   sobre el día lunar entero, y dice con qué valor empieza y a qué hora
   cambia («tithi 7 → 8 a las 14:32»). Hasta entonces el mismo día daba
   un tithi distinto según se llegara desde «Día anterior» (último segundo
   del día) o desde «Día siguiente» (primer instante): medido en 2026, el
   tithi cambia dentro del día en 347 de 352 días lunares.

   valorDe(ms) da el valor en un instante; clave(valor) dice qué cuenta
   como «el mismo» (el signo, no los grados). Se muestrea cada 20 minutos
   y cada cambio se afina por bisección hasta el segundo.

   POR QUÉ BASTA MUESTREAR CADA 20 MINUTOS. Entre dos cambios de cualquier
   rejilla que se use pasan horas: el pada más corto dura unas 6 h (3°20′
   con la Luna a ~15° al día), el tithi más corto unas 20 h, el día del
   calendario islámico 24 h. Si dos cambios cupieran en 20 minutos, el
   segundo se perdería; no caben, y pruebas/nivel2.test.mjs lo comprueba
   contra un barrido minuto a minuto. Una rejilla más fina necesitaría
   otro paso.
   ===================================================================== */
export function tramosEnIntervalo(valorDe, clave, inicioMs, finMs, pasoMs = 20 * 60e3) {
  if (!(finMs > inicioMs)) throw new Error('tramosEnIntervalo: el intervalo está vacío');
  const ultimo = finMs - 1;                                 // fin exclusivo
  const tramos = [{ desde: inicioMs, valor: valorDe(inicioMs) }];
  let tPrevio = inicioMs, kPrevia = clave(tramos[0].valor);
  for (let t = inicioMs + pasoMs; ; t += pasoMs) {
    const tt = Math.min(t, ultimo);
    if (clave(valorDe(tt)) !== kPrevia) {
      let lo = tPrevio, hi = tt;                           // en lo vale kPrevia; en hi, ya no
      while (hi - lo > 1000) {
        const medio = lo + Math.floor((hi - lo) / 2);
        if (clave(valorDe(medio)) === kPrevia) lo = medio; else hi = medio;
      }
      const valor = valorDe(hi);
      tramos.push({ desde: hi, valor });
      kPrevia = clave(valor);
    }
    tPrevio = tt;
    if (tt >= ultimo) break;
  }
  return tramos;
}
