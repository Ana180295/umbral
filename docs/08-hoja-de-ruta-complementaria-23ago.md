# 08 · Hoja de ruta complementaria · sesión del 23 de agosto de 2026

Documento de traspaso. Recoge lo cerrado, lo reabierto y lo que queda abierto en
esta conversación, para continuar en otra.

---

## 0 · Orden de trabajo fijado

Los lotes se resuelven en este orden: **3 → 4 → 5 → 0 → 1 → 2 → 6**.

Dos puntos **no son cola, son calendario** y mantienen su fecha vayan donde vayan:

- **27 de agosto** · fijar las anclas nuevas de 18:00–22:00
- **28 de agosto, por la noche, tras el ancla de las 23:00** · el `push`

> El octavo día del criterio de aceptación de la Fase 0 y el día del cambio de app
> son el mismo. Publicar por la mañana haría que ese octavo día se viviera sobre
> otra app y los ocho dejarían de ser comparables.

---

## 1 · CERRADO · Lote 3, punto 1 — copia local

**Ubicación:** en la portada, bajo «Entrar».

```
Entrar

SACAR UNA COPIA  ·  TRAER UNA COPIA
No hay ninguna otra copia de tus registros. Esta la haces tú.
```

Orden *sacar · traer*: sacar se hará cien veces, traer tres.
Va en la portada y no en «Mi registro» porque **la importación tiene que vivir
donde la app está vacía**: en un móvil nuevo, «Mi registro» preguntaría «¿cómo
estás ahora?» antes de dejar recuperar dos años de datos.

### Qué entra en el fichero

| Almacén | ¿Entra? | Motivo |
|---|---|---|
| `checkins` | Sí, enteros | Irremplazable |
| `perfil_local` (entradas) | Sí | Sin él se pierde el nacimiento |
| `cache_externa` | No | Es un caché; congelarlo convierte lo viejo en aparentemente fresco |
| `epoca_utc`, `epoca_aproximada` | No | Se recalculan de las entradas |
| `ultima_copia` | No | Es un hecho de *este* aparato, no de la vida |
| Datos derivados (Luna, marea) | No | Se recalculan del `timestamp` |

**Excepción documentada:** `fecha_local` **sí entra**, aunque sea derivada. Los
registros del 21 al 27 de agosto no tienen `zona`, y sin zona no se puede
recalcular sin suponer una. Suponerla sería inventar un dato.

### Forma del fichero

```json
{ "formato":"umbral-exportacion", "version_esquema":1,
  "exportado_en":…, "zona_exportacion":"Europe/Madrid", "origen":"https://…",
  "perfil_local":{…}, "checkins":[…] }
```

Sangrado con `JSON.stringify(obj,null,2)`: **la red tiene que aguantar que la app
no exista**. Sin `total_checkins` — un contador que puede discrepar del array es
la clase de dato que miente meses después.

### Nombre del fichero

`umbral-AAAA-MM-DD.json`, con la fecha calculada con `Intl` y `ZONA`, **nunca con
`toISOString()`**: a la 01:30 en Madrid la fecha UTC es la de ayer.

### Importación: sustituir, no fusionar

- Antes de escribir nada, **la app saca una copia de seguridad automática**.
- Muestra los números: «vas a sustituir 47 registros por 312».
- Confirmación explícita. **O entra el fichero entero o no entra nada.**
- Si el fichero activa el consentimiento de red externa, se dice.

| `version_esquema` | Qué hace |
|---|---|
| Igual | Importa |
| Más vieja | Importa; los campos ausentes **se quedan ausentes** |
| Más nueva | **Se niega**, y dice los dos números |

La época se **recalcula** al importar. Si algún día no coincidiera, querrás enterarte.

### Seis pruebas doradas

Dos funciones puras: `construirExportacion(...)` y `leerExportacion(objeto)`.

1. Un `checkin` sin `zona` sale sin `zona`.
2. Todos los campos del esquema aparecen serializados, **incluidos los nulos**.
3. El nombre del fichero usa la fecha local, no la UTC.
4. No aparece `cache_externa`, ni `epoca_utc`, ni nada derivado.
5. Un fichero de `version_esquema` mayor se rechaza y **no escribe nada**.
6. **Ida y vuelta:** exportar → importar → exportar da el mismo objeto.

