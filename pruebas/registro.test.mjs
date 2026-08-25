/* =================================================================
   Pruebas doradas de la construcción del registro.

   La prueba 1 es la que habría cogido el fallo del campo `zona`
   (decisión 0009): siete días calculándolo, enseñándolo en pantalla y
   no escribiéndolo. La lista de campos se escribe AQUÍ A MANO, y no se
   importa de `CAMPOS`, a propósito. Si las dos vivieran en el mismo
   sitio, añadir un campo mal lo añadiría en los dos a la vez y la
   prueba no podría contradecir al código.

       node --test pruebas/*.test.mjs
   ================================================================= */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  construirRegistro,
  fechaLocalDe,
  RegistroInvalido
} from "../app/js/registro.js";

/* Contexto de referencia. 2026-08-19 a las 15:41 en Madrid (UTC+2 en
   agosto), que es una hora sin ninguna ambigüedad de día. */
const CTX = {
  id: "0197a0b1-2c3d-4e5f-8a9b-0c1d2e3f4a5b",
  timestamp: Date.UTC(2026, 7, 19, 13, 41, 0),
  zona: "Europe/Madrid"
};

const lleno = () => ({
  descanso: 3,
  energia: 2,
  activacion: 4,
  tono: 5,
  senal_corporal: ["tension", "cansancio"],
  necesidad: "pausar",
  accion_elegida: "respiracion_46",
  accion_resultado: null,
  nota_libre: "Día largo."
});

/* =================================================================
   LAS SEIS DORADAS
   ================================================================= */

