/* =====================================================================
   Umbral — el perfil de nacimiento  ·  app/js/perfil.js

   Decisión 0022 (26 de agosto de 2026): cuándo y cómo se pide el perfil de
   nacimiento. Este módulo es la mitad que no depende de ninguna pantalla:
   dos funciones puras.

   construirPerfilNacimiento(entradas)
     Valida y normaliza los siete campos del bloque A2 de
     02-inventario-de-datos.md: fecha, hora, precision_hora, lat, lon,
     altitud, zona. Mismo criterio que construirRegistro: un valor
     imposible LANZA, no se degrada.

   `localidad` (nuevo, 28 de agosto de 2026 — Opción B para el lugar de
   nacimiento, decisión sin numerar todavía). NO participa en ningún
   cálculo: lat/lon/altitud siguen siendo las entradas que usa el
   Observer. Es solo el nombre que se enseña, y se guarda como entrada
   —no se recalcula— porque una geocodificación inversa de las mismas
   coordenadas no tiene por qué devolver el mismo texto que se buscó.
   Opcional: ausente o null es válido, para no romper ningún perfil
   guardado antes de esta noche y para la ruta manual de coordenadas a
   mano, que puede no tener nombre. Se resuelve con red UNA VEZ, fuera de
   este módulo — ver app/js/geocodificacion.js, que sigue siendo el único
   sitio de los dos que toca la red.
   Ya está en 02-inventario-de-datos.md (A2, ocho campos) y en la
   decisión 0025, las dos del 28 de agosto.

   `zona` (12 de noviembre de 2026, decisión 0027): ya no es la del
   aparato salvo como reserva. La pone la geocodificación, con el campo
   `timezone` que Open-Meteo devuelve junto a las coordenadas; si la
   búsqueda no la da, la pantalla usa la del aparato. Este módulo no
   distingue un caso del otro —valida una zona IANA, venga de donde
   venga—: esa distinción vive en geocodificacion.js y en la pantalla.

   calcularEpoca(nacimiento, obs)
     La época personal: la última salida de la Luna anterior al
     nacimiento. No reinventa la búsqueda — reutiliza diaLunar() de
     luna.js, cuyo campo `empieza` YA es exactamente ese dato.

   Ninguna de las dos toca IndexedDB, el DOM ni el reloj del sistema.
   Todo entra por parámetro, para que se puedan probar.

   LA AMBIGÜEDAD (pendiente 20.3, la única franja que el proyecto ha
   decidido cómo tratar). Con precision_hora "franja" (3h): si ninguna
   salida de Luna cae dentro de la ventana no hay ambigüedad. Si cae una,
   hay dos épocas posibles según naciste antes o después de esa salida —
   nunca puede caer más de una: el hueco entre dos salidas consecutivas
   (24h22min–25h20min, medido en 03-registro-de-datos.md) es mayor que la
   ventana de 3h.

   "desconocida" NO CALCULA NADA. La 0022 nunca decidió qué hacer con este
   valor más allá de que existe como opción del campo (02-inventario-de-datos.md,
   A2) — no hay una franja de 24h que decidir tratar igual que una de 3h, eso
   sería inventar una regla que nadie ha puesto. calcularEpoca devuelve
   `sin_dato` sin más, hasta que haya una decisión escrita que decir aquí.

   ELEGIR ENTRE DOS ÉPOCAS. Cuando calcularEpoca devuelve "ambigua", la
   persona elige una de las dos — es la resolución de la 20.3. Decidido el
   26 de agosto: lo que se guarda es la elección cruda ("antes"/"despues"),
   NUNCA el instante ya resuelto — la época sigue siendo derivable (clase
   C2 de 02-inventario-de-datos.md) salvo por ese único bit, que sí es
   entrada porque no sale de fecha+hora+franja+lat+lon.

   elegirEpoca(resultado, indice) — el momento de decidir: convierte un
   índice (0/1) en la época resuelta, para enseñarla antes de guardar nada.
   resolverEpoca(nacimiento, eleccionAmbigua, obs) — cada vez después: parte
   de la elección ya guardada y recalcula, sin volver a preguntar.

   DÓNDE SE CALCULA LA ÉPOCA (corregido el 12 de noviembre de 2026).
   epocaDelPerfil(nacimiento, eleccionAmbigua) es lo que tiene que llamar
   cualquier pantalla. Construye el observador con las coordenadas DEL
   NACIMIENTO y llama a resolverEpoca con él. La decisión 0012 y la §4 de
   la hoja de ruta lo dicen desde el principio —«la época, con las
   coordenadas del lugar de nacimiento; las salidas de cada día, con las
   del lugar donde se vive hoy»—, pero index.html le pasaba a resolverEpoca
   el observador de Albacete, y lat/lon/altitud del nacimiento se
   guardaban sin que ningún cálculo los leyera. Para quien nació en
   Albacete el resultado era idéntico, y por eso no lo cogió nadie.
   resolverEpoca sigue aceptando `obs` por parámetro —las pruebas lo
   necesitan y no se le cambia la firma—; lo que cambia es que la
   pantalla ya no elige el observador: lo elige este módulo, que es el
   que sabe qué es una época.
   ===================================================================== */

