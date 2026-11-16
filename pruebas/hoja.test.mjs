import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const A = createRequire(import.meta.url)('../app/js/vendor/astronomy.browser.min.js');

/* La hoja de cielo, ejecutada de verdad sobre la persona inventada de
   herramientas/datos-prueba.json — 15 de noviembre de 2026, pendiente 49.
   Reglas de forma que valen para toda la hoja y que se habían roto: los
   decimales con punto inglés, y una hora solar que podía escribir «:60». */

const raiz = fileURLToPath(new URL('..', import.meta.url));
const hoja = execFileSync(process.execPath, ['herramientas/hoja-de-cielo.mjs', 'herramientas/datos-prueba.json'], { cwd: raiz, encoding: 'utf8' });

test('1 — ningún número con punto decimal en toda la hoja', () => {
  /* Los números de versión («astronomy-engine 2.1.19») no son decimales:
     tres grupos separados por punto se quitan antes de mirar. */
  const malas = hoja.split('\n').filter((l) => /\d\.\d/.test(l.replace(/\d+\.\d+\.\d+/g, '')));
  assert.deepEqual(malas, []);
});

/* La hora solar, calculada aquí aparte con HourAngle y partida en minutos
   redondeados: lo que la hoja tiene que escribir. */
const BA = JSON.parse(fs.readFileSync(path.join(raiz, 'herramientas/datos-prueba.json'), 'utf8'));
const obsBA = new A.Observer(BA.lat, BA.lon, BA.altitud);
const minutosSolares = (ms) => Math.round(((A.HourAngle('Sun', A.MakeTime(new Date(ms)), obsBA) + 12) % 24) * 60) % 1440;
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const lineaSolar = (texto) => texto.split('\n').find((l) => l.startsWith('hora solar verdadera'));

test('2 — la hora solar de la hoja es la que da HourAngle, al minuto', () => {
  /* Buenos Aires va a UTC−3 todo el año 2001: 06:15 civil son 09:15 UT. */
  const esperada = hhmm(minutosSolares(Date.UTC(2001, 6, 9, 9, 15)));
  assert.equal(lineaSolar(hoja), `hora solar verdadera   ${esperada}`);
});

test('3 — cuando faltan menos de 30 s para la hora siguiente, sale la hora siguiente y no «:60»', () => {
  /* Se busca, en los días siguientes al de la ficha, una hora civil de
     minuto entero cuya hora solar caiga entre las HH:59:30 y las HH:59:59.
     La hoja solo acepta minutos enteros, así que el caso se fabrica. */
  let caso = null;
  for (let dia = 9; dia < 40 && !caso; dia++) {
    for (let m = 0; m < 1440 && !caso; m++) {
      const ms = Date.UTC(2001, 6, dia, 3, 0) + m * 60e3; /* 00:00 civil en Buenos Aires */
      const h = (A.HourAngle('Sun', A.MakeTime(new Date(ms)), obsBA) + 12) % 24;
      const resto = (h * 60) % 60;
      if (resto >= 59.5 && resto < 59.99) caso = ms;
    }
  }
  assert.ok(caso, 'no se encontró ningún minuto que caiga en el borde');
  const civil = new Date(caso - 3 * 3600e3);
  const datos = { ...BA, fecha: civil.toISOString().slice(0, 10), hora: civil.toISOString().slice(11, 16) };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hoja-'));
  const ficha = path.join(dir, 'datos.json');
  fs.writeFileSync(ficha, JSON.stringify(datos));
  const otra = execFileSync(process.execPath, ['herramientas/hoja-de-cielo.mjs', ficha], { cwd: raiz, encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true });
  const linea = lineaSolar(otra);
  assert.doesNotMatch(linea, /:60$/);
  assert.equal(linea, `hora solar verdadera   ${hhmm(minutosSolares(caso))}`);
});

test('4 — Quirón está en la hoja, y fuera de «lo que se veía»', () => {
  assert.match(hoja, /\| Quirón \| /);
  const primera = hoja.slice(0, hoja.indexOf('# SEGUNDA PARTE'));
  assert.doesNotMatch(primera, /Quirón/);
});
