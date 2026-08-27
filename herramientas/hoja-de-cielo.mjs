#!/usr/bin/env node
// hoja-de-cielo.mjs — genera la hoja de nacimiento de cualquier persona.
// Uso:  node hoja-de-cielo.mjs datos.json > hoja.md
// Requiere: npm install astronomy-engine   (2.1.19, MIT, sin dependencias)
//
// REGLA 0.1: este programa NO inventa nada. Todo número sale del motor o de una
// convención declarada en el JSON de entrada. Lo que no se puede calcular, no se
// escribe: se omite la sección entera.

import * as A from 'astronomy-engine';
import { readFileSync } from 'node:fs';

const RAD = Math.PI/180, DEG = 180/Math.PI;
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
const time = A.MakeTime(nac);
const loc  = (dd, o={}) => dd.toLocaleString('es-ES', {timeZone:d.zona, dateStyle:'short', timeStyle:'medium', ...o});
const hhmm = dd => dd.toLocaleString('es-ES', {timeZone:d.zona, hour:'2-digit', minute:'2-digit', hour12:false});

// ---------------------------------------------------------------- básicos
const CUERPOS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
const NOM = {Sun:'Sol',Moon:'Luna',Mercury:'Mercurio',Venus:'Venus',Mars:'Marte',Jupiter:'Júpiter',
  Saturn:'Saturno',Uranus:'Urano',Neptune:'Neptuno',Pluto:'Plutón'};
const SIGNOS = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
const gr = l => { l = norm(l); const s = Math.floor(l/30), x = l-s*30;
  return `${Math.floor(x)}° ${d2(Math.floor((x%1)*60))}′ ${SIGNOS[s]}`; };

const lon = (c, t=time) => c==='Moon' ? A.EclipticGeoMoon(t).lon : A.Ecliptic(A.GeoVector(c,t,true)).elon;
const retro = c => { if (c==='Sun'||c==='Moon') return false;
  let v = lon(c, A.MakeTime(new Date(nac.getTime()+43200000))) - lon(c, A.MakeTime(new Date(nac.getTime()-43200000)));
  if (v>180) v-=360; if (v<-180) v+=360; return v<0; };

const L = {}; for (const c of CUERPOS) L[c] = lon(c);

// ángulos y casas
const eps  = Math.acos(A.Rotation_EQD_ECT(time).rot[1][1]);
const ramc = norm(A.SiderealTime(time)*15 + d.lon);
const phi  = d.lat*RAD;
const ascBajoPolo = (Rg,P) => { const r=Rg*RAD;
  return norm(Math.atan2(Math.cos(r), -(Math.sin(r)*Math.cos(eps)+Math.tan(P)*Math.sin(eps)))*DEG); };
const MC = norm(Math.atan2(Math.sin(ramc*RAD), Math.cos(ramc*RAD)*Math.cos(eps))*DEG);
let ASC = ascBajoPolo(ramc, phi);
if (norm(ASC-MC) > 180) ASC = norm(ASC+180);

const decDe   = l => Math.asin(Math.sin(eps)*Math.sin(l*RAD));
const lonDeRA = ra => norm(Math.atan2(Math.sin(ra*RAD)/Math.cos(eps), Math.cos(ra*RAD))*DEG);

const sistemas = {};
sistemas['Signos enteros'] = Array.from({length:12},(_,i)=>norm(Math.floor(ASC/30)*30 + i*30));
sistemas['Iguales']        = Array.from({length:12},(_,i)=>norm(ASC + i*30));
{ const IC=norm(MC+180), DSC=norm(ASC+180);
  const q=[norm(IC-ASC)/3, norm(DSC-IC)/3, norm(MC-DSC)/3, norm(ASC-MC)/3];
  sistemas['Porfirio']=[ASC,norm(ASC+q[0]),norm(ASC+2*q[0]),IC,norm(IC+q[1]),norm(IC+2*q[1]),
    DSC,norm(DSC+q[2]),norm(DSC+2*q[2]),MC,norm(MC+q[3]),norm(MC+2*q[3])]; }
