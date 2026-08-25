/* =====================================================================
   Umbral — la Luna  ·  app/js/luna.js
   Fase 1. Decisiones 0012 (calendario personal) y 0013 (forzamiento de
   marea). Reglas 0.1 y 0.2.

   Módulo puro: no toca el DOM, no lee el reloj del sistema, no consulta
   la red. Todo entra por parámetro. Lo que sale se puede reproducir con
   una fecha y unas coordenadas, y por eso se puede probar.

   NO CALCULA NADA DE LA PERSONA. Aquí solo hay cielo. Mezclar esto con
   lo autoinformado en una misma fórmula o en un mismo número es la
   regla 0.2, y no se hace en ninguna parte.

   TODO instante entra como epoch en milisegundos —el `timestamp` que ya
   guarda cada registro— y no como fecha civil. Un instante es un
   instante en todo el planeta y no necesita zona para convertirse en
   cielo (decisión 0013). La zona solo hace falta para decir en qué DÍA
   civil cayó, y para eso está `Intl`.
   ===================================================================== */

/* El motor lo pone js/vendor/astronomy.browser.min.js, que es UMD y no
   módulo ES: se carga con un <script> clásico antes que este módulo y deja
   `Astronomy` en el global. Medido: esa build son 116 KB (45,5 KB
   comprimidos, que es la cifra que fichó la §3); la build en módulo ES son
   412 KB (105 KB comprimidos). En una app que tiene que abrir sin cobertura,
   296 KB de más no se pagan por evitar una variable global.

   Y la misma UMD se puede cargar desde Node con require(), así que las
   pruebas doradas ejercitan EXACTAMENTE los bytes que se instalan en el
   móvil, no otra build parecida. */
const Astronomia = globalThis.Astronomy;
if (!Astronomia) {
  throw new Error(
    'luna.js: falta el motor. Carga js/vendor/astronomy.browser.min.js ' +
    'con un <script> clásico antes que este módulo.'
  );
}

/* =====================================================================
   1. CONSTANTES
   Todas fichadas en docs/registro-de-datos.md. Sin fila en esa tabla, el
   número no se escribe aquí: es la regla 0.1 y no admite excepción.
   ===================================================================== */

/* Parámetro gravitacional de la Luna.
   Fuente: JPL DE440/DE441, Park et al., Astronomical Journal 161:105, 2021.
   Ficha: docs/registro-de-datos.md#marea */
const GM_LUNA = 4.9028001e12;        // m³/s²

/* Parámetro gravitacional del Sol, valor NOMINAL.
   Fuente: IAU 2015 Resolución B3, nominal_solar_mass_parameter.
   Ficha: docs/registro-de-datos.md#marea */
const GM_SOL = 1.32712440018e20;     // m³/s²

/* Radio medio volumétrico de la Tierra.
   Fuente: IUGG / GRS80, radio medio R₂.
   Ficha: docs/registro-de-datos.md#marea */
const R_TIERRA = 6.371e6;            // m

/* 1 µGal = 1e-8 m/s². El Gal es la unidad de aceleración de la
   gravimetría, y es la unidad en la que se miden las mareas de verdad.
   Se muestra en µGal y NUNCA normalizado a 0–1 ni a media 1,00
   (decisión 0013): un número normalizado esconde la magnitud y depende
   del año que se tome de referencia. */
const MICROGAL = 1e-8;               // m/s²

const KM = Astronomia.KM_PER_AU;

/* =====================================================================
   2. GEOMETRÍA
   ===================================================================== */

const instante = (ms) => new Astronomia.AstroTime(new Date(ms));

/* Observador. La altitud entra porque afecta a la hora de salida: desde
   686 m se ve salir la Luna antes que desde el nivel del mar. */
export function observador({ lat, lon, altitud = 0 }) {
  return new Astronomia.Observer(lat, lon, altitud);
}

const modulo = (v) => Math.hypot(v.x, v.y, v.z) * KM * 1000;   // metros

/* =====================================================================
   3. FORZAMIENTO DE MAREA
   ===================================================================== */

/* Por qué el cubo y no el cuadrado.

   La atracción de un cuerpo va con M/r². Esa fuerza tira de la Tierra
   ENTERA y no produce ninguna marea: si tirase igual de todo, la Tierra
   se movería junta y aquí no se notaría nada.

   La marea aparece porque no tira igual de todo: el lado que mira está
   unos 6.371 km más cerca que el centro. Lo que estira es la DIFERENCIA,
   y al restar dos valores de 1/r² muy próximos queda la derivada, que es
   −2/r³.

        forzamiento ∝ M / r³

   Consecuencia: en la marea, la distancia pesa mucho más que la masa. El
   Sol tiene 27 millones de veces la masa de la Luna pero está 390 veces
   más lejos, y 390³ son 59 millones: 27 ÷ 59 = 0,46. */

