# 04 · Las formas de dividir el tiempo y el cielo

Esquema del dominio. **No de nuestras decisiones**: de lo que hay.

---

## La pregunta que todos contestan

Cualquier sistema de estos hace **una sola cosa**: parte algo continuo en trozos
nombrados. Y para partirlo necesita dos decisiones:

1. **¿Dónde está el cero?**
2. **¿Cuántos trozos y de qué tamaño?**

Todo lo demás es consecuencia. Y las dos decisiones son **convenciones**: no hay
experimento que las decida.

Hay **tres tipos de cero** posibles, y solo tres:

| Tipo de cero | Anclado a | Deriva respecto a las estaciones | Deriva respecto a las estrellas |
|---|---|---|---|
| **Suceso que se repite** | Un equinoccio, un solsticio | Ninguna | ~50,3″/año |
| **Objeto que está ahí** | Una estrella | ~50,3″/año | Ninguna |
| **Instante que pasó una vez** | Una fecha histórica | Ninguna | Ninguna |

El tercero no deriva de nada **porque no persigue nada**. Es la única clase que no
puede equivocarse, y la única que no afirma nada sobre el mundo.

---

# FAMILIA A · Divisiones de la eclíptica

Todas parten el mismo círculo: el camino aparente del Sol. Cambian el cero y el
número de trozos.

| Sistema | Trozos | Tamaño | Cero | Sobre qué se mide |
|---|---|---|---|---|
| **Zodiaco tropical** | 12 | 30° | Equinoccio vernal | Cualquier cuerpo |
| **Zodiaco sidéreo** | 12 | 30° | Una estrella (Spica en Lahiri) | Cualquier cuerpo |
| **Jieqi chinos** | 24 | 15° | **El mismo equinoccio vernal** | Solo el Sol |
| **Nakshatras** | 27 | 13° 20′ | Cero sidéreo | Sobre todo la Luna |
| **Xiu chinos** | 28 | desiguales | Estrellas determinantes | La Luna |
| **Manazil árabes** | 28 | 12° 51′ | Cero sidéreo | La Luna |

### Lo que esto significa

**El zodiaco occidental y el calendario agrícola chino tienen el mismo cero.** Los
jieqi son tropicales: 24 momentos espaciados 15° contados desde el equinoccio.
La diferencia con el zodiaco no es de origen, es de resolución.

**Tropical y sidéreo no discuten dónde están los planetas.** Coinciden al segundo
de arco: es el mismo cielo. Discuten dónde empieza a contar el círculo. La
diferencia se llama **ayanamsa** y crece unos 50,3″ al año.

Verificado para 18/02/1995: ayanamsa Lahiri **23° 46,8′**. Sobre una carta real,
**9 de 12 puntos cambian de signo** al pasar de un cero al otro.

### Cómo se calcula

```
longitud sidérea = longitud tropical − ayanamsa
nakshatra        = ⌊ longitud sidérea / 13,333° ⌋
pada             = ⌊ resto / 3,333° ⌋
jieqi            = el múltiplo de 15° que el Sol acaba de pasar
```

El ayanamsa **no se copia de una tabla**: se calcula pidiéndole al motor la
longitud tropical de la estrella de referencia y restándole su valor sidéreo
fijado por definición.

---

# FAMILIA B · Divisiones del ángulo Luna − Sol

Aquí no se mide una posición: se mide **una separación**. Un solo número entre 0°
y 360°, partido de varias maneras.

| Sistema | Trozos | Tamaño | Origen |
|---|---|---|---|
| **Fases populares** | 4 | 90° | Conjunción |
| **Fases de Rudhyar** | 8 | 45° | Conjunción |
| **Tithi** | 30 | 12° | Conjunción |
| **Karana** | 60 | 6° | Conjunción |

> **Los cuatro son el mismo número con cuatro rejillas.**
> Para el 18/02/1995: separación 222,718° → fase «Llena» (tipo 5 de 8) → tithi 19.
> No son dos datos. Es un dato y dos formas de nombrarlo.

