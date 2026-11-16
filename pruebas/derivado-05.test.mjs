/* derivado-05.test.mjs — el 05 dice lo mismo que fuentes.js, y lo dice una
 * sola vez. Decisión 0033, 16 de noviembre de 2026.
 *
 * La 0016 (§3) fijó que app/js/fuentes.js es el original y el 05 su
 * derivado, y la regla de la fuente única: cada dato se escribe una vez.
 * Durante casi tres meses no hubo derivador y el 05 se editó a mano en
 * paralelo; el 13 de noviembre hubo que cambiar el nombre del ayanamsa en
 * los dos sitios. Estas pruebas convierten la regla en algo que impide el
 * commit.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const { FUENTES } = await import('../app/js/fuentes.js');
const { derivar, reemplazar, parteAMano, INICIO, FIN } = await import('../herramientas/derivar-05.mjs');
const texto = fs.readFileSync(new URL('../docs/05-fuentes-tradiciones.md', import.meta.url), 'utf8');
const aMano = parteAMano(texto);

test('1 — «Las fichas» del 05 es exactamente lo que genera fuentes.js', () => {
  assert.equal(reemplazar(texto, derivar(FUENTES)), texto,
    'el 05 no coincide con fuentes.js: ejecuta node herramientas/derivar-05.mjs');
});

/* Identificadores que aparecen en las fichas y en los avisos. Lo que se
   busca es mecánico a propósito: un ISBN o un número de catálogo copiado a
   mano es exactamente el dato que algún día se corrige en un sitio y no en
   el otro. */
const PATRONES = [
  /\b(?:97[89]-)?\d{1,5}-\d{1,7}-\d{1,7}-[\dX]\b/g,  // ISBN-10 y -13 con guiones
  /\b97[89]\d{10}\b/g,                              // ISBN-13 sin guiones
  /\bOCLC \d+/g, /\bLCCN \d+/g, /\bWorldCat \d+/g, /\bHathiTrust \d+/g,
  /\bJSTOR \d+/g, /\bDOI \S+/g, /\bOL\d+[AMW]\b/g, /\bhvd\.\d+/g, /\blunationcycle00dane\b/g
];
function identificadores() {
  const vistos = new Set();
  for (const d of Object.values(FUENTES)) {
    const textos = [...Object.values(d.ficha || {}), d.aviso].filter((v) => typeof v === 'string');
    for (const t of textos) for (const p of PATRONES) for (const m of t.matchAll(p)) vistos.add(m[0]);
  }
  return [...vistos];
}

test('2 — ningún identificador de una ficha reaparece en la parte escrita a mano', () => {
  const ids = identificadores();
  assert.ok(ids.length >= 15, `solo ${ids.length} identificadores: el extractor no está viendo las fichas`);
  /* Tanto con el prefijo como sin él: «OCLC 9857844» y «9857844» suelto. */
  const repetidos = ids.filter((id) => aMano.includes(id) || aMano.includes(id.replace(/^\D+ /, '')));
  assert.deepEqual(repetidos, []);
});

test('3 — ningún título de ficha reaparece en la parte escrita a mano', () => {
  const titulos = Object.values(FUENTES).map((d) => d.ficha?.titulo).filter((t) => t && t.length > 20);
  assert.ok(titulos.length >= 8);
  assert.deepEqual(titulos.filter((t) => aMano.includes(t)), []);
});

test('4 — cada dato de fuentes.js tiene su remisión en el razonamiento', () => {
  const sinRemision = Object.keys(FUENTES).filter((clave) => !aMano.includes('`' + clave + '`'));
  assert.deepEqual(sinRemision, []);
});

test('5 — un campo de ficha nuevo para el derivador en vez de desaparecer en silencio', () => {
  const falso = { x: { ...FUENTES.jieqi, ficha: { ...FUENTES.jieqi.ficha, isbn_nuevo: '1' } } };
  assert.throws(() => derivar(falso), /campos de ficha sin sitio/);
});

test('6 — las marcas están una sola vez y la sección derivada va al final', () => {
  assert.equal(texto.split(INICIO).length, 2);
  assert.equal(texto.split(FIN).length, 2);
  assert.ok(texto.trimEnd().endsWith(FIN));
});
