# 00 · Umbral — hoja de ruta

**Versión 5 · 22 de agosto de 2026.** Sustituye por completo a la versión 4 y
absorbe `parche-hoja-de-ruta.md`, **que se borra al publicar esta.**

Cambios frente a la v4: se cierran seis decisiones (0008 a 0013); **el Compás
existe** y abre en 37 prácticas en vez de en 3; la app deja de abrir sobre el
cuestionario y estrena portada; **la Fase 1 está calculada y probada** aunque
todavía no se enseñe; se ficha por fin todo lo que estaba «pendiente de
calcular», incluidas las coordenadas de Albacete; y se corrigen cinco cosas que
esta hoja de ruta decía y que ya no eran verdad.

**Cómo usar este documento:** es autocontenido. No hace falta pedir contexto
adicional ni preguntar "¿qué es Umbral?" — todo lo necesario para seguir
escribiendo código está aquí. Si algo no está aquí, es que aún no se ha decidido,
y hay que preguntarlo antes de inventarlo. Lo abierto vive en `docs/01-pendiente.md`;
lo cerrado, en `docs/decisiones/`.

### Lo que esta versión corrige de la anterior

Se anota porque un documento que se corrige a sí mismo sin decirlo enseña a
desconfiar de él entero.

| Dónde | Decía | Dice ahora |
|---|---|---|
| §2 | Fondo nocturno `#040618` | **`#0A0E19`.** El otro se retiró y se quedó dentro de los iconos sin que nadie lo viera |
| §2 | «La marca no se repite junto al nombre» | La rosa **sí** va junto al nombre. La objeción de la 0005 era la aguja roja de la fotografía, no la rosa |
| §3 | «45,6 KB gzip» del motor astronómico | Son los de la build **UMD minificada**. La de módulos ES son 105,1 KB |
| §8 | «Noches sin Luna: 63 ± 2» | Esa fila **no tiene método** y ninguna definición razonable llega a 63. Ver §8 |
| §8 | El día lunar, sin rango | Medido: **58 minutos** entre el más corto y el más largo de 2026 |
| §15 | «Solo las de respiración abren el temporizador» | Abren **37 de 100** |

---

## 0. Las cinco reglas que gobiernan cualquier decisión

1. **No se inventa ningún dato.** Todo número se calcula, se consulta con fuente
   citable, o se muestra como ausente. Nunca se rellena un hueco con un valor
   plausible. *Esta regla se aplica también a las palabras: si no hay ninguna
   práctica que ofrecer, no se muestra ninguna.*
2. **Lo autoinformado y lo externo nunca se mezclan en una fórmula ni en un mismo
   número.** Van siempre separados, con etiqueta.
3. **Los datos personales se quedan en el dispositivo.** Sin backend, sin cuentas,
   sin telemetría. La única excepción es la consulta a APIs públicas externas —y
   esa consulta nunca envía nada personal, es opt-in, y se declara en el código.
4. **Cero contenido médico.** Nada de predicción de fertilidad, diagnóstico ni
   ciclo menstrual en esta fase. Nada de afirmaciones fisiológicas como reclamo.
5. **Si un cambio técnico rompe la separación anterior, se para y se pregunta
   antes de seguir.**

---

## 1. Decisión de producto — cerrada

Umbral es una **herramienta de autorregulación personal**, no un medidor de
influencias externas. La pantalla principal responde a esta prioridad, en este
orden:

**yo → necesidad → acción → contexto → detalle**

> Si en cualquier maqueta o prototipo el contexto medible ocupa más espacio
> visual o aparece antes que "¿Cómo estás ahora?", es un defecto que corregir, no
> una variante válida. Esto incluye las maquetas propias.

---

## 2. Las pantallas y la estructura

*Sustituye a la «pantalla de umbral» de la v4, término retirado por la decisión
0011 porque mezclaba dos pantallas distintas.*

### El mapa

| # | Pantalla | Quién la dibuja | Estado |
|---|---|---|---|
| 1 | **Arranque del sistema** | El sistema operativo, desde el manifest. **No se puede diseñar** | — |
| 2 | **Portada** | La app. Se cruza con un botón | **Hecha** |
| 3 | **Resumen** | La app | Pendiente (§ `01-pendiente.md` 10) |
| 4 | **Mi registro** | La app | Hecha |
| 5 | **Calendario** | La app | Pendiente (decisión 0012) |

**La app deja de abrir sobre «Mi registro».** El 28 de agosto la pantalla 3
todavía no existe, así que el orden real de esa ventana es **arranque → portada →
Mi registro**. El cuestionario pasa a ser el cuarto paso solo cuando exista el
resumen, y entonces cambia **una línea de código**: a dónde salta el foco al
pulsar «Entrar».

### La pantalla 1 no se puede diseñar, y hay que saberlo

Lo que se ve al abrir una app instalada lo compone el sistema operativo: coge
`background_color` del manifest y planta encima el icono de 512 centrado, al
tamaño que él decide. **No admite una imagen a sangre.** Por eso el logo se ve
pequeño: no está mal exportado, es que ahí solo cabe un icono.

### La portada

Brújula sangrada hasta los dos bordes como franja de altura acotada, disuelta con
un **velo** —un degradado que acaba exactamente en el color del fondo, así que no
hay costura posible— y no con una máscara, que dejaba un corte recto. Debajo, el
nombre apoyado dentro de la zona ya disuelta, la frase, el reloj y el botón.

> *Los cielos siguen su curso sin avisar*
> *Tú puedes detenerte a mirar el tuyo*

El reloj es la única pieza con marco, porque es lo único que cambia cada vez que
se abre. Lleva la hora civil arriba y el calendario personal abajo — y **mientras
el motor astronómico no se enseñe, esa segunda línea dice «Sin calcular todavía»
en `--oro-tenue`**. No un cero, no una raya muda. Es la regla 0.1 dibujada.

**No hay desvanecido.** El prototipo llevaba uno de 0,7 s, herencia de la versión
que se iba sola; la 0011 lo sustituyó por un botón y el desvanecido dejó de
resolver nada. Este proyecto declara «sin animación en ninguna circunstancia» y no
se le hace una excepción al estreno.

### Mi registro

```text
✦ Umbral                                  [fecha]

MI REGISTRO
¿Cómo estás ahora?
Una observación abierta, no una tarea que completar.

  Descanso     · · · · ·        nada restaurador → muy restaurador
  Energía      · · · · ·        muy baja → muy alta
  Activación   · · · · ·        muy baja → sobrepasada
  Tono         · · · · ·        muy difícil → muy agradable

¿Hay algo corporal que quieras tener en cuenta?
  Nada especial · Tensión · Cansancio · Dolor · Otro

¿Qué necesito ahora?
  Pausar · Moverme · Bajar estímulos · Enfocarme
  Conectar · Salir · Descansar · No lo sé

Una opción para ti            ← solo si el filtro devuelve alguna
  [práctica]  [medida, si la tiene]
  Probar · Otra idea · Hoy no

Nota

[Guardar registro]
Hoy: 2 registros · último a las 15:41.      ← el resumen PERSONAL

CONTEXTO MEDIBLE (contraído, aún no construido)
```

**Hay dos resúmenes y no son lo mismo.** Se confundieron el 22 de agosto y por eso
queda escrito:

| | **El resumen personal** | **La pantalla resumen** |
|---|---|---|
| Qué dice | cuánto llevas anotado hoy | cómo está el día entero, de un vistazo |
| Forma | una línea de texto | un espacio gráfico |
| Dónde | dentro de «Mi registro», debajo del botón | pantalla propia, entre la portada y el cuestionario |
| Estado | **existe y se queda donde está** | no existe |

### La marca sí va junto al nombre

**Esto corrige la v4**, que decía lo contrario. En la cabecera de «Mi registro» va
la **rosa de ocho puntas del logo, dibujada en SVG** —veinticuatro triángulos y un
rombo, unos 900 bytes— junto a la palabra Umbral.

La objeción de la decisión 0005 era **la aguja roja de la fotografía**, no la rosa:
una aguja roja junto a cuatro escalas se lee como indicador, y una rosa de ocho
puntas sin aguja no. La fotografía sigue viviendo solo en la portada.

### Identidad visual (decisiones 0002, 0003 y 0005)

**Fondo nocturno `#0A0E19`** —y esto también corrige la v4, que seguía escribiendo
el `#040618` retirado—, serif Cormorant Garamond peso 500 empaquetada, rótulos en
versalitas espaciadas, oro con moderación.

En "Mi registro" el color **nunca** codifica valor: un único acento de selección
para las cuatro escalas, discos de tamaño idéntico, y los dos extremos escritos
bajo cada fila. Los cinco colores de familia quedan declarados en los tokens pero
**sin usar** hasta la Fase 2, y **no salen de la paleta de marca**.

