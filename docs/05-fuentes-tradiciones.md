# 05 · Fuentes de las tradiciones

Documento hermano de `03-registro-de-datos.md`. Aquel ficha constantes numéricas;
este ficha **de dónde sale cada convención** y **qué clase de cosa es**.

Reglas que hereda:

- **0.1 · No se inventan datos.** Ninguna convención entra sin fuente. Si la fuente
  está sin verificar, se marca `[SIN VERIFICAR]` y no puede aparecer en pantalla.
- **0.2 · No se implica causación.** Las tradiciones entran como `origen`, nunca
  como explicación (hoja de ruta §10).
- **Pendiente 15.** Ninguna edición se da por buena hasta cotejarla contra el
  ejemplar físico, el ejemplar digitalizado o un catálogo institucional. Autor y
  título de memoria no valen.

> **Nota de arquitectura, 25 de agosto de 2026; derivador escrito el 16 de
> noviembre de 2026 (decisión 0033).** Las decisiones 0016 y 0018 parten este
> documento en dos. **Las fichas** —autor, título, edición, editorial, ciudad,
> año, colación, ISBN, identificadores, estado y aviso— y los textos de los
> niveles viven en `app/js/fuentes.js`, que es el **original**, y aparecen al
> final de este documento, en la sección **«Las fichas»**, que escribe
> `herramientas/derivar-05.mjs` y no se edita a mano. **El razonamiento** —la
> taxonomía, los tres estados, las reglas de desempate, la línea de la vibración,
> los porqués de cada elección, lo medido— se escribe aquí y no viaja al móvil.
> Las obras que no son ficha de ningún dato (Cornelius, Kennett, Meeus, los
> biorritmos) siguen fichadas aquí, una sola vez. `pruebas/derivado-05.test.mjs`
> falla si «Las fichas» no coincide con `fuentes.js`, o si un título de ficha o
> un identificador suyo reaparece fuera de ella.

---

## Los tres estados de verificación

Fijados el 25 de agosto de 2026. Antes solo había «verificado» y «sin verificar»,
y esa binariedad obligaba a tirar fichas que estaban a un dato de estar bien.

| Estado | Qué exige | ¿Puede salir en pantalla? |
|---|---|---|
| **VERIFICADO FUERTE** | Dos fuentes independientes, y al menos una es catálogo nacional (LoC, BNE, British Library), el propio editor, o el ejemplar digitalizado con página de créditos legible | Sí, sin marca |
| **VERIFICADO DÉBIL** | Una sola entrada de catálogo institucional, sin contradicción localizada | Sí, **con la marca visible** |
| **SIN VERIFICAR** | Todo lo demás: catálogos de librero, sitios comerciales, atribución tradicional | **No** |

Dos reglas de desempate, porque el 25 de agosto hicieron falta las dos:

1. **Editor frente a catálogo:** para *qué dice el libro de sí mismo* manda la
   página de créditos. Para *cuándo entró en circulación* manda el catálogo
   nacional. Cuando discrepan, no se elige: se escriben los dos y se anota como
   aviso al citar. Ha pasado con Reingold-Dershowitz y con Meeus.
2. **Autoedición:** que una obra no esté en ningún catálogo nacional no prueba que
   no exista. Prueba que se autoeditó. Es dato de la ficha, no una laguna.

---

## La taxonomía: cuatro clases

La clase determina **qué hay que guardar** para que el dato sea honesto.

| Clase | La entrada es | ¿Recalculable? | Qué obliga a guardar |
|---|---|---|---|
| **① Medición física** | Una efeméride | Sí, siempre, desde el `timestamp` | Nada. Solo el instante |
| **② Cuenta desde un origen** | Un instante declarado + aritmética | Sí, si el origen está escrito | El origen y la constante de correlación |
| **③ Convención sobre la escritura** | Una cadena de texto | **No** si la cadena cambia | La cadena exacta y las seis convenciones |
| **④ Acto en el momento** | Una tirada, aquí y ahora | No, y no debe serlo | — **excluida**, ver abajo |
| **⑤ Práctica humana documentada** | Lo que hacía gente, en un sitio, en una época | No procede: no es un hecho sobre el cielo | **Quién, dónde, cuándo y quién lo documentó.** Los cuatro |

### La clase ⑤, abierta el 25 de agosto (decisión 0018)

Un rito no es ninguna de las cuatro anteriores: no se calcula del instante, no se
cuenta desde un origen, no depende de cómo se escriba, y no es un acto que yo haga
ahora. Es **un hecho sobre lo que hacía gente**, y como tal necesita sujeto.

«Los antiguos» no es un pueblo. Faltando cualquiera de los cuatro campos, no entra;
no hay versión reducida.

**Y el aviso que gobierna toda la clase:** los ritos lunares son, con diferencia,
el terreno con más fuentes falsas de todo lo que este proyecto ha tocado. Invención
victoriana vendida como antigüedad, reconstrucciones del siglo XX presentadas como
precristianas, compilaciones de los años cincuenta que circulan como milenarias.
Comparado con esto, el enredo de Balliett fue un trámite: allí solo había que
encontrar la fecha correcta de un libro que existía. Aquí hay que distinguir lo
documentado de lo fabricado, **y lo fabricado está escrito con más confianza y
mejor prosa**.

Por eso el listón sube justo aquí: un rito sin etnografía con autor y edición no se
muestra, exactamente igual que un ISBN sin catálogo. Compilaciones de festividades,
webs de tradiciones y divulgación sin aparato crítico **no son fuente**: sirven
para saber qué se afirma, no para afirmarlo.

**Hoy no hay ni un solo rito escrito**, y es correcto que así sea. La estructura
existe en `app/js/fuentes.js`, la prueba dorada la vigila, y el contenido está en
blanco hasta que haya etnografía verificada. Es la regla 0.1 aplicada a nosotras
mismas. → pendiente 35.

### Por qué la clase ④ queda fuera

I Ching, tarot, runas y toda consulta que exija un acto en el momento de
preguntar. No se excluyen por escepticismo, sino porque **su naturaleza es que se
consultan al preguntar** (katarché). Una app que las produzca sin que se pidan
destruye lo único que las hacía significar algo, y además vuelve al problema de
la sugerencia: diría qué esperar antes de vivirlo.

- Cornelius, Geoffrey. *The Moment of Astrology: Origins in Divination*.
  2.ª ed. revisada y ampliada, The Wessex Astrologer, Bournemouth, 2003,
  xxv + 386 pp., ISBN 1-902405-11-0. 1.ª ed. Arkana/Penguin, Londres, 1994,
  ISBN 0-14-019369-3. **VERIFICADO FUERTE** el 24 de agosto de 2026 contra el
  registro de Open Library (OL22019279M) y la ficha de autor del propio
  editor. *Aviso al citar:* circulan reimpresiones fechadas en 2002 y 2005
  con 416 pp.; son la misma 2.ª edición.
  Tesis central: la astrología no es causal. Frase de apoyo para la regla 0.2:
  la sincronicidad no puede convertirse en un sustituto de la causación.

---

## Clase ① · Medición física

Todas se derivan de `timestamp` con astronomy-engine 2.1.19. **No se almacena
ningún resultado**: se recalcula. Un valor congelado en la base de datos sería un
motor viejo escondido.

### Zodiaco tropical

→ Ficha `zodiaco_tropical`, en «Las fichas». No hay razonamiento aparte: es una
definición geométrica, no una obra.

### Zodiaco sidéreo (ayanamsa True Chitra: Spica en 180°)

→ Ficha `zodiaco_sidereo`, en «Las fichas»: las coordenadas de Spica, su
verificación y el resultado de la deriva.

- **De dónde sale la deriva del nivel 5.** No se aplica movimiento propio. El de
  Spica es −42,35 mas/año en ascensión recta y −30,67 mas/año en declinación, o
  sea 52 mas/año. Despreciable deja de ser una impresión y pasa a ser una cifra.
- Verificado para 1995-02-18T21:43Z: ayanamsa 23,7801° = 23° 46,8′.
- **El nombre estaba mal, el número no — corregido el 13 de noviembre de 2026**
  (pendiente 41). «Spica fijada en 180°» es la variante llamada **True
  Chitra**, no el Lahiri oficial. El comité de reforma del calendario indio
  (1955) definió el Lahiri como 23°15′00″ de longitud tropical verdadera el 21
  de marzo de 1956. Bhatnagar (IAU, Kluwer, 1990) lo da a «0h UT» y la Swiss
  Ephemeris (Koch y Treindl, §2.8.5) a «0:00 Ephemeris Time»; se escriben las
  dos. Con esa definición Spica cae en 179°58′59″ en el año 2000. Medido con
  este motor: 61″ por debajo del Lahiri habitual en 2000, y 36″ por debajo del
  valor del comité en 1956. Que el Lahiri oficial no es «Spica en 180°» queda
  **FUERTE** (dos fuentes independientes, una académica); la cifra de
  179°58′59″, **DÉBIL** (solo la Swiss Ephemeris). El informe de 1955 no se ha
  leído.

