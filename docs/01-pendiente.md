# 01 · Pendiente de decidir

> Regla 1 de la hoja de ruta: si algo no está decidido, se pregunta antes
> de inventarlo. Este archivo es el sitio donde vive esa lista.
> Cuando algo se decide, sale de aquí y entra en `docs/decisiones/`.

*Última revisión: 12 de noviembre de 2026, al retomar tras la pausa.
Este fichero se quedó en el 28 de agosto y el código no: el commit
`6af760b` (29 de agosto, publicado) cerró el 36, 37, 38 y 39 y revisó el
13, y aquí seguían abiertos. Se cierran ahora, con su fecha real. El mismo
commit dejó **dos pruebas en rojo** (`nivel4-bloque.test.mjs`): no era la
app, era un doble que no tenía el campo `ayanamsa` que la cifra nueva lee.
Arreglado. La regla que sale de aquí: **ningún push sin `node --test`
entero en verde.** De la misma tanda: la época se calculaba en Albacete en
vez de donde naciste (corregido) y la zona horaria del nacimiento pasa a
salir de la localidad (decisión 0027). Entran como pendientes nuevos, del
40 al 47, el motor astrológico y lo que se encontró al revisar
`herramientas/hoja-de-cielo.mjs`.*

*Última revisión anterior: 28 de agosto de 2026, tras el push. El push se
adelantó — commit `7c95f91`, subido `b5a144f..7c95f91` a las 17:39, no a
las 23:00 como estaba previsto: la ayuda externa esperada para la Fase 1
no se pudo confirmar a tiempo. Las cinco comprobaciones de
`PUSH-27-28-agosto.md` se hicieron en el móvil, en producción real, con
resultado favorable en cuatro y un hallazgo real en la quinta (pendiente
38). Se probaron además el Compás y la exportación/importación con datos
reales, fuera de la lista original. Cuatro hallazgos nuevos entran como
pendientes 36-39.*

*Última revisión anterior: 28 de agosto de 2026, antes del push. El lugar
de nacimiento pasa a pedirse por localidad, no por coordenadas (0025), y
el dibujo del Espiral pasa a tres anillos paralelos —Día, Lunación,
Espiral— (0026). De paso, tres
fallos reales de arranque quedan corregidos: el `<script>` clásico de
`index.html` no esperaba a los módulos diferidos, `luna.js` nunca tuvo el
puente con `window`, y el `fetch` handler de `sw.js` buscaba en todas las
cachés del origen en vez de en la de la versión actual.*

*Última revisión anterior: 26 de agosto de 2026. El 35 hace su ronda y se queda con*
*residuo —nueve datos con nivel4 escrito, ninguno leído en fuente primaria
completa— y de paso obliga a abrir una decisión nueva, la 0019, porque el*
*bloque del nivel4 no podía vivir en el mismo campo que el bloque del resto*
*del dato sin deshacer la 0015 para cuatro datos.*

*Segunda ronda del mismo día: se cierran 24, 26, 20, 30, 31, 32 y 34 (ver
«Cerradas»). El 15 se reduce a un único cotejo abierto —Burgess, y por una
razón nueva: el capítulo puede no ser el que corresponde, no solo faltar por
leer—. `ORBE_PARALELO` deja de estar heredado: medido en 0,75°, con hallazgo
aparte sobre `ORBE` anotado en `03-registro-de-datos.md`.*

