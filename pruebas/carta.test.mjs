import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

/* Pruebas doradas de app/js/carta.js — 13 de noviembre de 2026.

   DE DÓNDE SALEN LOS NÚMEROS. Copiados a mano de la salida de
   `node herramientas/hoja-de-cielo.mjs` sobre la carta de referencia
   (18/02/1995, 22:43 Europe/Madrid = 21:43 UTC, Albacete, 674 m), generada
   el 13 de noviembre ANTES de mover las fórmulas a carta.js. Ninguno se ha
   obtenido llamando a carta.js: si lo fueran, la prueba comprobaría que el
   módulo coincide consigo mismo. La hoja de después del traslado salió
   idéntica, línea a línea, salvo el nombre del ayanamsa y el cumpleaños
   lunar, que cambiaron a propósito.

   Y los mismos números cuadran con nacimiento-1995-02-18.md (agosto), hecho
   con otra versión del script: Luna a 3,8° de altura, salida de la Luna a
   las 22:18:55-56.

   Se carga la misma build UMD que se instala en el móvil, con require(),
   como en el resto de pruebas astronómicas.

   QUIRÓN (15 de noviembre de 2026, decisión 0031). Entró después y no
   estaba en la hoja de antes del traslado. Sus valores de abajo salen de
   carta.js, y lo que los sostiene es otra cosa: pruebas/jpl.test.mjs
   coteja su posición contra JPL Horizons (máximo 1,21″), y su retrógrado
   se ve en los propios datos de JPL —175,45° el 12 de febrero de 1995,
   173,30° el 14 de marzo—. Todo lo que ya estaba antes de Quirón NO ha
   cambiado ni un dígito. */

const require = createRequire(import.meta.url);
globalThis.Astronomy = require('../app/js/vendor/astronomy.browser.min.js');
const C = await import('../app/js/carta.js');

const NACIMIENTO = Date.UTC(1995, 1, 18, 21, 43);
const OBS = new globalThis.Astronomy.Observer(39.005556, -1.862222, 674);

/* El formato de la hoja: grados enteros, minutos truncados, signo. Escrito
   aquí otra vez, no importado, por la misma razón que los números. */
const SIG = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
const gr = (l) => {
  l = ((l % 360) + 360) % 360;
  const s = Math.floor(l / 30), x = l - s * 30;
  return `${Math.floor(x)}° ${String(Math.floor((x % 1) * 60)).padStart(2, '0')}′ ${SIG[s]}`;
};

/* ------------------------------------------------------------------ */

test('1 — las diez longitudes tropicales de la carta de referencia', () => {
  const L = C.longitudes(NACIMIENTO);
  const esperado = {
    Sun: '29° 46′ Acuario', Moon: '12° 29′ Libra', Mercury: '6° 01′ Acuario',
    Venus: '16° 00′ Capricornio', Mars: '20° 13′ Leo', Jupiter: '12° 48′ Sagitario',
    Saturn: '13° 09′ Piscis', Uranus: '28° 16′ Capricornio', Neptune: '24° 21′ Capricornio',
    Pluto: '0° 33′ Sagitario', Chiron: '25° 01′ Virgo'
  };
  for (const [c, v] of Object.entries(esperado)) assert.equal(gr(L[c]), v, c);
});

test('2 — Marte y Quirón están retrógrados; el Sol y la Luna no pueden estarlo', () => {
  const retro = C.CUERPOS.filter((c) => C.retrogrado(c, NACIMIENTO));
  assert.deepEqual(retro, ['Mars', 'Chiron']);
});

test('3 — Ascendente 17° 55′ Libra y Medio Cielo 20° 35′ Cáncer; DSC e IC, sus opuestos exactos', () => {
  const a = C.angulos(NACIMIENTO, OBS);
  assert.equal(gr(a.ASC), '17° 55′ Libra');
  assert.equal(gr(a.MC), '20° 35′ Cáncer');
  assert.equal(gr(a.DSC), '17° 55′ Aries');
  assert.equal(gr(a.IC), '20° 35′ Capricornio');
});

