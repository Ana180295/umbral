# 0013 — El forzamiento de marea: dos campos, µGal, instante exacto

**Fecha:** 22 de agosto de 2026 · **Estado:** cerrada
**Reglas:** 0.1, 0.2 · **Prepara:** Fase 1

## Por qué la marea va con 1/r³ y no con 1/r²

Esto se escribe aquí porque el proyecto no admite números sin método, y el
método empieza en la física.

La atracción de un cuerpo de masa M a distancia r es proporcional a **M/r²**.
Esa es la fuerza con la que la Luna tira de la Tierra entera, y **no produce
ninguna marea**: si tirase igual de todo, la Tierra se movería junta y aquí no
se notaría nada.

La marea aparece porque no tira igual de todo. El lado que mira a la Luna está
unos 6.371 km más cerca que el centro, y el opuesto otros tantos más lejos. Lo
que estira es **la diferencia**. Y al restar dos valores de 1/r² muy próximos,
lo que queda va como **1/r³** — es la derivada de 1/r², que es −2/r³.

> **forzamiento ∝ M / r³**

**Consecuencia: en la marea, la distancia pesa mucho más que la masa.** De ahí
sale, sin ningún misterio, el 0,46 que ya estaba en `registro-de-datos.md`:

| | |
|---|---|
| El Sol tiene, respecto a la Luna | ~27 millones de veces la masa |
| pero está | ~390 veces más lejos |
| y 390³ son | ~59 millones |
| 27 ÷ 59 = | **0,46** |

El número no hay que creérselo por autoridad: sale de dividir dos cifras
comprobables. La cita de la NOAA **confirma** un cálculo, no lo sustituye. Va
tal cual en el comentario del código.

### Y de dónde sale el 2,7

La marea semidiurna lunar (M₂) vale unos 0,24 m de amplitud en el modelo de
equilibrio; la solar (S₂), unos 0,11 m. Nótese que 0,11 ÷ 0,24 = 0,458: **es el
mismo 0,46 otra vez**, lo cual es buena señal de coherencia interna.

- Alineados (luna nueva o llena): 0,24 + 0,11 = 0,35
- En cuadratura (los cuartos): 0,24 − 0,11 = 0,13
- Cociente: **2,69**

**Es una prueba, no un número de pantalla**, y va acompañado de la advertencia de
que sale del **modelo de equilibrio**, no de un mareógrafo. Los mareógrafos
reales dan otra cosa porque manda la forma de la costa.

## La decisión: se calculan y se guardan los DOS

No se elige entre la versión mensual y la instantánea. **Se recogen las dos**, en
campos separados y con nombres que digan qué son. Nunca combinados en uno.

| Campo | Qué responde | De qué depende | Cómo se comporta |
|---|---|---|---|
| `marea_mensual` | ¿En qué punto del ciclo estaba? | Distancia real de la Luna **y alineación Sol–Luna** (la fase) | No depende de la rotación de la Tierra. **Igual a las 10:30 que a las 23:00 del mismo día.** |
| `marea_instantanea` | ¿Cuánto tiraba de ti en ese segundo? | Lo anterior **más** la posición respecto a tu vertical | **Pasa por dos máximos al día**, porque la Tierra gira |

**Atención al término solar en `marea_mensual`.** Es tentador definirla como
«solo la distancia lunar», pero entonces no contendría el efecto de la fase — y
la envolvente sicigia/cuadratura de 2,7 es precisamente un efecto de fase. Con
esa definición, la prueba dorada del 2,7 no podría pasar nunca. Los dos campos
llevan el término solar; lo que los separa es **la rotación de la Tierra**, no el
Sol.

Razonamiento de Ana: primero se forman los grupos y después se ve qué preguntas
se pueden hacer con ellos. Recoger los dos cuesta un número más por registro y
evita tener que volver atrás.

*(Un detalle que la §17 ya rozaba: las anclas están a las 10:30, 15:30 y 23:00
de reloj, mientras que la Luna sale unos 50 minutos más tarde cada día. Con la
versión instantánea, la relación entre esas horas fijas y la posición lunar se
desliza a lo largo del mes. Ese deslizamiento es real, no ruido.)*

## Distancia real siempre

**Nunca la distancia media.**

Perigeo 368.249 km, apogeo 404.210 km: solo un 10 % de diferencia. Pero como va
al cubo, 1,0977³ = **1,32**. El forzamiento lunar varía un **32 % entre perigeo
y apogeo**.

Es menos que la oscilación entre sicigia y cuadratura, que es de 2,7 — pero es
del mismo orden de magnitud, y a diferencia de aquella **no se ve en el
calendario**: la fase se nota a simple vista y la distancia no. Usar la media
borraría ese 32 % sin que nada avisara, y astronomy-engine da la distancia real
sin coste.

## Se muestra en µGal

En la unidad de verdad. Nada de normalizar a 0–1 ni a media 1,00.

Órdenes de magnitud, para calibrar: la Luna aporta unos 110 µGal y el Sol unos
50. *(A verificar y fichar con el cálculo propio antes de que aparezcan en
pantalla.)*

Se descartaron:

- **Normalizado 0–1** contra el máximo del año: el 1,0 depende de qué año se
  tome de referencia, y eso habría que escribirlo o el número miente.
- **Relativo a la media = 1,00**: se lee bien, pero esconde la magnitud.

Cómo se presentan las fichas con las cifras reales se decide más adelante.

## El nombre

**Forzamiento de marea relativo.** Nunca «energía lunar», nunca «influencia».

## Se calcula en el `timestamp` exacto

Nunca al mediodía local de `fecha_local`. Motivo de Ana: las horas del registro
ya las tenemos.

Con la versión mensual casi da igual; con la instantánea cambia el número
entero, porque entre las 10:30 y las 23:00 la Luna ha cruzado medio cielo. El
mediodía sería un instante inventado.

*(Y por esto `zona` importa menos de lo que parecía en la decisión 0009: el
`timestamp` es un instante absoluto y no necesita zona para convertirse en
cielo.)*

## Lo que falta antes de escribir el código

1. La fórmula completa escrita en `registro-de-datos.md`, con las constantes
   físicas, sus fuentes y su fecha de consulta.
2. La comprobación del cociente sicigia/cuadratura ≈ 2,7 como **prueba dorada**.
3. La verificación de los 110 y 50 µGal contra el cálculo propio.
4. Fijar la edición de la que se toma el mes sinódico medio de 29,530588 días,
   que hoy está como *pendiente* en la ficha.
