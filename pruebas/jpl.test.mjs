import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

/* carta.js contra JPL Horizons — 15 de noviembre de 2026.

   LA ÚNICA PRUEBA DEL PROYECTO CONTRA UN MOTOR QUE NO ES EL NUESTRO. Todas
   las demás comparan carta.js consigo mismo o con el script que usaba el
   mismo astronomy-engine. Esta compara con las efemérides de JPL (DE441 y
   las soluciones de Júpiter, Urano y Quirón), descargadas por Ana el 13 de
   noviembre de 2026: longitud eclíptica de la fecha, APARENTE —con tiempo
   de luz, deflexión gravitatoria y aberración—, geocéntrica, cada 300 días
   entre 1900 y 2100. Fichero y procedencia: pruebas/datos/
   jpl-horizons-aparente.json. Método y cifras: 03-registro-de-datos.md,
   sección «Cotejo contra JPL Horizons».

   LOS UMBRALES no son tolerancias generosas: son el error máximo medido el
   13 de noviembre sobre las 2435 fechas de cada cuerpo, más un margen
   pequeño. Si alguien cambia el motor, una corrección o una fórmula y algún
   cuerpo se aleja de JPL más de lo que ya se aleja hoy, esto se pone rojo.
   Si se ACERCA, hay que bajar el umbral, no celebrarlo en silencio.

   EL CORTE DEL 12 DE NOVIEMBRE DE 2026. Hasta ese día Horizons convierte la
   hora civil en tiempo dinámico con datos medidos de la rotación de la
   Tierra; después, con una predicción, y astronomy-engine con otra. En los
   cuerpos lentos no se nota; en la Luna, que recorre medio segundo de arco
   por segundo de reloj, dos predicciones de ΔT que se separan dos minutos en
   2099 dan 85″ de diferencia sin que ninguna posición esté mal. Por eso la
   Luna solo se exige hasta el corte. */

const require = createRequire(import.meta.url);
globalThis.Astronomy = require('../app/js/vendor/astronomy.browser.min.js');
const C = await import('../app/js/carta.js');
const JPL = JSON.parse(readFileSync(new URL('./datos/jpl-horizons-aparente.json', import.meta.url), 'utf8'));

const CORTE = Date.UTC(2026, 10, 12);
const segundosDeArco = (a, b) => { let d = Math.abs(a - b) % 360; if (d > 180) d = 360 - d; return d * 3600; };

/* Quirón solo existe dentro de su rango, que se mide en TDB. La primera
   fecha de JPL, 1900-01-01 00:00 UT, cae 2,7 s ANTES del primer vector:
   en 1900 el tiempo dinámico iba por detrás de la hora civil (ΔT negativo).
   Esa fila se salta, y solo esa: si se saltaran más, la prueba lo dice. */
const { QUIRON_DESDE_JD, QUIRON_HASTA_JD } = await import('../app/js/quiron.js');
const dentroDeQuiron = (ms) => {
  const jd = globalThis.Astronomy.MakeTime(new Date(ms)).tt + 2451545;
  return jd >= QUIRON_DESDE_JD && jd <= QUIRON_HASTA_JD;
};

function errorMaximo(cuerpo, filtro) {
  let max = 0, cuando = null, n = 0, saltadas = 0;
  for (const [ms, lon] of JPL.cuerpos[cuerpo]) {
    if (!filtro(ms)) continue;
    if (cuerpo === 'Chiron' && !dentroDeQuiron(ms)) { saltadas++; continue; }
    const l = C.longitudTropical(cuerpo, ms);
    assert.notEqual(l, null, `${cuerpo} sin valor el ${new Date(ms).toISOString()}`);
    const e = segundosDeArco(l, lon);
    n++;
    if (e > max) { max = e; cuando = ms; }
  }
  assert.ok(saltadas <= 1, `${cuerpo}: ${saltadas} fechas fuera de rango, se esperaba como mucho la de 1900-01-01`);
  return { max, cuando: new Date(cuando).toISOString().slice(0, 10), n };
}

