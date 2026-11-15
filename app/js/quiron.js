/* =====================================================================
   Umbral — Quirón  ·  app/js/quiron.js

   El motor (astronomy-engine 2.1.19) no trae Quirón. Este módulo lo
   calcula a partir de 20 vectores de estado de JPL Horizons, uno cada
   ~10 años entre 1905 y 2095, haciéndolos avanzar o retroceder con el
   GravitySimulator del propio motor, que integra la gravedad del Sol y
   de los planetas. Decidido el 13-15 de noviembre de 2026 (pendiente 43,
   decisión 0031), con el error medido delante.

   DE DÓNDE SALEN LOS NÚMEROS — y no se tocan sin volver a descargarlos:
     JPL Horizons, API 1.2. Objeto: 2060 Chiron (1977 UB).
     Solución orbital JPL#171, fecha de solución 2026-06-05 06:09,
     6026 observaciones de 1895 a 2026.
     Vectores geométricos, centro en el baricentro del sistema solar
     (DE441), marco ICRF, unidades ua y ua/día, tiempos en TDB.
     Descargados por Ana el 13 de noviembre de 2026 (04:57 UTC).
   De los 2435 vectores descargados (uno cada 30 días, 1900-2100) se
   guardan aquí uno de cada 122: el resto sirvió para medir el error.

   EL ERROR, MEDIDO CONTRA EL PROPIO HORIZONS (longitud eclíptica
   aparente geocéntrica, 609 fechas de 1900 a 2100): máximo 1,21″,
   media 0,14″. La tresmilésima parte del orbe de 1°.

   FUERA DE 1900-2100 NO HAY QUIRÓN —exactamente, del 1 de enero de 1900
   al 3 de diciembre de 2099, la última fecha que dio Horizons con paso de
   30 días—: estadoQuiron() devuelve null. No se
   extrapola: no hay datos de JPL descargados para esas fechas, y la
   órbita de Quirón cruza las de Saturno y Urano, así que extrapolar sin
   datos sería inventar.

   CÓMO SE CALCULA, y por qué así. Hacer avanzar el simulador desde el
   vector más cercano cuesta hasta ~365 pasos de 5 días. En vez de
   repetirlo en cada llamada, la primera vez que se pide una fecha de un
   bloque de 10 años se recorre el bloque entero, una sola vez, y se
   guardan los estados cada 5 días; después, cada fecha se interpola entre
   los dos estados vecinos con Hermite cúbico (posición y velocidad). La
   interpolación con nodos de 5 días añade un error menor de 0,01″
   (medido: nodos de 60 días dan 0,002″).
   ===================================================================== */

const Astronomia = globalThis.Astronomy;
if (!Astronomia) {
  throw new Error('quiron.js: falta el motor. Carga js/vendor/astronomy.browser.min.js antes que este módulo.');
}

