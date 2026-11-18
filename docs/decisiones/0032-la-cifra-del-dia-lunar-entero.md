# 0032 · La cifra de cada tradición es la del día lunar entero, con sus cambios

**Fecha:** 15 de noviembre de 2026 · **Estado:** cerrada
**Origen:** pendiente 42. Ana, 12 de noviembre: opción (iii), «enseñar el cambio
dentro del día». Ana, 13 de noviembre: el 36 pide A+B+C; esta es la A.
**Depende de:** 0028 (`carta.js`, el único original) · 0029 (el día lunar va de
salida a salida de la Luna)
**No decide:** el texto propio de cada valor (36-B) ni los destacados del cielo
(36-C), que esperan al debate del 43

---

## El problema

La cifra del nivel 2 se calculaba en un instante suelto, y el instante dependía
de cómo se había llegado al día: «Día anterior» lo calculaba en el último
segundo del día lunar, «Día siguiente» en el primero y «Hoy» en el momento
actual. El mismo día enseñaba un tithi u otro según el botón. Medido en 2026: el
tithi cambia dentro del día lunar en 347 de 352 días, y el nakshatra en 345. O
sea, casi siempre.

## La decisión

1. **La cifra se calcula sobre el día lunar entero**, de `dia.empieza` a
   `dia.termina`, y no sobre un instante. Se llega al día como se llegue, el
   texto es el mismo.
2. **Si el valor cambia dentro del día, la cifra dice cada cambio y su hora**,
   en la zona de la app y en HH:MM:

   > Tithi 5 de 30 (shukla) → 6 de 30 (shukla) a las 18:54.

   Si no cambia, se escribe solo el valor, como antes.
3. **Qué cuenta como cambio**, tradición por tradición (`POR_TRADICION` en
   `dia.js`):

   | Tradición | Cambia cuando cambia |
   |---|---|
   | Zodiaco tropical y sidéreo | el signo del Sol |
   | Nakshatra | el nakshatra **o** el pada de la Luna |
   | Tithi | el número de tithi |
   | Fases de Rudhyar | el índice de fase |
   | Jieqi | el término solar |
   | Calendario islámico | la fecha (cambia a medianoche civil, según `fechaIslamica`) |

   En el zodiaco, dentro de un mismo signo, se dan los grados del principio y
   del final del día («El Sol va de 22,1° a 23,1° de Escorpio») y lo que le
   falta para el signo siguiente al acabar.
4. **Cómo se encuentran los cambios:** `tramosEnIntervalo` en `carta.js`
   muestrea cada 20 minutos y, cuando la clave cambia entre dos muestras,
   biseca hasta quedar a menos de un segundo. La hora que se enseña es el
   primer segundo con el valor nuevo. El final del intervalo es abierto: el
   último instante calculado es `termina − 1 ms`, que ya pertenece a este día y
   no al siguiente.
5. **Sin día lunar** (si `diaLunar()` no encontró las dos salidas de la Luna)
   no se pinta ninguna cifra. No se vuelve a un instante suelto, porque eso era
   justo lo que dependía del botón. La casilla de cierre se gestiona igual.
6. **Los números salen con coma decimal**, con `Intl.NumberFormat('es-ES')`, y
   las horas con `Intl.DateTimeFormat` en la zona de la app. Lo mismo para la
   hoja de cielo: ver el pendiente 49, cerrado en la misma tanda.

*Corrección del 18 de noviembre de 2026 (decisión 0034): la rejilla de 20
minutos está anclada al reloj, no al inicio del día, y la bisección baja al
milisegundo. Con la rejilla atada al inicio del día lunar —que varía hasta 98 ms
según desde dónde se calcule— el mismo cambio salía con un segundo de
diferencia, y si caía en el borde de un minuto el texto decía «16:09» o «16:10»
según el botón. Lo destapó el ΔT medido, que movió un cambio de pada a ese borde.
La prueba 3 de `pruebas/nivel2.test.mjs` es la que lo vio.*

## Por qué 20 minutos

El cuerpo más rápido de los que se cortan aquí es la Luna, que recorre un pada
(3°20′) en unas 6 horas y un tithi (12° de separación con el Sol) en unas 20 a
26 horas. Ningún valor puede cambiar dos veces en 20 minutos, así que el
muestreo no se salta ningún cambio y la bisección no se confunde entre dos.
**No es una suposición:** la prueba 1 de `pruebas/nivel2.test.mjs` barre 30
días lunares seguidos minuto a minuto, por fuerza bruta y sin `tramosEnIntervalo`,
y exige los mismos cambios, cada uno dentro del minuto en que lo encuentra el
barrido. En esos 30 días (desde el 1 de enero de 2026, Albacete) hay 198
cambios: 125 de nakshatra o pada, 32 de tithi, 31 de fecha islámica, 8 de fase
de Rudhyar y 2 de jieqi. La prueba falla si ve menos de 150.

## Cómo se comprueba

`pruebas/nivel2.test.mjs`, con `dia.js` de verdad y el renderizador de
`index.html` recortado del propio archivo:

1. Los cambios contra el barrido minuto a minuto (30 días, 5 tradiciones).
2. Siete cifras por día, y ningún número con punto decimal (30 días).
3. El mismo texto se llegue al día por su primer instante, por el último o por
   uno de en medio: los tres botones.
4. Un tithi que cambia sale con su hora; los grados del Sol, con coma.
5. Sin día lunar no hay cifras, y la casilla se esconde igual.

`pruebas/nivel4-bloque.test.mjs` sigue probando el reparto por bloques, con un
doble de `tramosDelDia`.

**Mutación**, 15 de noviembre: siete mutantes. Seis mueren: sin bisección,
muestreo cada 6 horas, final del intervalo inclusivo, volver al instante
suelto, volver a `toFixed`, quitar la hora del cambio. El séptimo, **quitar la
guarda de `diaVisto`, es equivalente**: sin ella, cada cálculo recibe `null`,
lanza, y el `try/catch` que ya había lo salta; el resultado es idéntico. La
guarda se queda porque dice lo que pasa en vez de dejarlo a una excepción.

## Lo que queda abierto

- **36-B:** un texto propio para cada valor (unas 80 líneas con su fuente).
- **36-C:** los destacados del cielo de ese día. Esperan al 43.
