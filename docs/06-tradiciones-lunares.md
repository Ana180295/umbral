# 06 · Tradiciones de calendario: inventario razonado

**Fecha:** 22 de agosto de 2026 · **Estado:** documentación, no es una decisión
**Para qué:** material para decidir cómo se forma el calendario de Umbral, y
más adelante, el «para saber más» de la propia app
**Relacionada con:** decisión 0012

---

## Cómo leer esto

No todos los calendarios lunares son la misma clase de objeto, y la diferencia
importa mucho para una app que no puede inventar datos. Van agrupados por **qué
hace falta para saber la fecha**:

| Familia | Qué hace falta | Qué puede hacer Umbral |
|---|---|---|
| **1 · Aritméticos** | Una regla escrita. Nada más. | Dar la fecha exacta siempre |
| **2 · Astronómicos** | Calcular la posición del cielo | Dar la fecha exacta, sin red |
| **3 · Observacionales** | Que alguien mire | **No puede dar la fecha** |
| **4 · Reconstruidos** | Fuentes con desacuerdo entre sí | Dar una versión, diciendo cuál |

La familia 3 es la incómoda y la más interesante: la fecha no existe hasta que
un ojo humano la produce. Ahí lo honesto es decirlo, no calcular una
aproximación y llamarla fecha.

---

## Familia 1 · Aritméticos puros

La regla *es* la verdad. No se comprueba contra el cielo; el cielo ya no manda.

### Calendario hebreo

Fijado por reglas aritméticas hacia el siglo IV (la tradición lo atribuye a
Hilel II; la fijación fue probablemente gradual). Dos piezas:

- **El *molad***: intervalo medio entre lunas nuevas, definido como 29 días,
  12 horas y 793 *jalakim*, con la hora dividida en 1080 partes. Eso son
  **29,530594 días**. El mes sinódico real medio es 29,530588. La diferencia es
  de menos de un segundo, fijada por escrito hace más de mil años.
- **El ciclo metónico**: 19 años, de los cuales 7 llevan un mes añadido (los
  años 3, 6, 8, 11, 14, 17 y 19). Encima van cuatro *dejiyot*, reglas de
  aplazamiento que impiden que ciertas fiestas caigan en ciertos días.

*Lo que aporta:* la prueba de que se puede tener un calendario lunisolar exacto
y cerrado, sin mirar nunca arriba. Y el número del *molad* como testimonio de
hasta dónde llegaba la medida antigua.

### Calendario islámico tabular

Ciclos de 30 años con 11 años bisiestos, meses alternando 30 y 29 días. Mes
medio: 29,530556 días. Es la versión calculable del calendario que en la
práctica es observacional (ver familia 3). **Existen las dos a la vez**, y no
siempre coinciden: es el mejor ejemplo de que una misma tradición puede vivir en
dos familias distintas.

### El *computus* cristiano

El calendario juliano y el gregoriano son solares, pero llevan dentro una tabla
lunar: la fecha de Pascua se calcula con el **número áureo** y las **epactas**,
que son una luna aritmética montada sobre un año solar. Es la Luna sobreviviendo
dentro de un calendario que ya no es suyo.

### Dreamspell / Trece Lunas

De José Argüelles, 1990. Trece meses de 28 días —364— más un «día fuera del
tiempo». **No sigue a la Luna en absoluto**: 28 días fijos no son una lunación,
y el desfase con el cielo crece sin parar.

Se incluye porque circula mucho y conviene tener claro qué es. Además tiene un
problema conocido y sin resolver en su propia comunidad: **qué hacer con el 29
de febrero**, que se trata de formas distintas según quién lo aplique. Cualquier
implementación exige elegir una política, escribirla y probarla.

---

## Familia 2 · Astronómicos calculables

La regla remite al cielo, pero el cielo se calcula. Astronomy-engine da todo
esto sin red.

### Calendario chino

