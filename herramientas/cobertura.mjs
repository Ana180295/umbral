/* Umbral — cobertura del catálogo
 *
 * Recorre todas las combinaciones plausibles de estado y hora, y cuenta
 * cuántas prácticas sobreviven al filtro en cada una. Sirve para distinguir
 * dos cosas que en pantalla se ven igual:
 *
 *   - el filtro funciona y esa casilla debe estar vacía a propósito
 *   - falta contenido en el catálogo
 *
 * No decide nada. Solo mide.
 *
 *   node herramientas/cobertura.mjs
 */

import { readFile } from 'node:fs/promises';
import { candidatas, techoDeCoste, esNoche } from '../app/js/seleccion.js';

const catalogo = JSON.parse(
  await readFile(new URL('../app/contenido/practicas.json', import.meta.url), 'utf8')
);

/* Las necesidades se sacan del propio catálogo, no de una lista escrita a
   mano: si mañana añades una, aparece aquí sola. */
const NECESIDADES = [...new Set(catalogo.practicas.flatMap((p) => p.necesidad))].sort();

const HORAS = [8, 13, 18, 23];
const ESCALA = [1, 2, 3, 4, 5];
const DOLOR = [[], ['dolor']];

const ancho = Math.max(...NECESIDADES.map((n) => n.length));
const pad = (s, n = ancho) => String(s).padEnd(n);

/* ---------- 1. Qué hay en el catálogo ---------- */

console.log(`\nCATÁLOGO: ${catalogo.practicas.length} prácticas\n`);
console.log(pad('necesidad') + '  total   coste1 coste2 coste3   cualquiera solo_dia mejor_mañana');

for (const n of NECESIDADES) {
  const suyas = catalogo.practicas.filter((p) => p.necesidad.includes(n));
  const porCoste = [1, 2, 3].map((c) => suyas.filter((p) => p.coste === c).length);
  const porFranja = ['cualquiera', 'solo_dia', 'mejor_manana'].map(
    (f) => suyas.filter((p) => p.franja === f).length
  );
  console.log(
    pad(n) +
      String(suyas.length).padStart(7) +
      porCoste.map((v) => String(v).padStart(7)).join('') +
      porFranja.map((v) => String(v).padStart(11)).join('')
  );
}

/* ---------- 2. Dónde se queda sin nada que ofrecer ---------- */

console.log('\n\nCONTEXTOS SIN NINGUNA OPCIÓN');
console.log('(cada necesidad contra 200 combinaciones de energía × activación × dolor × hora)\n');

const vacios = [];

for (const n of NECESIDADES) {
  let total = 0;
  let sinNada = 0;
  const culpables = new Map();

  for (const hora of HORAS)
    for (const energia of ESCALA)
      for (const activacion of ESCALA)
        for (const senal_corporal of DOLOR) {
          const ctx = { necesidad: n, energia, activacion, senal_corporal, hora };
          total++;
          if (candidatas(catalogo, ctx).length === 0) {
            sinNada++;
            const techo = techoDeCoste(ctx);
            const clave = `${hora}h · techo ${techo}${senal_corporal.length ? ' · dolor' : ''}`;
            culpables.set(clave, (culpables.get(clave) ?? 0) + 1);
          }
        }

  const pct = ((sinNada / total) * 100).toFixed(0);
  const marca = sinNada === 0 ? '  ' : sinNada / total > 0.25 ? '!!' : ' ·';
  console.log(`${marca} ${pad(n)} ${String(sinNada).padStart(4)} / ${total}  (${pct} %)`);

  if (sinNada) {
    vacios.push([n, [...culpables.keys()].sort()]);
  }
}

if (vacios.length) {
  console.log('\nDetalle de las casillas vacías:\n');
  for (const [n, claves] of vacios) {
    console.log(`  ${n}`);
    for (const c of claves) console.log(`    · ${c}`);
  }
}

/* ---------- 3. El caso que más duele ---------- */

console.log('\n\nEL PEOR CASO REAL: agotada y de noche');
console.log('(energía 1, activación 5, con dolor, 23 h — el techo baja a 1)\n');

for (const n of NECESIDADES) {
  const ctx = { necesidad: n, energia: 1, activacion: 5, senal_corporal: ['dolor'], hora: 23 };
  const c = candidatas(catalogo, ctx);
  console.log(`  ${pad(n)} ${String(c.length).padStart(3)}  ${c.slice(0, 3).map((p) => p.id).join(', ')}`);
}

console.log(`\nesNoche(21) = ${esNoche(21)} · esNoche(22) = ${esNoche(22)}\n`);
