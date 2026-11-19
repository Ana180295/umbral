# 0036 · Las horas planetarias

**Fecha:** 18 de noviembre de 2026 · **Estado:** cerrada en el cálculo; abierta
en dónde se enseñan
**Origen:** pendiente 45. Ana, 18 de noviembre (debate E): «sí que entran, pero
teniendo el inicio del día cuando sale el sol y el final cuando se pone».
**Fuente:** Dion Casio, *Historia romana* XXXVII 19 (trad. Cary, Loeb, vol. III,
1914, p. 131). Ficha en el 05, clase ②.

---

## El problema

`hoja-de-cielo.mjs` tenía una sección de horas planetarias con tres fallos
medidos: escribía «día» con el Sol 45° bajo el horizonte; anunciaba las horas y
solo daba el regente del día; y tomaba el día civil, así que entre la medianoche
y la salida del Sol daba el astro del día nuevo.

## La decisión

1. **El cálculo vive en `carta.js`** (`horasPlanetarias(ms, obs)`), no en la hoja.
2. **El día va de la salida a la puesta del Sol y la noche de la puesta a la
   salida siguiente**, y cada uno se parte en doce: las horas del día y las de la
   noche duran distinto según la estación (en Albacete, unos 75 y 45 minutos en el
   solsticio de verano, y al revés en el de invierno). Es la decisión de Ana: Dion
   Casio no lo dice.
   *Nota del 19 de noviembre:* ahora tiene fuente. Al-Bīrūnī, *Book of
   Instruction* §391 (trad. Wright, 1934, p. 238), dice que los astrólogos de su
   tiempo tratan por separado el día y la noche y los parten en horas desiguales.
   La leyenda del diagrama de §390 (p. 237) precisa que el día va de la salida a la
   puesta del sol; esa leyenda puede ser del traductor. Al-Bīrūnī añade que los
   indios dan el día entero, de salida a salida del sol, a un solo planeta, y que
   él lo cree más razonable. Ficha pendiente en el 05.
3. **El orden y la regla son los de Dion Casio:** Saturno, Júpiter, Marte, Sol,
   Venus, Mercurio, Luna; la primera hora de cada día es la de su regente, y
   siguiendo las 24 horas la primera del día siguiente cae en el siguiente día de
   la semana.
4. **Entre la medianoche y la salida del Sol sigue siendo el día anterior.**
5. **El día de la semana es el del sitio**, tomado por su hora solar media, no
   por UTC ni por una zona horaria: en Auckland, la salida del miércoles cae el
   martes en UTC.
6. **Cada salida del Sol se busca siempre desde la medianoche solar de su día.**
   La búsqueda del motor da resultados que difieren décimas de segundo según desde
   dónde arranque; así, el día termina exactamente donde empieza el siguiente.
7. **Donde el Sol no sale o no se pone** (noche o día polar) no hay horas, y se
   devuelve null.
8. **La hoja** escribe el regente del día, la hora del nacimiento y la tabla de las
   24 horas con su hora de inicio y fin.

## Cómo se comprueba

`pruebas/horas-planetarias.test.mjs`: una semana entera con su regente; la regla
de Dion contra días calculados por separado (60 días en Albacete, Buenos Aires y
Auckland, empezando la búsqueda a horas distintas); el fallo 3 (las 03:00 de un
miércoles son del martes); horas desiguales y sin huecos en los dos solsticios; el
día de la semana del sitio en Auckland; la noche polar en Tromsø.

**Mutación**, seis mutantes, los seis mueren: día de la semana en UTC, día que
empieza a medianoche, horas iguales, Venus y Mercurio cambiados de orden, y dos
formas de buscar la salida siguiente sin la medianoche solar. Uno de estos
sobrevivía con la prueba de 14 días en un solo sitio; se amplió la prueba hasta
que cayó.

## Lo que queda abierto

**Dónde se enseñan en la app.** Va con la pantalla del debate A: cuando se decida,
las horas planetarias pasan a ser un dato con su ficha en `fuentes.js`, y la cita
de Dion pasa del 05 a la ficha.
