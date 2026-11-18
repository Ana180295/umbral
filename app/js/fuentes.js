/* =================================================================
   Umbral — de dónde sale cada cosa que la app enseña.

   POR QUÉ EXISTE ESTE FICHERO. La §10 de la hoja de ruta dice que toda
   tradición aparece «claramente atribuida a autor y edición». Hasta
   hoy esa atribución vivía en docs/05-fuentes-tradiciones.md, y docs/
   no se empaqueta: no está en PRECACHE ni se sirve desde app/. Una
   atribución que la persona no puede abrir no está donde tiene que
   estar (decisión 0016).

   QUÉ ES ESTO. Los niveles 1, 3, 4 y 5 de la decisión 0018, dentro de
   la pantalla `dia` de la 0015. No es una pantalla nueva: es la
   profundidad de una que ya estaba diseñada.

   El nivel 2 —dónde cae hoy— NO está aquí y no puede estarlo: se
   recalcula del timestamp, como todo lo de clase ①. Un valor de clase
   ① congelado en un fichero sería un motor viejo escondido.

   ESTE FICHERO ES EL ORIGINAL. docs/05-fuentes-tradiciones.md se
   deriva de él, y no al revés. Un ISBN es un dato estructurado, no
   prosa: escribirlo como objeto y generar el markdown no cuesta nada;
   escribirlo en markdown y parsearlo es frágil y necesita un parser.

   CINCO REGLAS QUE GOBIERNAN EL FICHERO

   1. SIN nivel5, NO SE MUESTRA. Es la condición de entrada de la 0015.
      La prueba dorada 1 la ejecuta: un dato con nivel1 y sin nivel5
      rompe el `node --test` y no llega a producción.

   2. LA FICHA VIVE DENTRO DEL DATO, no en una lista aparte. Así no hay
      forma de que un dato exista sin su fuente al lado.

   3. `aviso` VIAJA PERO NO SE PINTA. Es para quien mantiene la
      bibliografía. Vive aquí, y no en el .md, porque escribirlo aparte
      crearía dos sitios donde editar la misma ficha (decisión 0016 §3).

   4. EL NIVEL 4 NACIÓ VACÍO EL 25 DE AGOSTO, Y ERA CORRECTO. Los
      ritos lunares son el terreno con más fuentes falsas de todo lo
      que este proyecto ha tocado. Escribir entonces «se ofrendaba en
      la Noumenia» porque suena razonable habría sido la regla 0.1
      rota justo donde es más fácil romperla.

      Se llenó el 26 de agosto (pendiente 35), dato a dato, solo donde
      hubo etnografía con autor y edición verificables. `casas` sigue
      vacío A PROPÓSITO: comparte el mismo episodio histórico que
      `zodiaco_tropical` (misma fuente, mismos astrólogos), y
      escribirlo dos veces sería duplicar una fuente, no documentar
      dos prácticas distintas — su etnografía vive en el nivel4 de
      `zodiaco_tropical`.

      El bloque del nivel4 se guarda aparte, en `bloque_nivel4`, y no
      en `bloque`: la 0018 dice que TODO nivel4 vive en B, sin
      excepción, pero cuatro de estos datos (`zodiaco_tropical`,
      `zodiaco_sidereo`, `nakshatra`, `numerologia`) tienen su nivel1-3
      legítimamente en A. Forzar el `bloque` general a "B" habría
      escondido también esos niveles hasta el cierre del día, que es
      una decisión distinta a la que tomó la 0018 y nadie ha abierto.

   5. LOS BIORRITMOS NO ESTÁN AQUÍ Y NO PUEDEN ESTAR. Son el control
      negativo del proyecto: sirven porque cruzarlos con los registros
      no puede dar nada. El día que la app enseñe «hoy tu curva
      emocional está baja», el control deja de poder decir que no. La
      prueba dorada 7 comprueba su ausencia.
   ================================================================= */

/* --- vocabulario del fichero ---------------------------------------

   ESTADOS. Los tres de docs/05-fuentes-tradiciones.md, fijados el 25
   de agosto de 2026.

     fuerte  · dos fuentes independientes, una de ellas catálogo
               nacional, el editor, o el ejemplar digitalizado con
               página de créditos legible. Se muestra sin marca.
     debil   · una sola entrada de catálogo institucional, sin
               contradicción localizada. Se muestra CON la marca.
     sin_verificar · todo lo demás. NO se muestra.

   CLASES. La taxonomía de cuatro de 05-fuentes-tradiciones.md, más la
   quinta que abre la decisión 0018.

     1 · medición física          — recalculada, nunca almacenada
     2 · cuenta desde un origen   — se guarda el origen y la constante
     3 · convención de escritura  — se guardan las seis subconvenciones
     4 · acto en el momento       — EXCLUIDA del proyecto
     5 · práctica humana documentada — quién, dónde, cuándo, quién lo
                                       documentó. Los cuatro o no entra.

   BLOQUES. De la decisión 0015.

     A · disponible siempre. Solo lo natal, que influye igual todos los
         días y por eso no puede fabricar correlaciones falsas.
     B · solo al cerrar el día. Lo que cambia hoy, y todo nivel 4.

   `bloque` describe nivel1, nivel3 y nivel5 del dato. `bloque_nivel4`
   describe solo el nivel4, cuando existe, y SIEMPRE vale "B" — la
   0018 dice «todo nivel4», no «el nivel4 de los datos que ya estaban
   en B». Son dos campos porque son dos preguntas distintas: un dato
   puede tener su explicación disponible siempre y su etnografía
   reservada al cierre del día, a la vez. La prueba dorada que antes
   miraba `bloque` para el nivel4 ahora mira `bloque_nivel4` en su
   lugar (decisión que sustituye ese punto de la 0018, sin tocar
   ningún otro).
   ------------------------------------------------------------------- */

