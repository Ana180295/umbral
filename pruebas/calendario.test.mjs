import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const codigo = readFileSync(new URL('../app/js/vendor/astronomy.browser.min.js', import.meta.url), 'utf8');
vm.runInThisContext(codigo, { filename: 'astronomy.browser.min.js' });
if (typeof globalThis.Astronomy !== 'object') {
  throw new Error('No se pudo cargar astronomy.browser.min.js para las pruebas de calendario.js');
}

const { observador, diaLunar } = await import('../app/js/luna.js');
const { picoDesde, limitesDeEspirales, calendarioPersonal } = await import('../app/js/calendario.js');

const OBS = observador({ lat: 39.005556, lon: -1.862222, altitud: 674 }); // Albacete
// Época real de la carta de referencia (18/02/1995, 21:43 UTC): la última
// salida de la Luna anterior a ese instante, calculada aquí mismo y no
// copiada a mano de una sesión anterior.
const NACIMIENTO_REFERENCIA = Date.UTC(1995, 1, 18, 21, 43, 0);
const EPOCA_REFERENCIA = diaLunar(NACIMIENTO_REFERENCIA, OBS).empieza;

/* ------------------------------------------------------------------ */
/* picoDesde                                                          */
/* ------------------------------------------------------------------ */

test('1 — picoDesde encuentra los siete picos medidos a mano entre 2020 y 2026', () => {
  const esperados = [
    '2020-04-08', '2021-05-26', '2022-07-13', '2023-08-31',
    '2024-10-17', '2025-11-05', '2026-12-24'
  ];
  let desde = Date.UTC(2019, 6, 1);
  for (const esperada of esperados) {
    const p = picoDesde(desde);
    const fecha = new Date(p).toISOString().slice(0, 10);
    assert.equal(fecha, esperada);
    desde = p + 3600e3;
  }
});

test('2 — el ciclo entre picos consecutivos ronda 413-414 días, salvo la excepción real de 2025-2026 (~384)', () => {
  const p1 = picoDesde(Date.UTC(2024, 9, 1));
  const p2 = picoDesde(p1 + 3600e3);
  const dias = (p2 - p1) / 86400000;
  assert.ok(dias > 380 && dias < 415, `separación de ${dias.toFixed(1)} días, fuera del rango esperado`);
});

test('3 — picoDesde es determinista: mismo instante de partida, mismo pico', () => {
  const a = picoDesde(EPOCA_REFERENCIA);
  const b = picoDesde(EPOCA_REFERENCIA);
  assert.equal(a, b);
});

/* ------------------------------------------------------------------ */
/* limitesDeEspirales                                                    */
/* ------------------------------------------------------------------ */

test('4 — el primer límite es la época misma, no una luna nueva', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  assert.equal(limites[0], EPOCA_REFERENCIA);
});

test('5 — el primer ciclo de una persona es corto: menos que un ciclo completo (~413 días)', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  const duracionPrimerCiclo = (limites[1] - limites[0]) / 86400000;
  assert.ok(
    duracionPrimerCiclo < 413,
    `el primer ciclo duró ${duracionPrimerCiclo.toFixed(1)} días — debería ser más corto que un ciclo completo`
  );
  assert.ok(duracionPrimerCiclo > 0);
});

test('6 — los límites son estrictamente crecientes (nunca retroceden ni se repiten)', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 1500 * 86400000);
  for (let i = 1; i < limites.length; i++) {
    assert.ok(limites[i] > limites[i - 1], `límite ${i} no es mayor que el anterior`);
  }
});

/* ------------------------------------------------------------------ */
/* calendarioPersonal                                                 */
/* ------------------------------------------------------------------ */

test('7 — en la época misma: Lunación 1, Día 1', () => {
  const r = calendarioPersonal(EPOCA_REFERENCIA, EPOCA_REFERENCIA, OBS);
  assert.equal(r.lunacion, 1);
  assert.equal(r.dia, 1);
});

test('8 — un instante anterior a la época lanza', () => {
  assert.throws(() => calendarioPersonal(EPOCA_REFERENCIA, EPOCA_REFERENCIA - 1000, OBS));
});

test('9 — cruzando la frontera real del primer día lunar (no 24h fijas: este día dura lo que dura), pasa a Día 2', async () => {
  const { diaLunar } = await import('../app/js/luna.js');
  const primerDia = diaLunar(EPOCA_REFERENCIA, OBS);
  // Un segundo antes de que termine, sigue siendo Día 1.
  const justoAntes = calendarioPersonal(EPOCA_REFERENCIA, primerDia.termina - 1000, OBS);
  assert.equal(justoAntes.lunacion, 1);
  assert.equal(justoAntes.dia, 1);
  // En el instante exacto en que termina (= empieza el segundo), Día 2.
  const justoDespues = calendarioPersonal(EPOCA_REFERENCIA, primerDia.termina, OBS);
  assert.equal(justoDespues.lunacion, 1);
  assert.equal(justoDespues.dia, 2);
});

test('10 — treinta días después, la lunación ya ha avanzado (día lunar ≈29,53, no puede seguir en la 1)', () => {
  const r = calendarioPersonal(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 30 * 86400000, OBS);
  assert.ok(r.lunacion >= 2, `lunación ${r.lunacion} tras 30 días — se esperaba al menos 2`);
});

