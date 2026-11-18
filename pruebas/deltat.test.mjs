/* deltat.test.mjs — el ΔT que usa el motor es el medido del IERS.
 * Decisión 0034, 18 de noviembre de 2026.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const A = globalThis.Astronomy = require('../app/js/vendor/astronomy.browser.min.js');
const D = await import('../app/js/deltat.js');
const { leerDeltatData, escribirModulo } = await import('../herramientas/actualizar-deltat.mjs');

const raiz = fileURLToPath(new URL('..', import.meta.url));
const crudo = fs.readFileSync(new URL('./datos/iers-deltat.data', import.meta.url), 'utf8');
const filas = leerDeltatData(crudo);
const ut = (ms) => (ms - Date.UTC(2000, 0, 1, 12)) / 86400e3;
const dtDelMotor = (ms) => { const t = A.MakeTime(new Date(ms)); return (t.tt - t.ut) * 86400; };

test('1 — deltat.js es exactamente lo que genera el fichero del IERS', () => {
  const fecha = D.DELTAT_FUENTE.match(/Descargado el (.+)\.$/)[1];
  const generado = escribirModulo(filas, fecha);
  assert.equal(fs.readFileSync(new URL('../app/js/deltat.js', import.meta.url), 'utf8'), generado,
    'deltat.js no coincide con pruebas/datos/iers-deltat.data: node herramientas/actualizar-deltat.mjs');
  assert.equal(D.DELTAT_MENSUAL.length, filas.length);
  assert.deepEqual(D.DELTAT_INICIO, { anio: filas[0].anio, mes: filas[0].mes });
});

test('2 — el motor usa la tabla: en cada mes medido, el valor del IERS', () => {
  for (const f of filas) {
    const v = dtDelMotor(Date.UTC(f.anio, f.mes - 1, 1));
    assert.ok(Math.abs(v - f.valor) < 1e-6, `${f.anio}-${f.mes}: ${v} frente a ${f.valor}`);
  }
});

test('3 — entre dos meses, en línea recta', () => {
  const [a, b] = [filas[600], filas[601]];
  const ma = Date.UTC(a.anio, a.mes - 1, 1), mb = Date.UTC(b.anio, b.mes - 1, 1);
  const v = D.deltaT(ut((ma + mb) / 2));
  assert.ok(Math.abs(v - (a.valor + b.valor) / 2) < 1e-9);
});

test('4 — sin saltos en los empalmes: antes de 1973 y después del último mes', () => {
  const u0 = ut(Date.UTC(filas[0].anio, filas[0].mes - 1, 1));
  const uN = ut(Date.UTC(filas.at(-1).anio, filas.at(-1).mes - 1, 1));
  const eps = 1e-6;
  for (const u of [u0, uN, u0 - 365]) {
    assert.ok(Math.abs(D.deltaT(u - eps) - D.deltaT(u + eps)) < 1e-4, `salto en ut ${u}`);
  }
  /* Antes de la rampa, el modelo del motor sin tocar. */
  assert.equal(D.deltaT(u0 - 400), A.DeltaT_EspenakMeeus(u0 - 400));
});

test('5 — contra dos medidas que no salen de esta tabla', () => {
  /* 15 nov 2026: UT1−UTC = −69,552 ms (IERS, serie C04) → ΔT = 69,254 s.
     Cae después del último mes: aquí se prueba la predicción empalmada. */
  assert.ok(Math.abs(dtDelMotor(Date.UTC(2026, 10, 15)) - 69.254) < 0.05);
  /* 1 ene 1972: 42,23 s (tabla de escalas de tiempo de P. Schlyter). Cae
     antes de la tabla: aquí se prueba el modelo del motor. */
  assert.ok(Math.abs(dtDelMotor(Date.UTC(1972, 0, 1)) - 42.23) < 0.05);
});

test('6 — basta importar cualquier módulo que calcula para que el ΔT sea el medido', () => {
  for (const m of ['luna.js', 'carta.js', 'quiron.js', 'calendario.js']) {
    const salida = execFileSync(process.execPath, ['--input-type=module', '-e', `
      import { createRequire } from 'node:module';
      const A = globalThis.Astronomy = createRequire(import.meta.url)('./app/js/vendor/astronomy.browser.min.js');
      await import('./app/js/${m}');
      const t = A.MakeTime(new Date(Date.UTC(2026, 9, 1)));
      console.log((t.tt - t.ut) * 86400);`], { cwd: raiz, encoding: 'utf8' });
    assert.ok(Math.abs(Number(salida) - 69.2065) < 1e-6, `${m}: ${salida.trim()}`);
  }
});