Los meses empiezan en la **luna nueva verdadera** —el instante real de
conjunción, no un promedio— medida en el meridiano de 120° E. El mes añadido se
decide por los *zhongqi*, los términos solares mayores: el mes que no contiene
ninguno es el intercalar. Reformado en 1645 para usar cálculo astronómico real
en lugar de tablas medias.

*Lo que aporta:* el modelo más limpio de calendario lunisolar sin convención
arbitraria. El mes lo pone la Luna, el año lo pone el Sol, y la regla del mes
añadido sale de la relación entre los dos.

### Panchanga hindú: tithi y nakshatra

> **Fuente primaria, desde el 25 de agosto de 2026:** Burgess, E., trad.
> *Translation of the Sûrya-Siddhânta*, *Journal of the American Oriental Society*,
> vol. VI, pp. 141-498, New Haven, 1860. Dominio público, digitalizado
> (HathiTrust 011604382 · JSTOR 592174). Lo de abajo ya no se cita de memoria.

- **Tithi**: la trigésima parte de una lunación (Sūrya-Siddhānta I.12-13), definida como cada **12° de
  elongación** entre la Luna y el Sol. Como la velocidad real de ambos varía,
  los tithis **no duran todos lo mismo** — pueden diferir en varias horas entre sí.
  Un tithi puede saltarse o repetirse respecto al día civil. El texto lo nombra:
  *tithikshaya*, «pérdida de un día lunar» — cuando dos tithi acaban en el mismo
  día solar, el primero se omite y el día se nombra por el otro (I.36-38).
- **Nakshatra**: 27 divisiones de 13° 20′ de la longitud eclíptica de la Luna.
  *(Las mansiones son el objeto del cap. VIII del Sūrya-Siddhānta, que todavía no
  se ha cotejado: los 13° 20′ y los padas están en estado **DÉBIL**.)*

*Lo que aporta:* la idea de que la unidad no tiene por qué durar lo mismo
siempre, y de que **saltarse y repetirse es normal**, no un error. Es
exactamente el problema del día civil sin salida de luna de la decisión 0012,
resuelto por otra cultura hace siglos.

### Calendario tibetano

De tradición Kalachakra. Tiene fechas **omitidas y fechas duplicadas** como
parte normal de su funcionamiento. Otro precedente directo del mismo problema.

### Calendario solar hijri (jalalí)

Persa, y aquí viene lo interesante: **es puramente solar y puramente
astronómico**. El año empieza en el instante real del equinoccio de primavera
medido en un meridiano de referencia; no hay regla de bisiesto que aprenderse,
porque el equinoccio la sustituye.

*Lo que aporta:* es el precedente exacto de lo que la decisión 0012 eligió para
el año de Umbral — **el año como vuelta astronómica real, sin convención
humana**. Si alguien pregunta si eso se ha hecho antes: sí, y lleva siglos
funcionando.

### Términos solares chinos (*jieqi*)

24 divisiones del año por longitud solar, cada 15°. No son lunares, pero son la
capa externa mejor documentada que existe para ordenar el año por el Sol.

---

## Familia 3 · Observacionales

La fecha no existe hasta que alguien mira.

### Calendario hijri tal como se practica

El mes empieza con el **primer avistamiento del creciente**. Hay criterios
publicados para predecir la visibilidad —Yallop, Odeh— y existe el **límite de
Danjon**: por debajo de unos 7° de elongación el creciente no es visible por
mucha atmósfera limpia que haya. Pero un criterio da **probabilidad de
avistamiento**, no una fecha.

Y las decisiones reales varían por país y por autoridad, así que la misma noche
puede ser día 1 en un sitio y día 30 en otro.

*Lo que puede hacer Umbral:* decir que esa fecha la decide un observador, y como
mucho enseñar la probabilidad con su fuente. **Calcular una y llamarla fecha
sería inventar un dato.**

### El calendario hebreo antes de Hilel II