`--crema` (`#F2E9D8`) y `--malva` (`#C6A6C4`), los dos arcos de la trama del logo,
**sí son tokens de interfaz** y los usan la rosa y el Compás. La 0005 los reserva
frente a las **familias de datos**, no frente a la interfaz. Al repartir los
colores de Fase 2 hay que tener esto delante (`01-pendiente.md` 7).

Los seis colores del logo están medidos y fichados en `03-registro-de-datos.md`.
Nunca lo habían estado.

---

## 3. Stack técnico

| Pieza | Elección | Motivo |
|---|---|---|
| Arquitectura | **PWA primero, Capacitor después** para el APK | Se llega a "instalado y funcionando" sin compilar nada |
| Compilación | **Ninguna.** `app/` es a la vez fuente y publicado | En cuanto aparezca un `dist/`, alguien habrá metido un empaquetador |
| Módulos | **ES nativos**, `<script type="module">` | Permite partir en archivos sin empaquetador |
| Instalación | `manifest.webmanifest` + `sw.js`, **rutas relativas siempre** | Decisión 0006. Una sola ruta absoluta rompe bajo GitHub Pages y otra vez dentro de Capacitor |
| Caché offline | **Precache explícito, cero caché dinámica** | Lista a mano en `sw.js`, con prueba dorada que impide que se desincronice |
| Publicación | **GitHub Pages desde la raíz** → `.../umbral/app/` | Cero configuración. Ni rama aparte, ni acción, ni mover carpetas |
| Motor astronómico | **astronomy-engine** (MIT, v2.1.19, Don Cross) | Ver el bloque de abajo |
| Zonas horarias | `Intl.DateTimeFormat().resolvedOptions().timeZone`, con `Europe/Madrid` **solo como reserva** | Decisión 0001. Nunca se escribe `+1`/`+2`/`CEST` a mano |
| Almacenamiento | **IndexedDB**, local | Sin nube, sin sincronización |
| Tipografía | Cormorant Garamond 500, woff2 subseteada, **dentro del repositorio** | 13,5 KB por corte. Sin red no hay fuentes web |
| Sonido | **Web Audio sintetizado**, sin archivos | Cero KB, cero red |
| Pruebas | `node --test pruebas/*.test.mjs` | Runner incorporado, sin dependencias |
| Datos externos | `fetch` directo a las APIs de la §5 | Sin backend propio |

### Qué build del motor astronómico se empaqueta, y por qué

**Esto corrige la v4**, que fichaba «45,6 KB gzip» sin decir de qué build. Medido
el 22 de agosto sobre el paquete instalado:

| Build | En disco | Comprimida | ¿Es módulo ES? |
|---|---|---|---|
| `astronomy.browser.min.js` (UMD) | 116.424 B | **45,6 KB** | No |
| `esm/astronomy.js` | 412.025 B | 105,1 KB | Sí |

Se empaqueta **la UMD**, cargada con un `<script>` clásico que deja `Astronomy` en
el global. 296 KB de más en disco no se pagan por evitar una variable global en
una app que tiene que abrir sin cobertura.

Y hay un segundo motivo, que es el bueno: **la UMD se puede cargar desde Node con
`require()`**, así que las dieciséis pruebas astronómicas ejercitan exactamente
los bytes que se instalan en el móvil, y no otra build parecida. La licencia MIT
va dentro del propio fichero y también aparte, en
`js/vendor/LICENCIA-astronomy-engine.txt`, por lo mismo que `fuentes/OFL.txt`.

**No se usa `Screen Wake Lock`.** Los ejercicios se diseñan para seguirse con el
oído, así que la pantalla apagada es una variante legítima, no un fallo.

**El service worker no guarda nada de otro origen.** Open-Meteo, GFZ y AEMET pasan
directas a la red. Un worker que devolviera una copia guardada convertiría un dato
viejo en un dato aparentemente fresco: rompería la regla 0.1 y borraría la
distinción `sin_conexion` / `sin_cobertura` de la §4. El caché legítimo de esos
datos es `cache_externa` en IndexedDB, que sí lleva timestamp visible.

**`VERSION` en `sw.js` se sube a mano en cada cambio de `app/`.** Sin compilación
no hay hash de contenido, así que la fecha es el número de versión honesto. Hoy:
`'2026-08-22d'`.

---

## 4. Modelo de datos (IndexedDB)

Base `umbral`, versión 1. Los tres almacenes se crean desde el principio aunque
hoy solo se use uno, para no obligar a una migración de esquema después.

### `checkins` — un registro por chequeo

```js
{
  id: string,                // uuid
  fecha_local: "2026-08-19", // día civil, calculado con Intl y ZONA
  zona: "Europe/Madrid",     // zona en que se creó el registro
  timestamp: number,         // epoch ms, instante exacto
  descanso: 1|2|3|4|5|null,
  energia: 1|2|3|4|5|null,
  activacion: 1|2|3|4|5|null,
  tono: 1|2|3|4|5|null,
  senal_corporal: string[],  // ["tension","cansancio",...] u []
  necesidad: string | null,  // "pausar"|"moverme"|... |"no_lo_se"|null
  accion_elegida: string | null,   // id de práctica o texto libre
  accion_resultado: null,          // ver más abajo
  nota_libre: string | null
}
```

Cualquier campo puede quedar `null` o vacío. **Un registro ausente no es un error,
es un día sin dato.**

**`zona` empieza a escribirse el 28 de agosto y no antes** (decisión 0009). El
campo estaba en el esquema, la constante existía y se pintaba en el pie, y **no se
escribía**: se calculaba, se enseñaba y se perdía. Los registros del 21 al 27 se
quedan sin ella y **el hueco no se rellena nunca**, ni ahora ni después. Palabras
de Ana, que son la decisión: «si aún no lo podemos registrar, mejor ser sinceros».

Consecuencia para quien lea estos datos: **`zona` es opcional**, y un `zona`
ausente no es un error ni un cero, es un registro anterior al 28 de agosto de
2026. Si alguna vista agrupa por zona, esos van a un grupo propio que se llama
«sin zona», no al de `Europe/Madrid`.

`accion_resultado` acepta `"si"|"algo"|"no"|"no_lo_se"|"no_la_hice"` pero **hoy se
guarda siempre `null`**: preguntar el resultado en el mismo instante en que se
elige la acción es pedir algo que aún no ha ocurrido. El Compás tampoco pregunta
al terminar — sería pedirle un resultado a alguien que acaba de exhalar. El
segundo momento sigue sin decidirse (`01-pendiente.md` 2).

### `perfil_local` — un único registro

```js
{
  nombre: string | null,
  ubicacion: { lat, lon, ciudad } | null,
  familias_externas_activas: string[],   // hasta 3
  modo_movimiento: "activo" | "detenido", // detenido por defecto
  consentimiento_red_externa: boolean     // false por defecto
}
```

Este almacén estaba vacío desde la versión 1 y **estaba esperando el calendario**.
La decisión 0012 le añade estos campos, que **todavía no están implementados**:

```js
{
  nacimiento: {
    fecha: "1988-05-03",                  // obligatorio
    hora: "07:15" | null,                 // exacta, si se sabe
    franja: "madrugada"|"manana"|"mediodia"|"tarde"|"noche" | null,
    lat: number, lon: number,             // OBLIGATORIAS: la salida de la Luna es local
    epoca_utc: number,                    // se calcula una vez y se guarda
    epoca_aproximada: boolean             // true solo si la franja contiene una salida
  }
}
```

**El lugar se pide obligatoriamente.** La salida de la Luna del 3 de mayo en
Albacete no es la misma que en otra ciudad, y usar Albacete para quien nació en
otro sitio daría un calendario mal anclado sin que nada avisara.

**Ojo, son dos pares de coordenadas distintos y es fácil confundirlos en el
código:**

| Para qué | Qué coordenadas | Cuándo se usa |
|---|---|---|
| **La época** del calendario | Las del **lugar de nacimiento** | Una sola vez, al fijar el día lunar 1 |
| **Las salidas y puestas** de cada día | Las del **lugar donde se vive hoy** | Cada día, siempre |

### `cache_externa` — una entrada por familia

```js
{
  familia: "luna"|"sol_luz"|"atmosfera"|"aire"|"kp"|"polen",
  valor: object,
  fuente: string,
  estado: "medicion"|"prevision"|"calculo"|"sin_conexion"|"sin_cobertura",
  actualizado: number
}
```

**`sin_conexion` frente a `sin_cobertura`**: *sin conexión* = el dispositivo no
tiene red o la petición falló; el dato existe pero no se alcanza ahora, y se
reintenta. *Sin cobertura* = la petición funcionó y la fuente respondió que ahí no
mide nada; el dato no existe para este sitio, no se reintenta, y no tiene sentido
decir "actualizado hace X". El umbral exacto entre los dos sigue sin fijarse
(`01-pendiente.md` 6).

---

## 5. Fuentes de datos externos

