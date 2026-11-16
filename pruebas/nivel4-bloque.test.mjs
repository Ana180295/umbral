/* nivel4-bloque.test.mjs — la regla de la 0018 aplicada al nivel4.
 *
 * Qué gobierna esta prueba
 * ------------------------
 * La 0019 separó `bloque_nivel4` del `bloque` del dato: `bloque` dice
 * dónde viven nivel1, nivel3 y nivel5; `bloque_nivel4` dice dónde vive el
 * nivel4, y vale siempre "B". Cuatro datos tienen `bloque: "A"` con
 * `bloque_nivel4: "B"` —zodiaco_tropical, zodiaco_sidereo, nakshatra y
 * numerologia—, así que en ellos los dos campos no coinciden.
 *
 * Si el renderizador mete el nivel4 dentro de la misma ficha que el resto,
 * lo interpretativo de esos datos se ve en el bloque A: siempre, incluido
 * el día de hoy sin cerrar. Eso es lo que prohíbe la 0018, y es el fallo
 * que esta prueba existe para cazar.
 *
 * La 0019 §«Lo que esto no resuelve», punto 2, dejó fuera a propósito
 * *cómo se ve* el nivel4 separado en pantalla. Esta prueba no opina sobre
 * eso: solo comprueba en qué bloque acaba cada texto.
 *
 * Cómo está montada
 * -----------------
 * Ejecuta el `pintarTradiciones` REAL de index.html, recortado del propio
 * archivo, no una copia del bucle escrita aquí. Un bucle reescrito en la
 * prueba se valida contra sí mismo y no caza nada.
 *
 * Sin dependencias instaladas. El único doble es un `document` mínimo —no
 * parsea HTML, solo acumula texto y guarda el árbol de fichas—, porque lo
 * que se prueba es el reparto por bloques, no el parseo del navegador. El
 * doble no decide nada: todas las decisiones las toma el código del
 * archivo.
 *
 * Rutas: asume `pruebas/` hermana de `app/`.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { FUENTES as FUENTES_REALES, ESTADOS_VISIBLES } from "../app/js/fuentes.js";

const RUTA_INDEX = new URL("../app/index.html", import.meta.url);

/* --- Doble mínimo de DOM -------------------------------------------
   `textContent` concatena el html propio sin etiquetas más el de los
   hijos, igual que el de verdad. Asignar `innerHTML` limpia los hijos,
   también igual que el de verdad. Nada más hace falta aquí. */
function nodoFalso(etiqueta) {
  return {
    etiqueta,
    className: "",
    hidden: false,
    hijos: [],
    html: "",
    set innerHTML(v) { this.html = String(v); this.hijos = []; },
    get innerHTML() { return this.html; },
    appendChild(hijo) { this.hijos.push(hijo); return hijo; },
    get textContent() {
      const propio = this.html.replace(/<[^>]*>/g, " ");
      return propio + " " + this.hijos.map((h) => h.textContent).join(" ");
    }
  };
}

const documentoFalso = { createElement: (etiqueta) => nodoFalso(etiqueta) };

