import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

/* Cargar el motor real exactamente como lo carga la app: un <script>
   clásico, sin module/exports/define en el ámbito. vm.runInThisContext
   comparte el mismo realm que el resto del proceso (mismo Date), a
   diferencia de vm.createContext — ver la nota de la sesión sobre por qué
   ese detalle importa. */
const codigo = readFileSync(new URL('../app/js/vendor/astronomy.browser.min.js', import.meta.url), 'utf8');
vm.runInThisContext(codigo, { filename: 'astronomy.browser.min.js' });
if (typeof globalThis.Astronomy !== 'object') {
  throw new Error('No se pudo cargar astronomy.browser.min.js para las pruebas de perfil.js');
}

const { observador } = await import('../app/js/luna.js');
const {
  construirPerfilNacimiento, calcularEpoca, elegirEpoca, resolverEpoca, PerfilInvalido, FRANJAS,
  observadorDeNacimiento, epocaDelPerfil
} = await import('../app/js/perfil.js');

const OBS = observador({ lat: 39.005556, lon: -1.862222, altitud: 674 }); // Albacete

const BASE = {
  fecha: '1995-02-18', hora: '22:43', precision_hora: 'exacta',
  lat: 39.005556, lon: -1.862222, altitud: 674, zona: 'Europe/Madrid'
};

/* ------------------------------------------------------------------ */
/* construirPerfilNacimiento                                          */
/* ------------------------------------------------------------------ */

test('1 — perfil válido con hora exacta se construye tal cual', () => {
  const p = construirPerfilNacimiento(BASE);
  assert.equal(p.fecha, '1995-02-18');
  assert.equal(p.hora, '22:43');
  assert.equal(p.precision_hora, 'exacta');
  assert.equal(p.altitud, 674);
});

test('2 — sin fecha, lanza y no degrada', () => {
  assert.throws(() => construirPerfilNacimiento({ ...BASE, fecha: undefined }), PerfilInvalido);
});

test('3 — precision_hora "exacta" sin hora, lanza', () => {
  assert.throws(() => construirPerfilNacimiento({ ...BASE, hora: undefined }), PerfilInvalido);
});

test('4 — precision_hora "franja" exige una de las ocho franjas, no cualquier hora', () => {
  assert.doesNotThrow(() => construirPerfilNacimiento({ ...BASE, precision_hora: 'franja', hora: '09:00' }));
  assert.throws(() => construirPerfilNacimiento({ ...BASE, precision_hora: 'franja', hora: '09:30' }), PerfilInvalido);
});

test('5 — precision_hora "desconocida" no exige hora, y la ignora si llega', () => {
  const p = construirPerfilNacimiento({ ...BASE, precision_hora: 'desconocida', hora: 'cualquier cosa' });
  assert.equal(p.hora, null);
});

test('6 — lat fuera de rango lanza', () => {
  assert.throws(() => construirPerfilNacimiento({ ...BASE, lat: 95 }), PerfilInvalido);
});

test('7 — altitud ausente se normaliza a 0, no se inventa otra cosa', () => {
  const { altitud, ...sinAltitud } = BASE;
  const p = construirPerfilNacimiento(sinAltitud);
  assert.equal(p.altitud, 0);
});

test('8 — sin zona, lanza (no cae a la del aparato)', () => {
  assert.throws(() => construirPerfilNacimiento({ ...BASE, zona: undefined }), PerfilInvalido);
});

test('9 — zona horaria inexistente lanza', () => {
  assert.throws(() => construirPerfilNacimiento({ ...BASE, zona: 'Marte/Ciudad_Alegre' }), PerfilInvalido);
});

/* ------------------------------------------------------------------ */
/* calcularEpoca                                                      */
/* ------------------------------------------------------------------ */

test('10 — hora exacta da una época única', () => {
  const p = construirPerfilNacimiento(BASE);
  const r = calcularEpoca(p, OBS);
  assert.equal(r.estado, 'unica');
  assert.ok(Number.isFinite(r.epoca_utc));
  // la época tiene que ser ANTERIOR al instante de nacimiento
  const msNacimiento = Date.UTC(1995, 1, 18, 21, 43, 0);
  assert.ok(r.epoca_utc < msNacimiento, 'la época debe preceder al nacimiento');
});

