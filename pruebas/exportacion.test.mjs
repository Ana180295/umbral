import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  construirExportacion, leerExportacion, nombreDeFichero, VERSION_ESQUEMA
} from '../app/js/exportacion.js';

// Lista de campos escrita a mano, por separado del módulo — ver el
// comentario de la misma lista en exportacion.js.
const CAMPOS_CHECKIN = [
  'id', 'timestamp', 'zona', 'fecha_local',
  'descanso', 'energia', 'activacion', 'tono',
  'senal_corporal', 'necesidad',
  'accion_elegida', 'accion_resultado',
  'nota_libre'
];

const CHECKIN_COMPLETO = {
  id: 'c1', timestamp: 1755000000000, zona: 'Europe/Madrid',
  fecha_local: '2025-08-12', descanso: 3, energia: 2, activacion: 4, tono: 3,
  senal_corporal: ['tension'], necesidad: 'pausar',
  accion_elegida: 'respirar_cuatro', accion_resultado: null,
  nota_libre: 'un día largo'
};

const CONTEXTO = { timestamp: 1756208245000, zona: 'Europe/Madrid' }; // 26 ago 2026

test('1 — un checkin sin zona sale sin zona (null, no inventada)', () => {
  const sinZona = { ...CHECKIN_COMPLETO, zona: undefined };
  const exp = construirExportacion(null, [sinZona], CONTEXTO);
  assert.equal(exp.checkins[0].zona, null);
});

test('2 — todos los campos del esquema aparecen serializados, incluidos los nulos', () => {
  const vacio = { id: 'c2', timestamp: 1, zona: null, fecha_local: null };
  const exp = construirExportacion(null, [vacio], CONTEXTO);
  const claves = Object.keys(exp.checkins[0]).sort();
  assert.deepEqual(claves, [...CAMPOS_CHECKIN].sort());
  for (const campo of CAMPOS_CHECKIN) {
    if (campo === 'senal_corporal') continue; // ese es array, no puede ser null
    if (!(campo in vacio)) assert.equal(exp.checkins[0][campo], null, campo);
  }
});

test('3 — el nombre del fichero usa la fecha local, no la UTC', () => {
  // 01:30 en Europe/Madrid (CEST, UTC+2) del 12 de agosto de 2025 es
  // 2025-08-11 23:30 UTC — si se usara toISOString() saldría el día 11.
  const t = Date.UTC(2025, 7, 11, 23, 30, 0);
  const nombre = nombreDeFichero(t, 'Europe/Madrid');
  assert.equal(nombre, 'umbral-2025-08-12.json');
});

test('4 — no aparece cache_externa, ni epoca_utc, ni nada derivado', () => {
  const exp = construirExportacion(
    { fecha: '1995-02-18' }, [CHECKIN_COMPLETO], CONTEXTO
  );
  const json = JSON.stringify(exp);
  for (const prohibido of ['cache_externa', 'epoca_utc', 'epoca_aproximada', 'ultima_copia']) {
    assert.ok(!json.includes(prohibido), `no debería aparecer: ${prohibido}`);
  }
});

test('5 — un fichero de version_esquema mayor se rechaza y no devuelve nada', () => {
  const futuro = { formato: 'umbral-exportacion', version_esquema: VERSION_ESQUEMA + 1, checkins: [] };
  assert.throws(() => leerExportacion(futuro), /versión más nueva/);
});

test('6 — ida y vuelta: exportar → importar → exportar da el mismo objeto', () => {
  const perfil = { nombre_completo: 'Prueba', mote: 'P' };
  const exp1 = construirExportacion(perfil, [CHECKIN_COMPLETO], CONTEXTO);
  const leido = leerExportacion(JSON.parse(JSON.stringify(exp1)));
  const exp2 = construirExportacion(leido.perfil_local, leido.checkins, CONTEXTO);
  assert.deepEqual(exp1, exp2);
});

// --- pruebas adicionales, no de la especificación pero baratas de tener ---

test('extra — formato ajeno se rechaza', () => {
  assert.throws(() => leerExportacion({ formato: 'otra-cosa' }), /no es una copia de Umbral/);
});

test('extra — version_esquema igual o más vieja se acepta', () => {
  const vieja = { formato: 'umbral-exportacion', version_esquema: VERSION_ESQUEMA, checkins: [] };
  assert.doesNotThrow(() => leerExportacion(vieja));
});

test('extra — perfil_local ausente exporta null, no un objeto inventado', () => {
  const exp = construirExportacion(null, [], CONTEXTO);
  assert.equal(exp.perfil_local, null);
});

test('extra — senal_corporal ausente exporta array vacío, nunca null', () => {
  const sinSenal = { id: 'c3', timestamp: 1, zona: 'Europe/Madrid', fecha_local: '2026-01-01' };
  const exp = construirExportacion(null, [sinSenal], CONTEXTO);
  assert.deepEqual(exp.checkins[0].senal_corporal, []);
  assert.notEqual(exp.checkins[0].senal_corporal, null);
});