| # | Asunto | Bloquea |
|---|---|---|
| 2 | Segundo momento para preguntar `accion_resultado` | Campo hoy siempre `null` |
| 3 | "Concentrarme" (documento) vs "Enfocarme" (maqueta) | Vocabulario de necesidad |
| 4 | Cobertura de polen en Albacete (Red Española de Aerobiología) | Alcance de Fase 3 |
| 5 | Clave de AEMET OpenData para normales 1991-2020 | Línea base climática |
| 6 | Umbral exacto de "sin cobertura" frente a "sin conexión" | Estados de `cache_externa` |
| 7 | Choque de color: `--fam-atmosfera` y `--fam-kp` con la paleta reservada en 0005, y `--fam-luna` con `--oro`. **Ojo: el 22 de agosto se declararon `--crema` y `--malva` como tokens de interfaz en `index.html`** (los usan la rosa y el Compás). Es legítimo según 0005, que los reserva frente a las familias de datos y no frente a la interfaz, pero al repartir los colores de Fase 2 hay que tenerlo delante | Fase 2 |
| 9 | Las campanas del Compás: la afinación entera es provisional hasta oírla en un móvil. Desarrollado abajo | No bloquea |
| 10 | **La pantalla resumen: los tres niveles en un solo espacio gráfico.** Desarrollado abajo, con lo que Ana describió el 22 de agosto | Después del 28 |
| 11 | Portada de 1200 px (125 KB): entra o no, se decide con los ojos tras el 28 | No bloquea |
| 14 | Qué se dibuja para la familia observacional de calendarios | Calendario |
| 15 | **Residuo, reducido el 26 de agosto.** Quedaba un solo cotejo sin cerrar: **capítulo VIII de Burgess** — HathiTrust 011604382 confirmado (JAOS vol. VI, 1860, dominio público), pero el índice del propio capítulo lo describe como posiciones de estrellas de unión, no como una división en 27 tramos iguales; **la referencia puede estar apuntando al capítulo equivocado**, y eso solo se resuelve leyendo el texto, no el índice. Houlding y Balliett, cerrados — ver «Cerradas» | Nakshatra y clase ③ en pantalla |
| 17 | Reequilibrio del catálogo: `conectar` (8) y `salir` (10) tienen muy pocas prácticas | No bloquea |
| 18 | Icono de 512 con un render más nítido de la brújula, para el arranque del sistema | No bloquea |
| 19 | Aislamiento real de IndexedDB mediante dominio propio (ver 0007) | No bloquea |
| 22 | Revisar la capa completa del Compás tras usarla. Ana la marcó como prueba, no como decisión firme | Después del 28 |
| 27 | **Ficha cerrada, contenido no.** La edición ya no se busca: Meeus, *Astronomical Algorithms*, **2.ª ed., Willmann-Bell, Richmond (Virginia), 1998**, ISBN 978-0-943396-61-3. *Aviso: circulan reimpresiones fechadas en diciembre de 1999 y citadas como si fueran otra edición; no lo son.* Lo que queda es **abrir el capítulo 49 y leer el número**, y decidir de quién son en realidad M₂ = 0,24 m y S₂ = 0,11 m, que están atribuidas a Meeus sin que conste que sean suyas | No bloquea |
| 28 | **Correcciones que la hoja de ruta v5 tiene que absorber.** Desarrollado abajo | Redacción de la v5 |
| 29 | Retirar los dos prototipos ya integrados de `herramientas/`: `temporizador-respiracion.html` y `portada.html`. El segundo guarda las tres frases descartadas de la portada, así que antes hay que decidir dónde viven esas | No bloquea |
| 35 | **Hecha la ronda, con residuo.** Desarrollado abajo | Ya no bloquea que el nivel 4 exista. Queda: subir cada etnografía de «localizada» a «leída en su original» |
| 40 | **La casilla de cierre se va a medianoche.** El código hace `getHours() >= 21`; la 0015 dice «visible desde las 21:00 hasta el final del día lunar — no hasta medianoche». Y la 0015 dice también que esa hora la declara la persona (`hora_cierre_visible`, editable, en `perfil_local`), que nunca se implementó. Ana, 12 de noviembre: «vamos a ponerla cuando salga cada día» — **pendiente de aclarar** si significa que la casilla aparece al salir la Luna, lo que cambiaría la 0015, antes de tocar código | No cumple lo documentado |
| 41 | **El ayanamsa no es el Lahiri oficial: es *True Chitra*.** Cotejado el 12 de noviembre. El comité de reforma del calendario indio (1955) lo definió como 23°15′00″ de longitud tropical verdadera el 21 de marzo de 1956 —Bhatnagar, IAU, Kluwer 1990, que dice «0h UT»; Swiss Ephemeris, Koch y Treindl, §2.8.5, que dice «0:00 Ephemeris Time»: se escriben las dos—, y con esa definición Spica cae en 179°58′59″ en el año 2000, no en 180°. Umbral fija Spica en 180°. Medido: 61″ por debajo del Lahiri habitual en 2000, 36″ por debajo del valor del comité en 1956. Renombrar la ficha de `fuentes.js`, la convención del 02 y el 05; el Lahiri oficial, como segunda opción de `ayanamsa` dentro del motor. El informe de 1955 no se ha leído | Nombre falso en tres sitios |
| 42 | **Qué instante representa un día lunar.** Hoy «Día anterior» calcula el nivel 2 en el último segundo del día, «Día siguiente» en el primero, y «Hoy» en el momento actual. Medido en 2026: el tithi cambia dentro del día en 347 de 352 días lunares y el nakshatra en 345. Ana elige el 12 de noviembre la opción (iii): **enseñar el cambio dentro del día** («tithi 7 → 8 a las 14:32»). Falta decisión numerada, y aclarar si con ello se da por terminado lo que pedía el 36 (cerrado en código el 29 de agosto) o si también tenía que variar el texto explicativo, que la 0016 declara estático | Nivel 2 y tránsitos |
| 43 | **El motor astrológico.** Ana, 12 de noviembre: «sí a todo, incluido Quirón, y todo lo relevante para nuestras tradiciones», y que se **resalte lo que hacía especial el cielo de ese momento** —oposiciones, planetas a la vista toda la noche, distancias mínimas, salidas y puestas de cada cuerpo— como en `nacimiento-1995-02-18.md`. Decidido ya: un módulo `app/js/carta.js` como único original, del que importan `dia.js` y `hoja-de-cielo.mjs` (que pasa a cargar la build UMD); la carta sin hora exacta se calcula en los dos extremos de la franja, y el Ascendente, el Medio Cielo y las casas solo con hora exacta; el cumpleaños lunar, con el instante exacto (`SearchMoonPhase`), no con un barrido. **Sin decidir, en conversación aparte: dónde vive en la app.** Quirón no lo trae el motor: se integraría con `GravitySimulator` desde un vector de estado de JPL Horizons, midiendo el error antes de darlo por bueno. Cada «destacado» necesita un criterio escrito —qué cuenta como «cerca de la oposición»—, no un adjetivo | Fase del motor |
| 44 | **Paralelos y orbes.** `hoja-de-cielo.mjs` calcula las longitudes geocéntricas y la declinación de los paralelos topocéntrica. Medido: 0,63° de diferencia en la declinación de la Luna en la carta de referencia, y 0,93° como máximo en 2026, más que `ORBE_PARALELO` (0,75°), que se midió con ese mismo código. Y `ORBE` se validó con tránsitos contra la carta natal y se aplica entre los cuerpos de la propia carta. **En conversación aparte** | Aspectos y paralelos del motor |
| 45 | **Las horas planetarias del script.** Tres fallos medidos: la marca de día o noche dice «día» con el Sol a −45° (las búsquedas empiezan 30 h antes); el texto anuncia horas planetarias y solo calcula el regente del día; y el regente sale del día civil, no del día que empieza al salir el Sol. Hoy no llegan a la app. **Darles una vuelta antes de decidir si entran** | No bloquea |
| 46 | **La carta de prueba del motor.** `dia.test.mjs` cita `datos-prueba.json`, que no está en el repositorio; lo que hay es `datos-ejemplo.json` en otra carpeta, con el nombre completo de Ana, y el repositorio es público. Ana, 12 de noviembre: una carta aparte con nombre y fecha inventados, o la de una persona conocida con hora de nacimiento fiable | Pruebas del motor |
| 47 | **Nacimientos anteriores a 1970.** La base de zonas horarias del navegador no garantiza, hasta donde se sabe, los cambios de hora locales anteriores a 1970; sin verificar en fuente. Ana, 12 de noviembre: sin aviso por ahora | No bloquea |

## El 9, desarrollado

La afinación entera del Compás es **provisional a propósito**, y conviene
saber qué parte es firme y qué parte no.

Firme, porque no es cuestión de gusto: las campanas salen todas del acorde
del instrumento, que solo tiene octavas y quintas sobre La. Meter una nota de
fuera sería lo que convertiría un aviso en una alarma.

Provisional, y a revisar de oído después del 28:

1. **La3 para el final.** La4 (girar) y La3 (parar) son la misma clase de
   altura separadas una octava, que es justo el intervalo que el oído funde.
   Se compensa con una cola 1,6 veces más larga en la campana final, así que
   hay dos canales de distinción y no uno. Si aun así se confunden, hay que
   cambiar la nota, no alargar más la cola.
