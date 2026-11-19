/* =====================================================================
   Umbral — «Tu cielo»  ·  app/js/cielo.js

   La carta natal en la forma que pinta la pantalla «Tu cielo» (decisión
   0038). No calcula nada por su cuenta: todo sale de cartaDelPerfil
   (perfil.js) y de carta.js. Aquí solo se elige qué se enseña y se
   escribe en texto: grados y minutos, signos, casas, aspectos.

   No toca el DOM: la pantalla vive en index.html. Así se puede probar en
   node (pruebas/tu-cielo.test.mjs).

   TRES CASOS, los mismos de cartaDelPerfil:
   · hora exacta  — todo, con las casas de los seis sistemas;
   · franja       — los dos extremos de la ventana (decisión 0030): lo que
                    cambia dentro sale como «entre … y …», y sin Ascendente,
                    Medio Cielo ni casas;
   · sin dato     — nada: no se supone ninguna hora.
   ===================================================================== */

import { cartaDelPerfil, ventanaDeNacimiento } from './perfil.js';
import { NOMBRES, SIGNOS, norm, cumpleanosLunar } from './carta.js';

/* Decisión 0038: por defecto, el sistema más usado. */
export const SISTEMA_POR_DEFECTO = 'Placidus';
/* El orden de los botones: de los más antiguos a los más modernos, el
   mismo en que los da carta.js. */
export const ORDEN_SISTEMAS = ['Signos enteros', 'Iguales', 'Porfirio', 'Placidus', 'Regiomontano', 'Campano'];

/* 17°13′ Cáncer. Los minutos se truncan, no se redondean: 17°59′50″ es
   17°59′, nunca 18°00′, que ya sería otro grado (y quizá otro signo). */
function partes(longitud) {
  const x = norm(longitud);
  const s = Math.floor(x / 30);
  const resto = x - 30 * s;
  let g = Math.floor(resto);
  let m = Math.floor((resto - g) * 60 + 1e-9);
  if (m === 60) { g += 1; m = 0; }
  return { grados: `${g}°${String(m).padStart(2, '0')}′`, signo: SIGNOS[s] };
}
export function posicion(longitud) {
  const p = partes(longitud);
  return `${p.grados} ${p.signo}`;
}

/* Los dos extremos de una franja, del primero al segundo en el tiempo
   (si el cuerpo va retrógrado, el segundo es menor). Con el mismo signo
   no se repite: «entre 17°13′ y 17°20′ Cáncer». */
export function rango(desde, hasta) {
  const a = partes(desde), b = partes(hasta);
  if (a.grados === b.grados && a.signo === b.signo) return `${a.grados} ${a.signo}`;
  if (a.signo === b.signo) return `entre ${a.grados} y ${b.grados} ${a.signo}`;
  return `entre ${a.grados} ${a.signo} y ${b.grados} ${b.signo}`;
}

const coma = (x, dec) => x.toFixed(dec).replace('.', ',');

/* Un valor de cartaEnVentana es el valor, o { entre: [a, b] } si cambia
   dentro de la ventana. */
const esEntre = (v) => v !== null && typeof v === 'object' && Array.isArray(v.entre);
const textoDe = (v, f) => (esEntre(v) ? `entre ${f(v.entre[0])} y ${f(v.entre[1])}` : f(v));

const textoNakshatra = (n) => `${n.nombre}, pada ${n.pada}`;
const textoTithi = (t) => `${t.numero} de 30 (${t.paksha})`;
const textoFase = (r) => r.nombre;

function textoAspecto(a) {
  return { a: NOMBRES[a.a], b: NOMBRES[a.b], tipo: a.aspecto ?? a.tipo };
}

export function tuCielo(nacimiento, ahoraMs) {
  const r = cartaDelPerfil(nacimiento);
  if (r.estado === 'sin_dato') return { estado: 'sin_dato' };
  const k = r.carta;

  if (r.estado === 'exacta') {
    const sistemas = ORDEN_SISTEMAS.filter((s) => k.casas[s]);
    const cuerpos = Object.entries(k.cuerpos).map(([id, c]) => ({
      id,
      nombre: NOMBRES[id],
      tropical: posicion(c.longitud),
      sidereo: posicion(c.longitud - k.ayanamsa),
      retrogrado: c.retrogrado === true,
      casa: Object.fromEntries(sistemas.map((s) => [s, k.casas[s].de[id]]))
    }));
    const cumple = cumpleanosLunar(k.instante, ahoraMs);
    return {
      estado: 'exacta',
      instante: k.instante,
      cuerpos,
      ascendente: posicion(k.angulos.ASC),
      medio_cielo: posicion(k.angulos.MC),
      sistemas,
      sistema_por_defecto: sistemas.includes(SISTEMA_POR_DEFECTO) ? SISTEMA_POR_DEFECTO : sistemas[0],
      cuspides: Object.fromEntries(sistemas.map((s) => [s, k.casas[s].cuspides.map(posicion)])),
      aspectos: k.aspectos.slice().sort((p, q) => p.orbe - q.orbe)
        .map((a) => ({ ...textoAspecto(a), orbe: coma(a.orbe, 1) + '°' })),
      paralelos: k.paralelos.slice().sort((p, q) => p.orbe - q.orbe)
        .map((a) => ({ ...textoAspecto(a), orbe: coma(a.orbe, 2) + '°' })),
      nakshatra: textoNakshatra(k.nakshatra),
      tithi: textoTithi(k.rejillas.tithi),
      fase: textoFase(k.rejillas.rudhyar),
      cumpleanos_lunar: cumple ? cumple.instante : null
    };
  }

  /* Franja: los dos extremos. */
  const v = ventanaDeNacimiento(nacimiento);
  const cuerpos = Object.entries(k.cuerpos).map(([id, c]) => {
    return {
      id,
      nombre: NOMBRES[id],
      tropical: rango(c.longitud.desde, c.longitud.hasta),
      sidereo: rango(c.longitud.desde - k.ayanamsa.desde, c.longitud.hasta - k.ayanamsa.hasta),
      retrogrado: esEntre(c.retrogrado) ? 'cambia' : c.retrogrado === true
    };
  });
  /* El cumpleaños lunar depende del ángulo Luna-Sol al nacer, que en 3 h se
     mueve ~1,5°: se da el de los dos extremos, ordenados. */
  /* El segundo se busca junto al primero, no desde «ahora»: si «ahora» cayera
     entre los dos, uno saldría en la lunación siguiente. */
  const c0 = cumpleanosLunar(v.inicio, ahoraMs);
  const c1 = c0 ? cumpleanosLunar(v.fin, c0.instante - 2 * 86400e3) : null;
  const cumple = c0 && c1 ? [Math.min(c0.instante, c1.instante), Math.max(c0.instante, c1.instante)] : null;
  const marca = (a, dec) => ({ ...textoAspecto(a), orbe: coma(a.orbe_min, dec) + '°', seguro: a.seguro });
  return {
    estado: 'franja',
    ventana: { inicio: v.inicio, fin: v.fin },
    cuerpos,
    motivo_sin_angulos: k.motivo_sin_angulos,
    aspectos: k.aspectos.map((a) => marca(a, 1)),
    paralelos: k.paralelos.map((a) => marca(a, 2)),
    nakshatra: textoDe(k.nakshatra, textoNakshatra),
    tithi: textoDe(k.rejillas.tithi, textoTithi),
    fase: textoDe(k.rejillas.rudhyar, textoFase),
    cumpleanos_lunar: cumple
  };
}

if (typeof window !== 'undefined') {
  window.tuCielo = tuCielo;
}
