/* =====================================================================
   Umbral — el Compás  ·  app/js/compas.js
   Decisiones 0008 (el nombre) y 0010 (dos modos). §15 de la hoja de ruta.

   Expone window.abrirTemporizador(pauta). El gancho ya existía en
   registro-practica.js línea 160 y no se toca: basta con que esta
   función exista.

   UN SOLO RELOJ. El de Web Audio (`ctx.currentTime`) cuando hay audio;
   `performance.now()` cuando el navegador no da AudioContext. El dibujo
   se CALCULA a partir de él, nunca al revés. Ningún contador acumula, así
   que no hay deriva posible por muchos minutos que dure la práctica.

   DOS MODOS, no uno degradado (decisión 0010):
     · respiración → el instrumento entero del prototipo
     · duración    → sin bordón, solo campanas

   CONSECUENCIAS OBLIGATORIAS AL DESPLEGAR ESTE FICHERO:
     1. entra en PRECACHE de app/sw.js
     2. VERSION de sw.js sube, de '2026-08-21e' a la fecha del cambio
     3. seleccion.js · abreTemporizador pasa a aceptar `duracion`
   Sin lo primero el fallo es silencioso: funciona con cobertura y
   revienta el día que no la hay.
   ===================================================================== */

"use strict";

/* La aritmética de las pautas vive en seleccion.js, que es módulo puro y está
   cubierto por pruebas. Aquí no se recalcula: si el Compás tuviera su propia
   cuenta de "segundos × lados", el día que cambiara una de las dos nadie se
   enteraría, y la que no tiene pruebas sería esta. */
import { duracionTotal, textoDuracion, ladosDePauta } from './seleccion.js';

/* =====================================================================
   1. LO QUE SE CAMBIA EN UNA LÍNEA
   Los dos huecos que pendiente.md tiene abiertos viven aquí arriba, con
   su número, para que se cierren sin buscar por el fichero.
   ===================================================================== */

/* Los dos textos de cierre, decididos el 22 de agosto (cerraba el pendiente 8).
   Ninguno felicita, ninguno promete y ninguno pregunta: la 0010 lo prohíbe.
   El final nombra lo que se acaba —el tiempo— y dice expresamente que tú no.
   El del parón voluntario devuelve el mando, que es lo que hace falta cuando
   has parado tú. */
const TEXTO_FINAL   = "Se ha terminado el tiempo, no tú.";
const TEXTO_PARADA  = "Cuando quieras.";
const TEXTO_LISTO   = "Listo";

/* PENDIENTE 9b — la campana de empezar en modo duración.
   Mi4 = 329,63 Hz: quinta justa sobre La3 y cuarta justa bajo La4, así que
   no se confunde con el cambio de lado ni con el final, y no introduce
   ninguna altura ajena al acorde (que es solo La y Mi).
   Para dejar el arranque en silencio: poner  inicio: null. */
const NOTAS = {
  LA1: 55, LA2: 110, MI3: 164.81, LA3: 220, MI4: 329.63, LA4: 440, MI5: 659.25
};

const CAMPANAS = {
  inspirar: { f: NOTAS.MI5, vol: 0.055, cola: 1.0 },
  exhalar:  { f: NOTAS.LA4, vol: 0.075, cola: 1.0 },
  lado:     { f: NOTAS.LA4, vol: 0.075, cola: 1.0 },  // gira: el mismo que exhalar
  inicio:   { f: NOTAS.MI4, vol: 0.050, cola: 1.0 },  // PENDIENTE 9b
  /* La4 y La3 son la misma clase de altura separadas una octava, que es el
     intervalo que el oído funde. La cola larga es el segundo canal de
     distinción entre «gira» y «para», y no cuesta ninguna nota nueva. */
  final:    { f: NOTAS.LA3, vol: 0.090, cola: 1.6 }
};

/* A CONFIRMAR: la tabla de la 0010 pone «Final · La3 · una sola vez» sin
   restringir el modo, así que la campana final suena también al terminar
   una respiración. Si se quiere solo en duración, borrar la línea marcada
   con [FINAL-RESPIRACIÓN] más abajo. */

/* =====================================================================
   2. ESTILOS
   Se inyectan desde aquí. La app no tiene css/tokens.css y el Compás es
   un solo fichero precacheado: partirlo en dos añadiría una entrada más
   que mantener a mano en PRECACHE sin ganar nada.
   Las variables (--noche, --oro, --crema, --malva…) las hereda de :root
   de index.html. --crema y --malva son legítimos aquí: la decisión 0005
   los reserva frente a las FAMILIAS DE DATOS, no frente a la interfaz.
   ===================================================================== */

