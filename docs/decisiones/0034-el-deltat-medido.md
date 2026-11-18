# 0034 · El ΔT medido del IERS

**Fecha:** 18 de noviembre de 2026 · **Estado:** cerrada
**Origen:** pendientes 51 y 54. Ana, 16 de noviembre: opción (b), una tabla de
valores medidos dentro de la app, unida después a la predicción del motor. Ana
descargó los ficheros el 18 de noviembre.
**Toca:** todas las horas que calcula Umbral, a la vez

---

## El problema

astronomy-engine calcula en TT, el tiempo uniforme que siguen los planetas, y
la hora civil cuelga de UT1, la rotación de la Tierra. La diferencia, el ΔT, no
se puede calcular: solo se mide o se predice. El motor trae un modelo (Espenak y
Meeus) que acierta en el pasado y en 2026 va **6,3 s por delante** de lo medido:
la Tierra ha girado algo más deprisa de lo que el modelo esperaba.

En las posiciones no se nota: en la Luna son 3″. En las horas sí: la salida de la
Luna que abre cada día lunar, los cambios de tithi y de nakshatra, la casilla y
los cumpleaños lunares llegaban 6 s antes o después, y como Umbral escribe al
minuto, más o menos una de cada diez horas podía salir con un minuto de
diferencia.

## La decisión

1. **`app/js/deltat.js` le da al motor el ΔT medido** con
   `Astronomy.SetDeltaTFunction`:
   - **De febrero de 1973 a octubre de 2026:** la tabla mensual del IERS
     (`deltat.data`, 645 valores, el día 1 de cada mes a las 0h UTC),
     interpolada en línea recta.
   - **Antes:** el modelo del motor, que en 1972 ya acierta a 0,02 s. Durante el
     año anterior al primer valor, la diferencia con la tabla (0,11 s) se reparte
     en línea recta para que no haya salto.
   - **Después:** la predicción del motor, desplazada −6,31 s para que empalme
     con el último valor medido. Es una predicción: nadie sabe el ΔT futuro, y
     esta no es mejor ni peor que la del motor, solo continua.
2. **Se instala al importar**, y lo importan los cuatro módulos que calculan
   (`luna.js`, `carta.js`, `quiron.js`, `calendario.js`). Ningún cálculo puede
   usar el ΔT del motor por descuido.
3. **El módulo lo escribe una herramienta**, `herramientas/actualizar-deltat.mjs`,
   a partir del fichero tal como lo publica el IERS, que se guarda en
   `pruebas/datos/iers-deltat.data`. Para actualizar: descargar el fichero nuevo,
   ejecutar la herramienta, subir VERSION, pasar las pruebas. Si un año no se
   actualiza, no se rompe nada: la tabla se queda en su último mes y a partir de
   ahí manda la predicción empalmada, que se irá separando poco a poco.
4. **`deltat.preds` no se usa.** Es la predicción del IERS, pero el fichero
   descargado es de 2022: para 2026 da 69,09 s cuando lo medido son 69,21 s.

## Qué cambia, medido

- **Contra JPL Horizons** (que usa ΔT medido hasta el 12 de noviembre de 2026):
  la Luna, de 2010 al corte, pasa de 3,41″ a 1,84″; de 2020 al corte, de 3,41″
  a 0,81″. El Sol se mueve 0,24″, dentro de su ruido. Antes de 2005 no cambia
  nada: allí el modelo ya acertaba.
- **Contra una medida independiente de la tabla:** el 15 de noviembre de 2026,
  después del último mes, la serie C04 del IERS da 69,254 s; Umbral, 69,283 s.
- **El cumpleaños lunar** de la carta de referencia se mueve 6,3 s, de 15:56:36 a
  15:56:42,8 UTC: justo lo que el motor iba adelantado.

## Cómo se comprueba

`pruebas/deltat.test.mjs`: el módulo es exactamente lo que genera el fichero del
IERS; el motor devuelve el valor medido en cada uno de los 645 meses; entre dos
meses va en línea recta; no hay saltos en los empalmes; contra dos medidas que no
salen de la tabla (la C04 de 2026 y la de 1972); y basta importar cualquiera de
los cuatro módulos para que el ΔT sea el medido. `pruebas/jpl.test.mjs` añade la
Luna de 2010 al corte a menos de 2,5″.

**Mutación**, seis mutantes, los seis mueren: un módulo que no importa
`deltat.js`, la función sin instalar, sin rampa en 1973, el futuro sin empalmar,
escalones en vez de rectas y un valor de la tabla cambiado.

## Lo que esto destapó

Al mover las horas 6 s, un cambio de pada cayó en el borde de un minuto y el
mismo día escribía «16:09» o «16:10» según el botón con que se llegara. No era
del ΔT: la rejilla de muestreo de `tramosEnIntervalo` estaba atada al inicio del
día lunar, que varía hasta 98 ms según desde dónde se calcule. Corregido el mismo
día: la rejilla está anclada al reloj y la bisección baja al milisegundo
(nota en la 0032).
