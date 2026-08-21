# Umbral — hoja de ruta

**Versión 3 · 20 de agosto de 2026.** Sustituye por completo a la versión 2.
Cambios frente a la v2: la instalación pasa a formar parte de la Fase 0 en vez
de esperar al final; la palabra "aura" desaparece; se retira `hojaderutaapk.md`;
y se añade la sección 12, que dice qué se borra y qué se rescata antes de
borrarlo.

**Cómo usar este documento:** es autocontenido. No hace falta pedir contexto
adicional ni preguntar "¿qué es Umbral?" — todo lo necesario para seguir
escribiendo código está aquí. Si algo no está aquí, es que aún no se ha decidido,
y hay que preguntarlo antes de inventarlo. Lo abierto vive en `docs/pendiente.md`;
lo cerrado, en `docs/decisiones/`.

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

## 2. Estructura de la pantalla

```text
Umbral                                    [fecha]

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

CONTEXTO MEDIBLE (contraído, aún no construido)
```

Al tocar "Todos los datos" se despliega una fila por dato: nombre, valor, estado
(medición / previsión / cálculo / sin conexión / sin cobertura), fuente, hora de
actualización, referencia si existe, y una nota fija: *"dato de contexto; no
interpreta tu estado."*

**Identidad visual (decisiones 0002, 0003 y 0005).** Fondo nocturno `#040618`,
serif Cormorant Garamond peso 500 empaquetada, rótulos en versalitas espaciadas,
oro con moderación. En "Mi registro" el color **nunca** codifica valor: un único
acento de selección para las cuatro escalas, discos de tamaño idéntico, y los dos
extremos escritos bajo cada fila. Los cinco colores de familia quedan declarados
en los tokens pero **sin usar** hasta la Fase 2, y **no salen de la paleta de
marca** (decisión 0005).

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
| Motor astronómico | **astronomy-engine** (MIT, v2.1.19, Don Cross) | Validado contra PyEphem y Meeus cap. 49 con menos de 1 min de error. Cero dependencias, 45,6 KB gzip. Se copia a `app/js/vendor/`, no se resuelve en ejecución |
| Zonas horarias | `Intl.DateTimeFormat().resolvedOptions().timeZone`, con `Europe/Madrid` **solo como reserva** | Decisión 0001. Nunca se escribe `+1`/`+2`/`CEST` a mano. La zona efectiva se muestra en el pie |
| Almacenamiento | **IndexedDB**, local | Sin nube, sin sincronización |
| Tipografía | Cormorant Garamond 500, woff2 subseteada, **dentro del repositorio** | 13,5 KB por corte. Sin red no hay fuentes web |
| Sonido | **Web Audio sintetizado**, sin archivos | Cero KB, cero red |
| Pruebas | `node --test pruebas/*.test.mjs` | Runner incorporado, sin dependencias |
| Datos externos | `fetch` directo a las APIs de la sección 5 | Sin backend propio |

**No se usa `Screen Wake Lock`.** Los ejercicios se diseñan para seguirse con el
oído, así que la pantalla apagada es una variante legítima, no un fallo.

**El service worker no guarda nada de otro origen.** Open-Meteo, GFZ y AEMET
pasan directas a la red. Un worker que devolviera una copia guardada convertiría
un dato viejo en un dato aparentemente fresco: rompería la regla 0.1 y borraría
la distinción `sin_conexion` / `sin_cobertura` de la sección 4. El caché legítimo
de esos datos es `cache_externa` en IndexedDB, que sí lleva timestamp visible.

---

## 4. Modelo de datos (IndexedDB)

Base `umbral`, versión 1. Los tres almacenes se crean desde el principio
aunque hoy solo se use uno, para no obligar a una migración de esquema después.

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
es un día sin dato.** Con `fecha_local` y `zona` juntos, dos registros del mismo
día civil separados por un viaje siguen siendo reconstruibles.

`accion_resultado` acepta `"si"|"algo"|"no"|"no_lo_se"|"no_la_hice"` pero **hoy se
guarda siempre `null`**: preguntar el resultado en el mismo instante en que se
elige la acción es pedir algo que aún no ha ocurrido. El segundo momento en que se
preguntará está aplazado hasta después de la primera semana de uso real.

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

**`sin_conexion` frente a `sin_cobertura`** (decidido): *sin conexión* = el
dispositivo no tiene red o la petición falló; el dato existe pero no se alcanza
ahora, y se reintenta. *Sin cobertura* = la petición funcionó y la fuente
respondió que ahí no mide nada; el dato no existe para este sitio, no se
reintenta, y no tiene sentido decir "actualizado hace X".

