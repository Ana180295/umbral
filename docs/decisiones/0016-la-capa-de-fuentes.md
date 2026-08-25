# 0016 · La capa de fuentes

**Fecha:** 25 de agosto de 2026 · **Estado:** cerrada la arquitectura; el renderizador no ha empezado
**Cierra:** el pendiente 33, abierto el mismo día
**Implementa:** los niveles 1, 3, 4 y 5 de la **0018**, dentro de la pantalla `dia` de la **0015**
**Depende de:** 0015 · 0017 (el mapa) · 0018 (los niveles) · reglas 0.1 y 0.2

*Reescrita entera la misma tarde. El primer borrador la planteaba como una capa
autónoma, y no lo es: la estructura ya estaba diseñada en la 0015. Ver «el error
que casi se comete», al final.*

---

## El problema

La §10 de la hoja de ruta dice que toda tradición aparece «claramente atribuida a
autor y edición». Hoy eso **no se puede cumplir**: las fichas viven en
`docs/05-fuentes-tradiciones.md`, y `docs/` no se empaqueta. No está en `PRECACHE`
ni se sirve desde `app/`.

Una atribución que la usuaria no puede abrir no está donde tiene que estar.

---

## 0 · Qué lleva ficha y qué no

> **La capa existe para decir de quién es un dato que no es nuestro.**
> Lo que hemos construido nosotras no necesita atribución: necesita
> documentación, y esa vive en `docs/` y no viaja al móvil.

| Lleva ficha | No lleva ficha |
|---|---|
| Las tradiciones: nakshatra, tithi, fases de Rudhyar, casas, tzolk'in, jieqi, sexagenario, calendarios aritméticos | **El Compás.** Frecuencias, colas, razones y parciales son diseño nuestro. Fichados en `03-registro-de-datos.md`, y ahí se quedan |
| Lo que se le debe a un autor y una edición | **Las coordenadas de Albacete.** Vienen de fuera y se citan en `docs/`, pero son un dato de instalación, no una tradición |
| Lo complicado: lo que sin fuente sería una afirmación desnuda | Lo medido por nosotras, lo elegido por nosotras, lo que calcula el motor |

El criterio no es «tiene fuente» —casi todo la tiene— sino **«se le debe a
alguien»**. Una etiqueta nuestra no se atribuye: se explica, y se explica donde
trabajamos.

---

## 1 · Qué es esto, exactamente

**No es una pantalla nueva ni una capa aparte.** Es el contenido de los niveles
1, 3, 4 y 5 de la 0018, y vive dentro de la pantalla `dia`.

El nivel 2 —dónde cae hoy— no entra aquí: se recalcula del `timestamp`, como todo
lo de clase ①, y no se almacena nunca.

| Nivel | ¿En `fuentes.js`? |
|---|---|
| 1 · Qué es | **Sí**, texto fijo |
| 2 · Dónde cae hoy | **No.** Calculado |
| 3 · Cómo se cuenta y de dónde sale | **Sí** |
| 4 · Qué se hacía con esto | **Sí**, hoy vacío a propósito |
| 5 · Quién discute qué | **Sí**, y es la condición de entrada |

La ficha bibliográfica —autor, título, edición, editorial, ciudad, año, colación,
ISBN, identificadores— vive **dentro** del dato, junto a sus niveles, y no en una
lista aparte. Así no hay forma de que un dato exista sin su fuente al lado.

---

## 2 · El formato: renderizador propio, sin dependencia

Tres caminos había, y los tres chocaban con una regla dura:

| Camino | Exige | Choca con |
|---|---|---|
| Copiar los `.md` a `app/` y renderizarlos | Un renderizador de markdown | Una dependencia. Hoy hay cero |
| Generar un fichero de datos desde los `.md` | Un script previo al commit | ¿Es un build step? `app/` es fuente y salida a la vez |
| Escribir las fichas a mano en `app/js/` | Nada | Duplica la fuente de verdad |

**Se toma el primero mezclado con el tercero**, que es lo que evita los defectos de
ambos: un renderizador **propio y mínimo**, escrito para esta estructura y no para
markdown genérico, que lee un fichero de datos del propio proyecto.

- **Sin dependencia.** El renderizador es nuestro y solo entiende estos niveles.
- **Sin build step.** La app funciona con lo que hay en `app/`, sin ejecutar nada.

---

## 3 · La dirección de la derivación, y es al revés de lo que parecía

