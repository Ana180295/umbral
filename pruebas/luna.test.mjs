/* =================================================================
   Pruebas doradas astronómicas. §8 de la hoja de ruta.

   Estas pruebas no vigilan código propio: vigilan que el motor que se
   empaqueta siga dando lo mismo. Si algún día se sube de versión
   astronomy-engine y alguna cambia, hay que mirarla, no ajustarla.

   Importan el motor DESDE app/js/vendor/, que es el fichero que se
   publica. Probar contra el de node_modules probaría otra cosa.

   node --test pruebas/*.test.mjs
   ================================================================= */

import { test } from "node:test";
import assert from "node:assert/strict";
/* El motor se carga con require() desde el MISMO fichero UMD que se publica
   en app/js/vendor/. Probar contra el de node_modules probaría otra cosa, y
   además el proyecto no tiene dependencias que instalar. */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const Astronomia = require("../app/js/vendor/astronomy.browser.min.js");
globalThis.Astronomy = Astronomia;

const {
  observador, luna, salidaYPuesta, diaLunar, mareaMensual, mareaInstantanea,
  amplitudDeMarea, CONSTANTES
} = await import("../app/js/luna.js");

/* Albacete, Observatorio. AEMET, indicativo climatológico 8178D:
   39° 00′ 20″ N · 01° 51′ 44″ O · 674 m.
   Ficha: docs/registro-de-datos.md#lugar
   Se elige la estación del observatorio y no la de Los Llanos (8175, base
   aérea, 702 m, 5 km al sur) porque es la que está en la ciudad. Y se elige
   AEMET y no un agregador porque es la misma fuente de la que va a salir la
   línea base climática: así el cielo y el clima se refieren al mismo punto. */
const ALBACETE = observador({
  lat: 39 + 0 / 60 + 20 / 3600,
  lon: -(1 + 51 / 60 + 44 / 3600),
  altitud: 674
});

const ms = (iso) => Date.parse(iso);
const minutos = (a, b) => Math.abs(a - b) / 60000;
const diaEn = (t, zona) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: zona }).format(new Date(t));

/* --- fases --------------------------------------------------------- */

test("las tres fases de referencia caen donde dice la §8", () => {
  const casos = [
    ["luna nueva",   0, "2000-01-05T00:00:00Z", "2000-01-06T18:14:00Z"],
    ["luna nueva",   0, "2026-09-09T00:00:00Z", "2026-09-11T03:27:00Z"],
    ["luna llena", 180, "2026-08-26T00:00:00Z", "2026-08-28T04:19:00Z"]
  ];
  for (const [nombre, lon, desde, esperado] of casos) {
    const r = Astronomia.SearchMoonPhase(lon, new Date(desde), 10);
    const d = minutos(r.date.getTime(), ms(esperado));
    assert.ok(d <= 2, `${nombre} ${esperado}: ${d.toFixed(2)} min de diferencia`);
  }
});

test("en la llena exacta la fase es 180 y la iluminación es 1", () => {
  const l = luna(ms("2026-08-28T04:19:06Z"));
  assert.ok(Math.abs(l.fase_grados - 180) < 0.01, `fase ${l.fase_grados}`);
  assert.ok(l.iluminacion > 0.9999, `iluminación ${l.iluminacion}`);
});

/* --- apsides ------------------------------------------------------- */

test("perigeo y apogeo de septiembre de 2026", () => {
  let ap = Astronomia.SearchLunarApsis(new Date("2026-09-01T00:00:00Z"));
  const encontrados = [];
  for (let i = 0; i < 2; i++) {
    encontrados.push({
      tipo: ap.kind === Astronomia.ApsisKind.Pericenter ? "perigeo" : "apogeo",
      dia: ap.time.date.toISOString().slice(0, 10),
      km: ap.dist_km
    });
    ap = Astronomia.NextLunarApsis(ap);
  }
  const [per, apo] = encontrados;
  assert.equal(per.dia, "2026-09-06");
  assert.ok(Math.abs(per.km - 368249) <= 100, `perigeo ${per.km.toFixed(0)} km`);
  assert.equal(apo.dia, "2026-09-19");
  assert.ok(Math.abs(apo.km - 404210) <= 100, `apogeo ${apo.km.toFixed(0)} km`);
});

/* --- salidas y puestas --------------------------------------------- */

test("la Luna sale en Albacete a las 20:53 del 28 de agosto de 2026", () => {
  const r = salidaYPuesta(ms("2026-08-28T12:00:00Z"), ALBACETE, "Europe/Madrid");
  const hora = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false
  }).format(new Date(r.salida));
  assert.equal(hora, "20:53");
});

