# 0011 — El mapa de pantallas y la portada

**Fecha:** 22 de agosto de 2026 · **Estado:** cerrada
**Depende de:** 0005 (paleta del logo) · 0007 (el nombre)
**Retira:** el término «pantalla de umbral», que no existía
*Ampliada la misma noche con el apéndice de integración. Nada de lo anterior
se suprime.*

## Lo que había que aclarar primero

Durante la sesión llamé «pantalla de umbral» a algo que en realidad eran dos
pantallas distintas mezcladas. **El término queda retirado.** No vuelve a
aparecer en la documentación.

## El mapa

| # | Pantalla | Qué es | Cuándo |
|---|---|---|---|
| 1 | Arranque del sistema | Icono centrado sobre `#0A0E19`. **No lo dibuja la app.** | Al abrir, ~1 s |
| 2 | **Portada** | Brújula, nombre, una frase y el reloj del calendario | Cada vez que se abre |
| 3 | Resumen | Círculos concéntricos con el estado de un vistazo | Después de la portada |
| 4 | Mi registro | El cuestionario de la Fase 0 | Desde el resumen |
| 5 | Calendario | El calendario lunar personal | A continuación del cuestionario |

**Consecuencia que no es menor: la app deja de abrir sobre «Mi registro».**
Hoy `index.html` suelta directamente en el cuestionario.

Ojo con el orden real, porque el mapa de arriba es el destino y no el estado del
28 de agosto:

| | Ventana 2 (28 de agosto) | Cuando exista el resumen |
|---|---|---|
| 1 | Arranque del sistema | Arranque del sistema |
| 2 | Portada | Portada |
| 3 | **Mi registro** | Resumen |
| 4 | — | Mi registro |

El resumen no entra el 28 (ver más abajo), así que hasta entonces la portada
lleva directamente al cuestionario. El botón «Entrar» apunta a lo que haya
detrás en cada momento.

## La pantalla 1 no se puede diseñar, y hay que saberlo

Lo que se ve al abrir una app instalada **lo compone el sistema operativo**. En
Android sale del `manifest`: coge `background_color` y planta encima el icono de
512 centrado, a un tamaño que decide él. **No admite una imagen a sangre.**

Por eso el logo se ve pequeño: no está mal exportado, es que ahí solo cabe un
icono. El único margen de mejora es **regenerar el icono de 512 con un render
más nítido de la brújula**, y aun así seguirá siendo un icono centrado sobre
color liso.

*(Al integrar la portada apareció una segunda causa, medible y distinta de la
nitidez. Ver el apéndice, sección C.)*

La portada de verdad tiene que ser una pantalla dentro de la app. Que es
exactamente donde la decisión 0005 dijo que debía vivir, por lo de la aguja
roja: lejos de «Mi registro» y de cualquier indicador.

## La portada

### Se cruza con un botón

**No se va sola.** Hay un botón, y dice **«Entrar»**.

*(Esto anula una decisión anterior de la misma sesión, en la que la portada se
desvanecía sola a los pocos segundos. Se cambió al ver el prototipo: una
pantalla que lleva un reloj encima y desaparece en tres segundos no deja
leerlo.)*

### La brújula

Va **arriba del todo**, sangrada hasta los dos bordes, como una franja de altura
acotada — no como la imagen entera. Se dibuja un 34 % más ancha que la franja y
se coloca por su parte derecha, así la brújula sale del centro hacia la
izquierda y entra más corriente de luz por la derecha.

**Se disuelve con un velo, no con una máscara.** Encima de la imagen se pinta un
degradado que va del transparente al `#0A0E19` exacto, por abajo y por los dos
lados. Como el último punto del degradado **es** el color del fondo, no hay
costura posible: la imagen no se corta, desaparece.

Un primer intento recortaba la imagen con una elipse en `mask-image`, y el borde
inferior se quedaba a media opacidad en vez de llegar a cero: se veía un corte
recto de lado a lado. Queda anotado para no repetirlo.

El nombre se apoya **dentro de la zona ya disuelta**, con margen superior
negativo. No hay nada duro detrás de las letras.

### La imagen que se empaqueta

