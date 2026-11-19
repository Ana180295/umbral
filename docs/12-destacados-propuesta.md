# 12 · Los destacados del cielo — propuesta para aprobar

*18 de noviembre de 2026; fuentes de las listas 2 y 3 buscadas el 19. Ana, el 19:
«adelante, busca las fuentes, vamos a incluirlo»: las nueve filas de la lista 1
quedan aprobadas como están, con las dos preguntas de abajo todavía abiertas.*

*Ana, 18 de noviembre (debate B): tres listas de destacados,
«Cielo», «Astrología» y «Por tradición». Quedamos en que cada destacado de la
lista «Cielo» lleva un criterio numérico que se propone aquí y Ana aprueba.
**Nada de esto está programado todavía.***

El criterio de fondo es el de los orbes (03): **el día vacío tiene que poder
existir**. Si todos los días tienen un destacado, ninguno destaca.

---

## Lista 1 · Cielo — lo astronómico, medible

Cada fila: qué se destaca, el criterio exacto, cuántas veces pasa en 2026 visto
desde Albacete (medido el 18 de noviembre con el motor y el ΔT medido) y la
búsqueda del motor que lo calcula. **El destacado sale el día civil que contiene
el instante**, salvo «toda la noche», que sale la noche entera.

| # | Destacado | Criterio propuesto | 2026 | Del motor |
|---|---|---|---|---|
| 1 | **Oposición** de Marte, Júpiter, Saturno, Urano o Neptuno | El instante en que su longitud eclíptica geocéntrica está a 180° de la del Sol | 5 | `SearchRelativeLongitude` |
| 2 | **Conjunción con el Sol** de un planeta exterior | Su longitud, igual a la del Sol (0°). El planeta no se ve esos días | 4 | `SearchRelativeLongitude` |
| 3 | **Conjunción inferior o superior** de Mercurio o Venus | Igual, 0°; inferior si pasa por delante del Sol, superior si por detrás | 8 | `SearchRelativeLongitude` |
| 4 | **Máxima elongación** de Mercurio o Venus | El instante de máxima separación angular del Sol, de tarde o de mañana | 7 | `SearchMaxElongation` |
| 5 | **Estación**: un planeta se para y cambia de sentido | El día en que su velocidad en longitud eclíptica geocéntrica cambia de signo (empieza o termina el retrógrado) | 18 | barrido diario del motor |
| 6 | **La Luna más cerca o más lejos** (perigeo, apogeo) | El instante de mínima o máxima distancia Tierra-Luna de cada mes | 27 | `SearchLunarApsis` |
| 7 | **Eclipse de Luna** visible desde el sitio | Parcial o total, con la Luna sobre el horizonte en el máximo. Los penumbrales, fuera: no se distinguen a simple vista | 1 (28 ago) | `SearchLunarEclipse` |
| 8 | **Eclipse de Sol** visible desde el sitio | Cualquiera que el motor dé como visible desde el sitio | 1 (12 ago, parcial en Albacete) | `SearchLocalSolarEclipse` |
| 9 | **Planeta visible toda la noche** | Marte, Júpiter o Saturno sobre el horizonte desde la puesta del Sol hasta su salida, comprobado cada media hora | Júpiter 7 noches (9-15 ene), Saturno 2 (6-7 oct) | `SearchRiseSet`, `Horizon` |

**Con las nueve, 2026 tiene 73 días con algún destacado y 292 vacíos.**

Fuera de la lista, a propósito:

- **Superluna, microluna**: no tienen una definición astronómica única; cada
  fuente pone el umbral en un sitio. Si se quiere, el perigeo (fila 6) ya dice lo
  medible.
- **Lluvias de estrellas**: no salen del motor. Necesitarían una fuente propia,
  la International Meteor Organization (IMO), con su ficha.
- **Las salidas y puestas de cada cuerpo** no son un destacado: pasan todos los
  días. Van como dato del día, a la vista cuando se pida, no en esta lista.
- **Los tránsitos de Mercurio o Venus por delante del Sol**: el motor los
  calcula, pero el próximo de Mercurio es el 13 de noviembre de 2032 y el de
  Venus, en 2117 (medido con `SearchTransit`). Se pueden añadir sin cambiar el
  criterio.