---

## 5. Fuentes de datos externos

| Familia | Dato | Fuente | Red | Estado |
|---|---|---|---|---|
| **Luna** | Fase, iluminación, salida/puesta, distancia | astronomy-engine | No | Listo para Fase 1 |
| **Luna** | Forzamiento de marea relativo | Fórmula propia, k ≈ 0,46 | No | k validado con NOAA, citar en el código |
| **Sol/luz** | Amanecer, atardecer, duración, Δ día | astronomy-engine | No | Listo para Fase 1 |
| **Sol/luz** | Índice UV | Open-Meteo Air Quality | Sí | Sin clave |
| **Atmósfera** | Temperatura, viento, nubes, lluvia, presión | Open-Meteo Weather | Sí | Sin clave |
| **Aire** | PM2.5, PM10, NO2, O3 | Open-Meteo Air Quality | Sí | Gratis solo uso no comercial |
| **Aire** | Línea base local | Red de Calidad del Aire de Castilla-La Mancha, estación de Albacete | Una vez | CSV validado desde 2013 |
| **Kp** | Actividad geomagnética | GFZ Potsdam / NOAA SWPC | Sí | Excepción de red declarada |
| **Polen** | Nivel por tipo | AEROCAM (UCLM), integrada en la REA | Sí | **Cobertura confirmada en Albacete. Bloqueado: no hay API** |
| **Clima** | Normales 1991-2020 | AEMET OpenData | Una vez | Clave gratuita por correo |

**Sobre el polen.** Hay captador en Albacete y la cadencia semanal se acepta: no
hace falta que estos datos cambien a diario. El bloqueo es otro: AEROCAM publica
una web semanal, no un endpoint, y la REA guarda los datos en una base Access con
mapas de colores. Sacar el número obligaría a raspar HTML de una web
universitaria, que se rompe con cada rediseño. Se decide en Fase 3.

**Sobre la clave de AEMET.** Una clave dentro de una app de cliente es una clave
pública. Aquí no importa porque la línea base **se calcula una sola vez**, en
`datos/construir-lineas-base.mjs`, en local. La clave vive en el entorno de la
máquina y en `.gitignore`; a `app/` solo llega el JSON derivado.

**Regla de excepción de red** (Sol/UV, Atmósfera, Aire, Kp, Polen): apagada por
defecto; se activa con `consentimiento_red_externa`. Hasta **3 familias activas**,
no las seis. Sin conexión: estado `"sin_conexion"`, nunca un cero ni un valor
neutro. Se cachea el último valor con su timestamp. Ninguna llamada envía nombre
ni ubicación exacta.

---

## 6. Gramática visual del contexto medible

*Se llamaba "el aura" hasta la v2. Se retira la palabra: una pantalla que muestra
PM2.5 y actividad geomagnética no puede llamarse aura sin caer exactamente en lo
que prohíbe la sección 10 sobre "energía lunar". El nombre es* **contexto
medible**, *en el documento y en el código.*

Una iteración anterior asignó cuatro variables al estado de cada dato. Se
**descartó** por sobrecarga cognitiva y por confundir "intensidad" con "confianza".

| Atributo | Significado permitido | Prohibido |
|---|---|---|
| Color | Identidad fija de familia | Nunca intensidad, bienestar ni peligro |
| Posición radial | Orden fijo de familias | Nunca importancia ni magnitud |
| Estilo de trazo | Continuo = disponible · discontinuo = previsión · hueco = sin dato | No es una escala de confianza abstracta |
| Movimiento | Contemplativo opcional, **detenido por defecto** | No codifica anomalía ni intensidad |
| Etiqueta textual | Valor, unidad, fuente, hora, referencia | Único canal de precisión real |

**El trazo discontinuo está reservado.** Significa "previsión". No se usa como
adorno en ninguna otra pantalla: gastaría la señal antes de que exista.

**El color de familia tampoco sale de la paleta de marca** (decisión 0005): crema,
malva, turquesa y ámbar pertenecen al logo y no identifican ningún dato.

---

## 7. Accesibilidad — no negociable

- Respetar `prefers-reduced-motion`. Si está activo, **sin animación y con el
  mando bloqueado**, no solo apagado.