| Familia | Dato | Fuente | Red | Estado |
|---|---|---|---|---|
| **Luna** | Fase, iluminación, salida/puesta, distancia | astronomy-engine | No | **Calculado y probado** (§19) |
| **Luna** | Forzamiento de marea relativo | Fórmula propia, decisión 0013 | No | **Calculado y probado** (§19) |
| **Sol/luz** | Amanecer, atardecer, duración, Δ día | astronomy-engine | No | Listo para Fase 1 |
| **Sol/luz** | Índice UV | Open-Meteo Air Quality | Sí | Sin clave |
| **Atmósfera** | Temperatura, viento, nubes, lluvia, presión | Open-Meteo Weather | Sí | Sin clave |
| **Aire** | PM2.5, PM10, NO2, O3 | Open-Meteo Air Quality | Sí | Gratis solo uso no comercial |
| **Aire** | Línea base local | Red de Calidad del Aire de Castilla-La Mancha, estación de Albacete | Una vez | CSV validado desde 2013 |
| **Kp** | Actividad geomagnética | GFZ Potsdam / NOAA SWPC | Sí | Excepción de red declarada |
| **Polen** | Nivel por tipo | AEROCAM (UCLM), integrada en la REA | Sí | Cobertura confirmada en Albacete. **Bloqueado: no hay API** |
| **Clima** | Normales 1991-2020 | AEMET OpenData | Una vez | Clave gratuita por correo |

### El lugar, por fin fichado

**Coordenadas de Albacete: AEMET, estación 8178D «Albacete, Observatorio».
39° 00′ 20″ N · 01° 51′ 44″ O · 674 m.** Consultadas el 22 de agosto de 2026 en el
listado oficial de estaciones de los datos abiertos de AEMET.

Se elige la del observatorio y no la 8175 («Los Llanos», base aérea, 702 m, unos
5 km al sur) porque está en la ciudad. Y se elige AEMET y no un agregador de
coordenadas porque **es la misma fuente de la que va a salir la línea base
climática**: así el cielo y el clima se refieren al mismo punto del suelo.

*Anotado al consultarlo:* las páginas web de AEMET para la estación 8175 muestran,
según el día, dos pares de coordenadas distintos, y uno de ellos es prácticamente
el del observatorio. El listado de datos abiertos las separa bien y es el que se
usa. Detalle y sensibilidad en `03-registro-de-datos.md`.

**Sobre el polen.** Hay captador en Albacete y la cadencia semanal se acepta. El
bloqueo es otro: AEROCAM publica una web semanal, no un endpoint. Sacar el número
obligaría a raspar HTML de una web universitaria, que se rompe con cada rediseño.
Se decide en Fase 3.

**Sobre la clave de AEMET.** Una clave dentro de una app de cliente es una clave
pública. Aquí no importa porque la línea base **se calcula una sola vez**, en
local. La clave vive en el entorno de la máquina y en `.gitignore`; a `app/` solo
llega el JSON derivado.

**Regla de excepción de red** (Sol/UV, Atmósfera, Aire, Kp, Polen): apagada por
defecto; se activa con `consentimiento_red_externa`. Hasta **3 familias activas**,
no las seis. Sin conexión: estado `"sin_conexion"`, nunca un cero ni un valor
neutro. Ninguna llamada envía nombre ni ubicación exacta.

---

## 6. Gramática visual del contexto medible

*Se llamaba "el aura" hasta la v2. Se retira la palabra: una pantalla que muestra
PM2.5 y actividad geomagnética no puede llamarse aura sin caer exactamente en lo
que prohíbe la §10 sobre "energía lunar". El nombre es* **contexto medible**, *en
el documento y en el código.*

| Atributo | Significado permitido | Prohibido |
|---|---|---|
| Color | Identidad fija de familia | Nunca intensidad, bienestar ni peligro |
| Posición radial | Orden fijo de familias | Nunca importancia ni magnitud |
| Estilo de trazo | Continuo = disponible · discontinuo = previsión · hueco = sin dato | No es una escala de confianza abstracta |
| Movimiento | Contemplativo opcional, **detenido por defecto** | No codifica anomalía ni intensidad |
| Etiqueta textual | Valor, unidad, fuente, hora, referencia | Único canal de precisión real |

**El trazo discontinuo está reservado.** Significa "previsión". No se usa como
adorno en ninguna otra pantalla: gastaría la señal antes de que exista.

**El color de familia no sale de la paleta de marca** (decisión 0005): crema,
malva, turquesa y ámbar pertenecen al logo y no identifican ningún dato. Sigue sin
resolverse el choque de `--fam-atmosfera`, `--fam-kp` y `--fam-luna`
(`01-pendiente.md` 7), y ahora hay que contar además con que crema y malva ya se usan
en la interfaz.

### La trampa que hay que resolver antes de dibujar la pantalla resumen

Ana la describió el 22 de agosto: **los tres niveles en un solo espacio gráfico**
—fuera, dentro, y las percepciones de las energías— para hacerse una idea de todo
de un vistazo. Tres cosas hay que resolver antes de dibujar una sola línea:

1. **Hoy solo existe uno de los tres.** Las cuatro escalas están hechas; el
   contexto medible es Fase 2 y no hay ni un dato; las percepciones de las
   energías no tienen todavía ni pregunta ni campo en el esquema. Tres anillos con
   dos vacíos no son un resumen: son una promesa.
2. **El nivel de fuera y los otros dos no son la misma clase de cosa.** La regla
   0.2 no prohíbe enseñarlos juntos —prohíbe mezclarlos en una fórmula o en un
   número—, pero **la proximidad visual se lee como causa aunque ningún cálculo
   los toque**. Hay que decidir *cómo* al dibujarlo, no después.
3. **La trampa del radio.** Si el radio del anillo codifica el valor, «sin dato» y
   «valor mínimo» se dibujan igual, y son cosas opuestas. El hueco necesita un
   dibujo propio —abierto, punteado— y no un círculo pequeño.

Va a necesitar **decisión numerada propia**. → `01-pendiente.md` 10.

---

## 7. Accesibilidad — no negociable

- Respetar `prefers-reduced-motion`. Si está activo, **sin animación y con el
  mando bloqueado**, no solo apagado.
- Control visible de movimiento, **detenido por defecto en cualquier caso**,
  incluido el Compás. Se enciende a mano. Así no hace falta escribir ninguna
  excepción a esta regla.
- **El conmutador de movimiento dice qué se mueve:** «Onda» en modo respiración,
  «Anillo» en modo duración. No hay una sola cosa que se mueva en los dos modos, y
  un mando genérico no diría el estado de nada.
- **Encender o apagar el movimiento no puede mover nada de lo demás.** La escena y
  su versión quieta ocupan la misma caja de altura fija. Este fue un fallo real
  (§16).
- Ningún dato se comunica solo por color: siempre texto, numeral o patrón.
- Los conmutadores dicen el **estado**, no una etiqueta ambigua: "Sonido:
  activado", no "Sonido". `aria-pressed` no basta para quien no ve el color.
- Con el Compás en marcha, la instrucción es el elemento más grande de la
  pantalla. En respiración es la palabra «Inspira»/«Exhala»; en duración con lados
  es «Un lado»/«El otro»; **en duración sin lados es la cuenta atrás dentro del
  círculo**, porque ahí la instrucción es una cifra y repetirla debajo sería decir
  dos veces lo mismo.
- **La capa del Compás atrapa el foco**, `Escape` cierra, y al cerrar el scroll
  vuelve al bloque de la práctica.
- **Solo una región viva a la vez.** Al guardar cambian el resumen personal y la
  línea de estado; anuncia la de estado, que es la que responde a lo que acabas de
  hacer. Dos regiones vivas hablando juntas no se entienden.
- Lectores de pantalla: primero un resumen, luego el detalle.
- Ningún dato ausente se dibuja como cero o como "normal".
- Sin alarmismo visual, sin rachas, sin puntuación de sincronía.
- **`color-scheme: dark` declarado en el HTML.** Sin él hay un fogonazo blanco
  entre que abre el navegador y pinta el CSS. En una app que se usa de noche, eso
  no es un detalle estético.
- **No se fuerza la orientación** en el manifest.

---

## 8. Conjunto de pruebas doradas — **49 pruebas, 49 pasan**

`node --test pruebas/*.test.mjs` — **la carpeta a secas falla** con
`MODULE_NOT_FOUND`; hace falta el patrón, y en bash lo expande la propia terminal.

| Fichero | Cuántas | Qué vigila |
|---|---|---|
| `precache.test.mjs` | 5 | empaquetado e instalación |
| `seleccion.test.mjs` | 23 | catálogo y filtro |
| `vocabulario.test.mjs` | 5 | que la pantalla y el catálogo hablen igual |
| `luna.test.mjs` | 16 | efemérides y marea |

### De empaquetado — 5

La lista de `PRECACHE` se mantiene a mano porque no hay compilación. Estas pruebas
son lo que sustituye al generador que no queremos:

