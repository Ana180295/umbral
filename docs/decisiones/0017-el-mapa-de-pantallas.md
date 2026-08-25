# 0017 · El mapa de pantallas

**Fecha:** 25 de agosto de 2026 · **Estado:** cerrada
**Sustituye:** la tabla de pantallas de la **0011** y la lista de orden de la **0015**
**Retira:** la costumbre de llamar a las pantallas por su número
**No toca:** nada más de la 0011 ni de la 0015, que siguen vigentes enteras

---

## El fallo que lo motiva

Dos decisiones cerradas numeraban las pantallas, y **no numeraban lo mismo**:

| | 0011 (22 de agosto) | 0015 (24 de agosto) |
|---|---|---|
| 1 | Arranque del sistema | Portada |
| 2 | Portada | Resumen |
| 3 | Resumen | Cuestionario |
| 4 | Mi registro | Calendario |
| **5** | **Calendario** | **Cómo estaba el día** |
| 6 | — | Contexto medible |

La 0011 contaba el arranque del sistema; la 0015 empezaba en la portada. Un
desplazamiento de uno, arrastrado hasta el final.

**Consecuencia real y ya presente:** el pendiente 30 se llama «la pantalla 5» y se
puede leer de dos formas incompatibles según qué decisión abras. En una es el
calendario; en otra, cómo estaba el día. Son pantallas distintas, con contenidos
distintos y decisiones distintas detrás.

No se detectó al escribir la 0015 porque nadie volvió a abrir la 0011 para
comprobar desde dónde contaba. Es el mismo mecanismo del punto 14 del Lote 3: dar
por sabida la forma de algo que ya estaba escrito en otro sitio.

---

## La regla

> **Las pantallas se nombran por su clave, no por su posición.**
> El orden es una columna de la tabla, nunca el nombre de nada.

Numerar por posición garantiza que el problema vuelva **cada vez que se inserte
una pantalla en medio**, que es algo que va a pasar: el resumen no existe todavía,
la pantalla de fuentes no existe, y la §17 ya prevé más. Un identificador que
cambia de significado cuando se inserta algo delante no es un identificador.

La clave, además, es lo que se va a usar en el código: `id="pantalla-registro"`,
`mostrar('calendario')`. Que el documento y el código llamen igual a la misma cosa
elimina un salto de traducción donde caben errores.

---

## El mapa

| Clave | Nombre | Qué es | Orden | Estado | Decisión |
|---|---|---|---|---|---|
| — | *Arranque del sistema* | **No la dibuja la app.** La compone Android desde el `manifest`: `background_color` y el icono de 512 centrado | antes de todo | existe, no es nuestra | 0011 |
| `portada` | **Portada** | Brújula sangrada, nombre, frase y el reloj del calendario. Se cruza con el botón «Entrar» | 1 | **existe** | 0011 |
| `resumen` | **Resumen del día** | Círculos concéntricos: cómo está el día entero de un vistazo | 2 | no existe | pendiente 10 |
| `registro` | **Mi registro** | El cuestionario de la Fase 0 y la práctica ajustada al momento | 3 | **existe** | — |
| `calendario` | **Calendario personal** | Lunaciones y días lunares desde la época personal | 4 | no existe | 0012 |
| `dia` | **Cómo estaba el día** | Los nombres, las tradiciones y los ritos. Dos bloques, cinco niveles | 5 | no existe | 0015 · 0018 |
| `medible` | **Contexto medible** | Las magnitudes, sin nombre y sin cualidad | 6 | no existe | — |

### Tres precisiones que la tabla no puede llevar dentro

**El arranque del sistema sale de la lista numerada.** Estaba como «pantalla 1» en
la 0011 y **no la dibujamos nosotras**: la compone el sistema operativo, no admite
imagen a sangre, y lo único que podemos cambiar de ella es el icono y el color de
fondo. Que ocupara un número era el origen exacto del desfase. Se conserva en la
tabla, arriba y sin número, porque la persona sí la ve y hay que saber que existe.

**«Resumen del día» lleva apellido a propósito.** La 0011 tuvo que escribir un
apéndice entero, su sección E, para separar dos cosas a las que había llamado
igual:

| | **El resumen personal** | **El resumen del día** |
|---|---|---|
| Qué dice | cuánto llevas anotado hoy | cómo está el día entero |
| Forma | una línea de texto | un espacio gráfico |
| Dónde | dentro de `registro`, debajo del botón | pantalla propia |
| Estado | **existe** | no existe |

El apellido es lo que impide que vuelva a pasar. **El resumen personal no es una
pantalla** y no aparece en este mapa: es una línea dentro de `registro`.

**El orden de la tabla es el destino, no el estado de hoy.** Mientras `resumen` no
exista, la portada lleva directamente a `registro`, y el botón «Entrar» apunta a lo
que haya detrás en cada momento. Esto ya estaba escrito en la 0011 y se conserva
tal cual.

| | Hoy y en el push del 28 | Cuando exista el resumen |
|---|---|---|
| 1 | Portada | Portada |
| 2 | **Mi registro** | Resumen del día |
| 3 | — | Mi registro |

---

## Qué se hace con lo escrito antes

**No se reescriben la 0011 ni la 0015.** Son decisiones cerradas y su valor está en
lo que razonaron; corregirlas a posteriori borraría el rastro de por qué se decidió
lo que se decidió, que es justo lo que las hace útiles.

Se hace esto en su lugar:

1. **Este documento manda** sobre la tabla de pantallas de la 0011 y sobre la lista
   de orden de la 0015. Ambas quedan marcadas como sustituidas *en ese punto y solo
   en ese punto*.
2. **El pendiente 30 se renombra** de «la pantalla 5» a **«la pantalla `dia`»**, que
   es lo que la 0015 quiso decir: si comparte sitio con `calendario` o va aparte.
3. **En todo documento nuevo, la clave.** Ningún texto vuelve a decir «la pantalla
   5» sin nombrarla.
4. **La v5 de la hoja de ruta** recoge este mapa. Va al pendiente 28.

---

## Lo que esta decisión no resuelve

**Si `dia` es pantalla propia o comparte sitio con `calendario`** sigue abierto: es
el pendiente 30, ahora con nombre legible. Este documento le da clave a las dos
pantallas precisamente para poder discutir esa pregunta sin ambigüedad.

**`medible` no tiene decisión propia todavía.** Está en el mapa porque la 0015 la
nombra y traza la línea que la separa de `dia` —«la 6 lleva la magnitud, la 5 lleva
el nombre»—, pero nadie ha decidido su forma.

**Dónde vive la capa de fuentes** lo resuelve la 0016: no es una pantalla del mapa,
son los niveles 3, 4 y 5 dentro de `dia`.