/* Amplitud del forzamiento: la aceleración diferencial en el punto que
   tiene el cuerpo justo encima. Siempre con la distancia REAL, nunca con
   la media (decisión 0013): entre perigeo y apogeo hay un 10 % de
   diferencia, y al cubo son un 32 % de forzamiento que la media borraría
   sin que nada avisara. */
export function amplitudDeMarea(GM, distancia_m) {
  return (2 * GM * R_TIERRA) / distancia_m ** 3 / MICROGAL;
}

/* Componente vertical del forzamiento según dónde esté el cuerpo respecto
   a tu vertical:  (GM·R/r³)·(3cos²ψ − 1).

   Con el cuerpo en el cenit vale +2GM·R/r³ —tira hacia arriba— y con el
   cuerpo en el horizonte vale la mitad y hacia abajo. Pasa por dos
   máximos al día porque la Tierra gira, y ese es exactamente el rasgo que
   separa esta magnitud de la mensual. */
function verticalDeMarea(GM, distancia_m, cosZenit) {
  return (GM * R_TIERRA) / distancia_m ** 3 * (3 * cosZenit ** 2 - 1) / MICROGAL;
}

/* ¿En qué punto del ciclo estaba? Depende de la distancia real de la Luna
   Y de la alineación Sol–Luna, o sea de la fase. NO depende de la
   rotación de la Tierra: vale lo mismo a las 10:30 que a las 23:00 del
   mismo día.

   El término solar va modulado por cos(2·elongación): en sicigia —luna
   nueva o llena— vale +1 y los dos forzamientos suman; en cuadratura
   vale −1 y se restan. De ahí sale la envolvente del modelo de
   equilibrio, sin necesidad de ninguna amplitud tabulada.

   OJO: el término solar es imprescindible. Definir esto como «solo la
   distancia lunar» dejaría fuera el efecto de la fase, que es
   precisamente lo que la envolvente mide. */
export function mareaMensual(ms) {
  const t = instante(ms);
  const rLuna = modulo(Astronomia.GeoMoon(t));
  const rSol = modulo(Astronomia.GeoVector(Astronomia.Body.Sun, t, true));
  const elongacion = Astronomia.PairLongitude(
    Astronomia.Body.Moon, Astronomia.Body.Sun, t) * Math.PI / 180;

  return amplitudDeMarea(GM_LUNA, rLuna) +
         amplitudDeMarea(GM_SOL, rSol) * Math.cos(2 * elongacion);
}

/* ¿Cuánto tiraba de ti en ese segundo? Lo anterior más dónde estaban los
   dos cuerpos respecto a TU vertical. Pasa por dos máximos al día.

   Se calcula en el timestamp exacto y nunca al mediodía local: entre las
   10:30 y las 23:00 la Luna ha cruzado medio cielo, y el mediodía sería
   un instante inventado (decisión 0013). */
export function mareaInstantanea(ms, obs) {
  const t = instante(ms);
  let total = 0;
  for (const [cuerpo, GM] of [[Astronomia.Body.Moon, GM_LUNA],
                              [Astronomia.Body.Sun, GM_SOL]]) {
    const eq = Astronomia.Equator(cuerpo, t, obs, true, true);
    const hor = Astronomia.Horizon(t, obs, eq.ra, eq.dec, 'normal');
    const r = eq.dist * KM * 1000;
    total += verticalDeMarea(GM, r, Math.cos((90 - hor.altitude) * Math.PI / 180));
  }
  return total;
}

/* =====================================================================
   4. FASE, ILUMINACIÓN, DISTANCIA
   ===================================================================== */

export function luna(ms) {
  const t = instante(ms);
  const il = Astronomia.Illumination(Astronomia.Body.Moon, t);
  return {
    /* 0 nueva · 90 creciente · 180 llena · 270 menguante */
    fase_grados: Astronomia.MoonPhase(t),
    iluminacion: il.phase_fraction,
    distancia_km: modulo(Astronomia.GeoMoon(t)) / 1000
  };
}

/* =====================================================================
   5. SALIDA Y PUESTA
   ===================================================================== */

/* Salida y puesta de la Luna dentro de un día civil, en la zona dada.

   UN DÍA SIN SALIDA NO ES UN DÍA SIN LUNA. Como cada salida se retrasa
   unos cincuenta minutos, una vez al mes la salida cruza la medianoche y
   un día civil se queda sin ninguna. Otro se queda sin puesta. No es un
   fallo del cálculo: es la geometría (decisión 0012).

   Cuando eso pasa se devuelve `null` CON MOTIVO, y no se toca ni la
   iluminación ni la marea, que ese día se calculan con normalidad. Poner
   la iluminación a cero porque no hubo salida sería escribir un dato
   falso, que es peor que un dato ausente. */