const ESTILOS = `
.compas-capa {
  position: fixed; inset: 0; z-index: 100;
  overflow-y: auto; overscroll-behavior: contain;
  background:
    radial-gradient(120% 70% at 50% -10%, #16203A 0%, transparent 60%),
    var(--noche);
  padding: calc(var(--paso) * 6) calc(var(--paso) * 6)
           calc(var(--paso) * 12 + env(safe-area-inset-bottom));
}
.compas-hoja { max-width: 30rem; margin: 0 auto; }

.compas-sup {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: calc(var(--paso) * 4);
}
.compas-cerrar {
  flex: 0 0 auto;
  font-family: var(--sans); font-size: 15px; color: var(--tinta-2);
  background: none; border: 0; padding: 6px 2px; margin: 0; cursor: pointer;
}
.compas-cerrar:hover { color: var(--tinta); }
.compas-cerrar:focus-visible { outline: 1px solid var(--oro); outline-offset: 3px; }

.compas-titulo {
  font-family: var(--serif); font-weight: var(--serif-peso);
  font-size: clamp(26px, 7vw, 34px); line-height: 1.15;
  margin: calc(var(--paso) * 3) 0 0; max-width: 30ch;
}
.compas-medida {
  margin: calc(var(--paso) * 3) 0 0;
  font-size: 14px; color: var(--tinta-2);
  font-variant-numeric: tabular-nums;
}

/* LA MISMA CAJA EN LOS DOS ESTADOS.
   Antes la onda medía el ancho entero de la columna y el disco quieto 170 px,
   así que encender el movimiento hacía saltar todo lo de abajo. La altura se
   fija aquí y el contenido se centra dentro: lo que cambia es el dibujo, no
   el sitio de lo demás. */
.compas-escena, .compas-quieto {
  height: 210px;
  margin-top: calc(var(--paso) * 8);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.compas-escena svg { display: block; width: 100%; height: auto; max-height: 210px; }

/* El anillo es cuadrado: a ancho de columna se iría a 480 px y no cabría en
   la caja. Se acota al tamaño del disco, que es su equivalente apagado. */
.compas-capa.modo-duracion .compas-escena svg { width: 190px; height: 190px; }

/* La versión sin movimiento no es un apaño: es la que se ve por defecto.
   §7 — detenido en cualquier caso, se enciende a mano. */
.compas-quieto { display: none; text-align: center; }
.compas-disco {
  width: 190px; height: 190px; border-radius: 50%;
  margin: 0 auto; border: 1px solid var(--linea);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-style: italic;
  font-size: 30px; color: var(--tinta-2);
  font-variant-numeric: tabular-nums;
}
/* En modo duración el disco no lleva una palabra: lleva la cuenta atrás, y
   es el elemento grande de la pantalla. Cifras rectas, no cursiva: una
   cursiva con números tabulares se lee peor de lejos. */
.compas-disco.con-reloj {
  font-style: normal; font-size: 46px; color: var(--tinta-2);
  letter-spacing: 0.01em;
}
.compas-capa.en-marcha .compas-disco.con-reloj { color: var(--tinta); }
.compas-reloj-arco {
  font-family: var(--serif); font-size: 46px;
  fill: var(--tinta-2);
  font-variant-numeric: tabular-nums;
}
.compas-capa.en-marcha .compas-reloj-arco { fill: var(--tinta); }
.compas-capa.sin-movimiento .compas-escena { display: none; }
.compas-capa.sin-movimiento .compas-quieto { display: flex; }

.compas-indicacion { margin-top: calc(var(--paso) * 6); }

/* Con el Compás en marcha la palabra es el elemento más grande de la
   pantalla (§7). La onda acompaña; la palabra instruye. */
.compas-fase {
  font-family: var(--serif); font-style: italic; font-weight: var(--serif-peso);
  font-size: clamp(30px, 8vw, 38px); line-height: 1.05;
  margin: 0; color: var(--tinta-3);
  font-variant-numeric: tabular-nums;
}
.compas-capa.en-marcha .compas-fase {
  font-size: clamp(52px, 16vw, 88px); color: var(--tinta);
}
.compas-cuenta {
  margin: calc(var(--paso) * 3) 0 0;
  font-size: 15px; color: var(--tinta-2);
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.compas-capa.en-marcha .compas-cuenta { color: var(--tinta); }

.compas-mandos {
  margin-top: calc(var(--paso) * 8);
  border-top: 1px solid var(--linea);
  padding-top: calc(var(--paso) * 7);
}
.compas-principal {
  width: 100%; min-height: 54px;
  font-family: var(--serif); font-size: 20px; font-weight: var(--serif-peso);
  letter-spacing: 0.03em; color: var(--oro);
  background: transparent; border: 1px solid var(--oro-tenue);
  border-radius: 3px; cursor: pointer;
}
.compas-principal:hover { background: rgba(217, 184, 124, 0.06); }
.compas-principal:focus-visible { outline: 1px solid var(--oro); outline-offset: 3px; }

.compas-interruptores {
  margin-top: calc(var(--paso) * 5);
  display: flex; flex-wrap: wrap; gap: calc(var(--paso) * 2) calc(var(--paso) * 6);
}
.compas-conmutador {
  background: none; border: 0; padding: 6px 2px; margin: 0; cursor: pointer;
  font-family: var(--sans); font-size: 15px; color: var(--tinta-2);
  border-bottom: 1px solid transparent;
}
.compas-conmutador:hover { color: var(--tinta); }
.compas-conmutador:focus-visible { outline: 1px solid var(--oro); outline-offset: 3px; }
.compas-conmutador[aria-pressed="true"] { color: var(--oro); border-bottom-color: var(--oro-tenue); }
.compas-conmutador[aria-pressed="true"]::before { content: "· "; color: var(--oro-tenue); }
.compas-conmutador[disabled] { color: var(--tinta-3); cursor: default; }

.compas-pie {
  margin-top: calc(var(--paso) * 9);
  font-size: 12px; line-height: 1.65; color: var(--tinta-3);
}
.compas-pie b { color: var(--tinta-2); font-weight: 600; }

/* Ninguna transición, en ninguna circunstancia. §7. */
`;