/* Medido el 13 de noviembre sobre 2435 fechas por cuerpo, hasta el corte:
   Sol 2,1″ · Luna 4,8″ · Júpiter 10,0″ · Urano 12,0″ · Quirón 1,21″. */
const HASTA_EL_CORTE = { Sun: 3, Moon: 6, Jupiter: 12, Uranus: 15, Chiron: 1.5 };

for (const [cuerpo, umbral] of Object.entries(HASTA_EL_CORTE)) {
  test(`${cuerpo} — 1900 a noviembre de 2026: a menos de ${umbral}″ de JPL`, () => {
    const r = errorMaximo(cuerpo, (ms) => ms <= CORTE);
    assert.ok(r.n > 150, `solo ${r.n} fechas`);
    assert.ok(r.max < umbral, `${cuerpo}: ${r.max.toFixed(2)}″ el ${r.cuando} (umbral ${umbral}″)`);
  });
}

/* Después del corte, solo los cuerpos en los que la predicción de ΔT no
   pesa: medido el 13 de noviembre, Sol 7,1″ · Júpiter 10,0″ · Urano 7,4″ ·
   Quirón 1,21″ (Quirón ya contado arriba en el rango entero). */
const DESPUES_DEL_CORTE = { Sun: 9, Jupiter: 12, Uranus: 15, Chiron: 1.5 };

for (const [cuerpo, umbral] of Object.entries(DESPUES_DEL_CORTE)) {
  test(`${cuerpo} — noviembre de 2026 a 2099: a menos de ${umbral}″ de JPL`, () => {
    const r = errorMaximo(cuerpo, (ms) => ms > CORTE);
    assert.ok(r.max < umbral, `${cuerpo}: ${r.max.toFixed(2)}″ el ${r.cuando} (umbral ${umbral}″)`);
  });
}

/* El ΔT medido del IERS (0034), donde se nota. De 2010 al corte, con el ΔT
   del motor la Luna quedaba a 3,41″ de JPL; con el medido, a 1,84″ (y de
   2020 al corte, de 3,41″ a 0,81″). Medido el 18 de noviembre sobre las
   21 fechas de ese tramo. */
test('Moon — 2010 al corte, con el ΔT medido: a menos de 2,5″ de JPL', () => {
  const r = errorMaximo('Moon', (ms) => ms <= CORTE && ms >= Date.UTC(2010, 0, 1));
  assert.ok(r.n >= 20, `solo ${r.n} fechas`);
  assert.ok(r.max < 2.5, `Moon: ${r.max.toFixed(2)}″ el ${r.cuando}`);
});

test('la Luna después del corte: la diferencia es de reloj, no de posición', () => {
  /* Se comprueba que lo que separa las dos Lunas en 2090-2099 es un
     desfase de TIEMPO: corriendo nuestra Luna los segundos de reloj que
     hagan falta, cae sobre la de JPL. Si en cambio fuera un error de
     posición, ningún desfase de tiempo la arreglaría. */
  const filas = JPL.cuerpos.Moon.filter(([ms]) => new Date(ms).getUTCFullYear() >= 2090);
  assert.ok(filas.length > 5);
  for (const [ms, lon] of filas) {
    const l = C.longitudTropical('Moon', ms);
    const vel = (C.longitudTropical('Moon', ms + 60e3) - l + 360) % 360 / 60;          // grados por segundo
    const desfase = ((((lon - l) % 360) + 540) % 360 - 180) / vel;                     // segundos de reloj
    const corregida = C.longitudTropical('Moon', ms + desfase * 1000);
    assert.ok(segundosDeArco(corregida, lon) < 6, `${new Date(ms).toISOString().slice(0, 10)}: tras correr ${desfase.toFixed(0)} s queda a ${segundosDeArco(corregida, lon).toFixed(1)}″`);
    assert.ok(Math.abs(desfase) < 200, `desfase de ${desfase.toFixed(0)} s: más de lo que separan las dos predicciones de ΔT`);
  }
});
