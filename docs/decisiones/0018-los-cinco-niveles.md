# 0018 · Los cinco niveles y la quinta clase

**Fecha:** 25 de agosto de 2026 · **Estado:** cerrada la forma; el contenido está vacío a propósito
**Modifica:** los cinco niveles de la **0015**, en su contenido, no en su número
**Amplía:** la taxonomía de cuatro clases de `05-fuentes-tradiciones.md`
**Depende de:** 0015 (la pantalla `dia`) · 0017 (el mapa) · reglas 0.1 y 0.2

---

## Lo que se cambia y por qué

La 0015 fijó cinco niveles por dato, cada uno completo en sí mismo, sin que ninguno
termine en «y para entender esto necesitas el siguiente». Eso se conserva entero.

Lo que cambia es **qué lleva cada nivel**, por dos motivos que apuntan al mismo
sitio:

**Uno: faltaba lo humano.** Los cinco niveles eran ángulos, orígenes y ediciones.
De un calendario que existe porque generaciones de gente organizó su vida con él,
la pantalla contaba la aritmética y no contaba que alguien encendiera nada.

**Dos: de los cinco niveles, tres eran método.** El 3 (cómo se calcula) y el 4 (de
dónde sale) son casi lo mismo visto de cerca —el jieqi *se calcula* como el múltiplo
de 15° que el Sol acaba de pasar, y *sale de* tomar el equinoccio como cero: es una
sola explicación partida—. Fundirlos deja un nivel libre sin añadir un sexto, y sin
tocar la promesa de la 0015 de que cada nivel se sostiene solo.

---

## Los cinco niveles

| | 0015 | **Ahora** | ¿De dónde sale? |
|---|---|---|---|
| **1** | La frase que es botón | **Qué es** | Texto fijo, en `fuentes.js` |
| **2** | Dónde cae hoy | **Dónde cae hoy** | **Calculado** del `timestamp`. Nunca almacenado |
| **3** | Cómo se calcula | **Cómo se cuenta y de dónde sale** | Texto fijo. Los dos antiguos, fundidos |
| **4** | De dónde sale | **Qué se hacía con esto** | Texto fijo. **Nuevo: celebraciones y ritos** |
| **5** | Quién discute qué | **Quién discute qué** | Texto fijo. **Sigue siendo la condición de entrada** |

### Con los jieqi, entero

| | |
|---|---|
| **1** | 24 tramos de 15°, contados desde el equinoccio |
| **2** | Chushu, 165°. Empezó el 23 a las 04:18 |
| **3** | El múltiplo de 15° que el Sol acaba de pasar. Tropicales: el mismo cero que el zodiaco occidental |
| **4** | *(vacío — ver «el nivel 4 nace vacío»)* |
| **5** | Los nombres son del hemisferio norte; en Sídney engañan. Inscritos por la UNESCO en 2016, no en 2013 |

El nivel 2 es el único que cambia cada vez que se abre la pantalla, y el único que
no vive en ningún fichero: se recalcula del instante, como todo lo de clase ①.

---

## El nivel 5 sigue siendo la puerta

Sin cambios respecto a la 0015, y conviene repetirlo porque ahora es ejecutable:

> **Un dato sin nivel 5 escrito no se muestra.**

Con la 0016, esto deja de ser una intención escrita en un documento y pasa a ser
**una prueba dorada que rompe el `node --test`**. Un dato con `nivel1` y sin
`nivel5` no llega a producción: falla antes.

---

## La quinta clase

La taxonomía de `05-fuentes-tradiciones.md` tenía cuatro clases, y **un rito no es
ninguna**:

| Clase | La entrada es | Un rito |
|---|---|---|
| ① Medición física | Una efeméride | No. No se calcula del `timestamp` |
| ② Cuenta desde un origen | Un instante declarado + aritmética | No. No se cuenta nada |
| ③ Convención sobre la escritura | Una cadena de texto | No. No depende de cómo se escriba |
| ④ Acto en el momento | Una tirada, aquí y ahora | No. Es lo que hacía otra gente, no lo que hago yo |

> **⑤ · Práctica humana documentada.** Un hecho sobre lo que hacía gente, en un
> sitio, en una época, según quien lo documentó. No es un hecho sobre el cielo.

**Qué obliga a guardar**, que es lo que define una clase en este proyecto:

| Campo | Por qué es obligatorio |
|---|---|
| **Quién** | «Los antiguos» no es un pueblo. Sin sujeto identificable no hay dato |
| **Dónde** | Una práctica ática no es una práctica romana ni una china |
| **Cuándo** | Con siglo, no con «desde siempre» |
| **Quién lo documentó** | Autor, obra y edición. Igual de duro que un ISBN |

