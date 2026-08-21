# 0005 — La marca no gasta el color de los datos

**Fecha:** 20 de agosto de 2026 · **Estado:** cerrada · **Depende de:** 0002 (color)

## Contexto

La brújula elegida como icono trae cuatro colores medidos del propio fichero:

| Papel | Hex | Dónde |
|---|---|---|
| Nocturno | `#0A0E19` | **el `--noche` de `index.html`**, no el del PNG original |
| Crema | `#eee5c9` | puntas claras de la rosa |
| Malva | `#89749f` | puntas en sombra |
| Turquesa | `#3f9497` | cinta izquierda |
| Ámbar | `#f4a028` | cinta derecha y centro |

Esto choca de frente con dos reglas ya escritas. La sección 6 dice que el color
**solo** puede significar identidad fija de familia de datos. La decisión 0002
dice que los cinco colores de familia quedan declarados en los tokens pero
**sin usar** hasta la Fase 2. Si mañana el turquesa acaba siendo "aire" y el
ámbar "sol/luz", el logo lleva meses gastando esa señal antes de que exista.

## Decisión

**Se adopta la brújula, y sus cinco hexadecimales quedan reservados para la
marca.** Ninguna familia de datos podrá usar el crema, el malva, el turquesa ni
el ámbar de esta tabla, ni un vecino que se confunda con ellos a simple vista.

En `css/tokens.css` van con prefijo propio, para que la separación se vea en el
código y no dependa de que alguien se acuerde:

```css
:root {
  /* Marca. No los usa ningún dato, nunca. */
  --marca-nocturno: var(--noche);   /* #0A0E19 */
  --marca-crema:    #eee5c9;
  --marca-malva:    #89749f;
  --marca-turquesa: #3f9497;
  --marca-ambar:    #f4a028;

  /* Familias de datos: se rellenan en la Fase 2, y no de esta lista. */
}
```

`--marca-nocturno` es el `--noche` que ya estaba en `index.html`. Los iconos se
regeneraron sobre él: el PNG original venía en `#040618` y el fondo de la app
manda sobre una imagen que llegó después. Tiene que coincidir con `theme_color`
del manifest o la pantalla de arranque parpadea en otro tono. Hay una prueba
dorada que lo comprueba.

## Lo que queda pendiente, no decidido

**La portada tiene una aguja roja.** En una interfaz cuya sección 7 prohíbe el
alarmismo visual y exige que ningún dato se comunique solo por color, el rojo
es el color con más carga preexistente que hay. Aquí no codifica nada —es una
ilustración, no un canal— pero conviene que no comparta pantalla con ningún
indicador. Sugerencia: la portada vive en la pantalla de arranque o en "sobre
esta app", no encima de "Mi registro". Va a `docs/pendiente.md`.

## Sobre el peso

Los originales pesaban 5,8 MB y 2,3 MB. En una app cuyo presupuesto entero lo
marcan el motor astronómico (45,6 KB) y la tipografía (13,5 KB), meterlos tal
cual habría multiplicado el tamaño por cien.

Derivados que sí entran:

| Fichero | Peso | Uso |
|---|---|---|
| `iconos/icono-192.png` | 11 KB | lanzador |
| `iconos/icono-maskable-512.png` | 41 KB | Android, con zona segura |
| `iconos/icono-512.png` | 70 KB | pantalla de arranque |
| `iconos/icono-180.png` | 10 KB | iOS |
| `iconos/icono-32.png` | 0,7 KB | pestaña |
| `imagenes/portada-720.webp` | 47 KB | portada |
| `imagenes/portada-1200.webp` | 125 KB | **no se empaqueta hoy** |

**La portada de 1200 no vive en `app/` siquiera, sino en `datos/derivado/`.** 125 KB por una imagen
decorativa en una app de móvil que tiene que abrir sin cobertura no se paga
solo. Entra si algún día hay pantalla grande.

Total empaquetado: unos 180 KB. Sigue siendo tres veces el motor astronómico
por algo que no calcula nada. Es un precio consciente, no un descuido.

## Addendum del 21 de agosto — el choque ya existe

`index.html` **ya declara** cinco colores de familia, y tres se pisan con la marca:

| Familia | Hex | Choca con |
|---|---|---|
| `--fam-atmosfera` | `#8FC7C7` | turquesa de marca `#3f9497` |
| `--fam-kp` | `#E09A6B` | ámbar de marca `#f4a028` |
| `--fam-luna` | `#E8C48A` | `--oro` `#D9B87C`, que ya estaba |

Los dos primeros son la marca gastando señal antes de la Fase 2, que es justo lo
que esta decisión quería evitar. El tercero es anterior a todo esto y no lo trae
el logo: **`--fam-luna` y `--oro` son casi el mismo color**, y el oro es el acento
de interfaz. Un dato y un adorno con el mismo tono es el problema más difícil de
ver una vez está en pantalla.

Nada de esto bloquea la Fase 0: los cinco están declarados y **sin usar**. Se
resuelve al abrir la Fase 2, y hay tres salidas —mover las familias, mover la
marca, o aceptar el solape y escribir por qué. **No decidido.** A `pendiente.md`.