2. **La campana final suena también en modo respiración.** Decidido el 22 de
   agosto: sin ella, el último sonido de una respiración es el mismo La4 que
   suena a mitad del ejercicio, y con los ojos cerrados no hay forma de saber
   si venía otro ciclo.
3. **Los volúmenes** (0,050 al empezar · 0,075 al girar · 0,090 al final).
   Son del prototipo y no se han medido en un altavoz de móvil.

Todo esto se prueba en el portátil hasta el 28, sabiendo que el sonido de un
portátil y el de un móvil no se parecen. No se pide excepción a la congelación
de la ventana 1.

## El 28, desarrollado

La v5 no es solo juntar el parche: hay cinco sitios donde el texto vigente ya no
describe la app.

| Sección | Qué dice hoy | Qué pasó |
|---|---|---|
| §2 | «La marca aparece una vez, no dos […]; no se repite junto al nombre dentro de la app» | La rosa está junto al nombre y se queda (pendiente 23, cerrado) |
| §3 | «45,6 KB gzip» del motor, sin decir de qué build | Son los de la build **UMD minificada**. La de módulos ES son 105,1 KB |
| §8 | «Noches sin Luna: 63 ± 2» | Ninguna definición llega a 63 (pendiente 24) |
| §8 | El día lunar sin rango | Medido: **58 minutos** entre el más corto y el más largo de 2026 |
| §15 | «solo las de respiración abren el temporizador» | Abren 37 prácticas, no 3 (decisión 0010) |
| §3 y §9 | Meeus citado como «cap. 49» sin edición | Ficha completa desde el 25 de agosto: 2.ª ed., Willmann-Bell, Richmond, 1998, ISBN 978-0-943396-61-3 |
| §10 | «las tradiciones van atribuidas a autor y edición» | Cierto y hasta hoy imposible de cumplir: `docs/` no se empaqueta. Resuelto por la 0016 y escrito en `app/js/fuentes.js` |
| §14 y donde se nombren pantallas | Numeradas por posición, y la 0011 y la 0015 no contaban desde el mismo sitio | El mapa de la **decisión 0017**: claves, no números. El arranque del sistema sale de la lista porque no lo dibuja la app |
| §17 | «`VERSION` de `sw.js` en `2026-08-22d`» | El fichero dice `2026-08-24a`. La §17 se quedó atrás |

Y al escribirla se borra `parche-hoja-de-ruta.md`, que queda absorbido.

## El 24, desarrollado

La §8 pedía «noches sin Luna en Albacete en 2026: 63 ± 2» como prueba dorada.
**No se puede convertir en prueba, porque la fila nunca dijo qué es una noche.**
Contando las noches en que la Luna está bajo el horizonte durante todo el
intervalo:

| Definición de noche | Noches sin Luna en 2026 |
|---|---|
| Astronómica, Sol bajo −18° | **59** |
| Náutica, Sol bajo −12° | 45 |
| Civil, Sol bajo −6° | 25 |
| De puesta a salida de Sol | 10 |

Ninguna da 63, y la más permisiva —59— se queda fuera de la tolerancia. Las
otras doce pruebas de la §8 salen, y perigeo y apogeo salen al kilómetro exacto,
así que no es el motor.

**Se propone sustituir la fila por «59, con noche astronómica».** Con método
escrito es una prueba dorada; sin él era un número.

**No se aplica todavía.** Queda pendiente de revisar: es un dato de la §8 y lo
mira Ana antes de tocarlo. Mientras tanto, esa fila no es una prueba y no está
en `pruebas/luna.test.mjs`.

## El 18b, cerrado el mismo día

El dibujo de los iconos no está sobre el fondo de la app: está sobre un
rectángulo de `#040618`, que es el nocturno que la §2 declaraba antes de que
los tokens y el manifest pasaran a `#0A0E19`. Medido:

| Icono | Cuánto ocupa el rectángulo |
|---|---|
| `icono-32` | 18,5 % |
| `icono-180` | 34,9 % |
| `icono-192` | 36,5 % |
| `icono-512` | **39,1 %** (399 × 351 px, el 53,4 % del lienzo) |
| `icono-maskable-512` | 21,1 % |

Contraste entre los dos azules: **1,043 : 1**. Casi nada, y por eso es peor de lo
que parece: no se lee como un fallo, se lee como un canto tenue alrededor del
dibujo, justo lo que se nota en una pantalla OLED a oscuras.

**Ninguna de las cinco pruebas doradas lo coge**, porque la quinta compara el
manifest con el CSS y no mira dentro de ninguna imagen. Si se quisiera cubrir,
haría falta una prueba que leyera píxeles de PNG sin dependencias: es posible con
`node:zlib`, y son unas sesenta líneas. Sin decidir si merece la pena.

Se arregla sin volver a renderizar: repintar la familia de `#040618` al lienzo.
**Mirado y aceptado el 22 de agosto: los cinco corregidos ya están en
`app/iconos/`.** De paso pesan 89 KB menos entre los cinco (de 134 KB a 43), porque desaparece
también el difuminado de paleta que llenaba esa zona de tonos casi iguales.

Es una corrección de color y **no sustituye al 18**, que sigue abierto y es otra
cosa: un render nuevo, más nítido, de la brújula.

## El 10, desarrollado

### Primero: son DOS resúmenes y no uno

Se confundieron el 22 de agosto y por eso queda escrito aquí, separado y con
nombre. **No son la misma cosa ni viven en el mismo sitio.**

| | **El resumen personal** | **La pantalla resumen** |
|---|---|---|
| Qué dice | cuánto llevas anotado hoy | cómo está el día entero, de un vistazo |
| Forma | una línea de texto | un espacio gráfico |
| Dónde | dentro de «Mi registro», debajo del botón | pantalla propia, entre la portada y el cuestionario |
| Estado | **existe y se queda donde está** | no existe |

El personal es la línea *Hoy: 2 registros · último a las 15:41*. Ya está hecha,
funciona, y **no se mueve**.

### Lo que Ana describió de la pantalla resumen

Los **tres niveles en un solo espacio gráfico**, para que de un vistazo te
puedas hacer una idea de cómo está todo:

1. **Fuera** — el contexto medible.
2. **Dentro** — las cuatro escalas autoinformadas.
3. **Las percepciones de las energías** — lo interpersonal, lo planetario, el
   pulso de la Tierra. Clasificadas en su día como *percepción autoinformada*,
   no como dato externo medido, y por eso son entradas legítimas.

### Y lo que hay que resolver antes de dibujar una sola línea

**Hoy solo existe uno de los tres.** Las cuatro escalas están hechas; el
contexto medible es Fase 2 y no hay ni un dato; las percepciones de las energías
no tienen todavía ni pregunta ni campo en el esquema. Un dibujo de tres anillos
donde dos están vacíos no es un resumen: es una promesa.

**El nivel 1 y los niveles 2 y 3 no son la misma clase de cosa.** Uno se mide
fuera y los otros dos los dices tú. La regla 0.2 no prohíbe enseñarlos juntos
—prohíbe mezclarlos en una fórmula o en un mismo número—, pero **la proximidad
visual se lee como causa aunque ningún cálculo los toque**. Tres anillos
concéntricos dicen "esto es un sistema" sin escribir una palabra. Se puede hacer
honestamente, y hay que decidir CÓMO al dibujarlo, no después: qué separación
explícita impide leerlo como correlación.

**La trampa del radio.** Si el radio del anillo codifica el valor, entonces «sin
dato» y «valor mínimo» se dibujan igual, y son cosas opuestas. Un anillo
diminuto puede querer decir "energía muy baja" o "no anoté nada". El hueco
necesita un dibujo propio —abierto, punteado, algo que no se confunda con un
valor bajo— y no un círculo pequeño. Con dos de los tres niveles vacíos hoy,
esto deja de ser un detalle y pasa a ser la mitad del dibujo.

**Falta una decisión numerada.** Esto ya no cabe en una entrada de pendientes:
cuando se aborde, va a `docs/decisiones/`.

## El 35, desarrollado

**Lo que pedía la fila.** La decisión 0018 abrió el nivel «qué se hacía con
esto» y la clase ⑤, con sus cuatro campos obligatorios —quién, dónde, cuándo,
quién lo documentó—, vacío a propósito en los diez datos desde el 25 de
agosto. Hacía falta la ronda de verificación, sabiendo que este terreno tiene
más fuentes falsas que ninguno de los anteriores.

**Lo que se hizo, el 26 de agosto.** De los diez datos, **nueve** tienen hoy
nivel4 escrito con etnografía completa. `casas` se queda vacío a propósito:
comparte el mismo episodio histórico que `zodiaco_tropical` —mismos
astrólogos, misma fuente, Neugebauer y Van Hoesen (1959)— y escribirlo dos
veces habría sido duplicar una fuente, no documentar dos prácticas distintas.
Su etnografía vive en el nivel4 de `zodiaco_tropical`.

**El problema de forma que apareció al escribirlo, y que no preveía la 0018.**
Cuatro de los datos con nivel4 nuevo —`zodiaco_tropical`, `zodiaco_sidereo`,
`nakshatra`, `numerologia`— tienen su nivel1-3 legítimamente en bloque A
(disponible siempre). La 0018 exige que *todo* nivel4 viva en B, y la prueba
dorada que lo comprobaba miraba el campo `bloque` del dato entero: forzarlo a
"B" para esos cuatro habría escondido también su explicación básica hasta el
cierre del día, deshaciendo un trozo de la 0015 sin que nadie la abriera. Se
resolvió separando el campo: `bloque` sigue describiendo nivel1/3/5, y
`bloque_nivel4` —nuevo, siempre `"B"` cuando hay nivel4— describe solo el
nivel4. Ver **decisión 0019**.

**Verificado con `node --test`, no solo a ojo:** las once pruebas doradas de
`fuentes.test.mjs` pasan sobre el fichero con el contenido nuevo, incluida la
prueba reescrita del bloque y la que rechaza segunda persona o presente de
costumbre en cualquier nivel4.

**El residuo, honesto y dato a dato.** Ninguna de las nueve etnografías se ha
leído en su fuente primaria completa — todas se apoyan en corroboración
académica secundaria, con distinto grado de solidez:

| Dato | Fuente del nivel4 | Leída en el original |
|---|---|---|
| `zodiaco_tropical` (+ `casas`, fusionado) | Neugebauer y Van Hoesen, *Greek Horoscopes*, 1959 | No |
| `zodiaco_sidereo` | Pingree, *Jyotiḥśāstra*, 1981 | No |
| `jieqi` | UNESCO, Decisión 11.COM 10.B.6, 2016 | **Sí**, texto primario |
| `tithi` | Pearson, *"Because It Gives Me Peace of Mind"*, 1996, p. 163 | No, cita de segunda mano |
| `nakshatra` | Kurup (1977) + Cush, Robinson y York (2012) | No, dos fuentes secundarias independientes |
| `fases_rudhyar` | Campion (2009) + Melton (fecha 1969) | No |
| `tzolkin` | Tedlock, *Time and the Highland Maya*, 1992 | No, pero la autora hizo el trabajo de campo ella misma |
| `calendario_islamico` | *Jurnal Ulunnuha*, agosto de 2019 | No, una sola fuente |
| `numerologia` | Repertorio biográfico ya usado en el pendiente 15 | No añade fuente nueva |

`jieqi` y `nakshatra` son los más sólidos —el primero por lectura directa del
texto primario, el segundo por dos fuentes académicas independientes, una
revisada por pares—. `calendario_islamico` y `tithi` son los más débiles: una
sola fuente en el primer caso, cita de segunda mano sin acceso al libro en el
segundo.

`tzolkin` y `numerologia` tienen nivel4 completo pero **no llegan a
pantalla**, porque su `estado` general sigue en `sin_verificar` por motivos
ajenos a la etnografía —la correlación del tzolk'in sin fuente primaria, el
alfabeto de 27 letras de la numerología sin tabla fija—. El nivel4 queda
escrito y listo para cuando esa cuestión se resuelva.

**Lo que queda, sin urgencia.** Cotejar cada fuente contra su original, con el
mismo listón que se le aplicó a Burgess el 26 de agosto. No bloquea nada hoy,
pero es la distinción entre «encontrado» y «leído» que este proyecto lleva
insistiendo en mantener, y perderla de vista sería exactamente el tipo de
deriva que la regla 0.1 existe para evitar.

## Cerradas

