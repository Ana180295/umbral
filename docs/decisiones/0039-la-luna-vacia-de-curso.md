# 0039 · La Luna vacía de curso: definición moderna, del Sol a Plutón, sin Quirón

**Fecha:** 19 de noviembre de 2026 · **Estado:** cerrada la definición; sin fuente
fichable todavía, así que no sale en pantalla (0016 §7)
**Origen:** lista «Astrología» de los destacados (docs/12). Ana, 19 de noviembre:
«como definición de luna vacía vamos a usar la de la moderna»; sobre los cuerpos,
«entran todos»; tras ver la medida, «dejamos a Quirón fuera».

---

## El problema

Hay dos definiciones que no casan:

- **Lilly** (*Christian Astrology*, 1647): la Luna está vacía cuando se ha separado
  de un planeta y no se aplica a ningún otro dentro de orbe mientras siga en el signo.
- **La moderna**, difundida por Al H. Morrison en sus efemérides anuales desde los
  años setenta: desde el último aspecto mayor exacto antes de cambiar de signo hasta
  la entrada en el siguiente. Sue Ward (1992) sostiene que lee mal a Lilly.

## La decisión

1. **Definición moderna.** La Luna está vacía desde su último aspecto exacto
   (conjunción, sextil, cuadratura, trígono u oposición) con alguno de los cuerpos
   que cuentan, hasta que entra en el signo siguiente. Sin orbe: aspectos exactos.
2. **Cuentan del Sol a Plutón:** Sol, Mercurio, Venus, Marte, Júpiter, Saturno,
   Urano, Neptuno y Plutón.
3. **Quirón no cuenta.** Medido en 2026 (`herramientas/medir-luna-vacia.mjs`,
   docs/12): cambiaría 48 de los 160 periodos y quitaría 558 horas. Las tablas de
   Café Astrology no lo cuentan, y ninguna fuente de la definición moderna lo nombra.

## Comprobado

Los 40 periodos de enero a marzo de 2026 de Café Astrology coinciden con el cálculo
en cuerpo, aspecto y hora, todos dentro de 1 minuto
(`pruebas/datos/cotejo-luna-vacia-cafeastrology.json`). Debe ser prueba cuando se
programe.

## Falta

Una edición de Morrison o del *Moon Sign Book* de Llewellyn que se pueda fichar.
Mientras la fuente esté SIN VERIFICAR, la Luna vacía no se enseña.