function placidus(diurno, frac){
  let l = lonDeRA(norm(ramc + (diurno?90:270)));
  for (let i=0;i<80;i++){
    const t = Math.tan(phi)*Math.tan(decDe(l));
    if (Math.abs(t)>=1) return null;                  // circumpolar: Placidus no existe
    const AD = Math.asin(t)*DEG, SD = diurno ? 90+AD : 90-AD;
    const nueva = lonDeRA(norm(ramc + (diurno ? frac*SD : 180 - frac*SD)));
    if (Math.abs(norm(nueva-l+180)-180) < 1e-9) return nueva;
    l = nueva;
  }
  return l;
}
{ const c11=placidus(true,1/3), c12=placidus(true,2/3), c3=placidus(false,1/3), c2=placidus(false,2/3);
  if ([c11,c12,c2,c3].every(x=>x!==null))
    sistemas['Placidus']=[ASC,c2,c3,norm(MC+180),norm(c11+180),norm(c12+180),
      norm(ASC+180),norm(c2+180),norm(c3+180),MC,c11,c12]; }
for (const [nombre, off] of [
  ['Regiomontano', H=>H],
  ['Campano',      H=>norm(Math.atan2(Math.sin(H*RAD), Math.cos(H*RAD)*Math.cos(phi))*DEG)]]){
  const c = Array.from({length:12},(_,i)=>{ const H=norm(90+30*i), D=off(H);
    return ascBajoPolo(norm(ramc+D-90), Math.atan(Math.tan(phi)*Math.sin(D*RAD))); });
  // controles: cúspide 1 = ASC, cúspide 10 = MC, y ninguna cúspide fuera de orden
  const e1=Math.abs(norm(c[0]-ASC+180)-180), e10=Math.abs(norm(c[9]-MC+180)-180);
  let mal=0; for(let i=0;i<12;i++){ const p=norm(c[(i+1)%12]-c[i]); if(p<5||p>75) mal++; }
  if (e1<1e-6 && e10<1e-6 && mal===0) sistemas[nombre]=c;
}
const casaDe = (l,cusp) => { for(let h=0;h<12;h++){ const a=cusp[h], b=cusp[(h+1)%12];
  if (norm(l-a) < norm(b-a)) return h+1; } return 12; };

// ---------------------------------------------------------------- salida
const S = [];
const P = (...x) => S.push(x.join(''));

