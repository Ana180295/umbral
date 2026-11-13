# 0030 · La carta sin hora exacta: los dos extremos de la franja

**Fecha:** 13 de noviembre de 2026 · **Estado:** cerrada
**Origen:** pendiente 43. Ana, 12 de noviembre: «me parece bien, calculamos en los
dos extremos, y los ascendentes, etc. con la hora exacta, como dices»
**Depende de:** 0022 (franjas de 3 h) · 0027 (zona del nacimiento) · 0028
(`carta.js`)
**No decide:** qué pasa con «No lo sé». Sigue en `sin_dato`, igual que la época

---

## El problema

Quien no sabe su hora de nacimiento elige una franja de 3 h (0022). En 3 h el
tiempo sidéreo avanza 45°, así que el Ascendente recorre del orden de signo y
medio; la Luna avanza unos 1,7°, más que el orbe de 1°. Dar la carta de un
instante cualquiera de la franja sería suponer una hora. No darla sería tirar lo
que sí se sabe, que es casi todo.

## La decisión

1. **Se calcula en los dos extremos de la franja**, el inicio y el último
   milisegundo antes del final, en las coordenadas del nacimiento.
2. **Lo que coincide en los dos, se da. Lo que no, se da como
   `{ entre: [inicio, final] }`.** Nunca se elige uno, nunca se da el valor del
   medio. Vale para signos tropicales y sidéreos, retrógrado, las rejillas
   Luna−Sol, el nakshatra y el término solar. Las longitudes se dan siempre como
   intervalo.
3. **El Ascendente, el Medio Cielo y las casas solo con hora exacta.** Con
   franja salen como `null`, y con el motivo escrito. Ni siquiera como
   intervalo: uno que abarca signo y medio no es un dato.
4. **Los aspectos y los paralelos salen como `seguro` o como `posible`.**
   - `seguro` quiere decir dentro del orbe en los dos extremos, y por tanto en
     toda la franja.
   - `posible` quiere decir dentro del orbe solo en una parte de la franja:
     depende de la hora que no se sabe.
   - Para no perder el aspecto que se hace exacto en medio estando fuera del
     orbe en los dos extremos, se mira la **desviación con signo** respecto al
     ángulo exacto: si cambia de signo entre los dos extremos, el aspecto se
     hizo exacto dentro.
5. **La ventana no puede pasar de 4 h**, y el código lo rechaza
   (`VENTANA_MAXIMA_MS`).
   - Las franjas son de 3 h, pero la del día que se atrasa la hora en otoño
     dura 4 h reales.
   - En 4 h la Luna se mueve como mucho ~2,6° respecto a otro cuerpo, menos que
     el tramo más estrecho que se usa (el karana, 6°): ninguna rejilla puede
     cruzar dos fronteras, y por eso bastan dos extremos.
   - En 24 h el tithi sí podría cruzar dos fronteras, y «entre a y b» se comería
     el del medio. Por eso «No lo sé» no puede tomarse como una franja de 24 h
     con este método: haría falta otro método, y otra decisión.
6. **La franja se convierte en instantes con la misma función que la época**
   (`limitesDeFranja`, en `perfil.js`), para que la época y la carta no puedan
   entender la misma franja de dos maneras.

## Cómo se comprueba

`pruebas/carta-ventana.test.mjs`, nuevo, con 10 pruebas:
- **La 3 y la 3b** no comparten el método que comprueban: barren 120 ventanas de
  3 h y otras 120 de 4 h repartidas por 2026, minuto a minuto, y exigen que la
  fuerza bruta diga exactamente lo mismo que los dos extremos.
- **Las de la carta de referencia** cubren la franja de 21:00 a 24:00: la Luna
  sigue en Libra; el karana sale «entre 37 y 38»; el sextil Luna–Júpiter sale
  `posible`, porque se hace exacto dentro.
- **Mutación:** 9 mutantes, los 9 muertos.
  - El de quitar la detección del cruce sobrevivía con franjas de 3 h. Con 3 h
    no puede darse ese caso, porque haría falta moverse más de 2°.
  - Con las ventanas de 4 h muere. La detección es necesaria justo en la franja
    más larga que existe.

## Lo que esto no resuelve

- **Los paralelos usan declinación topocéntrica** (pendiente 44); con franja
  también.
- **«No lo sé»** sigue sin carta y sin época.
- **Sin pantalla:** como todo el motor, `cartaDelPerfil()` existe y no la enseña
  nadie hasta que se decida dónde vive (pendiente 43).