`imagenes/portada-720.webp`, 47 KB, la que ya está en `PRECACHE`.

La de 1200 px (125 KB) sigue fuera de `app/`, en `datos/derivado/`. Se prueba
con la de 720 y se decide con los ojos después del 28. Si a pantalla completa se
ve blanda en una pantalla de 3×, se sube.

### La frase

> *Los cielos siguen su curso sin avisar*
> *Tú puedes detenerte a mirar el tuyo*

Sin puntos finales, la segunda línea en cursiva y en `--oro`.

Cumple lo de siempre: no promete resultado, no nombra fisiología, y lleva el
permiso metido en la frase. Y hace lo que hace toda la app — poner lo de fuera y
lo de dentro en la misma pantalla **sin decir que una cosa explique la otra**.

Se descartó una veintena de versiones a lo largo de la sesión. Las tres que quedan guardadas en el
prototipo, por si el uso diario cansa a la elegida:

- *Ahí fuera nada se detiene / Aquí dentro sí puedes*
- *El cielo no espera a nadie / Pero tú puedes esperarte un momento*
- *Nadie le pide permiso a la luna para salir / Tú tampoco lo necesitas para parar*

### El reloj

Es la única pieza con marco —dos filetes finos, arriba y abajo—, porque es lo
único que cambia cada vez que se abre.

```
        06:25
  LUNACIÓN 4 · DÍA 12
```

Arriba, la hora civil del dispositivo, en Cormorant con cifras tabulares. Abajo,
el calendario personal (decisión 0012).

**Y mientras el motor astronómico no exista, la segunda línea dice «Sin calcular
todavía» en `--oro-tenue`.** No un cero, no una raya muda, no un valor de
relleno. El hueco se enseña como hueco. Es la regla 0.1 dibujada, y está así en
el prototipo a propósito.

### El botón

«Entrar». Se descartó «Empezar», que suena a tarea.

## El resumen (pantalla 3) queda para después

Los círculos concéntricos **no entran en la ventana del 28**. Ana: «si da tiempo
antes del 28 lo hacemos», y no lo hay. Se hacen enteros y bien, más adelante.

Tres cosas quedan escritas ahora para que no se pierdan cuando llegue el momento:

1. **Hoy solo existen cuatro escalas.** El contexto medible no llega hasta la
   Fase 2, así que unos círculos que digan «todas las energías» hoy solo pueden
   dibujar cuatro y dejar el resto esperando.
2. **Si un día conviven ahí lo autoinformado y lo medido**, el dibujo va a decir
   «esto es un sistema» aunque ningún cálculo los mezcle. Se puede hacer
   honestamente, pero hay que decidirlo al dibujarlo, no después.
3. **La trampa del radio.** Si el radio del anillo codifica el valor, entonces
   «sin dato» y «valor mínimo» se dibujan igual, y son cosas opuestas. Hará
   falta una forma distinta para el hueco: no un círculo pequeño, sino un anillo
   que no está — abierto, punteado, algo que no se pueda confundir con un valor
   bajo.

## Lo que sigue haciendo el resumen de hoy

En «Mi registro» se queda la línea de texto que ya existe:

> Hoy: 2 registros · último a las 15:41.

Sin fila de días, sin rejilla, sin recuento de días anteriores. La forma de
enseñar la historia se decide **cuando se haga el calendario**, no ahora: con
siete días de datos, cualquier fila que se dibuje tiene siete casillas, y una
fila de siete casillas es una semana con todo lo que eso arrastra (§10).

## El prototipo

`herramientas/portada.html`, al lado del prototipo del Compás.

Se dibuja en una columna de 26 rem centrada, porque esto es una app de móvil y
juzgarla a lo ancho de un monitor engaña. Lleva tres mandos que **no van a la
app**: repetir, rotar entre las cuatro frases, y pintar valores de ejemplo del
reloj lunar. Los valores de ejemplo están marcados como inventados en el propio
código.

---

# Apéndice de integración — 22 de agosto de 2026

*Escrito al llevar el prototipo a `app/index.html`. Cuatro cosas que solo
aparecieron al integrarlo, y una medición que cambia lo que hay que hacer con
los iconos.*