/* =====================================================================
   3. LA CAPA
   ===================================================================== */

const ANCHO = 1000, ALTO = 240, MARGEN = 26;
const HORIZONTE = ALTO / 2, AMPLITUD = 78;
const RADIO_ANILLO = 74;

let capa = null, refs = null, estilosPuestos = false;

function ponerEstilos() {
  if (estilosPuestos) return;
  const s = document.createElement("style");
  s.id = "compas-estilos";
  s.textContent = ESTILOS;
  document.head.appendChild(s);
  estilosPuestos = true;
}

function construirCapa() {
  const el = document.createElement("div");
  el.className = "compas-capa";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "compas-rotulo");
  el.hidden = true;

  el.innerHTML = `
    <div class="compas-hoja">
      <div class="compas-sup">
        <p class="rotulo" id="compas-rotulo">Compás</p>
        <button type="button" class="compas-cerrar" data-compas="cerrar">Cerrar</button>
      </div>

      <h2 class="compas-titulo" id="compas-texto"></h2>
      <p class="compas-medida" id="compas-medida"></p>

      <div class="compas-escena" id="compas-escena"></div>

      <div class="compas-quieto">
        <div class="compas-disco" id="compas-disco">${TEXTO_LISTO}</div>
      </div>

      <div class="compas-indicacion">
        <p class="compas-fase" id="compas-fase" role="status" aria-live="polite">${TEXTO_LISTO}</p>
        <p class="compas-cuenta" id="compas-cuenta"></p>
      </div>

      <div class="compas-mandos">
        <button type="button" class="compas-principal" data-compas="principal">Empezar</button>
        <div class="compas-interruptores">
          <button type="button" class="compas-conmutador" data-compas="sonido"
                  aria-pressed="false">Sonido: desactivado</button>
          <button type="button" class="compas-conmutador" data-compas="movimiento"
                  aria-pressed="false">Onda: desactivada</button>
        </div>
      </div>

      <footer class="compas-pie">
        <span id="compas-pie-oido">Se puede seguir con los ojos cerrados: cada turno lleva su campana.</span><br>
        <span id="compas-aviso-sistema" hidden>Tu sistema pide menos movimiento, así que queda desactivado.<br></span>
        <b>En iPhone, el interruptor lateral de silencio apaga este sonido.</b> Si no oyes nada, es eso.
      </footer>
    </div>
  `;

  document.body.appendChild(el);

  refs = {
    capa: el,
    texto:   el.querySelector("#compas-texto"),
    medida:  el.querySelector("#compas-medida"),
    escena:  el.querySelector("#compas-escena"),
    disco:   el.querySelector("#compas-disco"),
    fase:    el.querySelector("#compas-fase"),
    cuenta:  el.querySelector("#compas-cuenta"),
    oido:    el.querySelector("#compas-pie-oido"),
    aviso:   el.querySelector("#compas-aviso-sistema"),
    principal:  el.querySelector('[data-compas="principal"]'),
    cerrar:     el.querySelector('[data-compas="cerrar"]'),
    sonido:     el.querySelector('[data-compas="sonido"]'),
    movimiento: el.querySelector('[data-compas="movimiento"]')
  };

  el.addEventListener("click", alPulsar);
  el.addEventListener("keydown", alTeclear);
  return el;
}

/* =====================================================================
   4. LA PAUTA
   ===================================================================== */

/* modo: "respiracion" | "duracion"
   Todo lo que el resto del fichero necesita saber sale de aquí y de
   `eventos`, que es la lista de campanas con su instante exacto. */
let sesion = null;

function preparar(pauta) {
  if (!pauta || (pauta.tipo !== "respiracion" && pauta.tipo !== "duracion")) return null;

  const total = duracionTotal(pauta);

  if (pauta.tipo === "respiracion") {
    const ciclo = pauta.inspirar + pauta.exhalar;
    const eventos = [];
    for (let c = 0; c < pauta.ciclos; c++) {
      eventos.push({ t: c * ciclo, campana: "inspirar" });
      eventos.push({ t: c * ciclo + pauta.inspirar, campana: "exhalar" });
    }
    /* [FINAL-RESPIRACIÓN] */
    eventos.push({ t: total, campana: "final" });
    return {
      modo: "respiracion", pauta, ciclo, total, eventos,
      medida: pauta.inspirar + " s dentro · " + pauta.exhalar + " s fuera · " +
              pauta.ciclos + " ciclos · " + textoDuracion(total)
    };
  }

  /* La duración total es segundos × lados —45 s a cada lado son 90 s— y esa
     cuenta la hace duracionTotal, que sí tiene prueba dorada. */
  const lados = ladosDePauta(pauta);
  const eventos = [{ t: 0, campana: "inicio" }];
  for (let k = 1; k < lados; k++) eventos.push({ t: k * pauta.segundos, campana: "lado" });
  eventos.push({ t: total, campana: "final" });

  return {
    modo: "duracion", pauta, lados, total, eventos,
    medida: lados > 1
      ? textoDuracion(pauta.segundos) + " por lado · " + lados + " lados · " +
        textoDuracion(total) + " en total"
      : textoDuracion(total)
  };
}

