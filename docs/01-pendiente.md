# 01 · Pendiente de decidir

> Regla 1 de la hoja de ruta: si algo no está decidido, se pregunta antes
> de inventarlo. Este archivo es el sitio donde vive esa lista.
> Cuando algo se decide, sale de aquí y entra en `docs/decisiones/`.

*Última revisión: 24 de agosto de 2026. Se cierran el 16 y parte del 15; entran
el 30, el 31 y el 32.*

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
| 13 | Rejilla del calendario: una lunación no tiene un número entero de días lunares —son 28,52— y **cada día lunar se dibuja con su duración real**, nunca con una media. Entre el más corto y el más largo de 2026 hay **58 minutos** | Calendario |
| 14 | Qué se dibuja para la familia observacional de calendarios | Calendario |
| 15 | **Parcial.** Verificar la bibliografía edición por edición. El 24 de agosto se cerraron seis fichas y se corrigieron cinco en `05-fuentes-tradiciones.md`. Lo que queda necesita el ejemplar o un catálogo de biblioteca, no otra búsqueda: **Rudhyar** (el título alternativo *The Moon: The Cycles and Fortunes of Life* no lo sostiene ninguna fuente localizada), **Houlding** (consta como 2.ª ed.; falta la primera), **nakshatra y tithi** (vía Burgess, *JAOS* vol. 6, 1860, dominio público) y **Reingold-Dershowitz y Meeus** | Antes de publicarla en la app |
| 17 | Reequilibrio del catálogo: `conectar` (8) y `salir` (10) tienen muy pocas prácticas | No bloquea |
| 18 | Icono de 512 con un render más nítido de la brújula, para el arranque del sistema | No bloquea |
| 19 | Aislamiento real de IndexedDB mediante dominio propio (ver 0007) | No bloquea |
| 20 | Cuándo y cómo se pide el perfil de nacimiento sin que parezca un formulario de registro | Calendario |
| 22 | Revisar la capa completa del Compás tras usarla. Ana la marcó como prueba, no como decisión firme | Después del 28 |
| 24 | **La fila de «63 noches sin Luna» de la §8 no tiene método**, y ninguna definición razonable llega a 63. **Pendiente de revisar**, no de aplicar: la sustitución que se propone abajo no se toca hasta que Ana la mire | Redacción de la v5 |
| 26 | **La época personal del calendario.** El cálculo está escrito y funciona; falta el dato de entrada. Depende enteramente del 20 | Calendario |
| 27 | Verificar contra el ejemplar la edición del mes sinódico (Meeus, 2.ª ed., cap. 49) y de las amplitudes M₂ = 0,24 m y S₂ = 0,11 m. Las dos amplitudes solo se usan como comprobación cruzada del 2,7 | No bloquea |
| 28 | **Correcciones que la hoja de ruta v5 tiene que absorber.** Desarrollado abajo | Redacción de la v5 |
| 30 | **La pantalla 5, «cómo estaba el día».** La decisión 0015 cierra la forma; quedan tres cosas: si es pantalla propia o comparte sitio con el calendario personal, qué parte de `hoja-de-cielo.mjs` pasa a pantalla, y cómo se navega entre los cinco niveles sin que el 1 parezca un resumen de lo de abajo | Después del Lote 5 |
| 31 | **`ORBE_PARALELO` está fichado pero sin medir.** El 1° es el valor heredado del código, no uno contado. No se sabe si deja existir el día vacío. El de los aspectos eclípticos sí está medido: cinco días al año sin ninguno | No bloquea |
| 32 | **Numerología: sin fuente primaria y con las fechas en conflicto.** Circulan 1903, 1908 y 1911 para el primer libro de Balliett, y las únicas fuentes son comerciales. Mientras siga así, la clase ③ no aparece en pantalla y `hoja-de-cielo.mjs` la pide explícitamente | Bloquea la clase ③ |
| 29 | Retirar los dos prototipos ya integrados de `herramientas/`: `temporizador-respiracion.html` y `portada.html`. El segundo guarda las tres frases descartadas de la portada, así que antes hay que decidir dónde viven esas | No bloquea |

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

## Cerradas

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
