# 0020 · Noches sin Luna en Albacete, 2026

**Fecha:** 26 de agosto de 2026
**Estado:** cerrada
**Relacionada con:** `01-pendiente.md` 24 · `03-registro-de-datos.md`, §8 de la
hoja de verificación de `luna.js`

---

## El problema

La fila «63 ± 2» de la §8 se usaba como prueba dorada sin que constara qué
definición de «noche» se había empleado para llegar a ese número. Medida con
astronomy-engine 2.1.19 sobre Albacete 2026, ninguna de las cuatro
definiciones habituales de noche daba 63:

| Definición de noche | Noches sin Luna en 2026 |
|---|---|
| Astronómica, Sol bajo −18° | 59 |
| Náutica, Sol bajo −12° | 45 |
| Civil, Sol bajo −6° | 25 |
| De puesta a salida de Sol | **10** |

Contando, en cada caso, las noches en que la Luna permanece bajo el horizonte
durante todo el intervalo. La más cercana a 63 —la astronómica, con 59— queda
igualmente fuera de la tolerancia de ±2 que la ficha original declaraba.

## La decisión

Se sustituye la fila de la §8 por: **«noches sin Luna en Albacete en 2026,
con criterio vivido (puesta a salida de Sol): 10».**

Se descarta el criterio Civil, pese a ser el que numéricamente más se acerca
al 63 original (25 frente a 10), porque el criterio elegido tiene que
corresponder a lo que el proyecto puede pedirle a alguien que compruebe a
ojo —la noche que se vive sin reloj de por medio, entre que se pone el Sol y
vuelve a salir—, no a un umbral técnico de grados de iluminación del cielo
que nadie percibe como frontera.

## Consecuencia

Con método explícito, la fila deja de ser un número heredado y pasa a ser
prueba dorada en `pruebas/luna.test.mjs`.