export const ESTADOS = ["fuerte", "debil", "sin_verificar"];
export const ESTADOS_VISIBLES = ["fuerte", "debil"];
export const BLOQUES = ["A", "B"];

/* Campos que una ficha bibliográfica no puede no tener. Se declaran
   aquí para que el módulo pueda recorrerlos; la prueba dorada 2 los
   escribe A MANO y por separado, igual que hace CAMPOS en registro.js:
   un solo sitio que editar es un solo sitio donde equivocarse sin
   testigos. */
export const CAMPOS_FICHA = ["autor", "titulo", "publicacion", "verificado_en"];

/* Los cuatro de la clase ⑤. Sin uno de ellos, «los antiguos» no es un
   pueblo y el dato no existe. */
export const CAMPOS_ETNOGRAFIA = ["quien", "donde", "cuando", "documentado_por"];

/* Nunca, bajo ninguna circunstancia, en este fichero. La prueba dorada
   7 comprueba que ninguna clave los contenga. */
export const JAMAS_EN_PANTALLA = ["biorritmo", "biorritmos", "deriva_lunacion"];

/* =================================================================
   LOS DATOS

   Cada clave casa con la que usa herramientas/hoja-de-cielo.mjs, para
   que la ficha y el dato hablen del mismo objeto (prueba dorada 8).

   nivel1 · qué es
   nivel3 · cómo se cuenta y de dónde sale
   nivel4 · qué se hacía con esto   → relleno en 9 de 10, ver regla 4.
                                       `casas` vacío a propósito (fusionado
                                       con `zodiaco_tropical`)
   nivel5 · quién discute qué       → OBLIGATORIO
   ================================================================= */

/* Burgess sirve a dos datos, tithi y nakshatra. La cita se escribe una sola
   vez aquí y las dos fichas la usan: cada dato, una vez (0016 §3, 0033).
   Hasta el 16 de noviembre de 2026 estaba copiada en las dos fichas, y las
   dos copias ya no decían lo mismo. */
const BURGESS = {
  autor: "Burgess, Ebenezer (1805-1870) (trad.); notas en su mayor parte de W. D. Whitney",
  titulo:
    "Translation of the Sûrya-Siddhânta, a Text-Book of Hindu Astronomy; " +
    "with Notes, and an Appendix, containing additional notes and tables, " +
    "calculations of eclipses, a stellar map, and indexes",
  publicacion:
    "Asistido por el Comité de Publicación de la American Oriental Society. " +
    "Journal of the American Oriental Society, vol. VI, pp. 141-498. " +
    "Separata: New Haven, para la American Oriental Society, impr. E. Hayes, " +
    "1860. 1 h. + iv + 354 pp., 1 h., con carta plegable y diagramas, 24 cm. " +
    "Dominio público"
};
const VERIFICADO_BURGESS =
  "25 de agosto de 2026 · HathiTrust 011604382 (ejemplar de Harvard, " +
  "hvd.32044019816925, vista completa) · OCLC 9857844 · JSTOR 592174 · " +
  "DOI 10.2307/592174 · y contra el propio texto digitalizado";
const AVISO_BURGESS =
  "JSTOR fecha el volumen como 1858-1860 porque el tomo se compuso a lo " +
  "largo de tres años; la portada dice 1860 y la portadilla añade que se " +
  "comunicó a la Sociedad el 17 de mayo de 1858. Las tres son correctas y " +
  "describen cosas distintas. Se cita 1860. Y: el comentario es más extenso " +
  "que la traducción y es de Whitney, no de Burgess; al citar una nota, " +
  "Burgess-Whitney.";

