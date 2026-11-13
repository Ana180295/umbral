import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/* La casilla de cierre del día — decisión 0029, 13 de noviembre de 2026.
   Aparece al salir la Luna que abre el día lunar de hoy y sigue hasta la
   siguiente salida. Vive en index.html, que toca el DOM y no se puede
   montar aquí sin un navegador de pruebas (§8, punto ciego conocido), así
   que esto es una regla escrita como prueba sobre el fichero real: la
   condición no puede volver a depender de la hora del reloj civil. */

const html = readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');

test('1 — la casilla depende solo de estar en el día lunar de hoy', () => {
  assert.match(html, /const casillaDisponible = enElDiaDeHoy;/);
});

test('2 — ni getHours ni ninguna hora fija en la condición de la casilla', () => {
  const linea = html.split('\n').find((l) => l.includes('const casillaDisponible'));
  assert.ok(linea, 'no se encuentra la condición de la casilla');
  assert.doesNotMatch(linea, /getHours|21|horaLocal/);
  assert.doesNotMatch(html, /const horaLocal = new Date\(\)\.getHours\(\);/);
});

test('3 — «hoy» es el día lunar que contiene este instante, de salida a salida', () => {
  assert.match(html, /const enElDiaDeHoy = !!diaVisto && diaVisto\.empieza <= Date\.now\(\) && Date\.now\(\) < diaVisto\.termina;/);
});