- **La zona horaria del nacimiento sale de la localidad — decisión 0027,
  12 de noviembre de 2026.** El `timezone` de Open-Meteo, que se
  descartaba, viaja como `zona` en cada candidata; validado con `Intl`, y si
  falta, `null`. La pantalla usa entonces la del aparato y dice cuál de las
  dos usa. Los perfiles anteriores no se migran: solo existía el de Ana.
  Nuevo `pruebas/geocodificacion.test.mjs`, el que faltaba desde el 28 de
  agosto: once pruebas, ocho mutantes, los ocho muertos.
  → `decisiones/0027-zona-horaria-del-nacimiento.md`
- **La época se calculaba en Albacete — corregido el 12 de noviembre de
  2026, sin decisión propia.** `index.html` pasaba el observador de
  Albacete a `resolverEpoca()` en el calendario y en la portada, contra la
  0012 y la §4 de la hoja de ruta. Con perfiles nacidos en Albacete, el
  único caso en que el fallo no cambia nada, nadie lo vio. Ahora
  `epocaDelPerfil()`, en `perfil.js`, construye el observador con las
  coordenadas del nacimiento. Pruebas 26-30 de `perfil.test.mjs`, la 27 con
  Buenos Aires a propósito, y la 30 lee `index.html` para que
  `OBS_ALBACETE` no vuelva a entrar en la época. Cuatro mutantes, los
  cuatro muertos. Detalle al final de la 0027.
- **Dos pruebas en rojo publicadas — corregido el 12 de noviembre de
  2026.** El doble de `solSidereo` en `nivel4-bloque.test.mjs` no tenía
  `ayanamsa`; la cifra nueva del 36 lo lee, el renderizador lanzaba, y se
  saltaba la ficha. El doble devuelve ahora la misma forma que `dia.js`,
  campo a campo, con un comentario que lo exige.
- **36, 37, 38 y 39 — cerrados en código el 29 de agosto de 2026 (commit
  `6af760b`, publicado), escritos aquí el 12 de noviembre.**
  - **38:** «Ir al día de nacimiento» compara con
    `TOLERANCIA_MISMA_SALIDA_MS`, movida a la cabecera de `perfil.js`.
  - **39:** la copia automática antes de importar se escribe en IndexedDB,
    almacén `ultima_copia` (`DB_VERSION` 2), sin descargar nada.
  - **37:** el Espiral une los puntos con una curva de Catmull-Rom y el
    punto de hoy lleva un resplandor. **Falta que Ana lo mire en el móvil.**
  - **36:** la cifra enseña el contexto que `dia.js` ya calculaba, y los
    niveles 1/3/4/5 pasan a un desplegable propio. Lo que queda abierto
    está en el 42.
  - **13:** revisado sin cambio de código: ni `diaLunar()` ni
    `calendarioPersonal()` usan ninguna media para decidir dónde acaba un
    día.

- **El lugar de nacimiento se pide por localidad, no por coordenadas —
  decisión 0025, 28 de agosto.** Los tres campos numéricos (`lat`/`lon`/
  `altitud`) se sustituyen por un buscador de nombre, resuelto una vez con
  la API de geocodificación de Open-Meteo —investigada esa misma noche, no
  elegida de memoria: sin clave, con CORS, devuelve elevación en la misma
  llamada— y guardado fijo; nunca se vuelve a pedir red para el mismo
  perfil. Módulo nuevo y separado, `app/js/geocodificacion.js`, porque toca
  la red y `perfil.js` declara que no lo hace. Sin alternativa manual: si
  la búsqueda falla, se reintenta. Probado contra la API real, no contra
  dobles: «Springfield» dio cinco candidatas reales en distintos estados de
  EE. UU.; «San José», cuatro en tres continentes; «Albacete», dos —la
  ciudad y su aeropuerto—, lo que expuso un fallo real de interfaz (la
  lista de candidatas se quedaba visible debajo de la elección ya hecha)
  corregido en el momento. Pendiente de resolver: dónde va la atribución
  CC BY 4.0 a GeoNames. → `decisiones/0025-localidad-de-nacimiento.md`
  (28 de agosto de 2026)
- **El Espiral se dibuja en tres anillos paralelos — decisión 0026, 28 de
  agosto.** Día, Lunación y Espiral, la misma pregunta —cuántos caben
  dentro del de arriba— a tres escalas. Se probó primero con cada anillo
  girado a un ángulo de arranque distinto; se descartó al verlo, y se
  quedó la versión sin desfase. Espiral se queda con una sola marca, sin
  historial de años anteriores: con 30 años son ~26 Espirales, y dejan de
  leerse como espiral. Exigió un derivable nuevo en `calendario.js`,
  `diasEnLunacion`, capturando un instante que la función ya calculaba por
  dentro y descartaba. Un fallo real de conteo —se contaba un día antes de
  confirmar que `diaLunar()` lo había encontrado— apareció escribiendo la
  prueba, no por mutación, y quedó corregido, no solo documentado.
  → `decisiones/0026-espiral-entrelazado.md` (28 de agosto de 2026)
- **Tres fallos reales de arranque, corregidos, sin decisión propia
  numerada porque no hay ningún criterio nuevo que decidir — solo código
  que no hacía lo que su propio comentario decía que hacía.** El arranque
  de `index.html` leía `window.observador()` y `window.FRANJAS_NACIMIENTO`
  antes de que los módulos diferidos hubieran cargado, con un comentario
  que afirmaba —incorrectamente— que ya se sabía que habían cargado;
  corregido envolviendo el arranque en `DOMContentLoaded`, que sí lo
  garantiza por especificación. `luna.js` nunca había tenido el puente
  `window.observador`/`window.diaLunar` que el `<script>` clásico
  necesita —se le olvidó el 26 de agosto, cuando se cargó por primera
  vez—; añadido, calcado del mismo patrón que ya usan `fuentes.js` y
  `perfil.js`. Y el `fetch` handler de `sw.js` llamaba a `caches.match()`
  sin decir de qué caché, buscando en todas las del origen a la vez en
  vez de en la de la versión actual — una caché vieja sin borrar podía
  ganar la búsqueda y servir código de días antes con la versión nueva ya
  instalada al lado; costó una noche entera de capturas de pantalla
  encontrarlo. Corregido: `caches.open(CACHE)` explícito antes de
  `match()`, en las dos rutas del handler. (28 de agosto de 2026)
