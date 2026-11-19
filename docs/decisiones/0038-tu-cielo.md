# 0038 · «Tu cielo»: un sistema de casas cada vez, Placidus por defecto

**Fecha:** 19 de noviembre de 2026 · **Estado:** cerrada en la forma; la pantalla,
por hacer (pendiente 56)
**Origen:** debate A del 16 de noviembre (pantalla con la carta natal y una o dos
líneas en el bloque B). El 19, Ana vio dos bocetos con los datos reales de la persona
inventada de `herramientas/datos-prueba.json`: A, los seis sistemas a la vez; B, uno
con selector. Ana: «Prefiero la que da opciones, la de 6 me parecen muchos datos
numéricos que no nos dicen nada, como predeterminada usaremos la más común». Y:
«igual antes del calendario, creo que quedaría bien».

---

## La decisión

1. **Las casas se enseñan de un sistema en un sistema**, con una fila de botones
   (`.ficha`) para cambiar entre los seis que calcula `carta.js`: signos enteros,
   iguales, Porfirio, Placidus, Regiomontano y Campano. Al cambiar, cambian las doce
   cúspides y la columna «Casa» de cada cuerpo; lo demás no depende del sistema.
2. **Por defecto, Placidus.** Es el más usado hoy en la astrología occidental y el
   predeterminado en la mayoría de programas, Astrodienst incluido: lo dicen Chris
   Brennan y Anthony Louis (*The Astrology Podcast*, ep. 244, 24-2-2020) y Astrotheme.
   Estado: DÉBIL (es un dato de uso, no un texto).
3. **«Tu cielo» va antes del calendario.**
4. **Las horas planetarias en pantalla quedan pendientes** (Ana, 19 de noviembre:
   «vamos a dejarlo de momento como pendiente»). El cálculo sigue en `carta.js` (0036).

## Lo que no cambia

El motor sigue calculando los seis sistemas; la hoja de cielo los sigue escribiendo
todos.
