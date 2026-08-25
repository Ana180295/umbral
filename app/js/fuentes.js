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

   4. EL NIVEL 4 NACE VACÍO Y ES CORRECTO. Los ritos lunares son el
      terreno con más fuentes falsas de todo lo que este proyecto ha
      tocado. Escribir hoy «se ofrendaba en la Noumenia» porque suena
      razonable sería la regla 0.1 rota justo donde es más fácil
      romperla. Se llena con etnografía verificada (pendiente 35).

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
   nivel4 · qué se hacía con esto   → hoy null en todos, ver regla 4
   nivel5 · quién discute qué       → OBLIGATORIO
   ================================================================= */

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
    nivel4: null,
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
      "nombre: llevan dos milenios sin coincidir."
  },

  zodiaco_sidereo: {
    nombre: "Zodiaco sidéreo (ayanamsa Lahiri / Chitrapaksha)",
    clase: 1,
    bloque: "A",
    estado: "fuerte",
    nivel1: "Los mismos doce tramos de 30°, contados desde las estrellas.",
    nivel3:
      "Se fija Spica en los 180° sidéreos y se mide desde ahí. La app no copia " +
      "ninguna tabla de ayanamsas: define Spica con sus coordenadas J2000 y le " +
      "pide al motor la longitud eclíptica de la fecha.",
    nivel4: null,
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
      "grados. Decir «sidéreo» sin decir cuál no identifica ningún cálculo."
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
    nivel4: null,
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
      "nacional china, que es otra cosa."
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
    nivel4: null,
    nivel5:
      "Los tithi empiezan y acaban a cualquier hora del día natural, y uno puede " +
      "omitirse: cuando dos terminan en el mismo día solar, el primero se pierde " +
      "y el día se nombra por el otro. El texto lo llama tithikshaya y lleva la " +
      "cuenta hecha. El propio comentario de Burgess-Whitney califica la " +
      "división de arbitraria, y a la vez dice que es de la mayor importancia " +
      "práctica porque por ella se regulan las ceremonias. Las dos cosas a la vez.",
    ficha: {
      autor: "Burgess, Ebenezer (trad.); notas en su mayor parte de W. D. Whitney",
      titulo:
        "Translation of the Sûrya-Siddhânta, a Text-Book of Hindu Astronomy; " +
        "with Notes, and an Appendix",
      publicacion:
        "Journal of the American Oriental Society, vol. VI, pp. 141-498. " +
        "Separata: New Haven, para la American Oriental Society, impr. E. Hayes, " +
        "1860. iv + 354 pp., 24 cm. Dominio público",
      verificado_en:
        "25 de agosto de 2026 · HathiTrust 011604382 (ejemplar de Harvard, " +
        "vista completa) · OCLC 9857844 · JSTOR 592174 · DOI 10.2307/592174",
      capitulo: "cap. I, vv. 12-13 (definición) y vv. 36-38 (tithikshaya)"
    },
    aviso:
      "JSTOR fecha el volumen como 1858-1860 porque el tomo se compuso a lo " +
      "largo de tres años; la portada dice 1860 y la portadilla añade que se " +
      "comunicó a la Sociedad el 17 de mayo de 1858. Las tres son correctas y " +
      "describen cosas distintas. Se cita 1860. Y: el comentario es más extenso " +
      "que la traducción y es de Whitney, no de Burgess; al citar una nota, " +
      "Burgess-Whitney."
  },

  nakshatra: {
    nombre: "Nakshatra (mansiones lunares)",
    clase: 1,
    bloque: "A",
    estado: "debil",
    nivel1: "Veintisiete divisiones del recorrido de la Luna por el cielo.",
    nivel3:
      "La longitud eclíptica de la Luna, en zodiaco sidéreo, partida en 27 " +
      "tramos de 13° 20′, cada uno subdividido en cuatro padas de 3° 20′. El " +
      "origen de la esfera es el fin de Revatī y el principio de Aśvinī, " +
      "identificado con ζ Piscium.",
    nivel4: null,
    nivel5:
      "La fuente primaria está verificada, pero los grados exactos y los nombres " +
      "salen del capítulo VIII, que todavía no se ha cotejado contra el texto. " +
      "Por eso este dato está en verificado débil y no en fuerte: lo que sostiene " +
      "la cifra de 13° 20′ hoy es la literatura secundaria, no el original.",
    ficha: {
      autor: "Burgess, Ebenezer (trad.); notas en su mayor parte de W. D. Whitney",
      titulo:
        "Translation of the Sûrya-Siddhânta, a Text-Book of Hindu Astronomy; " +
        "with Notes, and an Appendix",
      publicacion:
        "Journal of the American Oriental Society, vol. VI, pp. 141-498. " +
        "New Haven, 1860. Dominio público",
      verificado_en:
        "25 de agosto de 2026 · HathiTrust 011604382 · OCLC 9857844 · " +
        "JSTOR 592174. El cap. VIII sin cotejar",
      capitulo: "cap. VIII (las mansiones) · cap. I, nota a v. 27 (el origen)"
    },
    aviso:
      "Se citan a veces 28 mansiones en vez de 27, contando Abhijit. No son " +
      "sistemas equivalentes y hay que declarar cuál se usa."
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
    nivel4: null,
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
        "Servire, Wassenaar / La Haya, 1967, distr. Llewellyn Publications, " +
        "St. Paul (Minnesota). 156 pp., 23 cm. Reelaboración de The Moon: The " +
        "Cycles and Fortunes of Life, David McKay Company, Filadelfia, 1946, " +
        "111 pp. Edición en circulación: Aurora Press, Santa Fe (Nuevo México), " +
        "1986, ISBN 0-943358-26-4, 196 pp.",
      verificado_en:
        "25 de agosto de 2026 · verso de portada de la ed. Aurora, en el " +
        "registro del ejemplar digitalizado (Internet Archive lunationcycle00dane, " +
        "Open Library OL8445199M, OCLC 19531810) · WorldCat 1036668863"
    },
    aviso:
      "Son dos libros con quince años y un océano entre ellos, y se funden a " +
      "menudo en uno. Circula además «1 de junio de 1967, Aurora Press, 196 " +
      "páginas», que mezcla el año de Servire con la editorial y la paginación " +
      "de Aurora. No usar esa combinación."
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
        "2.ª ed. revisada y ampliada, The Wessex Astrologer Ltd, Bournemouth, " +
        "2006, ISBN 1-902405-20-X, 196 pp. 1.ª ed.: Ascella Publications, 1998, " +
        "ISBN 1-898503-69-9",
      verificado_en:
        "25 de agosto de 2026 · registro del editor y catálogo para la 2.ª ed.; " +
        "la 1.ª consta con ISBN y pie Ascella en registro agregado, sin cotejar " +
        "contra la British Library"
    },
    aviso:
      "Ascella Publications era la editorial de la propia Houlding: la 1.ª ed. " +
      "era en la práctica autoedición, de ahí que apenas se catalogara. Y " +
      "circulan transcripciones de la página de créditos de la 2.ª ed. con el " +
      "apellido escrito «Boulding»; no se ha podido determinar si es errata del " +
      "libro o del reconocimiento óptico, así que no se afirma ninguna de las dos."
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
    nivel4: null,
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
      "24 de agosto de 2026."
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
    nivel4: null,
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
        "ISBN 978-1-107-05762-3 (cartoné) · 978-1-107-68316-7 (rústica)",
      verificado_en:
        "25 de agosto de 2026 · material preliminar del propio editor, con ficha " +
        "CIP de la Library of Congress, LCCN 2017024295"
    },
    aviso:
      "La página de créditos dice «Fourth edition 2018» y la ficha del editor " +
      "dice 2017, con LCCN de 2017. Las dos son ciertas: catalogación en 2017, " +
      "circulación en 2018. Se cita 2018 y se anota el 2017. Y: islamicc está " +
      "obsoleto, no debe usarse."
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
    nivel4: null,
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
      autor: "Balliett, Sarah Joanna Dennis (Mrs. L. Dow Balliett), 1847-1929",
      titulo:
        "How to Attain Success Through the Strength of Vibration: A System of " +
        "Numbers as Taught by Pythagoras (1904) · The Philosophy of Numbers; " +
        "Their Tone and Colors (1908)",
      publicacion:
        "Publicados por la autora, Atlantic City (Nueva Jersey), con " +
        "distribución en Londres por L. N. Fowler & Co.",
      verificado_en:
        "25 de agosto de 2026 · repertorio biográfico contemporáneo publicado en " +
        "vida de la autora (1917) y otro de 1923 · Open Library OL2851279A. " +
        "Sin entrada de catálogo nacional"
    },
    aviso:
      "Circulaban tres años en conflicto para «el primer libro» —1903, 1908 y " +
      "1911— y eran libros distintos: el primero es de 1904. No aparecía en " +
      "catálogos porque era autoedición. Y la frase de Tesla sobre energía, " +
      "frecuencia y vibración que suele usarse de puente es apócrifa: no está en " +
      "sus patentes, conferencias ni artículos, y la única atribución rastreable " +
      "llega por un vendedor de placas de armonía."
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