### Términos solares chinos (jieqi)

→ Ficha `jieqi`, en «Las fichas». Todo lo que había aquí —la partición de 15°,
los dos años nuevos, la inscripción en la UNESCO y el error del «2013»— está en
ella.

### Nakshatras (27 mansiones lunares) y tithi

**CERRADO el 25 de agosto de 2026 con fuente primaria en dominio público**, y
cotejado el contenido del nakshatra el 16 de noviembre. → Fichas `tithi` y
`nakshatra`, en «Las fichas». Las dos comparten fuente, y por eso la cita está
escrita una sola vez en `fuentes.js` (`BURGESS`) y las dos la usan.

**Lo que la fuente sostiene, y dónde**

| Dato | Dónde | Estado |
|---|---|---|
| El mes lunar natural se divide en **30 días lunares (tithi)** | cap. I, vv. 12-13 y nota | **FUERTE** |
| Los tithi **empiezan y acaban en cualquier momento del día natural** | cap. I, nota a v. 13 | **FUERTE** |
| Un tithi puede **omitirse** cuando dos acaban en el mismo día solar (*tithikshaya*) | cap. I, vv. 36-38 | **FUERTE** |
| La cuenta: 25.082.252 tithi omitidos por Edad, frente a 1.603.000.080 tithi | cap. I, v. 38 | **FUERTE** |
| Los nakshatras son las **mansiones lunares**, tratadas en el cap. VIII | cap. I, nota a v. 27 | **FUERTE** |
| El origen de la esfera hindú es el fin de Revatī / principio de Aśvinī, identificado con ζ Piscium | cap. I, nota a v. 27 | **FUERTE** |
| El zodiaco del tratado es **sidéreo**, sin precesión | cap. I, nota a v. 13 | **FUERTE** |
| División del círculo: 60 *vikalā* = 1 *kalā*, 60 = 1 *bhāga* (grado), 30 grados = 1 *rāśi* | cap. I, v. 28 | **FUERTE** |
| **27 porciones iguales de 800′ = 13° 20′** | cap. II, v. 64 y nota, p. 235 | **FUERTE** (16 nov 2026) |
| Cada porción tiene **cuartos (*pada*)** | cap. VIII, v. 5, p. 320 | **FUERTE** (16 nov 2026) |
| El pada mide **3° 20′** | no escrito: es la cuenta 800′ / 4 | cuenta, no cita |
| **Los nombres y su orden** | cap. VIII, vv. 2-9 y tabla, pp. 320-321 | **FUERTE** (16 nov 2026), en transliteración actual. El 23 se escribía *Dhanishta*, otro nombre del mismo asterismo que no es el de esta fuente; desde el 16 de noviembre, *Shravishtha* (Śraviṣṭhā) |
| La serie original es de **28**; la división en 27 iguales encaja mejor; **Abhijit** (n.º 22 de la tabla) no tiene porción | cap. VIII, nota a v. 9, p. 353; tabla p. 321 | **FUERTE** (16 nov 2026) |

*Cotejo del 16 de noviembre de 2026, contra el texto del JAOS que JSTOR publica
en abierto (Early Journal Content). **La referencia antigua
apuntaba al capítulo equivocado**, como sospechaba el pendiente 15: el cap. VIII
no divide la eclíptica, da las posiciones de las estrellas de unión, que no están
equiespaciadas; Burgess-Whitney dicen que no hay prueba de que las porciones se
midieran de estrella a estrella (p. 351). Los 13° 20′ están en el cap. II. Páginas:
el OCR lee 819, 820 y 821 en el cap. VIII, imposibles en un volumen de la 141 a la
498 y entre la 235 y la 351; son 319, 320 y 321, y conviene confirmarlas en el
escaneo. El OCR también escribe «£ Piscium» para la estrella de Revatī: es la ζ
que ya se leyó el 25 de agosto, no se ha vuelto a mirar en la imagen.*

**Lo que esto le da a Umbral, y no es un detalle bibliográfico**

El proyecto se lleva del tithi una sola cosa: **que una unidad de tiempo se salte
o se repita respecto al día civil es normal, no un fallo**. Eso ya no es una
analogía que nos parece bonita. Está en el texto, con nombre propio (*tithikshaya*,
literalmente «pérdida de un día lunar»), con regla explícita —cuando dos acaban en
el mismo día solar, el primero se omite y el día se nombra por el otro— y con la
cuenta hecha. Es exactamente el problema del día lunar de salida a salida del
calendario personal, resuelto por otra gente hace mil años.

Los dos avisos de honestidad que van con ello:

1. El propio Burgess-Whitney califica la división en tithi de **arbitraria y poco
   natural**, y a la vez señala que es de la mayor importancia práctica en la
   India porque por ella se regulan las ceremonias. Las dos cosas a la vez, y así
   se cita: una convención de cuenta con enorme peso de uso, no una medida.
2. **Tithi y fases de Rudhyar siguen siendo el mismo número con dos rejillas**
   (12° frente a 45°). El texto lo confirma por otra vía: 30 divisiones de un mes
   sinódico es idéntico a 12° de elongación. No son dos datos.

**Rango medido del tithi.** De unas 19 h 59 min a unas 26 h 47 min, con media de
unas 23 h 37 min. Casi siete horas de recorrido. *(Verificado el 24 de agosto de
2026 por cálculo propio; el Sūrya-Siddhānta da la razón —la velocidad real de los
dos cuerpos varía— pero no esta cifra.)*

### Fases soli-lunares de Rudhyar

**CORREGIDO el 25 de agosto de 2026. La ficha anterior fundía dos libros distintos
en uno y le ponía al primero la fecha del segundo.** Son dos obras, con quince
años y un océano entre ellas, y una tercera edición que es la que circula.
→ Ficha `fases_rudhyar`, en «Las fichas», con las tres y su colación.

**La cadena que lo cierra** (los identificadores, en la ficha):

1. El **verso de la portada de la edición de Aurora** declara que la obra se
   publicó primero bajo el título de 1946 por David McKay. Consta en el registro
   catalográfico del ejemplar digitalizado.
2. La descripción física del ejemplar de 1946 procede de una biblioteca
   especializada que describe dos ejemplares en mano.
3. La 1.ª ed. de 1967 consta con colación completa en registros de librería
   anticuaria coincidentes entre sí.

**Lo que la duda del 24 de agosto tenía de razón y lo que no.** Tenía razón en que
el título alternativo no encajaba: no encajaba **porque la fecha estaba mal**. El
título existe y está documentado en la fuente más directa posible, la propia página
de créditos del editor. Lo que no existe es «1.ª ed. con ese título en 1967».
El error era nuestro, no del dato.

### Casas — **no es un dato, es una convención**

Medido sobre la carta de referencia (39° N): de seis sistemas,
**8 de 10 planetas cambian de casa** según cuál se elija. Solo coinciden los que
están a mitad de casa.

- Signos enteros · Iguales · Porfirio · Placidus · Regiomontano · Campano.
- La regla que sale de aquí —ningún campo dice `casa: 12` sin el sistema— y por
  qué Placidus no existe por encima del círculo polar, en el nivel 5 de la ficha.

**CERRADO el 25 de agosto de 2026: aparecida la primera edición.** → Ficha
`casas`, en «Las fichas»: las dos ediciones, por qué la primera apenas se
catalogó, la errata «Boulding» y qué falta para subirla a fuerte.

---

## Clase ② · Cuenta desde un origen declarado

No miden nada, luego **no pueden desfasarse de nada**. La clase más honesta.

> Un origen de clase ② no afirma que ese instante influya. Solo dice desde dónde
> se cuenta. La Hégira no sostiene que el viaje de Mahoma cause los meses.

### Época de Umbral

- **Origen:** la última salida de la Luna anterior a la fecha de nacimiento.
- Personal, no un origen fijo del proyecto (decisión ya cerrada).
- Frontera de día: salida a salida, ~24 h 50 min.

### Ciclo sexagenario chino

- Rueda de 60 combinaciones (10 troncos × 12 ramas). **No mide ningún ángulo.**
- La convivencia de este ciclo con los jieqi es el precedente histórico de lo que
  hace Umbral: dos orígenes de clase distinta en la misma caja, **sin mezclarlos**.

### Tzolk'in maya

→ Ficha `tzolkin`, en «Las fichas». Sigue en SIN VERIFICAR, así que no se muestra.