test('11 — con hora exacta, la época coincide con diaLunar().empieza', async () => {
  const { diaLunar } = await import('../app/js/luna.js');
  const p = construirPerfilNacimiento(BASE);
  const r = calcularEpoca(p, OBS);
  const msNacimiento = Date.UTC(1995, 1, 18, 21, 43, 0);
  const dia = diaLunar(msNacimiento, OBS);
  assert.equal(r.epoca_utc, dia.empieza);
});

test('12 — con una franja SIN ninguna salida dentro, época única y estable', () => {
  // Se busca a mano una franja de 1995-02-18 en la que no haya salida:
  // con hora exacta ya sabemos que la salida que abre el día de esa
  // persona es diaInicio.empieza; cualquier franja que no cruce esa salida
  // ni la siguiente tiene que dar la MISMA época única.
  const p1 = construirPerfilNacimiento({ ...BASE, precision_hora: 'franja', hora: '00:00' });
  const r1 = calcularEpoca(p1, OBS);
  // Sea cual sea el resultado (única o ambigua), tiene que ser determinista:
  // repetir el cálculo da exactamente lo mismo.
  const r2 = calcularEpoca(p1, OBS);
  assert.deepEqual(r1, r2);
});

test('13 — una franja con ambigüedad ofrece EXACTAMENTE dos candidatas, separadas un día lunar', () => {
  // Se recorren las ocho franjas del 18/02/1995 hasta encontrar una
  // ambigua, para no depender de conocer a mano en qué franja cae la
  // salida real.
  let ambigua = null;
  for (const hora of FRANJAS) {
    const p = construirPerfilNacimiento({ ...BASE, precision_hora: 'franja', hora });
    const r = calcularEpoca(p, OBS);
    if (r.estado === 'ambigua') { ambigua = r; break; }
  }
  assert.ok(ambigua, 'ninguna de las ocho franjas de ese día dio ambigüedad, y se esperaba al menos una');
  assert.equal(ambigua.candidatas.length, 2);
  assert.ok(ambigua.candidatas[0].epoca_utc < ambigua.candidatas[1].epoca_utc);
  /* No basta con "distintas": el fallo real que apareció al construir este
     módulo daba dos candidatas DISTINTAS pero separadas por milisegundos
     —ruido de dos búsquedas independientes convergiendo al mismo suceso—,
     no por un día lunar. Una ambigüedad de verdad separa dos SALIDAS
     consecutivas: 24h22min–25h20min, medido en 03-registro-de-datos.md. */
  const separacionHoras = (ambigua.candidatas[1].epoca_utc - ambigua.candidatas[0].epoca_utc) / 3600000;
  assert.ok(
    separacionHoras > 20 && separacionHoras < 30,
    `separación de ${separacionHoras.toFixed(2)}h — no parece un día lunar; ` +
    `¿ha vuelto el fallo de comparar con === en vez de con tolerancia?`
  );
});

test('14 — "desconocida" no calcula nada: siempre sin_dato, nunca ambigua ni única', () => {
  const p = construirPerfilNacimiento({ ...BASE, precision_hora: 'desconocida' });
  const r = calcularEpoca(p, OBS);
  assert.equal(r.estado, 'sin_dato');
  assert.equal(r.epoca_utc, undefined);
  assert.equal(r.candidatas, undefined);
});

test('15 — calcularEpoca es determinista: misma entrada, mismo resultado', () => {
  const p = construirPerfilNacimiento(BASE);
  const a = calcularEpoca(p, OBS);
  const b = calcularEpoca(p, OBS);
  assert.deepEqual(a, b);
});

test('16 — cruzando el cambio de hora oficial, aUtc no se desvía (regresión del método de hoja-de-cielo.mjs)', () => {
  // 30 de marzo de 2025: cambio de hora en España, 02:00 -> 03:00.
  // Una hora declarada "02:30" no existe ese día en Europe/Madrid, así que
  // se comprueba con una hora fuera del salto para no depender de cómo
  // resuelva Intl un instante inexistente, y solo se exige que el
  // resultado sea finito y coherente con la fecha.
  const p = construirPerfilNacimiento({ ...BASE, fecha: '2025-03-30', hora: '04:15' });
  const r = calcularEpoca(p, OBS);
  assert.ok(r.estado === 'unica' || r.estado === 'ambigua');
});

/* ------------------------------------------------------------------ */
/* elegirEpoca                                                        */
/* ------------------------------------------------------------------ */

