/* tu-cielo.test.mjs — decisión 0038, 19 de noviembre de 2026.
 * La pantalla «Tu cielo»: lo que enseña, en texto, sacado de la carta.
 * Persona inventada de herramientas/datos-prueba.json (nada real en el repositorio).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

globalThis.Astronomy = createRequire(import.meta.url)('../app/js/vendor/astronomy.browser.min.js');
const T = await import('../app/js/cielo.js');
const C = await import('../app/js/carta.js');
const P = await import('../app/js/perfil.js');

const d = JSON.parse(readFileSync(new URL('../herramientas/datos-prueba.json', import.meta.url), 'utf8'));
const nac = (precision_hora, hora) => P.construirPerfilNacimiento({
  fecha: d.fecha, hora, precision_hora, zona: d.zona, lat: d.lat, lon: d.lon, altitud: d.altitud, localidad: d.lugar
});
const AHORA = Date.parse(d.desde);

test('1 — hora exacta: cuerpos, ángulos y Luna, con los valores de la carta de prueba', () => {
  const t = T.tuCielo(nac('exacta', d.hora), AHORA);
  assert.equal(t.estado, 'exacta');
  assert.equal(t.cuerpos.length, 11, 'del Sol a Quirón');
  const sol = t.cuerpos.find((c) => c.id === 'Sun');
  assert.equal(sol.nombre, 'Sol');
  assert.equal(sol.tropical, '17°13′ Cáncer');
  assert.equal(sol.sidereo, '23°22′ Géminis');
  assert.equal(sol.retrogrado, false);
  assert.equal(t.cuerpos.find((c) => c.id === 'Mars').retrogrado, true);
  assert.equal(t.ascendente, '21°20′ Géminis');
  assert.equal(t.medio_cielo, '8°25′ Aries');
  assert.equal(t.nakshatra, 'Shravishtha, pada 4');
  assert.equal(t.tithi, '19 de 30 (krishna)');
  assert.equal(t.fase, 'Llena');
  assert.deepEqual(t.aspectos[0], { a: 'Urano', b: 'Quirón', tipo: 'sextil', orbe: '0,2°' });
  assert.deepEqual(t.paralelos.map((p) => p.tipo), ['paralelo', 'contraparalelo']);
});

test('2 — las casas: seis sistemas, Placidus por defecto, y cada casa sale de su sistema', () => {
  const t = T.tuCielo(nac('exacta', d.hora), AHORA);
  assert.deepEqual(t.sistemas, T.ORDEN_SISTEMAS);
  assert.equal(t.sistema_por_defecto, 'Placidus');
  for (const s of t.sistemas) assert.equal(t.cuspides[s].length, 12, s);
  assert.equal(t.cuspides.Placidus[0], t.ascendente, 'en Placidus la casa 1 empieza en el Ascendente');
  assert.equal(t.cuspides['Signos enteros'][0], '0°00′ Géminis');
  const sol = t.cuerpos.find((c) => c.id === 'Sun');
  assert.equal(sol.casa.Placidus, 1);
  assert.equal(sol.casa['Signos enteros'], 2, 'el ejemplo de los bocetos: cambia según el sistema');
  /* Contra la carta, sin pasar por el texto. */
  const k = P.cartaDelPerfil(nac('exacta', d.hora)).carta;
  for (const c of t.cuerpos) for (const s of t.sistemas) assert.equal(c.casa[s], k.casas[s].de[c.id], `${c.id} ${s}`);
});

test('3 — los minutos se truncan y el signo sale del grado entero', () => {
  assert.equal(T.posicion(0), '0°00′ Aries');
  assert.equal(T.posicion(30), '0°00′ Tauro');
  assert.equal(T.posicion(29.99999), '29°59′ Aries', 'nunca 30°00′ Aries');
  assert.equal(T.posicion(359.9999), '29°59′ Piscis');
  assert.equal(T.posicion(-0.5), '29°30′ Piscis');
  assert.equal(T.posicion(725.25), '5°15′ Aries');
});

test('3b — los rangos de una franja: sin repetir el signo, y en orden de tiempo', () => {
  assert.equal(T.rango(107.2, 107.34), 'entre 17°12′ y 17°20′ Cáncer');
  assert.equal(T.rango(89.9, 90.2), 'entre 29°54′ Géminis y 0°12′ Cáncer');
  assert.equal(T.rango(255.88, 255.87), '15°52′ Sagitario', 'el mismo minuto: un solo valor');
  assert.equal(T.rango(255.9, 255.86), 'entre 15°54′ y 15°51′ Sagitario', 'retrógrado: el segundo es menor');
});

test('4 — con franja: los dos extremos, sin Ascendente, sin Medio Cielo y sin casas (0030)', () => {
  const t = T.tuCielo(nac('franja', '06:00'), AHORA);
  assert.equal(t.estado, 'franja');
  for (const k of ['ascendente', 'medio_cielo', 'cuspides', 'sistemas']) assert.equal(k in t, false, k);
  assert.ok(t.motivo_sin_angulos);
  const luna = t.cuerpos.find((c) => c.id === 'Moon');
  assert.match(luna.tropical, /^entre .+ y .+$/, 'en 3 h la Luna se mueve más de un minuto');
  for (const c of t.cuerpos) assert.equal('casa' in c, false);
  assert.ok(t.aspectos.every((a) => typeof a.seguro === 'boolean'));
  const [c0, c1] = t.cumpleanos_lunar;
  assert.ok(c0 <= c1 && c1 - c0 < 12 * 3600e3, 'los dos cumpleaños, el mismo mes y a unas horas');
});

test('5 — sin hora no hay carta: no se supone ninguna', () => {
  assert.deepEqual(T.tuCielo(nac('desconocida', null), AHORA), { estado: 'sin_dato' });
});

test('6 — el cumpleaños lunar es el siguiente desde «ahora», el mismo que da carta.js', () => {
  const n = nac('exacta', d.hora);
  const t = T.tuCielo(n, AHORA);
  assert.equal(t.cumpleanos_lunar, C.cumpleanosLunar(t.instante, AHORA).instante);
  assert.ok(t.cumpleanos_lunar > AHORA && t.cumpleanos_lunar - AHORA < 30 * 86400e3);
});

test('7 — con franja, el cumpleaños no salta de lunación aunque «ahora» caiga entre los dos', () => {
  const t0 = T.tuCielo(nac('franja', '06:00'), AHORA);
  const medio = (t0.cumpleanos_lunar[0] + t0.cumpleanos_lunar[1]) / 2;
  const t = T.tuCielo(nac('franja', '06:00'), medio);
  assert.ok(t.cumpleanos_lunar[1] - t.cumpleanos_lunar[0] < 12 * 3600e3);
});