Faltando uno de los cuatro, **no entra**. No hay versión reducida.

---

## Las cuatro reglas del nivel 4

### 1 · Va al bloque B, nunca al A

La 0015 exige que el bloque A —el disponible siempre— pase tres condiciones, y la
segunda es **«no nombra un estado ni una cualidad»**.

Casi todo rito lleva cualidad pegada por construcción: de purificación, de
fertilidad, de duelo, de apertura, de cierre. Decir *«se hacían ritos de
purificación en la luna nueva»* es nombrar una cualidad y ponerla en el mismo sitio
donde la persona va a mirar antes de anotar.

**El nivel 4 vive en el bloque B**, que solo se abre al cerrar el día, cuando el
registro ya está hecho y no se puede contaminar.

### 2 · En pasado y en tercera persona, siempre

| Se escribe | No se escribe |
|---|---|
| *En la Atenas del siglo V se ofrendaba en la Noumenia* | *En la Noumenia se ofrenda* |
| *Se documenta que…* | *Hoy es buen día para…* |
| Tercera persona, siempre | **Segunda persona, jamás** |

El presente convierte un dato etnográfico en una costumbre vigente. La segunda
persona lo convierte en una instrucción. Entre «se ofrendaba» y «puedes ofrendar»
está toda la distancia que este proyecto lleva ocho meses manteniendo.

**Esto es verificable por prueba**, y se verifica: la prueba dorada rechaza segunda
persona en cualquier `nivel4`.

### 3 · Se cuenta la práctica, nunca su eficacia

Se dice **qué hacía la gente**. No se dice para qué servía, si funcionaba, ni qué
efecto se le atribuía sobre quien lo hacía. Que un rito se hiciera «para tener
buena cosecha» es parte del dato etnográfico y puede escribirse *como creencia
atribuida y fechada*; que tuviera algún efecto es una afirmación sobre el mundo, y
cae bajo la misma línea que la vibración: **se ficha lo que un sistema dice, no se
ficha como hecho**.

### 4 · El nivel 5 es especialmente duro aquí

Y este es el aviso que más importa de toda la decisión.

**Los ritos lunares son, con diferencia, el terreno con más fuentes falsas de todo
lo que este proyecto ha tocado.** Está lleno de invención victoriana vendida como
antigüedad, de reconstrucciones del siglo XX presentadas como precristianas, de «los
antiguos hacían» sin antiguo identificable, y de calendarios de festividades
compilados en los años cincuenta que circulan como si fueran milenarios.

Comparado con esto, el enredo de Balliett fue un trámite: allí solo había que
encontrar la fecha correcta de un libro que existía. **Aquí hay que distinguir lo
documentado de lo fabricado, y lo fabricado está escrito con más confianza y mejor
prosa.**

No es motivo para no hacerlo. Es motivo para que el listón suba justo aquí:

> **Un rito sin etnografía con autor y edición no se muestra**, exactamente igual
> que un ISBN sin catálogo. Y con la misma escala: FUERTE, DÉBIL, SIN VERIFICAR.

Compilaciones modernas de festividades, webs de tradiciones y libros de divulgación
sin aparato crítico **no son fuente**. Sirven para saber qué se afirma; no para
afirmarlo.

---

## El nivel 4 nace vacío, y es correcto que así sea

**Hoy no hay ni un solo nivel 4 escrito.** Ninguno. La estructura existe, los
campos están, la prueba los vigila, y el contenido está en blanco.

No es un trabajo a medias: es la regla 0.1 aplicada a nosotras mismas. Escribir hoy
«en la Noumenia ateniense se ofrendaba al hogar» porque suena razonable y se lee en
muchos sitios sería exactamente el error que llevamos dos días desmontando en la
bibliografía, cometido en el terreno donde es más fácil cometerlo.

Se llena cuando haya etnografía verificada, dato a dato, con la misma ronda que se
le hizo a Rudhyar y a Burgess. Va al **pendiente 35**.

---

## Lo que esta decisión no resuelve

1. **Cómo se navega entre los cinco niveles** sin que el nivel 1 parezca un resumen
   de lo de abajo. Seguía abierto en la 0015 y sigue abierto.
2. **Qué parte de `hoja-de-cielo.mjs` pasa a pantalla.** Igual.
3. **Con qué etnografías se empieza.** Pendiente 35.
4. **Si el nivel 4 se muestra plegado o desplegado** dentro del bloque B.