- Todo fichero de `app/` está en `PRECACHE`. *Sin esto el fallo es silencioso:
  añades un módulo, en el móvil funciona porque hay cobertura, y el día que abres
  la app en mitad del campo falta ese fichero.*
- Todo lo de `PRECACHE` existe en disco. *`addAll` es atómico: un solo 404 tumba
  la instalación entera del worker.*
- Ninguna ruta absoluta ni de otro origen en `PRECACHE`.
- El manifest declara un icono `maskable`.
- `theme_color`, `background_color` y el fondo declarado en el CSS son el mismo
  color. *La prueba mira `css/tokens.css` **o** `index.html`, y comenta por qué:
  sin el segundo sitio pasaría en vacío, que es peor que fallar.*

**Comprobado que fallan cuando deben:** se quitó `compas.js` de `PRECACHE` a
propósito y la primera falló con el mensaje correcto.

**Lo que la primera tolera dentro de `app/`, y no es un descuido:** `sw.js` —que
no puede precachearse a sí mismo—, `.DS_Store`, `.gitkeep` y cualquier
`README.md`. Es andamiaje del repositorio, no cosas que la app necesite abrir sin
red. Por eso `app/js/README.md` puede existir sin romper nada.

**Lo que estas cinco no cogen:** nada de lo que hay *dentro* de una imagen. El
rectángulo de `#040618` que llevaban los cinco iconos pasó por delante de la
quinta prueba sin despeinarla, porque compara ficheros de texto (§16).

### Del vocabulario — 5

El puente entre la pantalla y el catálogo. Nacieron de un fallo real: `index.html`
llamaba `concentrarme` a lo que el catálogo llama `enfocarme`, los dos lados
estaban bien por separado, y ese botón no ofreció nada nunca.

- Toda necesidad de la pantalla existe en el catálogo, y al revés.
- Las ocho necesidades siguen siendo ocho.
- `CUERPO` sigue declarando `dolor`, que es la señal que el filtro trata aparte.
  *Si ese botón dejara de llamarse así, la regla del techo de coste seguiría en el
  código sin dispararse jamás.*

Estas cinco son las que sostuvieron la reescritura de `index.html` del 22 de
agosto, que le metió la portada entera, la rosa, el campo `zona` y el `<script>`
del Compás.

### Del catálogo y el filtro — 23

- *"agotada a las once de la noche: nada que exija salir"* — con energía 2 a las
  23 h sigue habiendo prácticas, todas de coste 1, y `andar_diez`,
  `escaleras_diez` y `sentadillas_pequenas` quedan fuera.
- *"si no queda ninguna, se devuelve null y no un genérico"*.
- Las ocho necesidades tienen al menos una práctica de coste 1.
- Ninguna práctica con `evidencia: "ensayo"` carece de `fuente`.
- **El reparto de pautas es el que dice la decisión 0010** y el Compás abre en 37.
- **Con lados, la duración total es segundos × lados.** 45 s a cada lado son 90 s.
- **Ninguna pauta escribe un decimal.** Recorre las cien y falla si alguna vuelve
  a decir «1.5 min» (§16).

### Astronómicas — 16, y ya no están pendientes

Todas calculadas el 22 de agosto contra astronomy-engine 2.1.19. **Estas pruebas
no vigilan código propio: vigilan que el motor que se empaqueta siga dando lo
mismo.** Si un día se sube de versión y alguna cambia, hay que mirarla, no
ajustarla.

| # | Prueba | Verifica | Resultado |
|---|---|---|---|
| 1 | las tres fases de referencia caen donde dice la §8 | nueva 6 ene 2000, nueva 11 sep 2026, llena 28 ago 2026, ± 2 min | ✔ 0,41 · 0,47 · 0,10 min |
| 2 | en la llena exacta la fase es 180 y la iluminación es 1 | coherencia interna de las efemérides | ✔ |
| 3 | perigeo y apogeo de septiembre de 2026 | 368 249 y 404 210 km, ± 100 km | ✔ **exactos al km** |
| 4 | la Luna sale en Albacete a las 20:53 del 28 de agosto | y depende de las coordenadas de la §5 | ✔ |
| 5 | el 9 de enero de 2026 no hay salida, y aun así hay Luna | `salida: null` con motivo, iluminación con normalidad | ✔ |
| 6 | en 2026 hay un día civil sin salida por lunación | trece en el año | ✔ |
| 7 | la misma luna nueva cae en días distintos según dónde estés | 11 sep en Madrid, 10 sep en Quito | ✔ |
| 8 | el día de 23 h y el de 25 h de 2026 | 29 mar y 25 oct, exacto | ✔ |
| 9 | el ratio Sol:Luna del forzamiento de marea es 0,46 | | ✔ **0,4592** |
| 10 | los órdenes de magnitud: 110 µGal la Luna, 50 el Sol | | ✔ **109,98 y 50,51** |
| 11 | entre perigeo y apogeo el forzamiento varía un 32 % | | ✔ **1,3225** |
| 12 | la envolvente sicigia/cuadratura a distancia media es 2,7 | del modelo de equilibrio, no de un mareógrafo | ✔ **2,699** |
| 13 | la instantánea se mueve mucho más en un día que la mensual | la separación de los dos campos de la 0013 | ✔ |
| 14 | la marea se calcula en el instante exacto, no al mediodía | | ✔ |
| 15 | cada día lunar lleva su propia duración, y no se parecen | sesenta días seguidos, y falla si hay menos de cuarenta duraciones distintas: eso olería a constante | ✔ |
| 16 | el día lunar más corto y el más largo se llevan casi una hora | | ✔ |

Las dos últimas existen porque Ana dijo *«nada de medias, cada día se pone la
duración del día lunar»*, y están ahí para que nadie meta una constante de
24,85 h el día que le venga bien para cuadrar una rejilla.

**Y una que se retira:** ~~noches sin Luna en 2026, 63 ± 2~~. Desarrollado abajo.

#### La fila de las 63 noches: retirada, pendiente de revisar

La v4 pedía «noches sin Luna en Albacete en 2026: 63 ± 2». **No se puede convertir
en prueba, porque la fila nunca dijo qué es una noche.** Contando las noches en
que la Luna está bajo el horizonte durante todo el intervalo:

| Definición de noche | Noches sin Luna en 2026 |
|---|---|
| Astronómica, Sol bajo −18° | **59** |
| Náutica, Sol bajo −12° | 45 |
| Civil, Sol bajo −6° | 25 |
| De puesta a salida de Sol | 10 |

Ninguna da 63, y la más permisiva de las cuatro —59— se queda fuera de la
tolerancia. No es el motor: las otras doce salen y dos de ellas al kilómetro
exacto. **Es una cifra que se escribió sin método**, que es precisamente lo que
`03-registro-de-datos.md` existe para impedir.

**Se propone sustituirla por «59, con noche astronómica». No se aplica todavía:**
queda pendiente de revisar (`01-pendiente.md` 24), y mientras tanto esa fila no es
una prueba y no está en `luna.test.mjs`.

### De arquitectura — pendientes

- Sin red, Kp/clima/aire devuelven `"sin_conexion"`, nunca 0.
- Con `prefers-reduced-motion`, ninguna animación en ninguna pantalla.
- Un campo ausente se guarda como `null`, no como 0.

### Punto ciego conocido

Las 49 pruebas cubren catálogo, filtro, vocabulario, empaquetado y astronomía.
**No cubren `js/registro-practica.js` ni `js/compas.js`**, que tocan el DOM y
corren solo en navegador. Ahí han salido seis de los ocho fallos del proyecto
(§16). Se asume a sabiendas: montar un navegador de pruebas sería más andamiaje
que app.

La contramedida que sí se toma es **sacar la aritmética del navegador**. La cuenta
de «segundos × lados» y el texto de las duraciones viven en `seleccion.js`, que es
puro y tiene pruebas, y `compas.js` los importa en vez de repetirlos. Lo que no se
puede probar, al menos que sea lo mínimo.

Pendiente de la misma familia: **sacar la construcción del registro a una función
pura** (`01-pendiente.md` 16), para que una prueba dorada compruebe que están todos
los campos del esquema. Es lo que habría cogido el fallo de `zona`.

---

## 9. Fases de construcción

**Fase 0 — Mi registro, instalado, sin red. `EN USO DESDE EL 21 DE AGOSTO.`**

- **(a) La pantalla. `CONSTRUIDA.`**
- **(b) El catálogo, conectado. `HECHO EL 21.`** 100 prácticas, filtro y pruebas.
  Estuvo escrito y probado varios días **sin que `index.html` lo importara**: las
  pruebas pasaban en verde sobre un módulo que la app no ejecutaba. Lo destapó un
  `grep`, no una prueba.
- **(c) Instalable en el móvil. `INSTALADA Y FUNCIONANDO.`** Verificado en avión.
- **(d) La portada. `HECHA EL 22.`**
- **(e) El Compás integrado. `HECHO EL 22.`** Dos modos, 37 prácticas.
- **(f) El arreglo de `zona`. `HECHO EL 22`, se despliega el 28.**