- Control visible de movimiento, **detenido por defecto en cualquier caso**,
  incluido el temporizador de respiración. La onda se enciende a mano. Así no hace
  falta escribir ninguna excepción a esta regla.
- Ningún dato se comunica solo por color: siempre texto, numeral o patrón.
- Los conmutadores dicen el **estado**, no una etiqueta ambigua: "Sonido:
  activado", no "Sonido". `aria-pressed` no basta para quien no ve el color.
- Con el temporizador en marcha, la palabra "Inspira"/"Exhala" es el elemento más
  grande de la pantalla. La onda acompaña; la palabra instruye.
- Lectores de pantalla: primero un resumen, luego el detalle.
- Ningún dato ausente se dibuja como cero o como "normal".
- Sin alarmismo visual, sin rachas, sin puntuación de sincronía.
- **`color-scheme: dark` declarado en el HTML.** Sin él hay un fogonazo blanco
  entre que abre el navegador y pinta el CSS. En una app que se usa de noche, eso
  no es un detalle estético.
- **No se fuerza la orientación** en el manifest. Quien use el móvil apoyado o en
  un soporte decide.

---

## 8. Conjunto de pruebas doradas

`node --test pruebas/*.test.mjs` — **la carpeta a secas falla** con
`MODULE_NOT_FOUND` en Node 22; hace falta el patrón.

### De empaquetado — **5 pruebas, en `pruebas/precache.test.mjs`**

La lista de `PRECACHE` se mantiene a mano porque no hay compilación. Estas
pruebas son lo que sustituye al generador que no queremos:

- Todo fichero de `app/` está en `PRECACHE`. *Sin esto el fallo es silencioso:
  añades un módulo, en el móvil funciona porque hay cobertura, y el día que abres
  la app en mitad del campo falta ese fichero.*
- Todo lo de `PRECACHE` existe en disco. *`addAll` es atómico: un solo 404 tumba
  la instalación entera del worker y la app se queda sin poder actualizarse.*
- Ninguna ruta absoluta ni de otro origen en `PRECACHE`.
- El manifest declara un icono `maskable`.
- `theme_color`, `background_color` y el fondo de `tokens.css` son el mismo color.

### Astronómicas — pendientes hasta Fase 1

| Caso | Esperado | Tolerancia |
|---|---|---|
| Luna nueva 6 ene 2000 | 18:14 UT | ± 2 min |
| Luna nueva 11 sep 2026 | 03:27 UTC | ± 2 min |
| Luna llena 28 ago 2026 | 04:19 UTC | ± 2 min |
| Salida de Luna, Albacete, 28 ago 2026 | 20:53 local | ± 2 min |
| Perigeo 6 sep 2026 | 368 249 km | ± 100 km |
| Apogeo 19 sep 2026 | 404 210 km | ± 100 km |
| Noches sin Luna en Albacete 2026 | 63 | ± 2 |
| Día de 23 h / de 25 h | 29 mar / 25 oct 2026 | exacto |
| Día sin salida de Luna en Albacete | 9 ene 2026 | exacto |
| Fecha local de la nueva del 11 sep 2026 en Quito | 10 sep | exacto |
| Ratio de fuerza de marea Sol:Luna | k ≈ 0,46 | NOAA |
| Envolvente sicigia/cuadratura | ≈ 2,7 | **del modelo de equilibrio, no de un mareógrafo real** |

### De arquitectura — pendientes

- Sin red, Kp/clima/aire devuelven `"sin_conexion"`, nunca 0.
- Con `prefers-reduced-motion`, ninguna animación en ninguna pantalla.
- Un campo ausente se guarda como `null`, no como 0.

### Del catálogo — **20 pruebas, 20 pasan**

En `pruebas/seleccion.test.mjs`. Las que importan:

- *"agotada a las once de la noche: nada que exija salir"* — con energía 2 a las
  23 h sigue habiendo prácticas, todas de coste 1, y `andar_diez`,
  `escaleras_diez` y `sentadillas_pequenas` quedan fuera.
- *"si no queda ninguna, se devuelve null y no un genérico"*.
- Las ocho necesidades tienen al menos una práctica de coste 1.
- Ninguna práctica con `evidencia: "ensayo"` carece de `fuente`.
- Solo las de tipo `respiracion` abren el temporizador.

---

## 9. Fases de construcción

**Fase 0 — Mi registro, instalado, sin red. `A UN PASO DE PROBAR.`**
Tiene dos entregables, no uno:

- **(a) La pantalla. `CONSTRUIDA.`** Cuatro escalas + señal corporal + necesidad +
  acción + nota, en IndexedDB. Cero dependencias externas. Catálogo de 100
  prácticas con su filtro y sus pruebas. Temporizador de respiración con onda y
  sonido sintetizado.
- **(b) Instalable en el móvil. `HECHO, SIN DESPLEGAR.`** Manifest, service
  worker, iconos, publicación (decisión 0006).

*(b) no es un adorno: es el prerrequisito de (a).* El criterio de aceptación de la
Fase 0 es abrirla ocho días seguidos, y eso no se puede hacer en un portátil. Un
registro de "¿cómo estás ahora?" a las once de la noche se hace en el móvil o no
se hace.

**Si esto no resulta útil ocho días seguidos, no hay fase siguiente que lo
arregle.**

**Fase 1 — Luna, local, sin red.** astronomy-engine integrado. Fase, iluminación,
salida/puesta, forzamiento de marea. En "Contexto medible" contraído.

**Fase 2 — El contexto medible completo,** con Luna real y el resto en "no
activado". Gramática visual (§6) y accesibilidad (§7) antes de añadir más datos.

**Fase 3 — Fuentes externas, una a una.** Open-Meteo (cubre Sol/UV, Atmósfera y
Aire) → Kp → polen, si se resuelve lo del raspado.

**Fase 4 — Memoria personal, con umbrales de evidencia.** Sin patrón (<14 días) →
señal inicial (14–27 días, 6+ comparables) → patrón provisional (28+ días, 8+ por
grupo). Nunca antes. Aquí es donde el campo `origen` del catálogo empieza a servir.

**Fase 5 — Empaquetado APK.** Solo cuando 0–3 se usen de verdad.
`@capacitor/core` + `@capacitor/android`, keystore propio guardado en dos sitios
fuera del repositorio. Coste: 0 €. Tamaño esperado 4–6 MB, **estimación de
contenedor típico que hay que medir**, no dar por buena.

---

## 10. Lo que NO se hace, bajo ningún argumento

- Nada de índice de sincronización ni fórmula que mezcle autoinforme con datos externos.
- Nada de predicción de fertilidad, ciclo menstrual ni contenido médico.
- Nada de rachas, medallas ni lenguaje de éxito/fracaso.
- Nada de movimiento continuo por defecto, en ninguna pantalla.
- Nada de backend, cuentas ni analítica.
- Nada de "energía lunar" como etiqueta: el nombre es "forzamiento de marea
  relativo" o "contexto orbital lunar". **Ni "aura": ver §6.**
- **Ninguna práctica promete resultado.** "Sube escaleras diez minutos" es honesto;
  "y notarás la diferencia" no, aunque el ensayo casi lo permita.
- **El campo `evidencia` no se muestra nunca en pantalla.** Poner "respaldado por
  70 ensayos" convierte una sugerencia en receta y roza la regla 4.
- **Las tradiciones entran como `origen`, nunca como explicación.** Meridianos, qi
  y energía vital son marco simbólico, no mecanismo. Se ofrece el movimiento, no
  la teoría.
- **No se transcriben coreografías con autor.** Shi Er Duan Jin y Ming Mu Gong
  están en libros con autor; se aprenden de fuente legítima o no se usan.
- **No se raspa una web para fingir que hay una API.**
- **El service worker no guarda nada de otro origen** (§3).
- **Ninguna ruta absoluta** en manifest, worker o HTML (decisión 0006).
- **El manifest no declara categoría `health`.** Es un metadato de tienda y sería
  la regla 4 colándose por la puerta de atrás.

---

## 11. Estructura del repositorio

```
umbral/
├── README.md · .gitignore          el keystore NUNCA entra
├── .nojekyll                       sin esto, Pages descarta ficheros con "_"
├── docs/
│   ├── hoja-de-ruta.md             este documento
│   ├── registro-de-datos.md        toda constante, antes de tocar el código
│   ├── pendiente.md                lo que NO se ha decidido
│   └── decisiones/                 0001 zona · 0002 color · 0003 serif
│                                   0004 catálogo · 0005 paleta del logo
│                                   0006 instalación y publicación
├── app/                            se publica tal cual, cero compilación
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── sw.js                       nunca se precachea a sí mismo
│   ├── contenido/practicas.json
│   ├── css/ · js/ · js/vendor/ · fuentes/
│   ├── iconos/                     32 · 180 · 192 · 512 · maskable-512
│   └── imagenes/portada-720.webp
├── datos/crudo/ · datos/derivado/
├── pruebas/
└── herramientas/                   fuera de app/: no debe cachearlo el worker
```