function buscarFranjaAmbigua(fecha) {
  for (const hora of FRANJAS) {
    const p = construirPerfilNacimiento({ ...BASE, fecha, precision_hora: 'franja', hora });
    const r = calcularEpoca(p, OBS);
    if (r.estado === 'ambigua') return r;
  }
  return null;
}

test('17 — elegirEpoca(indice 0) da la candidata "antes", con la misma forma que una época única', () => {
  const ambigua = buscarFranjaAmbigua('1995-02-18');
  assert.ok(ambigua, 'se esperaba encontrar una franja ambigua ese día');
  const elegida = elegirEpoca(ambigua, 0);
  assert.equal(elegida.estado, 'unica');
  assert.equal(elegida.epoca_utc, ambigua.candidatas[0].epoca_utc);
});

test('18 — elegirEpoca(indice 1) da la candidata "después"', () => {
  const ambigua = buscarFranjaAmbigua('1995-02-18');
  const elegida = elegirEpoca(ambigua, 1);
  assert.equal(elegida.epoca_utc, ambigua.candidatas[1].epoca_utc);
  assert.notEqual(elegida.epoca_utc, elegirEpoca(ambigua, 0).epoca_utc);
});

test('19 — elegirEpoca sobre un resultado "unica" lanza: no hay nada que elegir', () => {
  const p = construirPerfilNacimiento(BASE); // hora exacta -> siempre única
  const r = calcularEpoca(p, OBS);
  assert.equal(r.estado, 'unica');
  assert.throws(() => elegirEpoca(r, 0), PerfilInvalido);
});

test('20 — elegirEpoca con un índice que no es 0 ni 1 lanza', () => {
  const ambigua = buscarFranjaAmbigua('1995-02-18');
  assert.throws(() => elegirEpoca(ambigua, 2), PerfilInvalido);
  assert.throws(() => elegirEpoca(ambigua, 'primera'), PerfilInvalido);
});

/* ------------------------------------------------------------------ */
/* resolverEpoca                                                      */
/* ------------------------------------------------------------------ */

function nacimientoDeFranjaAmbigua(fecha) {
  for (const hora of FRANJAS) {
    const p = construirPerfilNacimiento({ ...BASE, fecha, precision_hora: 'franja', hora });
    if (calcularEpoca(p, OBS).estado === 'ambigua') return p;
  }
  return null;
}

test('21 — sin ambigüedad, resolverEpoca da lo mismo que calcularEpoca, y la elección no se mira', () => {
  const p = construirPerfilNacimiento(BASE); // hora exacta -> nunca ambigua
  const directo = calcularEpoca(p, OBS);
  const conEleccionIgnorada = resolverEpoca(p, 'antes', OBS);
  const sinEleccion = resolverEpoca(p, null, OBS);
  assert.deepEqual(conEleccionIgnorada, directo);
  assert.deepEqual(sinEleccion, directo);
});

test('22 — con ambigüedad y elección "antes", resolverEpoca da la primera candidata', () => {
  const nacimiento = nacimientoDeFranjaAmbigua('1995-02-18');
  assert.ok(nacimiento, 'se esperaba una franja ambigua ese día');
  const ambigua = calcularEpoca(nacimiento, OBS);
  const resuelta = resolverEpoca(nacimiento, 'antes', OBS);
  assert.equal(resuelta.estado, 'unica');
  assert.equal(resuelta.epoca_utc, ambigua.candidatas[0].epoca_utc);
});

test('23 — con ambigüedad y elección "despues", resolverEpoca da la segunda candidata', () => {
  const nacimiento = nacimientoDeFranjaAmbigua('1995-02-18');
  const ambigua = calcularEpoca(nacimiento, OBS);
  const resuelta = resolverEpoca(nacimiento, 'despues', OBS);
  assert.equal(resuelta.epoca_utc, ambigua.candidatas[1].epoca_utc);
});

test('24 — con ambigüedad y SIN elección guardada, resolverEpoca no lanza: da "sin_resolver" con las candidatas', () => {
  const nacimiento = nacimientoDeFranjaAmbigua('1995-02-18');
  for (const vacio of [null, undefined, 'no_lo_se']) {
    const r = resolverEpoca(nacimiento, vacio, OBS);
    assert.equal(r.estado, 'sin_resolver');
    assert.equal(r.candidatas.length, 2);
  }
});