**`app/js/fuentes.js` es el original. `docs/05-fuentes-tradiciones.md` es el
derivado.**

La intuición inicial era la contraria —el documento primero, el código después— y
estaba mal. Un ISBN, un año, un estado de verificación son **datos
estructurados**, no prosa. Escribirlos en markdown y parsearlos es frágil y exige
un parser; escribirlos como objetos y generar el markdown no cuesta nada.

Eso parte en dos lo que hoy está mezclado en el 05:

| Qué | Dónde vive | Por qué |
|---|---|---|
| **Los niveles y las fichas** | `app/js/fuentes.js` | Son datos. Van al móvil |
| **El razonamiento** — la taxonomía, los tres estados, las reglas de desempate, la línea de la vibración, por qué la 4.ª ed. y no la 3.ª | `docs/05-fuentes-tradiciones.md` | Es prosa. Es para nosotras |

### La regla de la fuente única

**Cada dato se escribe una sola vez en todo el repositorio.** Los demás sitios lo
derivan o lo referencian; nunca lo copian. Si el ISBN de Houlding estuviera en dos
ficheros, algún día corregiríamos uno y no el otro, y nada nos avisaría.

---

## 4 · Las pruebas doradas

`pruebas/fuentes.test.mjs`. Aquí es donde las reglas dejan de ser intenciones.

| # | Qué vigila | Qué regla ejecuta |
|---|---|---|
| 1 | Todo dato con `nivel1` tiene `nivel5` | La condición de entrada de la 0015 |
| 2 | Todo dato visible tiene ficha con sus campos obligatorios | La §10 de la hoja de ruta |
| 3 | `estado` es uno de tres valores, y `sin_verificar` no es visible | Los tres estados |
| 4 | Ningún `nivel4` sin fuente etnográfica de clase ⑤ completa | 0018, regla 4 |
| 5 | Ningún `nivel4` en un dato del bloque A | 0018, regla 1 |
| 6 | Ningún `nivel4` en segunda persona | 0018, regla 2 |
| 7 | **Los biorritmos no están en `fuentes.js` en absoluto** | 0015: el control negativo no llega a pantalla |
| 8 | Toda clave de `fuentes.js` existe en `hoja-de-cielo.mjs` | Que la ficha y el dato hablen del mismo objeto |

La 7 merece explicarse. La 0015 dice que los biorritmos y el control de deriva
**no se muestran nunca**, porque son el control negativo del proyecto y *el
instrumento se rompe al mirarlo*. Una prueba que compruebe su ausencia convierte
esa frase en algo que impide el despliegue, y no en una buena intención que alguien
pueda deshacer sin darse cuenta dentro de seis meses.

---

## 5 · Peso: todo en `PRECACHE`, sin carga diferida

La estimación es **12-15 KB, unos 4 comprimidos**. Frente a los 45,5 KB del motor
astronómico, es ruido.

La carga diferida ahorraría bytes a cambio de romper el funcionamiento sin
conexión. **Una atribución que no carga sin cobertura no cumple la regla**, que es
el fallo que esta decisión viene a arreglar.

Y `pruebas/precache.test.mjs` lo exige de todos modos: su primera prueba es que
todo fichero de `app/` esté en `PRECACHE`. Añadir `fuentes.js` sin tocar `sw.js`
rompe el `node --test`. Está bien que así sea.

---

## 6 · Cómo se entra y cómo se sale

**Se llega tocando la etiqueta del dato concreto**, no por un índice general. Solo
así se cumple la §10: un índice al final es una bibliografía de libro, y nadie la
abre.

**No abre una pantalla: despliega una hoja encima de donde estés**, y al cerrarla
se vuelve al punto exacto, sin scroll perdido. Con eso no se añade ningún nodo al
mapa de la 0017, que es lo correcto: los niveles son profundidad dentro de `dia`,
no un sitio nuevo al que ir.

---

## 7 · Qué estados se muestran

- **FUERTE** — se muestra sin marca.
- **DÉBIL** — se muestra **con la marca visible**.
- **SIN VERIFICAR** — no se muestra el dato.

**Abierto:** si se muestra la *existencia* de las fichas sin verificar. Decir «esto
no se enseña porque no tiene fuente comprobable» es más honesto que callarlo, pero
convierte la hoja en un inventario de agujeros. Se estudiará caso por caso.

---

## 8 · Los avisos al citar: viajan, no se pintan

