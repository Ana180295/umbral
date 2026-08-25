/* =================================================================
   Umbral — construcción del registro diario.

   POR QUÉ EXISTE ESTE FICHERO. El objeto que se guarda en `checkins`
   se construía en línea, dentro del manejador del botón, mezclado con
   `crypto.randomUUID()` y `new Date()`. Eso lo hacía imposible de
   probar, y así fue como el campo `zona` estuvo siete días
   calculándose, enseñándose en pantalla y no escribiéndose en disco
   (decisión 0009). Lo que no se escribe no avisa.

   Aquí dentro no hay reloj, no hay azar y no hay DOM. Todo entra por
   parámetro. Lo impuro —el id y el instante— lo pone quien llama.

   TRES REGLAS QUE GOBIERNAN EL FICHERO

   1. LOS TRECE CAMPOS SIEMPRE, con `null` donde no haya nada.
      `undefined` desaparece al serializar, y entonces «no lo anoté» y
      «este campo no existe» se escriben igual. Ausente es `null`,
      nunca `0` y nunca cadena vacía.

   2. UN VALOR IMPOSIBLE LANZA; NO SE DEGRADA. Convertir un
      `descanso: 7` en `null` fabricaría un «no lo anoté» a partir de
      un fallo, y quedaría un registro válido, guardado, permanente y
      falso. Quien llama tiene que conservar en pantalla lo escrito.

   3. NADA SE INVENTA. `fechaLocalDe` no tiene zona por defecto, y
      `zona` no cae a `Intl` si falta. Un registro sin zona es un
      registro cuya fecha civil no se puede reconstruir mañana.
   ================================================================= */

/* La lista viva del esquema. Se declara aquí porque el módulo tiene que
   poder recorrerla; la prueba dorada 1 la escribe A MANO y por separado,
   a propósito: un solo sitio que editar es un solo sitio donde
   equivocarse sin testigos. */
export const CAMPOS = [
  "id",
  "timestamp",
  "zona",
  "fecha_local",
  "descanso",
  "energia",
  "activacion",
  "tono",
  "senal_corporal",
  "necesidad",
  "accion_elegida",
  "accion_resultado",
  "nota_libre"
];

const ESCALAS = ["descanso", "energia", "activacion", "tono"];
const TEXTOS = ["necesidad", "accion_elegida", "accion_resultado", "nota_libre"];

/* Las señales que se excluyen con todas las demás. Hoy solo una:
   «me he mirado el cuerpo y no hay nada» y «no me lo he preguntado» son
   cosas distintas, y `["nada_especial"]` frente a `[]` es lo que las
   separa. Si se marcara junto a «tensión», la distinción se perdería. */
const SENALES_EXCLUYENTES = new Set(["nada_especial"]);

class RegistroInvalido extends Error {
  constructor(mensaje, campo) {
    super(mensaje);
    this.name = "RegistroInvalido";
    this.campo = campo;
  }
}

export { RegistroInvalido };

const esCadenaConTexto = (v) => typeof v === "string" && v.trim().length > 0;

/* --- fecha civil ---------------------------------------------------
   El día que te corresponde, no el que le corresponde a UTC. A la 01:30
   en Madrid, `toISOString()` devuelve la fecha de ayer.

   Se arma con `formatToParts` y no leyendo la cadena de un locale: así
   el resultado no depende de que "en-CA" siga formateando en ISO. Y el
   formateador se construye EN CADA LLAMADA, porque la zona es un
   argumento. Uno creado al cargar el módulo quedaría clavado a la zona
   del aparato y la prueba de la 01:30 pasaría por accidente en un
   portátil que ya está en Madrid.
   ------------------------------------------------------------------- */
