/* =================================================================
   Pruebas doradas del filtro de prácticas.
   Se ejecutan sin dependencias:   node --test pruebas/
   ================================================================= */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  esNoche, techoDeCoste, franjasAdmisibles,
  candidatas, elegir, textoDePauta, abreTemporizador,
  ladosDePauta, duracionTotal, textoDuracion
} from "../app/js/seleccion.js";

const catalogo = JSON.parse(
  readFileSync(new URL("../app/contenido/practicas.json", import.meta.url), "utf8")
);

const primera = () => 0;

/* --- integridad del catálogo -------------------------------------- */

test("el catálogo está bien formado", () => {
  const ids = new Set();
  const necesidadesValidas = new Set(["pausar","moverme","bajar_estimulos","enfocarme",
                                      "conectar","salir","descansar","no_lo_se"]);
  const franjasValidas = new Set(["cualquiera","solo_dia","mejor_manana"]);
  const evidenciasValidas = new Set(["ensayo","mecanismo","tradicion","ninguna"]);

  for (const p of catalogo.practicas) {
    assert.ok(!ids.has(p.id), `id repetido: ${p.id}`);
    ids.add(p.id);
    assert.ok(p.texto.length > 0 && p.texto.length < 160, `texto raro en ${p.id}`);
    assert.ok(p.necesidad.length > 0, `sin necesidad: ${p.id}`);
    p.necesidad.forEach(n => assert.ok(necesidadesValidas.has(n), `necesidad rara en ${p.id}: ${n}`));
    assert.ok([1,2,3].includes(p.coste), `coste raro en ${p.id}`);
    assert.ok(franjasValidas.has(p.franja), `franja rara en ${p.id}`);
    assert.ok(evidenciasValidas.has(p.evidencia), `evidencia rara en ${p.id}`);
    if (p.evidencia === "ensayo") {
      assert.ok(p.fuente, `evidencia "ensayo" sin fuente citada: ${p.id}`);
    }
  }
});

test("las ocho necesidades tienen al menos una práctica de coste 1", () => {
  for (const n of ["pausar","moverme","bajar_estimulos","enfocarme",
                   "conectar","salir","descansar","no_lo_se"]) {
    const hay = catalogo.practicas.some(p => p.necesidad.includes(n) && p.coste === 1);
    assert.ok(hay, `"${n}" no tiene ninguna práctica de coste 1`);
  }
});

/* --- techo de coste ----------------------------------------------- */

test("energía muy baja deja solo coste 1", () => {
  assert.equal(techoDeCoste({ energia: 1, hora: 15 }), 1);
  assert.equal(techoDeCoste({ energia: 2, hora: 15 }), 1);
});

test("energía media deja hasta coste 2", () => {
  assert.equal(techoDeCoste({ energia: 3, hora: 15 }), 2);
});

test("energía alta no limita nada de día", () => {
  assert.equal(techoDeCoste({ energia: 5, hora: 15 }), 3);
});

test("activación 5 fuerza coste 1 aunque la energía sea alta", () => {
  assert.equal(techoDeCoste({ energia: 5, activacion: 5, hora: 15 }), 1);
});

test("el dolor fuerza coste 1", () => {
  assert.equal(techoDeCoste({ energia: 5, senal_corporal: ["dolor"], hora: 15 }), 1);
});

test("de noche el techo baja a 2", () => {
  assert.equal(techoDeCoste({ energia: 5, hora: 23 }), 2);
  assert.equal(techoDeCoste({ energia: 5, hora: 3 }), 2);
});

/* --- franjas ------------------------------------------------------- */

test("de noche solo entran las prácticas de cualquier hora", () => {
  assert.deepEqual(franjasAdmisibles(23), ["cualquiera"]);
  assert.deepEqual(franjasAdmisibles(4), ["cualquiera"]);
});

test("por la tarde no se ofrecen las de mañana", () => {
  assert.ok(!franjasAdmisibles(17).includes("mejor_manana"));
});

test("esNoche marca las 22 y no las 21", () => {
  assert.equal(esNoche(21), false);
  assert.equal(esNoche(22), true);
  assert.equal(esNoche(5), true);
  assert.equal(esNoche(6), false);
});

/* --- el caso que originó todo esto -------------------------------- */

test("agotada a las once de la noche: nada que exija salir", () => {
  const ctx = { necesidad: "moverme", energia: 2, activacion: 3, hora: 23 };
  const lista = candidatas(catalogo, ctx);
  assert.ok(lista.length > 0, "a esa hora sigue habiendo algo que ofrecer");
  for (const p of lista) {
    assert.equal(p.coste, 1, `${p.id} tiene coste ${p.coste}`);
    assert.equal(p.franja, "cualquiera");
  }
  const ids = lista.map(p => p.id);
  assert.ok(!ids.includes("andar_diez"), "no se manda a pasear a alguien agotada");
  assert.ok(!ids.includes("escaleras_diez"));
  assert.ok(!ids.includes("sentadillas_pequenas"));
});

test("sobrepasada: no se ofrece nada que active más", () => {
  const ctx = { necesidad: "moverme", energia: 4, activacion: 5, hora: 20 };
  for (const p of candidatas(catalogo, ctx)) {
    assert.equal(p.activadora, false, `${p.id} es activadora`);
    assert.equal(p.coste, 1);
  }
});

test("«no lo sé» tiene prácticas propias de autocontemplación", () => {
  const lista = candidatas(catalogo, { necesidad: "no_lo_se", energia: 1, activacion: 5, hora: 23 });
  assert.ok(lista.length >= 6, `solo ${lista.length} candidatas`);
  assert.ok(lista.some(p => p.origen === "autocontemplacion"));
});