- 260 días: 13 números × 20 nombres. **Sin ancla astronómica ninguna.**
- **Constante de correlación GMT = 584283.** Existe la variante **584285**, que
  desplaza el resultado **dos días**. *(La cifra estaba escrita como «un día» en
  este documento y como «dos días» en `04-formas-de-dividir.md`. Son dos:
  584285 − 584283 = 2.)*

- **CORREGIDO el 24 de agosto de 2026 — el radiocarbono no sostiene lo que se
  le hacía decir.** Kennett, D. J. *et al.*, «Correlating the Ancient Maya and
  Modern European Calendars with High-Precision AMS ¹⁴C Dating», *Scientific
  Reports* **3**, 1597 (2013), PMID 23579869. El artículo existe y dice lo que
  dice: las fechas calibradas del dintel de Tikal caen entre 658 y 696 d. C.,
  y eso **respalda la familia GMT** frente a correlaciones alternativas que se
  separan hasta mil años.

  Lo que **no** hace es distinguir 584283 de 584285. Son dos días, y un método
  con resolución de décadas no puede arbitrar una diferencia de 48 horas.
  La ficha anterior decía que el estudio «estrecha hacia la variante 584283»:
  eso era una inferencia nuestra, no del artículo.

  **Con lo cual la elección de 584283 se apoya en dos razones, no en tres:**
  la cuenta viva de los contadores de días k'iche' y el uso como estándar de
  campo. Las dos son argumentos de práctica, no de datación física, y hay que
  decirlo así. `[SIN VERIFICAR — sigue faltando la fuente primaria de la
  correlación Goodman-Martínez-Thompson]`

### Calendarios aritméticos

Hebreo, islámico civil, persa. Se obtienen de `Intl.DateTimeFormat` con el
calendario correspondiente — implementación ICU, ya presente en el navegador y en
Node.

**RESUELTO el 24 de agosto de 2026, y con consecuencia de código.**

`islamic` a secas **no es el tabular**: en ICU equivale a `islamic-rgsa`, que va
respaldado por una simulación astronómica que no coincide con la práctica real de
ningún país conocido. Y las variantes no discrepan por poco. Medido sobre el
mismo rango de fechas:

| Par | Días en que difieren |
|---|---|
| `islamic-tbla` frente a `islamic-civil` | **100 %** |
| `islamic-rgsa` frente a `islamic-civil` | 85 % |
| `islamic-rgsa` frente a `islamic-umalqura` | 61 % |

> **Regla: nunca `islamic` a secas.** Se declara `islamic-civil`, que es el
> tabular —ciclo fijo de meses alternos de 29 y 30 días, con un día añadido en
> 11 de cada 30 años— y es lo que la convención `calendario_islamico` ya dice.
> Ahora con el motivo escrito y sabiendo qué se evita.

Nota aparte: `islamicc` está obsoleto y no debe usarse.

**La referencia algorítmica, fichada el 25 de agosto de 2026.** → Ficha
`calendario_islamico`, en «Las fichas»: la edición, sus ISBN, la historia de
ediciones y el aviso del 2017 frente al 2018.

- **Por qué se cita la 4.ª y no la 3.ª**, que es la más citada en la bibliografía
  antigua: es la vigente, es la que cualquiera puede cotejar hoy, y es la única
  que trata expresamente el **Umm al-Qura saudí** y amplía el tratamiento del
  calendario islámico observacional — que es justo el eje de la decisión
  `islamic-civil` de arriba. Citar la edición que uno no puede abrir para
  parecer más clásico es lo contrario de lo que pide la regla 0.1.

### Biorritmos — **control negativo del proyecto**

- Tres senos de periodo fijo desde el nacimiento: 23 (físico), 28 (emocional),
  33 (intelectual) días.
- **No entran como contenido.** Entran como instrumento de validación: cruzar los
  registros con estos tres senos **no puede dar nada**, porque no hay mecanismo
  posible. Si un método de análisis «encuentra» algo aquí, el método está roto.
- Es la pieza que le permite a la Fase 4 poder decir que no.
- **CORREGIDO el 24 de agosto de 2026. La atribución de los tres periodos a
  Fliess y Swoboda era falsa en su parte más importante.**

  Lo verificable: Wilhelm Fliess (1858–1928), otorrinolaringólogo berlinés,
  sostuvo ciclos de **23 y 28 días**, y los planteó como periodicidades
  sexuales masculina y femenina, no como «físico» y «emocional». Hermann
  Swoboda no aparece como coautor de la teoría, sino en la disputa de plagio
  de 1903 alrededor de *Geschlecht und Charakter* de Otto Weininger,
  documentada en los papeles de Fliess de la Library of Congress.

  **El ciclo intelectual de 33 días no es de ninguno de los dos.** Pertenece
  al modelo popular de tres curvas que se difundió en Estados Unidos en los
  años setenta, y su origen no se ha podido establecer con fuente firme.
  La atribución que circula es a Alfred Teltscher, y va sin confirmar.

  **Por qué importa aquí y no es un detalle bibliográfico.** Los biorritmos
  son el control negativo del proyecto: sirven precisamente porque cruzarlos
  con los registros no puede dar nada. Un control cuya procedencia está mal
  escrita no puede sostener el peso que se le echa encima.
  `[PARCIAL — 23 y 28 verificados; el 33 sin fuente]`

---

## Clase ③ · Convención sobre la escritura

**La entrada no es un instante: es una cadena de texto.** Y una cadena de texto es
una convención sobre cómo se escribe, no un hecho sobre el mundo.

### Medición de la inestabilidad

Sobre el nombre de prueba *María José Núñez Peña*, 16 convenciones —todas
defendibles, todas usadas por alguien— dan **4 resultados distintos: 1, 5, 6, 9**.
Con el mismo sistema, cambiando solo cuánto nombre se usa: 9 / 5 / 9 / 4.

Sobre *Ana María Navarro García*, las mismas 16 convenciones dan **2 resultados:
6 (quince veces) y 4 (una)**. Es más estable porque el nombre no tiene ñ y solo
lleva dos vocales acentuadas. **La estabilidad depende del nombre**, lo cual es
por sí solo el argumento de esta sección.

### Las seis convenciones que hay que declarar

Ningún número de clase ③ puede guardarse solo. Obliga a guardar:

1. `tabla` — pitagórica (A–Z → 1–9) o caldea (sin el 9)
2. `tildes` — retiradas o conservadas
3. `enie` — la ñ como n o como letra propia
4. `maestros` — si 11, 22 y 33 se reducen o no
5. `nombre_usado` — la cadena exacta, carácter a carácter
6. `metodo_camino_vida` — suma directa de todos los dígitos, o por bloques

> `numero: 6` es un dato falso.
> `numero: 6` + las seis convenciones es un dato honesto.

La tabla pitagórica se diseñó para un alfabeto de **26 letras**. El español tiene
**27**. Nadie decidió nunca qué vale la ñ porque la pregunta no existía cuando se
hizo la tabla.

### Consecuencia para el esquema

El nombre deja de ser una etiqueta y pasa a ser **una entrada de cálculo**. Por eso:

- `nombre_completo` — entrada de cálculo. Va en la exportación.
- `mote` — solo para dirigirse a la persona. No entra en ningún cálculo.
- **Si `nombre_completo` cambia, se registra la fecha del cambio.** Sin eso, los
  registros anteriores dejan de ser reconstruibles, que es la única forma de que
  un dato de clase ③ se pierda.

### Fuentes — **reabierto y reconducido el 25 de agosto de 2026**

El 24 de agosto esta sección decía «tres años en conflicto: 1903, 1908 y 1911».
El conflicto se ha disuelto, y no porque una de las tres fechas ganara: **las tres
son de libros distintos, y ninguno de ellos es el primero.**

**La autora** → ficha `numerologia`, en «Las fichas»: nombre, firma y pie de
imprenta.

**Por qué no aparecía en ningún catálogo de biblioteca**

Porque **se autoeditó**. El pie de imprenta de sus libros es literalmente
*«published by the author»*. Eso no es una laguna documental: es el dato. Un
sistema construido en autoedición no deja el mismo rastro que uno publicado por
una casa editorial, y buscarlo con las herramientas de la segunda es lo que
producía el falso conflicto.

**Cronología, ordenada**

| Año | Obra | Papel |
|---|---|---|
| 1901 | *The Body Beautiful: According to the Delsartian Philosophy* | Anterior al sistema, no numerológica |
| **1904** | *How to Attain Success Through the Strength of Vibration: A System of Numbers as Taught by Pythagoras* | **El primer libro del sistema** |
| 1908 | *The Philosophy of Numbers; Their Tone and Colors* | El texto fundacional al que todos remiten |
| 1911 | *Nature's Symphony, or Lessons in Number Vibration* | Extiende a color y armonía |
| 1917 | *The Day of Wisdom According to Number Vibration* | |
| 1930 | *The Balliett Philosophy of Number Vibration in Questions and Answers: A Text Book* | Póstumo |

