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

> **Nota de arquitectura, 25 de agosto de 2026.** Las decisiones 0016 y 0018
> parten este documento en dos, y lo colocan: las fichas no son una capa aparte,
> son **los niveles 3, 4 y 5 de la pantalla `dia`** que la 0015 ya había diseñado.
> **Las fichas** —autor, título, edición, editorial, ciudad, año,
> colación, ISBN, identificadores, estado y aviso— pasarán a `app/js/fuentes.js`,
> que será el **original**, y este documento se generará a partir de él. **El
> razonamiento** —la taxonomía, los tres estados, las reglas de desempate, la línea
> de la vibración, los porqués de cada elección— se queda aquí y no viaja al móvil.
> Los **avisos al citar** viajan en la ficha pero no se muestran en pantalla: son
> para quien mantiene la bibliografía. Hasta que exista el derivador, este
> documento sigue siendo el original y el único sitio donde se edita una ficha.
>
> *Escrito ya: `app/js/fuentes.js`, con diez datos y once pruebas doradas
> verificadas por mutación. Falta el derivador que genera este documento a partir
> de él, y el renderizador.*

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

- **Origen:** el equinoccio vernal, 0° de Aries por definición.
- **Deriva:** ninguna respecto a las estaciones; ~50,3″/año respecto a las estrellas.
- Es el ajuste por defecto de la astrología occidental y **casi nunca se etiqueta**.
  Umbral lo etiqueta siempre.

### Zodiaco sidéreo (ayanamsa Lahiri / Chitrapaksha)

- **Origen:** la estrella Spica fijada en 180° sidéreos.
- **Cálculo propio:** Spica definida con sus coordenadas J2000
  (AR 13h 25m 11,579s · Dec −11° 09′ 40,75″) y longitud eclíptica pedida al motor
  para la fecha. No se copia una tabla de ayanamsas.
- **VERIFICADO FUERTE** el 24 de agosto de 2026: las coordenadas J2000 usadas
  coinciden exactamente con las publicadas para α Virginis.
- **Limitación conocida, ahora medida.** No se aplica movimiento propio.
  El de Spica es −42,35 mas/año en ascensión recta y −30,67 mas/año en
  declinación, o sea 52 mas/año ≈ **0,052″/año**. Entre 1995 y 2026 acumula
  **1,6″ contra un ayanamsa de unos 85.600″**: una parte entre 53.000.
  Despreciable deja de ser una impresión y pasa a ser una cifra.
- Verificado para 1995-02-18T21:43Z: ayanamsa 23,7801° = 23° 46,8′.

### Términos solares chinos (jieqi)

- **24 momentos espaciados 15° a lo largo de la eclíptica**, contados desde el
  equinoccio vernal. Son, por tanto, **tropicales**: mismo origen que el zodiaco
  occidental, distinta partición.
- Lichun (315°) abre el año en la astrología BaZi; la tradición popular usa el
  Año Nuevo lunar. **Las dos fechas pueden diferir semanas** y hay que declarar cuál.
- Inscritos en la Lista Representativa del Patrimonio Cultural Inmaterial de la
  UNESCO el **30 de noviembre de 2016**, en la 11.ª sesión del Comité
  Intergubernamental, celebrada en Adís Abeba, con el título completo *The
  Twenty-Four Solar Terms, knowledge in China of time and practices developed
  through observation of the sun's annual motion*. **VERIFICADO FUERTE** el 24 de
  agosto de 2026.
  El «2013» era un error: la fecha que se confunde con esta es **2006**, año
  en que el elemento entró en la lista **nacional** china, que es otra cosa.

### Nakshatras (27 mansiones lunares) y tithi

**CERRADO el 25 de agosto de 2026 con fuente primaria en dominio público.**
Las dos fichas comparten fuente y por eso van juntas.

**La fuente**

Burgess, Ebenezer (1805-1870), trad. *Translation of the Sûrya-Siddhânta, a
Text-Book of Hindu Astronomy; with Notes, and an Appendix, containing additional
notes and tables, calculations of eclipses, a stellar map, and indexes*.
Asistido por el Comité de Publicación de la American Oriental Society.
Publicado en el *Journal of the American Oriental Society*, vol. VI, pp. 141-498.
Separata: New Haven, para la American Oriental Society, impresa por E. Hayes,
1860. 1 h. + iv + 354 pp., 1 h., con carta plegable y diagramas, 24 cm.

- **VERIFICADO FUERTE** el 25 de agosto de 2026 contra el registro de catálogo de
  HathiTrust n.º 011604382 (ejemplar de la Universidad de Harvard, hvd.32044019816925,
  vista completa), OCLC 9857844, y contra el propio texto digitalizado.
  Referencia JSTOR: 592174 · DOI 10.2307/592174.