**Lo que falta de la Fase 0:**

- La pantalla resumen (§2 y §6).
- Reequilibrar `conectar` y `salir` (§14). Se decide después de los ocho días.

**Criterio de aceptación: ocho días seguidos de uso.** Empezó el 21 de agosto a
las 20:44. **Si esto no resulta útil ocho días seguidos, no hay fase siguiente que
lo arregle.**

**Fase 1 — Luna, local, sin red. `EL CÁLCULO ESTÁ HECHO; FALTA LA PANTALLA.`**

`app/js/luna.js` existe, está empaquetado, precacheado y cubierto por dieciséis
pruebas. Da fase, iluminación, distancia real, salida y puesta con su hueco
declarado, la duración de cada día lunar, y los dos campos de marea en µGal.

**Lo que no existe es dónde enseñarlo.** El contexto medible es Fase 2 y la
pantalla resumen está sin decidir. Los ficheros van listos y no enseñan nada hasta
que haya sitio. Ana, el 22 de agosto: «vamos a esperar, aún no tengo claro cómo
quiero que sea la pantalla del contexto medible».

Incluye **el recálculo hacia atrás**: recorrer los registros ya acumulados y
añadirles el dato lunar de su `timestamp`. Se puede porque la efeméride de una
fecha pasada se calcula igual de bien que la de hoy. Y **no necesita `zona`**: el
`timestamp` es un instante absoluto y no hace falta zona para convertirlo en
cielo. Por eso el fallo de `zona` pesa menos de lo que parecía.

**Fase 2 — El contexto medible completo,** con Luna real y el resto en "no
activado". Gramática visual (§6) y accesibilidad (§7) antes de añadir más datos.

**Fase 3 — Fuentes externas, una a una.** Open-Meteo → Kp → polen, si se resuelve
lo del raspado.

**Fase 4 — Memoria personal, con umbrales de evidencia.** Sin patrón (<14 días) →
señal inicial (14–27 días, 6+ comparables) → patrón provisional (28+ días, 8+ por
grupo). Nunca antes. Aquí es donde el campo `origen` del catálogo empieza a servir.
El marco de qué querría decir «sincronizado», y las trampas que habría que sortear,
está escrito aparte en `docs/07-sincronizacion-y-ciclos.md`.

**Fase 5 — Empaquetado APK.** Solo cuando 0–3 se usen de verdad. Keystore propio
guardado en dos sitios fuera del repositorio. Tamaño esperado 4–6 MB,
**estimación que hay que medir**, no dar por buena.

**El calendario** encaja después de la Fase 1 y ya no es un bloque abierto: la
decisión 0012 lo cierra en lo estructural (§18).

---

## 10. Lo que NO se hace, bajo ningún argumento

- Nada de índice de sincronización ni fórmula que mezcle autoinforme con datos externos.
- Nada de predicción de fertilidad, ciclo menstrual ni contenido médico.
- Nada de rachas, medallas ni lenguaje de éxito/fracaso. **Un registro que falta
  no es un fallo: es un dato.**
- Nada de movimiento continuo por defecto, en ninguna pantalla.
- Nada de backend, cuentas ni analítica.
- Nada de "energía lunar" como etiqueta: el nombre es **"forzamiento de marea
  relativo"**. Ni "aura": ver §6.
- **Ninguna práctica promete resultado.** Y ningún mensaje del Compás felicita,
  promete ni pregunta.
- **Ninguna pauta de `repeticiones` lleva temporizador.** No tiene segundos que
  contar y dárselos sería inventar un dato (§15).
- **El campo `evidencia` no se muestra nunca en pantalla.**
- **Las tradiciones entran como `origen`, nunca como explicación.**
- **No se transcriben coreografías con autor.**
- **No se raspa una web para fingir que hay una API.**
- **El service worker no guarda nada de otro origen** (§3).
- **Ninguna ruta absoluta** en manifest, worker o HTML (decisión 0006).
- **El manifest no declara categoría `health`.**
- **Nada de duraciones medias en el calendario.** Cada día lunar lleva la suya,
  calculada de sus dos salidas reales. Las medias que hay en
  `03-registro-de-datos.md` son descriptivas y no entran en ningún cálculo.
- **La app no puede decir ni insinuar que la fase en que naciste explique algo de
  cómo estás hoy.** Anclar el calendario al nacimiento es una convención de
  numeración, como contar desde la Hégira. Elegir un origen no afirma que ese
  origen influya en nada, y en el momento en que lo afirmara dejaría de ser una
  convención para ser una causa que ningún dato sostiene.

> **«En ningún momento busco influir, quiero que nos preguntemos qué es lo que
> realmente nos influye.»** — Ana, 22 de agosto de 2026

---

## 11. Estructura del repositorio

```
umbral/
├── README.md · .gitignore          el keystore NUNCA entra
├── .nojekyll                       sin esto, Pages descarta ficheros con "_"
├── docs/
│   ├── 00-hoja-de-ruta.md             este documento
│   ├── 03-registro-de-datos.md        toda constante, antes de tocar el código
│   ├── 01-pendiente.md                lo que NO se ha decidido
│   ├── decisiones/                 0001 zona · 0002 color · 0003 serif
│   │                               0004 catálogo · 0005 paleta del logo
│   │                               0006 instalación · 0007 el nombre
│   │                               0008 el Compás · 0009 el hueco de zona
│   │                               0010 el Compás integrado
│   │                               0011 pantallas y portada
│   │                               0012 el calendario personal
│   │                               0013 el forzamiento de marea
│   ├── 04-formas-de-dividir.md        el esquema del dominio: ceros y trozos
│   ├── 05-fuentes-tradiciones.md      de dónde sale cada convención
│   ├── 02-inventario-de-datos.md      qué entra, qué se recalcula, qué no
│   ├── 06-tradiciones-lunares.md      inventario razonado, sin decidir nada
│   └── 07-sincronizacion-y-ciclos.md  qué querría decir "sincronizado"
├── app/                            se publica tal cual, cero compilación · 347 KB
│   ├── index.html                  estilos y lógica del formulario dentro
│   ├── manifest.webmanifest
│   ├── sw.js                       nunca se precachea a sí mismo
│   ├── contenido/practicas.json
│   ├── js/seleccion.js             filtro puro y aritmética de pautas
│   ├── js/registro-practica.js     pegamento filtro ↔ DOM, sin pruebas (§8)
│   ├── js/compas.js                el Compás, con sus estilos dentro
│   ├── js/luna.js                  Fase 1: efemérides y marea
│   ├── js/vendor/                  astronomy.browser.min.js + su licencia
│   ├── fuentes/                    cormorant 500 y cursiva + OFL.txt
│   ├── iconos/                     32 · 180 · 192 · 512 · maskable-512
│   └── imagenes/portada-720.webp
├── datos/crudo/ · datos/derivado/
├── pruebas/                        precache · seleccion · vocabulario · luna
└── herramientas/                   fuera de app/: no debe cachearlo el worker
    ├── cobertura.mjs               mide el catálogo, no decide nada
    ├── temporizador-respiracion.html   integrado · pendiente de retirar
    └── portada.html                    integrado · guarda las 3 frases descartadas
```

En `app/js/` puede haber además un `README.md` y una carpeta `externas/`: la
prueba de precache los tolera (ver §8) y no llegan al service worker.

`docs/`, `datos/`, `pruebas/` y `herramientas/` quedan **fuera del alcance** del
service worker por estar fuera de `app/`. No es una precaución: es geometría de la
carpeta, que es la clase de garantía que no se olvida.

**Los estilos del Compás viven dentro de `compas.js`** y se inyectan al abrirlo.
La app no tiene `css/tokens.css` —las variables están en `index.html`— y partirlo
en dos ficheros añadiría otra entrada que mantener a mano en `PRECACHE` sin ganar
nada.

---

## 12. Lo obsoleto — qué se retira

### `parche-hoja-de-ruta.md` — **se borra con esta versión**

Está absorbido entero aquí. Su única razón de ser era no reescribir la v4.

### `herramientas/temporizador-respiracion.html` y `herramientas/portada.html`

Los dos prototipos **están integrados** y ya no son la fuente de verdad. Se
retiran, pero no todavía: `portada.html` guarda las **tres frases descartadas** de
la portada, por si el uso diario cansa a la elegida, y hay que decidir dónde viven
antes de borrarlo (`01-pendiente.md` 29).

Del prototipo del Compás se sacaron al integrarlo **las dos fuentes incrustadas en
base64**: eran 37 KB de un fichero de 56, y en `app/` la tipografía ya está en
`fuentes/`.

### `docs/hojaderutaapk.md` — **se borra**

Es de la etapa anterior y contradice este documento en dos puntos: numera el APK
como Fase 4 cuando aquí es la 5, y **describe otro producto** — su Fase 0 respondía
a *"¿se va a ver la Luna esta noche desde Albacete?"*, y la §1 la sustituyó por
*"¿Cómo estás ahora?"*. No es un cambio de énfasis: es otra app.