/* [JD TDB, X, Y, Z, VX, VY, VZ] — ua y ua/día, baricéntricos, ICRF. */
export const ANCLAS_QUIRON = [
  [2416850.500000000, 7.185610060407130E+00, -1.132373295908975E+01, -3.106311370496585E+00, 4.551041480867915E-03, 6.229752319828542E-04, 4.801529723764841E-04],   // 1905-Jan-05
  [2420510.500000000, 1.781822012290140E+01, -3.726443254463857E+00, -5.695808163557044E-02, 1.251785057258500E-03, 2.881998110405066E-03, 9.828955851388928E-04],   // 1915-Jan-13
  [2424170.500000000, 1.674296484273986E+01, 6.877939115243419E+00, 3.204536107743978E+00, -1.793521854143820E-03, 2.608426177206563E-03, 7.066969939258507E-04],   // 1925-Jan-20
  [2427830.500000000, 5.076678907209363E+00, 1.264886542557442E+01, 4.287143934314709E+00, -4.435527371696705E-03, -2.000455705081019E-05, -2.833345632579506E-04],   // 1935-Jan-28
  [2431490.500000000, -8.470814984561425E+00, 3.555146034827716E-01, -4.168585421323397E-01, 1.419251695609833E-04, -6.613578823274107E-03, -2.065112019904899E-03],   // 1945-Feb-04
  [2435150.500000000, 6.822072484138479E+00, -1.131106691151398E+01, -3.120470775822674E+00, 4.635023593556795E-03, 5.300322353873891E-04, 4.548097819293014E-04],   // 1955-Feb-12
  [2438810.500000000, 1.773600748641132E+01, -3.851005649888689E+00, -1.028168101205040E-01, 1.317396722316768E-03, 2.873682447847690E-03, 9.825068223944264E-04],   // 1965-Feb-19
  [2442470.500000000, 1.689413069774480E+01, 6.768415300903547E+00, 3.172107794536752E+00, -1.725854330850526E-03, 2.626236315711829E-03, 7.154235566020877E-04],   // 1975-Feb-27
  [2446130.500000000, 5.503951812677926E+00, 1.273150932541555E+01, 4.331508175201308E+00, -4.362143800483172E-03, 9.317944764914976E-05, -2.422803555171298E-04],   // 1985-Mar-06
  [2449790.500000000, -8.465212942346744E+00, 1.158841274283063E+00, -1.620789102155586E-01, -3.323491352567349E-04, -6.577578820279617E-03, -2.080681713823352E-03],   // 1995-Mar-14
  [2453450.500000000, 6.252998273943478E+00, -1.137490851369412E+01, -3.173823242291916E+00, 4.728155706527414E-03, 3.598040330664415E-04, 4.060053364128028E-04],   // 2005-Mar-21
  [2457110.500000000, 1.756935166394651E+01, -4.222248092708837E+00, -2.324589088746434E-01, 1.427910221982187E-03, 2.846437012939337E-03, 9.796888651192285E-04],   // 2015-Mar-29
  [2460770.500000000, 1.711912322153910E+01, 6.420496391555278E+00, 3.071437734081290E+00, -1.622035496705944E-03, 2.665333440857550E-03, 7.337783941422454E-04],   // 2025-Apr-05
  [2464430.500000000, 6.074955120927705E+00, 1.270522715948888E+01, 4.353877022388629E+00, -4.291462543180208E-03, 2.513899292139268E-04, -1.873674697156970E-04],   // 2035-Apr-13
  [2468090.500000000, -8.394977958343322E+00, 2.025915432390245E+00, 1.141813374436651E-01, -8.588455399357684E-04, -6.469042637858680E-03, -2.078172499571621E-03],   // 2045-Apr-20
  [2471750.500000000, 5.599871533815840E+00, -1.140967202232079E+01, -3.224882962068817E+00, 4.832555840470809E-03, 1.640596455251537E-04, 3.504385037403558E-04],   // 2055-Apr-28
  [2475410.500000000, 1.736227761573915E+01, -4.593574180809926E+00, -3.639019111778263E-01, 1.545195771306480E-03, 2.819537284782587E-03, 9.780220930154582E-04],   // 2065-May-05
  [2479070.500000000, 1.730743974075921E+01, 6.076217224017095E+00, 2.972007543751060E+00, -1.521597232181015E-03, 2.704331584623896E-03, 7.522407725445323E-04],   // 2075-May-13
  [2482730.500000000, 6.596371613832086E+00, 1.266285591959855E+01, 4.370940354663757E+00, -4.220888373767929E-03, 3.946050049756467E-04, -1.375216295607196E-04],   // 2085-May-20
  [2486390.500000000, -8.248990465590600E+00, 2.810735949429152E+00, 3.719841916037984E-01, -1.310531238493623E-03, -6.336591761311927E-03, -2.060788246794746E-03],   // 2095-May-28
];

/* El rango de los datos descargados y medidos, en JD TDB: del
   1900-01-01 al 2099-12-03. El último vector de Horizons cae ahí, no el
   1 de enero de 2100: con paso de 30 días no se llega a esa fecha. El
   simulador podría seguir algo más allá, pero no hay nada con que medir
   su error, y un valor sin error medido no se da. */
export const QUIRON_DESDE_JD = 2415020.5;
export const QUIRON_HASTA_JD = 2488040.5;
const MEDIO_BLOQUE = 1830;          // días: la mitad de la distancia entre dos anclas (122 × 30 / 2)
const PASO = 5;                     // días por paso del simulador

const bloques = new Map();          // índice de ancla → { adelante: [], atras: [] } estados cada PASO días

function recorrer(ancla, sentido) {
  const [jd, x, y, z, vx, vy, vz] = ancla;
  const t0 = Astronomia.MakeTime(jd - 2451545.0);
  const sim = new Astronomia.GravitySimulator(Astronomia.Body.SSB, t0,
    [new Astronomia.StateVector(x, y, z, vx, vy, vz, t0)]);
  const estados = [{ x, y, z, vx, vy, vz }];
  /* Dos nodos de margen: el tiempo de luz hace pedir instantes hasta
     ~2,5 h antes del borde del bloque. */
  const pasos = Math.ceil(MEDIO_BLOQUE / PASO) + 2;
  for (let k = 1; k <= pasos; k++) {
    const s = sim.Update(Astronomia.MakeTime(jd - 2451545.0 + sentido * k * PASO))[0];
    estados.push({ x: s.x, y: s.y, z: s.z, vx: s.vx, vy: s.vy, vz: s.vz });
  }
  return estados;
}