/* --- El arnés: recorta el renderizador del index y lo ejecuta ------- */
function cargarRenderizador(rutaHtml = RUTA_INDEX) {
  const html = fs.readFileSync(rutaHtml, "utf8");
  const i = html.indexOf('<script>\n"use strict";');
  assert.notEqual(i, -1, "no se encontró el <script> en línea de index.html");
  const src = html.slice(i + "<script>".length, html.indexOf("</script>", i));

  /* Desde el 15 de noviembre de 2026 el bloque empieza en su comentario de
     cabecera: delante de NIVEL2_POR_DATO viven ahora los formateadores de
     números y horas que usan las cifras (pendiente 42). */
  const desde = src.indexOf("/* --- Las tradiciones: fuentes.js");
  const hasta = src.indexOf("casillaCerrarDia.addEventListener");
  assert.ok(
    desde !== -1 && hasta > desde,
    "no se encontró el bloque del renderizador; si has movido código, ajusta los marcadores"
  );

  const zonaBloqueA = nodoFalso("div");
  const zonaBloqueB = nodoFalso("div");
  const casillaCierreEnvoltorio = nodoFalso("div");
  const casillaCerrarDia = nodoFalso("input");

  /* Dobles solo del motor astronómico: aquí no se prueba el cielo, se
     prueba el reparto. Devuelven cifras fijas y reconocibles.

     TIENEN QUE DEVOLVER LA MISMA FORMA QUE app/js/dia.js, campo a campo.
     Fallo real, 12 de noviembre de 2026: el commit 6af760b (pendiente 36)
     hizo que la cifra del sidéreo leyera `r.ayanamsa`, y este doble no lo
     tenía. El renderizador lanzaba al hacer `undefined.toFixed`, se
     saltaba la ficha —que es lo que tiene que hacer ante un cálculo que
     falla— y las pruebas 2 y 3 se pusieron rojas por un doble viejo, no
     por la app. Si dia.js gana un campo que la cifra lee, se añade aquí. */
  const ventana = {
    ESTADOS_VISIBLES,
    solTropical: () => ({ grados: 1, signo: "Virgo" }),
    solSidereo: () => ({ grados: 1, signo: "Leo", ayanamsa: 23.78 }),
    nakshatraDeLaLuna: () => ({ nombre: "Rohini", numero: 4, pada: 2 }),
    terminoSolar: () => ({
      termino: "Chushu", tradicional: "fin del calor",
      siguiente: "Bailu", siguiente_tradicional: "rocío blanco"
    }),
    tithiDelDia: () => ({ numero: 4, paksha: "shukla" }),
    faseRudhyarDelDia: () => ({ nombre: "creciente", indice: 3 }),
    fechaIslamica: () => "3 de Rabi al-awwal"
  };
  /* Desde el 15 de noviembre de 2026 (pendiente 42) las cifras se piden
     por día lunar entero, con tramosDelDia. El doble devuelve un solo
     tramo con el mismo valor que los dobles de arriba, y la MISMA forma
     que app/js/dia.js: { tramos: [{ desde, valor }], final }. */
  const VALORES = {
    zodiaco_tropical: ventana.solTropical, zodiaco_sidereo: ventana.solSidereo,
    nakshatra: ventana.nakshatraDeLaLuna, jieqi: ventana.terminoSolar,
    tithi: ventana.tithiDelDia, fases_rudhyar: ventana.faseRudhyarDelDia,
    calendario_islamico: ventana.fechaIslamica
  };
  ventana.tramosDelDia = (clave, empieza) => ({
    tramos: [{ desde: empieza, valor: VALORES[clave]() }], final: VALORES[clave]()
  });

  const fabricar = new Function(
    "document", "window", "ZONA",
    "zonaBloqueA", "zonaBloqueB", "casillaCierreEnvoltorio", "casillaCerrarDia",
    "diaAbiertoManualmente",
    src.slice(desde, hasta) + "\nreturn { pintarTradiciones };"
  );
  const { pintarTradiciones } = fabricar(
    documentoFalso, ventana, "Europe/Madrid",
    zonaBloqueA, zonaBloqueB, casillaCierreEnvoltorio, casillaCerrarDia, false
  );

  return { pintarTradiciones, ventana, A: zonaBloqueA, B: zonaBloqueB };
}

const MS = Date.UTC(2026, 7, 27, 12, 0, 0);

function pintarCon(fuentes) {
  const r = cargarRenderizador();
  r.ventana.FUENTES = fuentes;
  /* Un día lunar cualquiera, de 24 h 50 min: el renderizador ya no
     calcula sin él (pendiente 42). false = la fecha vista no es hoy. */
  r.pintarTradiciones(MS, { empieza: MS, termina: MS + 89400e3 }, false);
  return r;
}

