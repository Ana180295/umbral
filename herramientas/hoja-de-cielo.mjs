#!/usr/bin/env node
// hoja-de-cielo.mjs — genera la hoja de nacimiento de cualquier persona.
// Uso:  node herramientas/hoja-de-cielo.mjs herramientas/datos-prueba.json > hoja.md
// No requiere npm desde el 13 de noviembre de 2026: carga la MISMA build UMD
// de astronomy-engine que se instala en el móvil (app/js/vendor/), y saca
// todo el cálculo astrológico de app/js/carta.js, que es el único original
// (pendiente 43). Lo que queda aquí es la presentación, más lo que todavía
// solo usa esta hoja: visibilidad, hora solar, numerología y la época lunar.
// Las horas planetarias se calculan en carta.js desde el 18 de noviembre (0036).
//
// REGLA 0.1: este programa NO inventa nada. Todo número sale del motor o de una
// convención declarada en el JSON de entrada. Lo que no se puede calcular, no se
// escribe: se omite la sección entera.

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
globalThis.Astronomy = require('../app/js/vendor/astronomy.browser.min.js');
const A = globalThis.Astronomy;
const C = await import('../app/js/carta.js');

const DEG = 180/Math.PI;
/* Números con coma decimal (pendiente 49, 15 de noviembre de 2026). Hasta
   hoy la hoja escribía «23° 46.8′» y «0.318°» con toFixed: el mismo fallo
   del «1.5 min» de la §16. Sin separador de miles, para que la hoja solo
   cambie el punto por la coma y nada más. */
const num = (x, n) => x.toLocaleString('es-ES', { minimumFractionDigits: n, maximumFractionDigits: n, useGrouping: false });
const norm = x => ((x % 360) + 360) % 360;
const d2 = n => String(n).padStart(2,'0');

// ---------------------------------------------------------------- entrada
const d = JSON.parse(readFileSync(process.argv[2] || 'datos.json','utf8'));
const REQ = ['nombre_completo','fecha','hora','zona','lat','lon'];
for (const k of REQ) if (d[k] === undefined) { console.error(`falta el campo obligatorio: ${k}`); process.exit(1); }
const ELE = d.altitud ?? 0;
const obs = new A.Observer(d.lat, d.lon, ELE);