- La cronología está en **VERIFICADO DÉBIL**, con las mismas fuentes que la
  ficha `numerologia`: dos repertorios biográficos de 1917 y 1923 y el registro
  de autoría. Los dos avisos que la acompañan —la fecha del *Questions and
  Answers* y el nombre de pila— están en la ficha.

**La palabra**

Julia Seton Sears acuñó «numerología» hacia **1912**. `[VERIFICADO DÉBIL]`

**El linaje, con el parentesco que faltaba**

Juno Jordan era el seudónimo de Juno Belle Kapp, **hija de Julia Seton**, que
empezó a estudiar con Balliett en 1898, a los catorce años, y formalizó el camino
de vida, los pináculos, los desafíos y los planos de expresión. Las «tres mujeres»
del linaje son maestra, madre e hija.

### El puente vibratorio — **y dónde está exactamente la línea**

Abierto el 25 de agosto de 2026 porque la pregunta se hizo, y porque merece una
respuesta escrita en vez de una evasiva.

**Lo verificable, y es mucho**

El vocabulario de «vibración» y «frecuencia» es **de la propia Balliett y está
fechado**: sus títulos son *Number Vibration*, *Nature's Symphony*, *Their Tone
and Colors*, *Universal Music*. Es decir: el sistema nació con una analogía
musical explícita, en el ambiente del New Thought norteamericano, con un siglo
largo de documentación. **Eso entra en Umbral sin ningún problema**, porque entra
como lo que es: historia de un movimiento, con autoras, fechas y libros.

**Lo que no es verificable, y hay que decirlo**

1. **La frase de Tesla es apócrifa.** «Si quieres encontrar los secretos del
   universo, piensa en términos de energía, frecuencia y vibración» no aparece en
   sus patentes, conferencias ni artículos publicados. Wikiquote la mantiene entre
   las no documentadas. La única atribución rastreable llega por **Ralph
   Bergstresser**, que dijo habérsela oído en una conversación de 1942 y que
   vendía «placas de armonía» — o sea, exactamente la clase de fuente que la regla
   0.1 no acepta. La variante del 3-6-9 es posterior y tiene aún menos apoyo.
   Tesla sí trabajó con resonancia y alta frecuencia, con instrumentos y medidas.
   Eso está documentado y es suyo. La frase, no.
2. **Frecuencia y vibración son magnitudes físicas.** Se miden en hercios, con un
   instrumento, y quien las mide obtiene el mismo número que cualquier otro.
   **La numerología no mide ninguna frecuencia**: asigna enteros a letras según
   una tabla, y ya se ha medido en este mismo documento que la tabla da resultados
   distintos según seis convenciones. Un procedimiento cuyo resultado depende de
   si conservas la tilde no es una medición.

**La regla que sale de aquí, y vale para todo el proyecto**

> Se puede fichar y mostrar que un sistema **dice** que los números son vibración.
> Eso es un hecho sobre el sistema, con fecha y autora.
> No se puede fichar ni mostrar que los números **son** vibración.
> Eso sería un hecho sobre el mundo, y no lo sostiene ninguna medida.
>
> La primera frase es clase ③ y es honesta. La segunda es la regla 0.2 al revés:
> no implica causación entre dos cosas, sino que **identifica** dos cosas que no
> son la misma. Es peor.

**Estado de la clase ③ en pantalla**

Sigue **fuera**, pero por un motivo más pequeño que antes y con salida a la vista.
Ya no es «no hay fuente primaria»: la hay, está fechada y tiene autora con nombre.
Lo que falta para que salga:

1. Subir la cronología de Balliett de débil a fuerte con **una** entrada de
   catálogo nacional (LoC o British Library) para el libro de 1904 o el de 1908.
2. Que la tabla que use el código —pitagórica o caldea— quede atribuida a una
   edición concreta, no a «atribución tradicional».
3. Que la ficha en pantalla diga **1904/1908 y no Pitágoras**, con las seis
   convenciones al lado.

`hoja-de-cielo.mjs` sigue pidiendo la clase ③ explícitamente en vez de emitirla
por omisión, y así se queda hasta que se cumplan los tres puntos.

---

## Constantes usadas

| Constante | Valor | Clase | Estado |
|---|---|---|---|
| Espaciado de jieqi | 15° | ① | **FUERTE**. Inscripción UNESCO: 2016 |
| Lichun | 315° | ① | **FUERTE** |
| Divisiones de nakshatra | 27 × 13° 20′ | ① | **FUERTE** — Burgess cap. II, v. 64 (cotejado 16 nov 2026) |
| Padas | 4 × 3° 20′ | ① | **FUERTE** los cuartos, Burgess viii. 5; 3° 20′ es la cuenta 800′ / 4 |
| Nombres de nakshatra | 27 | ① | **FUERTE** — Burgess cap. VIII, vv. 2-9 (cotejado 16 nov 2026) |
| Divisiones de tithi | 30 × 12° | ① | **FUERTE** — Burgess cap. I, vv. 12-13 |
| Omisión de tithi (*tithikshaya*) | regla | ① | **FUERTE** — Burgess cap. I, vv. 36-38 |
| Fases de Rudhyar | 8 × 45° | ① | **FUERTE** — Rudhyar 1946/1967/1986 |
| Spica J2000 | → ficha `zodiaco_sidereo` | ① | → ficha |
| Correlación tzolk'in | GMT 584283 | ② | `[SIN VERIFICAR]` — variante 584285, **dos días** |
| Periodos de biorritmo | 23 / 28 / 33 días | ② | 23 y 28 verificados; **el 33 sin fuente** |
| Mes sinódico medio | 29,530588 días | ① | **DÉBIL** — Meeus 2.ª ed. cap. 49, sin cotejar el ejemplar |
| Tabla pitagórica / caldea | A–Z → 1–9 | ③ | `[SIN VERIFICAR]` — bloquea la clase ③ |

---

## Lo que falta antes de que nada de esto llegue a pantalla

**Cerrados el 24 de agosto de 2026**

1. ~~Origen por defecto del zodiaco~~ → **no hay ninguno**, se muestran los dos
   y se etiqueta también el tropical.
2. ~~Correlación del tzolk'in~~ → **584283**, y el porqué está escrito arriba,
   con la corrección de que el radiocarbono no arbitra la variante.
3. ~~Cálculo de casas~~ → verificado contra un segundo cálculo independiente por
   fuerza bruta sobre el horizonte: 0,00000′ de diferencia en 54 combinaciones
   de latitud entre −60° y +66°, cero fallos. Ya no hace falta astro.com.
4. ~~Variante de calendario islámico en ICU~~ → `islamic-civil` declarado.
5. ~~Coordenadas de Spica~~ → verificadas, con la deriva medida.
6. ~~Año de inscripción de los jieqi~~ → 2016.

**Cerrados el 25 de agosto de 2026**

7. ~~Rudhyar~~ → **son dos libros.** *The Moon*, McKay, 1946; *The Lunation Cycle*,
   Servire, 1967; Aurora, 1986. El título alternativo sí existía; la fecha era
   la que estaba mal.
8. ~~Houlding, primera edición~~ → **Ascella Publications, 1998.** Era
   autoedición de la propia autora, que fundó Ascella.
9. ~~Nakshatra y tithi, fuente primaria~~ → **Burgess, JAOS vol. VI, 1860**,
   dominio público. Tithi cerrado en el texto, incluida la
   regla de omisión. Nakshatra cotejado el 16 de noviembre de 2026: los grados
   están en el cap. II, no en el VIII.
10. ~~Reingold-Dershowitz~~ → **4.ª ed., Cambridge, 2018**, con el motivo
    escrito de por qué la 4.ª y no la 3.ª.
11. ~~Numerología, el conflicto de fechas~~ → **disuelto: eran libros distintos.**
    El primero es de 1904. La razón de que no estuviera en catálogos es que era
    autoedición.
12. ~~El puente vibratorio~~ → línea trazada arriba. Se ficha lo que el sistema
    dice; no se ficha como física.

**Cerrados el 16 de noviembre de 2026**

13. ~~Nakshatra: cotejar Burgess~~ → los grados estaban en el cap. II, no en el
    VIII. Y el nombre del 23 pasa a ser el de la fuente, *Shravishtha*. La
    ficha sube a **FUERTE**.
14. ~~El derivador~~ → `herramientas/derivar-05.mjs` escribe «Las fichas» desde
    `fuentes.js` (decisión 0033).

**Siguen abiertos**

1. **Houlding: cotejar la 1.ª ed. contra el catálogo de la British Library.**
   Sube la ficha de débil a fuerte.
2. **Balliett: una entrada de catálogo nacional** para 1904 o 1908. Es el último
   requisito bibliográfico para desbloquear la clase ③.
