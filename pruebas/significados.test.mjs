/* significados.test.mjs — decisión 0040, 19 de noviembre de 2026.
 * Lo que significa el valor de hoy: un texto para cada valor que puede
 * salir, con su fuente, y sin la fuente dentro del texto (decisión C).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

globalThis.Astronomy = createRequire(import.meta.url)('../app/js/vendor/astronomy.browser.min.js');
const S = await import('../app/js/significados.js');
const C = await import('../app/js/carta.js');
const { FUENTES, ESTADOS_VISIBLES, CAMPOS_FICHA } = await import('../app/js/fuentes.js');

test('1 — cada valor que puede salir tiene su texto, y no hay textos de valores que no existen', () => {
  assert.deepEqual(Object.keys(S.SIGNIFICADOS.zodiaco_tropical.por_valor).sort(), [...C.SIGNOS].sort());
  assert.deepEqual(Object.keys(S.SIGNIFICADOS.nakshatra.por_valor).sort(), [...C.NAKSHATRAS].sort());
});

test('2 — el texto no lleva la fuente: ni autor ni obra (decisión C del 16 de noviembre)', () => {
  const prohibidas = ['Rudhyar', 'Whitney', 'Burgess', 'Pulse of Life', 'Sûrya', 'Surya', 'cap.', 'p. '];
  for (const [clave, s] of Object.entries(S.SIGNIFICADOS)) {
    for (const [valor, texto] of Object.entries(s.por_valor)) {
      for (const p of prohibidas) assert.ok(!texto.includes(p), `${clave} · ${valor}: «${p}» en el texto`);
    }
  }
  const nak = S.significadosDelDia('nakshatra', ['Purva Bhadrapada']);
  for (const p of nak.parrafos) for (const x of prohibidas) assert.ok(!p.texto.includes(x), `párrafo común: «${x}»`);
});

test('3 — cada texto tiene una fuente completa y en un estado que se puede enseñar', () => {
  for (const clave of Object.keys(S.SIGNIFICADOS)) {
    const valor = Object.keys(S.SIGNIFICADOS[clave].por_valor)[0];
    const { fuente } = S.significadosDelDia(clave, [valor]);
    assert.ok(ESTADOS_VISIBLES.includes(fuente.estado), `${clave}: estado ${fuente.estado}`);
    for (const c of CAMPOS_FICHA) assert.ok(fuente.ficha[c], `${clave}: falta ${c}`);
    assert.ok(fuente.ficha.capitulo, `${clave}: falta dónde, dentro de la obra`);
  }
  /* Las nakshatras usan la obra de su ficha, no una copia. */
  const n = S.significadosDelDia('nakshatra', ['Revati']).fuente.ficha;
  assert.equal(n.titulo, FUENTES.nakshatra.ficha.titulo);
  assert.notEqual(n.capitulo, FUENTES.nakshatra.ficha.capitulo);
});

test('4 — el día de la foto de Ana: Sol en Escorpio, y la Luna de Purva a Uttara Bhadrapada', () => {
  const sol = S.significadosDelDia('zodiaco_tropical', ['Escorpio']);
  assert.equal(sol.parrafos.length, 1);
  assert.equal(sol.parrafos[0].titulo, 'Escorpio');
  assert.match(sol.parrafos[0].texto, /regeneración/);

  /* Cinco tramos, dos nombres: cada nombre una vez, en orden, y luego
     pūrva/uttara y pada. */
  const luna = S.significadosDelDia('nakshatra',
    ['Purva Bhadrapada', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Uttara Bhadrapada', 'Uttara Bhadrapada']);
  assert.deepEqual(luna.parrafos.map((p) => p.titulo), ['Purva Bhadrapada', 'Uttara Bhadrapada', null, null]);
  assert.match(luna.parrafos[0].texto, /pies hermosos/);
  assert.match(luna.parrafos[2].texto, /anterior.*posterior/);
  assert.match(luna.parrafos[3].texto, /^Pada: /);
});

test('5 — pūrva/uttara solo cuando sale una pareja; pada, siempre', () => {
  const p = S.significadosDelDia('nakshatra', ['Hasta']).parrafos;
  assert.deepEqual(p.map((x) => x.titulo), ['Hasta', null]);
  assert.match(p[1].texto, /^Pada: /);
});

test('6 — sin texto no hay nada que enseñar', () => {
  assert.equal(S.significadosDelDia('tithi', [7]), null, 'tithi todavía no tiene textos');
  assert.equal(S.significadosDelDia('nakshatra', ['Abhijit']), null, 'un valor sin texto no se rellena');
});