/* --- 1 ------------------------------------------------------------ */
test("dorada 1 · los campos son EXACTAMENTE los del esquema", () => {
  /* A mano. Trece, no doce: el traspaso del 23 de agosto decía doce en
     dos sitios y el objeto que se guardaba en index.html tenía trece. */
  const ESPERADOS = [
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

  const r = construirRegistro(lleno(), CTX);
  const salen = Object.keys(r).sort();

  assert.deepEqual(
    salen,
    [...ESPERADOS].sort(),
    "ni un campo de menos ni uno de más que el esquema escrito a mano"
  );
  assert.equal(ESPERADOS.length, 13);

  /* Y con TODO vacío tienen que salir los mismos trece. Este es el
     medio caso que habría cogido el fallo: no basta con que aparezcan
     cuando hay datos. */
  const vacio = construirRegistro({}, CTX);
  assert.deepEqual(Object.keys(vacio).sort(), [...ESPERADOS].sort());
});

/* --- 2 ------------------------------------------------------------ */
test("dorada 2 · un campo sin contestar es null: ni undefined, ni 0, ni cadena vacía", () => {
  const r = construirRegistro(
    { descanso: null, energia: undefined, nota_libre: "", accion_elegida: "   " },
    CTX
  );

  for (const campo of ["descanso", "energia", "activacion", "tono",
                       "necesidad", "accion_elegida", "accion_resultado", "nota_libre"]) {
    assert.strictEqual(r[campo], null, `${campo} debería ser null`);
    assert.notStrictEqual(r[campo], undefined, `${campo} no puede ser undefined`);
    assert.notStrictEqual(r[campo], 0, `${campo} no puede ser 0`);
    assert.notStrictEqual(r[campo], "", `${campo} no puede ser cadena vacía`);
  }

  /* Lo que de verdad importa: que sobrevivan a JSON.stringify. Un
     `undefined` desaparece al serializar y entonces «no lo anoté» y
     «este campo no existe» se escriben igual. */
  const ida = JSON.parse(JSON.stringify(r));
  for (const campo of ["descanso", "energia", "activacion", "tono", "nota_libre"]) {
    assert.ok(campo in ida, `${campo} ha desaparecido al serializar`);
    assert.strictEqual(ida[campo], null);
  }
});

/* --- 3 ------------------------------------------------------------ */
test("dorada 3 · zona se escribe siempre con el valor pasado, y no se inventa si falta", () => {
  const r = construirRegistro(lleno(), { ...CTX, zona: "America/Lima" });
  assert.equal(r.zona, "America/Lima");

  /* Que la zona pasada se USE, no solo que se copie. Mismo instante,
     dos zonas, dos días civiles distintos: si la función leyera la zona
     del aparato, estos dos saldrían iguales y la prueba pasaría en
     vacío. */
  const t = Date.UTC(2026, 7, 19, 13, 41, 0);
  assert.equal(fechaLocalDe(t, "Pacific/Kiritimati"), "2026-08-20"); // UTC+14
  assert.equal(fechaLocalDe(t, "Pacific/Niue"), "2026-08-19");       // UTC−11
  assert.notEqual(
    fechaLocalDe(t, "Pacific/Kiritimati"),
    fechaLocalDe(t, "Pacific/Niue")
  );

  /* Y si falta, lanza. No cae a Intl, no escribe null: se niega. */
  for (const mala of [undefined, null, "", "   "]) {
    assert.throws(
      () => construirRegistro(lleno(), { ...CTX, zona: mala }),
      RegistroInvalido,
      `zona ${JSON.stringify(mala)} tendría que lanzar`
    );
  }
  assert.throws(
    () => construirRegistro(lleno(), { ...CTX, zona: "Europe/Albacete" }),
    RegistroInvalido,
    "una zona que no existe no puede pasar como si existiera"
  );
});

/* --- 4 ------------------------------------------------------------ */
test("dorada 4 · a la 01:30 en Madrid, fecha_local es el día civil de Madrid", () => {
  /* 2026-08-19 01:30 en Madrid = 2026-08-18 23:30 UTC. En verano
     Madrid va a UTC+2, así que toISOString() diría "2026-08-18". */
  const verano = Date.UTC(2026, 7, 18, 23, 30, 0);
  assert.equal(new Date(verano).toISOString().slice(0, 10), "2026-08-18");
  assert.equal(fechaLocalDe(verano, "Europe/Madrid"), "2026-08-19");
  assert.equal(
    construirRegistro(lleno(), { ...CTX, timestamp: verano }).fecha_local,
    "2026-08-19"
  );

  /* Y en invierno, con UTC+1, para que la prueba no dependa del horario
     de verano. 2026-01-15 00:30 en Madrid = 2026-01-14 23:30 UTC. */
  const invierno = Date.UTC(2026, 0, 14, 23, 30, 0);
  assert.equal(new Date(invierno).toISOString().slice(0, 10), "2026-01-14");
  assert.equal(fechaLocalDe(invierno, "Europe/Madrid"), "2026-01-15");

  /* Formato exacto: cuatro dígitos, dos, dos. Es la clave con la que
     `leerDelDia` busca los registros de hoy. */
  assert.match(fechaLocalDe(verano, "Europe/Madrid"), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(fechaLocalDe(Date.UTC(2026, 0, 5, 12, 0, 0), "Europe/Madrid"), "2026-01-05");
});

/* --- 5 ------------------------------------------------------------ */
test("dorada 5 · un valor fuera de 1–5 lanza y NO devuelve un registro degradado", () => {
  for (const campo of ["descanso", "energia", "activacion", "tono"]) {
    for (const malo of [0, 6, 7, -1, 2.5, "3", true, NaN, Infinity]) {
      let salida = "no lanzó";
      try {
        salida = construirRegistro({ ...lleno(), [campo]: malo }, CTX);
      } catch (err) {
        assert.ok(err instanceof RegistroInvalido, `${campo}=${malo}: error del tipo esperado`);
        assert.equal(err.campo, campo);
        continue;
      }
      assert.fail(
        `${campo} = ${JSON.stringify(malo)} tendría que lanzar, y devolvió ` +
        JSON.stringify(salida)
      );
    }
  }

  /* El corazón de la regla: un 7 NO se convierte en null. Eso
     fabricaría un «no lo anoté» a partir de un fallo, y quedaría un
     registro válido, guardado, permanente y falso. */
  assert.throws(() => construirRegistro({ descanso: 7 }, CTX), RegistroInvalido);

  /* Los extremos legítimos siguen entrando. */
  for (const bueno of [1, 2, 3, 4, 5]) {
    assert.equal(construirRegistro({ tono: bueno }, CTX).tono, bueno);
  }
});

/* --- 6 ------------------------------------------------------------ */
test("dorada 6 · senal_corporal es siempre un array, nunca null", () => {
  for (const entrada of [undefined, null, []]) {
    const r = construirRegistro({ senal_corporal: entrada }, CTX);
    assert.ok(Array.isArray(r.senal_corporal), `con ${JSON.stringify(entrada)} debería ser array`);
    assert.deepEqual(r.senal_corporal, []);
  }

  /* Y la distinción que lo justifica todo: «me he mirado el cuerpo y no
     hay nada» no es «no me lo he preguntado». */
  const mirado = construirRegistro({ senal_corporal: ["nada_especial"] }, CTX);
  const noPreguntado = construirRegistro({ senal_corporal: [] }, CTX);
  assert.deepEqual(mirado.senal_corporal, ["nada_especial"]);
  assert.deepEqual(noPreguntado.senal_corporal, []);
  assert.notDeepEqual(mirado.senal_corporal, noPreguntado.senal_corporal);

  /* Sobrevive a la serialización como array vacío, no como null. */
  assert.deepEqual(JSON.parse(JSON.stringify(noPreguntado)).senal_corporal, []);
});

/* =================================================================
   GUARDAS ADICIONALES — no son las seis, pero cubren lo que salió al
   leer el código de index.html.
   ================================================================= */

test("«nada_especial» es excluyente también aquí, no solo en la pantalla", () => {
  assert.throws(
    () => construirRegistro({ senal_corporal: ["nada_especial", "tension"] }, CTX),
    RegistroInvalido,
    "no se puede no notar nada y a la vez notar tensión"
  );
  assert.throws(
    () => construirRegistro({ senal_corporal: ["tension", "tension"] }, CTX),
    RegistroInvalido,
    "un código repetido es un fallo de quien llama, no un dato"
  );
});

test("el array que se pasa no queda enganchado al registro", () => {
  const mio = ["tension"];
  const r = construirRegistro({ senal_corporal: mio }, CTX);
  mio.push("dolor");
  assert.deepEqual(r.senal_corporal, ["tension"], "el registro guardado no puede mutar después");
});

test("los textos se recortan, y un texto de solo espacios es un hueco", () => {
  const r = construirRegistro({ nota_libre: "  hoy ha ido bien  ", necesidad: " pausar " }, CTX);
  assert.equal(r.nota_libre, "hoy ha ido bien");
  assert.equal(r.necesidad, "pausar");
  assert.equal(construirRegistro({ nota_libre: "\n\t " }, CTX).nota_libre, null);
});

test("un id o un timestamp imposibles lanzan antes de construir nada", () => {
  for (const malo of [undefined, null, "", "  ", 42, {}]) {
    assert.throws(() => construirRegistro({}, { ...CTX, id: malo }), RegistroInvalido);
  }
  for (const malo of [undefined, null, "1755600000000", NaN, Infinity]) {
    assert.throws(() => construirRegistro({}, { ...CTX, timestamp: malo }), RegistroInvalido);
  }
});

test("accion_resultado nace null y sigue admitiendo texto cuando exista el momento de preguntarlo", () => {
  /* Hoy siempre se escribe null: el pendiente 2 no ha decidido cuándo se
     pregunta. Cuando se decida, esta prueba ya dice que el campo acepta
     el valor sin tocar nada más. */
  assert.equal(construirRegistro({}, CTX).accion_resultado, null);
  assert.equal(
    construirRegistro({ accion_resultado: "me sentó bien" }, CTX).accion_resultado,
    "me sentó bien"
  );
});

test("el módulo no toca el reloj: mismo contexto, mismo registro", () => {
  const a = construirRegistro(lleno(), CTX);
  const b = construirRegistro(lleno(), CTX);
  assert.deepEqual(a, b);
  /* Y no ha aparecido ninguna fecha de hoy por la puerta de atrás. */
  assert.equal(a.fecha_local, "2026-08-19");
});
