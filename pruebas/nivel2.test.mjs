/* nivel2.test.mjs — la cifra de cada tradición, sobre el día lunar entero.
 * Pendiente 42, opción (iii), 15 de noviembre de 2026.
 *
 * nivel4-bloque.test.mjs prueba el reparto por bloques con dobles del
 * motor. Esta hace lo contrario: usa app/js/dia.js DE VERDAD y el
 * renderizador real de index.html, recortado del propio archivo, porque lo
 * que se prueba aquí es lo que sale escrito. Mismo doble mínimo de
 * `document` que allí: no parsea nada, solo acumula texto.
 *
 * Y la 1 no comparte el método que comprueba: barre cada día minuto a
 * minuto, por fuerza bruta, y exige los mismos cambios que encuentra el
 * muestreo cada 20 minutos con bisección.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
globalThis.Astronomy = require('../app/js/vendor/astronomy.browser.min.js');
const D = await import('../app/js/dia.js');
const { diaLunar, observador } = await import('../app/js/luna.js');
const { FUENTES, ESTADOS_VISIBLES } = await import('../app/js/fuentes.js');

const OBS = observador({ lat: 39.005556, lon: -1.862222, altitud: 674 });
const ZONA = 'Europe/Madrid';

/* Treinta días lunares seguidos desde el 1 de enero de 2026. */
const DIAS = [];
{
  let d = diaLunar(Date.UTC(2026, 0, 1, 12), OBS);
  while (DIAS.length < 30) { DIAS.push(d); d = diaLunar(d.termina + 60000, OBS); }
}

/* --- 1 · los tramos contra la fuerza bruta -------------------------- */

test('1 — los cambios dentro del día lunar, contra un barrido minuto a minuto (30 días, 5 tradiciones)', () => {
  const VALOR = {
    tithi: (ms) => D.tithiDelDia(ms).numero,
    nakshatra: (ms) => { const v = D.nakshatraDeLaLuna(ms); return `${v.numero}·${v.pada}`; },
    fases_rudhyar: (ms) => D.faseRudhyarDelDia(ms).indice,
    jieqi: (ms) => D.terminoSolar(ms).termino,
    calendario_islamico: (ms) => D.fechaIslamica(ms, ZONA)
  };
  let cambios = 0;
  for (const dia of DIAS) {
    for (const [clave, valor] of Object.entries(VALOR)) {
      const brutos = [];
      let previo = valor(dia.empieza);
      for (let t = dia.empieza + 60e3; t < dia.termina; t += 60e3) {
        const v = valor(t);
        if (v !== previo) { brutos.push(t); previo = v; }
      }
      const { tramos } = D.tramosDelDia(clave, dia.empieza, dia.termina, ZONA);
      const encontrados = tramos.slice(1).map((x) => x.desde);
      assert.equal(encontrados.length, brutos.length,
        `${clave}, día que empieza el ${new Date(dia.empieza).toISOString()}: ${encontrados.length} cambios frente a ${brutos.length}`);
      /* El barrido ve el cambio en el primer minuto en que ya ha ocurrido,
         así que el instante de verdad está en el minuto anterior. */
      encontrados.forEach((e, i) => {
        assert.ok(e <= brutos[i] && e > brutos[i] - 61e3, `${clave}: ${new Date(e).toISOString()} frente a ${new Date(brutos[i]).toISOString()}`);
      });
      cambios += brutos.length;
    }
  }
  assert.ok(cambios > 150, `solo ${cambios} cambios vistos: la prueba no ha visto suficiente`);
});

/* --- el renderizador real -------------------------------------------- */

function nodoFalso() {
  return {
    hidden: false, checked: false, hijos: [], html: '', className: '',
    set innerHTML(v) { this.html = String(v); this.hijos = []; },
    get innerHTML() { return this.html; },
    appendChild(h) { this.hijos.push(h); return h; },
    get textContent() { return this.html.replace(/<[^>]*>/g, ' ') + ' ' + this.hijos.map((h) => h.textContent).join(' '); }
  };
}

