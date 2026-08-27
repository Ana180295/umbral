# 0024 · `ORBE_PARALELO`, medido

**Fecha:** 26 de agosto de 2026
**Estado:** cerrada
**Relacionada con:** `01-pendiente.md` 31 · `03-registro-de-datos.md`,
«Aspectos — los dos orbes de `herramientas/hoja-de-cielo.mjs`» · decisión
del 24 de agosto que fijó `ORBE` en 1°

---

## El problema

`ORBE_PARALELO` estaba escrito en el código dos veces como `< 1`, sin
nombre. El 24 de agosto se le dio nombre y se declaró en
`03-registro-de-datos.md`, pero con una carencia explícita: el valor 1° era
el heredado del código, no uno contado, y no se sabía si dejaba existir el
día vacío — el criterio que sí se había usado para fijar `ORBE` («un sistema
que nunca calla no puede ser contradicho por los datos»).

## Reconstruir el método de `ORBE`

`herramientas/hoja-de-cielo.mjs` no trae el bucle de un año — vivía en un
script de un solo uso que no se guardó. Se probaron seis variantes de conteo
contra los tres pares de números ya fichados de `ORBE` (4,8/5 días vacíos a
1° · 10,1/0 a 2° · 15,9/0 a 3°), y solo una los reproduce exactos en los tres
orbes a la vez: **tránsitos del día contra la carta de referencia del
proyecto (18/02/1995, 21:43 UTC), con los 10 cuerpos más ASC y MC como
puntos natales — 120 pares, no 45.**

**Hallazgo que no estaba fichado.** Ese no es el cálculo que hace el
generador cuando produce la hoja de alguien: el código aplica `ORBE` de
forma *mutua entre los 10 cuerpos de la propia carta que se está
generando* (45 pares, sin ASC ni MC) — el cálculo que la taxonomía del
proyecto llama «aspectos natal↔natal» en `02-inventario-de-datos.md`,
distinto del «tránsito↔natal» que dio el número fichado de `ORBE`. El valor
de `ORBE` se **validó** con un método y se **aplica** con otro. Esto no
cambia la cifra ya fichada de `ORBE` —sigue midiendo lo que dice medir—,
pero es una tensión real entre el criterio de origen y el uso en producción
que conviene no perder de vista si se revisa `ORBE` en el futuro.

## El método elegido para `ORBE_PARALELO`

Por eso `ORBE_PARALELO` se midió con el método que el código sí usa de
verdad, para que criterio y aplicación coincidan al menos en uno de los dos
orbes: **conteo mutuo entre los 10 cuerpos de la misma carta**, línea a
línea con cómo `hoja-de-cielo.mjs` calcula los paralelos hoy. Sobre un año
civil completo, con ocho horas de muestreo distintas para comprobar que el
resultado no dependía de a qué hora del día se tomara la muestra:

| Orbe | Paralelos/día | Días vacíos (rango sobre 8 horas de muestreo) |
|---|---|---|
| 0,50° | 2,2 | 20–24 |
| 0,60° | 2,6 | 8–10 |
| 0,70° | 3,0 | 5–7 |
| **0,75°** | **3,2** | **4–5** |
| 0,80° | 3,3 | 2–4 |
| 0,90° | 3,7 | 0 |
| 1,00° (el valor heredado) | 4,0 | **0** |

## La decisión

**A 1° no existe el día sin ningún paralelo, bajo ninguna hora de muestreo
probada.** El valor heredado no pasa el criterio que el propio proyecto usó
para fijar `ORBE`. Se fija `ORBE_PARALELO` en **0,75°** porque:

1. Reproduce el perfil de `ORBE` con más fidelidad que ningún otro valor de
   la rejilla — 3,2 paralelos de media y 4-5 días vacíos, frente a los 4,8 y
   5 de `ORBE`.
2. Es, de toda la rejilla medida, el más estable frente a la hora de
   muestreo: el rango de días vacíos de `ORBE` a 1° oscila entre 1 y 7 según
   la hora del día que se tome como muestra (dato que tampoco estaba
   fichado hasta hoy), mientras que `ORBE_PARALELO` a 0,75° oscila solo
   entre 4 y 5.

## Consecuencia en el código

`herramientas/hoja-de-cielo.mjs`: `ORBE_PARALELO` pasa de `d.orbe_paralelo
?? 1` a `d.orbe_paralelo ?? 0.75`, configurable igual que antes. Con la
carta de referencia del proyecto, esto retira de la tabla los dos paralelos
que estaban entre 0,75° y 1° (Venus–Júpiter a 0,794°, Júpiter–Neptuno a
0,849°) sin afectar a ningún otro número de la hoja generada — verificado
por diferencia byte a byte contra la salida sin este cambio.