export function salidaYPuesta(ms, obs, zona) {
  const dia = new Intl.DateTimeFormat('en-CA', { timeZone: zona }).format(new Date(ms));
  const mismoDia = (d) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: zona }).format(d) === dia;

  /* Se empieza a buscar 30 h antes para no perder un evento de madrugada,
     y se recorren los siguientes tres días: el suficiente para cubrir el
     hueco de 24 h 50 min con margen. */
  const desde = new Date(ms - 30 * 3600e3);

  const buscar = (direccion) => {
    let t = desde;
    for (let i = 0; i < 5; i++) {
      const r = Astronomia.SearchRiseSet(Astronomia.Body.Moon, obs, direccion, t, 3);
      if (!r) return null;
      if (mismoDia(r.date)) return r.date.getTime();
      if (r.date.getTime() > ms + 30 * 3600e3) return null;
      t = new Date(r.date.getTime() + 3600e3);
    }
    return null;
  };

  const salida = buscar(+1);
  const puesta = buscar(-1);

  return {
    dia_civil: dia,
    salida,
    puesta,
    /* El motivo se declara: quien lea esto después tiene que poder
       distinguir "no ocurre" de "no se calculó". */
    motivo_sin_salida: salida === null ? 'no ocurre en este día civil' : null,
    motivo_sin_puesta: puesta === null ? 'no ocurre en este día civil' : null
  };
}

/* =====================================================================
   5b. EL DÍA LUNAR, CADA UNO CON LA SUYA
   ===================================================================== */

/* El día lunar va de una salida de la Luna a la SIGUIENTE. No de la salida
   a la puesta: eso no es un día, es un periodo de visibilidad, y deja fuera
   todas las horas en que la Luna está bajo el horizonte (decisión 0012).

   NO SE USA NINGUNA DURACIÓN MEDIA, NI AQUÍ NI EN NINGUNA PARTE. Cada día
   lunar lleva la suya, calculada de sus dos salidas reales.

   El motivo no es purismo. Medido sobre los 353 intervalos de 2026 en
   Albacete: la media son 24 h 51 min, pero el más corto dura 24 h 22 min y
   el más largo 25 h 20 min. Son 58 minutos entre uno y otro, porque la
   duración depende de la declinación de la Luna y de la latitud. Una
   rejilla que dibujase todos los días lunares del mismo ancho estaría
   mintiendo casi una hora, y sin que nada avisara.

   La media de 24 h 51 min que aparece en registro-de-datos.md es una
   MEDIDA DESCRIPTIVA, para saber de qué orden hablamos. No entra en ningún
   cálculo. Lo mismo vale para los 28,52 días lunares por lunación. */
export function diaLunar(ms, obs) {
  const desde = new Date(ms - 26 * 3600e3);
  let anterior = null;

  for (let i = 0; i < 5; i++) {
    const r = Astronomia.SearchRiseSet(Astronomia.Body.Moon, obs, +1, desde, 3);
    if (!r) return null;
    const t = r.date.getTime();
    if (t > ms) {
      /* La salida que abre el día lunar en el que cae `ms` es la anterior a
         `ms`; esta de aquí es la que lo cierra. */
      if (anterior === null) return null;
      return {
        empieza: anterior,
        termina: t,
        horas: (t - anterior) / 3600e3,
        /* Cuánto se aparta ESTE día de los 24 h exactos del reloj civil.
           Es el número que hace falta para dibujarlo a su ancho. */
        desfase_minutos: (t - anterior) / 60000 - 1440
      };
    }
    anterior = t;
    desde.setTime(t + 3600e3);
  }
  return null;
}

/* =====================================================================
   6. TODO JUNTO
   ===================================================================== */

/* Lo que se le añade a un registro ya guardado. Recibe su `timestamp` y
   nada más suyo: ni escalas, ni necesidad, ni nota. Este módulo no las ve
   y no tiene por qué verlas.

   Se puede llamar sobre registros de cualquier fecha pasada: la efeméride
   de un instante viejo se calcula igual de bien que la de hoy, y sin red.
   Por eso las ventanas de prueba no tenían que alinearse con las fases. */
export function contextoLunar(timestamp, obs, zona) {
  const l = luna(timestamp);
  return {
    fase_grados: l.fase_grados,
    iluminacion: l.iluminacion,
    distancia_km: l.distancia_km,
    marea_mensual_ugal: mareaMensual(timestamp),
    marea_instantanea_ugal: mareaInstantanea(timestamp, obs),
    ...salidaYPuesta(timestamp, obs, zona)
  };
}

/* Se exportan para que las pruebas puedan comprobar la fórmula con
   distancias puestas a mano, sin depender de una fecha concreta. */
export const CONSTANTES = { GM_LUNA, GM_SOL, R_TIERRA, MICROGAL };