// hora local declarada -> instante UTC, resolviendo el desfase de la zona IANA
function aUtc(fecha, hora, zona){
  const [Y,M,D] = fecha.split('-').map(Number);
  const [h,m]   = hora.split(':').map(Number);
  let t = Date.UTC(Y, M-1, D, h, m, 0);
  for (let i=0;i<3;i++){
    const p = new Intl.DateTimeFormat('en-CA',{timeZone:zona,year:'numeric',month:'2-digit',
      day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date(t));
    const g = k => Number(p.find(x=>x.type===k).value);
    const visto = Date.UTC(g('year'), g('month')-1, g('day'), g('hour')%24, g('minute'), g('second'));
    t += Date.UTC(Y,M-1,D,h,m,0) - visto;
  }
  return new Date(t);
}
const nac  = aUtc(d.fecha, d.hora, d.zona);
const ms   = nac.getTime();
const time = A.MakeTime(nac);
const loc  = (dd, o={}) => dd.toLocaleString('es-ES', {timeZone:d.zona, dateStyle:'short', timeStyle:'medium', ...o});
const hhmm = dd => dd.toLocaleString('es-ES', {timeZone:d.zona, hour:'2-digit', minute:'2-digit', hour12:false});

// ---------------------------------------------------------------- básicos
const NOM = C.NOMBRES, SIGNOS = C.SIGNOS;
/* Los diez que el motor conoce, para lo que se ve en el cielo (altura,
   brillo). Quirón entra en todo lo demás —posiciones, aspectos, casas—
   pero no aquí: el motor no tiene su brillo, y con una magnitud del orden
   de 18 no se ve a simple vista. (decisión 0031) */
const CLASICOS = C.CUERPOS.filter(c => c !== 'Chiron');
const gr = l => { l = norm(l); const s = Math.floor(l/30), x = l-s*30;
  return `${Math.floor(x)}° ${d2(Math.floor((x%1)*60))}′ ${SIGNOS[s]}`; };

const retro = c => C.retrogrado(c, ms);
const L = C.longitudes(ms);
/* Los cuerpos presentes en este instante: Quirón solo entre 1900 y 2100. */
const CUERPOS = C.CUERPOS.filter(c => c in L);

// ángulos y casas — de carta.js
const { ASC, MC } = C.angulos(ms, obs);
const sistemas = C.cuspides(ms, obs);
const casaDe = C.casaDe;

// ---------------------------------------------------------------- salida
const S = [];
const P = (...x) => S.push(x.join(''));

P(`# El cielo de ${d.lugar || 'este lugar'}, ${d.fecha} a las ${d.hora}\n`);
P(`${d.nombre_completo}`);
P(`${num(d.lat,6)}° · ${num(d.lon,6)}° · ${ELE} m · zona ${d.zona}\n`);
P(`---\n`);
P(`## Antes de nada: qué es esto y qué no\n`);
P(`Todo lo que sigue son **medidas**. Dónde estaba cada cosa, a qué hora, a qué distancia, cuánto brillaba.\n`);
P(`Ninguna frase dice qué significa eso sobre ti, y no es un olvido. Una posición del cielo no dice cómo eres.`);
P(`Los significados que sí aparecen son de **palabras**, y eso es historia de la lengua.\n`);
P(`**Este documento no está guardado.** Se vuelve a calcular cada vez que se abre.\n`);
P(`---\n`);

// 1. lo que se veía
P(`# PRIMERA PARTE · Lo que se veía\n`);
const EQ = {};   // coordenadas ecuatoriales por cuerpo, calculadas una vez y
                  // reutilizadas más abajo (altSol, sección 10) en vez de
                  // volver a pedírselas al motor.
const visibles = [], ocultos = [];
for (const c of CLASICOS){
  const eq = A.Equator(c,time,obs,true,true);
  EQ[c] = eq;
  const h  = A.Horizon(time,obs,eq.ra,eq.dec,'normal');
  const mag = c==='Sun' ? null : A.Illumination(c,time).mag;
  (h.altitude>0 ? visibles : ocultos).push({c,h,mag});
}
P(`De los diez cuerpos que se suelen mirar, **${ocultos.length} estaban debajo del horizonte**. Se veían ${visibles.length}:\n`);
P(`| | altura | azimut | brillo |`);
P(`|---|---|---|---|`);
for (const v of visibles.sort((a,b)=>b.h.altitude-a.h.altitude))
  P(`| **${NOM[v.c]}** | ${num(v.h.altitude,1)}° | ${num(v.h.azimuth,0)}° | ${v.mag!==null?'magnitud '+num(v.mag,2):'—'} |`);
const altSol = [...visibles, ...ocultos].find(v=>v.c==='Sun').h.altitude;
P(`\nEl Sol estaba a **${num(altSol,1)}°** respecto al horizonte`);
P(altSol>0 ? ' — de día.\n' : altSol>-18 ? ' — crepúsculo.\n' : ' — noche cerrada, sin crepúsculo.\n');

// 2. hora solar
const ha = A.HourAngle('Sun',time,obs);
const horaSolar = (ha+12)%24;
P(`## La hora del reloj no era la hora del Sol\n`);
P('```');
P(`hora civil declarada   ${d.hora}`);
/* Se redondea el total de minutos y LUEGO se parte en horas y minutos.
   Redondear solo los minutos escribía «21:60» cuando faltaban menos de 30
   segundos para la hora siguiente (15 de noviembre de 2026). */
const minSolar = Math.round(horaSolar*60) % 1440;
P(`hora solar verdadera   ${d2(Math.floor(minSolar/60))}:${d2(minSolar%60)}`);
P('```\n');
P(`La diferencia viene del huso horario, de la distancia al meridiano de referencia y de la ecuación del tiempo.\n`);

// 3. horas planetarias — decisión 0036, 18 de noviembre de 2026. El cálculo
//    vive en carta.js (horasPlanetarias); aquí solo se escribe. Corrige los tres
//    fallos del pendiente 45: decía «día» con el Sol bajo el horizonte, anunciaba
//    las horas y solo daba el regente del día, y tomaba el día civil en vez del
//    que empieza al salir el Sol.
{
  const hp = C.horasPlanetarias(nac.getTime(), obs);
  if (hp) {   /* noche o día polar: no hay horas que partir; se omite la sección */
    const NDIA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const hhmm = new Intl.DateTimeFormat('es-ES', { timeZone: d.zona, hour: '2-digit', minute: '2-digit' });
    const h = hp.horas[hp.actual];
    P(`## Horas planetarias\n`);
    P(`El tiempo entre la salida y la puesta del Sol se parte en doce, y la noche, de la puesta a la salida`);
    P(`siguiente, también: **las horas del día y las de la noche duran distinto** (aquí, ${num(hp.duracion_hora_dia_min,1)} y`);
    P(`${num(hp.duracion_hora_noche_min,1)} minutos). Cada una se atribuye a un astro en el orden Saturno, Júpiter, Marte, Sol, Venus,`);
    P(`Mercurio, Luna, y cada día toma el nombre del astro de su primera hora.\n`);
    P(`El día empezó con la salida del Sol del **${NDIA[hp.dia_de_la_semana]}** a las ${hhmm.format(hp.salida)}: día de **${NOM[hp.regente_del_dia]}**.`);
    P(`El nacimiento cae en la **hora ${h.numero} de 24**, ${h.de === 'dia' ? 'de día' : 'de noche'}, que es de **${NOM[h.regente]}**.\n`);
    P(`| Hora | Desde | Hasta | Astro |`); P(`|---|---|---|---|`);
    for (const x of hp.horas) {
      const marca = x === h ? ' ← nacimiento' : '';
      P(`| ${x.numero} · ${x.de === 'dia' ? 'día' : 'noche'} | ${hhmm.format(x.desde)} | ${hhmm.format(x.hasta)} | ${NOM[x.regente]}${marca} |`);
    }
    P('');
  }
}

// 4. tropical
P(`---\n`);
P(`# SEGUNDA PARTE · Por tradición\n`);
P(`## Zodiaco tropical\n`);
P(`Doce tramos de 30° contados desde el equinoccio de primavera. Su cero es un suceso físico; sus nombres`);
P(`son de constelaciones que ya no están detrás.\n`);
P(`| | |`); P(`|---|---|`);
P(`| **Ascendente** | ${gr(ASC)} |`);
P(`| **Medio Cielo** | ${gr(MC)} |`);
for (const c of CUERPOS) P(`| ${NOM[c]} | ${gr(L[c])}${retro(c)?' · retrógrado':''} |`);
P('');

// 5. sidéreo
const ayan = C.ayanamsaTrueChitra(ms);
let cambian = 0;
P(`## Zodiaco sidéreo\n`);
P(`Los mismos doce tramos contados desde una estrella. Ayanamsa True Chitra calculado para este instante,`);
P(`fijando Spica en 180°: **${Math.floor(ayan)}° ${num((ayan%1)*60,1)}′**. *No es el Lahiri oficial,`);
P(`que se define por un valor en una fecha y deja Spica a un minuto de arco de los 180°.*\n`);
P(`| | tropical | sidéreo |`); P(`|---|---|---|`);
for (const c of [...CUERPOS]) { const s = norm(L[c]-ayan);
  if (Math.floor(norm(L[c])/30)!==Math.floor(s/30)) cambian++;
  P(`| ${NOM[c]} | ${gr(L[c])} | ${gr(s)} |`); }
for (const [n,v] of [['Ascendente',ASC],['Medio Cielo',MC]]) { const s=norm(v-ayan);
  if (Math.floor(norm(v)/30)!==Math.floor(s/30)) cambian++;
  P(`| ${n} | ${gr(v)} | ${gr(s)} |`); }
P(`\n**${cambian} de ${CUERPOS.length + 2} puntos cambian de signo** entre un cero y el otro.\n`);

// 6. rejillas del ángulo Luna-Sol
const rej = C.rejillasLunaSol(ms), sep = rej.separacion, nak = C.nakshatra(ms);
P(`## Un solo número, cuatro rejillas\n`);
P(`El ángulo entre la Luna y el Sol era **${num(sep,3)}°**. Lo que sigue no son cuatro datos: es ese`);
P(`número partido de cuatro maneras.\n`);
P(`| rejilla | trozos | resultado |`); P(`|---|---|---|`);
P(`| Fases populares | 4 × 90° | ${rej.fase_popular} |`);
P(`| Fases de Rudhyar | 8 × 45° | ${rej.rudhyar.nombre} (${rej.rudhyar.indice} de 8) |`);
P(`| Tithi | 30 × 12° | ${rej.tithi.numero} de 30 — ${rej.tithi.paksha} |`);
P(`| Karana | 60 × 6° | ${rej.karana.numero} de 60 |`);
P(`\nY sobre el cero sidéreo, la Luna cae en el **nakshatra ${nak.numero} de 27,`);
P(` ${nak.nombre}**, pada ${nak.pada} de 4.\n`);

// 7. jieqi
const js = C.terminoSolar(ms);
P(`## Términos solares chinos\n`);
P(`Veinticuatro momentos espaciados 15° a lo largo de la eclíptica, contados **desde el mismo equinoccio`);
P(`que el zodiaco occidental**. Mismo cero, más resolución.\n`);
P(`Naciste dentro de **${js.termino}** — *${js.tradicional}*. El siguiente es **${js.siguiente}**, *${js.siguiente_tradicional}*.\n`);

// 8. calendarios aritméticos
const cal = (c) => C.fechaEnCalendario(ms, c, d.zona);
const tz = C.tzolkin(d.fecha, d.correlacion_tzolkin ?? 584283);
P(`## Calendarios de cuenta\n`);
P(`No miden nada: cuentan desde un instante declarado. Por eso no pueden desfasarse de nada.\n`);
P(`| | |`); P(`|---|---|`);
for (const [n,c] of [['Hebreo','hebrew'],['Islámico','islamic-civil'],['Persa','persian'],['Chino','chinese']]) {
  const v = cal(c); if (v) P(`| **${n}** | ${v} |`); }
P(`| **Tzolk'in maya** | ${tz.numero} ${tz.nombre} *(correlación ${tz.correlacion})* |`);
P(`| **Día juliano** | ${num(time.ut+2451545,5)} |`);
P('');

// 9. casas
P(`## Casas — esto no es un dato\n`);
P(`Las casas no dividen un círculo abstracto: dividen el cielo visto **desde este punto de la Tierra en`);
P(`este instante**. Por eso dependen de la latitud y por eso hay varias maneras que no coinciden.\n`);
const nombres = Object.keys(sistemas);
if (!sistemas['Placidus']) P(`> A esta latitud **Placidus no existe**: divide el tiempo que tarda un punto en subir, y aquí hay puntos que no suben.\n`);
P(`| | ${nombres.join(' | ')} |`);
P(`|---|${nombres.map(()=>'---').join('|')}|`);
let discrepan = 0;
for (const c of CUERPOS){
  const casas = nombres.map(n=>casaDe(L[c], sistemas[n]));
  if (new Set(casas).size > 1) discrepan++;
  P(`| ${NOM[c]} | ${casas.join(' | ')} |`);
}
P(`\n**${discrepan} de ${CUERPOS.length} cuerpos cambian de casa** según el sistema elegido.\n`);

// 10. aspectos y paralelos
/* Orbe por defecto 1°, y no 3°. Medido sobre un año completo contra una carta
   real: con 1° hay 4,8 aspectos al día y CINCO días del año sin ninguno; con 2°
   son 10,1 y cero días; con 3°, 15,9 y cero. Por encima de 1° no existe el día
   vacío, y un sistema que nunca calla no puede ser contradicho por los datos.
   La línea de "ninguno dentro de ese orbe" ya estaba escrita más abajo: con 3°
   no se imprimía nunca. */
const ORBE = d.orbe ?? C.ORBE;
/* El de los paralelos es otro umbral y estaba a pelo, escrito dos veces como
   `< 1`. Medido el 26 de agosto con el mismo método y el mismo criterio que
   ORBE (conteo mutuo entre los 10 cuerpos de esta misma carta, sobre un año
   civil completo): a 1° NO existe el día sin ningún paralelo bajo ninguna
   hora de muestreo probada — el umbral heredado no pasa el criterio del
   propio proyecto. A 0,75° hay 3,2 paralelos de media y entre 4 y 5 días
   vacíos al año, el perfil más parecido al de ORBE (4,8 y 5) y el más
   estable frente a la hora de muestreo de los probados. Detalle en
   03-registro-de-datos.md, sección «Aspectos». */
const ORBE_PARALELO = d.orbe_paralelo ?? C.ORBE_PARALELO;
const asp = C.aspectos(L, ORBE).map(x => ({a:NOM[x.a], b:NOM[x.b], an:x.aspecto, o:x.orbe}));
P(`## Ángulos entre los cuerpos\n`);
P(`Orbe declarado: **${ORBE}°**. Cuáles existen depende de quién los cuente.\n`);
P(`Por encima de 1° no hay un solo día del año sin ningún aspecto, y un sistema que nunca calla no`);
P(`puede ser contradicho por los datos. Por eso el día vacío tiene que poder existir.\n`);
if (asp.length===0) P(`Ninguno dentro de ese orbe.\n`);
else { P(`| | | | orbe |`); P(`|---|---|---|---|`);
  for (const x of asp) P(`| ${x.a} | ${x.an} | ${x.b} | ${num(x.o,3)}° |`); P(''); }

const par = C.paralelos(C.declinaciones(ms), ORBE_PARALELO)
  .map(x => ({a:NOM[x.a], b:NOM[x.b], t:x.tipo, o:x.orbe}));
if (par.length){
  P(`### Paralelos de declinación\n`);
  P(`Casi nadie los mira. La declinación es la altura sobre el ecuador celeste: dos cuerpos con la misma`);
  P(`recorren el mismo arco de cielo aunque estén separados en el zodiaco.\n`);
  P(`| | | | orbe |`); P(`|---|---|---|---|`);
  for (const x of par) P(`| ${x.a} | ${x.t} | ${x.b} | ${num(x.o,3)}° |`); P(''); }

// 11. numerología (opcional y etiquetada)
/* OPT-IN, no opt-out. Antes salía por omisión. La sección de fuentes de la
   clase ③ está entera marcada [SIN VERIFICAR]: no hay ninguna edición
   comprobable de la tabla llamada "pitagórica", y las fechas que circulan para
   el primer libro de Balliett se contradicen entre sí (1903, 1908, 1911). Un
   dato sin ficha no puede ser el comportamiento por omisión de nada.
   Se pide a propósito con  "numerologia": true  en el JSON de entrada. */
if (d.numerologia === true){
  const PIT={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
  const CAL={A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7};
  const VOC=new Set(['A','E','I','O','U']);
  const redM=n=>{while(n>9&&n!==11&&n!==22&&n!==33)n=String(n).split('').reduce((a,c)=>a+ +c,0);return n;};
  const redS=n=>{while(n>9)n=String(n).split('').reduce((a,c)=>a+ +c,0);return n;};
  const suma=(nm,tb,cfg,filtro)=>{ let s=nm.toUpperCase();
    s = cfg.tildes==='quitar' ? s.normalize('NFD').replace(/[\u0300-\u036f]/g,'') : s.normalize('NFC');
    if (cfg.enie) s=s.replace(/Ñ/g,'N');
    let t=0; for(const ch of s.replace(/[^A-ZÑÁÉÍÓÚÜ]/g,'')){
      const b=ch.normalize('NFD')[0];
      if (filtro==='v'&&!VOC.has(b)) continue; if (filtro==='c'&&VOC.has(b)) continue;
      if (tb[ch]!==undefined) t+=tb[ch]; } return t; };
  const cfg = {tildes: d.num_tildes ?? 'quitar', enie: d.num_enie ?? true};
  const tabla = (d.num_tabla ?? 'pitagorica')==='caldea' ? CAL : PIT;
  const red = (d.num_maestros ?? true) ? redM : redS;
  const res = new Set();
  for (const tb of [PIT,CAL]) for (const ti of ['quitar','dejar']) for (const en of [true,false]) for (const m of [true,false])
    res.add((m?redM:redS)(suma(d.nombre_completo,tb,{tildes:ti,enie:en})));
  P(`## Números del nombre\n`);
  P(`*Sistema de L. Dow Balliett, c. 1908. **No es antiguo**, y la tabla llamada «pitagórica» no la hizo`);
  P(`Pitágoras: se construyó para el alfabeto inglés de 26 letras.*\n`);
  P(`Convención declarada: tabla ${d.num_tabla ?? 'pitagórica'} · tildes ${cfg.tildes} · ñ ${cfg.enie?'como n':'letra propia'} · maestros ${(d.num_maestros??true)?'conservados':'reducidos'}.\n`);
  P(`| | suma | |`); P(`|---|---|---|`);
  for (const [et,fl] of [['Expresión (nombre entero)',null],['Alma (vocales)','v'],['Personalidad (consonantes)','c']]){
    const t = suma(d.nombre_completo, tabla, cfg, fl); P(`| ${et} | ${t} | **${red(t)}** |`); }
  const dig = d.fecha.replace(/-/g,'').split('').map(Number).reduce((a,b)=>a+b,0);
  P(`| Camino de vida | ${dig} | **${red(dig)}** |`);
  P(`\n**Las 16 convenciones defendibles dan ${res.size} resultado${res.size===1?'':'s'} distinto${res.size===1?'':'s'}: ${[...res].sort((a,b)=>a-b).join(', ')}.**`);
  P(`Esa dispersión depende del nombre concreto, y dice por sí sola qué clase de medida es esta.\n`);
}

// 12. la Luna
P(`## La Luna\n`);
let epoca = null;
try {
  let busca = new Date(nac.getTime() - 30*3600000);
  for (let i=0;i<5;i++){ const r = A.SearchRiseSet('Moon',obs,+1,busca,2); if (!r) break;
    if (r.date < nac){ epoca = r.date; busca = new Date(r.date.getTime()+3600000); } else break; }
} catch {}
const vLuna = A.GeoMoonState(time), rLuna = Math.hypot(vLuna.x,vLuna.y,vLuna.z)*149597870.7;
const vSol  = A.GeoVector('Sun',time,true), rSol = Math.hypot(vSol.x,vSol.y,vSol.z)*149597870.7;
const angL = 2*Math.atan(1737.4/rLuna)*DEG*60, angS = 2*Math.atan(696000/rSol)*DEG*60;
P(`| | |`); P(`|---|---|`);
if (epoca){ P(`| **Salida de la Luna anterior** | ${loc(epoca)} |`);
  P(`| Naciste | ${num((nac-epoca)/60000,0)} minutos después |`); }
else P(`| Salida de la Luna anterior | *no hubo salida en el periodo buscado — a esta latitud puede no haberla* |`);
P(`| Distancia | ${num(rLuna,0)} km |`);
P(`| Diámetro aparente | ${num(angL,3)}′ *(el Sol: ${num(angS,3)}′ — razón ${num(angL/angS,4)})* |`);
P(`| Iluminación | ${num(A.Illumination('Moon',time).phase_fraction*100,1)} % |`);
P('');
if (epoca){
  P(`### Cumpleaños lunar\n`);
  /* El instante exacto (pendiente 43), con SearchMoonPhase. Antes era un
     barrido de 15 minutos desde la hora de ejecución, y daba un minuto
     distinto según cuándo se lanzara el script. `desde` en el JSON fija
     el punto de partida para que la hoja sea reproducible. */
  const desde = d.desde ? Date.parse(d.desde) : Date.now();
  const cl = C.cumpleanosLunar(ms, desde);
  P(`El ángulo Luna−Sol del nacimiento vuelve cada mes. Buscando desde ${d.desde ? d.desde : 'hoy'}:\n`);
  if (cl) P(`> **${loc(new Date(cl.instante))}**\n`);
}

P(`---\n`);
P(`*Generado por \`hoja-de-cielo.mjs\` el ${new Date().toISOString().slice(0,10)}.*`);
P(`*Motor: astronomy-engine ${A.version ?? '2.1.19'}. Ningún valor está guardado: todo se recalcula.*`);

console.log(S.join('\n'));
