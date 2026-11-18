/* cotejo-externo.test.mjs — Umbral contra otro programa, con dos cartas de
 * hora fiable. Pendiente 46; Ana eligió a Clara Campoamor y a Marie Curie el
 * 18 de noviembre de 2026. Datos y procedencia: pruebas/datos/
 * cotejo-astrotheme.json.
 *
 * Todo pasa por cartaDelPerfil, el camino de la app: de «fecha, hora y zona»
 * a la carta, con la conversión de zona incluida. Astrotheme escribe al
 * minuto entero, así que la tolerancia es de 1′: más fino no se puede
 * comparar con un dato redondeado al minuto.
 *
 * Y las dos son anteriores a 1901: prueban también el pendiente 47 en su caso
 * bueno, cuando la base de zonas del navegador sabe la hora local del sitio.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const A = globalThis.Astronomy = createRequire(import.meta.url)('../app/js/vendor/astronomy.browser.min.js');
const P = await import('../app/js/perfil.js');
const C = await import('../app/js/carta.js');
const { personas } = JSON.parse(fs.readFileSync(new URL('./datos/cotejo-astrotheme.json', import.meta.url), 'utf8'));

const SIGNOS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const grados = (txt) => {
  const m = txt.match(/^(\d+)°(\d+)' (\w+)$/);
  assert.ok(m, `posición ilegible: ${txt}`);
  return SIGNOS.indexOf(m[3]) * 30 + Number(m[1]) + Number(m[2]) / 60;
};
const minutos = (a, b) => Math.abs((((a - b) % 360) + 540) % 360 - 180) * 60;
const carta = (p) => {
  const r = P.cartaDelPerfil({ ...p.nacimiento, precision_hora: 'exacta' });
  assert.equal(r.estado, 'exacta');
  return r.carta;
};

test('1 — los diez cuerpos, a menos de 1′ de lo publicado', () => {
  for (const p of personas) {
    const k = carta(p);
    for (const [cuerpo, txt] of Object.entries(p.publicado)) {
      if (cuerpo === 'ASC' || cuerpo === 'MC') continue;
      const d = minutos(k.cuerpos[cuerpo].longitud, grados(txt));
      assert.ok(d < 1, `${p.nombre}, ${cuerpo}: ${d.toFixed(2)}′`);
    }
  }
});

test('2 — los mismos cuerpos retrógrados', () => {
  for (const p of personas) {
    const k = carta(p);
    const nuestros = Object.entries(k.cuerpos).filter(([, v]) => v.retrogrado).map(([c]) => c).sort();
    assert.deepEqual(nuestros, [...p.retrogrados].sort(), p.nombre);
  }
});

test('3 — Curie: Ascendente, Medio Cielo y las doce cúspides de Placidus, a menos de 1′', () => {
  const p = personas.find((x) => x.nombre === 'Marie Curie');
  const k = carta(p);
  assert.ok(minutos(k.angulos.ASC, grados(p.publicado.ASC)) < 1);
  assert.ok(minutos(k.angulos.MC, grados(p.publicado.MC)) < 1);
  p.placidus.forEach((txt, i) => {
    assert.ok(minutos(k.casas.Placidus.cuspides[i], grados(txt)) < 1, `casa ${i + 1}`);
  });
});

test('4 — Campoamor: los ángulos difieren por la zona, no por el cálculo', () => {
  /* Astrotheme toma el Madrid de 1888 a −0:15:00; la base de zonas del
     navegador, a −0:14:44, la hora media de Madrid. Son 16 s, que mueven
     el Ascendente unos 7′ y el Medio Cielo unos 4′. Con el instante de
     Astrotheme, los ángulos coinciden a menos de 1′. */
  const p = personas.find((x) => x.nombre === 'Clara Campoamor');
  const k = carta(p);
  const suyo = Date.parse(p.instante_de_astrotheme);
  assert.equal(suyo - k.instante, 16000, 'la diferencia de zona tiene que ser de 16 s exactos');
  const obs = P.observadorDeNacimiento(p.nacimiento);
  const ang = C.angulos(suyo, obs);
  assert.ok(minutos(ang.ASC, grados(p.publicado.ASC)) < 1);
  assert.ok(minutos(ang.MC, grados(p.publicado.MC)) < 1);
  /* Y con el nuestro, la diferencia es la esperada por esos 16 s, no más. */
  assert.ok(minutos(k.angulos.MC, grados(p.publicado.MC)) < 6);
  assert.ok(minutos(k.angulos.ASC, grados(p.publicado.ASC)) < 9);
});

test('5 — pendiente 47, caso bueno: la zona del navegador es la hora media del lugar', () => {
  /* Antes de las horas oficiales, cada ciudad usaba su hora solar media. Para
     Madrid y Varsovia la base de zonas la conoce: el desfase coincide con
     la longitud del sitio a menos de 10 s. Para otras ciudades no tiene por
     qué (Valladolid, Ulm: ver 03). */
  for (const p of personas) {
    const k = carta(p);
    const [h, m] = p.nacimiento.hora.split(':').map(Number);
    const civil = Date.UTC(...p.nacimiento.fecha.split('-').map((x, i) => Number(x) - (i === 1 ? 1 : 0)), h, m);
    const desfase = (civil - k.instante) / 1000;
    const solarMedia = p.nacimiento.lon / 15 * 3600;
    assert.ok(Math.abs(desfase - solarMedia) < 10, `${p.nombre}: ${desfase} s frente a ${solarMedia.toFixed(0)} s`);
  }
});