import { diaLunar, observador } from './luna.js';
import { cartaEnInstante, cartaEnVentana } from './carta.js';

class PerfilInvalido extends Error {
  constructor(mensaje, campo) {
    super(mensaje);
    this.name = 'PerfilInvalido';
    this.campo = campo;
  }
}
export { PerfilInvalido };

const esCadenaConTexto = (v) => typeof v === 'string' && v.trim().length > 0;
const PRECISIONES = new Set(['exacta', 'franja', 'desconocida']);
const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;
const HORA_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

/* NO comparar dos instantes de diaLunar() con === : dos búsquedas
   independientes del MISMO suceso real pueden converger a valores que
   difieren por milisegundos —ruido de la raíz que encuentra el motor,
   no dos sucesos distintos—, medido hasta 88 ms buscando desde dos
   puntos de partida distintos. Se usa aquí (comparación de dos épocas
   candidatas) y en app/index.html (comparación de epocaVigente contra
   un diaLunar() recién buscado, en la navegación del calendario) — un
   solo valor, exportado, para no duplicar el número ni su porqué. */
export const TOLERANCIA_MISMA_SALIDA_MS = 60000;

/* Las ocho franjas uniformes de 3h que sustituyen a las cinco asimétricas
   (decisión 0022, punto 20.3; tabla en 03-registro-de-datos.md). Se
   identifican por su hora de inicio. */
export const FRANJAS = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

/* ---------------------------------------------------------------------
   construirPerfilNacimiento
   ------------------------------------------------------------------- */
export function construirPerfilNacimiento(entradas) {
  if (entradas === null || typeof entradas !== 'object') {
    throw new PerfilInvalido('construirPerfilNacimiento necesita un objeto de entradas', null);
  }
  const { fecha, hora, precision_hora, lat, lon, altitud, zona, localidad } = entradas;

  if (!esCadenaConTexto(fecha) || !FECHA_RE.test(fecha)) {
    throw new PerfilInvalido(
      `fecha tiene que ser "AAAA-MM-DD", y llegó ${JSON.stringify(fecha)}`, 'fecha'
    );
  }
  if (!PRECISIONES.has(precision_hora)) {
    throw new PerfilInvalido(
      `precision_hora tiene que ser "exacta", "franja" o "desconocida", y llegó ${JSON.stringify(precision_hora)}`,
      'precision_hora'
    );
  }

  let horaLimpia;
  if (precision_hora === 'exacta') {
    if (!esCadenaConTexto(hora) || !HORA_RE.test(hora)) {
      throw new PerfilInvalido(
        `con precision_hora "exacta" hace falta hora "HH:MM", y llegó ${JSON.stringify(hora)}`, 'hora'
      );
    }
    horaLimpia = hora;
  } else if (precision_hora === 'franja') {
    if (!FRANJAS.includes(hora)) {
      throw new PerfilInvalido(
        `con precision_hora "franja", hora tiene que ser el inicio de una de las ocho ` +
        `franjas de 3h (${FRANJAS.join(', ')}), y llegó ${JSON.stringify(hora)}`,
        'hora'
      );
    }
    horaLimpia = hora;
  } else {
    horaLimpia = null; // desconocida: no se pide, y si llega algo, se ignora
  }

  if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw new PerfilInvalido(`lat tiene que ser un número entre -90 y 90, y llegó ${JSON.stringify(lat)}`, 'lat');
  }
  if (typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    throw new PerfilInvalido(`lon tiene que ser un número entre -180 y 180, y llegó ${JSON.stringify(lon)}`, 'lon');
  }

  const altitudLimpia = (altitud === null || altitud === undefined) ? 0 : altitud;
  if (typeof altitudLimpia !== 'number' || !Number.isFinite(altitudLimpia)) {
    throw new PerfilInvalido(
      `altitud tiene que ser un número, o estar ausente (se usa 0), y llegó ${JSON.stringify(altitud)}`,
      'altitud'
    );
  }

  if (!esCadenaConTexto(zona)) {
    throw new PerfilInvalido(
      'nacimiento necesita zona horaria: sin ella la hora civil declarada no se puede ' +
      'convertir en un instante sin suponer una',
      'zona'
    );
  }
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zona });
  } catch {
    throw new PerfilInvalido(`zona horaria desconocida: ${zona}`, 'zona');
  }

  /* Opcional: ausente o null es un perfil válido (ver nota de cabecera).
     Si llega algo, tiene que ser texto de verdad — mismo criterio que el
     resto de campos de texto del módulo. */
  let localidadLimpia = null;
  if (localidad !== undefined && localidad !== null) {
    if (!esCadenaConTexto(localidad)) {
      throw new PerfilInvalido(
        `localidad, si se declara, tiene que ser una cadena con texto, y llegó ${JSON.stringify(localidad)}`,
        'localidad'
      );
    }
    localidadLimpia = localidad.trim();
  }

  return {
    fecha,
    hora: horaLimpia,
    precision_hora,
    lat,
    lon,
    altitud: altitudLimpia,
    zona: zona.trim(),
    localidad: localidadLimpia
  };
}

