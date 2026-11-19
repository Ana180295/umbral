/* =====================================================================
   Umbral — lo que significa el valor de hoy  ·  app/js/significados.js

   Ana, 19 de noviembre de 2026: «sobre esta tradición hay que poner cosas
   específicas de lo que se diga justo arriba, por ejemplo lo del sol en
   escorpio», y en las nakshatras, «que me expliques lo que significa
   purva, uttara, bhadrapada, pada». Decisión 0040.

   fuentes.js cuenta qué es cada tradición: lo mismo todos los días. Este
   módulo cuenta qué significa el valor que sale HOY (el signo, la
   mansión), y lo dice con la fuente de cada texto. No calcula nada.

   Reglas, las del proyecto:
   · 0.1: nada inventado. Cada texto resume una página concreta de una
     obra concreta, con nuestras palabras y sin copiar frases.
   · 0.2: se cuenta como una lectura («se lee como…»), nunca como lo que
     le pasa a quien lee.
   · Decisión C del 16 de noviembre: en el texto, solo la información; el
     autor y la obra van en el desplegable «Fuente».
   · Un valor sin texto no enseña nada: no se rellena.
   ===================================================================== */

import { FUENTES } from './fuentes.js';

/* ---------------------------------------------------------------------
   ZODIACO TROPICAL — Rudhyar, The Pulse of Life (1943)
   Cada signo es una fase del ciclo del año: la «fuerza del Día» (la que
   individualiza) crece de Capricornio a Cáncer y la «fuerza de la Noche»
   (la que reúne) de Cáncer a Capricornio. Es astrología psicológica, la
   que eligió Ana el 16 de noviembre, y es TROPICAL: se apoya en las
   estaciones, así que no vale para el zodiaco sidéreo.
   --------------------------------------------------------------------- */
const RUDHYAR_PULSE = {
  estado: 'debil',
  ficha: {
    autor: 'Rudhyar, Dane (1895-1985)',
    titulo: 'The Pulse of Life: New Dynamics in Astrology',
    publicacion:
      'David McKay, Filadelfia, 1943; reed. Servire, Países Bajos, 1963, y Shambhala, ' +
      'Berkeley, 1970; con el título Astrological Signs: The Pulse of Life, Shambhala, ' +
      'Boulder, 1978. Texto en línea en el Rudhyar Archival Project (khaldea.com), ' +
      'con permiso de los herederos',
    capitulo: 'Parte segunda, «Twelve Phases of Human Experience»: la página 1 de 3 de cada signo',
    verificado_en:
      '19 de noviembre de 2026 · la edición, en la bibliografía del Rudhyar Archival ' +
      'Project y en una ficha de librería anticuaria (1.ª ed., David McKay, 1943). ' +
      'El contenido, leído en khaldea.com a través de un resumen automático de cada ' +
      'página, no palabra por palabra'
  },
  nota:
    'Débil porque el contenido se ha leído por un resumen de cada página, y solo la ' +
    'primera de las tres de cada signo. Rudhyar escribe desde el hemisferio norte: ' +
    'las estaciones de las que habla son las de allí.'
};