## A. El desvanecido no pasa a la app

El prototipo lleva `transition: opacity .7s` y una salida de 720 ms. **No se
traslada.** Era herencia de la versión que se iba sola, que esta misma decisión
sustituyó por un botón: sin desaparición automática, el desvanecido ya no
resuelve nada, solo retrasa el paso.

Y `app/index.html` declara en su hoja de estilo *«sin animación en ninguna
circunstancia: sección 7»*. Hacerle una excepción al estreno de la app sería
empezar a hacer excepciones por donde más apetece.

Al pulsar «Entrar», la portada se oculta y aparece el cuestionario. Sin más.

## B. La portada es una capa fija, y el foco va detrás

Dos cosas que el prototipo no tenía que resolver y la app sí:

- **Capa fija (`position: fixed; inset: 0`), no un bloque en el flujo.** El
  `body` de la app lleva relleno lateral propio, y la brújula tiene que sangrar
  hasta el borde. Va en `z-index: 50`: por debajo del Compás, que está en 100.
- **Al entrar, el foco salta a la pregunta** «¿Cómo estás ahora?», que recibe
  `tabindex="-1"` para poder recibirlo. Sin esto, quien navega con teclado o con
  lector de pantalla se queda al principio de un documento cuya primera pantalla
  ya no está.

**El reloj se reprograma al minuto exacto**, no cada diez segundos como el
prototipo: `60000 − (Date.now() % 60000)`. Con un intervalo redondo, la portada
podría enseñar un minuto viejo durante casi diez segundos, y esta pantalla
existe entre otras cosas para mirar la hora.

## C. Los iconos llevan dentro el nocturno que se retiró

**Esto no es una cuestión de nitidez y por eso cambia el pendiente 18.**

Medido sobre los cinco PNG:

| Icono | Lienzo | Rectángulo interior | Cuánto ocupa |
|---|---|---|---|
| `icono-32` | `#0A0E19` | `#040618` | 18,5 % |
| `icono-180` | `#0A0E19` | `#040618` | 34,9 % |
| `icono-192` | `#0A0E19` | `#040618` | 36,5 % |
| `icono-512` | `#0A0E19` | `#040618` | **39,1 %** |
| `icono-maskable-512` | `#0A0E19` | `#040618` | 21,1 % |

El dibujo no está sobre el fondo: está sobre **un rectángulo de `#040618`**, que
es el nocturno que la §2 de la hoja de ruta declaraba antes de que los tokens y
el manifest pasaran a `#0A0E19`. En el `icono-512` ese rectángulo mide 399 × 351
px y cubre el 53,4 % del lienzo.

El contraste entre los dos azules es de **1,043 : 1**. Casi nada — y justo por
eso es peor de lo que parece: no se ve como un error, se ve como un canto tenue
alrededor del dibujo, que en una pantalla OLED a oscuras es exactamente donde se
nota. Es lo mismo que la propia decisión sobre el velo de la brújula resolvía
por el otro lado.

**Ninguna de las cinco pruebas doradas lo coge.** La quinta comprueba que
`background_color`, `theme_color` y el CSS declaran el mismo nocturno, pero no
mira dentro de ninguna imagen.

**Se arregla sin volver a renderizar nada:** repintar la familia de `#040618` al
lienzo `#0A0E19`.

**Mirado y aceptado el 22 de agosto. Los cinco corregidos sustituyen a los de
`app/iconos/`.** Ana, viendo la comparación: «me gusta la de la derecha,
integrada con el fondo; así tal cual queda mucho menos cutre».

De regalo, pesan menos. Al desaparecer el rectángulo desaparece también medio
millar de tonos casi iguales que el difuminado de la paleta había repartido por
esa zona:

| Icono | Antes | Ahora |
|---|---|---|
| `icono-32` | 733 B | 572 B |
| `icono-180` | 9,8 KB | 4,3 KB |
| `icono-192` | 11,2 KB | 4,7 KB |
| `icono-512` | 71,1 KB | **20,3 KB** |
| `icono-maskable-512` | 41,5 KB | 13,0 KB |

