# 02 · Inventario de datos — entradas, convenciones y derivables

Esquema completo de qué se recoge, qué se declara y qué se calcula.

> **Regla que gobierna el documento:**
> Exhaustivos en las entradas. Austeros en los resultados.
> Todo lo que no se pueda recalcular, se guarda. Todo lo que sí, se recalcula.

**25 campos guardados → 1.172 valores derivables.** Razón 46,9 a 1.

*Corrección del 28 de agosto, encontrada al recalcular tras añadir
`localidad`: la clase C1 llevaba fichada como «(1.070)» en su propio
encabezado, pero la suma de sus filas da 1.060, y es 1.060 —no 1.070— el
número que hace cuadrar el total del documento (1.060+31+80 = 1.171, la
cifra que ya estaba escrita arriba antes de esta noche). El error era solo
de etiqueta, no de las filas en sí: ninguna fila de C1 cambia. Preexistente,
no introducido esta noche — encontrado al re-sumar todo para verificar el
nuevo total, no al buscarlo a propósito.*

---

# A · ENTRADAS — se guardan (25)

Lo único irrecuperable. Si se pierde, se pierde para siempre.

## A1 · Identidad (2)

| Campo | Uso | ¿Cálculo? |
|---|---|---|
| `nombre_completo` | Numerología (clase ③) — **no sale en pantalla hasta que la tabla tenga edición comprobable** | **Sí** |
| `mote` | Solo dirigirse a la persona | No |

**Regla especial:** si `nombre_completo` cambia, se guarda la fecha del cambio.
Es la única entrada cuyo resultado no se puede rehacer sin ella.

## A2 · Nacimiento (8)

| Campo | Por qué hace falta |
|---|---|
| `fecha` | Origen de todo |
| `hora` | Ángulos y casas. Un minuto mueve el ASC ~15′ |
| `precision_hora` | `exacta` / `franja` / `desconocida`. Nunca se supone |
| `localidad` | El nombre tal como se buscó — decisión 0025, 28 de agosto. No participa en ningún cálculo; se guarda porque una geocodificación inversa de lat/lon no tiene por qué devolver el mismo texto que se buscó. Opcional: ausente en perfiles anteriores al 28 de agosto |
| `lat` | Salidas, puestas y ángulos. Se resuelve por geocodificación desde `localidad` (0025), no se pide a mano |
| `lon` | Ídem, y tiempo sidéreo local |
| `altitud` | Entra en el `Observer` de salidas y puestas |
| `zona` | Para reconstruir la hora civil sin suponer nada. Desde el 12 de noviembre de 2026 (decisión 0027) sale del `timezone` de la localidad geocodificada; la del dispositivo queda solo como reserva cuando la búsqueda no la da |

## A3 · Lugar habitual (4)

`lat` · `lon` · `altitud` · `zona`

Separado del nacimiento porque son dos sitios distintos y los cálculos diarios
usan este. Hoy está fijo en Albacete; el día que cambie, los cálculos anteriores
tienen que seguir siendo reproducibles.

## A4 · Convenciones declaradas (11)

Ver bloque B.

---

# B · CONVENCIONES — se declaran (11)

No son ajustes: son **decisiones sobre dónde empieza a contar el círculo**.
Ninguna tiene respuesta correcta. Todas se guardan junto al resultado.

| Convención | Opciones | Afecta a |
|---|---|---|
| `zodiaco` | tropical · sidéreo | 20 signos, nakshatras |
| `ayanamsa` | true_chitra (Spica en 180°, el que calcula `carta.js`) · lahiri oficial (sin implementar, pendiente 41) · otras | Todo lo sidéreo |
| `casas` | signos enteros · iguales · porfirio · placidus · regiomontano · campano | **8 de 10 planetas cambian de casa** |
| `ano_chino` | año nuevo lunar · lichun | El animal, en quien nace entre ambas fechas |
| `correlacion_tzolkin` | 584283 · 584285 | Desplaza **dos** días |
| `calendario_islamico` | civil tabular · observacional | La fecha |
| `num_tabla` | pitagórica · caldea | Clase ③ |
| `num_tildes` | retirar · conservar | Clase ③ |
| `num_enie` | ñ→n · letra propia | Clase ③ |
| `num_maestros` | reducir 11/22/33 · conservarlos | Clase ③ |
| `num_camino_vida` | suma directa · por bloques | Clase ③ |

**Orbe de aspectos** va aparte porque no es tradición sino umbral de medida.
Medido sobre un año completo:

| Orbe | Aspectos/día | Días del año sin ninguno |
|---|---|---|
| 1° | 4,8 | **5** |
| 2° | 10,1 | 0 |
| 3° | 15,9 | 0 |
| 5° | 27,1 | 0 |

Por encima de 1° **el día vacío no existe**, y un sistema que nunca calla no puede
ser contradicho. El orbe honesto es 1° o menos.

---

# C · DERIVABLES — nunca se guardan (1.172)

Se recalculan del `timestamp`. Guardar cualquiera de estos congelaría una versión
del motor dentro de la base de datos.

## C1 · Clase ① — de la efeméride (1.060)

**Por cuerpo** (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón):

| | n |
|---|---|
| longitud eclíptica tropical | 10 |
| longitud eclíptica sidérea | 10 |
| latitud eclíptica | 10 |
| declinación | 10 |
| distancia | 10 |
| velocidad y sentido (directo/retrógrado) | 10 |
| signo tropical + signo sidéreo | 20 |

**Estructura de la carta:**

| | n |
|---|---|
| ángulos: ASC, MC, DSC, IC | 4 |
| cúspides de casa × 6 sistemas | 72 |
| casa de cada cuerpo × 6 sistemas | 60 |