- **El renderizador de tradiciones respeta `bloque_nivel4` — cierre de la
  0019.** La decisión ya estaba escrita desde el 26 de agosto; el
  renderizador de `index.html` no la aplicaba todavía, así que el nivel4
  de `zodiaco_tropical`, `zodiaco_sidereo` y `nakshatra` se veía siempre,
  incluso en el día de hoy sin cerrar. Corregido: el nivel4 se separa a
  una ficha propia cuando su bloque difiere del resto del dato. Verificado
  con siete mutaciones deliberadas contra un doble mínimo de `document`
  —no jsdom, que no está instalado en el árbol del proyecto—, sin
  decidir nada por sí mismo: solo acumula el texto que decide el código
  real. (28 de agosto de 2026)
- **`calendario` y `dia`, fusionadas en una sola pantalla — 27 de agosto.**
  La 0023 diseñó `calendario` como rejilla de navegación y `dia` como pantalla
  aparte, abierta al tocar un día. Al construir la navegación día a día dentro
  de `calendario` (con `diaLunar()`, sin promediar), Ana señaló que era
  innecesario separarlas: **es la misma pantalla**, y la 0023 sigue
  gobernando su forma interna —bloque A siempre visible, bloque B solo en
  días ya cerrados, la casilla de cierre que nunca se guarda— pero sin la
  navegación aparte que el diseño original daba por hecha.
  Con eso, se escribió el renderizador que unía `fuentes.js` (niveles 1,3,4,5)
  con el nivel 2 nuevo — **`app/js/dia.js`**, con las fórmulas de zodiaco
  tropical y sidéreo, jieqi, tithi, fases de Rudhyar, nakshatra y calendario
  islámico copiadas literales de `herramientas/hoja-de-cielo.mjs`, no
  reescritas de memoria. Diez pruebas doradas cruzadas contra la salida real
  del script sobre la carta de referencia. `casas` queda fuera a propósito:
  depende de la hora exacta, no de un día civil entero. `tzolkin` y
  `numerologia` no entran: siguen en `sin_verificar`.
  Verificado con DOM real (jsdom), no solo a ojo: las siete fichas salen en
  el bloque que les toca, la marca DÉBIL solo en `nakshatra`, y el filtro de
  estado sí actúa quitando una ficha cuando se le fuerza `sin_verificar` a
  propósito. Dos fallos de cross-realm en el propio arnés de pruebas,
  encontrados y corregidos por el camino.
- **`ORBE_PARALELO`, medido — decisión 0024.** Estaba fichado con el valor
  heredado del código (1°) sin contar. Replicado el método de `ORBE` contra
  `herramientas/hoja-de-cielo.mjs`: a 1° no existe el día sin ningún paralelo
  bajo ninguna hora de muestreo probada — no pasa el criterio del propio
  proyecto. Medido con conteo mutuo entre los 10 cuerpos (el mismo cálculo
  que usa el generador, no el que validó `ORBE`): **0,75°**, 3,2
  paralelos/día, 4–5 días vacíos al año, el perfil más parecido al de `ORBE`
  y el más estable frente a la hora de muestreo. De paso, hallazgo anotado en
  `03-registro-de-datos.md`: `ORBE` se validó con tránsitos contra la carta
  de referencia (12 puntos) pero se aplica mutuo dentro de cada carta
  generada (10 puntos) — no invalida la cifra, pero el criterio de origen y
  el de uso no son el mismo cálculo. → `decisiones/0024-orbe-paralelo-medido.md`
  (26 de agosto de 2026) *(numeración por confirmar)*
- **La pantalla `dia` — decisión 0023.** Es pantalla única, reutilizada para
  cualquier fecha del calendario; `calendario` pasa a ser la rejilla de
  navegación. El renderizador de `fuentes.js` debe funcionar para cualquier
  fecha, no solo hoy. La casilla de cierre solo existe cuando la fecha
  mostrada es hoy — en cualquier otro día no aparece, ni deshabilitada, ni
  vacía. Sin casilla no hay puerta que cruzar: **los días pasados se
  muestran enteros**, bloque A y B juntos. El bloque B no es exclusivo de
  hoy, es exclusivo de días ya cerrados. → `decisiones/0023-la-pantalla-dia.md`
  (26 de agosto de 2026) *(numeración por confirmar)*
- **Cuándo y cómo se pide el perfil de nacimiento — decisión 0022.** Se pide
  y se vende como el dato necesario para el calendario lunar personal; el
  segundo uso (curiosidades del origen) no se anuncia, se descubre por su
  sitio. Sin el dato no hay calendario: sin anclaje sustituto ni fecha por
  defecto. Franja de 3h para quien no sabe la hora exacta, sin aviso de
  ambigüedad al elegirla; cuando el orto lunar cae dentro de la franja
  elegida, se muestran las dos fechas de época posibles y elige la persona.
  Verificado con astronomy-engine 2.1.19 sobre ortos reales de Albacete 2026:
  con franjas de 3h, entre el 11% y 16% de los días caen en zona de
  ambigüedad. **Cierra también el pendiente 26** (la época personal), que
  solo esperaba esto. → `decisiones/0022-el-perfil-de-nacimiento.md`
  (26 de agosto de 2026) *(numeración por confirmar)*
- **Vibración y frecuencia, indagado — decisión 0021.** Se hizo la
  indagación de fondo que pedía la ficha: confirmado que vibración y
  frecuencia solo tienen sitio en Umbral como atribución fichada de un
  sistema histórico (Balliett, 1904-1908, nivel 3/4), nunca como dato medido.
  No hay dato externo nuevo que fichar; no se añade nada a
  `05-fuentes-tradiciones.md`. → `decisiones/0021-vibracion-y-frecuencia.md`
  (26 de agosto de 2026) *(numeración por confirmar)*
- **Las noches sin Luna en 2026 — decisión 0020.** La fila «63 ± 2» no tenía
  método. Medida con cuatro definiciones de noche, se sustituye por **«10,
  con criterio vivido (puesta a salida de Sol)»**. Se descarta el criterio
  Civil (25 noches) pese a acercarse más al número original, porque el
  criterio elegido corresponde a la experiencia vivida y no a un umbral
  técnico de iluminación. Con método explícito, pasa a ser prueba dorada en
  `pruebas/luna.test.mjs`. → `decisiones/0020-noches-sin-luna.md`
  (26 de agosto de 2026) *(numeración por confirmar)*
