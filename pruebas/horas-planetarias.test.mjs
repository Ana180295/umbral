/* horas-planetarias.test.mjs — decisión 0036, 18 de noviembre de 2026.
 * Fuente del orden y de la regla: Dion Casio, Historia romana XXXVII 19.
 * Decisión de Ana: el día va de la salida a la puesta del Sol, la noche de
 * la puesta a la salida, y cada uno se parte en doce.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const A = globalThis.Astronomy = createRequire(import.meta.url)('../app/js/vendor/astronomy.browser.min.js');
const C = await import('../app/js/carta.js');
const ALBACETE = new A.Observer(39.005556, -1.862222, 674);

test('1 — el regente del día es el del día de la semana: una semana entera de 2026', () => {
  /* 16 de noviembre de 2026 es lunes. A mediodía de cada día. */
  const esperados = ['Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Sun'];
  esperados.forEach((r, i) => {
    const hp = C.horasPlanetarias(Date.UTC(2026, 10, 16 + i, 12), ALBACETE);
    assert.equal(hp.regente_del_dia, r, `día ${16 + i}`);
    assert.equal(hp.horas[0].regente, r, 'la primera hora es la del regente del día');
  });
});

test('2 — Dion Casio: siguiendo las 24 horas, la primera del día siguiente es la del día siguiente', () => {
  /* No se comprueba la cuenta contra sí misma: se calcula cada día por
     separado, con su salida del Sol, y se mira que la hora 25 del primero
     —la que vendría después de la 24— sea la primera del segundo. */
  const SITIOS = [ALBACETE, new A.Observer(-34.6037, -58.3816, 25), new A.Observer(-36.8485, 174.7633, 0)];
  for (const obs of SITIOS) for (let i = 0; i < 60; i++) {
    /* A distintas horas del día, para que la búsqueda arranque desde sitios distintos. */
    const hoy = C.horasPlanetarias(Date.UTC(2026, 10, 16 + i, (i * 7) % 24), obs);
    const manana = C.horasPlanetarias(hoy.siguiente_salida + 3600e3 * (1 + (i % 9)), obs);
    const hora25 = C.ORDEN_CALDEO[(C.ORDEN_CALDEO.indexOf(hoy.horas[23].regente) + 1) % 7];
    assert.equal(hora25, manana.horas[0].regente);
    assert.equal(hoy.siguiente_salida, manana.salida, 'el día termina exactamente donde empieza el siguiente');
  }
});

test('3 — entre la medianoche y la salida del Sol sigue siendo el día anterior (fallo 3 del 45)', () => {
  /* Miércoles 18 de noviembre de 2026, 03:00 en Albacete: el Sol sale a
     las 07:53. Es noche del martes, día de Marte, no de Mercurio. */
  const hp = C.horasPlanetarias(Date.UTC(2026, 10, 18, 2), ALBACETE);
  assert.equal(hp.regente_del_dia, 'Mars');
  assert.equal(hp.horas[hp.actual].de, 'noche');
});

test('4 — horas desiguales: el día y la noche se parten en doce cada uno, sin huecos', () => {
  for (const [ms, diaMasLarga] of [[Date.UTC(2026, 5, 21, 12), true], [Date.UTC(2026, 11, 21, 12), false]]) {
    const hp = C.horasPlanetarias(ms, ALBACETE);
    assert.equal(hp.horas[0].desde, hp.salida);
    assert.equal(hp.horas[11].hasta, hp.puesta);
    assert.equal(hp.horas[12].desde, hp.puesta);
    assert.equal(hp.horas[23].hasta, hp.siguiente_salida);
    for (let k = 1; k < 24; k++) assert.equal(hp.horas[k].desde, hp.horas[k - 1].hasta);
    assert.equal(hp.duracion_hora_dia_min > 60, diaMasLarga);
    assert.equal(hp.duracion_hora_noche_min > 60, !diaMasLarga);
    assert.ok(hp.horas.slice(0, 12).every((h) => h.de === 'dia') && hp.horas.slice(12).every((h) => h.de === 'noche'));
  }
});

test('5 — el día de la semana es el del sitio, no el de UTC', () => {
  /* Auckland: la salida del Sol del miércoles 18 de noviembre de 2026 cae
     el martes 17 en UTC. El día tiene que ser miércoles, de Mercurio. */
  const auckland = new A.Observer(-36.8485, 174.7633, 0);
  const hp = C.horasPlanetarias(Date.UTC(2026, 10, 18, 0), auckland);
  assert.equal(new Date(hp.salida).getUTCDate(), 17, 'la salida cae el 17 en UTC');
  assert.equal(hp.regente_del_dia, 'Mercury');
});

test('6 — noche polar: no hay horas, y no se inventan', () => {
  const tromso = new A.Observer(69.6492, 18.9553, 0);
  assert.equal(C.horasPlanetarias(Date.UTC(2026, 11, 20, 12), tromso), null);
});
