# 0029 · La casilla de cierre aparece al salir la Luna

**Fecha:** 13 de noviembre de 2026 · **Estado:** cerrada
**Modifica:** «La puerta del bloque B» de la 0015, que la hacía visible «desde las
21:00 hasta el final del día lunar», con la hora declarada por la persona en
`hora_cierre_visible`
**Cierra:** el pendiente 40
**No modifica:** que la casilla no se guarda (0015) ni que solo existe cuando la
fecha mostrada es hoy (0023)

---

## El problema

La 0015 decía «visible desde las 21:00 hasta el final del día lunar — no hasta
medianoche, que es una frontera que la app no usa para nada más». El código
hacía otra cosa: `getHours() >= 21`, que además la quitaba a las 00:00, justo la
frontera que la 0015 descartaba. Y `hora_cierre_visible`, la hora declarada por
la persona, no se llegó a implementar nunca.

Al plantear el arreglo apareció un caso que la 0015 no resolvía. Si la Luna sale
a las 22:30, a esa hora empieza un día lunar nuevo, y no estaba dicho a cuál de
los dos pertenecía la casilla de esa noche.

## La decisión

Ana, 12 y 13 de noviembre: «vamos a ponerla cuando salga cada día», y
confirmado: **al salir la Luna**.

1. **La casilla aparece con la salida de la Luna que abre el día lunar de hoy, y
   sigue hasta la salida siguiente.** Es decir, todo el día lunar en curso.
2. **La hora del reloj civil deja de intervenir.** No hay 21:00, ni
   `hora_cierre_visible`, ni medianoche. La única frontera es la salida de la
   Luna, que es la unidad del calendario (0012).
3. **Consecuencia aceptada:** si la Luna sale a las 10:00, el bloque B se puede
   abrir desde las 10:00. La casilla sigue siendo una puerta que se cruza a
   propósito. Lo que deja de existir es la hora mínima para cruzarla.

## Cómo se comprueba

En `index.html`, `casillaDisponible` pasa a ser `enElDiaDeHoy`, que ya era
exactamente «la salida anterior a ahora ≤ ahora < la salida siguiente».

`pruebas/casilla.test.mjs`, nuevo, lee el fichero real y falla si la condición
vuelve a mirar la hora. Es una regla escrita como prueba, porque esa parte toca
el DOM y está en el punto ciego de la §8. Verificado por mutación: con
`getHours() >= 21` de vuelta, fallan dos de las tres pruebas.

## Lo que se retira

`hora_cierre_visible` sale del diseño sin haber llegado a existir en el código.
No hay datos guardados que migrar.
