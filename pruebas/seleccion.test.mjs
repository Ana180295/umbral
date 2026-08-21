/* =================================================================
   Pruebas doradas del filtro de prácticas.
   Se ejecutan sin dependencias:   node --test pruebas/
   ================================================================= */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  esNoche, techoDeCoste, franjasAdmisibles,
  candidatas, elegir, textoDePauta, abreTemporizador
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

test("solo las de respiración abren el temporizador", () => {
  for (const p of catalogo.practicas) {
    const esperado = p.pauta !== null && p.pauta.tipo === "respiracion";
    assert.equal(abreTemporizador(p), esperado, `${p.id}`);
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
  assert.equal(textoDePauta({ tipo: "duracion", segundos: 600 }), "10 min");
  assert.equal(textoDePauta({ tipo: "repeticiones", veces: 36 }), "36 veces");
});
