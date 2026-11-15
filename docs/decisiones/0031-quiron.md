# 0031 · Quirón: desde vectores de JPL, con aspectos, paralelos y casas

**Fecha:** 15 de noviembre de 2026 · **Estado:** cerrada
**Origen:** pendiente 43. Ana, 12 de noviembre: «sí a todo, incluido Quirón».
Ana, 15 de noviembre: «para Quirón quiero también los aspectos y las casas».
**Depende de:** 0028 (`carta.js`) · los vectores de JPL Horizons descargados por
Ana el 13 de noviembre
**No decide:** qué ficha lleva en `fuentes.js` ni dónde se enseña (pendientes 52
y 43)

---

## El problema

astronomy-engine no trae Quirón. Hacía falta otra fuente para su posición, con
un error medido, y decidir qué hacer con él una vez calculado.

## La decisión

1. **La posición sale de 20 vectores de estado de JPL Horizons** (JPL#171), uno
   cada ~10 años de 1905 a 2095. El `GravitySimulator` del propio motor los hace
   avanzar en pasos de 5 días, y se interpola con Hermite entre los estados
   guardados. Está en `app/js/quiron.js`.
2. **Se corrige por el tiempo de luz y por la aberración**, como el motor hace
   con los demás cuerpos. Sin esas correcciones el error contra JPL llega a
   28,8″; con ellas, 1,21″.
3. **Solo entre el 1 de enero de 1900 y el 3 de diciembre de 2099**, los
   primeros y últimos vectores descargados. Fuera de ese rango Quirón **no
   aparece en ninguna lista**: ni como `null` ni como hueco. No se extrapola.
4. **Entra en todo:** posiciones tropical y sidérea, retrógrado, casas en los
   seis sistemas, aspectos, paralelos, y la carta sin hora exacta (0030).
5. **No entra en «lo que se veía»** de la hoja. El motor no tiene su brillo, y
   con una magnitud del orden de 18 no se ve a simple vista.
6. **Los orbes no cambian.** Medidos otra vez con Quirón dentro, el día vacío
   sigue existiendo en los dos:
   - `ORBE`, en el cálculo con el que se fijó: de 4-7 días vacíos al año pasa a
     2-4;
   - `ORBE_PARALELO`: de 4-5 pasa a 3-5.

   Hay menos días vacíos, y se dice. Las cifras están en el 03.

## Cómo se comprueba

- **`pruebas/jpl.test.mjs`, nuevo:** el motor entero contra JPL Horizons. El
  Sol, la Luna, Júpiter, Urano y Quirón se comparan con las longitudes
  aparentes de JPL, con umbrales fijados sobre el error medido. Quirón, a menos
  de 1,5″ en todo el rango.
  - En mutación mueren los mutantes que quitan la aberración, el tiempo de luz,
    o que alargan el paso del simulador.
  - Dos sobreviven, y son equivalentes. Interpolar en línea recta en vez de con
    Hermite cambia ~0,1″, que la prueba no puede distinguir. Y la Luna por las
    dos vías del motor da el mismo número.
- **La carta de referencia, con Quirón:** 25° 01′ Virgo, retrógrado, casa 12 (11
  en Campano), en trígono con Neptuno a 0,673°. El retrógrado se ve en los
  propios datos de JPL. Lo que ya estaba antes no ha cambiado ni un dígito.
- **El rango:** la prueba 18 de `carta.test.mjs` comprueba que fuera del rango
  Quirón no está en las longitudes, en los aspectos ni en las casas.

## Lo que esto no resuelve

- **Sin ficha en `fuentes.js`.** Quirón no puede llegar a ninguna pantalla hasta
  tenerla (pendiente 52). La ficha de la posición es la de JPL. Si se cuenta
  algo de su uso astrológico, necesitará su propia fuente, con el mismo listón
  que el resto.
- **El borde de 1900.** La primera fecha de JPL, 1900-01-01 00:00 UT, cae 2,7 s
  antes del primer vector, porque en 1900 el ΔT era negativo. Ese instante
  exacto se queda fuera, y se dice.