const veces = (nodo, txt) =>
  (nodo.textContent.match(
    new RegExp(txt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
  ) || []).length;

/* ====================================================================
   1 · Contra los datos REALES de fuentes.js
   El caso que de verdad importa. Si mañana alguien añade un nivel4 a un
   dato de bloque A, o cambia un `bloque_nivel4`, esto lo caza sin que
   haya que tocar la prueba.
   ==================================================================== */

test("ningún nivel4 real acaba en el bloque A", () => {
  const { A } = pintarCon(FUENTES_REALES);
  const intrusos = [];
  for (const [clave, dato] of Object.entries(FUENTES_REALES)) {
    if (!dato.nivel4) continue;
    const huella = dato.nivel4.slice(0, 60); // trozo literal, no una palabra suelta
    if (A.textContent.includes(huella)) intrusos.push(clave);
  }
  assert.deepEqual(intrusos, []);
});

test("los tres datos visibles de bloque A llevan su nivel4 al bloque B", () => {
  const { B } = pintarCon(FUENTES_REALES);
  for (const clave of ["zodiaco_tropical", "zodiaco_sidereo", "nakshatra"]) {
    const dato = FUENTES_REALES[clave];
    assert.equal(dato.bloque, "A", `${clave} debería seguir en bloque A`);
    assert.equal(dato.bloque_nivel4, "B", `${clave} debería tener bloque_nivel4 B`);
    assert.equal(
      veces(B, dato.nivel4.slice(0, 60)), 1,
      `el nivel4 de ${clave} debe salir una sola vez en B`
    );
  }
});

test("nivel1, nivel3 y nivel5 de esos datos siguen en el bloque A", () => {
  const { A } = pintarCon(FUENTES_REALES);
  for (const clave of ["zodiaco_tropical", "zodiaco_sidereo", "nakshatra"]) {
    const dato = FUENTES_REALES[clave];
    assert.ok(A.textContent.includes(dato.nivel1.slice(0, 40)), `nivel1 de ${clave}`);
    assert.ok(A.textContent.includes(dato.nivel3.slice(0, 40)), `nivel3 de ${clave}`);
    assert.ok(A.textContent.includes(dato.nivel5.slice(0, 40)), `nivel5 de ${clave}`);
  }
});

test("los datos con estado no visible no llegan a pintarse", () => {
  const { A, B } = pintarCon(FUENTES_REALES);
  for (const [clave, dato] of Object.entries(FUENTES_REALES)) {
    if (ESTADOS_VISIBLES.includes(dato.estado)) continue;
    assert.equal(veces(A, dato.nombre), 0, `${clave} no debe salir en A`);
    assert.equal(veces(B, dato.nombre), 0, `${clave} no debe salir en B`);
  }
});

/* Hoy los tres datos `sin_verificar` —casas, tzolkin, numerologia— tampoco
   están en NIVEL2_POR_DATO, así que hay dos puertas cerradas delante de
   ellos y la prueba de arriba pasaría igual aunque se cayera el filtro por
   estado. Este caso pone un dato que SÍ tiene nivel2 declarado en estado
   `sin_verificar`, para que el filtro esté de verdad bajo prueba. */
test("un dato con nivel2 declarado pero sin_verificar tampoco se pinta", () => {
  const { A, B } = pintarCon({
    tithi: {
      nombre: "Tithi", estado: "sin_verificar", bloque: "B", bloque_nivel4: "B",
      nivel1: "n1", nivel3: "n3", nivel4: "RITO-NO-VERIFICADO", nivel5: "n5"
    }
  });
  assert.equal(veces(A, "RITO-NO-VERIFICADO"), 0);
  assert.equal(veces(B, "RITO-NO-VERIFICADO"), 0);
  assert.equal(veces(B, "Tithi"), 0);
});

/* ====================================================================
   2 · Contra datos de prueba, para los casos que fuentes.js hoy no tiene
   ==================================================================== */

const FUENTES_PRUEBA = {
  // dato en A con nivel4 en B: se separa
  zodiaco_tropical: {
    nombre: "Zodiaco tropical", estado: "fuerte", bloque: "A", bloque_nivel4: "B",
    nivel1: "n1", nivel3: "n3", nivel4: "RITO-TROPICAL", nivel5: "n5"
  },
  // sin bloque_nivel4 declarado: todo junto, como antes de la 0019
  jieqi: {
    nombre: "Jieqi", estado: "fuerte", bloque: "A",
    nivel1: "n1", nivel3: "n3", nivel4: "RITO-JIEQI", nivel5: "n5"
  },
  // bloque_nivel4 igual al del dato: una sola ficha, sin partir
  tithi: {
    nombre: "Tithi", estado: "debil", bloque: "B", bloque_nivel4: "B",
    nivel1: "n1", nivel3: "n3", nivel4: "RITO-TITHI", nivel5: "n5"
  },
  // bloque_nivel4 distinto pero sin nivel4: no nace ninguna ficha suelta
  fases_rudhyar: {
    nombre: "Fases de Rudhyar", estado: "fuerte", bloque: "A", bloque_nivel4: "B",
    nivel1: "n1", nivel3: "n3", nivel5: "n5"
  }
};

test("un dato sin bloque_nivel4 conserva su nivel4 dentro de su ficha", () => {
  const { A, B } = pintarCon(FUENTES_PRUEBA);
  assert.equal(veces(A, "RITO-JIEQI"), 1);
  assert.equal(veces(B, "RITO-JIEQI"), 0);
});

test("un dato cuyo bloque_nivel4 coincide no se parte en dos fichas", () => {
  const { B } = pintarCon(FUENTES_PRUEBA);
  const conTithi = B.hijos.filter((f) => f.textContent.includes("RITO-TITHI"));
  assert.equal(conTithi.length, 1);
  assert.ok(conTithi[0].textContent.includes("n5"), "la ficha de tithi sigue entera");
});

test("un dato con bloque_nivel4 distinto pero sin nivel4 no genera ficha suelta", () => {
  const { B } = pintarCon(FUENTES_PRUEBA);
  assert.equal(veces(B, "Fases de Rudhyar"), 0);
});

test("la ficha suelta del nivel4 no repite la cifra del nivel2", () => {
  const { B } = pintarCon(FUENTES_PRUEBA);
  const suelta = B.hijos.find((f) => f.textContent.includes("RITO-TROPICAL"));
  assert.ok(suelta, "la ficha suelta existe");
  assert.ok(
    !suelta.innerHTML.includes("dato-tradicion-cifra"),
    "la ficha suelta no lleva cifra: ya está en la ficha del bloque A"
  );
});

test("el nivel4 separado no aparece además dentro de la ficha del bloque A", () => {
  const { A } = pintarCon(FUENTES_PRUEBA);
  assert.equal(veces(A, "RITO-TROPICAL"), 0);
});
