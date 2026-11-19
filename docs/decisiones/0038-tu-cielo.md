# 0038 · «Tu cielo»: un sistema de casas cada vez, Placidus por defecto

**Fecha:** 19 de noviembre de 2026 · **Estado:** cerrada; la pantalla, hecha el
mismo día (tanda 12). Las líneas del bloque B siguen en el pendiente 56
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

## Cómo quedó (tanda 12)

- `app/js/cielo.js`: `tuCielo(nacimiento, ahoraMs)` prepara todo en texto a partir
  de `cartaDelPerfil`, sin tocar el DOM. Minutos truncados, nunca redondeados.
  Pruebas en `pruebas/tu-cielo.test.mjs`.
- `index.html`: botón «Tu cielo →» encima de «Tu calendario personal →», y la
  sección `#cielo`. Tres vistas:
  - **sin perfil**: remite al calendario, donde se piden los datos una sola vez;
  - **sin hora** («No lo sé»): no se enseña nada; no se supone ninguna hora;
  - **la carta**.
- **Con franja** (decisión 0030): los dos extremos, como «entre 17°13′ y 17°20′
  Cáncer», sin Ascendente, Medio Cielo ni casas. Los aspectos que dependen de la
  hora llevan «según la hora». El cumpleaños lunar sale como intervalo.
- El sistema elegido dura lo que dura la visita: no se guarda.