`docs/`, `datos/`, `pruebas/` y `herramientas/` quedan **fuera del alcance** del
service worker por estar fuera de `app/`. No es una precaución: es geometría de la
carpeta, que es la clase de garantía que no se olvida.

---

## 12. Lo obsoleto — qué se retira

### `docs/hojaderutaapk.md` — **se borra**

Es de la etapa anterior del proyecto y contradice este documento en dos puntos que
un yo futuro leería sin darse cuenta:

- **Numera el APK como Fase 4**, cuando aquí es la 5.
- **Describe otro producto.** Su Fase 0 respondía a *"¿se va a ver la Luna esta
  noche desde Albacete?"*. La decisión de producto de §1 la sustituyó por *"¿Cómo
  estás ahora?"*. No es un cambio de énfasis: es otra app.

**Antes de borrarlo hay que rescatar cuatro cosas a `docs/registro-de-datos.md`,**
que es donde deberían haber estado desde el principio y no en una hoja de ruta:

1. **Las mediciones de astronomy-engine v2.1.19:** 113,7 KB minificado, 45,6 KB
   gzip, cero dependencias, 37 ms por mil cálculos de iluminación, 48 ms por cien
   cálculos de salida de Luna.
2. **La validación cruzada** contra PyEphem 4.2.1 (ELP2000-82B) y contra una
   implementación propia de Meeus cap. 49, con las cuatro diferencias medidas
   (45 s, 33 s, 39 s, 28 s).
3. **La nota de honestidad:** la librería aproxima UT1 y UTC como si fueran lo
   mismo, y de ahí salen esos ~40 s. Es irrelevante para un calendario y **debe
   decirse en la pantalla de "cómo se calcula esto"**, no ocultarse.
4. **El calendario de verificación de desarrollador de Android:** cuentas de
   distribución limitada abiertas desde agosto de 2026 (hasta 20 dispositivos, sin
   DNI, sin cuota); exigencia en Brasil, Indonesia, Singapur y Tailandia desde el
   30 de septiembre de 2026; alcance global en 2027. Relevante solo para la Fase 5.

*Todo esto es de agosto de 2026 y no se ha vuelto a comprobar. Antes de la Fase 5,
verificarlo de nuevo: es información con fecha de caducidad.*

### La palabra "aura" — **se retira del documento y del código**

Ver §6. Sustituir por "contexto medible" en toda ocurrencia, incluidos nombres de
funciones, clases CSS e identificadores.

### Los originales PNG de marca — **no entran en `app/`**

Pesan 5,8 MB y 2,3 MB. En `app/` van los derivados (unos 180 KB en total). Los
originales viven en `datos/crudo/` o fuera del repositorio. Ver decisión 0005.

### `imagenes/portada-1200.webp` — **generada, no empaquetada**

Vive en `datos/derivado/`, no en `app/`. 125 KB por una imagen decorativa en una app de móvil que tiene que abrir sin
cobertura no se paga solo. Entra si algún día hay pantalla grande.

### Lo que **NO** es obsoleto, aunque lo parezca

- **`Plan de observación local en Albacete — primer año`.** Sigue vigente, pero es
  **otro proyecto**: un piloto de campo de doce meses, con otra pregunta y otro
  método. No es alcance de la app. Como mucho alimenta la Fase 4 dentro de un año.
  Que viva en su propia carpeta, no en la de la app.
- **Los tres informes en PDF.** Son las fuentes de las que salieron estas
  decisiones. No se borran; se citan.

---

## 13. Lo siguiente

**Hoy, media hora:** pegar las etiquetas de `<head>` de la decisión 0006, publicar
en Pages, instalar en el móvil, poner el modo avión y comprobar que abre.

**A partir de esta noche, ocho días:** abrirla. El paso siguiente no es código.
Si a los tres días da pereza, lo que hay que rediseñar es esa pantalla, no lo que
viene después.

**El día 8 cae el 27 de agosto,** y la Luna llena es el 28 a las 04:19 UTC — o
sea, la noche del 27 al 28, con salida por Albacete a las 20:53 local. Cierras la
prueba bajo la llena sin haberlo planificado.

**Mientras tanto, y sin bloquear nada:** leer las cien frases del catálogo del
tirón, de noche y en el móvil. Están escritas de una sentada y eso siempre se nota.
