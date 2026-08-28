# 0026 · El dibujo del Espiral pasa a tres anillos paralelos

**Fecha:** 28 de agosto de 2026 · **Estado:** cerrada
**Modifica:** cómo se dibuja el Espiral en la pantalla `calendario`
(decisión 0012), sin tocar la numeración de Lunación/Día/Espiral en sí
**Depende de:** 0012 (el calendario personal) · `app/js/calendario.js`

---

## El problema

El dibujo del Espiral solo enseñaba un nivel: un punto por lunación del
Espiral en curso, el de hoy en oro. La cifra de texto debajo —«Espiral 29 ·
Lunación 10 · Día 16»— ya decía los tres números, pero el dibujo solo
representaba uno.

## Lo que se probó y se descartó

Un punto continuo moviéndose dentro del día, marcando la fracción de tiempo
transcurrida entre una salida de la Luna y la siguiente. Se descartó porque
el propio proyecto prohíbe tratar el día lunar como algo con subdivisiones
de reloj civil (`luna.js`: *"NO SE USA NINGUNA DURACIÓN MEDIA, NI AQUÍ NI EN
NINGUNA PARTE"*) — y un indicador continuo habría sido exactamente esa
convención, solo que dibujada en vez de escrita. Se sustituyó por un
marcador discreto: qué número de día es, igual que los otros dos niveles.

Un anillo con un punto por cada Espiral vivido, a la misma escala que los
otros dos. Descartado por Ana directamente: *"yo tengo 30 años, no vamos a
dibujar 30 bolas."* Treinta años son unos 26 Espirales — 26 puntos ya no se
leen como espiral, se leen como ruido. Espiral se queda con una sola marca,
sin historial alrededor.

## La resolución: tres anillos, misma pregunta, tres escalas

Cada anillo contesta lo mismo — cuántos caben dentro del de arriba — a una
escala distinta:

| Anillo | Pregunta | Puntos | Resaltado |
|---|---|---|---|
| Día | Cuántos días tiene la lunación en curso | `cal.diasEnLunacion` | `cal.dia` |
| Lunación | Cuántas lunaciones tiene el Espiral en curso | `total` (ya existía) | `cal.lunacion` |
| Espiral | — | 1 (sin contar historial) | siempre |

**Geometría: en paralelo, sin girar cada anillo por separado.** Se probó
primero con cada anillo rotado a un ángulo de arranque distinto, para que
los puntos de los tres no coincidieran — la persona pidió ver la versión
sin ese desfase, «a ver qué tal queda», y esa es la que se quedó: mismo
centro, mismo ángulo de arranque, bandas de radio separadas y no
solapadas.

**Colores: los tres, ya existentes en la paleta, ninguno inventado.**
Lunación conserva `--oro` — es el anillo que ya existía, solo cambia de
radio. Día usa `--malva`. Espiral usa `--crema`. Los puntos que no son
«hoy» van más tenues por opacidad, no por un color distinto — nada de
números repetidos dentro del dibujo, ya se leen en la cifra de debajo.

## El dato nuevo: `diasEnLunacion`

`app/js/calendario.js` → `calendarioPersonal()` ya calculaba internamente
cuándo termina la lunación en curso (para saber cuándo pasar a la
siguiente), pero descartaba ese instante al salir del bucle. Se captura en
`finLunacionActual` y se usa para contar cuántos días lunares caben en la
lunación entera — no una media, el número real de esta lunación concreta,
mismo criterio que el resto del proyecto.

El recorrido **continúa** el que ya hacía la función para encontrar `dia`,
no lo repite desde el principio.

### El fallo real, encontrado escribiendo la prueba, no por mutación

La primera versión sumaba un día **antes** de comprobar si `diaLunar()`
había encontrado el siguiente. Cuando el hueco astronómico que ya declara
`luna.js` («un día sin salida no es un día sin Luna») caía justo en el
último paso del recorrido, se contaba un día que nunca se llegó a
confirmar. Corregido: solo se cuenta después de una llamada a `diaLunar()`
que devuelve algo, nunca antes.

`pruebas/dias-en-lunacion.test.mjs` — nueva, seis casos, tres mutaciones
deliberadas, las tres cazadas. **No es una prueba dorada contra el motor
real**: prueba la lógica de conteo con un `diaLunar` de mentira,
determinista, construido para el caso de prueba y no para imitar el cielo.
No sustituye a `pruebas/calendario.test.mjs` contra `astronomy-engine`
real — sigue haciendo falta correrla para confirmar que `diasEnLunacion`
da un número sensato (27-31, del orden esperado) contra la carta de
referencia del proyecto.

## Lo que no cambia

- `espiral`, `lunacion`, `dia`, `inicioEspiral`, `inicioLunacion`: idénticos
  a como salían antes — el diff contra el archivo real lo confirma línea a
  línea.
- La numeración del Espiral, de la Lunación y del Día en sí: nada de esto
  toca cómo se cuentan, solo cómo se dibujan.

## Lo que esto no resuelve

1. **La atribución CC BY 4.0 de GeoNames** (decisión 0025) sigue sin sitio
   en pantalla — no relacionado con este dibujo, pero pendiente de la misma
   sesión.
2. **Los radios exactos de las tres bandas** (10-32 / 38-60 / marca a 70,
   sobre un `viewBox` de 300×210) se eligieron a ojo para que las tres
   cupieran sin que la de Día se aplastara contra el centro. Elegidos sin
   ver el resultado con datos reales en el navegador — pendiente de ajuste
   tras probarlo en el móvil.
3. **`02-inventario-de-datos.md`, clase C2** no se ha tocado: `diasEnLunacion`
   es un derivable nuevo y el recuento de «1.171 valores derivables» no lo
   incluye todavía. Anotado en el parche al inventario, sin resolver la
   cifra exacta — exige repasar el documento entero, no algo que deba
   hacerse a ciegas.
