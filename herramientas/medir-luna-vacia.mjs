// Mide la Luna vacía de curso (definición moderna, Morrison) en 2026,
// con y sin Quirón, y con solo los planetas a simple vista. No es parte de la app:
// es la medida del 19 de noviembre de 2026 (docs/12).
//   node herramientas/medir-luna-vacia.mjs            → resumen en JSON
//   LISTA=sin node herramientas/medir-luna-vacia.mjs  → además, enero-marzo en hora
//                                                     de Nueva York (cotejo Café Astrology)
import { createRequire } from 'node:module';
const R = new URL('../', import.meta.url).pathname;
globalThis.Astronomy = createRequire(import.meta.url)(R + 'app/js/vendor/astronomy.browser.min.js');
const C = await import(R + 'app/js/carta.js');
const { norm, longitudTropical: L } = C;

const INI = Date.UTC(2026, 0, 1), FIN = Date.UTC(2027, 0, 1);
const PASO = 10 * 60e3;
const ANGULOS = [0, 60, 90, 120, 180, 240, 270, 300];
const firmado = (x) => { x = norm(x); return x > 180 ? x - 360 : x; };
const biseca = (f, a, b) => { let fa = f(a); while (b - a > 1000) { const m = (a + b) / 2, fm = f(m); if ((fa <= 0) === (fm <= 0)) { a = m; fa = fm; } else b = m; } return (a + b) / 2; };

// 1. Entradas de la Luna en cada signo (y de qué signo a cuál)
const signo = (t) => Math.floor(norm(L('Moon', t)) / 30);
const entradas = [];
for (let t = INI - 3 * 86400e3; t < FIN + 3 * 86400e3; t += PASO) {
  if (signo(t) !== signo(t + PASO)) {
    const s1 = signo(t + PASO);
    entradas.push(biseca((x) => (signo(x) === s1 ? 1 : -1), t, t + PASO));
  }
}
// 2. Aspectos exactos de la Luna con cada cuerpo (longitudes precalculadas en la rejilla)
const CUERPOS = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];
const exactos = []; // {t, cuerpo, angulo}
const desde = entradas[0], hasta = entradas.at(-1);
const rejilla = []; for (let t = desde; t <= hasta + PASO; t += PASO) rejilla.push(t);
const LL = { Moon: rejilla.map((t) => L('Moon', t)) };
for (const c of CUERPOS) LL[c] = rejilla.map((t) => L(c, t));
for (const c of CUERPOS) {
  for (const a of ANGULOS) {
    const f = (t) => firmado(L('Moon', t) - L(c, t) - a);
    for (let i = 1; i < rejilla.length; i++) {
      const fa = firmado(LL.Moon[i - 1] - LL[c][i - 1] - a), ft = firmado(LL.Moon[i] - LL[c][i] - a);
      if (fa < 0 && ft >= 0 && ft - fa < 90) exactos.push({ t: biseca(f, rejilla[i - 1], rejilla[i]), cuerpo: c, angulo: a > 180 ? 360 - a : a });
    }
  }
}
exactos.sort((x, y) => x.t - y.t);

// 3. Periodos vacíos para cada conjunto de cuerpos
function periodos(cuerpos) {
  const res = [];
  for (let i = 0; i + 1 < entradas.length; i++) {
    const e0 = entradas[i], e1 = entradas[i + 1];
    if (e1 <= INI || e1 > FIN) continue;            // periodos que acaban en 2026
    const dentro = exactos.filter((x) => x.t >= e0 && x.t < e1 && cuerpos.includes(x.cuerpo));
    const ultimo = dentro.at(-1);
    res.push({ fin: e1, inicio: ultimo ? ultimo.t : e0, ultimo, sinAspectos: !ultimo });
  }
  return res;
}
const SIN = CUERPOS.slice(0, 9), CON = CUERPOS, VISTA = CUERPOS.slice(0, 6);
const A = periodos(SIN), B = periodos(CON), V = periodos(VISTA);
const h = (ms) => ms / 3600e3;
const resumen = (P) => {
  const d = P.map((p) => h(p.fin - p.inicio)).sort((x, y) => x - y);
  const suma = d.reduce((s, x) => s + x, 0);
  return { n: d.length, total_h: suma, media_h: suma / d.length, mediana_h: d[d.length >> 1], max_h: d.at(-1), min_h: d[0],
    menos_de_1h: d.filter((x) => x < 1).length, mas_de_24h: d.filter((x) => x > 24).length, sin_aspectos: P.filter((p) => p.sinAspectos).length };
};
const cambios = A.map((p, i) => ({ fin: p.fin, sin: h(p.fin - p.inicio), con: h(B[i].fin - B[i].inicio), quiron: B[i].ultimo?.cuerpo === 'Chiron' ? B[i].ultimo.angulo : null }))
  .filter((x) => Math.abs(x.sin - x.con) > 1e-6);
const fmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
console.log(JSON.stringify({ entradas_2026: A.length,
  solo_a_simple_vista: resumen(V), sol_a_pluton: resumen(A), sol_a_pluton_mas_quiron: resumen(B),
  periodos_que_cambian_con_quiron: cambios.length,
  horas_que_quita_quiron: cambios.reduce((s, x) => s + (x.sin - x.con), 0),
  mayor_recorte_h: Math.max(...cambios.map((x) => x.sin - x.con)),
  recortes: cambios.map((x) => ({ entra_en_signo: fmt.format(new Date(x.fin)), sin_quiron_h: +x.sin.toFixed(2), con_quiron_h: +x.con.toFixed(2), aspecto: x.quiron })),
}, null, 1));
if (process.env.LISTA) {
  const et = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const conj = process.env.LISTA === 'con' ? B : A;
  for (const p of conj.filter((p) => p.fin < Date.UTC(2026, 3, 1, 5))) console.log(et.format(new Date(p.inicio)), '|', p.ultimo?.cuerpo, p.ultimo?.angulo, '|', et.format(new Date(p.fin)));
}