**Lo que hay que aprobar:** cada una de las nueve filas, con su criterio, o
cambiar el criterio. Y dos preguntas:
- **La 6 (perigeo y apogeo)** es la que más llena: 27 días. ¿Entran los dos, solo
  el perigeo, o ninguno?
- **La 9**: ¿solo los tres planetas que se ven a simple vista, o también Urano y
  Neptuno, que necesitan prismáticos?

---

## Lista 2 · Astrología

Depende del mapa de fuentes (`docs/11`, pendiente 53): ningún destacado
astrológico sale sin su obra fichada. Candidatos, para cuando la haya:

- Un planeta **cambia de signo**.
- **Aspectos exactos** del cielo del día con la carta natal: son las líneas del
  bloque B que se decidieron el mismo día (debate A).
- **Retornos**: solar (cumpleaños astronómico) y lunar (ya está el cumpleaños
  lunar).
- **Luna vacía de curso**: hay definiciones distintas según la escuela; antes de
  entrar hay que elegir fuente.

## Lista 3 · Por tradición

Los días señalados de cada calendario que ya está fichado. Cada uno necesita una
línea de fuente, aunque la tradición ya la tenga:

- **Tithi:** la luna llena (*purnima*, tithi 15) y la nueva (*amavasya*, tithi
  30) salen de la definición de Burgess. Los días de observancia, como el
  *ekadashi* (tithi 11 y 26), son práctica ritual: clase ⑤, con etnografía.
- **Jieqi:** el primer día de cada término solar. Ya fichado (UNESCO).
- **Calendario islámico:** el primer día de cada mes, en el civil aritmético que
  ya usa Umbral. Los meses señalados, como el ramadán, son práctica: clase ⑤.
- **Fases de Rudhyar:** el cumpleaños de lunación, ya calculado.

---

## Las fuentes de las listas 2 y 3 — buscadas el 19 de noviembre de 2026

Estados según el 05. Ninguna obra se ha leído entera: lo que dice cada una de su
tema sale de su índice o de reseñas, y hay que leer el capítulo antes de escribir
nada en pantalla. Ningún texto se copiará del libro.

### Lista 3 · Por tradición

| Destacado | Fuente | Estado |
|---|---|---|
| **Luna llena y luna nueva** en el tithi (final del 15 y del 30) | **Burgess** (ya fichado): la quincena clara va de la luna nueva a la llena y la oscura, de la llena a la nueva. Notas, pp. 174-175 | **FUERTE**, cotejado en el texto el 19 de noviembre. Los nombres sánscritos (*pūrṇimā*, *amāvāsyā*) no aparecen en esa parte: se escribe «luna llena» y «luna nueva» |
| **Ekādaśī** (tithi 11 y 26), día de observancia | **Kane, Pandurang Vaman. *History of Dharmaśāstra*, vol. V, parte 1: *Vratas, utsavas and kāla*.** Bhandarkar Oriental Research Institute, Poona, 1958, 718 pp. Government Oriental Series, clase B, n.º 6. El capítulo V es entero sobre el ekādaśī | **FUERTE** como edición: ficha de la Biblioteca Nacional de Francia y reseñas de 1958 en el *BSOAS* y el *JRAS*. Capítulo **sin leer**. Es práctica: clase ⑤, con etnografía |
| **Primer día de cada término solar** (jieqi) | UNESCO, ya fichado | **FUERTE** |
| **Primer día de cada mes islámico** | Reingold-Dershowitz, ya fichado | **FUERTE** |
| **Ramadán**, mes de ayuno | ***The Qur'an*, trad. M. A. S. Abdel Haleem.** Oxford University Press, 2004 (Oxford World's Classics; ed. corregida, 2005; reed. 2008). Sura 2, *La vaca* | **FUERTE** como edición: registro de HathiTrust de la reedición de 2008, con la historia de ediciones del verso de portada, y copia digitalizada con la portada legible. Los versículos sobre el ayuno **sin leer**. Es práctica: clase ⑤ |
| **Cumpleaños de lunación** | Rudhyar, ya fichado | **FUERTE** |

### Lista 2 · Astrología (psicológica, como decidió Ana el 16)

