/* La lista de PRECACHE del service worker se mantiene a mano: no hay generador
 * porque no hay compilación. Esta prueba es lo que sustituye al generador.
 *
 * Sin ella, el fallo típico es silencioso y tarda semanas en aparecer: añades
 * un módulo, en el móvil funciona porque hay cobertura, y el día que abres la
 * app en mitad del campo falta ese fichero.
 *
 *   node --test pruebas/*.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const APP = join(RAIZ, 'app');

/* Andamiaje del repositorio, no cosas que la app necesite abrir sin red. */
const IGNORADOS = [
  /^sw\.js$/,
  /(^|\/)\.DS_Store$/,
  /(^|\/)\.gitkeep$/,
  /(^|\/)README\.md$/
];

async function ficherosDeApp(dir = APP) {
  const entradas = await readdir(dir, { withFileTypes: true });
  const salida = [];
  for (const e of entradas) {
    const p = join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await ficherosDeApp(p)));
    else salida.push('./' + relative(APP, p).split(/[\\/]/).join('/'));
  }
  return salida;
}

async function listaDePrecache() {
  const fuente = await readFile(join(APP, 'sw.js'), 'utf8');
  const bloque = fuente.match(/const PRECACHE = \[([\s\S]*?)\];/);
  assert.ok(bloque, 'no se encuentra el array PRECACHE en app/sw.js');
  return [...bloque[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

test('todo fichero de app/ está en PRECACHE', async () => {
  const enDisco = (await ficherosDeApp()).filter(
    (f) => !IGNORADOS.some((r) => r.test(f.slice(2)))
  );
  const enLista = new Set(await listaDePrecache());
  const faltan = enDisco.filter((f) => !enLista.has(f));
  assert.deepEqual(
    faltan,
    [],
    `sin red, estos ficheros no existirían:\n  ${faltan.join('\n  ')}`
  );
});

test('todo lo de PRECACHE existe en disco', async () => {
  const enDisco = new Set(await ficherosDeApp());
  const sobran = (await listaDePrecache()).filter(
    (f) => f !== './' && !enDisco.has(f)
  );
  /* Importa porque cache.addAll es atómico: un solo 404 y la instalación
     entera del worker falla, y la app se queda sin poder actualizarse. */
  assert.deepEqual(
    sobran,
    [],
    `un 404 aquí tumba la instalación completa del worker:\n  ${sobran.join('\n  ')}`
  );
});

test('PRECACHE no contiene ninguna ruta absoluta ni de otro origen', async () => {
  const malas = (await listaDePrecache()).filter((f) => !f.startsWith('./'));
  assert.deepEqual(
    malas,
    [],
    `rutas que romperían bajo el subdirectorio de GitHub Pages o dentro de Capacitor:\n  ${malas.join('\n  ')}`
  );
});

test('el manifest declara un icono maskable', async () => {
  const m = JSON.parse(await readFile(join(APP, 'manifest.webmanifest'), 'utf8'));
  const maskable = m.icons.filter((i) => (i.purpose ?? '').includes('maskable'));
  assert.ok(maskable.length > 0, 'sin maskable, Android recorta el icono a lo bruto');
});

test('manifest y service worker declaran el mismo nocturno', async () => {
  const m = JSON.parse(await readFile(join(APP, 'manifest.webmanifest'), 'utf8'));
  assert.equal(m.background_color, m.theme_color);

  /* Si el color del manifest no aparece en ninguna parte del CSS real, la
     pantalla de arranque parpadea en otro tono antes de pintar la app.
     Se mira en tokens.css si existe y, si no, en el index monolítico: sin este
     segundo sitio la prueba pasaría en vacío, que es peor que fallar. */
  const sitios = ['css/tokens.css', 'index.html'];
  const textos = await Promise.all(
    sitios.map((s) => readFile(join(APP, s), 'utf8').catch(() => null))
  );
  const existentes = textos.filter((t) => t !== null);
  assert.ok(existentes.length > 0, `no se encuentra ninguno de: ${sitios.join(', ')}`);
  assert.ok(
    existentes.some((t) => t.toLowerCase().includes(m.background_color.toLowerCase())),
    `${m.background_color} no aparece en ${sitios.join(' ni en ')}`
  );
});
