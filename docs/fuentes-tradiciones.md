# Fuentes de las tradiciones

Documento hermano de `registro-de-datos.md`. Aquel ficha constantes numéricas;
este ficha **de dónde sale cada convención** y **qué clase de cosa es**.

Reglas que hereda:

- **0.1 · No se inventan datos.** Ninguna convención entra sin fuente. Si la fuente
  está sin verificar, se marca `[SIN VERIFICAR]` y no puede aparecer en pantalla.
- **0.2 · No se implica causación.** Las tradiciones entran como `origen`, nunca
  como explicación (hoja de ruta §10).
- **Pendiente 15.** Ninguna edición se da por buena hasta cotejarla contra el
  ejemplar físico o el registro del editor. Autor y título de memoria no valen.

---

## La taxonomía: cuatro clases

La clase determina **qué hay que guardar** para que el dato sea honesto.

| Clase | La entrada es | ¿Recalculable? | Qué obliga a guardar |
|---|---|---|---|
| **① Medición física** | Una efeméride | Sí, siempre, desde el `timestamp` | Nada. Solo el instante |
| **② Cuenta desde un origen** | Un instante declarado + aritmética | Sí, si el origen está escrito | El origen y la constante de correlación |
| **③ Convención sobre la escritura** | Una cadena de texto | **No** si la cadena cambia | La cadena exacta y las seis convenciones |
| **④ Acto en el momento** | Una tirada, aquí y ahora | No, y no debe serlo | — **excluida**, ver abajo |

### Por qué la clase ④ queda fuera

I Ching, tarot, runas y toda consulta que exija un acto en el momento de
preguntar. No se excluyen por escepticismo, sino porque **su naturaleza es que se
consultan al preguntar** (katarché). Una app que las produzca sin que se pidan
destruye lo único que las hacía significar algo, y además vuelve al problema de
la sugerencia: diría qué esperar antes de vivirlo.

- Cornelius, Geoffrey. *The Moment of Astrology: Origins in Divination*.
  2.ª ed. revisada y ampliada, The Wessex Astrologer, Bournemouth, 2003,
  xxv + 386 pp., ISBN 1-902405-11-0. 1.ª ed. Arkana/Penguin, Londres, 1994,
  ISBN 0-14-019369-3. **VERIFICADO** el 24 de agosto de 2026 contra el
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
- **VERIFICADO** el 24 de agosto de 2026: las coordenadas J2000 usadas
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
  through observation of the sun's annual motion*. **VERIFICADO** el 24 de
  agosto de 2026.
  El «2013» era un error: la fecha que se confunde con esta es **2006**, año
  en que el elemento entró en la lista **nacional** china, que es otra cosa.

### Nakshatras (27 mansiones lunares)

- 27 divisiones **sidéreas** de 13° 20′ cada una, sobre la longitud de la Luna.
- Subdivisión en 4 padas de 3° 20′.
- Requiere ayanamsa, luego arrastra su convención. `[SIN VERIFICAR — falta fuente
  primaria para el orden y los nombres]`

### Tithi, yoga

- **Tithi:** 30 divisiones de 12° de la separación Luna − Sol. Como la velocidad
  real de los dos cuerpos varía, **no duran todos lo mismo: van de unas 19 h 59
  min a unas 26 h 47 min**, con media de unas 23 h 37 min. Casi siete horas de
  recorrido, y es justo lo que el proyecto se lleva de aquí — que una unidad se
  salte o se repita respecto al día civil es normal, no un fallo.
  *(Verificado el 24 de agosto de 2026 el rango; falta la fuente primaria.)*
- **Yoga:** 27 divisiones de la suma Sol + Luna.
- Nota: el tithi y las ocho fases de Rudhyar son **el mismo número con dos
  rejillas** (12° frente a 45°). No son dos datos.

### Fases soli-lunares de Rudhyar