| Destacado | Fuente candidata | Estado |
|---|---|---|
| **Tránsitos a la carta natal** (las líneas del bloque B) | **Hand, Robert. *Planets in Transit: Life Cycles for Living*.** Para Research, 1976, xii + 528 pp. Reediciones: Schiffer, 1980; Whitford; Redfeather, 2002. Es la obra de referencia moderna sobre tránsitos, uno por uno | **SIN VERIFICAR**: solo registros de librería y Open Library. *Aviso:* el lugar de edición aparece como Gloucester (Massachusetts) en librerías y como Rockport (Massachusetts) en una enciclopedia; no se elige |
| **Retorno solar** | **Shea, Mary Fortier. *Planets in Solar Returns: Yearly Cycles of Transformation and Growth*.** 1.ª ed., 1992; ed. revisada, Twin Stars Unlimited, 1998; 3.ª ed., 2018. La autora es licenciada en psicología del asesoramiento, y la orientación es psicológica | **SIN VERIFICAR**: solo librerías |
| | Otra candidata: **Kirby, Babs y Stubbs, Janey. *Interpreting Solar and Lunar Returns*.** 2.ª ed., The Wessex Astrologer, 2025. Su editor la presenta como el primer libro con orientación psicológica para los retornos solares y lunares | **SIN VERIFICAR**; falta la fecha de la 1.ª ed. |
| **Cambio de signo** de un planeta | El hecho es astronómico; lo que significa sale de la obra que se elija para los signos (docs/11) | Depende del 53 |
| **Luna vacía de curso** | **Ana, 19 de noviembre: la definición moderna.** Empieza cuando la Luna hace su último aspecto mayor (conjunción, sextil, cuadratura, trígono u oposición) antes de cambiar de signo, y acaba al entrar en el signo siguiente. La formuló Al H. Morrison en su *Void of Course Moon Ephemeris*, publicada cada año desde los años setenta (citada por terceros; sin edición ni año localizados). La misma definición, con los cinco aspectos ptolemaicos, aparece en el *Moon Sign Book* de Llewellyn. La de Lilly (1647) queda descartada; Sue Ward (1992) sostiene que la moderna lee mal a Lilly | **SIN VERIFICAR.** Falta localizar una edición de Morrison o del *Moon Sign Book*, y **cuerpos que cuentan: todos, del Sol a Plutón** (Ana, 19 de noviembre: «entran todos»); **Quirón, fuera** («dejamos a Quirón fuera», tras la medida de abajo). Decisión 0039 |

**Sistema de casas por defecto en «Tu cielo»** (Ana, 19 de noviembre: «la más común»): **Placidus**. Chris Brennan y Anthony Louis (*The Astrology Podcast*, ep. 244, 24-2-2020) lo dan como el sistema más popular en la astrología occidental moderna y el predeterminado en la mayoría de programas, Astrodienst incluido; Astrotheme dice lo mismo. Estado: DÉBIL, porque es un dato de uso y no un texto.

### Luna vacía de curso, medida en 2026 (19 de noviembre)

`herramientas/medir-luna-vacia.mjs`. Definición moderna: desde el último aspecto mayor
exacto (0°, 60°, 90°, 120°, 180°) antes de cambiar de signo hasta la entrada en el
signo siguiente. 160 entradas en 2026, así que 160 periodos.

| Cuerpos que cuentan | Horas vacías en el año | % del año | Media | Mediana | Máximo | < 1 h | > 24 h |
|---|---|---|---|---|---|---|---|
| Solo a simple vista (Sol-Saturno), como referencia | 2.070 h (86 días) | 23,6 % | 12,9 h | 9,8 h | 52,8 h | 7 | 25 |
| **Sol a Plutón** (lo elegido por Ana) | 1.721 h (72 días) | 19,6 % | 10,8 h | 6,9 h | 44,9 h | 16 | 21 |
| Sol a Plutón **y Quirón** | 1.163 h (48 días) | 13,3 % | 7,3 h | 4,2 h | 42,9 h | 25 | 11 |

Quirón cambia 48 de los 160 periodos (30 %) y quita 558 horas en el año (mediana 9 h
por periodo cambiado). El mayor recorte es la entrada del 12 de diciembre: de 44,9 h a
7,0 h. Con solo los planetas a simple vista hay un signo entero sin ningún aspecto.

**Cotejo externo:** los 40 periodos de enero a marzo de 2026 de las tablas de Café
Astrology (hora de Nueva York) coinciden con el cálculo Sol-Plutón en cuerpo, aspecto y
hora, todos dentro de 1 minuto. Esas tablas **no cuentan Quirón**: donde Quirón
recortaría (p. ej. la entrada del 25 de enero) dan el periodo largo. Este cotejo
debería entrar como prueba cuando se programe la Luna vacía.