const SIGNOS_RUDHYAR = {
  Aries:
    'Aries es el brote que rompe la tierra al empezar la primavera: la ' +
    'fuerza del Día acaba de igualar a la de la Noche y empieza a superarla. Se lee como ' +
    'la adolescencia de la personalidad, que sale del amparo de la familia hacia un mundo ' +
    'que siente hostil. Frente a la imagen del guerrero seguro de sí, aparece alguien sensible ' +
    'e inseguro, que se afirma para comprobar que tiene un yo.',
  Tauro:
    'Pasado el equinoccio, la fuerza del Día, que ya ha vencido a la de la Noche, se vuelve ' +
    'estable y busca asentarse en lo tangible. Se lee como la fase que da forma y ' +
    'función al impulso de Aries: la acción se repite, se organiza y echa raíces. Más que ' +
    'terquedad o apego, es la fecundidad de poner la energía al servicio de un propósito.',
  'Géminis':
    'Última fase de la primavera: la fuerza del Día se extiende hacia las relaciones y la de ' +
    'la Noche está en su punto más bajo. Se lee como la etapa en que la persona amplía ' +
    'su experiencia y construye su personalidad con vivencias concretas; el lenguaje es aquí el ' +
    'del poeta, pegado a imágenes, no el del filósofo. La independencia de esta fase es ' +
    'sobre todo una reacción contra lazos que todavía la sostienen.',
  'Cáncer':
    'Llega con el solsticio de verano: el Día alcanza su máximo y empieza a menguar, y la ' +
    'fuerza de la Noche gana terreno. Se lee como el principio que concentra las ' +
    'energías para dar una forma nítida y duradera a lo logrado, al revés que la expansión de ' +
    'Géminis. Es el cimiento, el hogar, del que crecerá la fuerza de la Noche.',
  Leo:
    'Segunda fase del camino que empieza en Cáncer, con la fuerza de la Noche, la que reúne a ' +
    'las personas, creciendo hacia el solsticio de invierno. Se lee como el paso de la ' +
    'pareja a los hijos: una unión nueva entre generaciones, responsabilidades que miran al ' +
    'futuro, y el tiempo que empieza a pesar. Antes que brillo personal, Leo es aquí ' +
    'responsabilidad hacia los que vienen.',
  Virgo:
    'Sigue a Leo, camino del equinoccio de otoño. Se abre con una pregunta: cómo ' +
    'trabajar y tomar parte en la sociedad sin agotarse; y responde con la técnica y con la ' +
    'reorientación de la vida emocional. La «pureza» y la «virgen» no son aquí castidad ni ' +
    'moral, sino energía sin gastar, libre de miedos y de restos que la malgasten. El análisis ' +
    'sirve a esa depuración, en una fase de crisis y de aprendizaje.',
  Libra:
    'Con el equinoccio de otoño cambia el rumbo: Aries iba hacia el máximo de la fuerza del ' +
    'Día y Libra va hacia una fuerza de la Noche cada vez mayor. Empieza aquí el ' +
    'crecimiento de la sociedad, como en primavera empezaba el de la personalidad, y por ' +
    'primera vez se siente de verdad el valor de lo social: la afirmación de Leo y la ' +
    'autocrítica de Virgo se resuelven en entrega a algo mayor.',
  Escorpio:
    'Signo tardío del otoño, cuando la fuerza de la Noche se intensifica. Se lee como ' +
    'el impulso de unirse a otros para formar un todo mayor, como los ríos que van al mar, y ' +
    'como el motor de la vida social; la sexualidad que se le asocia es la que construye ' +
    'civilización, distinta de la procreadora de Tauro, su opuesto. Su mala fama, la muerte y ' +
    'el pecado, vendría de que se miró el frío y la caída de las hojas en vez de su ' +
    'sentido, que es la regeneración.',
  Sagitario:
    'La fuerza de la Noche llega a su punto más alto y la del Día al más bajo: lo colectivo ' +
    'domina sobre lo individual. Se lee como la época de las grandes búsquedas hacia ' +
    'lo general, la religión, la filosofía, las leyes, con una mente que construye a escala de ' +
    'la sociedad. Matiza la imagen de aventura libre: es sobre todo una fuerza colectiva, con ' +
    'riesgo de fanatismo.',
  Capricornio:
    'Llega con el solsticio de invierno: los días han menguado todo lo que pueden y la fuerza ' +
    'del Día empieza a crecer, aunque la de la Noche, la del Estado y las instituciones, está ' +
    'en su cima. Se lee como la tensión entre el poder establecido en su apogeo y el ' +
    'nacimiento, todavía frágil, de lo que hace a cada persona ella misma. Más que ambición o ' +
    'materialismo, Capricornio es aquí un umbral de renacimiento.',
  Acuario:
    'El último de los signos fijos, los que liberan la energía acumulada; sigue a Capricornio. ' +
    'Se asocia con la civilización que se reforma a través de inventores, visionarios ' +
    'y revolucionarios, y con la persona que intenta soltarse del Estado y de la tradición. ' +
    'Advierte que esa energía puede transformar o destruir, y desbordarse si no encuentra cauce.',
  Piscis:
    'Último tramo del año solar, antes del equinoccio de primavera: la fuerza del Día crece y ' +
    'se prepara para superar a la de la Noche. Se lee como un tiempo de disolución y ' +
    'de limpieza, en el que hay que soltar seguridades e ideas heredadas, como la oruga en la ' +
    'crisálida. No es solo un signo soñador o compasivo: la única seguridad posible ' +
    'es aceptar que no la hay.'
};

/* ---------------------------------------------------------------------
   NAKSHATRA — los nombres, en las notas de Whitney al cap. VIII de la
   traducción de Burgess. La misma obra que ya sostiene la ficha de las
   nakshatras: aquí solo cambia dónde, dentro de ella.
   --------------------------------------------------------------------- */
const BURGESS_NOMBRES = {
  estado: 'fuerte',
  usa_ficha_de: 'nakshatra',
  capitulo:
    'notas de Whitney al cap. VIII, una por asterismo, pp. 327-343 (páginas leídas en el ' +
    'OCR, que escribe 827-843: por confirmar en el escaneo, como las del resto del capítulo) · ' +
    'cap. VIII, v. 5 (los cuartos, pada)',
  verificado_en: '19 de noviembre de 2026, contra el texto de JSTOR (Early Journal Content), por un resumen de esas páginas',
  nota:
    'Las traducciones son las que da Whitney en sus notas. Donde él dice que el sentido es dudoso o que no ' +
    'se sabe, aquí se dice lo mismo.'
};