function renderizador() {
  const html = fs.readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');
  const i = html.indexOf('<script>\n"use strict";');
  const src = html.slice(i + '<script>'.length, html.indexOf('</script>', i));
  const desde = src.indexOf('/* --- Las tradiciones: fuentes.js');
  const hasta = src.indexOf('casillaCerrarDia.addEventListener');
  assert.ok(desde !== -1 && hasta > desde, 'no se encontró el bloque del renderizador en index.html');
  const A = nodoFalso(), B = nodoFalso(), envoltorio = nodoFalso(), casilla = nodoFalso();
  const ventana = { ...D, FUENTES, ESTADOS_VISIBLES };
  const fabricar = new Function('document', 'window', 'ZONA', 'zonaBloqueA', 'zonaBloqueB',
    'casillaCierreEnvoltorio', 'casillaCerrarDia', 'diaAbiertoManualmente',
    src.slice(desde, hasta) + '\nreturn { pintarTradiciones };');
  const { pintarTradiciones } = fabricar({ createElement: nodoFalso }, ventana, ZONA, A, B, envoltorio, casilla, false);
  return { pintarTradiciones, A, B, envoltorio };
}

const cifras = (r) => [...r.A.hijos, ...r.B.hijos]
  .map((h) => (h.html.match(/<p class="dato-tradicion-cifra">([^<]*)<\/p>/) || [])[1])
  .filter(Boolean);

test('2 — siete cifras por día, y ningún número con punto decimal (30 días)', () => {
  for (const dia of DIAS) {
    const r = renderizador();
    r.pintarTradiciones(dia.empieza, dia, false);
    const c = cifras(r);
    assert.equal(c.length, 7, `${new Date(dia.empieza).toISOString()}: ${c.length} cifras`);
    for (const texto of c) {
      assert.doesNotMatch(texto, /\d\.\d/, `punto decimal en: ${texto}`);
    }
  }
});

test('3 — el mismo día da el mismo texto, se llegue desde «Día anterior», desde «Día siguiente» o en «Hoy»', () => {
  for (const dia of DIAS.slice(0, 10)) {
    /* Los tres instantes con los que index.html llega a un día: el
       primero (Día siguiente), el último segundo (Día anterior) y uno
       cualquiera de en medio (Hoy). */
    const textos = [dia.empieza, dia.termina - 1000, (dia.empieza + dia.termina) / 2].map((ms) => {
      const visto = diaLunar(ms, OBS);
      const r = renderizador();
      r.pintarTradiciones(ms, visto, false);
      return cifras(r).join(' | ');
    });
    assert.equal(textos[1], textos[0]);
    assert.equal(textos[2], textos[0]);
  }
});

test('4 — la cifra dice los cambios: un tithi que cambia dentro del día sale con su hora', () => {
  const dia = DIAS.find((d) => D.tramosDelDia('tithi', d.empieza, d.termina, ZONA).tramos.length > 1);
  const r = renderizador();
  r.pintarTradiciones(dia.empieza, dia, false);
  const tithi = cifras(r).find((t) => t.startsWith('Tithi'));
  assert.match(tithi, /^Tithi \d+ de 30 \((shukla|krishna)\) → \d+ de 30 \((shukla|krishna)\) a las \d\d:\d\d\.$/);
  const sol = cifras(r).find((t) => t.startsWith('El Sol va de') && !t.includes('sidéreo'));
  assert.match(sol, /\d+,\d°/, 'los grados del Sol, con coma');
});

test('5 — sin día lunar no se pinta ninguna cifra, y la casilla se gestiona igual', () => {
  const r = renderizador();
  r.envoltorio.hidden = false;
  r.pintarTradiciones(Date.UTC(2026, 0, 1), null, false);
  assert.equal(cifras(r).length, 0);
  assert.equal(r.envoltorio.hidden, true, 'la casilla tiene que esconderse aunque no haya día lunar');
});