export const FUENTES = {

  /* --- clase ① · medición física ---------------------------------- */

  zodiaco_tropical: {
    nombre: "Zodiaco tropical",
    clase: 1,
    bloque: "A",
    estado: "fuerte",
    nivel1: "Doce tramos de 30°, contados desde el equinoccio de primavera.",
    nivel3:
      "El 0° de Aries es el equinoccio vernal, por definición. No se desfasa " +
      "de las estaciones nunca, y por eso se desplaza respecto a las estrellas " +
      "unos 50,3 segundos de arco al año.",
    nivel4:
      "Astrólogos del Egipto grecorromano calculaban natividades individuales " +
      "para clientes particulares aplicando los doce signos tropicales " +
      "heredados de la astronomía helenística, junto con los doce lugares del " +
      "horóscopo repartidos por el sistema de signos enteros, el más antiguo " +
      "de los sistemas de casas documentados. La práctica quedó registrada en " +
      "papiros, óstraca e inscripciones con cartas natales fechadas, halladas " +
      "sobre todo en el valle del Nilo.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "Astrólogos profesionales del Egipto bajo dominio romano, que " +
        "calculaban natividades para clientes particulares.",
      donde:
        "Valle del Nilo, con concentración de hallazgos en Oxirrinco y otros " +
        "yacimientos egipcios; práctica extendida por el mundo grecorromano.",
      cuando:
        "Desde aproximadamente el siglo I a. C. hasta el siglo VII d. C., " +
        "según la datación de los documentos conservados.",
      documentado_por:
        "Neugebauer, Otto y Van Hoesen, H. B., Greek Horoscopes, Memoirs of " +
        "the American Philosophical Society, vol. 48, Filadelfia, 1959."
    },
    nivel5:
      "Es el ajuste por defecto de la astrología occidental y casi nunca se " +
      "etiqueta: se dice «Sol en Leo» sin decir en qué zodiaco. Aquí se " +
      "etiqueta siempre, porque el sidéreo da otro signo para la misma persona.",
    ficha: {
      autor: null,
      titulo: "Convención astronómica, sin autor único",
      publicacion: "El origen es el equinoccio vernal; no procede de ninguna obra",
      verificado_en: "Definición geométrica, no bibliográfica"
    },
    aviso:
      "No confundir el zodiaco tropical con las constelaciones del mismo " +
      "nombre: llevan dos milenios sin coincidir. Sobre el nivel4: la fuente " +
      "(Neugebauer y Van Hoesen, 1959) está identificada y corroborada por " +
      "trabajo académico posterior —Evans (2004), Jones (1999)—, pero no ha " +
      "sido leída en el original; se cuenta también, fusionado aquí, lo que " +
      "corresponde al dato `casas`, cuyo nivel4 queda vacío a propósito para " +
      "no repetir el mismo episodio histórico dos veces."
  },

  zodiaco_sidereo: {
    nombre: "Zodiaco sidéreo (ayanamsa True Chitra: Spica en 180°)",
    clase: 1,
    bloque: "A",
    estado: "fuerte",
    nivel1: "Los mismos doce tramos de 30°, contados desde las estrellas.",
    nivel3:
      "Se fija Spica en los 180° sidéreos y se mide desde ahí. La app no copia " +
      "ninguna tabla de ayanamsas: define Spica con sus coordenadas J2000 y le " +
      "pide al motor la longitud eclíptica de la fecha.",
    nivel4:
      "Astrólogos y sacerdotes brahmanes calculaban momentos propicios " +
      "(muhurta) para ritos védicos y ceremonias del ciclo vital, y " +
      "natividades (jataka) para particulares, sobre posiciones planetarias " +
      "referidas a las estrellas fijas. La técnica entró en la India mediante " +
      "la traducción de un texto astrológico griego, fechada en 149/150 d. C., " +
      "que Sphujidhvaja versificó como el Yavanajataka en 269/270 d. C.",
    bloque_nivel4: "B",
    etnografia: {
      quien: "Astrólogos y sacerdotes brahmanes (jyotishis).",
      donde: "El subcontinente indio.",
      cuando:
        "Desde la versificación del Yavanajataka en 269/270 d. C. " +
        "(traducción previa de 149/150 d. C.), con continuidad hasta la " +
        "actualidad.",
      documentado_por:
        "Pingree, David, Jyotihśāstra: Astral and Mathematical Literature, " +
        "Otto Harrassowitz, Wiesbaden, 1981 (A History of Indian Literature, " +
        "vol. VI, fasc. 4)."
    },
    nivel5:
      "Comparte origen con el tropical y a la vez difiere de él en unos 23° 47′, " +
      "que es más de tres cuartos de signo. El cálculo no aplica movimiento " +
      "propio: el de Spica son 0,052″ al año, que entre 1995 y 2026 acumula " +
      "1,6″ contra un ayanamsa de unos 85.600″. Una parte entre 53.000.",
    ficha: {
      autor: null,
      titulo: "Coordenadas J2000 de α Virginis (Spica)",
      publicacion: "AR 13h 25m 11,579s · Dec −11° 09′ 40,75″",
      verificado_en: "24 de agosto de 2026, contra las coordenadas publicadas"
    },
    aviso:
      "Circulan varias decenas de ayanamsas distintos y difieren entre sí en " +
      "grados. Decir «sidéreo» sin decir cuál no identifica ningún cálculo. " +
      "Hasta el 13 de noviembre de 2026 esta ficha lo llamaba «Lahiri / " +
      "Chitrapaksha», y no lo es: el Lahiri oficial se define por un valor " +
      "en una fecha (23°15′00″ el 21 de marzo de 1956, comité de reforma del " +
      "calendario indio) y deja Spica a un minuto de arco de los 180°; " +
      "Spica fijada en 180° es la variante True Chitra. El Lahiri oficial no " +
      "se ofrece como segunda opción (Ana, 16 de noviembre de 2026). La " +
      "diferencia entre los dos es de 36″ a 61″: un panchang que use el " +
      "Lahiri oficial puede dar la hora de cambio de nakshatra entre 1,0 y " +
      "1,6 minutos distinta, y la del Sol al cambiar de signo sidéreo, entre " +
      "14 y 24 minutos. Los tithi no cambian: no dependen del ayanamsa. " +
      "Sobre el nivel4: la fecha de la traducción griega (149/150) viene de " +
      "Pingree citado en fuente terciaria (Britannica); Pingree no se ha " +
      "leído en el original."
  },

  jieqi: {
    nombre: "Términos solares chinos (jieqi)",
    clase: 1,
    bloque: "B",
    estado: "fuerte",
    nivel1: "Veinticuatro tramos de 15°, contados desde el equinoccio.",
    nivel3:
      "El múltiplo de 15° que el Sol acaba de pasar. Son tropicales: mismo cero " +
      "que el zodiaco occidental, distinta partición. Lichun, en los 315°, abre " +
      "el año en la astrología BaZi.",
    nivel4:
      "En Jiuhua (Quzhou, Zhejiang), la comunidad local conmemoraba cada año, " +
      "en la fecha del término solar Lichun, un ritual de bienvenida a la " +
      "primavera en el Salón Ancestral de Wutong: se rendía culto a Gou Mang, " +
      "dios de la primavera, se fabricaba y golpeaba un buey de papel o " +
      "barro, se quemaba incienso y se ofrecían representaciones para " +
      "agradecer a los dioses una buena cosecha.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "La comunidad de Jiuhua (Quzhou, Zhejiang), encabezada por el " +
        "oficiante heredero del ritual.",
      donde:
        "El Salón Ancestral de Wutong, en la localidad de Jiuhua, distrito " +
        "de Quzhou, provincia de Zhejiang, China.",
      cuando:
        "Cada año, en la fecha del término solar Lichun; tradición inscrita " +
        "en el listado nacional chino de patrimonio inmaterial e incluida en " +
        "el expediente que la UNESCO reconoció en 2016.",
      documentado_por:
        "UNESCO, Comité Intergubernamental para la Salvaguardia del " +
        "Patrimonio Cultural Inmaterial, Decisión 11.COM 10.B.6, 11.ª " +
        "sesión, Adís Abeba, 2016."
    },
    nivel5:
      "Los nombres describen el clima del hemisferio norte: en Sídney engañan. " +
      "Y hay dos años nuevos distintos —Lichun y el Año Nuevo lunar— que pueden " +
      "diferir semanas, así que hay que declarar cuál se usa.",
    ficha: {
      autor: "UNESCO, Comité Intergubernamental",
      titulo:
        "The Twenty-Four Solar Terms, knowledge in China of time and practices " +
        "developed through observation of the sun's annual motion",
      publicacion:
        "Lista Representativa del Patrimonio Cultural Inmaterial, 11.ª sesión, " +
        "Adís Abeba, 30 de noviembre de 2016",
      verificado_en: "24 de agosto de 2026"
    },
    aviso:
      "Circula 2013 como año de inscripción y es falso. La fecha que se " +
      "confunde con esta es 2006, año en que el elemento entró en la lista " +
      "nacional china, que es otra cosa. Sobre el nivel4: es la etnografía " +
      "mejor sostenida de las diez — la propia decisión de la UNESCO se leyó " +
      "en su texto primario, y hay más de una fuente independiente " +
      "coincidiendo en el lugar, el oficiante y las acciones descritas."
  },

  tithi: {
    nombre: "Tithi",
    clase: 1,
    bloque: "B",
    estado: "fuerte",
    nivel1: "La trigésima parte de una lunación.",
    nivel3:
      "Treinta divisiones del mes lunar, que es lo mismo que cada 12° de " +
      "separación entre la Luna y el Sol. Como los dos cuerpos no se mueven a " +
      "velocidad constante, un tithi dura entre unas 19 h 59 min y unas " +
      "26 h 47 min, con media de unas 23 h 37 min.",
    nivel4:
      "Madres hindúes de la región de Benarés ayunaban en el tithi Ashtami " +
      "del mes de Ashvin por el bienestar de sus hijos, en el vrat conocido " +
      "como Jivitputrika o Jiutiya. La práctica estaba restringida a mujeres " +
      "con hijos varones dentro de la comunidad hindú.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "Madres hindúes de la región de Benarés y del norte de India " +
        "oriental.",
      donde: "Bihar, Jharkhand, Uttar Pradesh oriental (incluida Benarés) y Nepal.",
      cuando: "Ashtami, el octavo tithi de la quincena oscura del mes de Ashvin.",
      documentado_por:
        "Pearson, Anne Mackenzie, \"Because It Gives Me Peace of Mind\": " +
        "Ritual Fasts in the Religious Lives of Hindu Women, State " +
        "University of New York Press, Albany, 1996, p. 163 (cita " +
        "verificada vía Mahavidya, McGill University, World Religions " +
        "Project; no leída en el original)."
    },
    nivel5:
      "Los tithi empiezan y acaban a cualquier hora del día natural, y uno puede " +
      "omitirse: cuando dos terminan en el mismo día solar, el primero se pierde " +
      "y el día se nombra por el otro. El texto lo llama tithikshaya y lleva la " +
      "cuenta hecha. El propio comentario de Burgess-Whitney califica la " +
      "división de arbitraria, y a la vez dice que es de la mayor importancia " +
      "práctica porque por ella se regulan las ceremonias. Las dos cosas a la vez.",
    ficha: {
      ...BURGESS,
      verificado_en: VERIFICADO_BURGESS,
      capitulo: "cap. I, vv. 12-13 (definición) y vv. 36-38 (tithikshaya)"
    },
    aviso:
      AVISO_BURGESS + " Sobre el nivel4: la cita de Pearson (p. 163) es de " +
      "segunda mano, vía un recurso académico de McGill; el libro en sí no se " +
      "ha leído."
  },

  nakshatra: {
    nombre: "Nakshatra (mansiones lunares)",
    clase: 1,
    bloque: "A",
    estado: "fuerte",
    nivel1: "Veintisiete divisiones del recorrido de la Luna por el cielo.",
    nivel3:
      "La longitud eclíptica de la Luna, en zodiaco sidéreo, partida en 27 " +
      "tramos de 13° 20′, cada uno subdividido en cuatro padas de 3° 20′. El " +
      "origen de la esfera es el fin de Revatī y el principio de Aśvinī, " +
      "identificado con ζ Piscium.",
    nivel4:
      "En Madurai, y más tarde en Kerala, las comunidades vinculadas a los " +
      "templos conmemoraban durante varios días, en la fecha marcada por el " +
      "nakshatra Thiruvonam, una fiesta con banquete, vestidos nuevos, cantos " +
      "y danzas; inscripciones en plancha de cobre registran donaciones " +
      "concretas hechas a los templos con motivo de la festividad.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "Comunidades templarias de Madurai y, más tarde, de Kerala, con " +
        "donantes identificados por nombre en inscripciones.",
      donde:
        "Madurai (sur de India) en las referencias más antiguas; Kerala en " +
        "su forma consolidada posterior.",
      cuando:
        "Desde el poema sangam Maduraikanchi (hacia el siglo III d. C.), " +
        "pasando por inscripciones en placa de cobre del rey chera " +
        "Kulasekhara Perumal (861 d. C.), hasta la práctica viva actual.",
      documentado_por:
        "Kurup, A. M., \"The Sociology of Onam\", Indian Anthropologist, " +
        "vol. 7, n.º 2, 1977, pp. 95-110, JSTOR 41919319; y Cush, Denise, " +
        "Catherine Robinson y Michael York (eds.), Encyclopedia of " +
        "Hinduism, Routledge, Londres, 2012, pp. 573-574."
    },
    nivel5:
      "Cotejado contra el texto original. La división en 27 porciones iguales de " +
      "ochocientos minutos, que son 13° 20′, está en el capítulo II; los cuartos " +
      "de cada porción, los padas, en el VIII; el punto de partida, en una nota " +
      "al capítulo I. Los veintisiete nombres son los del texto, en transliteración " +
      "actual y en su orden; " +
      "el texto trae además un vigésimo octavo, Abhijit, que no tiene porción.",
    ficha: {
      ...BURGESS,
      verificado_en:
        VERIFICADO_BURGESS + ". Contenido cotejado el 16 de noviembre de 2026 " +
        "contra el texto de JSTOR (Early Journal Content)",
      capitulo:
        "cap. II, v. 64 y nota, p. 235 (27 porciones de 800′) · cap. VIII, v. 5, " +
        "p. 320 (los cuartos, pada) · cap. VIII, vv. 2-9 y tabla, pp. 320-321 " +
        "(nombres y orden) · cap. I, nota a v. 27, p. 158 (el origen)"
    },
    aviso:
      AVISO_BURGESS + " Se citan a veces 28 mansiones en vez de 27, contando Abhijit. No son " +
      "sistemas equivalentes y hay que declarar cuál se usa. Sobre el " +
      "nivel4: dos fuentes académicas independientes coinciden en los mismos " +
      "hechos concretos, una de ellas revisada por pares (JSTOR); este es el " +
      "nivel4 más sólido de los diez junto con el de jieqi. El asterismo " +
      "23 se escribió Dhanishta hasta el 16 de noviembre de 2026: es otro " +
      "nombre del mismo asterismo, pero no el de esta fuente, que dice " +
      "Śraviṣṭhā; desde entonces se escribe Shravishtha. Sobre la referencia: el cap. VIII NO divide la eclíptica; " +
      "da las posiciones de las estrellas de unión, que no están equiespaciadas. " +
      "Los 13° 20′ están en el cap. II, v. 64 (cotejado el 16 de noviembre de " +
      "2026). Los 3° 20′ del pada son la cuenta 800′ / 4: el texto nombra los " +
      "cuartos (viii. 5) pero no escribe su medida. Burgess-Whitney, nota a " +
      "viii. 9 (p. 353): la serie original es de 28, y la división en 27 " +
      "iguales encaja mejor con las estrellas; Abhijit (n.º 22 de la tabla, p. " +
      "321) no tiene porción. Páginas del volumen VI del JAOS. El OCR lee 819, " +
      "820 y 821, imposibles en un volumen que va de la 141 a la 498, y entre " +
      "la 235 del cap. II y la 351 de la nota a viii. 9: son 319, 320 y 321. " +
      "Conviene confirmarlas en el escaneo."
  },

  fases_rudhyar: {
    nombre: "Fases soli-lunares",
    clase: 1,
    bloque: "B",
    estado: "fuerte",
    nivel1: "Ocho tramos de 45° en la separación entre la Luna y el Sol.",
    nivel3:
      "La misma separación Luna − Sol que produce los tithi, con otra rejilla: " +
      "45° en vez de 12°. Contiene además el cumpleaños de lunación, que es el " +
      "retorno mensual al ángulo Luna-Sol que había al nacer.",
    nivel4:
      "Astrólogos reunidos en torno al International Committee for " +
      "Humanistic Astrology, fundado por Dane Rudhyar en 1969, aplicaban las " +
      "ocho fases lunares como herramienta de asesoramiento psicológico de " +
      "clientes, en vez de como predicción de destino.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "Astrólogos reunidos en torno al International Committee for " +
        "Humanistic Astrology, fundado por Dane Rudhyar.",
      donde: "Estados Unidos, con difusión posterior en Europa.",
      cuando: "Desde 1969, año de fundación del comité.",
      documentado_por:
        "Campion, Nicholas, A History of Western Astrology, Vol. 2: The " +
        "Medieval and Modern Worlds, Continuum, Londres, 2009, ISBN " +
        "978-1-4411-2737-2. La fecha de fundación (1969) procede de Melton, " +
        "J. Gordon (ed.), Encyclopedia of Occultism & Parapsychology, " +
        "entrada «Rudhyar, Dane»."
    },
    nivel5:
      "Los ocho nombres describen ánimos —balsámica, diseminadora— y esa es " +
      "exactamente la línea que parte la pantalla en dos: iluminación 97,3 % es " +
      "una medida, «fase balsámica» es la misma medida con una palabra que " +
      "describe un estado. El tithi 19 y la fase llena son el mismo ángulo con " +
      "dos rejillas, y solo una de las dos sugiere cómo estás.",
    ficha: {
      autor: "Rudhyar, Dane",
      titulo: "The Lunation Cycle: A Key to the Understanding of Personality",
      publicacion:
        "Servire, Wassenaar / La Haya, 1967, distribuido por Llewellyn " +
        "Publications, St. Paul (Minnesota). Rústica, 156 pp., ilustrado, 23 cm, " +
        "con bibliografía del autor en pp. [157]-[158]. Es la reelaboración, " +
        "bajo título nuevo, de The Moon: The Cycles and Fortunes of Life, David " +
        "McKay Company, Washington Square, Filadelfia, 1946, cartoné con " +
        "sobrecubierta, [5] + 111 pp. + 2 pp. de publicidad. Edición en " +
        "circulación: Aurora Press, Santa Fe (Nuevo México), 1986, ISBN " +
        "0-943358-26-4 / 978-0-943358-26-0, 196 pp., que incluye además The " +
        "Lunation Process in Astrological Guidance, de Leyla Rael Rudhyar " +
        "(Aurora, Nueva York, c1984)",
      verificado_en:
        "25 de agosto de 2026 · verso de portada de la ed. Aurora, en el " +
        "registro del ejemplar digitalizado (Internet Archive lunationcycle00dane, " +
        "Open Library OL8445199M / obra OL8046023W, OCLC 19531810) · WorldCat " +
        "1036668863 · descripción física del ejemplar de 1946 según la " +
        "biblioteca especializada Astrolearn, con dos ejemplares en mano · la " +
        "1.ª ed. de 1967, con colación completa en registros de librería " +
        "anticuaria coincidentes entre sí"
    },
    aviso:
      "Son dos libros con quince años y un océano entre ellos, y se funden a " +
      "menudo en uno. Aurora Press reimprime con la fecha 1967 en algunas " +
      "tiradas posteriores, y circula «1 de junio de 1967, Aurora Press, 196 " +
      "páginas», que mezcla el año de Servire con la editorial y la paginación " +
      "de Aurora. No usar esa combinación. Sobre el nivel4: es de otra " +
      "naturaleza que el resto — práctica profesional del siglo XX, no rito " +
      "folclórico —, y el dato concreto de 1969 viene de una fuente distinta " +
      "(Melton) de la que documenta el conjunto (Campion); ninguna de las dos " +
      "se ha leído en el original."
  },

  casas: {
    nombre: "Casas",
    clase: 1,
    bloque: "A",
    estado: "debil",
    nivel1: "Doce sectores del cielo respecto al horizonte de un lugar y un instante.",
    nivel3:
      "No hay un modo de trazarlos, hay seis: signos enteros, iguales, Porfirio, " +
      "Placidus, Regiomontano y Campano. Medido sobre la carta de referencia a " +
      "39° N, ocho de diez planetas cambian de casa según cuál se elija. Solo " +
      "coinciden los que caen a mitad de sector.",
    nivel4: null,
    nivel5:
      "Esto no es un dato, es una convención, y por eso ningún campo puede decir " +
      "«casa 12» sin decir al lado qué sistema lo produjo: sin el sistema, el " +
      "campo miente por omisión. Placidus además no existe por encima del " +
      "círculo polar, porque el arco semidiurno se vuelve imaginario.",
    ficha: {
      autor: "Houlding, Deborah",
      titulo: "The Houses: Temples of the Sky",
      publicacion:
        "2.ª ed. revisada y muy ampliada, The Wessex Astrologer Ltd, " +
        "Bournemouth, 2006, ISBN 1-902405-20-X / 978-1-902405-20-9, 196 pp.: " +
        "la que está en circulación y la que se cita. 1.ª ed.: Ascella " +
        "Publications, 1998, ISBN 1-898503-69-9 / 978-1-898503-69-9",
      verificado_en:
        "25 de agosto de 2026 · registro del editor y catálogo para la 2.ª ed.; " +
        "la 1.ª consta con ISBN y pie Ascella en registro agregado, y el libro " +
        "declara ejemplar depositado en la British Library, pero no se ha " +
        "cotejado contra su catálogo"
    },
    aviso:
      "Ascella Publications era la editorial de la propia Houlding: la 1.ª ed. " +
      "era en la práctica autoedición, de ahí que apenas se catalogara. Y " +
      "circulan transcripciones de la página de créditos de la 2.ª ed. con el " +
      "apellido escrito «Boulding»; no se ha podido determinar si es errata del " +
      "libro o del reconocimiento óptico, así que no se afirma ninguna de las dos. " +
      "Sobre el nivel4 (26 de agosto de 2026): se deja vacío a propósito. La " +
      "práctica documentada de los astrólogos grecorromanos calculando " +
      "horóscopos ya incluye el reparto en doce lugares por signos enteros — " +
      "es el mismo episodio histórico que `zodiaco_tropical`, no uno " +
      "independiente, y su etnografía completa vive en el nivel4 de ese dato."
  },

  /* --- clase ② · cuenta desde un origen declarado ------------------ */

  tzolkin: {
    nombre: "Tzolk'in",
    clase: 2,
    bloque: "B",
    estado: "sin_verificar",
    nivel1: "Doscientos sesenta días: trece números girando contra veinte nombres.",
    nivel3:
      "No mide ningún ángulo y no tiene ancla astronómica ninguna. Se cuenta " +
      "desde un origen declarado, y para convertirlo a fecha civil hace falta una " +
      "constante de correlación. Se usa la GMT 584283.",
    nivel4:
      "Los ajq'ij (guardianes de los días) de Momostenango contaban el ciclo " +
      "de 260 días del tzolk'in para practicar la adivinación, interpretar " +
      "sueños y determinar las obligaciones rituales asociadas a cada " +
      "combinación de número y nombre del día; la formación como guardián de " +
      "los días duraba un ciclo completo del calendario.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "Los ajq'ij (guardianes de los días) del pueblo k'iche', comunidad " +
        "maya de las tierras altas de Guatemala.",
      donde: "Momostenango, departamento de Totonicapán, Guatemala.",
      cuando:
        "Trabajo de campo de 1975-1976 y visitas posteriores hasta 1989; " +
        "práctica viva hasta la actualidad.",
      documentado_por:
        "Tedlock, Barbara, Time and the Highland Maya, University of New " +
        "Mexico Press, Albuquerque, edición revisada de 1992 (1.ª ed. " +
        "1982); reseñado en Hispanic American Historical Review."
    },
    nivel5:
      "Existe la variante 584285, que desplaza el resultado dos días. La " +
      "datación por radiocarbono de Kennett et al. (2013) respalda la familia GMT " +
      "frente a correlaciones que se separan hasta mil años, pero NO puede " +
      "distinguir entre 584283 y 584285: un método con resolución de décadas no " +
      "arbitra una diferencia de 48 horas. La elección de 584283 se apoya en la " +
      "cuenta viva de los contadores de días k'iche' y en el uso como estándar de " +
      "campo. Son argumentos de práctica, no de datación física, y así se dicen.",
    ficha: {
      autor: null,
      titulo: "Correlación Goodman-Martínez-Thompson",
      publicacion: "Fuente primaria sin localizar",
      verificado_en: "No verificado"
    },
    aviso:
      "La ficha anterior de este proyecto decía que el radiocarbono «estrecha " +
      "hacia 584283». Era una inferencia nuestra, no del artículo. Corregido el " +
      "24 de agosto de 2026. Sobre el nivel4: la fuente (Tedlock, 1992) es de " +
      "las más sólidas de las diez —trabajo de campo propio de la autora, " +
      "reseñado académicamente—, aunque tampoco se ha leído en el original. " +
      "Y un aviso de estado: mientras `estado` siga en sin_verificar por " +
      "falta de fuente primaria de la correlación, este nivel4 no llega a " +
      "pantalla pase lo que pase con su propio contenido — queda escrito y " +
      "listo para cuando esa cuestión se resuelva."
  },

  calendario_islamico: {
    nombre: "Calendario islámico civil",
    clase: 2,
    bloque: "B",
    estado: "fuerte",
    nivel1: "Meses lunares contados desde la Hégira, con un ciclo fijo.",
    nivel3:
      "Meses alternos de 29 y 30 días, con un día añadido en 11 de cada 30 años. " +
      "Se obtiene de Intl.DateTimeFormat con el calendario islamic-civil, que es " +
      "el tabular. Nunca «islamic» a secas: en ICU eso equivale a islamic-rgsa, " +
      "respaldado por una simulación astronómica que no coincide con la práctica " +
      "real de ningún país conocido.",
    nivel4:
      "Los ulama de la tradición Syatariah de Padang Pariaman se reunían en " +
      "un lugar fijado por sus maestros, la playa de Ulakan y Koto Tuo, para " +
      "observar juntos la aparición de la luna nueva que marca el inicio de " +
      "cada mes; cuando la niebla o la nube lo impedían, completaban el mes " +
      "en curso hasta treinta días.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "Los ulama de la tradición Syatariah, encabezados por los tuangku " +
        "(maestros religiosos) locales.",
      donde:
        "La playa de Ulakan, Padang Pariaman, y Koto Tuo, en Agam, Sumatra " +
        "Occidental, Indonesia.",
      cuando:
        "Práctica viva; el estudio académico que la documenta es de agosto " +
        "de 2019.",
      documentado_por:
        "Jurnal Ulunnuha, agosto de 2019, estudio sobre la comprensión y " +
        "aplicación del hadiz de la ru'yat al-hilal por los ulama Syatariah " +
        "de Ulakan Padang Pariaman (indexado en DOAJ)."
    },
    nivel5:
      "Las variantes no discrepan por poco. Medido sobre el mismo rango: " +
      "islamic-tbla difiere de islamic-civil el 100 % de los días; islamic-rgsa, " +
      "el 85 %; y rgsa contra umalqura, el 61 %. Elegir mal no produce un desfase " +
      "de un día: produce otro calendario.",
    ficha: {
      autor: "Reingold, Edward M. y Dershowitz, Nachum",
      titulo: "Calendrical Calculations: The Ultimate Edition",
      publicacion:
        "4.ª ed., Cambridge University Press, 2018, 662 pp., " +
        "ISBN 978-1-107-05762-3 (cartoné) · 978-1-107-68316-7 (rústica). " +
        "Impreso en el Reino Unido por TJ International Ltd, Padstow " +
        "(Cornualles). Ediciones: 1.ª 1997 · 2.ª «millennium» 2001 · 3.ª 2008 · " +
        "4.ª «ultimate» 2018",
      verificado_en:
        "25 de agosto de 2026 · material preliminar del propio editor " +
        "(assets.cambridge.org, frontmatter del 9781107057623), con ficha " +
        "CIP de la Library of Congress, LCCN 2017024295 · registro de la " +
        "British Library declarado en la propia obra"
    },
    aviso:
      "La página de créditos dice «Fourth edition 2018» y la ficha del editor " +
      "dice 2017, con LCCN de 2017. Las dos son ciertas: catalogación en 2017, " +
      "circulación en 2018. Se cita 2018 y se anota el 2017. Y: islamicc está " +
      "obsoleto, no debe usarse. Sobre el nivel4: una sola fuente, aunque " +
      "académica y muy específica de una comunidad y un lugar concretos; no " +
      "corroborada todavía por una segunda fuente independiente."
  },

  /* --- clase ③ · convención sobre la escritura --------------------- */

  numerologia: {
    nombre: "Número del nombre",
    clase: 3,
    bloque: "A",
    estado: "sin_verificar",
    nivel1: "Un número obtenido de las letras del nombre según una tabla.",
    nivel3:
      "Cada letra vale un dígito y se suman. Pero la tabla se diseñó para un " +
      "alfabeto de 26 letras y el español tiene 27: nadie decidió nunca cuánto " +
      "vale la ñ porque la pregunta no existía cuando se hizo la tabla.",
    nivel4:
      "Sarah Joanna Dennis Balliett dirigía en Atlantic City su propia " +
      "Escuela de Psicología y Cultura Física para alumnado privado, donde " +
      "enseñaba y aplicaba su sistema de correspondencias numéricas sobre el " +
      "nombre a estudiantes y consultantes particulares.",
    bloque_nivel4: "B",
    etnografia: {
      quien:
        "Sarah Joanna Dennis Balliett (Mrs. L. Dow Balliett), como principal " +
        "de su propia escuela.",
      donde: "Atlantic City, Nueva Jersey.",
      cuando: "Desde 1904 (año de su primer libro) hasta su muerte en 1929.",
      documentado_por:
        "El mismo repertorio biográfico contemporáneo ya fichado en " +
        "`ficha.verificado_en` de este dato — cita interna «Scannell, " +
        "1917» y una entrada de 1923, ambas usadas como nota al pie por " +
        "la propia Wikipedia para esta afirmación — más Open Library " +
        "OL2851279A."
    },
    nivel5:
      "La entrada no es un instante: es una cadena de texto, y el resultado " +
      "depende de cómo se escriba. Medido sobre un nombre de prueba, dieciséis " +
      "convenciones defendibles dan cuatro resultados distintos. Por eso ningún " +
      "número puede guardarse solo: van con él la tabla, si se retiran las " +
      "tildes, qué se hace con la ñ, si 11, 22 y 33 se reducen, la cadena exacta " +
      "usada y el método del camino de vida. Y el sistema no es de Pitágoras: lo " +
      "construyó Sarah Joanna Dennis Balliett, que firmaba «Mrs. L. Dow " +
      "Balliett», en Atlantic City, y se autoeditó.",
    ficha: {
      autor:
        "Balliett, Sarah Joanna Dennis, 1847-1929, que firmaba «Mrs. L. Dow " +
        "Balliett»: L. Dow era el nombre de su marido",
      titulo:
        "How to Attain Success Through the Strength of Vibration: A System of " +
        "Numbers as Taught by Pythagoras (1904) · The Philosophy of Numbers; " +
        "Their Tone and Colors (1908)",
      publicacion:
        "Publicados por la autora («published by the author»), esquina " +
        "noroeste de las avenidas Pacific y Pennsylvania, Atlantic City (Nueva " +
        "Jersey), con distribución en Londres por L. N. Fowler & Co., Imperial " +
        "Arcade, Ludgate Circus",
      verificado_en:
        "25 de agosto de 2026 · repertorio biográfico contemporáneo publicado en " +
        "vida de la autora (Scannell, New Jersey First Citizens, 1917) y otro " +
        "de 1923 · Open Library OL2851279A · el copyright de 1908 a nombre de " +
        "Mrs. L. Dow Balliett, Atlantic City y Londres, en la página de " +
        "créditos del propio libro. Sin entrada de catálogo nacional"
    },
    aviso:
      "Circulaban tres años en conflicto para «el primer libro» —1903, 1908 y " +
      "1911— y eran libros distintos: el primero es de 1904. No aparecía en " +
      "catálogos porque era autoedición. Y la frase de Tesla sobre energía, " +
      "frecuencia y vibración que suele usarse de puente es apócrifa: no está en " +
      "sus patentes, conferencias ni artículos, y la única atribución rastreable " +
      "llega por un vendedor de placas de armonía. La fecha de The Balliett " +
      "Philosophy of Number Vibration in Questions and Answers aparece como " +
      "1918 en unas fuentes y 1930 en otras: no resuelto. Y la mayoría de " +
      "fuentes dan Sarah Joanna Dennis como nombre, pero al menos una " +
      "anotación de catálogo dice Josie Dow Balliett, con 84 años al morir, " +
      "que no cuadra con 1847-1929 (serían 82): no se elige ninguna. Sobre el " +
      "nivel4: reutiliza " +
      "la misma fuente biográfica ya verificada en la ronda del pendiente 15, " +
      "así que no añade riesgo de fuente nuevo."
  }
};

/* --- puente con el <script> clásico de index.html -------------------
   Mismo mecanismo que window.construirRegistro en registro.js y que
   window.abrirTemporizador en compas.js. En Node no hay window, así
   que al importar desde las pruebas esto no hace nada.
   ------------------------------------------------------------------- */
if (typeof window !== "undefined") {
  window.FUENTES = FUENTES;
}