Esto se repite por todo el dominio y es el error más fácil de cometer: enseñar dos
rejillas del mismo número como si fueran dos coincidencias.

### El «cumpleaños de lunación»

Rudhyar: el ángulo Luna−Sol del nacimiento **vuelve cada mes**. Es un suceso
personal, mensual, y es pura geometría de dos cuerpos: no afirma nada.

---

# FAMILIA C · Divisiones del cielo local (las casas)

**Esta familia es distinta de todas las demás.** No divide un círculo abstracto:
divide el cielo **visto desde un punto de la Tierra en un instante**. Por eso
depende de la latitud, y por eso se rompe cerca de los polos.

Todos los sistemas coinciden en dos puntos y discrepan en los diez restantes:

- **Ascendente** — el punto de la eclíptica que está saliendo por el horizonte este
- **Medio Cielo** — el punto de la eclíptica que cruza el meridiano

| Sistema | Qué divide en doce |
|---|---|
| **Signos enteros** | Nada: la casa 1 es el signo entero del Ascendente |
| **Iguales** | La eclíptica, 30° desde el Ascendente |
| **Porfirio** | Cada cuadrante de la eclíptica, en tres |
| **Placidus** | El **tiempo**: el arco que tarda cada punto en subir |
| **Regiomontano** | El **ecuador celeste**, en doce partes iguales |
| **Campano** | El **vertical primario**, en doce partes iguales |

### La medida del desacuerdo

Sobre una carta real a 39° N, comparando los seis sistemas:

> **8 de 10 planetas cambian de casa según el sistema elegido.**
> Solo coinciden los que están a mitad de casa, donde ninguna frontera los alcanza.

Y el desacuerdo **crece con la latitud**. Por encima del círculo polar, **Placidus
directamente no existe**: el arco semidiurno se vuelve imaginario y no hay cúspide
que calcular. Las casas de tiempo fallan donde el tiempo deja de repartirse.

### Cómo se calculan

```
TSL   = tiempo sidéreo de Greenwich × 15 + longitud
MC    = atan2( sin TSL , cos TSL · cos ε )
ASC   = atan2( cos TSL , −( sin TSL · cos ε + tan φ · sin ε ) )
```

Regiomontano y Campano salen de la **misma fórmula del Ascendente**, evaluada
«bajo un polo» distinto para cada casa. Placidus necesita iteración porque la
incógnita aparece en los dos lados.

---

# FAMILIA D · Cuentas puras

No miden nada. **Por eso no pueden desfasarse de nada.**

| Sistema | Periodo | Ancla | ¿Astronómico? |
|---|---|---|---|
| **Ciclo sexagenario chino** | 60 (10 troncos × 12 ramas) | Instante histórico | No |
| **Tzolk'in maya** | 260 (13 números × 20 nombres) | Instante histórico | **No, ninguno** |
| **Haab maya** | 365 | Instante histórico | Aproximadamente |
| **Cuenta Larga maya** | Posicional, base mixta | 4 Ajaw 8 Kumk'u | No |
| **Calendario hebreo** | Lunisolar aritmético | Creación (AM) | Aproximado desde Hillel II |
| **Calendario islámico** | Lunar puro, 12 meses | Hégira | Lunar, sin corrección estacional |
| **Calendario persa** | Solar, con reglas de bisiesto | Hégira | Sí, muy preciso |
| **Biorritmos** | 23 / 28 / 33 días | El nacimiento | No |

### Lo que hace especial a esta familia

El tzolk'in es el caso extremo: **260 días sin ningún ancla astronómica**. No sigue
al Sol, ni a la Luna, ni a Venus. Es una rueda que gira porque gira.

Y el calendario islámico es el caso opuesto por elección: es lunar puro **y no se
corrige**, así que sus meses recorren el año entero en 33 años. No es un error: es
la decisión de seguir a la Luna y soltar al Sol.

> **Un cero de esta familia no afirma que ese instante influya.**
> Solo dice desde dónde se cuenta. La Hégira no sostiene que el viaje de Mahoma
> cause los meses.

### La convivencia china

El sistema chino es el precedente más útil que existe, porque **usa dos familias a
la vez y no las mezcla nunca**:

- Los **jieqi** son de la familia A: tropicales, anclados al equinoccio.
- El **ciclo sexagenario** es de la familia D: una cuenta sin ángulo.

Y hasta dentro de esa convivencia hay dos ceros compitiendo: la tradición popular
empieza el año en el **Año Nuevo lunar**; la astrología BaZi lo empieza en
**Lichun** (315°, 3–5 de febrero). **Las dos fechas pueden diferir semanas**, y quien
nace en medio tiene dos animales según a quién pregunte.

---

# FAMILIA E · Sistemas basados en la escritura

**La entrada no es un instante: es una cadena de texto.**

| Sistema | Alfabeto de origen | Asignación |
|---|---|---|
| **«Pitagórica»** | Inglés, 26 letras | A–Z → 1–9 en secuencia |
| **«Caldea»** | — | Asignación irregular, **sin el 9** |
| **Gematría hebrea** | Hebreo, 22 letras | Las letras *son* números |
| **Abjad árabe** | Árabe, 28 letras | Ídem |

### La diferencia de fondo con todas las demás familias

Gematría y abjad **no son numerología**: en hebreo y en árabe las letras ya eran
cifras. No hay tabla que elegir porque no hay asignación arbitraria.

La numerología occidental sí la tiene, y ahí está el problema. Medido:

> **16 convenciones defendibles sobre un mismo nombre → hasta 4 resultados distintos.**
> Y con el mismo sistema, cambiando solo cuánto nombre se usa: cuatro números más.

Las convenciones que hay que fijar antes de que el número signifique algo: tabla ·
tildes · la ñ · números maestros · qué parte del nombre · método del camino de vida.

**La estabilidad depende del nombre concreto.** Un nombre sin ñ y con pocas tildes
sale casi estable; uno con ambas cosas se dispersa. Eso, por sí solo, dice qué
clase de medida es.

---

# FAMILIA F · Lo que requiere un acto en el momento

I Ching, tarot, runas, geomancia.

**No derivan del nacimiento ni de ninguna efeméride.** Su naturaleza es que se
consultan al preguntar — lo que la tradición llama *katarché*. Producirlas sin que
se pidan destruye lo único que las hacía significar algo.

---

# El mapa completo

```
                        ¿QUÉ SE DIVIDE?
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ALGO CONTINUO          UNA CUENTA            UNA CADENA
        │                      │                      │
   ┌────┴────┐            FAMILIA D             FAMILIA E
   │         │         sexagenario, tzolk'in,   numerología,
FAMILIA A  FAMILIA C   haab, hebreo, islámico,  gematría, abjad
la eclíptica  el cielo  persa, biorritmos
   │        local
   │           │
FAMILIA B   6 sistemas
el ángulo   irreconciliables
Luna−Sol
```

Y fuera del mapa, **FAMILIA F**: no se calcula, se consulta.

---

# Verificación de las cinco cuestiones abiertas

## 1 · Bibliografía — parcialmente cerrada

Ver el detalle en cada punto de abajo. Sigue sin verificar la edición física de
Rudhyar, Cornelius, Houlding y las fuentes primarias de nakshatra y tithi.

## 2 · Origen por defecto del zodiaco — **no hay ninguno**

No existe forma empírica de decidir entre tropical y sidéreo: son dos convenciones
sobre dónde empieza a contar un círculo. Cualquier valor por defecto sería el
sistema decidiendo por la persona.

**Se muestran los dos, siempre etiquetados.** Y se etiqueta también el tropical,
que es justo el que nunca se etiqueta en Occidente.

## 3 · Correlación del tzolk'in — **584283**, y el porqué

La GMT es en realidad una familia de correlaciones, y las dos más aceptadas son
**584285 y 584283**, que se llevan **dos días** exactos.

> **CORREGIDO el 24 de agosto de 2026.** Este apartado decía «tres razones
> independientes» y la primera no lo era. Son **dos**.