function reloj(s) {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return m + ":" + String(r).padStart(2, "0");
}

/* Dónde estás dentro de la pauta. Función pura del tiempo: sin
   contadores, sin deriva. Media coseno en la respiración — derivada cero
   en los extremos, máxima en el cruce — así la bola se frena sola justo
   donde gira el aliento. */
function situacion(t) {
  if (sesion.modo === "respiracion") {
    const p = sesion.pauta;
    const n = Math.floor(t / sesion.ciclo);
    const q = t - n * sesion.ciclo;
    if (q < p.inspirar) {
      return { fase: "inspirar", v: (1 - Math.cos(Math.PI * (q / p.inspirar))) / 2, ciclo: n };
    }
    const w = (q - p.inspirar) / p.exhalar;
    return { fase: "exhalar", v: (1 + Math.cos(Math.PI * w)) / 2, ciclo: n };
  }
  const lado = Math.min(sesion.lados, Math.floor(t / sesion.pauta.segundos) + 1);
  return { lado, v: t / sesion.total };
}

/* Qué pone en la línea grande de debajo del dibujo.
   En duración sin lados devuelve cadena vacía a propósito: ahí el elemento
   grande es la cuenta atrás dentro del círculo, y repetirla debajo sería
   decir dos veces lo mismo. */
function palabra(s) {
  if (sesion.modo === "respiracion") return s.fase === "inspirar" ? "Inspira" : "Exhala";
  if (sesion.lados === 1) return "";
  if (sesion.lados === 2) return s.lado === 1 ? "Un lado" : "El otro";
  return "Lado " + s.lado + " de " + sesion.lados;
}

/* El reloj se escribe en los dos sitios a la vez: dentro del anillo cuando
   hay movimiento, y dentro del disco quieto cuando no. Solo uno de los dos
   está visible, pero mantener los dos al día evita que encender el
   movimiento a mitad de camino enseñe un número viejo durante un fotograma. */
function ponerReloj(txt) {
  if (refs.relojArco) refs.relojArco.textContent = txt;
  refs.disco.textContent = txt;
}

/* =====================================================================
   5. ESCENA
   Se redibuja en cada apertura: la geometría depende de la pauta.
   ===================================================================== */

const x_de_t = t => MARGEN + (t / sesion.total) * (ANCHO - 2 * MARGEN);
const y_de_v = v => HORIZONTE - (v - 0.5) * 2 * AMPLITUD;

function montarEscena() {
  if (sesion.modo === "respiracion") return montarOnda();
  return montarAnillo();
}

function montarOnda() {
  const p = [];
  for (let i = 0; i <= 900; i++) {
    const t = (i / 900) * sesion.total;
    p.push((i ? "L" : "M") + x_de_t(t).toFixed(2) + " " + y_de_v(situacion(t).v).toFixed(2));
  }
  const d = p.join(" ");

  const puntos = [];
  for (let c = 0; c < sesion.pauta.ciclos; c++) {
    const giros = [
      [c * sesion.ciclo + sesion.pauta.inspirar, 1, "--crema"],
      [(c + 1) * sesion.ciclo, 0, "--malva"]
    ];
    for (const [t, v, color] of giros) {
      if (t > sesion.total + 0.001) continue;
      puntos.push(`<circle cx="${x_de_t(Math.min(t, sesion.total)).toFixed(2)}"
        cy="${y_de_v(v).toFixed(2)}" r="3.2" fill="var(${color})" opacity=".28"/>`);
    }
  }

  refs.escena.innerHTML = `
    <svg viewBox="0 0 ${ANCHO} ${ALTO}" role="img"
         aria-label="Onda de respiración: sube al inspirar, baja al exhalar.">
      <defs>
        <clipPath id="compas-arriba"><rect x="0" y="0" width="${ANCHO}" height="${HORIZONTE}"/></clipPath>
        <clipPath id="compas-abajo"><rect x="0" y="${HORIZONTE}" width="${ANCHO}" height="${HORIZONTE}"/></clipPath>
      </defs>
      <line x1="${MARGEN}" y1="${HORIZONTE}" x2="${ANCHO - MARGEN}" y2="${HORIZONTE}"
            stroke="var(--oro)" stroke-width="1.4" opacity=".85"/>
      <rect id="compas-recorrido" x="${MARGEN}" y="${HORIZONTE - 1}" width="0" height="2.5"
            fill="var(--oro)" opacity=".28"/>
      <path d="${d}" fill="none" stroke="var(--crema)" stroke-width="1.6"
            opacity=".55" clip-path="url(#compas-arriba)"/>
      <path d="${d}" fill="none" stroke="var(--malva)" stroke-width="1.6"
            opacity=".55" clip-path="url(#compas-abajo)"/>
      ${puntos.join("")}
      <circle id="compas-halo" cx="${MARGEN}" cy="${HORIZONTE}" r="15" fill="none"
              stroke="var(--crema)" stroke-width="1" opacity=".3"/>
      <circle id="compas-bola" cx="${MARGEN}" cy="${HORIZONTE}" r="8" fill="var(--crema)"/>
    </svg>
  `;
  refs.relojArco = null;
  refs.bola = refs.escena.querySelector("#compas-bola");
  refs.halo = refs.escena.querySelector("#compas-halo");
  refs.recorrido = refs.escena.querySelector("#compas-recorrido");
}