3. **Meeus: cotejar el ejemplar.** Ver el pendiente 27, que ya no es solo del 15.
4. **Tabla pitagórica y caldea: obra de referencia con edición comprobable.**
   Sigue siendo la ficha más débil del documento, y es la que bloquea la clase ③
   junto con el punto 2.
5. **Correlación GMT: fuente primaria de Goodman-Martínez-Thompson.**

---

*Última revisión: 16 de noviembre de 2026 — Burgess cotejado y el nombre del*
*nakshatra 23 corregido; las fichas pasan a derivarse de `fuentes.js`*
*(decisión 0033). Revisión anterior: 25 de agosto de 2026, cierre del*
*pendiente 15 en sus cuatro fichas, apertura de los tres estados de*
*verificación y reconducción de la numerología.*

---

<!-- DERIVADO DE app/js/fuentes.js · no editar a mano · regenerar con: node herramientas/derivar-05.mjs -->

## Las fichas

*Esta sección la escribe `herramientas/derivar-05.mjs` a partir de
`app/js/fuentes.js`, que es el original (decisiones 0016 y 0033). Para
cambiar una ficha se cambia `fuentes.js` y se vuelve a generar. Lo que hay
encima de esta sección es el razonamiento, y ese sí se escribe aquí.*

### Zodiaco tropical · `zodiaco_tropical`

**VERIFICADO FUERTE** · clase ① Medición física · bloque A, disponible siempre

- **Nivel 1 · qué es.** Doce tramos de 30°, contados desde el equinoccio de primavera.
- **Nivel 3 · cómo se cuenta y de dónde sale.** El 0° de Aries es el equinoccio vernal, por definición. No se desfasa de las estaciones nunca, y por eso se desplaza respecto a las estrellas unos 50,3 segundos de arco al año.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). Astrólogos del Egipto grecorromano calculaban natividades individuales para clientes particulares aplicando los doce signos tropicales heredados de la astronomía helenística, junto con los doce lugares del horóscopo repartidos por el sistema de signos enteros, el más antiguo de los sistemas de casas documentados. La práctica quedó registrada en papiros, óstraca e inscripciones con cartas natales fechadas, halladas sobre todo en el valle del Nilo.
  - *Quién:* Astrólogos profesionales del Egipto bajo dominio romano, que calculaban natividades para clientes particulares.
  - *Dónde:* Valle del Nilo, con concentración de hallazgos en Oxirrinco y otros yacimientos egipcios; práctica extendida por el mundo grecorromano.
  - *Cuándo:* Desde aproximadamente el siglo I a. C. hasta el siglo VII d. C., según la datación de los documentos conservados.
  - *Documentado por:* Neugebauer, Otto y Van Hoesen, H. B., Greek Horoscopes, Memoirs of the American Philosophical Society, vol. 48, Filadelfia, 1959.
- **Nivel 5 · quién discute qué.** Es el ajuste por defecto de la astrología occidental y casi nunca se etiqueta: se dice «Sol en Leo» sin decir en qué zodiaco. Aquí se etiqueta siempre, porque el sidéreo da otro signo para la misma persona.

**Ficha**

- *Autor:* — (sin autor único)
- *Título:* Convención astronómica, sin autor único
- *Publicación:* El origen es el equinoccio vernal; no procede de ninguna obra
- *Verificado:* Definición geométrica, no bibliográfica

*Aviso al citar:* No confundir el zodiaco tropical con las constelaciones del mismo nombre: llevan dos milenios sin coincidir. Sobre el nivel4: la fuente (Neugebauer y Van Hoesen, 1959) está identificada y corroborada por trabajo académico posterior —Evans (2004), Jones (1999)—, pero no ha sido leída en el original; se cuenta también, fusionado aquí, lo que corresponde al dato `casas`, cuyo nivel4 queda vacío a propósito para no repetir el mismo episodio histórico dos veces.

### Zodiaco sidéreo (ayanamsa True Chitra: Spica en 180°) · `zodiaco_sidereo`

**VERIFICADO FUERTE** · clase ① Medición física · bloque A, disponible siempre

- **Nivel 1 · qué es.** Los mismos doce tramos de 30°, contados desde las estrellas.
- **Nivel 3 · cómo se cuenta y de dónde sale.** Se fija Spica en los 180° sidéreos y se mide desde ahí. La app no copia ninguna tabla de ayanamsas: define Spica con sus coordenadas J2000 y le pide al motor la longitud eclíptica de la fecha.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). Astrólogos y sacerdotes brahmanes calculaban momentos propicios (muhurta) para ritos védicos y ceremonias del ciclo vital, y natividades (jataka) para particulares, sobre posiciones planetarias referidas a las estrellas fijas. La técnica entró en la India mediante la traducción de un texto astrológico griego, fechada en 149/150 d. C., que Sphujidhvaja versificó como el Yavanajataka en 269/270 d. C.
  - *Quién:* Astrólogos y sacerdotes brahmanes (jyotishis).
  - *Dónde:* El subcontinente indio.
  - *Cuándo:* Desde la versificación del Yavanajataka en 269/270 d. C. (traducción previa de 149/150 d. C.), con continuidad hasta la actualidad.
  - *Documentado por:* Pingree, David, Jyotihśāstra: Astral and Mathematical Literature, Otto Harrassowitz, Wiesbaden, 1981 (A History of Indian Literature, vol. VI, fasc. 4).
- **Nivel 5 · quién discute qué.** Comparte origen con el tropical y a la vez difiere de él en unos 23° 47′, que es más de tres cuartos de signo. El cálculo no aplica movimiento propio: el de Spica son 0,052″ al año, que entre 1995 y 2026 acumula 1,6″ contra un ayanamsa de unos 85.600″. Una parte entre 53.000.

**Ficha**

- *Autor:* — (sin autor único)
- *Título:* Coordenadas J2000 de α Virginis (Spica)
- *Publicación:* AR 13h 25m 11,579s · Dec −11° 09′ 40,75″
- *Verificado:* 24 de agosto de 2026, contra las coordenadas publicadas

*Aviso al citar:* Circulan varias decenas de ayanamsas distintos y difieren entre sí en grados. Decir «sidéreo» sin decir cuál no identifica ningún cálculo. Hasta el 13 de noviembre de 2026 esta ficha lo llamaba «Lahiri / Chitrapaksha», y no lo es: el Lahiri oficial se define por un valor en una fecha (23°15′00″ el 21 de marzo de 1956, comité de reforma del calendario indio) y deja Spica a un minuto de arco de los 180°; Spica fijada en 180° es la variante True Chitra. El Lahiri oficial no se ofrece como segunda opción (Ana, 16 de noviembre de 2026). La diferencia entre los dos es de 36″ a 61″: un panchang que use el Lahiri oficial puede dar la hora de cambio de nakshatra entre 1,0 y 1,6 minutos distinta, y la del Sol al cambiar de signo sidéreo, entre 14 y 24 minutos. Los tithi no cambian: no dependen del ayanamsa. Sobre el nivel4: la fecha de la traducción griega (149/150) viene de Pingree citado en fuente terciaria (Britannica); Pingree no se ha leído en el original.

### Términos solares chinos (jieqi) · `jieqi`

**VERIFICADO FUERTE** · clase ① Medición física · bloque B, solo al cerrar el día

- **Nivel 1 · qué es.** Veinticuatro tramos de 15°, contados desde el equinoccio.
- **Nivel 3 · cómo se cuenta y de dónde sale.** El múltiplo de 15° que el Sol acaba de pasar. Son tropicales: mismo cero que el zodiaco occidental, distinta partición. Lichun, en los 315°, abre el año en la astrología BaZi.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). En Jiuhua (Quzhou, Zhejiang), la comunidad local conmemoraba cada año, en la fecha del término solar Lichun, un ritual de bienvenida a la primavera en el Salón Ancestral de Wutong: se rendía culto a Gou Mang, dios de la primavera, se fabricaba y golpeaba un buey de papel o barro, se quemaba incienso y se ofrecían representaciones para agradecer a los dioses una buena cosecha.
  - *Quién:* La comunidad de Jiuhua (Quzhou, Zhejiang), encabezada por el oficiante heredero del ritual.
  - *Dónde:* El Salón Ancestral de Wutong, en la localidad de Jiuhua, distrito de Quzhou, provincia de Zhejiang, China.
  - *Cuándo:* Cada año, en la fecha del término solar Lichun; tradición inscrita en el listado nacional chino de patrimonio inmaterial e incluida en el expediente que la UNESCO reconoció en 2016.
  - *Documentado por:* UNESCO, Comité Intergubernamental para la Salvaguardia del Patrimonio Cultural Inmaterial, Decisión 11.COM 10.B.6, 11.ª sesión, Adís Abeba, 2016.