**Antes de borrarlo hay que rescatar cuatro cosas a `03-registro-de-datos.md`:**

1. Las mediciones de astronomy-engine v2.1.19 *(hechas: las de tamaño están
   remedidas y fichadas en §3; faltan las de rendimiento)*.
2. **La validación cruzada** contra PyEphem 4.2.1 (ELP2000-82B) y contra una
   implementación propia de Meeus cap. 49, con las cuatro diferencias medidas
   (45 s, 33 s, 39 s, 28 s).
3. **La nota de honestidad:** la librería aproxima UT1 y UTC como si fueran lo
   mismo, y de ahí salen esos ~40 s. Es irrelevante para un calendario y **debe
   decirse en la pantalla de "cómo se calcula esto"**, no ocultarse.
4. **El calendario de verificación de desarrollador de Android.** Relevante solo
   para la Fase 5, y **es información con fecha de caducidad**: verificarla de
   nuevo antes de usarla.

### La palabra "aura" — **retirada del documento y del código**

### Los originales PNG de marca — **no entran en `app/`**

Pesan 5,8 MB y 2,3 MB. En `app/` van los derivados. Viven en `datos/crudo/`.

### `imagenes/portada-1200.webp` — **generada, no empaquetada**

Vive en `datos/derivado/`. 125 KB por una imagen decorativa en una app que tiene
que abrir sin cobertura no se pagan solos. Se decide con los ojos después del 28
(`01-pendiente.md` 11).

### Lo que **NO** es obsoleto, aunque lo parezca

- **`Plan de observación local en Albacete — primer año`.** Sigue vigente, pero es
  **otro proyecto**: un piloto de campo de doce meses, con otra pregunta y otro
  método. Como mucho alimenta la Fase 4 dentro de un año.
- **Los tres informes en PDF.** Son las fuentes de las que salieron estas
  decisiones. No se borran; se citan.

---

## 13. Lo siguiente

**Lo primero, y no es código: abrirla.** Tres registros al día, en el móvil y
siempre en el móvil — el portátil tiene su propia IndexedDB y los registros no se
ven entre sí.

Lo que hace útil la serie no es el número de registros: es que sean
**comparables**. Comparar las 9:00 con las 9:00 dice algo; las 9:00 con las 18:00
no dice nada, y la Fase 4 no encontrará nada si cada día se registra a una hora
distinta.

**Si un día se salta uno, no se recupera.** El hueco es dato. Perseguirlo sería una
racha disfrazada, y la §10 las prohíbe.

**El día 8 cae el 27 de agosto,** y la Luna llena es el 28 a las 04:19 UTC — la
noche del 27 al 28, con salida por Albacete a las 20:53 local. La prueba cierra
bajo la llena sin haberlo planificado.

**Lo que hay que mirar en el móvil el 28**, y que no se puede mirar en un portátil:

- Los iconos en la pantalla de inicio y el arranque del sistema (`01-pendiente.md` 18).
- **El sonido del Compás en un altavoz de móvil**, que no se parece al de un
  portátil. La afinación no se cierra hasta entonces (`01-pendiente.md` 9).
- **Si la capa completa funciona con el pulgar** (`01-pendiente.md` 22). La 0010 lo
  dejó marcado como prueba, no como decisión firme.

**Y sin bloquear nada:** leer las cien frases del catálogo del tirón, de noche y en
el móvil. Están escritas de una sentada y eso siempre se nota.

---

## 14. Cobertura real del catálogo

`node herramientas/cobertura.mjs` recorre las ocho necesidades contra 200
combinaciones de energía × activación × dolor × hora. **Ninguna necesidad se queda
nunca sin nada que ofrecer: 0 % de contextos vacíos en las ocho.** Reejecutado el
22 de agosto tras tocar el filtro: no ha cambiado nada.

| Necesidad | Total | Coste 1 | Peor caso |
|---|---|---|---|
| pausar | 41 | 32 | 30 |
| moverme | 34 | 21 | 19 |
| no_lo_se | 28 | 27 | 24 |
| bajar_estimulos | 24 | 23 | 22 |
| descansar | 19 | 10 | 10 |
| enfocarme | 15 | 14 | 14 |
| **salir** | **10** | **3** | **3** |
| **conectar** | **8** | **5** | **4** |

*Peor caso = energía 1, activación 5, con dolor, 23 h. El techo baja a 1.*

**`conectar` tiene 8 prácticas y `pausar` 41.** Cinco veces menos para la necesidad
que más cuesta cubrir, porque es la única de las ocho que implica a otra persona.
Que sea la más difícil de escribir explica el número, pero no lo justifica: quien
abre la app buscando compañía recibe menos opciones que quien busca parar.

**`salir` tiene 3 prácticas de coste 1**, y las tres —cambiar de habitación, abrir
la ventana, quitarse los calcetines— no son salir. Puede ser correcto: agotada y a
las once de la noche, la versión honesta de *salir* es cruzar un umbral pequeño.
Pero está sin decidir si es diseño o si es un hueco.

**Qué hacer con esto: nada todavía.** Ampliar `conectar` sin haber usado la app
sería escribir a ciegas justo la categoría más delicada. → `01-pendiente.md` 17.

---

## 15. El Compás: marca turnos, no duración

**El temporizador se llama el Compás** (decisión 0008): en música el compás no mide
cuánto dura algo, marca los tiempos y ordena las entradas. **En el código el nombre
técnico sigue siendo `temporizador`**, para que dentro de un año se pueda leer sin
conocer la marca.

El Compás **no existe para cronometrar**: existe para avisar de un cambio de turno
sin tener que mirar la pantalla.

| Tipo de pauta | Cuántas | ¿Abre? | Por qué |
|---|---|---|---|
| `respiracion` | 3 | **Sí** | cada inspiración y cada exhalación es un turno |
| `duracion` con `lados` | 6 | **Sí** | hay un cambio en mitad |
| `duracion` sin `lados` | 28 | **Sí** | un turno: cuándo parar |
| `repeticiones` | 21 | **No** | no hay ningún número de segundos que contar |
| sin pauta | 42 | No | |

**Abre en 37 de 100, no en 3.** Esto corrige la v4, que solo contemplaba
`respiracion`, y es doce veces más presencia en pantalla — por eso la decisión 0010
tuvo que replantear qué es el Compás.

### Dos modos declarados, no uno degradado

**Modo respiración** (3 prácticas): el instrumento entero. Acorde fijo en La, solo
octavas y quintas **sin tercera** —así no empuja hacia ninguna emoción y aguanta
sesenta repeticiones sin cansar—, bordón grave, filtro paso bajo que abre de 320 a
1750 Hz al inspirar y cierra al exhalar, reverberación de convolución fabricada al
vuelo con ruido que decae, campana de parciales inarmónicos en cada giro, y onda
dibujada con la misma media coseno que el filtro.

**Modo duración** (34 prácticas): **sin bordón y sin sonido continuo. Solo
campanas.** Y un anillo con la cuenta atrás dentro. Un bordón que suena cuando no
hay aliento deja de significar «esto va con tu aliento», y un bordón de diez
minutos sería lo contrario de bajar estímulos.

### Las campanas

| Momento | Nota | Hz | Cola |
|---|---|---|---|
| Inspirar | Mi5 | 659,25 | 1,0 |
| Exhalar | La4 | 440 | 1,0 |
| Cambio de lado | La4 | 440 | 1,0 |
| Empezar, en modo duración | **Mi4** | **329,63** | 1,0 |
| Final | La3 | 220 | **1,6** |

El problema de la campana de empezar no era elegir una nota bonita: era de
cardinalidad. Tres turnos que distinguir y solo dos alturas asignadas, dentro de un
acorde que tiene exactamente dos clases de altura. **La octava es el intervalo que
el oído funde**, así que La4 y La3 —girar y parar— eran ya el par más confundible;
meter el arranque también en la familia La habría dado tres campanas de la misma
nota en tres octavas, que es un patrón de aviso.

Mi4 está a quinta justa de La3 y a cuarta justa de La4, no sale del acorde, y deja
un contorno que cierra: **abre a media altura, sube una cuarta en el giro, y cae a
la fundamental del bordón.** La cola 1,6 veces más larga del final es el segundo
canal de distinción, para no depender solo de la altura.

**Provisional a propósito** hasta oírlo en un móvil (`01-pendiente.md` 9).

### Lo demás que fija la decisión 0010

- **El sonido arranca apagado**, cada vez que se abre. Invierte el prototipo. El
  ejercicio se empieza mirando la pantalla, y el sonido entra cuando ella quiere.
- **Vive en una capa completa**, con el foco atrapado y `Escape` para cerrar. Si se
  desplegara en línea empujaría el botón de Guardar fuera de la pantalla.
