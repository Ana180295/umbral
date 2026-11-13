# 0028 · `carta.js`, el único original del cálculo astrológico

**Fecha:** 13 de noviembre de 2026 · **Estado:** cerrada
**Origen:** pendiente 43. Ana, 12 de noviembre: «si crees que es lo más óptimo,
adelante» (arquitectura) y «el instante exacto» (cumpleaños lunar)
**No decide:** dónde se ve el motor en la app, qué entra en él además de lo que
ya calculaba el script, ni los paralelos (pendientes 43 y 44, en conversación
aparte)

---

## El problema

El mismo cálculo vivía en dos sitios. `herramientas/hoja-de-cielo.mjs` tenía las
fórmulas, y `app/js/dia.js` las tenía **copiadas «literalmente»**, como decía su
propia cabecera. Es justo lo que prohíbe la regla 7 del 25 de agosto, fuente
única de verdad: dos copias se separan el día que alguien corrige una sola.

Y el script tenía un problema propio. Importaba astronomy-engine desde npm, pero
en el repositorio no hay `package.json` ni el paquete instalado, así que no se
podía ejecutar desde el repositorio. Además, las pruebas doradas de `dia.js`,
escritas contra su salida, comparaban la build de npm con la build UMD del
móvil sin que nada garantizara que fueran la misma versión.

## La decisión

1. **`app/js/carta.js` es el único original.** Allí están las longitudes, el
   ayanamsa, el retrógrado, los ángulos, las seis casas, los aspectos, los
   paralelos, las rejillas Luna−Sol, el nakshatra, los jieqi, los calendarios de
   cuenta, el tzolk'in y el cumpleaños lunar.
   - Es un módulo puro: instantes en milisegundos, observador por parámetro, sin
     DOM, sin red y sin reloj. La prueba 14 lo comprueba leyendo el fichero.
   - Spica se define una sola vez, ahí. El motor tiene ocho ranuras de estrella y
     esta ocupa la primera.
2. **`dia.js` importa de `carta.js`** y conserva sus nombres de función y sus
   campos, para que `index.html` no cambie.
3. **`hoja-de-cielo.mjs` carga la build UMD** de `app/js/vendor/` con
   `require()` e importa `carta.js`. Ya no necesita npm, y ejercita los mismos
   bytes que el teléfono. Se queda solo con la presentación y con lo que nadie
   más usa todavía: visibilidad, hora solar, horas planetarias (pendiente 45),
   numerología y la época lunar.
4. **El traslado no puede mover ningún número**, y no lo movió. La hoja de la
   carta de referencia salió idéntica línea a línea antes y después, salvo las
   dos líneas que cambiaban a propósito (puntos 5 y 6).
5. **El cumpleaños lunar es el instante exacto.**
   - Se calcula con `SearchMoonPhase` sobre el ángulo de `MoonPhase` en el
     nacimiento, la misma magnitud en las dos mitades. No se usa la resta de
     `separacionLunaSol()`, que difiere de `MoonPhase` hasta 21″, unos 40 s.
   - Antes era un barrido de 15 minutos desde la hora de ejecución: el 12 de
     noviembre daba 17:03 y el 13 daba 17:09 para el mismo retorno, que es el
     27/11/2026 a las 16:56:36.
   - El punto de partida entra por parámetro. En la hoja, el campo `desde` del
     JSON la hace reproducible.
6. **El ayanamsa se llama por lo que es: True Chitra**, Spica fijada en 180°
   (pendiente 41). El número no cambia. Corregido en `fuentes.js`, 02, 04 y 05.

## Cómo se comprueba

- **`pruebas/carta.test.mjs`, nuevo, con 17 pruebas.** Los números se copiaron
  a mano de la salida del script original, sin tocar, antes del traslado, y no
  de llamar a `carta.js`.
- **Mutación:** 15 mutantes en la primera ronda.
  - Tres sobrevivieron, y dos señalaban huecos reales: las cúspides de
    Porfirio no se comprobaban en grados, y no había ningún contraparalelo con
    que probar. Se añadieron las pruebas 15 a 17 y esos dos murieron.
  - El tercero no se puede matar: calcular la Luna por el vector geocéntrico
    en vez de por `EclipticGeoMoon` da el mismo número hasta el sexto decimal.
    Es un mutante equivalente, y se dice.
- **Las 10 de `dia.test.mjs`** pasan sin cambiar ni un valor esperado.
- **La 8 de `fuentes.test.mjs`** busca ahora en `carta.js` y en la hoja a la
  vez. Si siguiera buscando solo en la hoja, se pondría roja por haber quitado
  una copia.

## Lo que esto no resuelve, y queda dicho

- **Los umbrales del control de casas no tienen ficha.** El control retira un
  sistema si alguna casa mide menos de 5° o más de 75°, y esas dos cifras no
  están en el 03. A 69,6° N (Tromsø) retira Regiomontano y Campano a ratos: en
  un barrido de 48 horas, Regiomontano sale en 26 horas y Campano en 2.
  Matemáticamente, los dos existen a cualquier latitud; el que deja de existir
  por encima del círculo polar es Placidus. La hoja complementaria del 23 de
  agosto dice que los tres «no existen» en Tromsø, y eso solo es cierto para
  Placidus. Pendiente 48.
- **La hoja escribe los decimales con punto** («23° 46.8′», «0.318°»). Es el
  mismo tipo de fallo que el «1.5 min» de la §16; no llega a la app, pero no
  puede llegar cuando se porte. Pendiente 49.