function montarAnillo() {
  const C = 2 * Math.PI * RADIO_ANILLO;
  const marcas = [];
  /* Una marca por cambio de lado. Con un solo lado no hay ninguna: el
     anillo no dice nada que no esté ocurriendo. */
  for (let k = 1; k < sesion.lados; k++) {
    const a = (k / sesion.lados) * 2 * Math.PI - Math.PI / 2;
    marcas.push(`<line x1="${(120 + Math.cos(a) * (RADIO_ANILLO - 7)).toFixed(2)}"
      y1="${(120 + Math.sin(a) * (RADIO_ANILLO - 7)).toFixed(2)}"
      x2="${(120 + Math.cos(a) * (RADIO_ANILLO + 7)).toFixed(2)}"
      y2="${(120 + Math.sin(a) * (RADIO_ANILLO + 7)).toFixed(2)}"
      stroke="var(--malva)" stroke-width="1.4" opacity=".55"/>`);
  }

  refs.escena.innerHTML = `
    <svg viewBox="0 0 240 240" role="img" aria-label="Anillo que se completa con el tiempo.">
      <circle cx="120" cy="120" r="${RADIO_ANILLO}" fill="none"
              stroke="var(--linea)" stroke-width="1.4"/>
      <circle id="compas-arco" cx="120" cy="120" r="${RADIO_ANILLO}" fill="none"
              stroke="var(--crema)" stroke-width="1.8" opacity=".7"
              stroke-linecap="round" transform="rotate(-90 120 120)"
              stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${C.toFixed(2)}"/>
      ${marcas.join("")}
      <text id="compas-reloj-arco" class="compas-reloj-arco" x="120" y="120"
            text-anchor="middle" dominant-baseline="central">—</text>
    </svg>
  `;
  refs.arco = refs.escena.querySelector("#compas-arco");
  refs.relojArco = refs.escena.querySelector("#compas-reloj-arco");
  refs.circunferencia = C;
}

/* =====================================================================
   6. SONIDO
   Afinación en La. Solo octavas y quintas: sin tercera el acorde no es
   mayor ni menor, no empuja hacia ninguna emoción, y aguanta sesenta
   repeticiones sin cansar.
   El acorde es FIJO. Lo que respira es el brillo y el volumen. Una
   versión anterior deslizaba el tono sin parar entre dos notas, y eso es
   literalmente una sirena: se descartó y no vuelve.
   ===================================================================== */

let ctx = null, maestro = null, filtro = null, cuerpo = null, envioEco = null;
let bordonPuesto = false;
let sonando = false;          // apagado al abrir (decisión 0010). Lo enciende ella.

function impulso(segundos, caida) {
  const n = Math.floor(ctx.sampleRate * segundos);
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, caida);
  }
  return buf;
}

function arrancarAudio() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return false;
  try { ctx = new Audio(); } catch (e) { return false; }

  maestro = ctx.createGain();
  maestro.gain.value = 0;
  maestro.connect(ctx.destination);

  /* Reverberación fabricada al vuelo: ruido que decae. Sin ella los
     osciladores suenan a aparato; con ella, a sala. Cero archivos. */
  const eco = ctx.createConvolver();
  eco.buffer = impulso(3.4, 2.6);
  const ecoGan = ctx.createGain();
  ecoGan.gain.value = 0.5;
  eco.connect(ecoGan); ecoGan.connect(maestro);

  envioEco = ctx.createGain();
  envioEco.gain.value = 1;
  envioEco.connect(eco);

  filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 320;
  filtro.Q.value = 0.6;
  filtro.connect(maestro);
  filtro.connect(envioEco);

  cuerpo = ctx.createGain();
  cuerpo.gain.value = 0.5;
  cuerpo.connect(filtro);
  return true;
}

/* El bordón SOLO existe en modo respiración. Un bordón que suena cuando no
   hay aliento deja de significar «esto va con tu aliento» (decisión 0010).
   Se monta una vez y no se desmonta: los osciladores callan porque el
   maestro baja a cero, no porque se destruyan. */
function ponerBordon() {
  if (bordonPuesto || !ctx) return;
  bordonPuesto = true;

  /* Grave, para sentirlo más que oírlo. */
  for (const [f, g] of [[NOTAS.LA1, 0.55], [NOTAS.LA2, 0.4]]) {
    const o = ctx.createOscillator();
    o.type = "sine"; o.frequency.value = f;
    const gn = ctx.createGain(); gn.gain.value = g;
    o.connect(gn); gn.connect(cuerpo); o.start();
  }

  /* Acorde abierto. Cada voz lleva un gemelo desafinado un 0,16 %: el batido
     lento entre los dos es lo que hace que suene vivo en vez de plano. Es un
     coro, no un efecto. */
  [NOTAS.MI3, NOTAS.LA3, NOTAS.MI4].forEach((f, i) => {
    for (const desvio of [1, 1.0016]) {
      const o = ctx.createOscillator();
      o.type = "sine"; o.frequency.value = f * desvio;
      const gn = ctx.createGain(); gn.gain.value = (i === 2 ? 0.10 : 0.16) / 2;
      o.connect(gn); gn.connect(cuerpo); o.start();
    }
  });
}

