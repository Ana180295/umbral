/* Las reglas de las decisiones 0015, 0016 y 0018 dejan de ser intenciones
 * escritas en un documento y pasan a ser algo que rompe el `node --test`.
 *
 * Una regla que solo vive en un .md se puede deshacer dentro de seis meses sin
 * que nadie se dé cuenta. Una regla que rompe las pruebas, no.
 *
 *   node --test pruebas/*.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  FUENTES,
  ESTADOS,
  ESTADOS_VISIBLES,
  BLOQUES,
  JAMAS_EN_PANTALLA
} from '../app/js/fuentes.js';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

/* A MANO y por separado, igual que la prueba dorada 1 de registro.js hace con
   CAMPOS. Si estas listas se importaran del módulo, la prueba comprobaría que
   el fichero coincide consigo mismo, que es no comprobar nada. */
const FICHA_OBLIGATORIA = ['autor', 'titulo', 'publicacion', 'verificado_en'];
const ETNOGRAFIA_OBLIGATORIA = ['quien', 'donde', 'cuando', 'documentado_por'];

const entradas = Object.entries(FUENTES);

/* ================================================================
   1 · LA CONDICIÓN DE ENTRADA
   0015: «Un dato sin nivel 5 escrito no se muestra.»
   ================================================================ */

test('todo dato con nivel1 tiene nivel5', () => {
  const sinPuerta = entradas
    .filter(([, d]) => d.nivel1 && !d.nivel5)
    .map(([clave]) => clave);

  assert.deepEqual(
    sinPuerta,
    [],
    'el nivel 5 es la condición de entrada (0015): sin él el dato no puede ' +
    `mostrarse, y estos lo tienen vacío:\n  ${sinPuerta.join('\n  ')}`
  );
});

test('ningún nivel está vacío o en blanco cuando existe', () => {
  const flojos = [];
  for (const [clave, d] of entradas) {
    for (const nivel of ['nivel1', 'nivel3', 'nivel5']) {
      const v = d[nivel];
      if (typeof v !== 'string' || v.trim().length === 0) {
        flojos.push(`${clave}.${nivel}`);
      }
    }
  }
  /* Una cadena vacía pasaría la prueba 1 sin decir nada. Es el mismo fallo que
     `undefined` frente a `null` en registro.js: dos cosas distintas escritas
     igual. */
  assert.deepEqual(flojos, [], `niveles presentes pero vacíos:\n  ${flojos.join('\n  ')}`);
});

/* ================================================================
   2 · LA FICHA, QUE ES LO QUE PIDE LA §10
   ================================================================ */

test('todo dato visible lleva ficha con sus campos obligatorios', () => {
  const incompletos = [];
  for (const [clave, d] of entradas) {
    if (!ESTADOS_VISIBLES.includes(d.estado)) continue;
    if (!d.ficha) {
      incompletos.push(`${clave}: sin ficha`);
      continue;
    }
    for (const campo of FICHA_OBLIGATORIA) {
      if (!(campo in d.ficha)) incompletos.push(`${clave}.ficha.${campo}`);
    }
  }
  assert.deepEqual(
    incompletos,
    [],
    'la §10 exige atribución a autor y edición para todo lo que se muestra:\n  ' +
    incompletos.join('\n  ')
  );
});

/* ================================================================
   3 · LOS TRES ESTADOS
   ================================================================ */

test('el estado es siempre uno de los tres, y el bloque uno de los dos', () => {
  const malos = [];
  for (const [clave, d] of entradas) {
    if (!ESTADOS.includes(d.estado)) malos.push(`${clave}.estado = ${d.estado}`);
    if (!BLOQUES.includes(d.bloque)) malos.push(`${clave}.bloque = ${d.bloque}`);
  }
  assert.deepEqual(malos, [], malos.join('\n  '));
});

test('un dato sin verificar no se declara visible', () => {
  /* Redundante hoy y a propósito: el día que se añada un campo `visible`
     explícito, esta prueba lo coge antes de que llegue a pantalla. */
  const contradictorios = entradas
    .filter(([, d]) => d.estado === 'sin_verificar' && d.visible === true)
    .map(([clave]) => clave);

  assert.deepEqual(contradictorios, [], contradictorios.join('\n  '));
});

/* ================================================================
   4, 5 y 6 · EL NIVEL 4 — celebraciones y ritos (0018)
   ================================================================ */

test('ningún nivel4 sin etnografía de clase 5 completa', () => {
  const flojos = [];
  for (const [clave, d] of entradas) {
    if (d.nivel4 === null || d.nivel4 === undefined) continue;

    if (!d.etnografia) {
      flojos.push(`${clave}: tiene nivel4 y no tiene etnografia`);
      continue;
    }
    for (const campo of ETNOGRAFIA_OBLIGATORIA) {
      const v = d.etnografia[campo];
      if (typeof v !== 'string' || v.trim().length === 0) {
        flojos.push(`${clave}.etnografia.${campo}`);
      }
    }
  }
  assert.deepEqual(
    flojos,
    [],
    'la clase ⑤ obliga a quién, dónde, cuándo y quién lo documentó. Faltando ' +
    `uno, no entra:\n  ${flojos.join('\n  ')}`
  );
});

test('ningún nivel4 en un dato del bloque A', () => {
  const mal = entradas
    .filter(([, d]) => d.nivel4 && d.bloque === 'A')
    .map(([clave]) => clave);

  assert.deepEqual(
    mal,
    [],
    'el bloque A está disponible antes de anotar y no puede nombrar estados ni ' +
    `cualidades (0015). Casi todo rito lleva cualidad pegada:\n  ${mal.join('\n  ')}`
  );
});