**Rejillas sobre los mismos ángulos:**

| | n | Nota |
|---|---|---|
| nakshatra + pada de la Luna | 2 | 27 × 13° 20′, sidéreo. Grados: Burgess cap. II, v. 64, cotejado el 16 de noviembre de 2026. *La ficha sigue DÉBIL por un nombre: Dhanishta, que la fuente llama Śraviṣṭhā* |
| tithi, yoga, karana | 3 | tithi = separación Luna−Sol / 12°. Fuente primaria: Sūrya-Siddhānta I.12-13, trad. Burgess 1860 |
| fase de Rudhyar + iluminación + separación | 3 | 8 × 45° — **mismo número que el tithi, otra rejilla** |
| jieqi en curso, siguiente, e instantes exactos | 4 | tropicales, 15° |

**Del lugar y el día:**

| | n |
|---|---|
| salida y puesta de Sol y Luna | 4 |
| marea mensual, marea instantánea, distancia lunar | 3 |

**Relaciones:**

| | n |
|---|---|
| aspectos natal ↔ natal (45 pares × 5) | 225 |
| aspectos tránsito ↔ natal (10 × 12 × 5) | 600 |

## C2 · Clase ② — de la cuenta (32)

| | n |
|---|---|
| época de Umbral: instante, día lunar, hora dentro del día | 3 |
| días que tiene la lunación en curso (`diasEnLunacion`, decisión 0026) | 1 |
| sexagenario: 4 pilares × tronco + rama | 8 |
| tzolk'in: número + nombre | 2 |
| fecha hebrea, islámica, persa, china | 12 |
| biorritmos (23/28/33) | 3 |
| días de vida, lunaciones vividas, retornos solares | 3 |

## C3 · Clase ③ — del nombre (80)

| | n |
|---|---|
| expresión, alma, personalidad, camino de vida, cumpleaños | 5 |
| las mismas × las otras 15 combinaciones de convenciones | 75 |

**En pantalla se muestra solo la combinación declarada.** Las otras 15 existen para
poder responder «¿y si…?» sin guardar nada.

## C4 · Clase ④ — excluida

I Ching, tarot, runas. Requieren un acto en el momento de preguntar. No derivan
del nacimiento y no pueden generarse sin petición.

---

# D · REGISTRO DIARIO — se guarda entero

Autoinformado. **Ninguno de estos se recalcula jamás.**

| Campo | Nota |
|---|---|
| `id`, `timestamp`, `zona`, `fecha_local` | Identidad y anclaje |
| `descanso`, `energia`, `activacion`, `tono` | 1–5 o `null` |
| `senal_corporal` | `["nada_especial"]` explícito ≠ `[]` silencio |
| `necesidad` | incluye `no_lo_se` explícito |
| `accion_elegida`, `accion_resultado` | |
| `nota_libre` | Sin botones, nunca |

**Trece campos, no doce.** La cuenta estaba mal en el traspaso del 23 de agosto,
y la prueba dorada 1 de `pruebas/registro.test.mjs` los comprueba exactamente.

**`influjo_externo` y `atribucion` salen del proyecto** (decisión 0015, 24 de
agosto). El punto 14 del Lote 3 no era un campo del registro: era una pantalla.
El registro no crece.

Y la razón por la que `nota_libre` no lleva botones sigue en pie, aunque el campo
que la motivó ya no exista: **el día que la app pinta un botón que dice «Luna»,
todos los datos posteriores están contaminados por ese botón.**

---

# E · El problema de la salida

**1.172 valores no son una pantalla.** El eje que los parte no es la tradición
sino esto:

| | Cambia | Es |
|---|---|---|
| **Lo natal** | Nunca | Una referencia. Se calcula una vez y se mira cuando se quiera |
| **Lo del día** | Cada instante | Un estado |
| **La relación entre ambos** | Cada instante | Los aspectos. **Aquí vive todo el riesgo de sugerencia** |

Tres cosas distintas que hoy están mezcladas en la misma lista.

Y la regla de orden ya decidida las separa sola:

> **Primero anotas. Después miras.**
> Lo del día y los aspectos no están disponibles antes de guardar el registro.
> Lo natal sí: no cambia, luego no puede contaminar nada.

**Precisado el 24 de agosto (decisión 0015).** Lo natal es seguro **no porque no
influya, sino porque influye igual todos los días**: un sesgo constante no puede
fabricar correlaciones falsas. Ese es el argumento, y conviene tenerlo escrito
porque «no influye» es justo lo que el proyecto se niega a dar por supuesto.

Y el eje de arriba se cruza con un segundo, que es el que reparte las pantallas 5
y 6: **la 6 lleva la magnitud, la 5 lleva el nombre.** `iluminación 97,3 %` es una
medida; `fase Balsámica` es la misma medida con una palabra que describe un ánimo.

**Dos cosas no salen en ninguna pantalla, nunca:** los biorritmos y el control de
deriva de la lunación media. Son instrumentos de validación —sirven porque
cruzarlos con los registros no puede dar nada— y un instrumento que se enseña deja
de poder decir que no. Se calculan y no se muestran.

---

*Última revisión: 12 de noviembre de 2026 — `zona` de A2 sale de la
localidad (decisión 0027); ningún campo nuevo, el total no cambia.
Revisión anterior: 28 de agosto de 2026 — `localidad` añadida a A2 (decisión
0025), `diasEnLunacion` añadido a C2 (decisión 0026), y corregida la
etiqueta de C1 (1.070→1.060, fallo aritmético preexistente, ver arriba).
Revisión anterior: 24 de agosto de 2026.*
