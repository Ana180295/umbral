// app/js/exportacion.js — construye y lee la copia local de los registros.
// Dos funciones puras: construirExportacion y leerExportacion. Ninguna toca
// IndexedDB ni el sistema de ficheros: reciben datos ya leídos y devuelven
// datos para que quien las llama decida qué hacer con ellos.
//
// REGLA 0.1: no se inventa nada. Lo que no está en las entradas, no se
// escribe. Un campo ausente se serializa como `null`, nunca se omite y nunca
// se sustituye por un valor por defecto.
//
// Especificación cerrada el 23 de agosto de 2026 (Lote 3, punto 1).

import { fechaLocalDe, CAMPOS } from './registro.js';

export const VERSION_ESQUEMA = 1;
export const ORIGEN = 'https://ana180295.github.io/umbral/app/';

function limpiarCheckin(c) {
  const limpio = {};
  for (const campo of CAMPOS) {
    limpio[campo] = c[campo] !== undefined ? c[campo] : null;
  }
  // senal_corporal es un array siempre, nunca null (mismo criterio que
  // construirRegistro): ["nada_especial"] es explícito, [] es silencio.
  limpio.senal_corporal = Array.isArray(c.senal_corporal) ? c.senal_corporal : [];
  return limpio;
}

/**
 * Construye el objeto de exportación a partir de lo ya leído de IndexedDB.
 * No lee nada por sí misma: es pura.
 *
 * @param {object|null} perfilLocal - el contenido de perfil_local, o null
 *   si todavía no existe (nunca se ha pedido el perfil de nacimiento).
 * @param {Array<object>} checkins - todos los checkins, sin filtrar.
 * @param {{timestamp:number, zona:string}} contexto - el instante y la zona
 *   en que se hace la exportación. Ni Date.now() ni la zona del dispositivo
 *   se leen dentro de esta función: son impuras y la harían imposible de
 *   probar deterministamente, igual que construirRegistro.
 */
export function construirExportacion(perfilLocal, checkins, contexto) {
  const { timestamp, zona } = contexto;
  return {
    formato: 'umbral-exportacion',
    version_esquema: VERSION_ESQUEMA,
    exportado_en: new Date(timestamp).toISOString(),
    zona_exportacion: zona,
    origen: ORIGEN,
    perfil_local: perfilLocal ?? null,
    checkins: (checkins ?? []).map(limpiarCheckin)
  };
}

/**
 * Nombre del fichero de exportación. Usa fecha local, nunca toISOString():
 * a la 01:30 en Madrid la fecha UTC ya es la de ayer.
 */
export function nombreDeFichero(timestamp, zona) {
  return `umbral-${fechaLocalDe(timestamp, zona)}.json`;
}

/**
 * Lee un objeto de exportación ya parseado (JSON.parse ya hecho por quien
 * llama). No escribe nada en IndexedDB: solo valida y devuelve, o lanza.
 * "O entra el fichero entero o no entra nada" se cumple porque un throw no
 * devuelve datos parciales para que nadie los escriba por error.
 *
 * @throws {Error} si el fichero no es de Umbral, o si su version_esquema
 *   es más nueva que la que esta app entiende.
 */
export function leerExportacion(objeto) {
  if (!objeto || typeof objeto !== 'object' || objeto.formato !== 'umbral-exportacion') {
    throw new Error('Este fichero no es una copia de Umbral.');
  }
  if (typeof objeto.version_esquema !== 'number') {
    throw new Error('El fichero no declara version_esquema.');
  }
  if (objeto.version_esquema > VERSION_ESQUEMA) {
    throw new Error(
      `Este fichero es de una versión más nueva (${objeto.version_esquema}) que ` +
      `la que esta app entiende (${VERSION_ESQUEMA}). No se importa nada.`
    );
  }
  // version_esquema igual o más vieja: se importa. Los campos ausentes de
  // una versión más vieja se quedan ausentes — no se rellenan con nada.
  return {
    version_esquema: objeto.version_esquema,
    perfil_local: objeto.perfil_local ?? null,
    checkins: Array.isArray(objeto.checkins) ? objeto.checkins : []
  };
}

if (typeof window !== 'undefined') {
  window.construirExportacion = construirExportacion;
  window.nombreDeFichero = nombreDeFichero;
  window.leerExportacion = leerExportacion;
}