> La 6 es la que demuestra que la lista de campos está completa. Si falta uno, se
> pone roja sola.

---

## 2 · CERRADO · Lote 3, punto 13 — `construirRegistro` pura

**Deja de ser «no bloquea».** El punto 14 añade campos al esquema, y añadir campos
al esquema es exactamente lo que produjo el fallo 4 (`zona` se calculaba, se
enseñaba y no se escribía, durante siete días).

**Va antes que el 14. Y al escribir el código, va antes que el punto 1**, porque
`fechaLocalDe` nace aquí y el módulo de la copia la importa.

### Firma

```js
construirRegistro(entradas, contexto)
// contexto = { id, timestamp, zona }
```

Ni `crypto.randomUUID()` ni `Date.now()` entran dentro: son impuras y harían la
función imposible de probar. `fechaLocalDe(timestamp, zona)` **sí** va dentro:
es determinista.

### Cuatro decisiones

1. **Los doce campos siempre**, con `null` donde no haya nada. `undefined`
   desaparece al serializar y entonces «no lo anoté» y «este campo no existe» se
   escriben igual. Ausente es `null`, **nunca `0`**.
2. **La lista de campos se escribe a mano en la prueba**, no se deriva de una
   constante del código. Un solo sitio que editar es un solo sitio donde
   equivocarse sin testigos. Se comprueba **exactamente**: ni uno de menos ni uno de más.
3. **Un valor imposible lanza; no se degrada.** Convertir un `descanso: 7` a `null`
   fabricaría un «no lo anoté» a partir de un fallo: quedaría un registro válido,
   guardado, permanente y falso. La pantalla **conserva lo escrito**:
   > *No se ha podido guardar este registro. Lo que has escrito sigue aquí.*
4. **`fechaLocalDe` es una sola función** y la usan los dos puntos.

### `senal_corporal`: `nada_especial` explícito

`[]` queda reservado para el silencio. «Me he mirado el cuerpo y no hay nada» y
«no me lo he preguntado» son cosas distintas — el proyecto ya resolvió este caso
en la línea de al lado con el `no_lo_se` de la necesidad.

**Hay prisa:** los registros que se escriben ahora llevan la ambigüedad dentro y
no se arregla después.

### Fichero

`app/js/registro.js` nuevo, con `construirRegistro` y `fechaLocalDe`. Dos entradas
nuevas en `PRECACHE`.

### Seis pruebas doradas

1. Campos **exactamente** los del esquema *(habría cogido el fallo 4)*.
2. Campo sin contestar → `null`, ni `undefined` ni `0` ni cadena vacía.
3. `zona` se escribe siempre con el valor pasado; no se inventa si falta.
4. `fecha_local` a la 01:30 en `Europe/Madrid` es la del día civil de Madrid.
5. Un valor fuera de 1–5 lanza y **no devuelve registro degradado**.
6. `senal_corporal` siempre array, nunca `null`.

---

## 3 · REABIERTO · el perfil se amplía

Los puntos 1 y 13 quedaron cerrados **antes** de decidir los campos nuevos. Hay que
volver sobre los dos.

### Campos nuevos en `perfil_local`

```
nombre_completo    entrada de cálculo (numerología). Entra en la exportación
mote               solo para dirigirse a la persona. No entra en ningún cálculo
altitud            ya se usa en el Observer de salidas y puestas; faltaba guardarla
```

**Regla especial:** si `nombre_completo` cambia, **se guarda la fecha del cambio**.
Es la única entrada cuyo resultado no se puede rehacer sin ella.

### Once convenciones declaradas

| Convención | Opciones |
|---|---|
| `zodiaco` | tropical · sidéreo |
| `ayanamsa` | lahiri · otras |
| `casas` | signos enteros · iguales · porfirio · placidus · regiomontano · campano |
| `ano_chino` | año nuevo lunar · lichun |
| `correlacion_tzolkin` | 584283 · 584285 |
| `calendario_islamico` | civil tabular · observacional |
| `num_tabla` | pitagórica · caldea |
| `num_tildes` | retirar · conservar |
| `num_enie` | ñ→n · letra propia |
| `num_maestros` | reducir · conservar |
| `num_camino_vida` | suma directa · por bloques |