- **Dominio público**, digitalizado íntegro y consultable sin barrera.
- *Aviso al citar:* JSTOR fecha el volumen como «Vol. 6 (1858-1860)» porque el
  tomo se compuso a lo largo de tres años. La separata y la portada dicen **1860**;
  la portadilla interior añade que el trabajo se comunicó a la Sociedad el
  **17 de mayo de 1858**. Las tres fechas son correctas y describen cosas
  distintas: comunicación, tomo y publicación. Se cita 1860.
- *Segundo aviso:* el trabajo se cita a menudo como «Burgess» a secas, pero el
  propio Burgess declara en la nota introductoria que entregó su material al
  Comité de Publicación para su revisión y ampliación, y que **la mayor parte de
  las notas recayó en W. D. Whitney**. El comentario es bastante más extenso que
  la traducción. Cuando se cite una nota y no un verso, se cita Burgess-Whitney.

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
| **27 divisiones de 13° 20′ y sus nombres** | cap. VIII, no cotejado todavía | **DÉBIL** |
| **Subdivisión en 4 padas de 3° 20′** | cap. VIII, no cotejado todavía | **DÉBIL** |

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

- **Ocho tipos de 45°** sobre la separación Luna − Sol.

**CORREGIDO el 25 de agosto de 2026. La ficha anterior fundía dos libros distintos
en uno y le ponía al primero la fecha del segundo.**

Son dos obras, con quince años y un océano entre ellas:

- Rudhyar, Dane. *The Moon: The Cycles and Fortunes of Life*. David McKay Company,
  Washington Square, Filadelfia, **1946**. Cartoné con sobrecubierta, [5] + 111 pp.
  + 2 pp. de publicidad.
- Rudhyar, Dane. *The Lunation Cycle: A Key to the Understanding of Personality*.
  Servire, Wassenaar / La Haya, **1967**, distribuido por Llewellyn Publications,
  St. Paul (Minnesota). Rústica, 156 pp., ilustrado, 23 cm, con bibliografía del
  autor en pp. [157]-[158]. **Es la reelaboración del libro de 1946 bajo título
  nuevo.**
- Rudhyar, Dane. *The Lunation Cycle*. Aurora Press, Santa Fe (Nuevo México),
  **1986**, ISBN 0-943358-26-4 / 978-0-943358-26-0, 196 pp. Incluye además
  *The Lunation Process in Astrological Guidance*, de Leyla Rael Rudhyar
  (Aurora, Nueva York, c1984). Es la edición en circulación.

**VERIFICADO FUERTE** el 25 de agosto de 2026. La cadena que lo cierra:

1. El **verso de la portada de la edición de Aurora** declara que la obra se
   publicó primero bajo el título *The Moon, the Cycles and Fortunes of Life* por
   David McKay Co. Consta en el registro catalográfico del ejemplar digitalizado
   (Internet Archive `lunationcycle00dane`, Open Library OL8445199M / obra
   OL8046023W, OCLC 19531810) y en WorldCat 1036668863.
2. La descripción física del ejemplar de 1946 —editorial, ciudad, año, colación—
   procede de la ficha de la biblioteca especializada Astrolearn, que describe dos
   ejemplares en mano.
3. La 1.ª ed. de 1967, con pie Servire y distribución Llewellyn, consta con
   colación completa en registros de librería anticuaria coincidentes entre sí.

**Lo que la duda del 24 de agosto tenía de razón y lo que no.** Tenía razón en que
el título alternativo no encajaba: no encajaba **porque la fecha estaba mal**. El
título existe y está documentado en la fuente más directa posible, la propia página
de créditos del editor. Lo que no existe es «1.ª ed. con ese título en 1967».
El error era nuestro, no del dato.

*Aviso al citar:* Aurora Press reimprime con la fecha 1967 en algunas tiradas
posteriores, y varios agregados comerciales dan «publicado el 1 de junio de 1967,
Aurora Press, 196 páginas», que mezcla el año de Servire con la editorial y la
paginación de Aurora. No usar esa combinación.

- Contiene además el «cumpleaños de lunación»: el retorno mensual del ángulo
  Luna−Sol de nacimiento. Calculable con `luna.js` tal como está.

### Casas — **no es un dato, es una convención**

Medido sobre la carta de referencia (39° N): de seis sistemas,
**8 de 10 planetas cambian de casa** según cuál se elija. Solo coinciden los que
están a mitad de casa.