/* Curva de 64 puntos con la misma media coseno del dibujo.
   setValueCurveAtTime la interpola con precisión de muestra. */
function curva(desde, hasta, subiendo) {
  const n = 64, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = i / (n - 1);
    const v = subiendo ? (1 - Math.cos(Math.PI * p)) / 2 : (1 + Math.cos(Math.PI * p)) / 2;
    c[i] = desde + (hasta - desde) * (subiendo ? v : 1 - v);
  }
  return c;
}

/* Campana: parciales ligeramente inarmónicos, ataque blando, caída larga.
   Es lo que distingue un cuenco de un pitido de microondas. `cola`
   multiplica las duraciones: la campana final resuena más que las demás,
   y ese es el segundo canal que separa «para» de «gira». */
function campana(cuando, nombre) {
  const c = CAMPANAS[nombre];
  if (!ctx || !c) return;
  const partes = [[1, 1, 4.5], [2.007, 0.30, 2.6], [3.011, 0.12, 1.5], [4.63, 0.04, 0.8]];
  for (const [r, g, base] of partes) {
    const dur = base * c.cola;
    const o = ctx.createOscillator();
    o.type = "sine"; o.frequency.value = c.f * r;
    const gn = ctx.createGain();
    gn.gain.setValueAtTime(0.0001, cuando);
    gn.gain.linearRampToValueAtTime(c.vol * g, cuando + 0.09);
    gn.gain.exponentialRampToValueAtTime(0.0001, cuando + dur);
    o.connect(gn); gn.connect(maestro); gn.connect(envioEco);
    o.start(cuando); o.stop(cuando + dur + 0.1);
  }
}

/* =====================================================================
   7. PLANIFICADOR
   Ventana de anticipación de 0,25 s. Las campanas se programan contra el
   reloj de audio por adelantado; nunca se disparan desde el dibujo.
   ===================================================================== */

const VENTANA = 0.25;
let t0 = 0, corriendo = false, planificador = null, animacion = null;
let iEvento = 0, siguienteFase = 0, faseSiguiente = "inspirar";
/* null, no "": en duración sin lados la palabra CORRECTA es la cadena vacía,
   así que usarla como "todavía no he pintado nada" hacía que la comparación
   dijera "no ha cambiado" y el «Listo» del principio se quedase en pantalla
   con el Compás ya en marcha. Encontrado el 22 de agosto mirando una captura. */
let ultimaCuenta = -1, ultimaPalabra = null;
let t0Reserva = 0;   // reloj de reserva si no hay AudioContext

function tiempo() {
  return (ctx ? ctx.currentTime : performance.now() / 1000) - t0;
}

function planificar() {
  const limite = (ctx ? ctx.currentTime : performance.now() / 1000) + VENTANA;

  /* Campanas: una lista con instantes absolutos, recorrida una sola vez. */
  while (iEvento < sesion.eventos.length && t0 + sesion.eventos[iEvento].t < limite) {
    const ev = sesion.eventos[iEvento++];
    campana(t0 + ev.t, ev.campana);
  }

  if (sesion.modo !== "respiracion" || !ctx) return;

  /* El filtro es lo que respira: abre al inspirar, cierra al exhalar. */
  while (siguienteFase < limite) {
    const inicio = siguienteFase;
    if (inicio - t0 >= sesion.total - 0.001) break;

    const subiendo = faseSiguiente === "inspirar";
    const dur = subiendo ? sesion.pauta.inspirar : sesion.pauta.exhalar;

    filtro.frequency.cancelScheduledValues(inicio);
    filtro.frequency.setValueCurveAtTime(
      curva(subiendo ? 320 : 1750, subiendo ? 1750 : 320, subiendo), inicio, dur);

    cuerpo.gain.cancelScheduledValues(inicio);
    cuerpo.gain.setValueCurveAtTime(
      curva(subiendo ? 0.42 : 0.72, subiendo ? 0.72 : 0.42, subiendo), inicio, dur);

    siguienteFase = inicio + dur;
    faseSiguiente = subiendo ? "exhalar" : "inspirar";
  }
}

/* =====================================================================
   8. DIBUJO
   ===================================================================== */