- **Al terminar no pregunta nada y no se cierra sola.** Cierra la persona.
- Los dos textos de cierre: **«Se ha terminado el tiempo, no tú.»** al llegar al
  final, y **«Cuando quieras.»** cuando paras tú. Ninguno felicita, promete ni
  pregunta. Riesgo asumido y escrito: el primero es una frase con ingenio, y el
  ingenio cansa; si cansa, son dos constantes en la cabecera de `compas.js`.
- **No se añade vibración.** Es un canal nuevo con sus propias implicaciones y
  necesitaría su propia decisión.
- **Si el navegador no da `AudioContext`, funciona igual y en silencio**, contando
  con `performance.now()`. No hay sonido, que es una carencia real, pero los turnos
  y la cuenta atrás siguen siendo ciertos.

---

## 16. Los fallos encontrados usándola

Se escriben todos porque el patrón importa más que cada uno: **seis de los ocho
salieron entre el módulo probado y la pantalla**, que es exactamente el punto ciego
de la §8.

| # | Qué | Lo encontró |
|---|---|---|
| 1 | El catálogo estaba escrito, probado y **sin importar** desde `index.html` | un `grep` |
| 2 | «Hoy no» guardaba un booleano y silenciaba **todas** las necesidades | usarla |
| 3 | `concentrarme` en la pantalla contra `enfocarme` en el catálogo | usarla |
| 4 | `zona` se calculaba, se enseñaba y **no se escribía** | leer el código |
| 5 | `segundos / 60` escribía **«1.5 min»** en la única práctica de 90 s | escribir una prueba |
| 6 | Los cinco iconos llevaban dentro un rectángulo del nocturno retirado | medirlos |
| 7 | Con el Compás en marcha se quedaba «Listo» en pantalla | una captura |
| 8 | Encender la onda o el anillo **movía todo lo de abajo** | usarla |

**El 3 es el más instructivo.** Los dos lados estaban bien por separado —quince
prácticas de `enfocarme`, un botón perfectamente pintado— y el filtro comparaba dos
palabras que no coincidían. Ese botón no ofreció nada nunca. Ninguna prueba podía
cogerlo: las del catálogo leen el catálogo, y `cobertura.mjs` saca las necesidades
del catálogo también. **Nadie miraba la pantalla.** De ahí salieron las cinco
pruebas de vocabulario.

**El 5 llevaba ahí desde el principio** y nadie lo vio porque `mano_pecho_barriga`
es la única práctica del catálogo con una duración que no es múltiplo de 60. Un
punto decimal inglés en una app que solo habla español.

**El 6 lo dejó pasar la quinta prueba dorada** sin despeinarse, porque compara
`manifest`, `sw.js` y el CSS —tres ficheros de texto— y no mira dentro de ninguna
imagen. El dibujo estaba sobre un rectángulo de `#040618`, el nocturno que la §2
declaraba antes de que los tokens pasaran a `#0A0E19`. Contraste entre los dos:
**1,043 : 1** — casi nada, y por eso peor de lo que parece: no se lee como un
fallo, se lee como un canto tenue rodeando el dibujo, justo lo que se nota en una
pantalla OLED a oscuras. Corregido repintando, sin volver a renderizar, y **de paso
los cinco iconos pesan 89 KB menos**: 134 KB entre los cinco pasan a 43.

**El 7 y el 8 son la misma lección en dos formas.** El 7: usé la cadena vacía como
«todavía no he pintado nada», y resulta que en duración sin lados **la palabra
correcta es la cadena vacía**, así que la comparación decía «no ha cambiado». El 8:
la onda medía el ancho entero de la columna y su versión quieta 170 px, así que el
conmutador de movimiento hacía saltar todo lo de abajo. Los dos los encontró Ana
mirando, no una prueba.

---

## 17. Ventanas de prueba

Las pruebas de uso no son continuas: van en ventanas cerradas, con la app congelada
dentro de cada una. Comparar dos semanas solo significa algo si dentro de cada una
no ha cambiado nada.

### Ventana 1 — del 21 al 27 de agosto

**Tres anclas diarias:**

| Hora | Qué franja del catálogo abre |
|---|---|
| 10:30 | `mejor_manana` — solo alcanzable antes de las 12 |
| 15:30 | `solo_dia` |
| 23:00 | solo `cualquiera`: `esNoche` marca a las 22 y el techo baja a 2 |

No fue buscado y conviene saberlo: **las tres anclas recorren el catálogo entero.**
Si el ancla matinal estuviese a las 12:30, las prácticas `mejor_manana` quedarían
escritas y muertas sin que nada avisara.

**Lo que esta ventana no ve: de 18:00 a 22:00.** Ahí el filtro sigue considerando
que es de día y no baja el techo, pero es cuando más probable es estar cansada.
**Esta ventana no se toca por eso.**

### La congelación

**Durante una ventana no se despliega nada, salvo que sea grave.** Grave es una
lista corta, y solo esta:

- se pierden o se corrompen registros
- la app no abre, o no abre sin red
- una necesidad no ofrece nada nunca (el fallo 3 de la §16)
- una regla de protección no se dispara — por ejemplo, que el techo de coste dejara
  de bajar con dolor

**No es grave:** ningún texto, ninguna imagen, ninguna función nueva, ni la
portada, ni el Compás. **Ni el fallo de `zona`**, que es el caso que hubo que
juzgar: los registros se guardan enteros y se leen enteros, y lo que falta es un
campo que el recálculo de la Fase 1 no necesita.

**Cómo se sostiene: `commit` no publica, `push` sí.**

```bash
git add -A
git commit -m "lo que sea"     # no toca GitHub, ni Pages, ni el móvil
```

Durante la ventana se commitea con normalidad y **no se hace `push`**. El día que
cierra la ventana, un solo `push` sube todo junto. **No hacen falta ramas**: la
rama resolvía un problema que no existe. Y **no vale "no tocar git"**: ocho días de
cambios sin un commit son un bloque indivisible. El historial es gratis; publicar
es lo que cuesta.

**Consecuencia aceptada expresamente:** todo lo construido el 22 de agosto —la
portada, el Compás, la rosa, `zona`, la Fase 1— **se probó solo en el portátil**, y
el Compás no suena en un móvil hasta el 28. No se pidió excepción.

### Ventana 2 — a partir del 28 de agosto

Se abre con **todas las mejoras a la vez**. Contenido cerrado:

- El Compás integrado, con sus dos modos
- La pantalla de portada
- La rosa junto al nombre
- El arreglo de `zona`
- Los cinco iconos corregidos
- `VERSION` de `sw.js` en `'2026-08-22d'`
- `compas.js`, `luna.js` y `js/vendor/` en `PRECACHE`

**No entra:** la pantalla resumen. Ana: «si da tiempo antes del 28 lo hacemos», y
no lo hay. Se hace entera y bien después.

**Entra sin enseñarse:** `luna.js` y el motor astronómico. Son 128 KB de código que
todavía no pinta nada, y se despliegan igualmente para que el día que exista la
pantalla funcione sin red desde el primer momento.

**Anclas nuevas, con la franja que falta:** hay que meter un registro entre las
18:00 y las 22:00. Las horas exactas se fijan el 27, con la experiencia de la
ventana 1 delante y no antes.

**Cuánto dura: sin decidir.** El criterio es *lo que haga falta para probar la
app*, no una cifra redonda ni una fase de la Luna. Como referencia para ese día, y
solo como referencia: del 28 de agosto al 11 de septiembre hay 13,96 días, de la
llena a la nueva exacta. Es una coincidencia bonita y no es un motivo para
elegirla.

### La Luna no necesita ventanas: se calcula hacia atrás

astronomy-engine calcula fase, iluminación, salida, puesta y distancia de
**cualquier fecha pasada**, sin red y sin haberla mirado en su momento. **Los
registros de estas semanas ya están recogiendo datos lunares aunque la app no
muestre la Luna todavía.** El cielo de esos días se reconstruye entero cuando toque.

**Las ventanas se diseñan para probar la app. La Luna se resuelve en Fase 1,
mirando hacia atrás.**

### El sesgo que hay que tener en cuenta al comparar dos ventanas

La ventana 1 va del cuarto creciente a la llena, y la ventana 2 arranca en
menguante. **Cualquier diferencia entre las dos puede ser la app nueva, las horas
nuevas o la fase lunar, y no hay forma de separarlas.** No es un error de
planificación, pero sí una razón para no leer la comparación como si dijera algo
sobre la Luna.

Y los umbrales de la Fase 4 dicen lo mismo: 28+ días y 8+ registros comparables por
grupo antes de hablar de patrón provisional. Ninguna ventana corta llega ahí. **Eso
no es un problema: es la regla haciendo su trabajo.**

### Lo que no cambia en ninguna ventana

**No hay rachas.** Si suena una alarma y no apetece, la respuesta correcta es no
hacerlo. **Un registro que falta no es un fallo: es un dato**, y probablemente de
los que más dicen. Las alarmas son un recordatorio, no una citación.

---