### Nuevos campos de registro (del punto 14)

```
influjo_externo    1–5 o null
atribucion         texto libre, o []
```

---

## 4 · CERRADO · la regla que gobierna qué se guarda

> **Exhaustivos en las entradas. Austeros en los resultados.**
> Todo lo que no se pueda recalcular, se guarda. Todo lo que sí, se recalcula.

Medido: **24 campos guardados → 1.171 valores derivables.** Razón 48,8 a 1.

Guardar un resultado **congela una versión del motor** dentro de la base de datos.
Excepción: la clase ③ (nombre), que no se recalcula si el nombre cambia — por eso
guarda las convenciones y la cadena exacta, no el número.

---

## 5 · CERRADO · las cuatro clases

| Clase | La entrada es | ¿Recalculable? | Ejemplos |
|---|---|---|---|
| **①** Medición física | Una efeméride | Sí, siempre | Tropical, sidéreo, jieqi, nakshatra, tithi |
| **②** Cuenta desde un origen | Un instante declarado | Sí, si el origen está escrito | Sexagenario, tzolk'in, hebreo, islámico, **época de Umbral** |
| **③** Convención de escritura | Una cadena de texto | **No** si la cadena cambia | Numerología, gematría |
| **④** Acto en el momento | Una tirada, aquí y ahora | **Excluida** | I Ching, tarot, runas |

---

## 6 · CERRADO · las cinco cuestiones abiertas del dominio

| | Estado |
|---|---|
| **1. Bibliografía** | Parcial. Faltan ediciones físicas de Rudhyar, Cornelius y Houlding, y fuentes primarias de nakshatra y tithi |
| **2. Origen por defecto del zodiaco** | **No hay ninguno.** Se muestran los dos, y **se etiqueta también el tropical**, que es el que nunca se etiqueta |
| **3. Correlación tzolk'in** | **584283.** Radiocarbono de Tikal (Kennett et al., *Sci. Rep.* 3, 2013), cuenta viva k'iche', estándar de campo. Se anota que existe 584285 |
| **4. Numerología** | **No hay fuente primaria porque no existe.** L. Dow Balliett, 1903–1908, sobre el alfabeto inglés. Si aparece, la fecha que va al lado es **c. 1908** |
| **5. Cálculo de casas** | **PASA.** Verificado contra un segundo cálculo independiente: 0,00000′ de diferencia en 54 latitudes de −60° a +66° |

---

## 7 · CERRADO · diseño de la salida astronómica

### La regla de orden

> **Lo del cielo, siempre. Lo tuyo, después de anotar.**

La Luna del cielo (fase, día lunar, salida y puesta) puede estar siempre visible:
ya es el reloj de la app. **Los marcadores personales —cumpleaños lunar, retornos,
aspectos— se desbloquean después de guardar el registro**, todos los días, sin
excepción y sin castigo. No es un premio por rellenar: es la única forma de que lo
que se escribe signifique algo.

### El orden de las tradiciones

El tropical primero, **y se dice por qué**:

> Empezamos por el tropical porque es el que circula aquí. No porque sea el
> correcto: no hay forma de saber cuál lo es.

Ninguna entrada marcada como popular, recomendada ni frecuente. El orden dentro del
menú, por familia.

### Las capas

Cada capa **completa en sí misma**. Ninguna puede terminar en «y para entender esto
necesitas la siguiente».

1. **Qué hace** — la frase que es botón: *«24 tramos de 15°, contados desde el equinoccio.»*
2. **Qué me dice** — el método y el caso propio.
3. **De dónde sale** — historia, y quién discute qué.

Por hondo que se baje, **nunca se llega a «esto quiere decir que»**.

### Significados: sí de palabras, no de configuraciones

| | ¿Entra? |
|---|---|
| Qué quiere decir *Yushui*, de dónde sale *Adar* | **Sí**, con etimología y fuente |
| Qué dice de ti tener el Sol opuesto a Marte | **No** |

Lo primero es historia de la lengua y se comprueba en un diccionario. Lo segundo es
una afirmación sobre una persona, y esas se quedan dentro durante décadas.

### Las coincidencias van en cuatro clases etiquetadas