Antes de la fijación aritmética, el mes lo declaraba el Sanedrín a partir del
testimonio de testigos que habían visto la Luna. Es la misma tradición de la
familia 1, **antes** de mudarse de familia. Buen recordatorio de que estas
categorías son estados, no esencias.

---

## Familia 4 · Reconstruidos y discutidos

Existen, están documentados, y las fuentes no se ponen de acuerdo.

### Calendario de Coligny

Bronce galo del siglo II d. C., hallado en 1897 en Coligny (Ain), hoy en el
museo galorromano de Lyon-Fourvière. Es el documento en lengua gala más largo
que se conserva: un ciclo lunisolar de cinco años y 62 meses, con meses marcados
como *MAT* y *ANM(ATV)* —términos que se suelen leer como «completo» e
«incompleto», aunque la interpretación se discute—.

*Estado:* reconstruible, con desacuerdo académico vivo sobre varios puntos. Si
entra, entra diciendo **qué reconstrucción** se usa.

### Calendario ático

Atenas, lunisolar, con intercalación decidida sobre la marcha por las
autoridades — hasta el punto de que los propios atenienses distinguían entre la
fecha del calendario y la fecha «según la Luna». Es el ejemplo clásico de
calendario oficialmente desincronizado del cielo.

### Calendario babilónico

Lunisolar, con el ciclo de 19 años estandarizado hacia el siglo V a. C. Es el
origen documentado del ciclo que luego se llamó metónico, y por tanto el
antepasado común del hebreo y de buena parte de lo demás.

### Calendario islandés antiguo

**No es lunar**, y por eso entra. Se organiza en *misseri* —dos medias
estaciones— y su año son 52 semanas exactas, con una semana añadida
(*sumarauki*) para no desfasarse del Sol.

*Lo que aporta:* la prueba de que se puede construir un calendario perfectamente
sincronizado con un ciclo externo sin usar la Luna para nada. Ana pidió
expresamente que estos no quedaran fuera.

---

## No lunares, pero muy metidos en ciclos

### Tzolk'in y Haab' mayas

260 días (13 × 20) y 365 días, engranando en una **Rueda Calendárica de 52
años**. El Tzolk'in no sigue a la Luna ni al Sol: su periodo no corresponde a
ningún ciclo astronómico evidente, y las explicaciones propuestas —desde el
embarazo humano hasta el ciclo de Venus— siguen en discusión.

Aparte, las inscripciones del Cuenta Larga incluyen una **Serie Lunar**: la edad
de la Luna y la posición dentro de un ciclo de seis lunaciones. O sea que la
Luna sí estaba, pero en otra capa.

### Calendario egipcio y el ciclo sótico

Año civil de 365 días exactos, sin bisiesto, que se desliza un día cada cuatro
años y vuelve a cuadrar cada **1.460 años** con la salida helíaca de Sirio.
Además existía un calendario lunar propio para el servicio de los templos.

*Lo que aporta:* un calendario que se desliza **a propósito**, y una referencia
externa que no es ni el Sol ni la Luna sino una estrella.

---

## Qué se lleva Umbral de todo esto

1. **De los tithis y del calendario tibetano** —y desde el 25 de agosto con el
   texto delante, no de oídas—**:** que una unidad se salte o se
   repita respecto al día civil es normal y no hay que arreglarlo. Aplicado
   directamente al día sin salida de luna.
2. **Del jalalí:** que el año puede ser una vuelta astronómica real, sin regla
   de bisiesto. Es lo que hace la decisión 0012.
3. **Del chino:** que el mes lo ponga la Luna verdadera y el año el Sol, sin
   convención en medio.
4. **Del hijri en sus dos versiones:** que la misma tradición puede ser
   calculable u observacional, y que hay que decir cuál se está usando.
5. **Del islandés:** que no hace falta la Luna para estar sincronizado con algo.
6. **Del ático:** el aviso. Un calendario puede acabar oficialmente
   desincronizado del cielo que dice seguir, y nadie lo nota hasta que alguien
   compara.

---

## Bibliografía