test('ningún nivel4 se dirige a la persona ni habla en presente de una costumbre', () => {
  /* Entre «se ofrendaba» y «puedes ofrendar» está toda la distancia que este
     proyecto lleva ocho meses manteniendo. */
  const PROHIBIDO = [
    /\btú\b/i, /\bti\b/i, /\btu[sy]?\b/i, /\bcontigo\b/i,
    /\bpuedes\b/i, /\bdebes\b/i, /\bprueba a\b/i, /\bte (conviene|ayuda|va)\b/i,
    /\bhoy es\b/i, /\bes buen (día|momento)\b/i,
    /\bapr[oó]vecha\b/i, /\bhaz\b/i, /\bcelebra\b/i, /\bofrenda\b/i
  ];

  const mal = [];
  for (const [clave, d] of entradas) {
    if (!d.nivel4) continue;
    for (const patron of PROHIBIDO) {
      if (patron.test(d.nivel4)) mal.push(`${clave}: coincide con ${patron}`);
    }
  }
  assert.deepEqual(
    mal,
    [],
    'el nivel 4 va en pasado y en tercera persona, siempre (0018):\n  ' +
    mal.join('\n  ')
  );
});

/* ================================================================
   7 · EL CONTROL NEGATIVO NO LLEGA A PANTALLA
   ================================================================ */

test('los biorritmos no están en fuentes.js, ni por asomo', async () => {
  /* La 0015: los biorritmos son el control negativo del proyecto, y sirven
     precisamente porque cruzarlos con los registros no puede dar nada. El día
     que la app enseñe «hoy tu curva emocional está baja», el control deja de
     poder decir que no. EL INSTRUMENTO SE ROMPE AL MIRARLO.

     Se comprueba dos veces: en las claves y en el fichero entero, porque
     alguien podría meterlos dentro de un nivel sin crear una clave. */
  const enClaves = Object.keys(FUENTES).filter((k) =>
    JAMAS_EN_PANTALLA.some((p) => k.toLowerCase().includes(p))
  );
  assert.deepEqual(enClaves, [], `claves prohibidas:\n  ${enClaves.join('\n  ')}`);

  const fuente = await readFile(join(RAIZ, 'app/js/fuentes.js'), 'utf8');
  /* Se excluye el bloque de cabecera, que EXPLICA por qué no pueden estar. */
  const cuerpo = fuente.slice(fuente.indexOf('export const FUENTES'));
  const enCuerpo = JAMAS_EN_PANTALLA.filter((p) =>
    new RegExp(`\\b${p}\\b`, 'i').test(cuerpo)
  );
  assert.deepEqual(
    enCuerpo,
    [],
    `mencionados en los datos, no solo en la cabecera:\n  ${enCuerpo.join('\n  ')}`
  );
});

/* ================================================================
   8 · LA FICHA Y EL DATO HABLAN DEL MISMO OBJETO
   ================================================================ */

test('toda clave de fuentes.js aparece en hoja-de-cielo.mjs', async () => {
  /* Una ficha preciosa de algo que la app no calcula es una ficha que nadie va
     a abrir nunca. Y al revés: un dato calculado sin ficha es lo que la §10
     prohíbe. Esta prueba coge la primera mitad. */
  const hoja = await readFile(
    join(RAIZ, 'herramientas/hoja-de-cielo.mjs'),
    'utf8'
  ).catch(() => null);

  if (hoja === null) {
    /* No se salta en silencio: se dice. Un skip mudo es una prueba que pasa
       sin comprobar nada. */
    console.warn(
      '  aviso: herramientas/hoja-de-cielo.mjs no está; la prueba 8 no ha ' +
      'comprobado nada'
    );
    return;
  }

  /* Los términos que tienen que aparecer, en el nombre que usa la hoja. No es
     la clave literal: la hoja los llama por su nombre en español o por el
     término técnico. Se busca cualquiera de las dos formas. */
  const ALIAS = {
    zodiaco_tropical: ['SIGNOS', 'tropical'],
    zodiaco_sidereo: ['ayan', 'sidéreo', 'sidereo'],
    jieqi: ['TERM', 'Lichun'],
    tithi: ['tithi', 'sep'],
    nakshatra: ['NAK'],
    fases_rudhyar: ['FASES'],
    casas: ['sistemas', 'casaDe'],
    tzolkin: ['TZ_N', 'tzolkin'],
    calendario_islamico: ['islamic'],
    numerologia: ['numerolog', 'nombre_completo']
  };

  const huerfanas = [];
  for (const clave of Object.keys(FUENTES)) {
    const alias = ALIAS[clave];
    if (!alias) {
      huerfanas.push(`${clave}: sin alias declarado en esta prueba`);
      continue;
    }
    if (!alias.some((a) => hoja.includes(a))) {
      huerfanas.push(`${clave}: no se encuentra ninguno de ${alias.join(', ')}`);
    }
  }
  assert.deepEqual(
    huerfanas,
    [],
    `fichas de datos que la app no calcula:\n  ${huerfanas.join('\n  ')}`
  );
});

/* ================================================================
   Y una que no está en la lista de la 0016, pero hace falta
   ================================================================ */

test('ningún dato de clase 1 guarda un valor calculado', () => {
  /* Las clases ① se recalculan del timestamp SIEMPRE. Un valor congelado aquí
     sería un motor viejo escondido, y el fallo tardaría meses en verse porque
     el número seguiría pareciendo razonable. */
  const congelados = [];
  for (const [clave, d] of entradas) {
    if (d.clase !== 1) continue;
    for (const prohibido of ['nivel2', 'valor', 'actual', 'hoy']) {
      if (prohibido in d) congelados.push(`${clave}.${prohibido}`);
    }
  }
  assert.deepEqual(
    congelados,
    [],
    `las clases ① no almacenan resultado:\n  ${congelados.join('\n  ')}`
  );
});
