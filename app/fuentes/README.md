# Fuentes

**Cormorant Garamond**, peso 500, redonda e itálica. Decisión cerrada:
`docs/decisiones/0003-tipografia-cormorant.md`.

| Archivo | Peso |
|---|---|
| `cormorant-500.woff2` | 13,5 KB |
| `cormorant-italic-500.woff2` | 14,4 KB |

SIL Open Font License 1.1. `OFL.txt` debe acompañar siempre a estos archivos.

Subconjunto: `U+0020-007E, U+00A0-00FF, U+0100-017F` más comillas tipográficas,
guiones largos, puntos suspensivos, punto medio, comillas latinas y euro.

Regenerar con otro peso:

    fonttools varLib.instancer "CormorantGaramond[wght].ttf" wght=500 -o tmp.ttf
    pyftsubset tmp.ttf --output-file=cormorant-500.woff2 --flavor=woff2 \
      --unicodes="U+0020-007E,U+00A0-00FF,U+0100-017F,..." --layout-features=''

**Instanciar es obligatorio.** Sin `varLib.instancer`, el archivo sigue siendo
variable, pesa el doble y se renderiza en su peso por defecto —que en Cormorant
es 300, no 400—.

Van dentro del repositorio: no se cargan por red en ejecución.