**Aviso honesto, y ya menos general que antes.** Estas referencias eran las obras
estándar de cada tema citadas de memoria. **El 25 de agosto de 2026 se verificaron
las dos primeras**, que son las que sostienen cálculo, y están marcadas abajo. Las
demás siguen sin cotejar y siguen siendo una guía de dónde mirar, no una cita
comprobada. Antes de que este documento se publique dentro de la app, cada una hay
que verificarla contra su edición concreta y añadirle fecha de consulta, igual que
exige `docs/03-registro-de-datos.md` para los números.

Las fichas completas, con estado y aviso al citar, viven en
`docs/05-fuentes-tradiciones.md`. Aquí solo van los pies.

**General y de cálculo**

- Reingold, E. M. y Dershowitz, N. *Calendrical Calculations: The Ultimate
  Edition*. 4.ª ed., Cambridge University Press, 2018, 662 pp.,
  ISBN 978-1-107-05762-3. La referencia técnica: da los algoritmos de casi todos
  los calendarios de esta lista. **VERIFICADO FUERTE** (25 ago 2026).
  *Ediciones: 1.ª 1997 · 2.ª 2001 · 3.ª 2008 · 4.ª 2018. Se cita la 4.ª porque es
  la vigente y la única que trata el Umm al-Qura y amplía el islámico observacional.
  Aviso: los créditos dicen 2018 y la ficha del editor dice 2017, con LCCN 2017024295.
  Las dos son ciertas.*
- Richards, E. G. *Mapping Time: The Calendar and its History*. Oxford
  University Press, 1998. La referencia divulgativa.
- Meeus, J. *Astronomical Algorithms*. 2.ª ed., Willmann-Bell, Richmond
  (Virginia), 1998, ISBN 978-0-943396-61-3. Fases, posiciones y salidas.
  **VERIFICADO DÉBIL** (25 ago 2026) — la ficha está, el contenido del cap. 49
  sigue sin cotejarse (pendiente 27). *Aviso: circulan reimpresiones de diciembre
  de 1999 citadas como si fueran otra edición; no lo son.*
- Urban, S. E. y Seidelmann, P. K. (eds.). *Explanatory Supplement to the
  Astronomical Almanac*, 3.ª ed. University Science Books, 2013. Incluye un
  capítulo de calendarios.

**Visibilidad del creciente**

- Yallop, B. D. *A Method for Predicting the First Sighting of the New Crescent
  Moon*. NAO Technical Note n.º 69, HM Nautical Almanac Office, 1997.
- Odeh, M. Sh. «New Criterion for Lunar Crescent Visibility». *Experimental
  Astronomy*, 2004.
- Danjon, A. Trabajos de los años 30 sobre el límite de elongación.

**Mesopotamia y Grecia**

- Neugebauer, O. *A History of Ancient Mathematical Astronomy*. Springer, 1975.
- Hunger, H. y Pingree, D. *Astral Sciences in Mesopotamia*. Brill, 1999.
- Samuel, A. E. *Greek and Roman Chronology*. C. H. Beck, 1972.

**Galia**

- Duval, P.-M. y Pinault, G. *Recueil des inscriptions gauloises*, vol. III:
  *Les calendriers (Coligny, Villards d'Héria)*. CNRS, 1986.

**China**

- Aslaksen, H. *The Mathematics of the Chinese Calendar*. National University of
  Singapore. Es la explicación clara y accesible de la regla de intercalación.

**Mesoamérica**

- Aveni, A. F. *Skywatchers of Ancient Mexico*. University of Texas Press.

**Trece Lunas**

- Argüelles, J. *The Mayan Factor*, 1987, y los materiales de Dreamspell, 1990.
  *(Se cita como fuente primaria de lo que el sistema afirma, no como fuente
  sobre el calendario maya histórico, que es otra cosa.)*

**Marea**

- NOAA National Ocean Service Education, para el ratio Sol:Luna de 0,46.
  Ya fichado en `docs/03-registro-de-datos.md`.