P(`# El cielo de ${d.lugar || 'este lugar'}, ${d.fecha} a las ${d.hora}\n`);
P(`${d.nombre_completo}`);
P(`${d.lat.toFixed(6)}° · ${d.lon.toFixed(6)}° · ${ELE} m · zona ${d.zona}\n`);
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
for (const c of CUERPOS){
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
  P(`| **${NOM[v.c]}** | ${v.h.altitude.toFixed(1)}° | ${v.h.azimuth.toFixed(0)}° | ${v.mag!==null?'magnitud '+v.mag.toFixed(2):'—'} |`);
const altSol = [...visibles, ...ocultos].find(v=>v.c==='Sun').h.altitude;
P(`\nEl Sol estaba a **${altSol.toFixed(1)}°** respecto al horizonte`);
P(altSol>0 ? ' — de día.\n' : altSol>-18 ? ' — crepúsculo.\n' : ' — noche cerrada, sin crepúsculo.\n');

// 2. hora solar
const ha = A.HourAngle('Sun',time,obs);
const horaSolar = (ha+12)%24;
P(`## La hora del reloj no era la hora del Sol\n`);
P('```');
P(`hora civil declarada   ${d.hora}`);
P(`hora solar verdadera   ${d2(Math.floor(horaSolar))}:${d2(Math.round((horaSolar%1)*60))}`);
P('```\n');
P(`La diferencia viene del huso horario, de la distancia al meridiano de referencia y de la ecuación del tiempo.\n`);

// 3. horas planetarias
try {
  const ps = A.SearchRiseSet('Sun',obs,-1,new Date(nac.getTime()-30*3600000),3).date;
  const ss = A.SearchRiseSet('Sun',obs,+1,new Date(nac.getTime()-30*3600000),3).date;
  const dia = nac >= ps && nac < ss ? false : true;   // aproximación: entre puesta y salida = noche
  const ini = dia ? ss : ps, fin = dia ? ps : ss;
  if (ini && fin) {
    const CALDEO = ['Saturno','Júpiter','Marte','Sol','Venus','Mercurio','Luna'];
    const DIAS   = ['Sol','Luna','Marte','Mercurio','Júpiter','Venus','Saturno'];
    const NDIA   = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const [Y,M,D] = d.fecha.split('-').map(Number);
    const ds = new Date(Date.UTC(Y,M-1,D)).getUTCDay();
    const regente = DIAS[ds], base = CALDEO.indexOf(regente);
    P(`## Horas planetarias\n`);
    P(`El tiempo entre salida y puesta del Sol se parte en doce, y la noche también, así que **las horas`);
    P(`diurnas y nocturnas duran distinto**. Cada una se atribuye a un planeta en el orden caldeo.\n`);
    P(`**${NDIA[ds]}** — día de **${regente}**.\n`);
  }
} catch (e) { /* latitud polar: puede no haber salida o puesta. Se omite la sección. */ }

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
A.DefineStar(A.Body.Star1, 13.419883, -11.161319, 250);
const ayan = norm(A.Ecliptic(A.GeoVector(A.Body.Star1,time,true)).elon - 180);
let cambian = 0;
P(`## Zodiaco sidéreo\n`);
P(`Los mismos doce tramos contados desde una estrella. Ayanamsa Lahiri calculado para este instante,`);
P(`fijando Spica en 180°: **${Math.floor(ayan)}° ${((ayan%1)*60).toFixed(1)}′**.\n`);
P(`| | tropical | sidéreo |`); P(`|---|---|---|`);
for (const c of [...CUERPOS]) { const s = norm(L[c]-ayan);
  if (Math.floor(norm(L[c])/30)!==Math.floor(s/30)) cambian++;
  P(`| ${NOM[c]} | ${gr(L[c])} | ${gr(s)} |`); }
for (const [n,v] of [['Ascendente',ASC],['Medio Cielo',MC]]) { const s=norm(v-ayan);
  if (Math.floor(norm(v)/30)!==Math.floor(s/30)) cambian++;
  P(`| ${n} | ${gr(v)} | ${gr(s)} |`); }
P(`\n**${cambian} de 12 puntos cambian de signo** entre un cero y el otro.\n`);

// 6. rejillas del ángulo Luna-Sol
const sep = norm(L.Moon - L.Sun);
const NAK = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha',
'Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula',
'Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const lunaS = norm(L.Moon - ayan);
const FASES = ['Nueva','Creciente','Cuarto creciente','Gibosa creciente','Llena','Diseminadora','Cuarto menguante','Balsámica'];
P(`## Un solo número, cuatro rejillas\n`);
P(`El ángulo entre la Luna y el Sol era **${sep.toFixed(3)}°**. Lo que sigue no son cuatro datos: es ese`);
P(`número partido de cuatro maneras.\n`);
P(`| rejilla | trozos | resultado |`); P(`|---|---|---|`);
P(`| Fases populares | 4 × 90° | ${['nueva','creciente','llena','menguante'][Math.floor(sep/90)]} |`);
P(`| Fases de Rudhyar | 8 × 45° | ${FASES[Math.floor(sep/45)]} (${Math.floor(sep/45)+1} de 8) |`);
P(`| Tithi | 30 × 12° | ${Math.floor(sep/12)+1} de 30 — ${sep<180?'shukla':'krishna'} |`);
P(`| Karana | 60 × 6° | ${Math.floor(sep/6)+1} de 60 |`);
P(`\nY sobre el cero sidéreo, la Luna cae en el **nakshatra ${Math.floor(lunaS/(360/27))+1} de 27,`);
P(` ${NAK[Math.floor(lunaS/(360/27))]}**, pada ${Math.floor((lunaS%(360/27))/(360/108))+1} de 4.\n`);

// 7. jieqi
const TERM = ['Lichun','Yushui','Jingzhe','Chunfen','Qingming','Guyu','Lixia','Xiaoman','Mangzhong','Xiazhi',
'Xiaoshu','Dashu','Liqiu','Chushu','Bailu','Qiufen','Hanlu','Shuangjiang','Lidong','Xiaoxue','Daxue','Dongzhi','Xiaohan','Dahan'];
const TRAD = ['comienzo de la primavera','agua de lluvia','despertar de los insectos','equinoccio de primavera',
'pura claridad','lluvia de grano','comienzo del verano','grano lleno','grano en la espiga','solsticio de verano',
'calor menor','calor mayor','comienzo del otoño','fin del calor','rocío blanco','equinoccio de otoño','rocío frío',
'caída de la escarcha','comienzo del invierno','nieve menor','nieve mayor','solsticio de invierno','frío menor','frío mayor'];
const iT = Math.floor(norm(L.Sun - 315)/15);
P(`## Términos solares chinos\n`);
P(`Veinticuatro momentos espaciados 15° a lo largo de la eclíptica, contados **desde el mismo equinoccio`);
P(`que el zodiaco occidental**. Mismo cero, más resolución.\n`);
P(`Naciste dentro de **${TERM[iT]}** — *${TRAD[iT]}*. El siguiente es **${TERM[(iT+1)%24]}**, *${TRAD[(iT+1)%24]}*.\n`);

// 8. calendarios aritméticos
const cal = (c) => { try { return new Intl.DateTimeFormat('es-ES',{calendar:c,dateStyle:'long',timeZone:d.zona}).format(nac); } catch { return null; } };
const jdnLocal = Math.floor(Date.UTC(...d.fecha.split('-').map((v,i)=>i===1?Number(v)-1:Number(v)))/86400000) + 2440588;
const TZ_N = ['Imix','Ik','Akbal','Kan','Chikchan','Kimi','Manik','Lamat','Muluk','Ok','Chuwen','Eb','Ben','Ix','Men','Kib','Kaban','Etznab','Kawak','Ajaw'];
const corr = d.correlacion_tzolkin ?? 584283;
const dd = jdnLocal - corr;
P(`## Calendarios de cuenta\n`);
P(`No miden nada: cuentan desde un instante declarado. Por eso no pueden desfasarse de nada.\n`);
P(`| | |`); P(`|---|---|`);
for (const [n,c] of [['Hebreo','hebrew'],['Islámico','islamic-civil'],['Persa','persian'],['Chino','chinese']]) {
  const v = cal(c); if (v) P(`| **${n}** | ${v} |`); }
P(`| **Tzolk'in maya** | ${((dd+3)%13+13)%13+1} ${TZ_N[((dd+19)%20+20)%20]} *(correlación ${corr})* |`);
P(`| **Día juliano** | ${(time.ut+2451545).toFixed(5)} |`);
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
P(`\n**${discrepan} de 10 cuerpos cambian de casa** según el sistema elegido.\n`);

// 10. aspectos y paralelos
/* Orbe por defecto 1°, y no 3°. Medido sobre un año completo contra una carta
   real: con 1° hay 4,8 aspectos al día y CINCO días del año sin ninguno; con 2°
   son 10,1 y cero días; con 3°, 15,9 y cero. Por encima de 1° no existe el día
   vacío, y un sistema que nunca calla no puede ser contradicho por los datos.
   La línea de "ninguno dentro de ese orbe" ya estaba escrita más abajo: con 3°
   no se imprimía nunca. */
const ORBE = d.orbe ?? 1;
/* El de los paralelos es otro umbral y estaba a pelo, escrito dos veces como
   `< 1`. Medido el 26 de agosto con el mismo método y el mismo criterio que
   ORBE (conteo mutuo entre los 10 cuerpos de esta misma carta, sobre un año
   civil completo): a 1° NO existe el día sin ningún paralelo bajo ninguna
   hora de muestreo probada — el umbral heredado no pasa el criterio del
   propio proyecto. A 0,75° hay 3,2 paralelos de media y entre 4 y 5 días
   vacíos al año, el perfil más parecido al de ORBE (4,8 y 5) y el más
   estable frente a la hora de muestreo de los probados. Detalle en
   03-registro-de-datos.md, sección «Aspectos». */
const ORBE_PARALELO = d.orbe_paralelo ?? 0.75;
const ASPECTOS = [['conjunción',0],['sextil',60],['cuadratura',90],['trígono',120],['oposición',180]];
const asp = [];
for (let i=0;i<CUERPOS.length;i++) for (let j=i+1;j<CUERPOS.length;j++){
  let x = Math.abs(norm(L[CUERPOS[i]]-L[CUERPOS[j]])); if (x>180) x=360-x;
  for (const [an,ag] of ASPECTOS){ const o=Math.abs(x-ag); if (o<=ORBE) asp.push({a:NOM[CUERPOS[i]],b:NOM[CUERPOS[j]],an,o}); } }
asp.sort((a,b)=>a.o-b.o);
P(`## Ángulos entre los cuerpos\n`);
P(`Orbe declarado: **${ORBE}°**. Cuáles existen depende de quién los cuente.\n`);
P(`Por encima de 1° no hay un solo día del año sin ningún aspecto, y un sistema que nunca calla no`);
P(`puede ser contradicho por los datos. Por eso el día vacío tiene que poder existir.\n`);
if (asp.length===0) P(`Ninguno dentro de ese orbe.\n`);
else { P(`| | | | orbe |`); P(`|---|---|---|---|`);
  for (const x of asp) P(`| ${x.a} | ${x.an} | ${x.b} | ${x.o.toFixed(3)}° |`); P(''); }

const DEC = {}; for (const c of CUERPOS) DEC[c] = EQ[c].dec;
const par = [];
for (let i=0;i<CUERPOS.length;i++) for (let j=i+1;j<CUERPOS.length;j++){
  const p = Math.abs(DEC[CUERPOS[i]]-DEC[CUERPOS[j]]), cp = Math.abs(DEC[CUERPOS[i]]+DEC[CUERPOS[j]]);
  if (p<ORBE_PARALELO)  par.push({a:NOM[CUERPOS[i]],b:NOM[CUERPOS[j]],t:'paralelo',o:p});
  if (cp<ORBE_PARALELO) par.push({a:NOM[CUERPOS[i]],b:NOM[CUERPOS[j]],t:'contraparalelo',o:cp}); }
par.sort((a,b)=>a.o-b.o);
if (par.length){
  P(`### Paralelos de declinación\n`);
  P(`Casi nadie los mira. La declinación es la altura sobre el ecuador celeste: dos cuerpos con la misma`);
  P(`recorren el mismo arco de cielo aunque estén separados en el zodiaco.\n`);
  P(`| | | | orbe |`); P(`|---|---|---|---|`);
  for (const x of par) P(`| ${x.a} | ${x.t} | ${x.b} | ${x.o.toFixed(3)}° |`); P(''); }

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
  P(`| Naciste | ${((nac-epoca)/60000).toFixed(0)} minutos después |`); }