- **Ocho tipos de 45°** sobre la separación Luna − Sol.
- Rudhyar, Dane. *The Lunation Cycle: A Key to the Understanding of Personality*.
  Aurora Press, 1986 (1.ª ed. como *The Moon: The Cycles and Fortunes of Life*,
  1967). `[SIN VERIFICAR]`
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
- Deborah Houlding, *The Houses: Temples of the Sky*. Wessex Astrologer.
  `[SIN VERIFICAR — falta año de edición]`

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
  este documento y como «dos días» en `formas-de-dividir.md`. Son dos:
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

### Fuentes

`[TODAS SIN VERIFICAR — esta sección es la más débil del documento]`

- Tabla pitagórica: atribución tradicional sin fuente primaria localizada.
- Tabla caldea: ídem.
- Hace falta al menos una obra de referencia con edición comprobable antes de que
  ningún número de esta clase aparezca en pantalla.

---

## Constantes usadas

| Constante | Valor | Clase | Estado |
|---|---|---|---|
| Espaciado de jieqi | 15° | ① | Verificado. Inscripción UNESCO: **2016** |
| Lichun | 315° | ① | Verificado |
| Divisiones de nakshatra | 27 × 13° 20′ | ① | `[SIN VERIFICAR]` |
| Divisiones de tithi | 30 × 12° | ① | `[SIN VERIFICAR]` |
| Fases de Rudhyar | 8 × 45° | ① | `[SIN VERIFICAR]` |
| Spica J2000 | AR 13h 25m 11,579s · Dec −11° 09′ 40,75″ | ① | **Verificado** (24 ago 2026) |
| Correlación tzolk'in | GMT 584283 | ② | `[SIN VERIFICAR]` — variante 584285, **dos días** |
| Periodos de biorritmo | 23 / 28 / 33 días | ② | 23 y 28 verificados; **el 33 sin fuente** |

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

**Siguen abiertos**

1. Verificar edición por edición lo que queda marcado `[SIN VERIFICAR]`
   (pendiente 15). Lo que falta necesita el ejemplar o un catálogo de
   biblioteca, no una búsqueda más:
   - Rudhyar: editorial, ISBN y 1967 confirmados; **el título alternativo
     *The Moon: The Cycles and Fortunes of Life* no lo sostiene ninguna fuente
     localizada** y es candidato a dato heredado de memoria.
   - Houlding: **2006**, The Wessex Astrologer, ISBN 190240520X — pero consta
     como **2.ª ed.**, y la primera sigue sin identificar. Si se cita el año,
     se cita también la edición.
   - Nakshatra y tithi: fuente primaria. La vía es el *Sūrya-Siddhānta* en la
     traducción de Ebenezer Burgess, *Journal of the American Oriental Society*
     vol. 6 (1860), que está en dominio público y digitalizada.
   - Reingold-Dershowitz y Meeus: edición e impresión, desde la página del editor.
2. **Fuente primaria de las tablas numerológicas — y el estado es peor de lo que
   parecía.** Lo único estable es que Julia Seton Sears acuñó la palabra hacia
   1912. Para el primer libro de Balliett circulan **tres años que se
   contradicen: 1903, 1908 y 1911**, y las únicas fuentes que los dan son sitios
   comerciales de numerología, que es exactamente la clase de fuente que la
   regla 0.1 no acepta. Los títulos que aparecen citados —*The Philosophy of
   Numbers* (1908), *Number Vibration in Questions and Answers* (1911), *The Day
   of Wisdom According to Number Vibration* (1917)— **no se han podido confirmar
   contra ningún catálogo de biblioteca**.
   Detalle nuevo, y no menor: Juno Jordan era el seudónimo de Juno Belle Kapp,
   **hija de Julia Seton**, que empezó a estudiar con Balliett en 1898 a los
   catorce años. Las «tres mujeres» del linaje son madre, hija y maestra.
   **Mientras esto siga así, la clase ③ no aparece en pantalla**, y por eso
   `hoja-de-cielo.mjs` pasó a pedirla explícitamente en vez de emitirla por
   omisión.

---

*Última revisión: 24 de agosto de 2026 — ronda de verificación de fuentes.*
