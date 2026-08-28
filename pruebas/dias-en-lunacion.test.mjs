/* pruebas/dias-en-lunacion.test.mjs
 *
 * Prueba la LÓGICA de conteo de `diasEnLunacion` (calendario.js, 28 de
 * agosto de 2026 — espiral entrelazado), aislada del motor astronómico
 * real. NO es una prueba dorada del estilo del resto de calendario.js: no
 * sustituye a probar contra astronomy-engine, que es donde vive la verdad
 * de si un día lunar dura lo que dura de verdad. Aquí lo que se comprueba
 * es el ALGORITMO — que "seguir contando hasta que el día encaje con el
 * fin de la lunación" hace exactamente eso, incluidos los bordes — con un
 * `diaLunar` de mentira, determinista, construido para el caso de prueba,
 * nunca para imitar el cielo.
 *
 * El trozo de código bajo prueba se recorta literal de calendario.js entre
 * "const inicioBusquedaDia" y "return {" — el mismo criterio que ya usa
 * nivel4-bloque.test.mjs para el renderizador de index.html: se ejecuta el
 * código real del archivo, nunca una copia reescrita aquí.
 *
 * Encontrado escribiendo esta prueba, no por mutación: `diasEnLunacion++`
 * ocurría ANTES de comprobar si diaLunar() encontraba el día siguiente.
 * Cuando el hueco astronómico caía justo en el último paso del recorrido,
 * se contaba un día que nunca se llegó a confirmar. Corregido: solo se
 * cuenta después de una llamada a diaLunar() que devuelve algo.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const RUTA_CALENDARIO = new URL("../app/js/calendario.js", import.meta.url);
const DIA_MS = 86400000;

function cargarTrozo() {
  const src = fs.readFileSync(RUTA_CALENDARIO, "utf8");
  const desde = src.indexOf("const inicioBusquedaDia = Math.max");
  const hasta = src.indexOf("return {");
  assert.ok(desde !== -1 && hasta > desde, "no se encontró el trozo de diasEnLunacion en calendario.js");
  return src.slice(desde, hasta);
}

function ejecutar(diaLunarFalso, inicioLunacionActual, epocaMs, instanteMs, finLunacionActual) {
  const fn = new Function(
    "diaLunar", "inicioLunacionActual", "epocaMs", "instanteMs", "finLunacionActual", "obs",
    cargarTrozo() + "\nreturn { dia, diasEnLunacion };"
  );
  return fn(diaLunarFalso, inicioLunacionActual, epocaMs, instanteMs, finLunacionActual, null);
}

/* Lunación de mentira: 30 días lunares de 24h exactas, del instante 0 al
   30·DIA. 24h exactas es justo lo que el resto del proyecto prohíbe usar
   como dato real (luna.js: "NO SE USA NINGUNA DURACIÓN MEDIA") — aquí es
   legítimo porque no se está midiendo nada, solo probando que la cuenta
   avanza un día cada vez que toca. */
function diaLunarDe30(ms) {
  const n = Math.floor(ms / DIA_MS);
  if (n >= 30) return null;
  return { empieza: n * DIA_MS, termina: (n + 1) * DIA_MS };
}

test("consultado en el primer día, diasEnLunacion es el total de la lunación, no 1", () => {
  const r = ejecutar(diaLunarDe30, 0, 0, DIA_MS - 1, 30 * DIA_MS);
  assert.equal(r.dia, 1);
  assert.equal(r.diasEnLunacion, 30);
});

test("consultado en el último día, diasEnLunacion sigue siendo el mismo total", () => {
  const r = ejecutar(diaLunarDe30, 0, 0, 29 * DIA_MS + 1000, 30 * DIA_MS);
  assert.equal(r.dia, 30);
  assert.equal(r.diasEnLunacion, 30);
});

test("invariante: diasEnLunacion no depende de dónde dentro de la lunación se pregunte", () => {
  const r = ejecutar(diaLunarDe30, 0, 0, 14 * DIA_MS + 1000, 30 * DIA_MS);
  assert.equal(r.diasEnLunacion, 30);
});

test("el último día lunar puede cruzar la frontera de la lunación sin contarse de más", () => {
  function diaLunarConCruce(ms) {
    const n = Math.floor(ms / DIA_MS);
    if (n >= 30) return null;
    if (n === 29) return { empieza: 29 * DIA_MS, termina: 30 * DIA_MS + 5 * 3600e3 };
    return { empieza: n * DIA_MS, termina: (n + 1) * DIA_MS };
  }
  const r = ejecutar(diaLunarConCruce, 0, 0, 29 * DIA_MS + 1000, 30 * DIA_MS);
  assert.equal(r.diasEnLunacion, 30);
});

test("un hueco astronómico corta el conteo con lo que haya, no lanza", () => {
  function diaLunarConHueco(ms) {
    const n = Math.floor(ms / DIA_MS);
    if (n === 20) return null; // el hueco, a propósito
    if (n >= 30) return null;
    return { empieza: n * DIA_MS, termina: (n + 1) * DIA_MS };
  }
  const r = ejecutar(diaLunarConHueco, 0, 0, 5 * DIA_MS, 30 * DIA_MS);
  assert.equal(r.diasEnLunacion, 20);
});

test("el día que empieza justo donde acaba la lunación no se cuenta (borde exacto)", () => {
  function diaLunarSobrado(ms) {
    const n = Math.floor(ms / DIA_MS);
    if (n >= 15) return null; // hay días de sobra más allá de la lunación
    return { empieza: n * DIA_MS, termina: (n + 1) * DIA_MS };
  }
  const r = ejecutar(diaLunarSobrado, 0, 0, 0, 10 * DIA_MS); // finLunacionActual EXACTO
  assert.equal(r.diasEnLunacion, 10);
});
