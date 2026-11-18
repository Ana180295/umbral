/* actualizar-deltat.mjs — convierte el deltat.data del IERS en app/js/deltat.js.
 * Decisión 0034.
 *
 *   node herramientas/actualizar-deltat.mjs ~/Descargas/deltat/deltat.data "18 de noviembre de 2026"
 *
 * El fichero se descarga a mano (este entorno no llega al servidor):
 *   https://maia.usno.navy.mil/ser7/deltat.data
 * Copia el original en pruebas/datos/iers-deltat.data, para que
 * pruebas/deltat.test.mjs compruebe que la tabla del módulo es exactamente la
 * del IERS, y reescribe app/js/deltat.js entero. Después: subir VERSION en
 * sw.js, pasar las pruebas y commit.
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export function leerDeltatData(texto) {
  const filas = texto.trim().split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const c = l.split(/\s+/);
    if (c.length !== 4) throw new Error(`línea con ${c.length} columnas: «${l}»`);
    const [anio, mes, dia, valor] = [Number(c[0]), Number(c[1]), Number(c[2]), Number(c[3])];
    if (![anio, mes, dia, valor].every(Number.isFinite) || dia !== 1) throw new Error(`línea ilegible: «${l}»`);
    return { anio, mes, valor };
  });
  for (let i = 1; i < filas.length; i++) {
    const a = filas[i - 1], b = filas[i];
    if (b.anio * 12 + b.mes !== a.anio * 12 + a.mes + 1) throw new Error(`hueco entre ${a.anio}-${a.mes} y ${b.anio}-${b.mes}`);
  }
  return filas;
}

export function escribirModulo(filas, descargado) {
  const v = filas.map((f) => f.valor.toFixed(4));
  const lineas = [];
  for (let i = 0; i < v.length; i += 12) lineas.push('  ' + v.slice(i, i + 12).join(', '));
  const p = filas[0], u = filas[filas.length - 1];
  return `/* =================================================================
   Umbral — el ΔT medido (TT − UT1), puesto al motor. Decisión 0034.

   ESTE FICHERO LO ESCRIBE herramientas/actualizar-deltat.mjs a partir del
   deltat.data del IERS. No se edita a mano: se descarga el fichero nuevo y
   se vuelve a generar.

   Qué hace. astronomy-engine calcula en TT, el reloj uniforme, y la hora
   civil cuelga de UT1, la rotación de la Tierra. Su ΔT es un modelo
   (Espenak y Meeus) que acierta en el pasado pero en 2026 va 6 segundos
   por delante de lo medido: la Tierra ha girado algo más deprisa de lo que
   el modelo esperaba. Aquí se le da al motor lo medido:

   · De ${p.anio}-${String(p.mes).padStart(2, '0')} a ${u.anio}-${String(u.mes).padStart(2, '0')}: la tabla mensual del IERS, interpolada en línea
     recta. Cada valor es el del día 1 del mes a las 0h UTC.
   · Antes: el modelo del motor, que en 1972 ya acierta a 0,02 s. Durante
     el año anterior al primer valor, la diferencia con la tabla se reparte
     en línea recta para que no haya salto.
   · Después: la predicción del motor, desplazada para que empalme con el
     último valor medido. Es una predicción: nadie sabe el ΔT futuro.

   Se instala al importar el módulo, y lo importan todos los módulos que
   calculan (luna.js, carta.js, quiron.js, calendario.js), así que no hay
   ningún cálculo que use el ΔT del motor por descuido.
   ================================================================= */

const Astronomia = globalThis.Astronomy;
if (!Astronomia) {
  throw new Error('deltat.js necesita el motor astronómico (globalThis.Astronomy) cargado antes.');
}

export const DELTAT_FUENTE =
  'IERS Rapid Service/Prediction Center (Observatorio Naval de EE. UU.), ' +
  'deltat.data, «monthly determinations of Delta T since 1973». ' +
  ${JSON.stringify(`Descargado el ${descargado}.`)};

/* Primer mes de la tabla y valores mensuales en segundos. */
export const DELTAT_INICIO = { anio: ${p.anio}, mes: ${p.mes} };
export const DELTAT_MENSUAL = [
${lineas.join(',\n')}
];

const DIA_MS = 86400e3;
const J2000_MS = Date.UTC(2000, 0, 1, 12);
const utDelMes = (k) => (Date.UTC(DELTAT_INICIO.anio, DELTAT_INICIO.mes - 1 + k, 1) - J2000_MS) / DIA_MS;
const UT_PRIMERO = utDelMes(0);
const UT_ULTIMO = utDelMes(DELTAT_MENSUAL.length - 1);
const RAMPA_DIAS = 365;

const modelo = Astronomia.DeltaT_EspenakMeeus;
const DESFASE_INICIO = DELTAT_MENSUAL[0] - modelo(UT_PRIMERO);
const DESFASE_FINAL = DELTAT_MENSUAL[DELTAT_MENSUAL.length - 1] - modelo(UT_ULTIMO);

/* ut: días desde J2000 en UT, como los pasa el motor. Devuelve segundos. */
export function deltaT(ut) {
  if (ut > UT_ULTIMO) return modelo(ut) + DESFASE_FINAL;
  if (ut >= UT_PRIMERO) {
    /* El mes en que cae, buscado por fecha civil: los meses no miden igual. */
    const d = new Date(J2000_MS + ut * DIA_MS);
    let k = (d.getUTCFullYear() - DELTAT_INICIO.anio) * 12 + d.getUTCMonth() - (DELTAT_INICIO.mes - 1);
    k = Math.min(Math.max(k, 0), DELTAT_MENSUAL.length - 2);
    const a = utDelMes(k), b = utDelMes(k + 1);
    return DELTAT_MENSUAL[k] + (DELTAT_MENSUAL[k + 1] - DELTAT_MENSUAL[k]) * (ut - a) / (b - a);
  }
  if (ut >= UT_PRIMERO - RAMPA_DIAS) {
    return modelo(ut) + DESFASE_INICIO * (ut - (UT_PRIMERO - RAMPA_DIAS)) / RAMPA_DIAS;
  }
  return modelo(ut);
}

/* Los dos desfases, para las pruebas y para quien quiera saberlos. */
export const DELTAT_EMPALMES = { inicio: DESFASE_INICIO, final: DESFASE_FINAL };

Astronomia.SetDeltaTFunction(deltaT);
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [ruta, descargado] = process.argv.slice(2);
  if (!ruta || !descargado) {
    console.error('Uso: node herramientas/actualizar-deltat.mjs <deltat.data> "<fecha de descarga>"');
    process.exit(1);
  }
  const texto = fs.readFileSync(ruta, 'utf8');
  const filas = leerDeltatData(texto);
  fs.writeFileSync(new URL('../pruebas/datos/iers-deltat.data', import.meta.url), texto);
  fs.writeFileSync(new URL('../app/js/deltat.js', import.meta.url), escribirModulo(filas, descargado));
  const u = filas[filas.length - 1];
  console.log(`deltat.js escrito: ${filas.length} meses, hasta ${u.anio}-${u.mes} (${u.valor} s). Sube VERSION en sw.js.`);
}