/* ---------------------------------------------------------------------
   Hora civil declarada -> instante UTC. Mismo método que `aUtc` en
   herramientas/hoja-de-cielo.mjs: tres iteraciones con Intl.formatToParts
   para que el redondeo converja incluso si la fecha cae justo en un
   cambio de hora oficial.
   ------------------------------------------------------------------- */
function aUtc(fecha, hora, zona) {
  const [Y, M, D] = fecha.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);
  let t = Date.UTC(Y, M - 1, D, h, m, 0);
  for (let i = 0; i < 3; i++) {
    const partes = new Intl.DateTimeFormat('en-CA', {
      timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).formatToParts(new Date(t));
    const g = (k) => Number(partes.find((x) => x.type === k).value);
    const visto = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour') % 24, g('minute'), g('second'));
    t += Date.UTC(Y, M - 1, D, h, m, 0) - visto;
  }
  return t;
}

function sumarUnDia(fecha) {
  const [Y, M, D] = fecha.split('-').map(Number);
  const d = new Date(Date.UTC(Y, M - 1, D + 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/* ---------------------------------------------------------------------
   calcularEpoca
   ------------------------------------------------------------------- */
export function calcularEpoca(nacimiento, obs) {
  const { fecha, hora, precision_hora, zona } = nacimiento;

  if (precision_hora === 'exacta') {
    const ms = aUtc(fecha, hora, zona);
    const dia = diaLunar(ms, obs);
    if (!dia) {
      return { estado: 'sin_dato', motivo: 'no se encontró ninguna salida de Luna cerca de esta fecha' };
    }
    return { estado: 'unica', epoca_utc: dia.empieza };
  }

  if (precision_hora === 'desconocida') {
    /* La 0022 no ha decidido qué hacer aquí. No se trata como una franja de
       24h porque nadie ha decidido que esa sea la regla — sería inventar
       una decisión y ponerla a nombre de la 0022. */
    return {
      estado: 'sin_dato',
      motivo: 'precision_hora "desconocida": no hay decisión escrita de cómo calcular la época sin al menos una franja'
    };
  }

  /* precision_hora === 'franja' — el único caso que la 20.3 decidió. Se
     comparan los dos extremos de la ventana de 3h; si la salida que
     antecede a cada extremo es LA MISMA, ninguna salida cayó dentro y no
     hay ambigüedad. Si es distinta, cayó una salida dentro —nunca puede
     caer más de una, ver la nota de cabecera— y hay dos épocas posibles. */
  /* Mismo cálculo de franja que ventanaDeNacimiento (13 nov 2026): una sola
     función, para que la época y la carta no puedan entender la misma
     franja de dos maneras. */
  const { inicio: msInicio, fin: msFin } = limitesDeFranja(fecha, hora, zona);

  const diaInicio = diaLunar(msInicio, obs);
  const diaFin = diaLunar(Math.max(msFin - 1, msInicio), obs); // fin exclusivo

  if (!diaInicio || !diaFin) {
    return { estado: 'sin_dato', motivo: 'no se encontró ninguna salida de Luna cerca de esta fecha' };
  }

  /* NO comparar con === : dos búsquedas independientes del MISMO suceso real
     pueden converger a instantes que difieren por milisegundos —ruido de la
     raíz que encuentra el motor, no dos sucesos distintos—, medido hoy hasta
     88 ms buscando desde dos puntos de partida distintos. Una ambigüedad de
     verdad separa dos salidas consecutivas, que están a 24h22min–25h20min
     (medido en 03-registro-de-datos.md): un minuto de margen es generosísimo
     para el ruido y minúsculo frente a la separación real. */
  /* TOLERANCIA_MISMA_SALIDA_MS: constante de cabecera del módulo. */
  if (Math.abs(diaInicio.empieza - diaFin.empieza) < TOLERANCIA_MISMA_SALIDA_MS) {
    return { estado: 'unica', epoca_utc: diaInicio.empieza };
  }

  return {
    estado: 'ambigua',
    candidatas: [
      { epoca_utc: diaInicio.empieza, si: 'naciste antes de esa salida, dentro de la franja declarada' },
      { epoca_utc: diaFin.empieza, si: 'naciste después de esa salida, dentro de la franja declarada' }
    ]
  };
}

/* La persona elige una de las dos candidatas que devolvió calcularEpoca en
   estado "ambigua" — es la resolución que decide la 20.3, y con esa
   elección se genera el calendario. Devuelve la MISMA forma que una época
   sin ambigüedad, para que quien construya el calendario no tenga que
   distinguir "vino directa" de "vino elegida": decidir entre las dos ya
   ocurrió aquí, una sola vez. */
export function elegirEpoca(resultado, indice) {
  if (resultado === null || typeof resultado !== 'object' || resultado.estado !== 'ambigua') {
    throw new PerfilInvalido(
      'elegirEpoca solo tiene sentido sobre un resultado de calcularEpoca en estado "ambigua"', null
    );
  }
  if (indice !== 0 && indice !== 1) {
    throw new PerfilInvalido(`elegirEpoca necesita indice 0 o 1, y llegó ${JSON.stringify(indice)}`, 'indice');
  }
  return { estado: 'unica', epoca_utc: resultado.candidatas[indice].epoca_utc };
}

/* Decidido el 26 de agosto: lo que se guarda no es el instante ya resuelto,
   es la elección cruda —"antes" o "despues"—, y la época se recalcula cada
   vez a partir de ella. Es la excepción mínima a la clase C2 (derivable) de
   02-inventario-de-datos.md: SOLO ese bit es entrada de verdad, porque es
   lo único que no sale de fecha+hora+franja+lat+lon; el instante en sí
   sigue siendo, en todo momento, un derivado.

   eleccionAmbigua vale "antes", "despues", o null/undefined si todavía no
   se ha decidido. Con "unica" o "sin_dato" la elección no se mira: no hay
   nada que resolver.

   Cuando hay ambigüedad y no hay elección guardada, esto NO lanza: es un
   estado legítimo (la persona vio las dos fechas y no pudo decidir, 20.3),
   no un fallo de programación. Devuelve "sin_resolver" con las mismas
   candidatas, para que quien llame pueda volver a preguntarlas. */
export function resolverEpoca(nacimiento, eleccionAmbigua, obs) {
  const resultado = calcularEpoca(nacimiento, obs);
  if (resultado.estado !== 'ambigua') return resultado;

  if (eleccionAmbigua !== 'antes' && eleccionAmbigua !== 'despues') {
    return { estado: 'sin_resolver', candidatas: resultado.candidatas };
  }
  return elegirEpoca(resultado, eleccionAmbigua === 'antes' ? 0 : 1);
}

/* ---------------------------------------------------------------------
   El observador del nacimiento: las coordenadas que se guardaron con el
   perfil (resueltas por geocodificación, decisión 0025), y no las del
   lugar habitual. Lanza si faltan —un perfil sin lat/lon no lo deja
   construir construirPerfilNacimiento, así que llegar aquí sin ellas es
   un fallo de programación, no un estado de la persona.
   ------------------------------------------------------------------- */
export function observadorDeNacimiento(nacimiento) {
  if (nacimiento === null || typeof nacimiento !== 'object') {
    throw new PerfilInvalido('observadorDeNacimiento necesita el bloque nacimiento del perfil', null);
  }
  const { lat, lon, altitud } = nacimiento;
  if (typeof lat !== 'number' || !Number.isFinite(lat) || typeof lon !== 'number' || !Number.isFinite(lon)) {
    throw new PerfilInvalido('el perfil de nacimiento no tiene lat/lon numéricas: no hay dónde calcular la época', 'lat');
  }
  return observador({ lat, lon, altitud: (typeof altitud === 'number' && Number.isFinite(altitud)) ? altitud : 0 });
}

/* La única entrada que deben usar las pantallas. Misma respuesta que
   resolverEpoca —"unica", "sin_resolver" o "sin_dato"—, siempre calculada
   donde naciste. */
export function epocaDelPerfil(nacimiento, eleccionAmbigua) {
  return resolverEpoca(nacimiento, eleccionAmbigua, observadorDeNacimiento(nacimiento));
}

/* ---------------------------------------------------------------------
   La carta de nacimiento — decisión 0030, 13 de noviembre de 2026.

   ventanaDeNacimiento(nacimiento) traduce la precisión de la hora en un
   intervalo de tiempo, con el mismo cálculo de franja que calcularEpoca:
     · exacta     → ventana de ancho cero, el instante declarado;
     · franja     → [inicio, fin) de la franja de 3 h, fin exclusivo;
     · desconocida→ sin_dato. La 0022 no decidió qué hacer aquí, y la 0030
                    tampoco: tomar el día entero sería una regla nueva.
   cartaDelPerfil(nacimiento) da la carta: completa con hora exacta, y la
   de los dos extremos (cartaEnVentana) con franja — sin Ascendente, sin
   Medio Cielo y sin casas, como decidió Ana el 12 de noviembre.
   Las dos se calculan donde naciste: observadorDeNacimiento.
   ------------------------------------------------------------------- */
function limitesDeFranja(fecha, hora, zona) {
  const inicio = aUtc(fecha, hora, zona);
  const siguiente = FRANJAS[(FRANJAS.indexOf(hora) + 1) % FRANJAS.length];
  const fin = aUtc(siguiente === '00:00' ? sumarUnDia(fecha) : fecha, siguiente, zona);
  return { inicio, fin };
}

export function ventanaDeNacimiento(nacimiento) {
  const { fecha, hora, precision_hora, zona } = nacimiento;
  if (precision_hora === 'exacta') {
    const ms = aUtc(fecha, hora, zona);
    return { estado: 'exacta', inicio: ms, fin: ms };
  }
  if (precision_hora === 'franja') {
    const { inicio, fin } = limitesDeFranja(fecha, hora, zona);
    return { estado: 'franja', inicio, fin: Math.max(fin - 1, inicio) };
  }
  return {
    estado: 'sin_dato',
    motivo: 'precision_hora "desconocida": no hay decisión escrita de qué ventana tomar sin al menos una franja'
  };
}

export function cartaDelPerfil(nacimiento) {
  const v = ventanaDeNacimiento(nacimiento);
  if (v.estado === 'sin_dato') return v;
  const obs = observadorDeNacimiento(nacimiento);
  return v.estado === 'exacta'
    ? { estado: 'exacta', carta: cartaEnInstante(v.inicio, obs) }
    : { estado: 'franja', carta: cartaEnVentana(v.inicio, v.fin, obs) };
}

if (typeof window !== 'undefined') {
  window.construirPerfilNacimiento = construirPerfilNacimiento;
  window.calcularEpoca = calcularEpoca;
  window.elegirEpoca = elegirEpoca;
  window.resolverEpoca = resolverEpoca;
  window.epocaDelPerfil = epocaDelPerfil;
  window.cartaDelPerfil = cartaDelPerfil;
  window.PerfilInvalido = PerfilInvalido;
  window.FRANJAS_NACIMIENTO = FRANJAS;
  window.TOLERANCIA_MISMA_SALIDA_MS = TOLERANCIA_MISMA_SALIDA_MS;
}
