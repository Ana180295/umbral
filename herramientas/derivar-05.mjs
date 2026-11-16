/* derivar-05.mjs — escribe en docs/05-fuentes-tradiciones.md la sección
 * «Las fichas» a partir de app/js/fuentes.js. Decisión 0016 §3 y 0033.
 *
 *   node herramientas/derivar-05.mjs              reescribe la sección
 *   node herramientas/derivar-05.mjs --comprobar  sale con 1 si no coincide
 *
 * fuentes.js es el original; esta sección del 05 es su derivado y no se
 * edita a mano. El resto del 05 —el razonamiento— sí se escribe a mano, y
 * pruebas/derivado-05.test.mjs vigila que no vuelva a copiar lo que es
 * ficha.
 *
 * Sin dependencias y sin build step de la app: esto es una herramienta de
 * documentación, como la hoja de cielo. La app no lo ejecuta nunca.
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const INICIO = '<!-- DERIVADO DE app/js/fuentes.js · no editar a mano · regenerar con: node herramientas/derivar-05.mjs -->';
export const FIN = '<!-- FIN DEL DERIVADO -->';

const CLASES = {
  1: '① Medición física',
  2: '② Cuenta desde un origen declarado',
  3: '③ Convención sobre la escritura',
  5: '⑤ Práctica humana documentada'
};
const ESTADOS = {
  fuerte: 'VERIFICADO FUERTE',
  debil: 'VERIFICADO DÉBIL',
  sin_verificar: 'SIN VERIFICAR — no se muestra'
};
const BLOQUES = {
  A: 'bloque A, disponible siempre',
  B: 'bloque B, solo al cerrar el día'
};
const ETNOGRAFIA = [
  ['quien', 'Quién'], ['donde', 'Dónde'], ['cuando', 'Cuándo'], ['documentado_por', 'Documentado por']
];
/* El orden de los campos de la ficha. Los obligatorios (CAMPOS_FICHA) y
   los que hoy existen además; un campo nuevo que no esté aquí hace fallar
   la derivación en vez de desaparecer en silencio. */
const FICHA = [
  ['autor', 'Autor'], ['titulo', 'Título'], ['publicacion', 'Publicación'],
  ['capitulo', 'Dónde, dentro de la obra'], ['verificado_en', 'Verificado']
];

function exigir(cond, mensaje) { if (!cond) throw new Error(`derivar-05: ${mensaje}`); }

export function derivar(FUENTES) {
  const l = [
    INICIO,
    '',
    '## Las fichas',
    '',
    '*Esta sección la escribe `herramientas/derivar-05.mjs` a partir de',
    '`app/js/fuentes.js`, que es el original (decisiones 0016 y 0033). Para',
    'cambiar una ficha se cambia `fuentes.js` y se vuelve a generar. Lo que hay',
    'encima de esta sección es el razonamiento, y ese sí se escribe aquí.*',
    ''
  ];
  for (const [clave, d] of Object.entries(FUENTES)) {
    exigir(CLASES[d.clase], `${clave}: clase desconocida ${d.clase}`);
    exigir(ESTADOS[d.estado], `${clave}: estado desconocido ${d.estado}`);
    exigir(BLOQUES[d.bloque], `${clave}: bloque desconocido ${d.bloque}`);
    const desconocidos = Object.keys(d.ficha || {}).filter((k) => !FICHA.some(([c]) => c === k));
    exigir(desconocidos.length === 0, `${clave}: campos de ficha sin sitio en el 05: ${desconocidos.join(', ')}`);

    l.push(`### ${d.nombre} · \`${clave}\``, '');
    l.push(`**${ESTADOS[d.estado]}** · clase ${CLASES[d.clase]} · ${BLOQUES[d.bloque]}`, '');
    if (d.nivel1) l.push(`- **Nivel 1 · qué es.** ${d.nivel1}`);
    if (d.nivel3) l.push(`- **Nivel 3 · cómo se cuenta y de dónde sale.** ${d.nivel3}`);
    if (d.nivel4) {
      l.push(`- **Nivel 4 · qué se hacía con esto** (${BLOQUES[d.bloque_nivel4] || 'sin bloque declarado'}). ${d.nivel4}`);
      for (const [c, rotulo] of ETNOGRAFIA) {
        if (d.etnografia?.[c]) l.push(`  - *${rotulo}:* ${d.etnografia[c]}`);
      }
    } else {
      l.push('- **Nivel 4 · qué se hacía con esto.** Vacío a propósito.');
    }
    if (d.nivel5) l.push(`- **Nivel 5 · quién discute qué.** ${d.nivel5}`);
    l.push('', '**Ficha**', '');
    for (const [c, rotulo] of FICHA) {
      if (!(c in (d.ficha || {}))) continue;
      const v = d.ficha[c];
      l.push(`- *${rotulo}:* ${v === null ? '— (sin autor único)' : v}`);
    }
    if (d.aviso) l.push('', `*Aviso al citar:* ${d.aviso}`);
    l.push('');
  }
  l.push(FIN);
  return l.join('\n');
}

/* Devuelve el 05 con la sección derivada puesta al día. */
export function reemplazar(texto, bloque) {
  const i = texto.indexOf(INICIO), j = texto.indexOf(FIN);
  exigir(i !== -1 && j > i, 'el 05 no tiene las marcas de la sección derivada');
  exigir(texto.indexOf(INICIO, i + 1) === -1 && texto.indexOf(FIN, j + 1) === -1, 'las marcas aparecen más de una vez');
  return texto.slice(0, i) + bloque + texto.slice(j + FIN.length);
}

/* Lo que está fuera de las marcas: el razonamiento, escrito a mano. */
export function parteAMano(texto) {
  const i = texto.indexOf(INICIO), j = texto.indexOf(FIN);
  exigir(i !== -1 && j > i, 'el 05 no tiene las marcas de la sección derivada');
  return texto.slice(0, i) + texto.slice(j + FIN.length);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { FUENTES } = await import('../app/js/fuentes.js');
  const ruta = fileURLToPath(new URL('../docs/05-fuentes-tradiciones.md', import.meta.url));
  const actual = fs.readFileSync(ruta, 'utf8');
  const nuevo = reemplazar(actual, derivar(FUENTES));
  if (process.argv.includes('--comprobar')) {
    if (nuevo !== actual) { console.error('El 05 no coincide con fuentes.js: node herramientas/derivar-05.mjs'); process.exit(1); }
    console.log('El 05 coincide con fuentes.js.');
  } else {
    fs.writeFileSync(ruta, nuevo);
    console.log(nuevo === actual ? 'Sin cambios.' : 'Sección «Las fichas» del 05 regenerada.');
  }
}