- **El 32, cerrado el 26 de agosto.** Quedaba una entrada de catálogo
  nacional para Balliett. La Library of Congress tiene digitalizada **«How
  to attain success through the strength of vibration» (1917, L. N. Fowler &
  Co.)**, LCCN 27009581, signatura BF1623.P9 B2 1917 — no es la edición de
  1904 ni es autoeditada, pero confirma que Balliett sí está en un catálogo
  nacional. Cierra también la tercera pata del residuo del 15 (Houlding
  quedó confirmada por el colofón de su propio editor de 2006, que declara
  la 1.ª ed. y el ejemplar en la British Library).
- **El bloque del nivel4, aparte del bloque del dato — decisión 0019.** La
  0018 decía que todo nivel4 vive en bloque B, y la prueba que lo comprobaba
  miraba el `bloque` del dato entero. Al escribir el nivel4 real (pendiente
  35), cuatro datos con nivel1-3 en bloque A necesitaron nivel4, y forzar su
  `bloque` a B habría escondido también su explicación básica hasta el cierre
  del día. Se separa en dos campos: `bloque` para nivel1/3/5, `bloque_nivel4`
  —siempre `"B"` cuando hay nivel4— para el nivel4 solo. Ninguna otra prueba
  del fichero se ve afectada; las once pasan. → `decisiones/0019-bloque-del-nivel4.md`
  (26 de agosto de 2026) *(numeración por confirmar contra lo ya guardado en*
  *`docs/decisiones/`)*
- **El mapa de pantallas — decisión 0017.** «Pantalla 5» significaba dos cosas en
  dos decisiones cerradas, porque la 0011 contaba el arranque del sistema y la 0015
  empezaba en la portada. **Las pantallas se nombran por su clave, no por su
  posición**: `portada`, `resumen`, `registro`, `calendario`, `dia`, `medible`. El
  arranque sale de la lista numerada, porque no lo dibujamos nosotras. El resumen
  del día lleva apellido para no volver a confundirse con el resumen personal, que
  no es una pantalla. → `decisiones/0017-el-mapa-de-pantallas.md` (25 de agosto)
- **Los cinco niveles y la quinta clase — decisión 0018.** El nivel 3 y el 4 de la
  0015 eran casi lo mismo —cómo se calcula y de dónde sale— y fundirlos deja sitio
  para **«qué se hacía con esto»: celebraciones y ritos**, sin añadir un sexto
  nivel. Con ello entra la **clase ⑤, práctica humana documentada**, que obliga a
  quién, dónde, cuándo y quién lo documentó. Cuatro reglas la gobiernan: va al
  bloque B y nunca al A; en pasado y en tercera persona, nunca en segunda; se
  cuenta la práctica y jamás su eficacia; y el nivel 5 es especialmente duro aquí.
  **Nace vacío a propósito.** → `decisiones/0018-los-cinco-niveles.md` (25 de agosto)
- **El 33 — la capa de fuentes.** Abierto y cerrado el mismo día.
  **No es una pantalla: es una hoja** que se despliega encima de donde estés, se
  entra tocando la etiqueta del dato y se vuelve al punto exacto. Con eso deja de
  depender del 30 y no toca el mapa de la 0011. Renderizador propio y mínimo, sin
  dependencia y sin build step. **`app/js/fuentes.js` es el original y
  `05-fuentes-tradiciones.md` el derivado** —los datos estructurados se escriben
  como datos, la prosa como prosa—, con prueba dorada que falla si divergen. Todo
  en `PRECACHE`. Los avisos al citar viajan en la ficha pero no se pintan. El
  inglés queda acotado a las cadenas citadas. Y la hoja **está sujeta a la regla de
  no mostrar nada antes de anotar**.
  → `decisiones/0016-la-capa-de-fuentes.md` (25 de agosto de 2026)
  **Y no es una capa nueva:** son los niveles 3, 4 y 5 de la pantalla `dia`, que
  la 0015 ya había diseñado el día anterior. La decisión se reescribió entera al
  darse cuenta. *Escrito ya `app/js/fuentes.js` con diez datos y once pruebas
  doradas verificadas por mutación.* **Renderizador escrito y verificado el 27
  de agosto — ver la entrada de ese día en «Cerradas».** Las fichas sin
  verificar (`tzolkin`, `numerologia`) se resuelven como decía la ficha desde
  el principio: no se muestran.
- **El 15, en sus cuatro fichas — la ronda bibliográfica del 25 de agosto.**
  Rudhyar eran **dos libros** (*The Moon*, McKay, 1946 → *The Lunation Cycle*,
  Servire, 1967 → Aurora, 1986) y el título alternativo sí existía: lo que estaba
  mal era la fecha. Houlding: 1.ª ed. **Ascella, 1998**, ISBN 1-898503-69-9, que
  era su propia editorial. Nakshatra y tithi: **Burgess, JAOS vol. VI, 1860**,
  dominio público, HathiTrust 011604382 — y el tithi queda cerrado *en el texto*,
  con la regla de omisión (*tithikshaya*) incluida. Reingold-Dershowitz: **4.ª ed.,
  Cambridge, 2018**. (25 de agosto de 2026)
- **Los tres estados de verificación.** FUERTE (dos fuentes, una institucional o
  el ejemplar digitalizado) · DÉBIL (una entrada institucional, sale en pantalla
  pero con la marca) · SIN VERIFICAR (no sale). Con dos reglas de desempate: el
  editor manda sobre lo que el libro dice de sí mismo, el catálogo sobre cuándo
  entró en circulación, y cuando discrepan **se escriben los dos**. Y: que algo no
  esté en catálogo no prueba que no exista, prueba que se autoeditó.
  (25 de agosto de 2026)
- **La línea de la vibración.** Se ficha que un sistema *dice* que los números son
  vibración —hecho sobre el sistema, con autora y fecha—; no se ficha que los
  números *son* vibración, que sería un hecho sobre el mundo sin ninguna medida
  detrás. La frase de Tesla no es de Tesla: no está en sus patentes, conferencias
  ni artículos, y la única atribución rastreable llega por un vendedor de placas.
  (25 de agosto de 2026)