test('4 — ayanamsa True Chitra 23° 46,8′, y 9 de 13 puntos cambian de signo (Quirón no cambia)', () => {
  const ay = C.ayanamsaTrueChitra(NACIMIENTO);
  assert.equal(Math.floor(ay), 23);
  assert.equal(((ay % 1) * 60).toFixed(1), '46.8');
  const L = C.longitudes(NACIMIENTO);
  const { ASC, MC } = C.angulos(NACIMIENTO, OBS);
  const puntos = [...Object.values(L), ASC, MC];
  const cambian = puntos.filter((l) => Math.floor(C.norm(l) / 30) !== Math.floor(C.norm(l - ay) / 30)).length;
  assert.equal(cambian, 9);
});

test('5 — la tabla de casas: seis sistemas, y 9 de 11 cuerpos cambian de casa según cuál', () => {
  const esperado = {
    Sun: [5, 5, 5, 5, 5, 4], Moon: [1, 12, 12, 12, 12, 12], Mercury: [5, 4, 4, 4, 4, 4],
    Venus: [4, 3, 3, 3, 3, 3], Mars: [11, 11, 11, 10, 10, 10], Jupiter: [3, 2, 2, 2, 2, 3],
    Saturn: [6, 5, 5, 5, 5, 5], Uranus: [4, 4, 4, 4, 4, 4], Neptune: [4, 4, 4, 4, 4, 4],
    Pluto: [3, 2, 2, 2, 2, 2], Chiron: [12, 12, 12, 12, 12, 11]
  };
  const sistemas = C.cuspides(NACIMIENTO, OBS);
  const orden = ['Signos enteros', 'Iguales', 'Porfirio', 'Placidus', 'Regiomontano', 'Campano'];
  assert.deepEqual(Object.keys(sistemas), orden);
  const L = C.longitudes(NACIMIENTO);
  let discrepan = 0;
  for (const [c, casas] of Object.entries(esperado)) {
    const calc = orden.map((n) => C.casaDe(L[c], sistemas[n]));
    assert.deepEqual(calc, casas, c);
    if (new Set(calc).size > 1) discrepan++;
  }
  assert.equal(discrepan, 9);
});

test('6 — aspectos con orbe 1°: los tres de siempre y el trígono Neptuno-Quirón', () => {
  const asp = C.aspectos(C.longitudes(NACIMIENTO)).map((x) => `${x.a} ${x.aspecto} ${x.b} ${x.orbe.toFixed(3)}`);
  assert.deepEqual(asp, [
    'Moon sextil Jupiter 0.318',
    'Jupiter cuadratura Saturn 0.354',
    'Neptune trígono Chiron 0.673',
    'Sun cuadratura Pluto 0.783'
  ]);
});

test('7 — paralelos con orbe 0,75°: cinco, con la declinación geocéntrica (0035)', () => {
  /* Hasta el 18 de noviembre de 2026 la declinación era topocéntrica y
     salían seis: Luna-Plutón a 0,611° y Luna-Saturno a 0,677°. Desde el
     centro de la Tierra la Luna se mueve 0,6° en declinación: Luna-Plutón
     queda a 0,015° y Luna-Saturno sale del orbe. Los de los planetas
     cambian una milésima. Es justo lo que el debate D quería evitar: que
     un paralelo dependiera del método. */
  const par = C.paralelos(C.declinaciones(NACIMIENTO)).map((x) => `${x.a} ${x.tipo} ${x.b} ${x.orbe.toFixed(3)}`);
  assert.deepEqual(par, [
    'Moon paralelo Pluto 0.015',
    'Venus paralelo Neptune 0.054',
    'Venus paralelo Uranus 0.240',
    'Uranus paralelo Neptune 0.294',
    'Jupiter paralelo Uranus 0.555'
  ]);
});

test('8 — un solo ángulo, cuatro rejillas: 222,717° → llena · Llena 5 de 8 · tithi 19 krishna · karana 38', () => {
  const r = C.rejillasLunaSol(NACIMIENTO);
  assert.equal(r.separacion.toFixed(3), '222.717');
  assert.equal(r.fase_popular, 'llena');
  assert.deepEqual(r.rudhyar, { nombre: 'Llena', indice: 5 });
  assert.deepEqual(r.tithi, { numero: 19, paksha: 'krishna' });
  assert.deepEqual(r.karana, { numero: 38 });
});

