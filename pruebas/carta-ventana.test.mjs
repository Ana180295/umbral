import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

/* La carta sin hora exacta — decisión 0030, 13 de noviembre de 2026.

   cartaEnVentana() mira SOLO los dos extremos de la ventana y deduce el
   resto: que un signo que coincide en los dos no ha cambiado en medio, que
   un aspecto dentro del orbe en los dos lo está en toda la ventana, y que
   uno cuya desviación cambia de signo se hizo exacto dentro. Esas
   deducciones son el punto débil, y por eso la prueba 3 NO las comparte:
   barre cada ventana minuto a minuto, por fuerza bruta, y exige que diga
   exactamente lo mismo. Si un día alguien ensancha las ventanas o mete una
   rejilla más fina, es esa prueba la que tiene que ponerse roja. */

const require = createRequire(import.meta.url);
globalThis.Astronomy = require('../app/js/vendor/astronomy.browser.min.js');
const C = await import('../app/js/carta.js');
const { cartaDelPerfil, ventanaDeNacimiento } = await import('../app/js/perfil.js');

const A = globalThis.Astronomy;
const OBS = new A.Observer(39.005556, -1.862222, 674);
const NACIMIENTO = Date.UTC(1995, 1, 18, 21, 43);

test('1 — una ventana de ancho cero es la carta del instante: mismos signos, mismos aspectos, todos seguros', () => {
  const v = C.cartaEnVentana(NACIMIENTO, NACIMIENTO, OBS);
  const i = C.cartaEnInstante(NACIMIENTO, OBS);
  for (const c of C.CUERPOS) {
    assert.equal(v.cuerpos[c].signo_tropical, i.cuerpos[c].signo_tropical, c);
    assert.equal(v.cuerpos[c].signo_sidereo, i.cuerpos[c].signo_sidereo, c);
  }
  const clave = (x) => `${x.a}|${x.b}|${x.aspecto}`;
  assert.deepEqual(v.aspectos.map(clave).sort(), i.aspectos.map(clave).sort());
  assert.ok(v.aspectos.every((x) => x.seguro));
});

test('2 — la carta de referencia en la franja 21:00-24:00: lo que sí se puede decir y lo que no', () => {
  /* 21:00 y 24:00 en Madrid, en febrero de 1995 (UTC+1). Fin exclusivo. */
  const v = C.cartaEnVentana(Date.UTC(1995, 1, 18, 20, 0), Date.UTC(1995, 1, 18, 23, 0) - 1, OBS);
  assert.equal(v.cuerpos.Moon.signo_tropical, 'Libra', 'la Luna no sale de Libra en esas tres horas');
  assert.deepEqual(v.rejillas.karana, { entre: [{ numero: 37 }, { numero: 38 }] }, 'el karana sí cambia');
  assert.deepEqual(v.rejillas.tithi, { numero: 19, paksha: 'krishna' });
  const porNombre = Object.fromEntries(v.aspectos.map((x) => [`${x.a} ${x.aspecto} ${x.b}`, x.seguro]));
  assert.deepEqual(porNombre, {
    'Jupiter cuadratura Saturn': true,
    'Neptune trígono Chiron': true,     // Quirón, desde la decisión 0031
    'Sun cuadratura Pluto': true,
    'Moon sextil Jupiter': false        // se hace exacto dentro de la franja: depende de la hora
  });
  assert.equal(v.angulos, null);
  assert.equal(v.casas, null);
  assert.match(v.motivo_sin_angulos, /hora exacta/);
});

function barrido(ANCHO, desplazamiento, cuantas) {
  const PASO = 60e3;
  const ASPECTOS = [[0, 'conjunción'], [60, 'sextil'], [300, 'sextil'], [90, 'cuadratura'], [270, 'cuadratura'],
    [120, 'trígono'], [240, 'trígono'], [180, 'oposición']];
  const dev = (sep, t) => ((sep - t) % 360 + 540) % 360 - 180;
  const norm = (x) => ((x % 360) + 360) % 360;
  let comprobados = 0, posibles = 0;
  for (let k = 0; k < cuantas; k++) {
    /* Repartidas por el año, a horas distintas: cada 73 h no coincide con
       ningún ciclo de los que se miden. */
    const inicio = Date.UTC(2026, 0, 1) + desplazamiento + k * 73 * 3600e3;
    const fin = inicio + ANCHO;
    const v = C.cartaEnVentana(inicio, fin, OBS);

    /* Fuerza bruta: longitudes en cada minuto. */
    const muestras = [];
    for (let t = inicio; t <= fin; t += PASO) muestras.push(C.longitudes(t));

    for (const c of C.CUERPOS) {
      const signos = new Set(muestras.map((L) => Math.floor(norm(L[c]) / 30)));
      const dijo = v.cuerpos[c].signo_tropical;
      assert.equal(signos.size === 1, typeof dijo === 'string', `ventana ${k}, ${c}: signos ${[...signos]}`);
    }
    const dijo = new Map(v.aspectos.map((x) => [`${x.a}|${x.b}|${x.aspecto}`, x.seguro]));
    for (let i = 0; i < C.CUERPOS.length; i++) for (let j = i + 1; j < C.CUERPOS.length; j++) {
      const a = C.CUERPOS[i], b = C.CUERPOS[j];
      /* Un mismo nombre (sextil) cubre 60° y 300°: se agrupa por nombre. */
      const porNombre = new Map();
      for (const [theta, nombre] of ASPECTOS) {
        const devs = muestras.map((L) => Math.abs(dev(norm(L[a] - L[b]), theta)));
        const r = porNombre.get(nombre) || { alguna: false, todas: false };
        r.alguna = r.alguna || devs.some((d) => d <= C.ORBE);
        r.todas = r.todas || devs.every((d) => d <= C.ORBE);
        porNombre.set(nombre, r);
      }
      for (const [nombre, r] of porNombre) {
        const k2 = `${a}|${b}|${nombre}`;
        assert.equal(dijo.has(k2), r.alguna, `ventana ${k}: ${k2} — el barrido dice ${r.alguna ? 'sí' : 'no'}`);
        if (r.alguna) {
          assert.equal(dijo.get(k2), r.todas, `ventana ${k}: ${k2} — ¿seguro? el barrido dice ${r.todas}`);
          comprobados++;
          if (!r.todas) posibles++;
        }
      }
    }
  }
  return { comprobados, posibles };
}

