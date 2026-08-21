# 0003 · Cormorant Garamond 500, empaquetada

**Fecha:** 2026-08-19 · **Estado:** cerrada

## Contexto
La maqueta usaba una didona de contraste alto tipo Playfair. Sin red no hay
fuentes web, así que o se empaqueta el archivo o se usa la pila del sistema
—que cambia de aspecto en cada dispositivo—.

## Decisión
Cormorant Garamond, redonda e itálica, instanciada a peso 500, subseteada a
latín + castellano, en woff2, dentro del repositorio.

## Motivo
Playfair copiaba mejor la maqueta, pero su contraste altísimo es de titular
de revista impresa. Esta pantalla se abre de noche, cansada, en un móvil.
Cormorant dice lo mismo en voz más baja.

## Nota sobre la comparación
La primera versión comparada de Cormorant era en realidad peso **300**: el
archivo es variable con 300 por defecto y la orden de instanciación se ignoró
sin avisar. Playfair y Spectral sí iban a 400. La comparación fue desigual
en contra de Cormorant, que aun así se eligió.

## Peso
13,5 KB por corte, 27,4 KB en total. La versión sin instanciar pesaba el
doble porque arrastraba el eje completo de 300 a 700.

## Licencia
SIL Open Font License 1.1. Obliga a conservar `app/fuentes/OFL.txt` junto a
los archivos y a no vender la fuente por separado. Nada más.

## Consecuencias
- Los titulares suben un 12 %: Cormorant tiene el ojo medio pequeño.
- `--serif-peso: 500` es el único sitio donde se cambia el grosor.
- Si algún día hay párrafos largos, hay que revisarlo: Cormorant es de
  titular, no de texto corrido.