/* Un día civil sin salida de Luna no es un día sin Luna: la Luna sigue ahí,
   sigue iluminada y sigue tirando igual. Lo que no ocurre ese día es el
   EVENTO. Por eso el hueco está solo en la columna de la salida. */
test("el 9 de enero de 2026 no hay salida de Luna en Albacete, y aun así hay Luna", () => {
  const r = salidaYPuesta(ms("2026-01-09T12:00:00Z"), ALBACETE, "Europe/Madrid");
  assert.equal(r.dia_civil, "2026-01-09");
  assert.equal(r.salida, null);
  assert.equal(r.motivo_sin_salida, "no ocurre en este día civil");

  const l = luna(ms("2026-01-09T12:00:00Z"));
  assert.ok(l.iluminacion > 0.5, `iluminación ${l.iluminacion}: no es cero`);
  assert.ok(mareaMensual(ms("2026-01-09T12:00:00Z")) > 0, "la marea se calcula igual");
});

test("en 2026 hay un día civil sin salida por lunación, aproximadamente", () => {
  let t = new Date("2026-01-01T00:00:00Z");
  const dias = new Set();
  for (let i = 0; i < 400; i++) {
    const r = Astronomia.SearchRiseSet(Astronomia.Body.Moon, ALBACETE, +1, t, 3);
    if (!r || r.date >= new Date("2027-01-01T00:00:00Z")) break;
    dias.add(diaEn(r.date.getTime(), "Europe/Madrid"));
    t = new Date(r.date.getTime() + 3600e3);
  }
  const sinSalida = 365 - dias.size;
  assert.ok(sinSalida >= 11 && sinSalida <= 13,
    `${sinSalida} días sin salida en 2026, se esperaban entre 11 y 13`);
});

/* --- zonas horarias ------------------------------------------------ */

test("la misma luna nueva cae en días distintos según dónde estés", () => {
  const nueva = Astronomia.SearchMoonPhase(0, new Date("2026-09-09T00:00:00Z"), 10);
  const t = nueva.date.getTime();
  assert.equal(diaEn(t, "Europe/Madrid"), "2026-09-11");
  assert.equal(diaEn(t, "America/Guayaquil"), "2026-09-10");
});

test("el día de 23 h y el de 25 h de 2026 en Europe/Madrid", () => {
  const desfase = (iso) => new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid", timeZoneName: "longOffset"
  }).formatToParts(new Date(iso)).find((p) => p.type === "timeZoneName").value;

  assert.equal(desfase("2026-03-28T12:00:00Z"), "GMT+01:00");
  assert.equal(desfase("2026-03-30T12:00:00Z"), "GMT+02:00");
  assert.equal(desfase("2026-10-24T12:00:00Z"), "GMT+02:00");
  assert.equal(desfase("2026-10-26T12:00:00Z"), "GMT+01:00");
});

/* --- marea --------------------------------------------------------- */

/* El 0,46 no hay que creérselo por autoridad: sale de dividir dos cifras
   comprobables, y la cita de la NOAA confirma un cálculo, no lo sustituye. */
test("el ratio Sol:Luna del forzamiento de marea es 0,46", () => {
  const { GM_LUNA, GM_SOL } = CONSTANTES;
  const R_LUNA = 384399e3;              // distancia media, solo para esta prueba
  const UA = 1.495978707e11;
  const k = amplitudDeMarea(GM_SOL, UA) / amplitudDeMarea(GM_LUNA, R_LUNA);
  assert.ok(Math.abs(k - 0.46) < 0.005, `k = ${k.toFixed(4)}`);

  /* Por el otro camino: masas partido por distancias al cubo. */
  const porMasas = (GM_SOL / GM_LUNA) / (UA / R_LUNA) ** 3;
  assert.ok(Math.abs(k - porMasas) < 1e-9, "los dos caminos tienen que dar lo mismo");
});

test("los órdenes de magnitud de la §8: 110 µGal la Luna, 50 el Sol", () => {
  const { GM_LUNA, GM_SOL } = CONSTANTES;
  const aL = amplitudDeMarea(GM_LUNA, 384399e3);
  const aS = amplitudDeMarea(GM_SOL, 1.495978707e11);
  assert.ok(Math.abs(aL - 110) < 1, `Luna ${aL.toFixed(1)} µGal`);
  assert.ok(Math.abs(aS - 50) < 1, `Sol ${aS.toFixed(1)} µGal`);
});

test("entre perigeo y apogeo el forzamiento lunar varía un 32 %", () => {
  const { GM_LUNA } = CONSTANTES;
  const r = amplitudDeMarea(GM_LUNA, 368249e3) / amplitudDeMarea(GM_LUNA, 404210e3);
  assert.ok(Math.abs(r - 1.32) < 0.01, `${r.toFixed(4)}`);
});