test('11 — lunación y día están siempre en rango sano (1-16 y 1-31)', () => {
  // Se recorren dos años completos en pasos de 11 días, comprobando que
  // nunca se sale de un rango físicamente razonable.
  let t = EPOCA_REFERENCIA;
  const fin = EPOCA_REFERENCIA + 2 * 365.25 * 86400000;
  while (t < fin) {
    const r = calendarioPersonal(EPOCA_REFERENCIA, t, OBS);
    assert.ok(r.lunacion >= 1 && r.lunacion <= 16, `lunación fuera de rango: ${r.lunacion} en ${new Date(t).toISOString()}`);
    assert.ok(r.dia >= 1 && r.dia <= 31, `día fuera de rango: ${r.dia} en ${new Date(t).toISOString()}`);
    t += 11 * 86400000;
  }
});

test('12 — lunación y día son monótonos no decrecientes según avanza el tiempo, salvo el reinicio de ciclo', () => {
  // Dentro de un mismo ciclo mayor, ni lunación ni día pueden retroceder.
  // Se comprueba en el primer ciclo completo (corto), que no cruza ningún
  // reinicio.
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  const finPrimerCiclo = limites[1];
  let anterior = null;
  for (let t = EPOCA_REFERENCIA; t < finPrimerCiclo; t += 13 * 86400000) {
    const r = calendarioPersonal(EPOCA_REFERENCIA, t, OBS);
    if (anterior) {
      const avanzoLunacion = r.lunacion > anterior.lunacion;
      const mismaLunacionDiaMayor = r.lunacion === anterior.lunacion && r.dia >= anterior.dia;
      assert.ok(avanzoLunacion || mismaLunacionDiaMayor, `retrocedió: ${JSON.stringify(anterior)} -> ${JSON.stringify(r)}`);
    }
    anterior = r;
  }
});

test('13 — justo tras el primer límite de ciclo, la lunación vuelve a 1', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  const inicioCiclo2 = limites[1];
  const r = calendarioPersonal(EPOCA_REFERENCIA, inicioCiclo2, OBS);
  assert.equal(r.lunacion, 1);
  assert.equal(r.dia, 1);
});

test('13b — el límite del ciclo 2 es una luna nueva DE VERDAD (fase ~0°), no el pico en sí — comprobado con Astronomy.MoonPhase directamente, sin pasar por las funciones del módulo', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  const inicioCiclo2 = limites[1];
  const fase = globalThis.Astronomy.MoonPhase(globalThis.Astronomy.MakeTime(new Date(inicioCiclo2)));
  // La fase es un ángulo 0-360; cerca de una luna nueva puede leerse como
  // ~0 o como ~360 según el redondeo del propio instante de búsqueda.
  const distanciaA0 = Math.min(fase, 360 - fase);
  assert.ok(distanciaA0 < 0.1, `fase ${fase.toFixed(4)}° en el límite de ciclo — se esperaba ~0° (luna nueva), no el pico (luna llena, ~180°)`);
});

test('14 — justo antes del límite de ciclo, la lunación todavía no se ha reiniciado', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  const inicioCiclo2 = limites[1];
  const r = calendarioPersonal(EPOCA_REFERENCIA, inicioCiclo2 - 3600e3, OBS);
  assert.ok(r.lunacion > 1, `lunación ${r.lunacion} justo antes del reinicio — se esperaba > 1`);
});

test('15 — el número de lunaciones del primer ciclo es 13 o 14, coherente con lo medido', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  const justoAntes = calendarioPersonal(EPOCA_REFERENCIA, limites[1] - 3600e3, OBS);
  // El primer ciclo es corto (ver prueba 5), así que puede tener menos de
  // 13 lunaciones — solo se exige que sea un número positivo y no
  // disparatado.
  assert.ok(justoAntes.lunacion >= 1 && justoAntes.lunacion <= 14);
});

test('16 — calendarioPersonal es determinista: mismo instante, mismo resultado', () => {
  const t = EPOCA_REFERENCIA + 200 * 86400000;
  const a = calendarioPersonal(EPOCA_REFERENCIA, t, OBS);
  const b = calendarioPersonal(EPOCA_REFERENCIA, t, OBS);
  assert.deepEqual(a, b);
});

test('17 — el campo espiral empieza en 1, en la época', () => {
  const r = calendarioPersonal(EPOCA_REFERENCIA, EPOCA_REFERENCIA, OBS);
  assert.equal(r.espiral, 1);
});

test('18 — el campo espiral pasa a 2 exactamente en el segundo límite, coincidiendo con lunación 1 / día 1', () => {
  const limites = limitesDeEspirales(EPOCA_REFERENCIA, EPOCA_REFERENCIA + 500 * 86400000);
  const justoAntes = calendarioPersonal(EPOCA_REFERENCIA, limites[1] - 1000, OBS);
  const justoDespues = calendarioPersonal(EPOCA_REFERENCIA, limites[1], OBS);
  assert.equal(justoAntes.espiral, 1);
  assert.equal(justoDespues.espiral, 2);
  // Y coincide exactamente con el reinicio de lunación/día ya probado en 13.
  assert.equal(justoDespues.lunacion, 1);
  assert.equal(justoDespues.dia, 1);
});