const PURVA_UTTARA =
  'Pūrva y uttara significan «anterior» y «posterior»: de cada pareja de mansiones con el ' +
  'mismo nombre, la que pasa antes y la que pasa después por el meridiano.';
const PADA =
  'Pada: cada uno de los cuatro cuartos de una mansión. La misma palabra significa «pie», ' +
  'el que hay dentro de Bhādrapadā.';

const NAKSHATRAS_WHITNEY = {
  Ashwini: 'De los Aśvin, los dos jinetes: gemelos mitológicos que se comparan con Cástor y Pólux.',
  Bharani: 'De la raíz bhar, «llevar»; las listas del Taittirīya traen «la que se lleva».',
  Krittika: 'Sentido dudoso: quizá de la raíz kart, «cortar», que las notas relacionan con la figura de la navaja.',
  Rohini: '«La rojiza», por el color de su estrella principal.',
  Mrigashira: '«Cabeza de antílope», como su figura. No se sabe por qué se llama así.',
  Ardra: '«La húmeda». Las notas sospechan un origen en el tiempo atmosférico, sin poder seguirlo.',
  Punarvasu: 'De punar, «otra vez», y vasu, «bueno, brillante». No se ve por qué se llama así.',
  Pushya: 'De la raíz puṣ, «nutrir, prosperar». Otros nombres: tiṣya, «auspiciosa», y sidhya, «próspera».',
  Ashlesha: '«La que abraza, la que se enrosca».',
  Magha: '«La poderosa».',
  'Purva Phalguni':
    'Phalgunī es también el nombre de una higuera, pero las notas dicen que no se sabe de dónde ' +
    'viene ni qué significa aplicado a estas estrellas.',
  'Uttara Phalguni':
    'Phalgunī es también el nombre de una higuera, pero las notas dicen que no se sabe de dónde ' +
    'viene ni qué significa aplicado a estas estrellas.',
  Hasta: '«Mano».',
  Chitra: '«Brillante».',
  Swati:
    'Se dice que significa «espada». El Taittirīya-Brāhmaṇa la llama niṣṭyā, «la desterrada», ' +
    'quizá por estar tan al norte.',
  Vishakha: '«La de las ramas abiertas».',
  Anuradha: '«Éxito».',
  Jyeshtha: '«La más vieja».',
  Mula: '«Raíz».',
  'Purva Ashadha': 'Āṣāḍhā: «la invicta».',
  'Uttara Ashadha': 'Āṣāḍhā: «la invicta».',
  Shravana: 'De la raíz śru, «oír»: «el oído, la escucha».',
  Shravishtha: 'Superlativo de la misma raíz que Śravaṇa: probablemente «la más famosa». Otro nombre, dhaniṣṭhā, «la más rica».',
  Shatabhisha: '«La de los cien médicos».',
  'Purva Bhadrapada':
    'De bhadra, «hermoso, dichoso», y pada, «pie»: «la de los pies hermosos». Otro nombre es ' +
    'proṣṭhapadā, donde proṣṭha quizá sea «carpa» o «buey».',
  'Uttara Bhadrapada':
    'De bhadra, «hermoso, dichoso», y pada, «pie»: «la de los pies hermosos». Otro nombre es ' +
    'proṣṭhapadā, donde proṣṭha quizá sea «carpa» o «buey».',
  Revati: '«La rica, la abundante».'
};

export const SIGNIFICADOS = {
  zodiaco_tropical: { ...RUDHYAR_PULSE, por_valor: SIGNOS_RUDHYAR },
  nakshatra: { ...BURGESS_NOMBRES, por_valor: NAKSHATRAS_WHITNEY }
};

/* Lo que significa lo de hoy: los valores distintos que salen en la cifra,
   en su orden, con su texto; y la fuente. null si no hay nada que decir. */
export function significadosDelDia(clave, valores) {
  const s = SIGNIFICADOS[clave];
  if (!s) return null;
  const distintos = [...new Set(valores)].filter((v) => s.por_valor[v]);
  if (!distintos.length) return null;
  const parrafos = distintos.map((v) => ({ titulo: v, texto: s.por_valor[v] }));
  if (clave === 'nakshatra') {
    if (distintos.some((v) => /^(Purva|Uttara) /.test(v))) parrafos.push({ titulo: null, texto: PURVA_UTTARA });
    parrafos.push({ titulo: null, texto: PADA });
  }
  const base = s.usa_ficha_de ? FUENTES[s.usa_ficha_de].ficha : s.ficha;
  const ficha = s.usa_ficha_de
    ? { autor: base.autor, titulo: base.titulo, publicacion: base.publicacion, capitulo: s.capitulo, verificado_en: s.verificado_en }
    : base;
  return { parrafos, fuente: { estado: s.estado, nota: s.nota, ficha } };
}

if (typeof window !== 'undefined') {
  window.significadosDelDia = significadosDelDia;
  window.SIGNIFICADOS = SIGNIFICADOS;
}