function pintar() {
  if (!corriendo) return;
  const t = tiempo();
  if (t >= sesion.total) { terminar(); return; }

  const s = situacion(t);

  const p = palabra(s);
  if (p !== ultimaPalabra) {
    ultimaPalabra = p;
    refs.fase.textContent = p;
    if (sesion.modo === "respiracion") refs.disco.textContent = p;
  }

  /* Solo se reescribe al cambiar el entero, no en cada fotograma. */
  const restan = Math.max(0, Math.ceil(sesion.total - t));
  if (restan !== ultimaCuenta) {
    ultimaCuenta = restan;
    if (sesion.modo === "respiracion") {
      refs.cuenta.textContent =
        (s.ciclo + 1) + "/" + sesion.pauta.ciclos + " · quedan " + restan + " s";
    } else {
      ponerReloj(reloj(restan));
    }
  }

  if (!refs.capa.classList.contains("sin-movimiento")) {
    if (sesion.modo === "respiracion") {
      const x = x_de_t(t), y = y_de_v(s.v);
      const tono = s.v >= 0.5 ? "var(--crema)" : "var(--malva)";
      refs.bola.setAttribute("cx", x); refs.bola.setAttribute("cy", y);
      refs.bola.setAttribute("fill", tono);
      refs.halo.setAttribute("cx", x); refs.halo.setAttribute("cy", y);
      refs.halo.setAttribute("stroke", tono);
      refs.recorrido.setAttribute("width", Math.max(0, x - MARGEN));
    } else {
      refs.arco.setAttribute("stroke-dashoffset",
        (refs.circunferencia * (1 - s.v)).toFixed(2));
    }
  }

  animacion = requestAnimationFrame(pintar);
}

/* =====================================================================
   9. ARRANQUE, PARADA, FINAL
   ===================================================================== */

async function empezar() {
  if (!ctx) arrancarAudio();
  if (ctx && sesion.modo === "respiracion") ponerBordon();
  if (ctx && ctx.state === "suspended") { try { await ctx.resume(); } catch (e) { /* sin sonido */ } }

  if (ctx) {
    maestro.gain.cancelScheduledValues(ctx.currentTime);
    maestro.gain.setValueAtTime(maestro.gain.value, ctx.currentTime);
    maestro.gain.linearRampToValueAtTime(sonando ? 0.55 : 0, ctx.currentTime + 2.5);
  }

  t0 = (ctx ? ctx.currentTime : performance.now() / 1000) + 0.2;
  iEvento = 0;
  siguienteFase = t0;
  faseSiguiente = "inspirar";
  ultimaCuenta = -1; ultimaPalabra = null;
  corriendo = true;

  refs.principal.textContent = "Parar";
  refs.capa.classList.add("en-marcha");
  planificador = setInterval(planificar, 40);
  planificar();
  animacion = requestAnimationFrame(pintar);
}

function parar(mensaje) {
  corriendo = false;
  clearInterval(planificador);
  cancelAnimationFrame(animacion);

  if (ctx) {
    const t = ctx.currentTime;
    if (filtro) {
      filtro.frequency.cancelScheduledValues(t);
      filtro.frequency.linearRampToValueAtTime(320, t + 1.5);
    }
    if (cuerpo) cuerpo.gain.cancelScheduledValues(t);
    maestro.gain.cancelScheduledValues(t);
    maestro.gain.setValueAtTime(maestro.gain.value, t);
    maestro.gain.linearRampToValueAtTime(0, t + 2.2);
  }

  refs.principal.textContent = "Empezar";
  refs.capa.classList.remove("en-marcha");
  refs.fase.textContent = mensaje;
  /* El mensaje NO va dentro del disco. En duración porque ahí vive el reloj,
     y en respiración porque «Se ha terminado el tiempo, no tú.» partido en
     tres líneas dentro de un círculo de 190 px es ilegible. El mensaje vive
     en la línea de debajo, que es la que existe en los dos modos y tiene el
     ancho de la columna entera. */
  if (sesion.modo === "respiracion") refs.disco.textContent = "";
}

/* No pregunta nada: `accion_resultado` sigue en null, como manda la §4.
   Pedir un resultado a alguien que acaba de exhalar es pedirle algo que
   todavía no ha ocurrido. Y no se cierra sola, nunca: cierra la persona. */
function terminar() {
  parar(TEXTO_FINAL);
  if (sesion.modo === "respiracion") {
    refs.cuenta.textContent = sesion.pauta.ciclos + "/" + sesion.pauta.ciclos + " · completo";
  } else {
    ponerReloj(reloj(0));
    refs.cuenta.textContent = textoDuracion(sesion.total) + " · completo";
  }
}

/* =====================================================================
   10. MOVIMIENTO
   Detenido por defecto en cualquier caso (§7). Si el sistema pide menos
   movimiento, se apaga Y el mando queda bloqueado: eso no se negocia.
   ===================================================================== */

const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

function nombreMovil() {
  return sesion && sesion.modo === "duracion" ? "Anillo" : "Onda";
}

function aplicarMovimiento(con) {
  refs.capa.classList.toggle("sin-movimiento", !con);
  refs.movimiento.setAttribute("aria-pressed", String(con));
  const n = nombreMovil();
  const g = n === "Onda" ? "a" : "o";
  refs.movimiento.textContent = refs.movimiento.disabled
    ? n + ": desactivad" + g + " por tu sistema"
    : n + (con ? ": activad" + g : ": desactivad" + g);
}

function obedecerSistema() {
  if (!refs) return;
  if (menosMovimiento.matches) {
    refs.movimiento.disabled = true;
    refs.movimiento.title = "Tu sistema pide menos movimiento.";
    refs.aviso.hidden = false;
    aplicarMovimiento(false);
  }
}
menosMovimiento.addEventListener("change", obedecerSistema);

