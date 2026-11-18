/* fuentes-ocultas.test.mjs — decisión 0037, 18 de noviembre de 2026.
 * Ana: las fuentes no se ven a menos que se busquen; en el texto, solo la
 * información; la fuente, en un desplegable al final; y la marca de débil,
 * dentro de la fuente. Se prueba con el renderizador real de index.html,
 * recortado del propio archivo, como en nivel2.test.mjs.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

globalThis.Astronomy = createRequire(import.meta.url)('../app/js/vendor/astronomy.browser.min.js');
const D = await import('../app/js/dia.js');
const { diaLunar, observador } = await import('../app/js/luna.js');
const { FUENTES, ESTADOS_VISIBLES } = await import('../app/js/fuentes.js');
const OBS = observador({ lat: 39.005556, lon: -1.862222, altitud: 674 });
const DIA = diaLunar(Date.UTC(2026, 10, 18, 12), OBS);

function nodoFalso() {
  return {
    hidden: false, hijos: [], html: '',
    set innerHTML(v) { this.html = String(v); this.hijos = []; },
    get innerHTML() { return this.html; },
    appendChild(h) { this.hijos.push(h); return h; }
  };
}
function pintar(fuentes) {
  const html = fs.readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');
  const i = html.indexOf('<script>\n"use strict";');
  const src = html.slice(i + '<script>'.length, html.indexOf('</script>', i));
  const cuerpo = src.slice(src.indexOf('/* --- Las tradiciones: fuentes.js'), src.indexOf('casillaCerrarDia.addEventListener'));
  const A = nodoFalso(), B = nodoFalso();
  const { pintarTradiciones } = new Function('document', 'window', 'ZONA', 'zonaBloqueA', 'zonaBloqueB',
    'casillaCierreEnvoltorio', 'casillaCerrarDia', 'diaAbiertoManualmente', cuerpo + '\nreturn { pintarTradiciones };')(
    { createElement: nodoFalso }, { ...D, FUENTES: fuentes, ESTADOS_VISIBLES }, 'Europe/Madrid', A, B, nodoFalso(), nodoFalso(), false);
  pintarTradiciones(DIA.empieza, DIA, true);
  return [...A.hijos, ...B.hijos].map((h) => h.html);
}
/* Lo que está fuera del desplegable «Fuente» y lo que está dentro. */
const partir = (h) => {
  const i = h.indexOf('<details class="dato-fuente">');
  assert.ok(i !== -1, 'una ficha sin desplegable de fuente');
  return [h.slice(0, i), h.slice(i)];
};

test('1 — en el texto visible no hay ni título, ni autor, ni estado; en la fuente, sí', () => {
  const fichas = pintar(FUENTES);
  assert.ok(fichas.length >= 7);
  for (const [clave, d] of Object.entries(FUENTES)) {
    const suya = fichas.find((h) => h.includes(`>${d.nombre}<`));
    if (!suya) continue;                                   // datos sin cifra en el día
    const [fuera, dentro] = partir(suya);
    for (const c of ['titulo', 'autor', 'publicacion', 'verificado_en']) {
      const v = d.ficha?.[c];
      if (typeof v === 'string' && v) {
        assert.ok(!fuera.includes(v), `${clave}: ${c} fuera de la fuente`);
        assert.ok(dentro.includes(v), `${clave}: ${c} no está en la fuente`);
      }
    }
    assert.ok(!fuera.includes(d.nivel5), `${clave}: el nivel5 es fuente, no texto`);
    assert.ok(dentro.includes(d.nivel5));
    assert.ok(!fuera.includes('DÉBIL') && !fuera.includes('Verificado'), `${clave}: estado fuera de la fuente`);
  }
});

test('2 — los avisos al citar no se pintan nunca (0016 §8)', () => {
  const todo = pintar(FUENTES).join('');
  for (const [clave, d] of Object.entries(FUENTES)) {
    if (d.aviso) assert.ok(!todo.includes(d.aviso.slice(0, 60)), clave);
  }
});

test('3 — la marca DÉBIL va dentro de la fuente, y solo en los datos débiles', () => {
  const fuentes = { ...FUENTES, tithi: { ...FUENTES.tithi, estado: 'debil' } };
  const fichas = pintar(fuentes);
  const tithi = fichas.find((h) => h.includes('>Tithi<'));
  const [fuera, dentro] = partir(tithi);
  assert.ok(!fuera.includes('DÉBIL'));
  assert.ok(dentro.includes('<span class="dato-tradicion-debil">DÉBIL</span>'));
  const otras = fichas.filter((h) => h !== tithi).join('');
  assert.ok(!otras.includes('DÉBIL'), 'un dato fuerte con la marca');
});