test('9 — nakshatra Hasta, 13 de 27, pada 3; jieqi Lichun, el siguiente Yushui', () => {
  assert.deepEqual(C.nakshatra(NACIMIENTO), { nombre: 'Hasta', numero: 13, pada: 3 });
  const j = C.terminoSolar(NACIMIENTO);
  assert.equal(j.termino, 'Lichun');
  assert.equal(j.siguiente, 'Yushui');
});

test('10 — tzolk\'in 1 Kan con 584283; la 584285 lo desplaza exactamente dos días', () => {
  assert.deepEqual(C.tzolkin('1995-02-18'), { numero: 1, nombre: 'Kan', correlacion: 584283 });
  /* Lo que dicen 02, 04 y 05: «desplaza dos días». Se comprueba como
     igualdad con la fecha de dos días antes, no copiando un resultado. */
  const con85 = C.tzolkin('1995-02-18', 584285);
  const dosAntes = C.tzolkin('1995-02-16', 584283);
  assert.equal(con85.numero, dosAntes.numero);
  assert.equal(con85.nombre, dosAntes.nombre);
});

test('11 — los calendarios de cuenta, vía Intl', () => {
  assert.equal(C.fechaEnCalendario(NACIMIENTO, 'islamic-civil', 'Europe/Madrid'), '18 de ramadán de 1415 AH');
  assert.equal(C.fechaEnCalendario(NACIMIENTO, 'persian', 'Europe/Madrid'), '29 de bahman de 1373 AP');
});

test('12 — cumpleaños lunar: el instante exacto, y no depende de desde cuándo se busca', () => {
  const desde12 = C.cumpleanosLunar(NACIMIENTO, Date.UTC(2026, 10, 12));
  const desde20 = C.cumpleanosLunar(NACIMIENTO, Date.UTC(2026, 10, 20));
  /* 27/11/2026 15:56:36 UTC con el ΔT del motor, medido el 12 de
     noviembre con SearchMoonPhase directamente, fuera de este módulo. Con
     el ΔT medido del IERS (0034) el mismo cálculo da 15:56:42,797: 6,3 s
     más tarde, que es justo lo que el motor iba adelantado. Remedido el 18
     de noviembre de las dos maneras. */
  assert.ok(Math.abs(desde12.instante - Date.UTC(2026, 10, 27, 15, 56, 42, 797)) < 1000,
    new Date(desde12.instante).toISOString());
  assert.equal(desde12.instante, desde20.instante,
    'el barrido de 15 minutos daba un minuto distinto según la hora de partida; esto no puede');
  /* Y en ese instante el ángulo es el del nacimiento. */
  const ahora = globalThis.Astronomy.MoonPhase(globalThis.Astronomy.MakeTime(new Date(desde12.instante)));
  assert.ok(Math.abs(ahora - desde12.angulo) < 1e-4);
});

test('13 — Placidus no existe por encima del círculo polar; en Sídney salen los seis', () => {
  const tromso = new globalThis.Astronomy.Observer(69.6492, 18.9553, 0);
  const sidney = new globalThis.Astronomy.Observer(-33.8688, 151.2093, 0);
  /* Barrido de 48 h: Placidus no debe aparecer en ninguna. Regiomontano y
     Campano SÍ aparecen a ratos, y eso es otra cosa: ver pendiente nuevo
     sobre los umbrales 5°/75° del control, que los retira sin ficha. */
  for (let h = 0; h < 48; h++) {
    assert.ok(!('Placidus' in C.cuspides(NACIMIENTO + h * 3600e3, tromso)), `hora ${h}`);
  }
  assert.equal(Object.keys(C.cuspides(NACIMIENTO, sidney)).length, 6);
});

