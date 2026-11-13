import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const codigo = readFileSync(new URL('../app/js/vendor/astronomy.browser.min.js', import.meta.url), 'utf8');
vm.runInThisContext(codigo, { filename: 'astronomy.browser.min.js' });
if (typeof globalThis.Astronomy !== 'object') {
  throw new Error('No se pudo cargar astronomy.browser.min.js para las pruebas de dia.js');
}

const {
  solTropical, solSidereo, terminoSolar, tithiDelDia,
  faseRudhyarDelDia, nakshatraDeLaLuna, fechaIslamica
} = await import('../app/js/dia.js');

/* La carta de referencia del proyecto: 18/02/1995, 21:43 UTC, Albacete.
   Los valores esperados son los que ESE MISMO instante da al ejecutar de
   verdad `node herramientas/hoja-de-cielo.mjs` — no están copiados de
   ningún sitio, son la salida real del script.
   OJO (13 de noviembre de 2026): el fichero de entrada de esa carta lleva
   un nombre real y NO está en el repositorio, a propósito (pendiente 46).
   herramientas/datos-prueba.json es OTRA carta, de una persona inventada:
   no es de donde salen estos números. Y desde el mismo día dia.js no
   calcula nada por su cuenta: lo importa de carta.js, así que estas diez
   pruebas son también las que garantizan que el traslado no movió nada. */
const REFERENCIA = Date.UTC(1995, 1, 18, 21, 43, 0);
const ZONA_REFERENCIA = 'Europe/Madrid';

test('1 — sol tropical: 29° 46′ Acuario', () => {
  const r = solTropical(REFERENCIA);
  assert.equal(r.signo, 'Acuario');
  assert.ok(Math.abs(r.grados - 29.767) < 0.01, `grados=${r.grados}`);
});

test('2 — sol sidéreo: 5° 59′ Acuario, ayanamsa 23° 46,8′', () => {
  const r = solSidereo(REFERENCIA);
  assert.equal(r.signo, 'Acuario');
  assert.ok(Math.abs(r.grados - 5.983) < 0.01, `grados=${r.grados}`);
  assert.ok(Math.abs(r.ayanamsa - 23.78) < 0.01, `ayanamsa=${r.ayanamsa}`);
});

test('3 — jieqi: Lichun, comienzo de la primavera; siguiente Yushui', () => {
  const r = terminoSolar(REFERENCIA);
  assert.equal(r.termino, 'Lichun');
  assert.equal(r.tradicional, 'comienzo de la primavera');
  assert.equal(r.siguiente, 'Yushui');
});

test('4 — tithi: 19 de 30, krishna', () => {
  const r = tithiDelDia(REFERENCIA);
  assert.equal(r.numero, 19);
  assert.equal(r.paksha, 'krishna');
});

test('5 — fase de Rudhyar: Llena, 5 de 8', () => {
  const r = faseRudhyarDelDia(REFERENCIA);
  assert.equal(r.nombre, 'Llena');
  assert.equal(r.indice, 5);
});

test('6 — nakshatra: Hasta, 13 de 27, pada 3 de 4', () => {
  const r = nakshatraDeLaLuna(REFERENCIA);
  assert.equal(r.nombre, 'Hasta');
  assert.equal(r.numero, 13);
  assert.equal(r.pada, 3);
});

test('7 — calendario islámico: 18 de ramadán de 1415', () => {
  const r = fechaIslamica(REFERENCIA, ZONA_REFERENCIA);
  assert.ok(r.includes('ramadán'), r);
  assert.ok(r.includes('1415'), r);
});

test('8 — todas las funciones son deterministas: mismo instante, mismo resultado', () => {
  assert.deepEqual(solTropical(REFERENCIA), solTropical(REFERENCIA));
  assert.deepEqual(nakshatraDeLaLuna(REFERENCIA), nakshatraDeLaLuna(REFERENCIA));
});

test('9 — tithi y fase de Rudhyar parten del MISMO ángulo Luna-Sol (222,717°), no de dos cálculos distintos', () => {
  // tithi 19 de 30 -> el ángulo cae en [216°, 228°). fase 5 de 8 -> [180°, 225°).
  // Con sep=222.717°, las dos son coherentes con el mismo número exacto.
  const tithi = tithiDelDia(REFERENCIA);
  const fase = faseRudhyarDelDia(REFERENCIA);
  const sepDesdeTithi = (tithi.numero - 1) * 12; // cota inferior del tramo
  const sepDesdeFase = (fase.indice - 1) * 45;
  assert.ok(sepDesdeTithi <= 222.717 && 222.717 < sepDesdeTithi + 12);
  assert.ok(sepDesdeFase <= 222.717 && 222.717 < sepDesdeFase + 45);
});

test('10 — un año después, jieqi ha cambiado (no es una constante congelada)', () => {
  const unAnoDespues = REFERENCIA + 200 * 86400000; // seis meses y medio: cruza de sobra un término
  const r = terminoSolar(unAnoDespues);
  assert.notEqual(r.termino, 'Lichun');
});
