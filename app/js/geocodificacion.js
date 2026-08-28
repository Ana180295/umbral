/* =====================================================================
   Umbral — resolver una localidad por su nombre  ·  app/js/geocodificacion.js

   Compañero de perfil.js. Nace la noche del 27-28 de agosto de 2026 al
   decidir la Opción B para el lugar de nacimiento: la persona escribe el
   nombre de la localidad, no lat/lon/altitud a mano. Se resuelve una vez,
   con red, en el momento de crear el perfil — nunca más después. Las
   coordenadas resultantes se guardan fijas junto al nombre (perfil.js,
   campo `localidad`); no se vuelven a pedir con red aunque cambie el
   proveedor o su base de datos algún día.

   IMPURO A PROPÓSITO. A diferencia de perfil.js y luna.js, esto SÍ toca la
   red: es la mitad que ellos declaran explícitamente que no hacen. Por
   eso vive en su propio fichero y no dentro de perfil.js, que quiere
   seguir siendo puro y comprobable sin red ni dobles.

   PROVEEDOR: Open-Meteo Geocoding API — https://open-meteo.com/en/docs/geocoding-api
   Elegido por tres motivos comprobados el 27-28 de agosto de 2026:
     · Sin clave, sin registro, con CORS — la única familia de opciones que
       funciona desde un fetch() del navegador sin backend propio, que es
       justo la arquitectura de Umbral.
     · Devuelve nombre, lat, lon Y ELEVACIÓN en la misma llamada — ninguna
       segunda petición hace falta para la altitud que pide el `Observer`.
     · Ya es un proveedor presente en el proyecto (sw.js, comentario de la
       regla dura de caché, lo nombra junto a GFZ y AEMET): no es una
       dependencia nueva de cero, es la misma familia que ya se usa para
       otros datos externos.

   ATRIBUCIÓN PENDIENTE DE COLOCAR EN PANTALLA: los datos de localización
   de esta API son de GeoNames, bajo licencia CC BY 4.0, que exige
   atribución. Mismo tipo de obligación que ya cumple OFL.txt con la
   tipografía (decisión 0016 §5): tiene que verse en algún sitio, sin
   depender de red. Dónde exactamente en la pantalla es una decisión de
   diseño que no me corresponde tomar sola — anotado, sin resolver.

   FORMA DE LA RESPUESTA, calcada a propósito de calcularEpoca/elegirEpoca
   de perfil.js, para que quien lea el código reconozca el mismo patrón de
   ambigüedad-que-elige-la-persona:
     estado: "unica"       — una sola coincidencia, en `candidatas[0]`
     estado: "ambigua"     — más de una coincidencia; la persona elige con
                              elegirLocalidad(resultado, indice)
     estado: "sin_dato"    — ninguna coincidencia, o el nombre no tiene
                              longitud suficiente para buscar
     estado: "sin_conexion"— la petición de red falló o no llegó respuesta
   ===================================================================== */

const ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

/* Construye el texto que se enseña y se guarda: nombre + provincia/región
   (admin1, si existe) + país. GeoNames no siempre tiene admin1 (algunas
   ciudades-estado no lo tienen), así que se descarta lo que falte en vez
   de dejar una coma colgada. */
function nombreVisible(resultado) {
  return [resultado.name, resultado.admin1, resultado.country]
    .filter((parte) => typeof parte === 'string' && parte.length > 0)
    .join(', ');
}

/* Busca una localidad por nombre. `fetchImpl` entra por parámetro —igual
   que timestamp entra por parámetro en luna.js— para poder sustituirlo en
   las pruebas por un doble que no toca la red de verdad. */
export async function buscarLocalidad(nombre, fetchImpl = fetch) {
  if (typeof nombre !== 'string' || nombre.trim().length < 2) {
    return { estado: 'sin_dato', motivo: 'escribe al menos dos caracteres' };
  }

  const url = `${ENDPOINT}?name=${encodeURIComponent(nombre.trim())}&count=5&language=es`;

  let respuesta;
  try {
    respuesta = await fetchImpl(url);
  } catch {
    return { estado: 'sin_conexion' };
  }
  if (!respuesta || !respuesta.ok) {
    return { estado: 'sin_conexion' };
  }

  let datos;
  try {
    datos = await respuesta.json();
  } catch {
    return { estado: 'sin_conexion' };
  }

  const resultados = Array.isArray(datos.results) ? datos.results : [];
  if (resultados.length === 0) {
    return { estado: 'sin_dato', motivo: 'ninguna localidad encontrada con ese nombre' };
  }

  const candidatas = resultados.map((r) => ({
    localidad: nombreVisible(r),
    lat: r.latitude,
    lon: r.longitude,
    /* GeoNames no tiene elevación para todo punto del planeta; cuando
       falta, 0 es el mismo valor por defecto que ya usa
       construirPerfilNacimiento para "altitud ausente", así que no se
       introduce un segundo significado de "cero" en el proyecto. */
    altitud: typeof r.elevation === 'number' ? r.elevation : 0,
    poblacion: typeof r.population === 'number' ? r.population : null
  }));

  return candidatas.length === 1
    ? { estado: 'unica', candidatas }
    : { estado: 'ambigua', candidatas };
}

/* La persona elige una de las candidatas que devolvió buscarLocalidad en
   estado "ambigua" — mismo papel que elegirEpoca cumple para las dos
   fechas posibles de perfil.js. */
export function elegirLocalidad(resultado, indice) {
  if (resultado === null || typeof resultado !== 'object' || !Array.isArray(resultado.candidatas)) {
    throw new Error('elegirLocalidad necesita un resultado de buscarLocalidad con candidatas');
  }
  if (!Number.isInteger(indice) || indice < 0 || indice >= resultado.candidatas.length) {
    throw new Error(`elegirLocalidad: índice ${indice} fuera de rango (hay ${resultado.candidatas.length} candidatas)`);
  }
  return resultado.candidatas[indice];
}

if (typeof window !== 'undefined') {
  window.buscarLocalidad = buscarLocalidad;
  window.elegirLocalidad = elegirLocalidad;
}
