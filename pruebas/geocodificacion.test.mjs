import { test } from 'node:test';
import assert from 'node:assert/strict';

/* Pruebas de app/js/geocodificacion.js — pendiente desde el 28 de agosto de
   2026, cuando el módulo se probó contra la API real con arneses sueltos y
   ninguno se guardó en el repositorio.

   AQUÍ NO SE TOCA LA RED. buscarLocalidad recibe `fetchImpl` por parámetro
   (cabecera del módulo) y se le pasa un doble que devuelve respuestas con la
   forma de la de Open-Meteo: name, latitude, longitude, elevation,
   population, admin1, country, timezone. Lo que se prueba es qué hace el
   módulo con cada respuesta, no lo que responde Open-Meteo: eso se probó
   contra la API real el 28 de agosto y está en la decisión 0025. Si
   Open-Meteo cambiara la forma de su respuesta, estas pruebas seguirían en
   verde — es el límite conocido de probar con dobles, y se dice. */

const { buscarLocalidad, elegirLocalidad } = await import('../app/js/geocodificacion.js');

/* Un doble de fetch que apunta qué URL se le pidió y cuántas veces. */
function dobleFetch(cuerpo, { ok = true, lanza = false, jsonLanza = false } = {}) {
  const llamadas = [];
  const fn = async (url) => {
    llamadas.push(url);
    if (lanza) throw new TypeError('Failed to fetch');
    return {
      ok,
      json: async () => {
        if (jsonLanza) throw new SyntaxError('Unexpected token < in JSON');
        return cuerpo;
      }
    };
  };
  fn.llamadas = llamadas;
  return fn;
}

const ALBACETE = {
  name: 'Albacete', latitude: 38.99424, longitude: -1.85643, elevation: 686,
  population: 169716, admin1: 'Castilla-La Mancha', country: 'España',
  timezone: 'Europe/Madrid'
};
const AEROPUERTO = {
  name: 'Aeropuerto de Albacete', latitude: 38.94853, longitude: -1.86352, elevation: 702,
  admin1: 'Castilla-La Mancha', country: 'España', timezone: 'Europe/Madrid'
};

/* ------------------------------------------------------------------ */

test('1 — menos de dos caracteres: sin_dato, y NO se llama a la red', async () => {
  for (const nombre of ['', ' ', 'A', '  b  ', null, undefined, 42]) {
    const f = dobleFetch({ results: [ALBACETE] });
    const r = await buscarLocalidad(nombre, f);
    assert.equal(r.estado, 'sin_dato', `nombre ${JSON.stringify(nombre)}`);
    assert.equal(f.llamadas.length, 0, `nombre ${JSON.stringify(nombre)} no debería tocar la red`);
  }
});

test('2 — la URL: nombre recortado y codificado, cinco resultados, en español', async () => {
  const f = dobleFetch({ results: [ALBACETE] });
  await buscarLocalidad('  San José de la Rinconada ', f);
  assert.equal(f.llamadas.length, 1);
  const url = new URL(f.llamadas[0]);
  assert.equal(url.origin + url.pathname, 'https://geocoding-api.open-meteo.com/v1/search');
  assert.equal(url.searchParams.get('name'), 'San José de la Rinconada');
  assert.equal(url.searchParams.get('count'), '5');
  assert.equal(url.searchParams.get('language'), 'es');
  assert.ok(f.llamadas[0].includes('San%20Jos%C3%A9'), 'el nombre tiene que ir codificado en la URL');
});

test('3 — sin red: tres formas de fallar, las tres dan sin_conexion y ninguna inventa nada', async () => {
  for (const [motivo, f] of [
    ['fetch lanza', dobleFetch(null, { lanza: true })],
    ['respuesta no ok', dobleFetch({ results: [ALBACETE] }, { ok: false })],
    ['el cuerpo no es JSON', dobleFetch(null, { jsonLanza: true })]
  ]) {
    const r = await buscarLocalidad('Albacete', f);
    assert.deepEqual(r, { estado: 'sin_conexion' }, motivo);
  }
});