export function fechaLocalDe(timestamp, zona) {
  if (!Number.isFinite(timestamp)) {
    throw new RegistroInvalido(
      `timestamp tiene que ser un número finito, y llegó ${JSON.stringify(timestamp)}`,
      "timestamp"
    );
  }
  if (!esCadenaConTexto(zona)) {
    throw new RegistroInvalido(
      "fechaLocalDe necesita una zona horaria: sin ella habría que suponer una, " +
      "y suponerla sería inventar un dato",
      "zona"
    );
  }

  /* Intl lanza RangeError con una zona que no existe. Se deja subir tal
     cual envuelta: es un valor imposible, no un hueco. */
  let partes;
  try {
    partes = new Intl.DateTimeFormat("en-US", {
      timeZone: zona,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date(timestamp));
  } catch (err) {
    throw new RegistroInvalido(`zona horaria desconocida: ${zona}`, "zona");
  }

  const trozo = (tipo) => partes.find((p) => p.type === tipo)?.value;
  const anio = trozo("year");
  const mes = trozo("month");
  const dia = trozo("day");

  /* Si alguna parte faltara, esto devolvería "undefined-08-19" sin
     quejarse. Es la familia de `.alt` en vez de `.altitude`: un
     `undefined` que no rompe nada. */
  if (!anio || !mes || !dia) {
    throw new RegistroInvalido(
      `Intl no ha devuelto año, mes y día para la zona ${zona}`,
      "zona"
    );
  }

  return `${String(anio).padStart(4, "0")}-${mes}-${dia}`;
}

/* --- validaciones de cada clase de campo ---------------------------- */

function validaEscala(nombre, valor) {
  if (valor === null || valor === undefined) return null;
  if (!Number.isInteger(valor) || valor < 1 || valor > 5) {
    throw new RegistroInvalido(
      `${nombre} tiene que ser un entero de 1 a 5 o estar ausente, ` +
      `y llegó ${JSON.stringify(valor)}`,
      nombre
    );
  }
  return valor;
}

function validaTexto(nombre, valor) {
  if (valor === null || valor === undefined) return null;
  if (typeof valor !== "string") {
    throw new RegistroInvalido(
      `${nombre} tiene que ser texto o estar ausente, y llegó ${JSON.stringify(valor)}`,
      nombre
    );
  }
  /* Una caja de texto vacía no es un fallo: es un campo sin contestar.
     Se normaliza a null para que «no escribí nada» tenga una sola forma
     en la base de datos y no dos. */
  const limpio = valor.trim();
  return limpio.length > 0 ? limpio : null;
}

/* `senal_corporal` es el único campo que nunca es null: SIEMPRE array.
   El array vacío tiene un significado propio —silencio, no me lo he
   preguntado— y perderlo dentro de un null lo borraría. */
function validaSenalCorporal(valor) {
  if (valor === null || valor === undefined) return [];

  if (!Array.isArray(valor)) {
    throw new RegistroInvalido(
      `senal_corporal tiene que ser un array, y llegó ${JSON.stringify(valor)}`,
      "senal_corporal"
    );
  }

  const vistas = new Set();
  for (const s of valor) {
    if (!esCadenaConTexto(s)) {
      throw new RegistroInvalido(
        `senal_corporal contiene algo que no es un código: ${JSON.stringify(s)}`,
        "senal_corporal"
      );
    }
    if (vistas.has(s)) {
      throw new RegistroInvalido(`senal_corporal repite el código "${s}"`, "senal_corporal");
    }
    vistas.add(s);
  }

  for (const excluyente of SENALES_EXCLUYENTES) {
    if (vistas.has(excluyente) && vistas.size > 1) {
      throw new RegistroInvalido(
        `"${excluyente}" es excluyente y llegó junto a ${
          [...vistas].filter((s) => s !== excluyente).join(", ")
        }`,
        "senal_corporal"
      );
    }
  }

  /* Copia propia: si quien llama sigue usando su array después de
     guardar, el registro no puede cambiar por debajo. */
  return [...valor];
}

/* --- la función ----------------------------------------------------
   entradas = lo que ha dicho la persona
   contexto = { id, timestamp, zona }  — lo impuro, puesto desde fuera
   ------------------------------------------------------------------- */
export function construirRegistro(entradas, contexto) {
  if (entradas === null || typeof entradas !== "object") {
    throw new RegistroInvalido("construirRegistro necesita un objeto de entradas", null);
  }
  if (contexto === null || typeof contexto !== "object") {
    throw new RegistroInvalido(
      "construirRegistro necesita un contexto { id, timestamp, zona }",
      null
    );
  }

  const { id, timestamp, zona } = contexto;

  if (!esCadenaConTexto(id)) {
    throw new RegistroInvalido(
      `el registro necesita un id, y llegó ${JSON.stringify(id)}`,
      "id"
    );
  }
  if (!Number.isFinite(timestamp)) {
    throw new RegistroInvalido(
      `timestamp tiene que ser un número finito, y llegó ${JSON.stringify(timestamp)}`,
      "timestamp"
    );
  }
  /* Se exige zona, y no se cae a la del aparato. Un registro nuevo sin
     zona sería el hueco de la 0009 abierto otra vez, y esta vez sin la
     excusa de que nadie lo sabía. */
  if (!esCadenaConTexto(zona)) {
    throw new RegistroInvalido(
      "el registro necesita zona horaria: sin ella la fecha civil no se puede " +
      "reconstruir sin suponer una",
      "zona"
    );
  }

  const registro = {
    id: id.trim(),
    timestamp,
    zona: zona.trim(),
    /* Derivada, y aun así se guarda. Es la excepción documentada del
       Lote 3: los registros anteriores al 28 de agosto no tienen zona, y
       sin zona la fecha civil no se puede recalcular. */
    fecha_local: fechaLocalDe(timestamp, zona.trim()),
    descanso: null,
    energia: null,
    activacion: null,
    tono: null,
    senal_corporal: validaSenalCorporal(entradas.senal_corporal),
    necesidad: null,
    accion_elegida: null,
    accion_resultado: null,
    nota_libre: null
  };

  for (const campo of ESCALAS) {
    registro[campo] = validaEscala(campo, entradas[campo]);
  }
  for (const campo of TEXTOS) {
    registro[campo] = validaTexto(campo, entradas[campo]);
  }

  return registro;
}

/* --- puente con el <script> clásico de index.html -------------------
   Mismo mecanismo que `window.abrirTemporizador` en compas.js. En Node
   no hay `window`, así que al importar desde las pruebas esto no hace
   nada y el módulo sigue siendo puro donde importa.
   ------------------------------------------------------------------- */
if (typeof window !== "undefined") {
  window.construirRegistro = construirRegistro;
  window.fechaLocalDe = fechaLocalDe;
  window.RegistroInvalido = RegistroInvalido;
}