- Signos enteros · Iguales · Porfirio · Placidus · Regiomontano · Campano.
- Placidus **no existe** por encima del círculo polar: el arco semidiurno se
  vuelve imaginario.
- **Regla:** ningún campo puede decir `casa: 12` sin decir al lado qué sistema lo
  produjo. Sin el sistema, el campo miente por omisión.

**CERRADO el 25 de agosto de 2026: aparecida la primera edición.**

- Houlding, Deborah. *The Houses: Temples of the Sky*. 1.ª ed., **Ascella
  Publications, 1998**, ISBN 1-898503-69-9 / 978-1-898503-69-9.
- Houlding, Deborah. *The Houses: Temples of the Sky*. 2.ª ed., revisada y muy
  ampliada, **The Wessex Astrologer Ltd, Bournemouth, 2006**, ISBN 1-902405-20-X /
  978-1-902405-20-9, 196 pp. Es la que está en circulación, y **es la que se cita**.

- **VERIFICADO DÉBIL.** La 2.ª ed. está sostenida por el registro del propio editor
  y por catálogo. La 1.ª de 1998 consta con ISBN y pie Ascella en registro
  bibliográfico agregado, y el libro declara que hay ejemplar depositado en la
  British Library, pero **no se ha cotejado contra el catálogo de la British
  Library**. Ese cotejo es lo único que la sube a fuerte, y no requiere el ejemplar.
- *Dato que explica el enredo:* Ascella Publications era **la propia editorial de
  Houlding**, que la fundó. La primera edición era, en la práctica, autoedición de
  autora, y de ahí que se catalogara poco y desapareciera de circulación durante
  años. No era una laguna: era una tirada corta.
- *Aviso al citar:* la ficha de créditos de la 2.ª ed. lleva la línea de copyright
  con el apellido escrito **«Boulding»** en algunas transcripciones que circulan.
  No se ha podido determinar si es errata del libro o del reconocimiento óptico
  de las copias no autorizadas donde aparece, así que **no se afirma ninguna de las
  dos cosas**. Se anota para que nadie la propague como dato.

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

**La referencia algorítmica, fichada el 25 de agosto de 2026**

- Reingold, Edward M. y Dershowitz, Nachum. *Calendrical Calculations: The
  Ultimate Edition*. **4.ª ed.**, Cambridge University Press, 2018, 662 pp.
  ISBN 978-1-107-05762-3 (cartoné) · 978-1-107-68316-7 (rústica).
  Impreso en el Reino Unido por TJ International Ltd, Padstow (Cornualles).
- **VERIFICADO FUERTE.** Contrastado contra el material preliminar publicado por
  el propio editor (`assets.cambridge.org`, frontmatter del 9781107057623), que
  incluye la ficha CIP de la Library of Congress, LCCN **2017024295**, y contra
  el registro de la British Library declarado en la propia obra.
- **Historia de ediciones:** 1.ª 1997 · 2.ª «millennium» 2001 · 3.ª 2008 ·
  4.ª «ultimate» 2018.
- **Por qué se cita la 4.ª y no la 3.ª**, que es la más citada en la bibliografía
  antigua: es la vigente, es la que cualquiera puede cotejar hoy, y es la única
  que trata expresamente el **Umm al-Qura saudí** y amplía el tratamiento del
  calendario islámico observacional — que es justo el eje de la decisión
  `islamic-civil` de arriba. Citar la edición que uno no puede abrir para
  parecer más clásico es lo contrario de lo que pide la regla 0.1.
- *Aviso al citar:* la página de créditos dice **«Fourth edition 2018»** y la
  portada del editor dice **«Cambridge: Cambridge University Press, 2017»**, con
  LCCN de 2017. Las dos son ciertas: catalogación en 2017, circulación en 2018.
  Se cita 2018 y se anota el 2017. **No se elige en silencio.**

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

**La autora**

Sarah Joanna Dennis Balliett (1847–1929), que firmaba **«Mrs. L. Dow Balliett»**
—L. Dow era el nombre de su marido—, de Atlantic City, Nueva Jersey.

**Por qué no aparecía en ningún catálogo de biblioteca**

Porque **se autoeditó**. El pie de imprenta de sus libros es literalmente
*«published by the author»*, en la esquina noroeste de las avenidas Pacific y
Pennsylvania de Atlantic City, con distribución en Londres a través de
L. N. Fowler & Co., Imperial Arcade, Ludgate Circus. Eso no es una laguna
documental: es el dato. Un sistema construido en autoedición no deja el mismo
rastro que uno publicado por una casa editorial, y buscarlo con las herramientas
de la segunda es lo que producía el falso conflicto.