test('4 — la búsqueda funciona y no hay nada: sin_dato, que no es lo mismo que sin_conexion', async () => {
  for (const cuerpo of [{ results: [] }, {}, { results: null }, { generationtime_ms: 0.4 }]) {
    const r = await buscarLocalidad('Xyzzyqwerty', dobleFetch(cuerpo));
    assert.equal(r.estado, 'sin_dato', JSON.stringify(cuerpo));
  }
});

test('5 — una sola coincidencia: unica, con los seis campos de la candidata', async () => {
  const r = await buscarLocalidad('Albacete', dobleFetch({ results: [ALBACETE] }));
  assert.equal(r.estado, 'unica');
  assert.equal(r.candidatas.length, 1);
  assert.deepEqual(r.candidatas[0], {
    localidad: 'Albacete, Castilla-La Mancha, España',
    lat: 38.99424,
    lon: -1.85643,
    altitud: 686,
    poblacion: 169716,
    zona: 'Europe/Madrid'
  });
});

test('6 — varias coincidencias: ambigua, en el mismo orden en que llegan', async () => {
  const r = await buscarLocalidad('Albacete', dobleFetch({ results: [ALBACETE, AEROPUERTO] }));
  assert.equal(r.estado, 'ambigua');
  assert.deepEqual(r.candidatas.map(c => c.localidad), [
    'Albacete, Castilla-La Mancha, España',
    'Aeropuerto de Albacete, Castilla-La Mancha, España'
  ]);
});

test('7 — lo que GeoNames no tiene: altitud 0 (el mismo cero que usa perfil.js), población null, sin coma colgada', async () => {
  const sinNada = { name: 'Singapur', latitude: 1.28967, longitude: 103.85007, country: 'Singapur', timezone: 'Asia/Singapore' };
  const r = await buscarLocalidad('Singapur', dobleFetch({ results: [sinNada] }));
  const c = r.candidatas[0];
  assert.equal(c.localidad, 'Singapur, Singapur');
  assert.equal(c.altitud, 0);
  assert.equal(c.poblacion, null);
  /* Un admin1 vacío tampoco deja coma colgada. */
  const vacio = await buscarLocalidad('Singapur', dobleFetch({ results: [{ ...sinNada, admin1: '' }] }));
  assert.equal(vacio.candidatas[0].localidad, 'Singapur, Singapur');
});

/* --- la zona horaria, decisión 0027 -------------------------------- */

test('8 — la zona de la localidad viaja en la candidata, también fuera del huso del aparato', async () => {
  const baires = { name: 'Buenos Aires', latitude: -34.61315, longitude: -58.37723, elevation: 25,
    country: 'Argentina', admin1: 'Buenos Aires F.D.', timezone: 'America/Argentina/Buenos_Aires' };
  const r = await buscarLocalidad('Buenos Aires', dobleFetch({ results: [baires] }));
  assert.equal(r.candidatas[0].zona, 'America/Argentina/Buenos_Aires');
});

test('9 — sin timezone, o con uno que el navegador no reconoce: zona null, nunca una supuesta', async () => {
  for (const tz of [undefined, null, '', '   ', 42, 'Marte/Olympus_Mons', 'GMT+99']) {
    const r = await buscarLocalidad('Albacete', dobleFetch({ results: [{ ...ALBACETE, timezone: tz }] }));
    assert.equal(r.candidatas[0].zona, null, `timezone ${JSON.stringify(tz)}`);
  }
});

/* --- elegirLocalidad ------------------------------------------------ */

test('10 — elegirLocalidad devuelve la candidata elegida, tal cual', async () => {
  const r = await buscarLocalidad('Albacete', dobleFetch({ results: [ALBACETE, AEROPUERTO] }));
  assert.equal(elegirLocalidad(r, 1), r.candidatas[1]);
  assert.equal(elegirLocalidad(r, 0).zona, 'Europe/Madrid');
});

test('11 — elegirLocalidad lanza con un índice imposible o sin resultado que elegir', async () => {
  const r = await buscarLocalidad('Albacete', dobleFetch({ results: [ALBACETE, AEROPUERTO] }));
  for (const i of [-1, 2, 0.5, '0', null, undefined, NaN]) {
    assert.throws(() => elegirLocalidad(r, i), `índice ${JSON.stringify(i)}`);
  }
  assert.throws(() => elegirLocalidad(null, 0));
  assert.throws(() => elegirLocalidad({ estado: 'sin_dato' }, 0));
});