- **Nivel 5 · quién discute qué.** Los nombres describen el clima del hemisferio norte: en Sídney engañan. Y hay dos años nuevos distintos —Lichun y el Año Nuevo lunar— que pueden diferir semanas, así que hay que declarar cuál se usa.

**Ficha**

- *Autor:* UNESCO, Comité Intergubernamental
- *Título:* The Twenty-Four Solar Terms, knowledge in China of time and practices developed through observation of the sun's annual motion
- *Publicación:* Lista Representativa del Patrimonio Cultural Inmaterial, 11.ª sesión, Adís Abeba, 30 de noviembre de 2016
- *Verificado:* 24 de agosto de 2026

*Aviso al citar:* Circula 2013 como año de inscripción y es falso. La fecha que se confunde con esta es 2006, año en que el elemento entró en la lista nacional china, que es otra cosa. Sobre el nivel4: es la etnografía mejor sostenida de las diez — la propia decisión de la UNESCO se leyó en su texto primario, y hay más de una fuente independiente coincidiendo en el lugar, el oficiante y las acciones descritas.

### Tithi · `tithi`

**VERIFICADO FUERTE** · clase ① Medición física · bloque B, solo al cerrar el día

- **Nivel 1 · qué es.** La trigésima parte de una lunación.
- **Nivel 3 · cómo se cuenta y de dónde sale.** Treinta divisiones del mes lunar, que es lo mismo que cada 12° de separación entre la Luna y el Sol. Como los dos cuerpos no se mueven a velocidad constante, un tithi dura entre unas 19 h 59 min y unas 26 h 47 min, con media de unas 23 h 37 min.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). Madres hindúes de la región de Benarés ayunaban en el tithi Ashtami del mes de Ashvin por el bienestar de sus hijos, en el vrat conocido como Jivitputrika o Jiutiya. La práctica estaba restringida a mujeres con hijos varones dentro de la comunidad hindú.
  - *Quién:* Madres hindúes de la región de Benarés y del norte de India oriental.
  - *Dónde:* Bihar, Jharkhand, Uttar Pradesh oriental (incluida Benarés) y Nepal.
  - *Cuándo:* Ashtami, el octavo tithi de la quincena oscura del mes de Ashvin.
  - *Documentado por:* Pearson, Anne Mackenzie, "Because It Gives Me Peace of Mind": Ritual Fasts in the Religious Lives of Hindu Women, State University of New York Press, Albany, 1996, p. 163 (cita verificada vía Mahavidya, McGill University, World Religions Project; no leída en el original).
- **Nivel 5 · quién discute qué.** Los tithi empiezan y acaban a cualquier hora del día natural, y uno puede omitirse: cuando dos terminan en el mismo día solar, el primero se pierde y el día se nombra por el otro. El texto lo llama tithikshaya y lleva la cuenta hecha. El propio comentario de Burgess-Whitney califica la división de arbitraria, y a la vez dice que es de la mayor importancia práctica porque por ella se regulan las ceremonias. Las dos cosas a la vez.

**Ficha**

- *Autor:* Burgess, Ebenezer (1805-1870) (trad.); notas en su mayor parte de W. D. Whitney
- *Título:* Translation of the Sûrya-Siddhânta, a Text-Book of Hindu Astronomy; with Notes, and an Appendix, containing additional notes and tables, calculations of eclipses, a stellar map, and indexes
- *Publicación:* Asistido por el Comité de Publicación de la American Oriental Society. Journal of the American Oriental Society, vol. VI, pp. 141-498. Separata: New Haven, para la American Oriental Society, impr. E. Hayes, 1860. 1 h. + iv + 354 pp., 1 h., con carta plegable y diagramas, 24 cm. Dominio público
- *Dónde, dentro de la obra:* cap. I, vv. 12-13 (definición) y vv. 36-38 (tithikshaya)
- *Verificado:* 25 de agosto de 2026 · HathiTrust 011604382 (ejemplar de Harvard, hvd.32044019816925, vista completa) · OCLC 9857844 · JSTOR 592174 · DOI 10.2307/592174 · y contra el propio texto digitalizado

*Aviso al citar:* JSTOR fecha el volumen como 1858-1860 porque el tomo se compuso a lo largo de tres años; la portada dice 1860 y la portadilla añade que se comunicó a la Sociedad el 17 de mayo de 1858. Las tres son correctas y describen cosas distintas. Se cita 1860. Y: el comentario es más extenso que la traducción y es de Whitney, no de Burgess; al citar una nota, Burgess-Whitney. Sobre el nivel4: la cita de Pearson (p. 163) es de segunda mano, vía un recurso académico de McGill; el libro en sí no se ha leído.

### Nakshatra (mansiones lunares) · `nakshatra`

**VERIFICADO FUERTE** · clase ① Medición física · bloque A, disponible siempre

- **Nivel 1 · qué es.** Veintisiete divisiones del recorrido de la Luna por el cielo.
- **Nivel 3 · cómo se cuenta y de dónde sale.** La longitud eclíptica de la Luna, en zodiaco sidéreo, partida en 27 tramos de 13° 20′, cada uno subdividido en cuatro padas de 3° 20′. El origen de la esfera es el fin de Revatī y el principio de Aśvinī, identificado con ζ Piscium.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). En Madurai, y más tarde en Kerala, las comunidades vinculadas a los templos conmemoraban durante varios días, en la fecha marcada por el nakshatra Thiruvonam, una fiesta con banquete, vestidos nuevos, cantos y danzas; inscripciones en plancha de cobre registran donaciones concretas hechas a los templos con motivo de la festividad.
  - *Quién:* Comunidades templarias de Madurai y, más tarde, de Kerala, con donantes identificados por nombre en inscripciones.
  - *Dónde:* Madurai (sur de India) en las referencias más antiguas; Kerala en su forma consolidada posterior.
  - *Cuándo:* Desde el poema sangam Maduraikanchi (hacia el siglo III d. C.), pasando por inscripciones en placa de cobre del rey chera Kulasekhara Perumal (861 d. C.), hasta la práctica viva actual.
  - *Documentado por:* Kurup, A. M., "The Sociology of Onam", Indian Anthropologist, vol. 7, n.º 2, 1977, pp. 95-110, JSTOR 41919319; y Cush, Denise, Catherine Robinson y Michael York (eds.), Encyclopedia of Hinduism, Routledge, Londres, 2012, pp. 573-574.
- **Nivel 5 · quién discute qué.** Cotejado contra el texto original. La división en 27 porciones iguales de ochocientos minutos, que son 13° 20′, está en el capítulo II; los cuartos de cada porción, los padas, en el VIII; el punto de partida, en una nota al capítulo I. Los veintisiete nombres son los del texto, en transliteración actual y en su orden; el texto trae además un vigésimo octavo, Abhijit, que no tiene porción.

**Ficha**

- *Autor:* Burgess, Ebenezer (1805-1870) (trad.); notas en su mayor parte de W. D. Whitney
- *Título:* Translation of the Sûrya-Siddhânta, a Text-Book of Hindu Astronomy; with Notes, and an Appendix, containing additional notes and tables, calculations of eclipses, a stellar map, and indexes
- *Publicación:* Asistido por el Comité de Publicación de la American Oriental Society. Journal of the American Oriental Society, vol. VI, pp. 141-498. Separata: New Haven, para la American Oriental Society, impr. E. Hayes, 1860. 1 h. + iv + 354 pp., 1 h., con carta plegable y diagramas, 24 cm. Dominio público
- *Dónde, dentro de la obra:* cap. II, v. 64 y nota, p. 235 (27 porciones de 800′) · cap. VIII, v. 5, p. 320 (los cuartos, pada) · cap. VIII, vv. 2-9 y tabla, pp. 320-321 (nombres y orden) · cap. I, nota a v. 27, p. 158 (el origen)
- *Verificado:* 25 de agosto de 2026 · HathiTrust 011604382 (ejemplar de Harvard, hvd.32044019816925, vista completa) · OCLC 9857844 · JSTOR 592174 · DOI 10.2307/592174 · y contra el propio texto digitalizado. Contenido cotejado el 16 de noviembre de 2026 contra el texto de JSTOR (Early Journal Content)

