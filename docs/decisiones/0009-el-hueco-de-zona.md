# 0009 — El hueco de `zona` se queda en blanco

**Fecha:** 22 de agosto de 2026 · **Estado:** cerrada
**Depende de:** 0001 (zona horaria del dispositivo) · **Regla:** 0.1

## El fallo

`app/index.html`, línea 786. El objeto que se escribe en `checkins` lleva `id`,
`fecha_local`, `timestamp`, las cuatro escalas, `senal_corporal`, `necesidad`,
`accion_elegida`, `accion_resultado` y `nota_libre`.

**No lleva `zona`.**

La §4 la declara en el esquema. La §17 dice, con estas palabras, que cada
registro guarda `timestamp` y `zona`. Y la constante `ZONA` existe en la línea
484 y se pinta en el pie de la pantalla en la línea 856.

O sea: la zona se calcula, se enseña, y no se escribe. Es el peor tipo de fallo
—el que se ve por delante y falla por detrás— y ha estado activo desde el
primer registro real.

## Cuánto se pierde de verdad

Poco, pero no nada.

El `timestamp` es un instante absoluto. La Fase 1 recalcula el cielo desde ahí y
no necesita `zona` para nada: un instante ya es un instante en todo el planeta.
Lo que se pierde es **saber con qué zona se calculó cada `fecha_local`**, que
era justamente lo que la §4 quería poder reconstruir después de un viaje.

No entra en la lista corta de "grave" de la §17: los registros se guardan
enteros y se leen enteros. Así que **no se rompe la congelación de la ventana 1
por esto.** El arreglo se commitea y sale el 28 con el resto.

## La decisión

**Los registros del 21 al 27 de agosto de 2026 no llevan `zona`, y el hueco se
queda en blanco. No se rellena nunca, ni ahora ni después.**

Se consideraron y se descartan:

| Salida | Por qué no |
|---|---|
| Rellenar `zona` con `Europe/Madrid` a posteriori | Es cierto, pero es testimonio, no medición. Escribirlo en el mismo campo que los datos calculados es la regla 0.1 rompiéndose por la puerta de atrás. |
| Campo aparte `zona_reconstruida` | Más honesto que lo anterior, pero sigue rellenando un hueco que no hace falta rellenar. |
| Anotarlo solo en la hoja de ruta | Era mi propuesta. Ana la rechazó por ser más de lo necesario. |

Palabras de Ana, que son la decisión: **«si aún no lo podemos registrar, mejor
ser sinceros».**

Nótese que esta es la lectura **más estricta** de las tres, y es la correcta. Un
dato reconstruido de memoria y un dato calculado desde un `timestamp` no son la
misma clase de objeto, aunque los dos sean verdad. Confundirlos una vez enseña
a confundirlos siempre.

## Qué cambia en el código

Una línea en `index.html`, dentro del objeto `registro`:

```js
timestamp: ahora.getTime(),
zona: ZONA,
```

`ZONA` ya existe. No hay que calcular nada nuevo.

`zona` empieza a escribirse el día que esto se despliegue —el 28 de agosto— y
no antes. Los registros anteriores se quedan como están.

## Consecuencia para quien lea estos datos después

Cualquier código que lea `checkins` tiene que tratar `zona` como **opcional**, y
un `zona` ausente no es un error ni un cero: es un registro anterior al 28 de
agosto de 2026. Si alguna vista necesita agrupar por zona, esos registros van a
un grupo propio que se llama "sin zona", no al de `Europe/Madrid`.

## Lo que este fallo enseña

El esquema de la §4 no tiene ninguna prueba que lo verifique. `seleccion.js`
está cubierto por veinte pruebas porque es un módulo puro; el objeto que se
escribe en IndexedDB no lo está por nadie, porque vive dentro de un manejador de
`click` en un `<script>` clásico.

**A `pendiente.md`:** sacar la construcción del registro a una función pura
—algo como `construirRegistro(seleccion, ahora, zona)`— para que una prueba
dorada pueda comprobar que los campos del esquema están todos. No se hace hoy:
se hace cuando se toque esa parte por otro motivo.