/* CORREGIDA respecto a la §8, y el motivo va escrito porque cambia lo que
   la prueba puede afirmar.

   La §8 pedía comprobar la envolvente sicigia/cuadratura ≈ 2,7. Con fechas
   reales NO SALE: medido sobre las 25 sicigias y las 25 cuadraturas de
   2026, el cociente va de 1,9 a 4,5. No es un fallo de la fórmula, es que
   la distancia real de la Luna varía un 32 % en forzamiento y eso se
   superpone al efecto de la fase.

   El 2,7 es del MODELO DE EQUILIBRIO a distancia media, y así es como hay
   que probarlo: con las distancias fijadas a mano. */
test("la envolvente sicigia/cuadratura a distancia media es 2,7", () => {
  const { GM_LUNA, GM_SOL } = CONSTANTES;
  const aL = amplitudDeMarea(GM_LUNA, 384399e3);
  const aS = amplitudDeMarea(GM_SOL, 1.495978707e11);
  const envolvente = (aL + aS) / (aL - aS);
  assert.ok(Math.abs(envolvente - 2.7) < 0.02, `${envolvente.toFixed(3)}`);

  /* Y sale también de k sola, sin usar ninguna amplitud tabulada:
     (1+k)/(1−k). Que los dos caminos coincidan es la señal de que la
     fórmula es coherente consigo misma. */
  const k = aS / aL;
  assert.ok(Math.abs(envolvente - (1 + k) / (1 - k)) < 1e-9);
});

/* La diferencia entre los dos campos de la decisión 0013 no es de matiz:
   uno pasa por dos máximos al día porque la Tierra gira, y el otro no. */
test("la marea instantánea se mueve mucho más en un día que la mensual", () => {
  const dia = "2026-08-28T";
  const horas = [0, 3, 6, 9, 12, 15, 18, 21];
  const inst = horas.map((h) =>
    mareaInstantanea(ms(`${dia}${String(h).padStart(2, "0")}:00:00Z`), ALBACETE));
  const mens = horas.map((h) =>
    mareaMensual(ms(`${dia}${String(h).padStart(2, "0")}:00:00Z`)));

  const rango = (a) => Math.max(...a) - Math.min(...a);
  assert.ok(rango(inst) > 100, `la instantánea solo varía ${rango(inst).toFixed(1)} µGal`);
  assert.ok(rango(mens) < 15, `la mensual varía ${rango(mens).toFixed(1)} µGal`);
  assert.ok(rango(inst) > 10 * rango(mens), "tienen que ser de escalas distintas");
});

test("la marea se calcula en el instante exacto, no al mediodía", () => {
  const manana = mareaInstantanea(ms("2026-08-28T08:30:00Z"), ALBACETE);
  const noche = mareaInstantanea(ms("2026-08-28T21:00:00Z"), ALBACETE);
  assert.notEqual(manana.toFixed(0), noche.toFixed(0));
});

/* --- el día lunar, uno a uno ---------------------------------------- */

test("cada día lunar lleva su propia duración, y no se parecen", () => {
  /* Ana, 22 de agosto: «nada de medias, cada día se pone la duración del
     día lunar». Esta prueba existe para que nadie meta una constante de
     24,85 h el día que le venga bien para cuadrar una rejilla. */
  const duraciones = [];
  for (let d = 0; d < 60; d++) {
    const t = Date.UTC(2026, 0, 15 + d, 12);
    const dl = diaLunar(t, ALBACETE);
    assert.ok(dl, `sin día lunar el ${new Date(t).toISOString().slice(0, 10)}`);
    assert.ok(dl.empieza <= t && t < dl.termina, "el instante cae dentro de su día lunar");
    duraciones.push(dl.horas);
  }
  const distintas = new Set(duraciones.map((h) => h.toFixed(2)));
  assert.ok(distintas.size > 40,
    `solo ${distintas.size} duraciones distintas en 60 días: eso huele a media`);
});

test("el día lunar más corto y el más largo de 2026 se llevan casi una hora", () => {
  const h = [];
  for (let d = 0; d < 360; d += 3) {
    const dl = diaLunar(Date.UTC(2026, 0, 2 + d, 12), ALBACETE);
    if (dl) h.push(dl.horas);
  }
  const min = Math.min(...h), max = Math.max(...h);
  assert.ok(min < 24.5, `el más corto son ${min.toFixed(2)} h`);
  assert.ok(max > 25.2, `el más largo son ${max.toFixed(2)} h`);
  assert.ok((max - min) * 60 > 50, "entre el más corto y el más largo hay casi una hora");
});