**Lo que el radiocarbono sí hace, y lo que no.** El estudio existe —Kennett,
D. J. *et al.*, «Correlating the Ancient Maya and Modern European Calendars with
High-Precision AMS ¹⁴C Dating», *Scientific Reports* **3**, 1597 (2013)— y fechó
por AMS ¹⁴C con modelo bayesiano el tallado de un dintel de Tikal entre 658 y
696 d. C. Eso **respalda la familia GMT** frente a correlaciones alternativas que
se separan hasta mil años.

Lo que **no** hace es elegir entre 584283 y 584285. Son 48 horas, y un método con
resolución de décadas no puede arbitrar dos días. Decir que «estrecha hacia
584283» era una inferencia nuestra puesta en boca del artículo.

**Las dos razones que quedan, y las dos son de práctica y no de datación física:**

1. **La cuenta viva.** Los contadores de días k'iche' de Guatemala mantienen hoy un
   tzolk'in que concuerda con esta correlación.
2. **Uso en el campo.** Es el estándar de trabajo de la investigación actual.

**Y se escribe al lado que existe 584285**, que desplaza el resultado **dos días**.
*(Este documento ya lo decía bien; `05-fuentes-tradiciones.md` decía «un día» y era
el que estaba mal. Los dos dicen ahora dos.)*

## 4 · Numerología — **la clase E no puede mostrarse como tradición antigua**

No hay fuente primaria porque **no existe**. Lo verificado:

- El sistema llamado «pitagórico» lo construyó **L. Dow Balliett** entre 1903 y
  1908, aplicando ideas pitagóricas **al alfabeto inglés**. La etiqueta honra un
  linaje filosófico; la implementación es suya.
- **Julia Seton Sears** acuñó la palabra «numerología» hacia 1912.
- **Juno Jordan**, alumna de Balliett, formalizó camino de vida, pináculos, desafíos
  y planos de expresión.
- El marco filosófico es antiguo; **la forma práctica tiene poco más de un siglo**.

Esto no la descalifica. La **recoloca**: no es una tradición milenaria, es un
sistema del New Thought norteamericano de principios del XX. Y explica de raíz el
problema de la ñ y las tildes: **la tabla se diseñó para 26 letras inglesas**. El
español tiene 27 y vocales acentuadas. Nadie decidió nunca qué valen porque la
pregunta no existía cuando se hizo la tabla.

**Condición para mostrarla:** que aparezca la fecha real del sistema (c. 1908) y no
la de Pitágoras, y que el número vaya con sus seis convenciones.

## 5 · Cálculo de casas — **cerrado, PASA**

No se cotejó contra astro.com sino contra algo mejor: **un segundo cálculo que no
comparte una sola línea con el primero**. En vez de resolver el triángulo esférico,
se recorre la eclíptica grado a grado convirtiendo cada punto a coordenadas del
horizonte del observador y se busca dónde la altitud cruza cero por el este.

```
                  fórmula esférica    fuerza bruta     diferencia
Ascendente          197,929745°        197,929745°       0,0000′
Medio Cielo         110,592255°        110,592255°       0,0000′

Prueba de estrés: 54 combinaciones de latitud (−60° a +66°) y hora
  peor diferencia: 0,00000′     fallos: 0
```

Umbral de aceptación 1,0000′. **Coinciden exactamente.**

---

## Nota de método

Durante esta verificación aparecieron **tres fallos**, y los tres de la misma
especie: un valor que existe con otro nombre y se lee como `undefined`, o un
control que solo comprobaba donde la fórmula no podía fallar.

- Campano pasó el control «la cúspide 1 es el Ascendente» **con error exactamente
  cero** teniendo la casa 2 a medio cielo de distancia: comprobaba los dos únicos
  puntos donde la fórmula degenera y funciona aunque el resto esté roto.
- `.alt` en vez de `.altitude` hizo que 40 casos de prueba salieran «sin cruce» en
  vez de fallar. Un `undefined > 0` es `false`, y `false` no rompe nada.

Es exactamente la familia del fallo del campo `zona`: **lo que no se escribe no
avisa**. Un control que solo mira donde la respuesta es obvia no es un control.

---

*Última revisión: 24 de agosto de 2026.*