**Cronología, ordenada**

| Año | Obra | Papel |
|---|---|---|
| 1901 | *The Body Beautiful: According to the Delsartian Philosophy* | Anterior al sistema, no numerológica |
| **1904** | *How to Attain Success Through the Strength of Vibration: A System of Numbers as Taught by Pythagoras* | **El primer libro del sistema** |
| 1908 | *The Philosophy of Numbers; Their Tone and Colors* | El texto fundacional al que todos remiten |
| 1911 | *Nature's Symphony, or Lessons in Number Vibration* | Extiende a color y armonía |
| 1917 | *The Day of Wisdom According to Number Vibration* | |
| 1930 | *The Balliett Philosophy of Number Vibration in Questions and Answers: A Text Book* | Póstumo |

- **VERIFICADO DÉBIL.** La lista procede de un repertorio biográfico contemporáneo
  publicado **en vida de la autora** (Scannell, *New Jersey First Citizens*, 1917)
  y de un segundo repertorio de 1923, más el registro de autoría de Open Library
  (OL2851279A). El copyright de 1908 a nombre de Mrs. L. Dow Balliett, Atlantic
  City y Londres, consta en la página de créditos del propio libro.
- *Aviso al citar:* la fecha del *Questions and Answers* aparece como **1918** en
  unas fuentes y **1930** en otras. No resuelto. Y hay una discrepancia en el
  nombre de pila: la mayoría de fuentes dan *Sarah Joanna Dennis*, y al menos una
  anotación de catálogo dice *Josie Dow Balliett*, con edad de 84 al morir, que no
  cuadra con 1847-1929 (serían 82). No se elige ninguna.

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
| Divisiones de nakshatra | 27 × 13° 20′ | ① | **DÉBIL** — Burgess cap. VIII sin cotejar |
| Padas | 4 × 3° 20′ | ① | **DÉBIL** — idem |
| Divisiones de tithi | 30 × 12° | ① | **FUERTE** — Burgess cap. I, vv. 12-13 |
| Omisión de tithi (*tithikshaya*) | regla | ① | **FUERTE** — Burgess cap. I, vv. 36-38 |
| Fases de Rudhyar | 8 × 45° | ① | **FUERTE** — Rudhyar 1946/1967/1986 |
| Spica J2000 | AR 13h 25m 11,579s · Dec −11° 09′ 40,75″ | ① | **FUERTE** (24 ago 2026) |
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
8. ~~Houlding, primera edición~~ → **Ascella Publications, 1998**, ISBN
   1-898503-69-9. Era autoedición de la propia autora, que fundó Ascella.
9. ~~Nakshatra y tithi, fuente primaria~~ → **Burgess, JAOS vol. VI, 1860**,
   dominio público, HathiTrust 011604382. Tithi cerrado en el texto, incluida la
   regla de omisión. Nakshatra pendiente del cap. VIII.
10. ~~Reingold-Dershowitz~~ → **4.ª ed., Cambridge, 2018**, ISBN 978-1-107-05762-3,
    con el motivo escrito de por qué la 4.ª y no la 3.ª.
11. ~~Numerología, el conflicto de fechas~~ → **disuelto: eran libros distintos.**
    El primero es de 1904. La razón de que no estuviera en catálogos es que era
    autoedición.
12. ~~El puente vibratorio~~ → línea trazada arriba. Se ficha lo que el sistema
    dice; no se ficha como física.

**Siguen abiertos**

1. **Nakshatra: cotejar el capítulo VIII de Burgess.** Es lo único que queda del
   pendiente 15 en su parte de fuente primaria, y no necesita ejemplar: el texto
   está digitalizado y es de dominio público. Media hora de lectura.
2. **Houlding: cotejar la 1.ª ed. contra el catálogo de la British Library.**
   Sube la ficha de débil a fuerte.
3. **Balliett: una entrada de catálogo nacional** para 1904 o 1908. Es el último
   requisito bibliográfico para desbloquear la clase ③.
4. **Meeus: cotejar el ejemplar.** Ver el pendiente 27, que ya no es solo del 15.
5. **Tabla pitagórica y caldea: obra de referencia con edición comprobable.**
   Sigue siendo la ficha más débil del documento, y es la que bloquea la clase ③
   junto con el punto 3.
6. **Correlación GMT: fuente primaria de Goodman-Martínez-Thompson.**

---

*Última revisión: 25 de agosto de 2026 — cierre del pendiente 15 en sus cuatro*
*fichas, apertura de los tres estados de verificación, y reconducción de la*
*numerología.*