## 18. El calendario lunar personal

*El bloque abierto de la v4 queda cerrado en lo estructural por la **decisión
0012**. Aquí va el resumen; el razonamiento entero está allí.*

Una pantalla propia, **a continuación del cuestionario**. No sustituye al
calendario normal: es complementario. Y es **personal**: no hay una época
compartida por todo el mundo.

| Pregunta que la v4 dejaba abierta | Respuesta |
|---|---|
| ¿Qué es? | Pantalla propia, complementaria |
| ¿Otras tradiciones? | Las tres familias. Inventario en `docs/06-tradiciones-lunares.md` |
| ¿Idioma? | **Solo español.** No hay internacionalización ni está prevista |
| ¿Se cruzan calendario y registros? | **No.** Comparten pantalla y cada uno conserva su reloj |

### La unidad: el día lunar

**De una salida de la Luna a la siguiente.** No de la salida a la puesta: eso no es
un día, es un periodo de visibilidad, y deja fuera todas las horas en que la Luna
está bajo el horizonte.

Medido en Albacete sobre 2026: **media de 24 h 51 min, mínimo 24 h 22 min, máximo
25 h 20 min**. Casi una hora de diferencia entre el más corto y el más largo del
año, porque depende de la declinación de la Luna y de la latitud.

**Cada día lunar se dibuja con su duración real, nunca con una media.** Una rejilla
que los dibuje todos igual de anchos está mintiendo casi una hora.

Y caben **28,52 días lunares por lunación**. No es entero y nunca lo será: es
exactamente el problema que llevan resolviendo todos los calendarios lunisolares
desde Babilonia (`01-pendiente.md` 13).

### Los días sin salida

**Trece días civiles de 2026 no tienen salida de Luna en Albacete**, uno por
lunación, empezando por el 9 de enero. Es geometría, no un fallo: como cada salida
se retrasa unos cincuenta minutos, en algún momento del mes cruza la medianoche.

**Un día sin salida no es un día sin Luna.** La Luna sigue ahí, sigue iluminada
—puede estar al 80 %— y sigue tirando igual. Lo que no ocurre ese día civil es *el
suceso*. Por eso `salida_luna` vuelve como `null` **con el motivo declarado**, y la
iluminación y las dos mareas se calculan con normalidad. Poner la iluminación a
cero sería escribir un dato falso, que es peor que no tenerlo.

### La época: la última salida antes de nacer

**La época de cada persona es la última salida de la Luna anterior al instante de
su nacimiento**, calculada en las coordenadas de su lugar de nacimiento. «La última
anterior» y no «la más cercana»: así el nacimiento cae *dentro* del día lunar 1 y no
hace falta ninguna regla de desempate.

**No se deriva nunca de los registros.** Si dependiera del primer `checkin`,
borrarlo desplazaría el calendario entero.

Quien no sepa su hora exacta elige una franja, y **no se supone nada, se calcula**:
como la salida cae dentro de una franja de seis horas aproximadamente una de cada
cuatro veces, las otras tres la época es **exacta aunque no se sepa la hora**, y no
se avisa de nada porque no hay nada de lo que avisar. Cuando sí es ambigua, se
guarda como aproximada y se dice **una sola vez**. Y el error no crece: es un
desplazamiento fijo, no una deriva.

**Sigue pendiente el dato de entrada**, no el método: el cálculo está escrito y
funciona (`01-pendiente.md` 26, que depende del 20 — cómo se pide el perfil de
nacimiento sin que parezca un formulario de registro).

### El año y la lunación

**El año es la vuelta al Sol desde el nacimiento**, de un cumpleaños astronómico al
siguiente. Se descartaron el año de 12 lunaciones —se desliza 11 días cada vez— y
el de 12 con un decimotercero intercalado, que exige una regla **inventada por
humanos**. **La vuelta al Sol no pide ninguna convención: solo pide cielo.** Que
unos años quepan doce lunaciones y otros trece no es un desajuste que cuadrar: es
el dato. Y los años del calendario **son los años de vida de la persona**.

En pantalla va `LUNACIÓN 4 · DÍA 12`. **El año no se muestra**: coincide con la
edad, y decirle a alguien su edad cada vez que abre la app es decirle algo que ya
sabe.

### Lo que falta antes de escribir el calendario

1. La época concreta *(falta el perfil)*.
2. ~~Coordenadas de Albacete con fuente citable~~ → **hecho** (§5).
3. ~~La duración real medida del día lunar~~ → **hecho**.
4. ~~La forma exacta de detectar los días sin salida~~ → **hecho**.
5. Qué se dibuja cuando una fecha de la familia observacional no se puede calcular
   sin que alguien mire el cielo (`01-pendiente.md` 14).
6. **Verificar la bibliografía de `docs/06-tradiciones-lunares.md` edición por
   edición** antes de publicarla dentro de la app (`01-pendiente.md` 15). Ese
   documento lo avisa de sí mismo: las referencias están citadas de memoria y son
   una guía de dónde mirar, no una cita comprobada. La regla 0.1 vale igual para
   una edición que para un número. La app no puede dar esa fecha
   sin inventarla; lo honesto es decir que la decide un observador.

---

## 19. La Fase 1, ya calculada

Todo esto se midió el 22 de agosto con astronomy-engine 2.1.19 y está fichado con
método y fecha en `03-registro-de-datos.md`. Se resume aquí porque cambia lo que la §5
llamaba «listo para Fase 1»: ya no está listo, está hecho.

### Por qué la marea va con 1/r³

La atracción de un cuerpo va con M/r², y **esa fuerza no produce ninguna marea**:
si tirase igual de todo, la Tierra se movería junta y aquí no se notaría nada. La
marea es la *diferencia* entre lo que tira del lado cercano y del lejano, y al
restar dos valores de 1/r² muy próximos queda **1/r³**.

**Consecuencia: en la marea la distancia pesa mucho más que la masa.** El Sol tiene
27 millones de veces la masa de la Luna, pero está 390 veces más lejos, y 390³ son
59 millones. 27 ÷ 59 = **0,46**. El número no hay que creérselo por autoridad: sale
de dividir dos cifras comprobables, y la cita de la NOAA **confirma** un cálculo, no
lo sustituye.

### Los dos campos, y por qué son dos

| Campo | Qué responde | Cómo se comporta |
|---|---|---|
| `marea_mensual` | ¿En qué punto del ciclo estaba? | **Varía un 0,16 % entre las 08:30 y las 21:00 del mismo día** |
| `marea_instantanea` | ¿Cuánto tiraba de ti en ese segundo? | **Pasa por exactamente dos máximos al día** |

Los dos llevan el término solar; lo que los separa es **la rotación de la Tierra**,
no el Sol. Es tentador definir la mensual como «solo la distancia lunar», pero
entonces no contendría el efecto de la fase — y la envolvente sicigia/cuadratura de
2,7 es precisamente un efecto de fase.

**Se muestra en µGal**, la unidad de verdad. Nada de normalizar a 0–1 —el 1,0
dependería de qué año se tome de referencia— ni a media 1,00, que esconde la
magnitud.

**Distancia real siempre, nunca la media.** Entre perigeo y apogeo hay solo un 10 %
de diferencia, pero al cubo son un **32 %**, y usar la media borraría ese 32 % sin
que nada avisara. Se ve en los números: la luna nueva del 12 de agosto da 175,0 µGal
y la llena del 28 da 154,0, **siendo las dos sicigia**. La diferencia es la
distancia.

**Se calcula en el `timestamp` exacto**, nunca al mediodía local: el mediodía sería
un instante inventado, y entre las 10:30 y las 23:00 la Luna ha cruzado medio cielo.

**Es un modelo de Tierra rígida**, sin números de Love ni carga oceánica. Un
gravímetro real mediría algo parecido y no idéntico, **y eso hay que decirlo si el
número aparece alguna vez en pantalla**.

### La comprobación que más vale

El 2,7 sale por dos caminos que no comparten ni las constantes ni las unidades
—uno parte de GM y distancias, el otro de dos amplitudes en metros— y dan **2,699 y
2,692**. Eso es coherencia interna, no una cita repetida.

---

## 20. Estado a 22 de agosto de 2026

| | |
|---|---|
| Decisiones cerradas | 13 (`0001`–`0013`) |
| Pendientes abiertos | 23 |
| Pruebas doradas | **49, todas en verde** |
| Peso de `app/` | 347 KB |
| `VERSION` de `sw.js` | `'2026-08-22d'` |
| Fase 0 | en uso desde el 21 · falta la pantalla resumen |
| Fase 1 | calculada y probada · falta dónde enseñarla |
| Próximo despliegue | 28 de agosto, cierre de la ventana 1 |

**Lo que queda por hacer antes del 28**, y es poco: `touch .nojekyll` si no está,
borrar `app/banco-compas.html` si sigue ahí —la prueba dorada del precache lo dirá
por su nombre—, fijar las anclas nuevas, y hacer el `push`.