*Aviso al citar:* JSTOR fecha el volumen como 1858-1860 porque el tomo se compuso a lo largo de tres años; la portada dice 1860 y la portadilla añade que se comunicó a la Sociedad el 17 de mayo de 1858. Las tres son correctas y describen cosas distintas. Se cita 1860. Y: el comentario es más extenso que la traducción y es de Whitney, no de Burgess; al citar una nota, Burgess-Whitney. Se citan a veces 28 mansiones en vez de 27, contando Abhijit. No son sistemas equivalentes y hay que declarar cuál se usa. Sobre el nivel4: dos fuentes académicas independientes coinciden en los mismos hechos concretos, una de ellas revisada por pares (JSTOR); este es el nivel4 más sólido de los diez junto con el de jieqi. El asterismo 23 se escribió Dhanishta hasta el 16 de noviembre de 2026: es otro nombre del mismo asterismo, pero no el de esta fuente, que dice Śraviṣṭhā; desde entonces se escribe Shravishtha. Sobre la referencia: el cap. VIII NO divide la eclíptica; da las posiciones de las estrellas de unión, que no están equiespaciadas. Los 13° 20′ están en el cap. II, v. 64 (cotejado el 16 de noviembre de 2026). Los 3° 20′ del pada son la cuenta 800′ / 4: el texto nombra los cuartos (viii. 5) pero no escribe su medida. Burgess-Whitney, nota a viii. 9 (p. 353): la serie original es de 28, y la división en 27 iguales encaja mejor con las estrellas; Abhijit (n.º 22 de la tabla, p. 321) no tiene porción. Páginas del volumen VI del JAOS. El OCR lee 819, 820 y 821, imposibles en un volumen que va de la 141 a la 498, y entre la 235 del cap. II y la 351 de la nota a viii. 9: son 319, 320 y 321. Conviene confirmarlas en el escaneo.

### Fases soli-lunares · `fases_rudhyar`

**VERIFICADO FUERTE** · clase ① Medición física · bloque B, solo al cerrar el día

- **Nivel 1 · qué es.** Ocho tramos de 45° en la separación entre la Luna y el Sol.
- **Nivel 3 · cómo se cuenta y de dónde sale.** La misma separación Luna − Sol que produce los tithi, con otra rejilla: 45° en vez de 12°. Contiene además el cumpleaños de lunación, que es el retorno mensual al ángulo Luna-Sol que había al nacer.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). Astrólogos reunidos en torno al International Committee for Humanistic Astrology, fundado por Dane Rudhyar en 1969, aplicaban las ocho fases lunares como herramienta de asesoramiento psicológico de clientes, en vez de como predicción de destino.
  - *Quién:* Astrólogos reunidos en torno al International Committee for Humanistic Astrology, fundado por Dane Rudhyar.
  - *Dónde:* Estados Unidos, con difusión posterior en Europa.
  - *Cuándo:* Desde 1969, año de fundación del comité.
  - *Documentado por:* Campion, Nicholas, A History of Western Astrology, Vol. 2: The Medieval and Modern Worlds, Continuum, Londres, 2009, ISBN 978-1-4411-2737-2. La fecha de fundación (1969) procede de Melton, J. Gordon (ed.), Encyclopedia of Occultism & Parapsychology, entrada «Rudhyar, Dane».
- **Nivel 5 · quién discute qué.** Los ocho nombres describen ánimos —balsámica, diseminadora— y esa es exactamente la línea que parte la pantalla en dos: iluminación 97,3 % es una medida, «fase balsámica» es la misma medida con una palabra que describe un estado. El tithi 19 y la fase llena son el mismo ángulo con dos rejillas, y solo una de las dos sugiere cómo estás.

**Ficha**

- *Autor:* Rudhyar, Dane
- *Título:* The Lunation Cycle: A Key to the Understanding of Personality
- *Publicación:* Servire, Wassenaar / La Haya, 1967, distribuido por Llewellyn Publications, St. Paul (Minnesota). Rústica, 156 pp., ilustrado, 23 cm, con bibliografía del autor en pp. [157]-[158]. Es la reelaboración, bajo título nuevo, de The Moon: The Cycles and Fortunes of Life, David McKay Company, Washington Square, Filadelfia, 1946, cartoné con sobrecubierta, [5] + 111 pp. + 2 pp. de publicidad. Edición en circulación: Aurora Press, Santa Fe (Nuevo México), 1986, ISBN 0-943358-26-4 / 978-0-943358-26-0, 196 pp., que incluye además The Lunation Process in Astrological Guidance, de Leyla Rael Rudhyar (Aurora, Nueva York, c1984)
- *Verificado:* 25 de agosto de 2026 · verso de portada de la ed. Aurora, en el registro del ejemplar digitalizado (Internet Archive lunationcycle00dane, Open Library OL8445199M / obra OL8046023W, OCLC 19531810) · WorldCat 1036668863 · descripción física del ejemplar de 1946 según la biblioteca especializada Astrolearn, con dos ejemplares en mano · la 1.ª ed. de 1967, con colación completa en registros de librería anticuaria coincidentes entre sí

*Aviso al citar:* Son dos libros con quince años y un océano entre ellos, y se funden a menudo en uno. Aurora Press reimprime con la fecha 1967 en algunas tiradas posteriores, y circula «1 de junio de 1967, Aurora Press, 196 páginas», que mezcla el año de Servire con la editorial y la paginación de Aurora. No usar esa combinación. Sobre el nivel4: es de otra naturaleza que el resto — práctica profesional del siglo XX, no rito folclórico —, y el dato concreto de 1969 viene de una fuente distinta (Melton) de la que documenta el conjunto (Campion); ninguna de las dos se ha leído en el original.

### Casas · `casas`

**VERIFICADO DÉBIL** · clase ① Medición física · bloque A, disponible siempre

- **Nivel 1 · qué es.** Doce sectores del cielo respecto al horizonte de un lugar y un instante.
- **Nivel 3 · cómo se cuenta y de dónde sale.** No hay un modo de trazarlos, hay seis: signos enteros, iguales, Porfirio, Placidus, Regiomontano y Campano. Medido sobre la carta de referencia a 39° N, ocho de diez planetas cambian de casa según cuál se elija. Solo coinciden los que caen a mitad de sector.
- **Nivel 4 · qué se hacía con esto.** Vacío a propósito.
- **Nivel 5 · quién discute qué.** Esto no es un dato, es una convención, y por eso ningún campo puede decir «casa 12» sin decir al lado qué sistema lo produjo: sin el sistema, el campo miente por omisión. Placidus además no existe por encima del círculo polar, porque el arco semidiurno se vuelve imaginario.

**Ficha**

- *Autor:* Houlding, Deborah
- *Título:* The Houses: Temples of the Sky
- *Publicación:* 2.ª ed. revisada y muy ampliada, The Wessex Astrologer Ltd, Bournemouth, 2006, ISBN 1-902405-20-X / 978-1-902405-20-9, 196 pp.: la que está en circulación y la que se cita. 1.ª ed.: Ascella Publications, 1998, ISBN 1-898503-69-9 / 978-1-898503-69-9
- *Verificado:* 25 de agosto de 2026 · registro del editor y catálogo para la 2.ª ed.; la 1.ª consta con ISBN y pie Ascella en registro agregado, y el libro declara ejemplar depositado en la British Library, pero no se ha cotejado contra su catálogo

*Aviso al citar:* Ascella Publications era la editorial de la propia Houlding: la 1.ª ed. era en la práctica autoedición, de ahí que apenas se catalogara. Y circulan transcripciones de la página de créditos de la 2.ª ed. con el apellido escrito «Boulding»; no se ha podido determinar si es errata del libro o del reconocimiento óptico, así que no se afirma ninguna de las dos. Sobre el nivel4 (26 de agosto de 2026): se deja vacío a propósito. La práctica documentada de los astrólogos grecorromanos calculando horóscopos ya incluye el reparto en doce lugares por signos enteros — es el mismo episodio histórico que `zodiaco_tropical`, no uno independiente, y su etnografía completa vive en el nivel4 de ese dato.

### Tzolk'in · `tzolkin`

**SIN VERIFICAR — no se muestra** · clase ② Cuenta desde un origen declarado · bloque B, solo al cerrar el día

- **Nivel 1 · qué es.** Doscientos sesenta días: trece números girando contra veinte nombres.
- **Nivel 3 · cómo se cuenta y de dónde sale.** No mide ningún ángulo y no tiene ancla astronómica ninguna. Se cuenta desde un origen declarado, y para convertirlo a fecha civil hace falta una constante de correlación. Se usa la GMT 584283.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). Los ajq'ij (guardianes de los días) de Momostenango contaban el ciclo de 260 días del tzolk'in para practicar la adivinación, interpretar sueños y determinar las obligaciones rituales asociadas a cada combinación de número y nombre del día; la formación como guardián de los días duraba un ciclo completo del calendario.
  - *Quién:* Los ajq'ij (guardianes de los días) del pueblo k'iche', comunidad maya de las tierras altas de Guatemala.
  - *Dónde:* Momostenango, departamento de Totonicapán, Guatemala.
  - *Cuándo:* Trabajo de campo de 1975-1976 y visitas posteriores hasta 1989; práctica viva hasta la actualidad.
  - *Documentado por:* Tedlock, Barbara, Time and the Highland Maya, University of New Mexico Press, Albuquerque, edición revisada de 1992 (1.ª ed. 1982); reseñado en Hispanic American Historical Review.
