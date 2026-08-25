# 07 · Sincronización y ciclos

**Fecha:** 22 de agosto de 2026 · **Estado:** nota de trabajo, no es una decisión
**Para qué es:** debatir esto aparte, con su contexto, sin que bloquee nada
**Relacionada con:** decisión 0012 · reglas 0.1 y 0.2

---

## De qué va esto

Durante la sesión del 22 de agosto apareció una idea que merece una conversación
propia. En palabras de Ana:

> «Tengo la creencia de que si cogemos ciertos parámetros, podremos hacer un
> calendario lo más sincronizado con todos los ciclos personales y externos.»

Y, un rato después, la frase que la acota:

> «En ningún momento busco influir, quiero que nos preguntemos qué es lo que
> realmente nos influye.»

Las dos frases son compatibles. Pero entre una y otra hay un punto donde el
proyecto se puede torcer sin que nadie lo decida, y este documento existe para
señalar exactamente dónde está ese punto.

---

## Dos afirmaciones que parecen una

**Afirmación A — un calendario puede sincronizarse con ciclos externos.**

Esto no es una hipótesis: es aritmética. Un calendario construido sobre lunas
nuevas verdaderas *está* sincronizado con la lunación, porque se ha construido
así. No hay nada que comprobar, y no puede fallar.

**Afirmación B — tus ciclos personales coinciden con esos ciclos externos.**

Esto sí es una hipótesis. Es una afirmación sobre el mundo, puede ser falsa, y
solo la pueden responder tus propios datos.

**El riesgo está en usar A para dar B por hecha.** Si los parámetros del
calendario se eligen *buscando* que encajen con lo que ya sientes, habremos
construido la respuesta dentro de la pregunta. Y luego, cualquier coincidencia
que aparezca será nuestra, no del cielo.

---

## El orden que hace que la respuesta signifique algo

1. **El calendario se construye solo con reglas astronómicas y tradicionales.**
   Sin mirar ni un registro. Sus parámetros se justifican por el cielo o por una
   tradición documentada, nunca por «así cuadra mejor con mis datos».
2. **Los registros se recogen aparte**, con su propio reloj civil, como manda la
   decisión 0012.
3. **Después** se mira si algo casa.

Así, si casa, significa algo. Al revés, no significa nada — y lo peor es que
*se sentiría* igual de convincente.

---

## Qué querría decir exactamente «sincronizado»

La palabra admite al menos tres cosas distintas, y conviene elegir cuál antes de
buscar nada:

- **Correlación.** Los días de más forzamiento de marea tienden a coincidir con
  valores más altos (o más bajos) en alguna escala. Es lo más fácil de mirar y
  lo más fácil de confundirse.
- **Enganche de fase.** Tus máximos caen siempre en la misma fase de la
  lunación, aunque la magnitud varíe. Es más exigente y más interesante.
- **Arrastre.** El ciclo externo *mueve* al tuyo. Esto es lo que casi nadie
  puede demostrar con datos de una sola persona, porque haría falta que el ciclo
  externo cambiara y el tuyo lo siguiera.

**Lo honesto es aspirar a las dos primeras y no nombrar la tercera.**

---

## Lo que puede engañar

Estas son las trampas concretas que tendría que sortear cualquier respuesta,
apuntadas ahora para que no haya que descubrirlas con los datos ya mirados.

**La semana.** El ritmo de siete días es humano, no astronómico, y sin embargo
manda muchísimo en cómo estamos. Siete días y 29,53 no encajan, así que los dos
ciclos baten uno contra otro y producen patrones aparentes que no son de
ninguno de los dos. Cualquier análisis lunar tiene que descontar antes el día de
la semana.

**Las estaciones.** La luz, la temperatura y la duración del día se mueven a lo
largo del año y afectan a casi todo. Un año de datos es el mínimo para poder
separar lo lunar de lo estacional; con menos, se confunden.

**Mirar muchas cosas a la vez.** Cuatro escalas × varias fases × varios
retardos son decenas de comparaciones. Con suficientes comparaciones, *siempre*
sale alguna que parece significativa. La única defensa es **escribir antes qué
se va a mirar**, y contar cuántas cosas se miraron.

**Los datos que se apuntan cuando pasa algo.** Los días raros se registran más
que los normales. Si la app se abre más cuando algo va mal, la muestra se
inclina sola.

**Otros ciclos propios.** Cualquier persona tiene ritmos propios de duración
parecida a un mes que no vienen del cielo. Si están y no se tienen en cuenta,
pueden parecer lunares por pura coincidencia de periodo.

---

## Lo que el proyecto ya hace bien

Vale la pena decirlo, porque es raro:

- Los datos autoinformados y los medidos **no se mezclan en ningún cálculo**
  (regla 0.2). Eso es exactamente lo que permite comparar después sin haber
  contaminado antes.
- Cada número tiene que tener fuente y método antes de existir (regla 0.1).
- La ausencia se enseña como ausencia. En un análisis de series temporales, un
  hueco tratado como cero es la forma más común de fabricar un patrón falso.
- Las tres anclas del día son fijas, así que las comparaciones son entre
  momentos comparables.

Un proyecto que quisiera engañarse haría lo contrario de las cuatro.

---

## Preguntas para la conversación

1. ¿Qué querría decir, en concreto, que la respuesta es «sí»? ¿Qué tendría que
   verse en los datos para que lo aceptes, y qué tendría que verse para que lo
   descartes? Escribir la segunda mitad es más importante que la primera.
2. ¿Cuánto tiempo de datos hace falta antes de mirar? Elegirlo ahora, cuando no
   se sabe la respuesta, es lo que impide elegirlo después según convenga.
3. ¿Se escribe la hipótesis antes de mirar? ¿Dónde, y con qué fecha?
4. Si el análisis sale que no, ¿qué pasa con el calendario? Puede quedarse
   igual: es bonito, es exacto, y ordena el tiempo de otra manera. No necesita
   ser predictivo para valer.
5. ¿Se enseña alguna vez el resultado dentro de la app, o vive fuera, en un
   documento? *(Enseñarlo dentro tiene un coste: convierte la app en algo que
   afirma, y hasta ahora solo registra.)*

---

## Lo que no se puede hacer, pase lo que pase

Independientemente de cómo salga cualquier análisis, la app no puede afirmar ni
insinuar que un dato externo explique un estado personal. No en un texto, no en
un color, no en una gráfica que ponga las dos curvas encima sin decir que son
independientes.

Si algún día hay algo que contar, se cuenta con su tamaño de efecto, su número
de observaciones y su margen. Y si no lo hay, se dice que no lo hay: **un «no»
bien medido es un resultado, y es tuyo igual que lo sería un «sí».**