else P(`| Salida de la Luna anterior | *no hubo salida en el periodo buscado — a esta latitud puede no haberla* |`);
P(`| Distancia | ${rLuna.toFixed(0)} km |`);
P(`| Diámetro aparente | ${angL.toFixed(3)}′ *(el Sol: ${angS.toFixed(3)}′ — razón ${(angL/angS).toFixed(4)})* |`);
P(`| Iluminación | ${(A.Illumination('Moon',time).phase_fraction*100).toFixed(1)} % |`);
P('');
if (epoca){
  P(`### Cumpleaños lunar\n`);
  P(`El ángulo Luna−Sol del nacimiento vuelve cada mes. Buscando desde hoy:\n`);
  const ahora = new Date();
  let prev=null, hallado=null;
  for (let k=0;k<40*96 && !hallado;k++){
    const t2 = A.MakeTime(new Date(ahora.getTime() + k*15*60000));
    let x = norm(norm(A.EclipticGeoMoon(t2).lon - A.SunPosition(t2).elon) - sep);
    const c = x<180 ? x : x-360;
    if (prev!==null && prev<0 && c>=0) hallado = t2.date;
    prev = c;
  }
  if (hallado) P(`> **${loc(hallado,{timeStyle:'short'})}** *(±15 min)*\n`);
}

P(`---\n`);
P(`*Generado por \`hoja-de-cielo.mjs\` el ${new Date().toISOString().slice(0,10)}.*`);
P(`*Motor: astronomy-engine ${A.version ?? '2.1.19'}. Ningún valor está guardado: todo se recalcula.*`);

console.log(S.join('\n'));