- **Nivel 5 · quién discute qué.** Existe la variante 584285, que desplaza el resultado dos días. La datación por radiocarbono de Kennett et al. (2013) respalda la familia GMT frente a correlaciones que se separan hasta mil años, pero NO puede distinguir entre 584283 y 584285: un método con resolución de décadas no arbitra una diferencia de 48 horas. La elección de 584283 se apoya en la cuenta viva de los contadores de días k'iche' y en el uso como estándar de campo. Son argumentos de práctica, no de datación física, y así se dicen.

**Ficha**

- *Autor:* — (sin autor único)
- *Título:* Correlación Goodman-Martínez-Thompson
- *Publicación:* Fuente primaria sin localizar
- *Verificado:* No verificado

*Aviso al citar:* La ficha anterior de este proyecto decía que el radiocarbono «estrecha hacia 584283». Era una inferencia nuestra, no del artículo. Corregido el 24 de agosto de 2026. Sobre el nivel4: la fuente (Tedlock, 1992) es de las más sólidas de las diez —trabajo de campo propio de la autora, reseñado académicamente—, aunque tampoco se ha leído en el original. Y un aviso de estado: mientras `estado` siga en sin_verificar por falta de fuente primaria de la correlación, este nivel4 no llega a pantalla pase lo que pase con su propio contenido — queda escrito y listo para cuando esa cuestión se resuelva.

### Calendario islámico civil · `calendario_islamico`

**VERIFICADO FUERTE** · clase ② Cuenta desde un origen declarado · bloque B, solo al cerrar el día

- **Nivel 1 · qué es.** Meses lunares contados desde la Hégira, con un ciclo fijo.
- **Nivel 3 · cómo se cuenta y de dónde sale.** Meses alternos de 29 y 30 días, con un día añadido en 11 de cada 30 años. Se obtiene de Intl.DateTimeFormat con el calendario islamic-civil, que es el tabular. Nunca «islamic» a secas: en ICU eso equivale a islamic-rgsa, respaldado por una simulación astronómica que no coincide con la práctica real de ningún país conocido.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). Los ulama de la tradición Syatariah de Padang Pariaman se reunían en un lugar fijado por sus maestros, la playa de Ulakan y Koto Tuo, para observar juntos la aparición de la luna nueva que marca el inicio de cada mes; cuando la niebla o la nube lo impedían, completaban el mes en curso hasta treinta días.
  - *Quién:* Los ulama de la tradición Syatariah, encabezados por los tuangku (maestros religiosos) locales.
  - *Dónde:* La playa de Ulakan, Padang Pariaman, y Koto Tuo, en Agam, Sumatra Occidental, Indonesia.
  - *Cuándo:* Práctica viva; el estudio académico que la documenta es de agosto de 2019.
  - *Documentado por:* Jurnal Ulunnuha, agosto de 2019, estudio sobre la comprensión y aplicación del hadiz de la ru'yat al-hilal por los ulama Syatariah de Ulakan Padang Pariaman (indexado en DOAJ).
- **Nivel 5 · quién discute qué.** Las variantes no discrepan por poco. Medido sobre el mismo rango: islamic-tbla difiere de islamic-civil el 100 % de los días; islamic-rgsa, el 85 %; y rgsa contra umalqura, el 61 %. Elegir mal no produce un desfase de un día: produce otro calendario.

**Ficha**

- *Autor:* Reingold, Edward M. y Dershowitz, Nachum
- *Título:* Calendrical Calculations: The Ultimate Edition
- *Publicación:* 4.ª ed., Cambridge University Press, 2018, 662 pp., ISBN 978-1-107-05762-3 (cartoné) · 978-1-107-68316-7 (rústica). Impreso en el Reino Unido por TJ International Ltd, Padstow (Cornualles). Ediciones: 1.ª 1997 · 2.ª «millennium» 2001 · 3.ª 2008 · 4.ª «ultimate» 2018
- *Verificado:* 25 de agosto de 2026 · material preliminar del propio editor (assets.cambridge.org, frontmatter del 9781107057623), con ficha CIP de la Library of Congress, LCCN 2017024295 · registro de la British Library declarado en la propia obra

*Aviso al citar:* La página de créditos dice «Fourth edition 2018» y la ficha del editor dice 2017, con LCCN de 2017. Las dos son ciertas: catalogación en 2017, circulación en 2018. Se cita 2018 y se anota el 2017. Y: islamicc está obsoleto, no debe usarse. Sobre el nivel4: una sola fuente, aunque académica y muy específica de una comunidad y un lugar concretos; no corroborada todavía por una segunda fuente independiente.

### Número del nombre · `numerologia`

**SIN VERIFICAR — no se muestra** · clase ③ Convención sobre la escritura · bloque A, disponible siempre

- **Nivel 1 · qué es.** Un número obtenido de las letras del nombre según una tabla.
- **Nivel 3 · cómo se cuenta y de dónde sale.** Cada letra vale un dígito y se suman. Pero la tabla se diseñó para un alfabeto de 26 letras y el español tiene 27: nadie decidió nunca cuánto vale la ñ porque la pregunta no existía cuando se hizo la tabla.
- **Nivel 4 · qué se hacía con esto** (bloque B, solo al cerrar el día). Sarah Joanna Dennis Balliett dirigía en Atlantic City su propia Escuela de Psicología y Cultura Física para alumnado privado, donde enseñaba y aplicaba su sistema de correspondencias numéricas sobre el nombre a estudiantes y consultantes particulares.
  - *Quién:* Sarah Joanna Dennis Balliett (Mrs. L. Dow Balliett), como principal de su propia escuela.
  - *Dónde:* Atlantic City, Nueva Jersey.
  - *Cuándo:* Desde 1904 (año de su primer libro) hasta su muerte en 1929.
  - *Documentado por:* El mismo repertorio biográfico contemporáneo ya fichado en `ficha.verificado_en` de este dato — cita interna «Scannell, 1917» y una entrada de 1923, ambas usadas como nota al pie por la propia Wikipedia para esta afirmación — más Open Library OL2851279A.
- **Nivel 5 · quién discute qué.** La entrada no es un instante: es una cadena de texto, y el resultado depende de cómo se escriba. Medido sobre un nombre de prueba, dieciséis convenciones defendibles dan cuatro resultados distintos. Por eso ningún número puede guardarse solo: van con él la tabla, si se retiran las tildes, qué se hace con la ñ, si 11, 22 y 33 se reducen, la cadena exacta usada y el método del camino de vida. Y el sistema no es de Pitágoras: lo construyó Sarah Joanna Dennis Balliett, que firmaba «Mrs. L. Dow Balliett», en Atlantic City, y se autoeditó.

**Ficha**

- *Autor:* Balliett, Sarah Joanna Dennis, 1847-1929, que firmaba «Mrs. L. Dow Balliett»: L. Dow era el nombre de su marido
- *Título:* How to Attain Success Through the Strength of Vibration: A System of Numbers as Taught by Pythagoras (1904) · The Philosophy of Numbers; Their Tone and Colors (1908)
- *Publicación:* Publicados por la autora («published by the author»), esquina noroeste de las avenidas Pacific y Pennsylvania, Atlantic City (Nueva Jersey), con distribución en Londres por L. N. Fowler & Co., Imperial Arcade, Ludgate Circus
- *Verificado:* 25 de agosto de 2026 · repertorio biográfico contemporáneo publicado en vida de la autora (Scannell, New Jersey First Citizens, 1917) y otro de 1923 · Open Library OL2851279A · el copyright de 1908 a nombre de Mrs. L. Dow Balliett, Atlantic City y Londres, en la página de créditos del propio libro. Sin entrada de catálogo nacional

*Aviso al citar:* Circulaban tres años en conflicto para «el primer libro» —1903, 1908 y 1911— y eran libros distintos: el primero es de 1904. No aparecía en catálogos porque era autoedición. Y la frase de Tesla sobre energía, frecuencia y vibración que suele usarse de puente es apócrifa: no está en sus patentes, conferencias ni artículos, y la única atribución rastreable llega por un vendedor de placas de armonía. La fecha de The Balliett Philosophy of Number Vibration in Questions and Answers aparece como 1918 en unas fuentes y 1930 en otras: no resuelto. Y la mayoría de fuentes dan Sarah Joanna Dennis como nombre, pero al menos una anotación de catálogo dice Josie Dow Balliett, con 84 años al morir, que no cuadra con 1847-1929 (serían 82): no se elige ninguna. Sobre el nivel4: reutiliza la misma fuente biográfica ya verificada en la ronda del pendiente 15, así que no añade riesgo de fuente nuevo.

<!-- FIN DEL DERIVADO -->