- Catálogo de prácticas → `decisiones/0004-catalogo-de-practicas.md`
- Serif definitiva → `decisiones/0003-tipografia-cormorant.md`
- Zona horaria → `decisiones/0001-zona-horaria-del-dispositivo.md`
- Color sin valencia → `decisiones/0002-color-sin-valencia.md`
- El hueco de `zona` → `decisiones/0009-el-hueco-de-zona.md`
- El Compás integrado → `decisiones/0010-el-compas-integrado.md`
- Mapa de pantallas y portada → `decisiones/0011-el-mapa-de-pantallas-y-la-portada.md`
- El calendario personal → `decisiones/0012-el-calendario-personal.md`
- El forzamiento de marea → `decisiones/0013-el-forzamiento-de-marea.md`
- **El 16 — la construcción del registro es una función pura.**
  `app/js/registro.js` con `construirRegistro` y `fechaLocalDe`, doce pruebas
  nuevas y las seis doradas verificadas por mutación. Trece campos, no doce.
  → `decisiones/0014-el-registro-se-construye-aparte.md` (24 de agosto de 2026)
- **Cómo estaba el día, y qué era el punto 14.** No era un campo del registro:
  era una pantalla. `influjo_externo` y `atribucion` salen del proyecto y el
  registro no crece. → `decisiones/0015-como-estaba-el-dia.md` (24 de agosto)
- **La casilla de cierre del día.** Visible desde las 21:00 hasta el final del
  día lunar, y **no se guarda**: es una puerta, no un dato. Por eso el registro
  se queda en trece campos. (24 de agosto de 2026)
- **Los biorritmos y el control de deriva no se muestran nunca.** Ni en un
  bloque ni en otro. Son instrumentos de validación, y un instrumento que se
  enseña deja de poder decir que no. (24 de agosto de 2026)
- **Internacionalización: no se hace.** Solo español, ahora y de momento. El
  código sigue en español, nombres de campo incluidos, que ya era el estado de
  hecho. (22 de agosto de 2026)
- **Los días recientes en "Mi registro":** solo la línea de texto que ya existe.
  Sin fila de días ni rejilla. La forma de enseñar la historia se decide cuando
  se haga el calendario. (22 de agosto de 2026)
- **El 8 — el texto final del Compás.** *Se ha terminado el tiempo, no tú.* al
  llegar al final, y *Cuando quieras.* cuando paras tú. Ver el apéndice de la
  0010. (22 de agosto de 2026)
- **El 9b — la campana de empezar en modo duración.** Mi4, 329,63 Hz. Ver el
  apéndice de la 0010. (22 de agosto de 2026)
- **El 21 — la afinación del Compás fichada.** Las cinco campanas con sus
  frecuencias, volúmenes y colas, las razones que las separan, los parciales, y
  de paso los seis colores del logo, que tampoco estaban escritos en ninguna
  parte. Todo en `03-registro-de-datos.md`. (22 de agosto de 2026)
- **El 25 — `js/luna.js` y el motor astronómico.** El empaquetado se queda como
  está preparado: los dos ficheros en `app/js/` y en `PRECACHE`, con la build
  UMD de 45,6 KB comprimidos y las pruebas cargando exactamente esos bytes. Lo
  que espera es la **pantalla** del contexto medible, que todavía no está
  pensada. El código va listo y no enseña nada hasta que haya dónde.
  (22 de agosto de 2026)
- **Nada de medias en el día lunar.** Cada día lunar lleva la duración que le
  corresponda, calculada de sus dos salidas reales. Las cifras medias que hay en
  `03-registro-de-datos.md` son descriptivas y no entran en ningún cálculo. Lo
  vigilan dos pruebas doradas. Ana: «nada de medias, cada día se pone la
  duración del día lunar». (22 de agosto de 2026)
- **El 12 — coordenadas de Albacete con fuente citable.** AEMET, estación 8178D
  «Albacete, Observatorio»: 39° 00′ 20″ N · 01° 51′ 44″ O · 674 m. Se elige AEMET
  y no un agregador porque es la misma fuente de la línea base climática, así que
  el cielo y el clima se refieren al mismo punto. Fichada, con la incoherencia
  detectada en la propia web de AEMET anotada al lado. (22 de agosto de 2026)
- **El 23 — la rosa junto al nombre.** Se queda. Ana: «me encanta cómo te ha
  quedado, lo vamos a dejar así». **Consecuencia para la v5: hay que corregir la
  frase de la §2** que dice que la marca no se repite junto al nombre; era
  anterior y ya no describe la app. La objeción de la decisión 0005 era la aguja
  roja de la fotografía, no la rosa. (22 de agosto de 2026)
- **El 18b — el rectángulo de `#040618` dentro de los iconos.** Repintados al
  lienzo y puestos en `app/iconos/`. Ver el apéndice de la 0011, sección C.
  (22 de agosto de 2026)

## El 39, desarrollado

> **Cerrado el 29 de agosto de 2026 (commit `6af760b`).** Se dejó lo de
> abajo como estaba, porque es el razonamiento que llevó al arreglo.

`08-hoja-de-ruta-complementaria-23ago.md`, en la tabla «Qué entra en el
fichero» de la especificación cerrada de Lote 3, punto 1:

| Almacén | ¿Entra? | Motivo |
|---|---|---|
| `ultima_copia` | No | Es un hecho de *este* aparato, no de la vida |

En `app/index.html`, la clave `ultima_copia` no existe en ningún sitio —
confirmado por `grep`. La copia de seguridad automática antes de
importar reutiliza `sacarCopia()`, la misma función del botón «Sacar una
copia», con este comentario en el propio código:

> *«La reutiliza también la copia de seguridad automática de traerCopia:
> es la misma acción, disparada por otro motivo.»*

`sacarCopia()` siempre llama a `descargar()`, que siempre dispara una
descarga real vía `URL.createObjectURL` + `<a download>`. Confirmado en
móvil real el 28 de agosto: al importar, el navegador ofrece descargar
`umbral-2026-08-28 (1).json` a la carpeta de Descargas, visible fuera de
la app.

**No se ha tocado el código.** Antes de escribir nada hace falta decidir
si se separan los dos caminos —uno que sigue descargando (para «Sacar una
copia») y otro que solo escribe en IndexedDB bajo una clave real
`ultima_copia` (para la copia automática)—, siguiendo la metodología de
debatir antes de tocar código.