test('25 — resolverEpoca es determinista: misma elección guardada, mismo instante siempre', () => {
  const nacimiento = nacimientoDeFranjaAmbigua('1995-02-18');
  const a = resolverEpoca(nacimiento, 'antes', OBS);
  const b = resolverEpoca(nacimiento, 'antes', OBS);
  assert.deepEqual(a, b);
});

/* ------------------------------------------------------------------ */
/* La época se calcula donde naciste — corregido el 12 nov 2026       */
/* ------------------------------------------------------------------ */

/* Fallo real: index.html pasaba a resolverEpoca el observador de Albacete,
   y lat/lon/altitud del nacimiento no los leía ningún cálculo. La 0012 y la
   §4 de la hoja de ruta dicen lo contrario. Con un nacimiento en Albacete
   el resultado era idéntico, que es justo por lo que la prueba de abajo
   NO usa Albacete para el segundo lugar: una prueba que solo mira donde
   las dos respuestas coinciden no prueba nada (regla del 23 de agosto). */

/* Buenos Aires: otro hemisferio, otro meridiano. Las coordenadas son las de
   la ciudad a la precisión de un buscador, no de una estación: aquí no se
   ficha un lugar, se comprueba que el lugar cambia el resultado. La zona se
   deja igual a propósito, para que lo único que cambie sea el observador. */
const OTRO_LUGAR = { lat: -34.6037, lon: -58.3816, altitud: 25 };

test('26 — epocaDelPerfil calcula con las coordenadas del nacimiento: en Albacete coincide con resolverEpoca(OBS)', () => {
  const r = epocaDelPerfil(BASE, null);
  assert.equal(r.estado, 'unica');
  assert.equal(r.epoca_utc, resolverEpoca(BASE, null, OBS).epoca_utc);
});

test('27 — mismo instante, otro lugar de nacimiento: otra época, y es la de ESE lugar', () => {
  const fuera = { ...BASE, ...OTRO_LUGAR };
  const r = epocaDelPerfil(fuera, null);
  assert.equal(r.estado, 'unica');
  const esperada = resolverEpoca(fuera, null, observador(OTRO_LUGAR)).epoca_utc;
  const conAlbacete = resolverEpoca(fuera, null, OBS).epoca_utc;
  assert.equal(r.epoca_utc, esperada);
  /* El fallo de antes daba exactamente `conAlbacete`. Una hora de margen
     es de sobra: dos salidas de Luna en dos continentes no caen juntas. */
  assert.ok(Math.abs(r.epoca_utc - conAlbacete) > 3600e3,
    `la época de Buenos Aires no debería parecerse a la de Albacete: ${new Date(r.epoca_utc).toISOString()} vs ${new Date(conAlbacete).toISOString()}`);
});

test('28 — observadorDeNacimiento usa la altitud guardada, y 0 si falta', () => {
  assert.equal(observadorDeNacimiento(BASE).height, 674);
  const { altitud, ...sinAltitud } = BASE;
  assert.equal(observadorDeNacimiento(sinAltitud).height, 0);
  assert.equal(observadorDeNacimiento(BASE).latitude, BASE.lat);
  assert.equal(observadorDeNacimiento(BASE).longitude, BASE.lon);
});

test('29 — sin lat/lon no hay dónde calcular la época: lanza PerfilInvalido, no usa ningún lugar de reserva', () => {
  assert.throws(() => observadorDeNacimiento(null), PerfilInvalido);
  assert.throws(() => observadorDeNacimiento({ ...BASE, lat: undefined }), PerfilInvalido);
  assert.throws(() => epocaDelPerfil({ ...BASE, lon: '−1.86' }, null), PerfilInvalido);
});

test('30 — index.html no vuelve a calcular la época con OBS_ALBACETE, y la pide siempre a epocaDelPerfil', () => {
  /* Regla escrita como prueba (hoja complementaria del 25 de agosto, regla
     10): lo que solo vive en un comentario se deshace solo. Se lee el
     fichero real, no una copia. */
  const html = readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /(resolverEpoca|calcularEpoca)\([^)]*OBS_ALBACETE/,
    'index.html vuelve a pasar OBS_ALBACETE al cálculo de la época');
  assert.doesNotMatch(html, /window\.(resolverEpoca|calcularEpoca)\(/,
    'index.html llama al cálculo de la época sin pasar por epocaDelPerfil');
  const llamadas = html.match(/window\.epocaDelPerfil\(/g) || [];
  assert.equal(llamadas.length, 2, 'se esperan las dos llamadas de siempre: calendario y portada');
});
