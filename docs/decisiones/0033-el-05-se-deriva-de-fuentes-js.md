# 0033 · El 05 se deriva de `fuentes.js`

**Fecha:** 16 de noviembre de 2026 · **Estado:** cerrada
**Origen:** pendiente 50. Ana, 16 de noviembre: opción (a), escribir el
derivador que la 0016 dejó pedido.
**Cumple:** 0016 §3 («`fuentes.js` es el original; el 05, el derivado») y su
regla de la fuente única
**No decide:** cómo se enseñan las fuentes en la app (debate C del 16 de
noviembre: solo la información y un enlace al final)

---

## El problema

La 0016 fijó el 25 de agosto que las fichas son datos y viven en
`app/js/fuentes.js`, y que `docs/05-fuentes-tradiciones.md` se generaría a partir
de ellas. El derivador no se escribió nunca. Durante casi tres meses las fichas
estuvieron dos veces: en `fuentes.js` y a mano en el 05, y ninguna prueba las
comparaba. El 13 de noviembre hubo que cambiar el nombre del ayanamsa a mano en
los dos sitios.

Al escribir el derivador apareció además que las dos copias **ya no decían lo
mismo**: el 05 tenía colaciones, ISBN de 13 cifras, cadenas de verificación y
avisos que `fuentes.js` no tenía. Y dentro del propio `fuentes.js`, la cita de
Burgess estaba copiada en dos fichas, una más completa que la otra.

## La decisión

1. **`herramientas/derivar-05.mjs` escribe la sección «Las fichas»** al final del
   05, entre dos marcas de «no editar a mano», a partir de `fuentes.js`: por cada
   dato, su estado, clase y bloque, los niveles 1, 3, 4 (con su etnografía) y 5,
   la ficha y el aviso. Se ejecuta a mano, como la hoja de cielo:
   `node herramientas/derivar-05.mjs`. La app no lo ejecuta nunca; no es un build
   step.
2. **La frontera.** Lo que es ficha —la cita, la colación, los identificadores,
   el estado, el aviso— y los textos de los niveles se escriben **solo** en
   `fuentes.js`. El resto del 05 es razonamiento y se escribe a mano: por qué esta
   fuente, cómo se resolvió cada duda, qué se midió, qué afirmación sostiene cada
   pasaje. Cada sección remite a su ficha. Las obras que no son ficha de ningún
   dato (Cornelius, Kennett, Meeus, los biorritmos) siguen fichadas en el 05, una
   sola vez.
3. **Nada se pierde al migrar.** Antes de quitar nada del 05, lo que tenía de más
   y era ficha pasó a `fuentes.js`: la colación completa y los años de Burgess, las
   tres ediciones de Rudhyar con su colación y la cadena de verificación, los
   ISBN-13 de Houlding y su depósito en la British Library, la imprenta y la
   historia de ediciones de Reingold-Dershowitz, el pie de imprenta de Balliett y
   sus dos avisos. El diff de la parte a mano se revisó línea a línea.
4. **Burgess se escribe una vez dentro de `fuentes.js`**: tres constantes
   (`BURGESS`, `VERIFICADO_BURGESS`, `AVISO_BURGESS`) que usan las fichas de
   `tithi` y `nakshatra`.
5. **Un campo de ficha nuevo para el derivador** en vez de desaparecer del 05 en
   silencio: el derivador conoce los campos que pinta y falla con cualquier otro.

## Cómo se comprueba

`pruebas/derivado-05.test.mjs`:

1. «Las fichas» es exactamente lo que genera `fuentes.js`. Cambiar una ficha sin
   regenerar hace fallar el commit.
2. Ningún identificador de una ficha (ISBN, OCLC, LCCN, WorldCat, HathiTrust,
   JSTOR, DOI, Open Library…) aparece en la parte escrita a mano, ni con su
   prefijo ni suelto.
3. Ningún título de ficha aparece en la parte escrita a mano.
4. Cada dato de `fuentes.js` tiene su remisión en el razonamiento.
5. Un campo de ficha desconocido hace fallar el derivador.
6. Las marcas están una sola vez y la sección derivada cierra el documento.

Lo que la prueba vigila es mecánico a propósito: un ISBN o un número de catálogo
copiado a mano es exactamente el dato que algún día se corrige en un sitio y no
en el otro. **No vigila** que el razonamiento no repita en prosa una cifra de un
nivel; eso queda a la revisión.

**Mutación**, 16 de noviembre de 2026, siete mutantes. Mueren seis: ficha
cambiada sin regenerar, un identificador copiado a mano con prefijo y otro sin
él, un título copiado, una sección sin remisión y un derivador que pierde los
avisos. El séptimo es un control: sin el patrón de OCLC en la prueba, un OCLC
copiado pasa, lo que confirma que cada patrón es el que atrapa su identificador.

## Lo que queda abierto

- **Debate C:** cómo se enseña la fuente en la app. No toca a esta decisión: el
  derivador escribe el documento para nosotras, no la pantalla.
