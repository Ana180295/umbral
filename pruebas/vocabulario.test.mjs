/* Umbral — la pantalla y el catálogo hablan el mismo idioma
 *
 * El fallo que motiva estas pruebas: `index.html` llamaba `concentrarme` a lo
 * que el catálogo llama `enfocarme`. Los dos lados estaban bien por separado
 * —15 prácticas de `enfocarme`, un botón perfectamente pintado— y el filtro
 * comparaba dos palabras que no coincidían. Ese botón no ofreció nada nunca.
 *
 * Ninguna prueba anterior podía cogerlo: las del catálogo leen el catálogo, y
 * cobertura.mjs saca las necesidades del catálogo también. Nadie miraba la
 * pantalla. Estas pruebas son ese puente.
 *
 *   node --test pruebas/*.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const APP = new URL('../app/', import.meta.url);

const html = await readFile(new URL('index.html', APP), 'utf8');
const catalogo = JSON.parse(await readFile(new URL('contenido/practicas.json', APP), 'utf8'));

/* Lee un array `const NOMBRE = [ { codigo: "x", ... } ]` de index.html.
   Se hace con expresión regular a propósito: importar el HTML exigiría un DOM,
   y montar uno para leer dos listas sería más andamiaje que app. */
function codigosDe(nombre) {
  const bloque = html.match(new RegExp(`const ${nombre} = \\[([\\s\\S]*?)\\n\\];`));
  assert.ok(bloque, `no se encuentra el array ${nombre} en app/index.html`);
  const codigos = [...bloque[1].matchAll(/codigo:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(codigos.length > 0, `${nombre} no declara ningún codigo`);
  return codigos;
}

const enPantalla = codigosDe('NECESIDAD');
const enCatalogo = new Set(catalogo.practicas.flatMap((p) => p.necesidad));

test('toda necesidad de la pantalla existe en el catálogo', () => {
  const huerfanas = enPantalla.filter((c) => !enCatalogo.has(c));
  assert.deepEqual(
    huerfanas,
    [],
    `estos botones no pueden ofrecer nada, nunca:\n  ${huerfanas.join('\n  ')}`
  );
});

test('toda necesidad del catálogo tiene botón en la pantalla', () => {
  const inalcanzables = [...enCatalogo].filter((c) => !enPantalla.includes(c)).sort();
  assert.deepEqual(
    inalcanzables,
    [],
    `hay prácticas escritas que no se pueden pedir desde ninguna parte:\n  ${inalcanzables.join('\n  ')}`
  );
});

test('las ocho necesidades siguen siendo ocho', () => {
  /* Si este número cambia es una decisión de producto, no un descuido.
     Que falle obliga a pasar por la hoja de ruta antes de seguir. */
  assert.equal(enPantalla.length, 8);
  assert.equal(new Set(enPantalla).size, 8, 'hay un código repetido');
});

test('la señal corporal que el filtro trata aparte existe en la pantalla', () => {
  /* techoDeCoste baja el techo a 1 cuando encuentra "dolor". Si el botón
     dejara de llamarse así, la regla seguiría en el código sin dispararse
     jamás: exactamente el mismo fallo, en otro sitio. */
  const cuerpo = codigosDe('CUERPO');
  assert.ok(cuerpo.includes('dolor'), `CUERPO ya no declara "dolor": ${cuerpo.join(', ')}`);
});

test('ninguna práctica declara una necesidad vacía o repetida', () => {
  for (const p of catalogo.practicas) {
    assert.ok(p.necesidad.length > 0, `${p.id} no sirve para ninguna necesidad`);
    assert.equal(new Set(p.necesidad).size, p.necesidad.length, `${p.id} repite necesidad`);
  }
});