function bloque(i) {
  if (!bloques.has(i)) bloques.set(i, { adelante: recorrer(ANCLAS_QUIRON[i], +1), atras: recorrer(ANCLAS_QUIRON[i], -1) });
  return bloques.get(i);
}

function hermite(a, b, h, s) {
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1, h10 = s ** 3 - 2 * s ** 2 + s, h01 = -2 * s ** 3 + 3 * s ** 2, h11 = s ** 3 - s ** 2;
  const c = (p, v) => h00 * a[p] + h10 * h * a[v] + h01 * b[p] + h11 * h * b[v];
  return { x: c('x', 'vx'), y: c('y', 'vy'), z: c('z', 'vz') };
}

/* Posición baricéntrica de Quirón (ua, ICRF) en un instante dado en días
   TT desde J2000 (TT y TDB difieren menos de 2 ms). null fuera de rango.

   EL MARGEN DE LA LUZ. Para saber dónde SE VE Quirón en un instante hay que
   saber dónde ESTABA cuando salió su luz, entre 1 y 2,6 h antes. Así que en
   el borde de 1900 el instante pedido está dentro del rango y el que hace
   falta, unas horas fuera. `margen` permite esas horas —0,2 días, el
   doble del tiempo de luz máximo—, y SOLO lo usa vectorAparenteQuiron, que
   comprueba antes que el instante pedido sí está dentro. */
export function estadoQuiron(ttDias, margen = 0) {
  const jd = ttDias + 2451545.0;
  if (!(jd >= QUIRON_DESDE_JD - margen && jd <= QUIRON_HASTA_JD + margen)) return null;
  let i = 0;
  for (let k = 1; k < ANCLAS_QUIRON.length; k++) {
    if (Math.abs(ANCLAS_QUIRON[k][0] - jd) < Math.abs(ANCLAS_QUIRON[i][0] - jd)) i = k;
  }
  const d = jd - ANCLAS_QUIRON[i][0];
  const lista = d >= 0 ? bloque(i).adelante : bloque(i).atras;
  const u = Math.abs(d) / PASO;
  const k = Math.min(Math.floor(u), lista.length - 2);
  const a = lista[k], b = lista[k + 1];
  /* En la lista de atrás el tiempo corre al revés: el paso es −PASO. */
  return hermite(a, b, d >= 0 ? PASO : -PASO, u - k);
}

/* Velocidad de la luz en ua/día: c = 299 792 458 m/s (definición del SI)
   y 1 ua = 149 597 870 700 m (IAU 2012, Resolución B2, la misma que
   declara la cabecera de Horizons). Fichadas en 03-registro-de-datos.md. */
const C_UA_DIA = 299792458 * 86400 / 149597870700;

/* Vector geocéntrico APARENTE de Quirón, en el marco J2000 (EQJ): con
   tiempo de luz (tres iteraciones) y aberración de primer orden (sumar la
   velocidad de la Tierra por el tiempo de luz). Es lo que hay que hacer
   para que Quirón se mida igual que los demás cuerpos, a los que el motor
   ya aplica las dos correcciones. Medido: sin ellas el error llega a
   28,8″; con ellas, 1,21″. Devuelve un Vector del motor, o null. */
export function vectorAparenteQuiron(ms) {
  const t = Astronomia.MakeTime(new Date(ms));
  if (!estadoQuiron(t.tt)) return null;                     // el instante pedido, dentro del rango
  const tierra = Astronomia.BaryState(Astronomia.Body.Earth, t);
  let tau = 0, g = null;
  for (let i = 0; i < 3; i++) {
    const s = estadoQuiron(t.tt - tau, 0.2);
    if (!s) return null;
    g = { x: s.x - tierra.x, y: s.y - tierra.y, z: s.z - tierra.z };
    tau = Math.hypot(g.x, g.y, g.z) / C_UA_DIA;
  }
  return new Astronomia.Vector(g.x + tierra.vx * tau, g.y + tierra.vy * tau, g.z + tierra.vz * tau, t);
}