**89 KB menos en total** — de 134 KB entre los cinco a 43, en una app que pesa 212 KB entera. Verificado sobre los
ficheros ya guardados: cero píxeles de la familia `#040618`, esquina `#0A0E19`,
la caja del dibujo intacta y el maskable sigue con el 0 % fuera de la zona segura
del 40 %.

Y el pendiente 18 original —un render más nítido de la brújula— **sigue en pie**
y es otra cosa: aquel es un rediseño, este es una corrección de color.

### De paso, los colores del logo, medidos

Nunca estuvieron escritos en ninguna ficha:

| Elemento | Color |
|---|---|
| Cara clara de las puntas | `#EDE3C7` |
| Cara malva de las puntas | `#89739F` |
| Rombo central | `#F5A028` |
| Filamentos de la izquierda | `#428E92` |
| Filamentos de la derecha | `#F5A028` |

Van a `registro-de-datos.md` junto con la afinación del Compás. → `pendiente.md` 21.

## D. La rosa junto al nombre — hay una contradicción sin resolver

La cabecera de «Mi registro» llevaba dos círculos concéntricos de relleno. Se
sustituyen por **la rosa de ocho puntas del logo, dibujada en SVG**: cada punta
partida en dos caras, crema y malva, con el rombo al centro. No es la imagen: son
veinticuatro triángulos y un rombo, unos 900 bytes, y escala sin pesar.

**Pero esto choca con la §2 de la hoja de ruta**, que dice literalmente: *«La
marca aparece una vez, no dos. La rosa es el icono de la app […]; no se repite
junto al nombre dentro de la app.»*

Contra eso, dos cosas:

1. El parche v4→v5, que es posterior y que Ana confirmó, lista **«la brújula
   junto al nombre»** como punto 3 del orden de cierre y como contenido de la
   ventana 2. Difícilmente puede referirse a la portada, que ya es el punto 2.
2. La objeción de la decisión 0005 era **la aguja roja de la fotografía**, no la
   rosa. Una aguja roja junto a cuatro escalas se lee como indicador; una rosa de
   ocho puntas sin aguja, no.

**Queda a decisión de Ana.** Si se queda, hay que corregir esa frase de la §2 al
escribir la v5. Si se va, son dos líneas de `index.html`.

## E. Son dos resúmenes, y les puse el mismo nombre

Al integrar la portada dejé el foco saltando a la pregunta «¿Cómo estás ahora?».
Ana corrigió: tiene que saltar al resumen. Y al intentarlo moví al principio de
«Mi registro» la línea que ya existía, que **no era ese resumen**.

**Son dos cosas distintas y queda escrito para no volver a mezclarlas:**

| | **El resumen personal** | **La pantalla resumen** |
|---|---|---|
| Qué dice | cuánto llevas anotado hoy | cómo está el día entero, de un vistazo |
| Forma | una línea de texto | un espacio gráfico |
| Dónde | dentro de «Mi registro», debajo del botón | pantalla propia, entre la portada y el cuestionario |
| Estado | **existe y se queda donde está** | no existe |

El movimiento se **deshace**: la línea *Hoy: 2 registros · último a las 15:41*
vuelve debajo del botón, junto al estado de la acción, que es donde estaba.

**Y hasta que exista la pantalla resumen, el foco va a la pregunta**, porque hoy
la portada lleva al cuestionario y el foco tiene que ir donde va la persona.
Cuando exista, cambia una línea de código, marcada como tal.

Lo que Ana describe de la pantalla resumen —los tres niveles en un solo espacio
gráfico: fuera, dentro y las percepciones de las energías— queda desarrollado en
`pendiente.md` 10, junto con los tres problemas que hay que resolver antes de
dibujar nada. **Va a necesitar decisión numerada propia**, porque es justo la
pantalla donde la regla 0.2 es más fácil de romper sin darse cuenta.

*(El rombo del centro va en `--oro` `#D9B87C`, el oro de la interfaz, y no en el
`#F5A028` del logo: junto al nombre manda la coherencia con el resto de la
pantalla. Si se prefiere el ámbar exacto del logo, es un valor.)*