**Lo que hace falta para que la lista 2 y la 3 pasen a pantalla:** leer el capítulo
de cada una, fichar en `fuentes.js` las que lleguen a FUERTE o DÉBIL, y decidir la
definición de la Luna vacía de curso.

## Horas planetarias: qué se enseña

**Ana, 19 de noviembre: queda pendiente, se decide más tarde.** Las dos lecturas de
abajo siguen adelante porque, dice Ana, lo que traen «nos podría venir bien para más
aparte de lo del día», aunque no hablen de las horas.

Para el dato hay fuente: Dion Casio XXXVII 18-19 (ficha FUERTE) explica que cada día
lleva el nombre del planeta de su primera hora. Para lo que *significa* cada hora:

| Obra | Qué hay | Estado |
|---|---|---|
| ***Picatrix*** (*Ghāyat al-Ḥakīm*, árabe, s. X; atribuido a al-Maŷrīṭī; versión castellana a mediados del s. XIII y luego latina). **Edición latina de David Pingree**: *Picatrix. The Latin version of the Ghāyat al-Ḥakīm*, Studies of the Warburg Institute 39, Londres, Warburg Institute, 1986, lxxx + 326 pp. PDF gratuito de Warburg Commons, 426 pp., subido por Ana el 19 de noviembre | **Leído el 19 de noviembre en el PDF.** No trae una tabla de «para qué sirve cada hora»; la hora no aparece nunca como cualidad del momento. Lo que hay: **(1)** la naturaleza de cada planeta, es decir, qué personas y peticiones le corresponden (III.vii.2-8, pp. 112-113), con la regla de no pedirle a un planeta nada fuera de su naturaleza (III.vii.2, p. 112; repetida en III.ix, p. 144); **(2)** la hora del planeta como condición para fabricar sus imágenes (II.x, pp. 68-74) y su día para invocarlo, tras siete días de ayuno y un sacrificio animal (IV.ii, pp. 187-188). **Aviso:** hay también magia dañina («para destruir a un enemigo», «para destruir una ciudad») | Edición **FUERTE**. Para una línea en pantalla, solo servirían **la naturaleza de cada planeta** (III.vii) o **la regla** de pedir en su hora lo que es de su naturaleza; lo segundo es lectura nuestra y habría que decirlo así |
| **al-Bīrūnī, *The Book of Instruction in the Elements of the Art of Astrology*** (Ghazna, 1029). Trad. R. Ramsay Wright. Luzac, Londres, 1934, xviii + 333 + 333 pp. Digitalizado en abierto por la Biblioteca Universitaria de Halle (doi 10.25673/99914); Ana lo bajó y lo redujo a 718 pp. el 19 de noviembre | **Leído el 19 de noviembre en el PDF.** Tampoco da significados de las horas. **§390** (p. 237): explica el sistema, igual que Dion: la primera hora del domingo es del Sol, las siguientes bajan por el orden de las esferas, y cada día toma el nombre del planeta de su primera hora. **§391** (p. 238): «nuestros astrólogos» separan día y noche y los parten en **horas desiguales**. Los indios, en cambio, dan el día entero, de salida a salida del sol, a un solo planeta, con horas iguales; Bīrūnī lo cree más razonable y llama a las horas desiguales «contrarias a la naturaleza». **§393** (p. 239): calcular los señores de la hora de una ciudad le parece absurdo. **§§396-401** (p. 240): naturaleza de cada planeta (cualidades, benéfico o maléfico, sexo, diurno o nocturno, sabor, color); siguen las secciones de lo que rige cada planeta | Edición **FUERTE**. **Nuevo para la decisión 0036:** las horas desiguales, con el día de salida a puesta del sol, que eligió Ana, son las que Bīrūnī atribuye a los astrólogos de su tiempo (§391; que el día va de salida a puesta lo precisa la leyenda del diagrama de §390, quizá del traductor). Nota añadida en la 0036 |
| Lilly, *Christian Astrology* (1647) | Usa la hora solo para saber si una pregunta horaria se puede juzgar | No sirve |

Si algo entra, será una ficha **Por tradición**, contada como «en el *Picatrix* la
hora de Venus se usaba para…». Con la regla 0.2, nunca como efecto.