test('14 — carta.js es puro: no lee el reloj del sistema', () => {
  const fuente = readFileSync(new URL('../app/js/carta.js', import.meta.url), 'utf8');
  /* Se quitan los comentarios antes de buscar: hablar del reloj no es leerlo. */
  const codigo = fuente.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.doesNotMatch(codigo, /Date\.now\s*\(/);
  assert.doesNotMatch(codigo, /new Date\(\s*\)/);
});

/* --- añadidas tras la ronda de mutación del 13 de noviembre ---------- */
/* Tres mutantes sobrevivieron a las catorce de arriba, y cada uno señalaba
   un hueco real: (a) calcular la Luna por el vector geocéntrico en vez de
   por EclipticGeoMoon no cambiaba nada a la precisión de un minuto; (b)
   intercambiar dos cuadrantes de Porfirio no movía a ningún cuerpo de
   casa; (c) la carta de referencia no tiene ningún contraparalelo. Los
   números de estas tres salen del script ORIGINAL de herramientas/ (sin
   tocar, antes del traslado), con una línea añadida en una copia aparte
   que imprimía las cúspides y la Luna a cuatro decimales. */

test('15 — la Luna a cuatro decimales: 192,4878°', () => {
  assert.ok(Math.abs(C.longitudTropical('Moon', NACIMIENTO) - 192.48782) < 1e-4);
});

test('16 — las cúspides de los seis sistemas, a cuatro decimales', () => {
  const esperado = {
    'Signos enteros': [180, 210, 240, 270, 300, 330, 0, 30, 60, 90, 120, 150],
    'Iguales': [197.9297, 227.9297, 257.9297, 287.9297, 317.9297, 347.9297, 17.9297, 47.9297, 77.9297, 107.9297, 137.9297, 167.9297],
    'Porfirio': [197.9297, 228.8172, 259.7048, 290.5923, 319.7048, 348.8172, 17.9297, 48.8172, 79.7048, 110.5923, 139.7048, 168.8172],
    'Placidus': [197.9297, 225.4931, 256.7821, 290.5923, 323.7192, 353.1754, 17.9297, 45.4931, 76.7821, 110.5923, 143.7192, 173.1754],
    'Regiomontano': [197.9297, 223.26, 253.981, 290.5923, 325.3896, 353.5409, 17.9297, 43.26, 73.981, 110.5923, 145.3896, 173.5409],
    'Campano': [197.9297, 218.034, 246.5928, 290.5923, 332.136, 358.4367, 17.9297, 38.034, 66.5928, 110.5923, 152.136, 178.4367]
  };
  const sistemas = C.cuspides(NACIMIENTO, OBS);
  for (const [n, cusp] of Object.entries(esperado)) {
    cusp.forEach((v, i) => assert.ok(Math.abs(sistemas[n][i] - v) < 1e-3, `${n}, cúspide ${i + 1}: ${sistemas[n][i]} ≠ ${v}`));
  }
});

test('17 — paralelos y contraparalelos con declinaciones puestas a mano', () => {
  /* Todos los cuerpos lejos entre sí salvo dos pares: Sol y Luna en
     declinaciones opuestas (contraparalelo de 0,5°) y Venus y Marte en la
     misma (paralelo de 0,2°). El borde: un par a 0,75° exactos no entra,
     porque el criterio es estricto (<) desde hoja-de-cielo.mjs. */
  const D = { Sun: 10, Moon: -10.5, Mercury: 30, Venus: 3, Mars: 3.2, Jupiter: -25, Saturn: 40, Uranus: 50, Neptune: -50.75, Pluto: 60 };
  const par = C.paralelos(D).map((x) => `${x.a} ${x.tipo} ${x.b} ${x.orbe.toFixed(2)}`);
  assert.deepEqual(par, ['Venus paralelo Mars 0.20', 'Sun contraparalelo Moon 0.50']);
});

/* --- Quirón: el rango (decisión 0031) --------------------------------- */

test('18 — fuera de su rango (1900-01-01 a 2099-12-03) Quirón no existe: ni en las longitudes, ni en los aspectos, ni en las casas', () => {
  for (const ms of [Date.UTC(1899, 11, 30), Date.UTC(2099, 11, 6)]) {
    assert.equal(C.longitudTropical('Chiron', ms), null);
    assert.ok(!('Chiron' in C.longitudes(ms)));
    const carta = C.cartaEnInstante(ms, OBS);
    assert.ok(!('Chiron' in carta.cuerpos));
    assert.ok(carta.aspectos.every((x) => x.a !== 'Chiron' && x.b !== 'Chiron'));
    for (const sis of Object.values(carta.casas)) assert.ok(!('Chiron' in sis.de));
  }
  /* Y dentro, sí: los dos bordes del rango. */
  assert.equal(typeof C.longitudTropical('Chiron', Date.UTC(1900, 0, 2)), 'number');
  assert.equal(typeof C.longitudTropical('Chiron', Date.UTC(2099, 11, 1)), 'number');
});