/* =====================================================================
   11. INTERACCIÓN
   ===================================================================== */

function alPulsar(e) {
  const b = e.target.closest("[data-compas]");
  if (!b) return;

  switch (b.dataset.compas) {
    case "principal":
      corriendo ? parar(TEXTO_PARADA) : empezar();
      break;

    case "cerrar":
      cerrar();
      break;

    /* El texto visible dice el ESTADO, no una etiqueta ambigua: quien no
       distinga el cambio de color tiene que poder leerlo igual (§7). */
    case "sonido":
      sonando = !sonando;
      refs.sonido.setAttribute("aria-pressed", String(sonando));
      refs.sonido.textContent = sonando ? "Sonido: activado" : "Sonido: desactivado";
      if (ctx && maestro) {
        maestro.gain.cancelScheduledValues(ctx.currentTime);
        maestro.gain.setValueAtTime(maestro.gain.value, ctx.currentTime);
        maestro.gain.linearRampToValueAtTime(
          sonando && corriendo ? 0.55 : 0, ctx.currentTime + 0.6);
      }
      break;

    case "movimiento":
      if (refs.movimiento.disabled) return;
      aplicarMovimiento(refs.capa.classList.contains("sin-movimiento"));
      break;
  }
}

/* Escape cierra, y el foco no sale de la capa mientras está abierta
   (decisión 0010: requisitos, no adornos). */
function alTeclear(e) {
  if (e.key === "Escape") { e.preventDefault(); cerrar(); return; }
  if (e.key !== "Tab") return;

  const focos = refs.capa.querySelectorAll(
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];

  if (e.shiftKey && document.activeElement === primero) {
    e.preventDefault(); ultimo.focus();
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault(); primero.focus();
  }
}

/* =====================================================================
   12. ABRIR Y CERRAR
   ===================================================================== */

let focoPrevio = null, scrollPrevio = 0;

function cerrar() {
  if (corriendo) parar(TEXTO_PARADA);
  refs.capa.hidden = true;

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  window.scrollTo(0, scrollPrevio);

  /* Al cerrar, el formulario está intacto detrás y se vuelve exactamente
     donde se estaba: al bloque de la práctica, no al principio. */
  const bloque = document.getElementById("bloque-practica");
  if (focoPrevio && document.contains(focoPrevio)) focoPrevio.focus({ preventScroll: true });
  if (bloque) bloque.scrollIntoView({ block: "center" });
}

function abrir(pauta) {
  const s = preparar(pauta);
  /* Regla 0.1 aplicada al silencio: si la pauta no es de las que tienen
     turnos, no se abre nada y no se dice nada. Las de `repeticiones` se
     cuentan con el cuerpo. */
  if (!s) return;
  sesion = s;

  ponerEstilos();
  if (!capa) capa = construirCapa();

  /* El texto de la práctica se lee de la pantalla: el gancho solo pasa la
     pauta, y la 0010 dice expresamente que el gancho no se toca. */
  const enPantalla = document.getElementById("practica-texto");
  refs.texto.textContent = enPantalla ? enPantalla.textContent : "";
  refs.medida.textContent = sesion.medida;

  refs.fase.textContent = TEXTO_LISTO;
  refs.principal.textContent = "Empezar";
  refs.capa.classList.remove("en-marcha");
  refs.disco.classList.toggle("con-reloj", sesion.modo === "duracion");
  refs.capa.classList.toggle("modo-duracion", sesion.modo === "duracion");

  /* La escena se monta antes que los textos: el reloj se escribe DENTRO del
     anillo, así que el anillo tiene que existir ya. */
  montarEscena();

  if (sesion.modo === "respiracion") {
    refs.disco.textContent = TEXTO_LISTO;
    refs.cuenta.textContent = sesion.pauta.ciclos + " ciclos · " + textoDuracion(sesion.total);
  } else {
    /* El círculo enseña de entrada cuánto va a durar. No es un cero ni un
       hueco: es el dato que ya existe antes de empezar. */
    ponerReloj(reloj(sesion.total));
    refs.cuenta.textContent = sesion.lados > 1
      ? sesion.lados + " lados · " + textoDuracion(sesion.total) + " en total"
      : textoDuracion(sesion.total) + " en total";
  }

  refs.oido.textContent = sesion.modo === "respiracion"
    ? "Se puede seguir con los ojos cerrados: cada giro lleva su campana."
    : (sesion.lados > 1
        ? "Se puede seguir con los ojos cerrados: una campana al cambiar de lado y otra al terminar."
        : "Se puede seguir con los ojos cerrados: una campana al empezar y otra al terminar.");

  /* Cada apertura arranca en «Sonido: desactivado». Invierte el prototipo a
     propósito (0010): el ejercicio se empieza mirando la pantalla, y el
     sonido entra cuando ella quiere que entre. */
  sonando = false;
  refs.sonido.setAttribute("aria-pressed", "false");
  refs.sonido.textContent = "Sonido: desactivado";

  aplicarMovimiento(false);
  obedecerSistema();

  focoPrevio = document.activeElement;
  scrollPrevio = window.scrollY;
  refs.capa.hidden = false;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  refs.capa.scrollTop = 0;
  refs.principal.focus();
}

window.abrirTemporizador = abrir;