test('3 — los dos extremos dicen lo mismo que un barrido minuto a minuto (120 ventanas de 3 h, 2026)', () => {
  const { comprobados, posibles } = barrido(3 * 3600e3, 0, 120);
  /* Que la prueba haya visto de verdad los dos casos, no solo uno. */
  assert.ok(comprobados > 300, `solo ${comprobados} aspectos comprobados`);
  assert.ok(posibles > 20, `solo ${posibles} aspectos «posibles» vistos`);
});

test('3b — y con ventanas de 4 h, el máximo: la franja del día que se atrasa la hora', () => {
  /* Aquí sí puede pasar que un aspecto de la Luna esté fuera del orbe en
     los dos extremos y se haga exacto en medio: es lo que vigila la
     detección del cruce, que con 3 h no se llega a ejercitar nunca. */
  barrido(4 * 3600e3, 17 * 3600e3, 120);
});

test('3c — una ventana de más de 4 h no se acepta', () => {
  assert.throws(() => C.cartaEnVentana(NACIMIENTO, NACIMIENTO + 4 * 3600e3 + 1, OBS), /4 h/);
  assert.doesNotThrow(() => C.cartaEnVentana(NACIMIENTO, NACIMIENTO + 4 * 3600e3, OBS));
});

/* --- el perfil ------------------------------------------------------ */

const BASE = {
  fecha: '1995-02-18', hora: '22:43', precision_hora: 'exacta',
  lat: 39.005556, lon: -1.862222, altitud: 674, zona: 'Europe/Madrid', localidad: 'Albacete'
};

test('4 — con hora exacta, la carta completa: Ascendente 17° 55′ Libra y seis sistemas de casas', () => {
  const r = cartaDelPerfil(BASE);
  assert.equal(r.estado, 'exacta');
  const asc = r.carta.angulos.ASC;
  assert.equal(Math.floor(asc / 30), 6);                    // Libra
  assert.equal(Math.floor(asc % 30), 17);
  assert.equal(Math.floor(((asc % 30) % 1) * 60), 55);
  assert.equal(Object.keys(r.carta.casas).length, 6);
});

test('5 — con franja, sin Ascendente ni casas; la ventana es la misma que usa la época', () => {
  const franja = { ...BASE, precision_hora: 'franja', hora: '21:00' };
  const v = ventanaDeNacimiento(franja);
  assert.equal(v.estado, 'franja');
  assert.equal(v.inicio, Date.UTC(1995, 1, 18, 20, 0));
  assert.equal(v.fin, Date.UTC(1995, 1, 18, 23, 0) - 1);
  const r = cartaDelPerfil(franja);
  assert.equal(r.estado, 'franja');
  assert.equal(r.carta.angulos, null);
  assert.equal(r.carta.casas, null);
});

test('6 — la franja de las 21:00 termina al día siguiente a medianoche, no el mismo día', () => {
  const v = ventanaDeNacimiento({ ...BASE, precision_hora: 'franja', hora: '21:00', fecha: '1995-12-31' });
  assert.equal(v.fin + 1, Date.UTC(1995, 11, 31, 23, 0), '00:00 del 1 de enero de 1996 en Madrid');
});

test('7 — «No lo sé» no inventa ventana: sin_dato, con motivo', () => {
  const r = cartaDelPerfil({ ...BASE, precision_hora: 'desconocida', hora: null });
  assert.equal(r.estado, 'sin_dato');
  assert.match(r.motivo, /desconocida/);
});

test('8 — la carta se calcula donde naciste: otro lugar, otro Ascendente', () => {
  const albacete = cartaDelPerfil(BASE).carta.angulos.ASC;
  const fuera = cartaDelPerfil({ ...BASE, lat: -34.6037, lon: -58.3816, altitud: 25 }).carta.angulos.ASC;
  assert.ok(Math.abs(C.norm(albacete - fuera + 180) - 180) > 10);
});