Cada aviso es lo que impide que un error vuelva a entrar. La ficha dice qué es
cierto; **el aviso dice qué mentira circula**, que es otra información y a menudo
más útil. Ejemplo real: la reimpresión que mezcla el año de Servire con la
editorial y la paginación de Aurora.

**No se muestran en la app.** Son para quien mantiene la bibliografía.

Pero **el campo `aviso` vive en `fuentes.js`** con el resto de la ficha, y el
renderizador no lo pinta. Escribirlo aparte en el `.md` crearía dos sitios donde
editar lo mismo, que es lo que el punto 3 prohíbe. Viaja al móvil sin mostrarse: no
cuesta nada y no rompe la fuente única.

---

## 9 · Idioma: el inglés es de los datos, nunca de la interfaz

- **Título, editorial y ciudad, como los imprimió el editor.** *The Wessex
  Astrologer, Bournemouth*. Traducirlos rompería la posibilidad de buscarlos, que
  es para lo que sirve una ficha.
- **Todo lo que rodea a la ficha, en español:** etiquetas, estados, navegación.

Es la única excepción al «solo español» del proyecto, y está acotada a las cadenas
citadas.

---

## 10 · Sujeta a la regla de no mostrar antes de anotar

Los niveles **no se abren antes de anotar**, igual que todo lo astronómico.

Una ficha bibliográfica no dice qué significa nada, pero *saber que existe una
tradición que divide la lunación en treinta* ya es información sobre el sistema, y
podría orientar lo que anotas. El nivel 4, además, está en el bloque B por la 0018,
que es una restricción más fuerte todavía.

---

## 11 · Accesibilidad

La §7 no es negociable, y esta va a ser la parte más densa de la app: texto largo,
jerarquía profunda, muchos números y siglas.

- Los identificadores (ISBN, OCLC, DOI, LCCN) **se leen mal en voz alta**.
  Necesitan etiqueta que diga qué son, y no deben partirse a mitad de línea.
- La hoja se abre con foco gestionado y se cierra con teclado.
- El estado de verificación **no puede codificarse solo con color**.
- Sin animación, como en toda la app.

---

## Cuándo se escribe

**`fuentes.js` se escribe ahora**, con las fichas ya cerradas del pendiente 15 y
con el nivel 4 vacío según la 0018.

Va **sin enseñarse**, que no es una excepción sino el precedente que la §17 ya
estableció para `luna.js` y el motor astronómico: código que todavía no pinta nada
y se despliega igualmente, para que el día que exista la pantalla funcione sin red
desde el primer momento.

*(Aclaración que corrige un borrador anterior de esta misma decisión: la
congelación de la ventana 1 es **de despliegue, no de escritura**. La §17 dice
«durante una ventana no se despliega nada» y «commit no publica, push sí».
Escribir código durante una ventana es lo normal, y hay precedente directo: todo lo
construido el 22 de agosto se hizo dentro de la ventana 1.)*

**El orden interno no conviene invertirlo:** primero `fuentes.js` con su prueba,
después el derivador que genera el `.md`, y solo entonces el renderizador y la
hoja. Escribir la hoja primero obligaría a inventarse la forma de los datos.

---

## El error que casi se comete

Queda escrito porque es el segundo de la misma familia en dos días, y el patrón
importa más que el caso.

El primer borrador de esta decisión diseñaba «una hoja de fuentes» desde cero:
estructura propia, formato propio, navegación propia. **Ya estaba diseñada.** La
0015, cerrada el día anterior, define cinco niveles por dato y dice del quinto que
es donde viven los `[SIN VERIFICAR]`, la variante 584285, las convenciones
numerológicas y la fecha de Balliett. Eso *es* la capa de fuentes, con otro nombre.

Es el mismo mecanismo del punto 14 del Lote 3 —donde se diseñaron dos campos que
en realidad eran una pantalla— y el mismo del desfase de la 0011 con la 0015, que
la 0017 acaba de arreglar. Tres veces la misma causa: **dar por sabida la forma de
algo que ya estaba escrito en otro documento del proyecto.**

De ahí la regla que se lleva al registro de sesión: **antes de diseñar una pieza
nueva, abrir las decisiones cerradas que la rozan y comprobar si ya tiene forma.**
Cuesta cinco minutos. No hacerlo ha costado, entre las tres veces, bastante más.

---

*Cierra el pendiente 33. Deja abierto qué se hace con las fichas sin verificar (§7),*
*y el renderizador y la hoja, que necesitan el pendiente 30 cerrado.*