| | Qué es | Ejemplo |
|---|---|---|
| **①** Identidades | El mismo número, dos rejillas | tithi 19 y fase Llena, los dos de 222,718° |
| **②** Herencias | Un cero compartido | jieqi y zodiaco tropical usan el mismo equinoccio |
| **③** Convergencias reales | Dos cálculos que no se conocen | salida de Luna y triángulo esférico coinciden |
| **④** Casualidades bonitas | Azar, y se dice | los dos márgenes del Sol |

Sin las etiquetas, las cuatro se leen igual y la aritmética se convierte en superstición.

---

## 8 · NUEVO · control interno de deriva

La aritmética de la lunación media, que ya no se muestra, pasa a ser **control**:

```
390 lunaciones desde 1995-02-18
  media (29,530589 d)   31 ago 2026, 22:01
  efemérides             31 ago 2026, 18:15
  discrepancia           3 h 46 min = 1 parte entre 73.000
```

Si algún día se separan más que esto, el motor tiene algo roto. Mismo papel que los
biorritmos: **un instrumento que no puede dar nada, y por eso sirve para detectar
cuándo el método da algo que no debería**.

---

## 9 · NUEVO · generador de hojas

`hoja-de-cielo.mjs` — toma un JSON con nombre, fecha, hora, zona y coordenadas, y
emite la hoja completa en Markdown. Cero dependencias salvo astronomy-engine.

**Un prompt no sirve para esto:** un modelo de lenguaje inventaría el ascendente con
toda seguridad, que es la regla 0.1 rota. Los números los calcula código; la prosa
es fija.

Probado en tres casos: Albacete (reproduce los valores verificados a mano),
**Tromsø 69,6° N** (detecta que Placidus, Regiomontano y Campano no existen y los
retira solos) y **Sídney −33,9°** (hemisferio sur, sin fallos).

**Limitación conocida:** los nombres de los jieqi son del hemisferio norte. En
Sídney «solsticio de verano» cae en invierno — el dato es correcto y el nombre engaña.

---

## 10 · ABIERTO · por dónde seguir

### Lote 3, punto 14 — quedan tres decisiones

1. **Cómo se llama el bloque y cómo se pregunta.** *(pendiente de tu voz)*
   No puede llamarse «energía»: la palabra ya está ocupada por la escala 2 del
   registro, y la §10 prohíbe «energía lunar» como etiqueta.
   Propuestas para el nombre: *¿Y de fuera?* · *Lo que venía de fuera* · *Alrededor*.
2. **¿Aparece en los tres registros del día o solo en uno?**
3. **La lista de `atribucion` no se inventa: se acumula.** Texto libre primero; una
   palabra se convierte en botón solo cuando ya se ha escrito varias veces.
   **Nunca botones sugeridos** — el día que la app pinta un botón que dice «Luna»,
   todos los datos posteriores están contaminados por ese botón.

### Después

- Reabrir los puntos 1 y 13 con los campos nuevos del perfil *(§3)*
- Lote 4 — pantalla del contexto medible
- Lote 5 — calendario personal
- Lotes 0, 1, 2, 6

---

## 11 · Reglas nuevas que valen para todo el proyecto

**Un control que solo mira donde la respuesta es obvia no es un control.**
Campano pasó la comprobación «la cúspide 1 es el Ascendente» **con error
exactamente cero** teniendo la casa 2 a medio cielo de distancia: comprobaba los dos
únicos puntos donde la fórmula degenera y funciona aunque el resto esté roto.

**`undefined` no rompe nada, y ese es el problema.** Leer `.alt` en vez de
`.altitude` hizo que 40 casos de prueba salieran «sin cruce» en lugar de fallar,
porque `undefined > 0` es `false`. Misma familia que el fallo del campo `zona`:
**lo que no se escribe no avisa.**

**El día vacío tiene que existir.** Medido sobre un año contra una carta real:

| Orbe | Aspectos/día | Días sin ninguno |
|---|---|---|
| 1° | 4,8 | **5** |
| 2° | 10,1 | 0 |
| 3° | 15,9 | 0 |

Por encima de 1° no hay un solo día del año sin aspectos, y **un sistema que nunca
calla no puede ser contradicho por los datos**.

---

*23 de agosto de 2026.*
