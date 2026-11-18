# 0035 · Todo desde el centro de la Tierra

**Fecha:** 18 de noviembre de 2026 · **Estado:** cerrada
**Origen:** pendiente 44, primera parte. Ana, 18 de noviembre (debate D): «todo
desde el centro».
**Toca:** `declinaciones()` en `app/js/carta.js`, y con ella los paralelos

---

## El problema

Las posiciones se pueden calcular desde el centro de la Tierra o desde el sitio
del observador. Para los planetas da igual; para la Luna, que está cerca, la
diferencia llega a casi un grado. El motor mezclaba los dos: las longitudes (el
zodiaco, los aspectos) desde el centro, y las declinaciones de los paralelos
desde el sitio, salvo Quirón, que ya era geocéntrico. En la Luna la diferencia
llegaba a 0,93° en 2026, más que el orbe de paralelo (0,75°): un paralelo de la
Luna podía aparecer o desaparecer solo por el método.

## La decisión

1. **Las declinaciones son geocéntricas**, aparentes, del ecuador de la fecha:
   el vector geocéntrico con aberración (`GeoVector`), llevado al ecuador de la
   fecha (`Rotation_EQJ_EQD`), como ya se hacía con Quirón. `declinaciones(ms)`
   deja de recibir el observador.
2. **Lo que sigue siendo del lugar:** las salidas y puestas (que abren el día
   lunar), el Ascendente, el Medio Cielo y las casas, y lo que está sobre el
   horizonte. Eso no es la posición de un cuerpo en la carta: es la relación del
   cielo con un sitio, y sin sitio no existe.
3. **`ORBE_PARALELO` se queda en 0,75°**, porque sigue pasando su criterio (el
   día vacío tiene que poder existir). Medido de nuevo, con el mismo método con
   que se fijó:

   | Orbe | Desde Albacete (hasta hoy) | Desde el centro |
   |---|---|---|
   | 0,70° | 3,1-3,3/día · 4-7 vacíos | 3,1-3,2/día · 5-7 vacíos |
   | **0,75°** | **3,3-3,5/día · 3-5 vacíos** | **3,3-3,4/día · 3-5 vacíos** |
   | 0,80° | 3,5-3,7/día · 2-4 vacíos | 3,6/día · 2-4 vacíos |

   Paralelos mutuos entre los once cuerpos, cada día de 2026, a ocho horas de
   muestreo. La columna de Albacete reproduce las cifras fichadas el 15 de
   noviembre: se midió lo mismo.

## Qué cambia en la carta de referencia

Los paralelos entre planetas se mueven una milésima de grado. Los de la Luna
cambian de verdad: Luna-Plutón pasa de 0,611° a 0,015°, y Luna-Saturno (0,677°)
sale del orbe. Quedan cinco en vez de seis. La prueba 7 de
`pruebas/carta.test.mjs` lo fija.

## Lo que queda abierto del 44

La segunda parte: `ORBE` (1°) se validó con tránsitos del día contra la carta
natal y se aplica también entre los cuerpos de la propia carta. Las líneas de
tránsito del bloque B (debate A, decidido el mismo día) usan justo el cálculo
con que se validó; la aplicación natal↔natal sigue sin validar por separado.