test("con energía alta y de día, salir vuelve a estar sobre la mesa", () => {
  const ids = candidatas(catalogo, { necesidad: "moverme", energia: 5, activacion: 2, hora: 11 })
                .map(p => p.id);
  assert.ok(ids.includes("andar_diez"));
});

/* --- el hueco vacío ------------------------------------------------ */

test("si no queda ninguna, se devuelve null y no un genérico", () => {
  const vacio = { practicas: catalogo.practicas.filter(p => p.coste === 3) };
  const r = elegir(vacio, { necesidad: "moverme", energia: 1, hora: 23 }, primera);
  assert.equal(r, null);
});

test("elegir es determinista si el azar lo es", () => {
  const ctx = { necesidad: "pausar", energia: 3, activacion: 3, hora: 15 };
  const a = elegir(catalogo, ctx, primera);
  const b = elegir(catalogo, ctx, primera);
  assert.equal(a.id, b.id);
});

/* --- pautas -------------------------------------------------------- */

/* ACTUALIZADA A SABIENDAS el 22 de agosto, no borrada: la decisión 0010 y la
   §15 cambiaron la regla que esta prueba vigilaba. Antes decía "solo las de
   respiración"; ahora el Compás abre también en las de duración, porque una
   duración con lados tiene un turno en mitad y una sin lados tiene el turno
   de parar. Lo que NO cambia es que las de repeticiones se quedan fuera. */
test("abren el Compás las de respiración y las de duración, no las demás", () => {
  for (const p of catalogo.practicas) {
    const tipo = p.pauta === null ? null : p.pauta.tipo;
    const esperado = tipo === "respiracion" || tipo === "duracion";
    assert.equal(abreTemporizador(p), esperado, `${p.id} (pauta ${tipo})`);
  }
});

test("el reparto de pautas del catálogo es el que dice la decisión 0010", () => {
  const cuenta = { respiracion: 0, duracion_lados: 0, duracion_simple: 0,
                   repeticiones: 0, sin_pauta: 0 };
  for (const p of catalogo.practicas) {
    if (p.pauta === null) cuenta.sin_pauta++;
    else if (p.pauta.tipo === "respiracion") cuenta.respiracion++;
    else if (p.pauta.tipo === "repeticiones") cuenta.repeticiones++;
    else if (ladosDePauta(p.pauta) > 1) cuenta.duracion_lados++;
    else cuenta.duracion_simple++;
  }
  assert.deepEqual(cuenta, {
    respiracion: 3, duracion_lados: 6, duracion_simple: 28,
    repeticiones: 21, sin_pauta: 42
  });
  const abren = catalogo.practicas.filter(abreTemporizador).length;
  assert.equal(abren, 37, "el Compás tiene que abrir en 37 prácticas, no en 3");
});

/* El punto 4 de la lista de la 0010. `lados` es un número, no un booleano, y
   la duración total es segundos × lados: 45 s a cada lado son 90 s. Sin esta
   prueba, la cuenta solo existe dentro del Compás, que corre en navegador y no
   está cubierto por nada (§8, punto ciego conocido). */
test("con lados, la duración total es segundos × lados", () => {
  assert.equal(duracionTotal({ tipo: "duracion", segundos: 45, lados: 2 }), 90);
  assert.equal(duracionTotal({ tipo: "duracion", segundos: 30, lados: 2 }), 60);
  assert.equal(duracionTotal({ tipo: "duracion", segundos: 600 }), 600);
  assert.equal(duracionTotal({ tipo: "respiracion", inspirar: 4, exhalar: 6, ciclos: 6 }), 60);

  /* Las de repeticiones no duran null porque duren cero: duran null porque no
     tienen ninguna duración que contar. */
  assert.equal(duracionTotal({ tipo: "repeticiones", veces: 10 }), null);
  assert.equal(duracionTotal(null), null);

  /* Un `lados: 1` no es "un lado y otro": es una pauta sin lados. */
  assert.equal(ladosDePauta({ tipo: "duracion", segundos: 60, lados: 1 }), 1);
  assert.equal(ladosDePauta({ tipo: "duracion", segundos: 60 }), 1);
});

/* Regresión. `segundos / 60` escribía "1.5 min" en la única práctica de 90
   segundos: punto decimal inglés en una app que solo habla español, y encima
   una forma que nadie dice en voz alta. */
test("una pauta de noventa segundos no se escribe 1.5 min", () => {
  assert.equal(textoDuracion(90), "1 min 30 s");
  assert.equal(textoDuracion(45), "45 s");
  assert.equal(textoDuracion(60), "1 min");
  assert.equal(textoDuracion(600), "10 min");
  for (const p of catalogo.practicas) {
    const t = textoDePauta(p.pauta);
    if (t) assert.ok(!t.includes("."), `${p.id} escribe un decimal: ${t}`);
  }
});

test("frotarse las orejas no lleva temporizador", () => {
  const p = catalogo.practicas.find(x => x.id === "frotar_orejas");
  assert.equal(p.pauta, null);
  assert.equal(abreTemporizador(p), false);
  assert.equal(textoDePauta(p.pauta), null);
});

test("la pauta se escribe legible", () => {
  assert.equal(textoDePauta({ tipo: "respiracion", inspirar: 4, exhalar: 6, ciclos: 6 }),
               "4 s dentro · 6 s fuera · 6 ciclos");
  assert.equal(textoDePauta({ tipo: "duracion", segundos: 45, lados: 2 }), "45 s por lado");
  assert.equal(textoDePauta({ tipo: "duracion", segundos: 90 }), "1 min 30 s");
  assert.equal(textoDePauta({ tipo: "duracion", segundos: 600 }), "10 min");
  assert.equal(textoDePauta({ tipo: "repeticiones", veces: 36 }), "36 veces");
});
