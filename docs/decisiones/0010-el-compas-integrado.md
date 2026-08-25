# 0010 — El Compás integrado: dos modos, no uno degradado

**Fecha:** 22 de agosto de 2026 · **Estado:** cerrada
**Depende de:** 0008 (el nombre) · **Relacionada con:** §15 de la hoja de ruta
*Ampliada la misma noche con el apéndice de integración, que cierra los dos
huecos que este documento dejaba abiertos. Nada de lo anterior se suprime.*

## Contexto: tres cosas medidas antes de decidir nada

**Una.** El Compás tiene que abrir en 37 prácticas, no en 3. Contado sobre
`app/contenido/practicas.json`, versión 1, 100 prácticas:

| Tipo de pauta | Cuántas | ¿Abre el Compás? |
|---|---|---|
| `respiracion` | 3 | sí |
| `duracion` con `lados` | 6 | sí |
| `duracion` sin `lados` | 28 | sí |
| `repeticiones` | 21 | no — no hay segundos que contar |
| sin pauta (`null`) | 42 | no |

Hoy `abreTemporizador` devuelve `true` solo para `respiracion`. La §15 y la
decisión 0008 obligan a las 34 de duración. **De 3 a 37 no es un ajuste: es doce
veces más presencia en pantalla**, y cambia lo que el Compás tiene que ser.

**Dos.** El prototipo `herramientas/temporizador-respiracion.html` no es un
temporizador: es un instrumento de respiración. Todo su sonido sale del ciclo
respiratorio — el filtro paso bajo abre de 320 a 1750 Hz al inspirar y cierra al
exhalar, la campana suena en cada giro (Mi5 al inspirar, La4 al exhalar), y la
onda dibujada usa la misma curva media coseno que el filtro. **Quítale la
respiración y no queda instrumento: queda un bordón de La sostenido en el aire.**

**Tres.** Las 28 prácticas de duración simple van de 20 a 600 segundos. Un
bordón de diez minutos sería lo contrario de bajar estímulos.

## La decisión

**El Compás tiene dos modos declarados. No es un modo con la respiración
apagada: son dos cosas distintas que comparten nombre.**

### Modo respiración — 3 prácticas

El prototipo entero, tal y como está: acorde fijo en La, solo octavas y quintas
sin tercera; bordón grave; filtro paso bajo que abre al inspirar y cierra al
exhalar; reverberación de convolución fabricada al vuelo con ruido que decae;
campana de parciales inarmónicos en cada giro; onda dibujada.

### Modo duración — 34 prácticas

**Sin bordón y sin sonido continuo. Solo campanas.** Una al empezar, una a la
mitad si hay `lados`, una al final.

En pantalla no hay onda de respiración: va **la imagen del logo, o un círculo
con el temporizador**.

Alternativas descartadas, y por qué se descartan por escrito y no por olvido:

- **Bordón fijo sin respirar.** Sonido de fondo que no dice nada. El bordón
  tiene que seguir significando «esto va con tu aliento», y si suena también
  cuando no hay aliento, deja de significarlo.
- **Bordón con un latido lento propio.** Lo prohíbe la decisión 0008: sería un
  metrónomo, y esa decisión dice expresamente que el nombre no lo autoriza.
- **Silencio total con una campana al final.** Cumple la §15 al pie de la letra,
  pero durante 45 segundos parece que la app se ha colgado.

## Las campanas

| Momento | Nota | De dónde sale |
|---|---|---|
| Inspirar | Mi5 · 659,25 Hz | ya existe en el prototipo |
| Exhalar | La4 · 440 Hz | ya existe en el prototipo |
| Cambio de lado | La4 · 440 Hz | el mismo que exhalar: también es un giro |
| Final | La3 · 220 Hz | una octava más grave, **una sola vez** |
| Empezar, en modo duración | **Mi4 · 329,63 Hz** | cerrado en el apéndice |

**El hueco de la campana de empezar** *(cerrado el 22 de agosto; se conserva el
planteamiento porque explica por qué la respuesta es la que es).* El modo
duración lleva una campana al arrancar, y en la sesión no se dijo cuál. No se
elige por defecto: si fuese La4, el arranque sonaría igual que el cambio de
lado; si fuese La3, igual que el final. Lo más probable es que tenga que ser una
nota que no se use en ningún otro sitio, o ninguna campana en absoluto y que el
arranque sea silencioso. **→ Ver el apéndice.**

El final tiene que sonar distinto del cambio de lado, o el oído no distingue
«gira» de «para» — y el Compás existe justamente para poder tener los ojos
cerrados. Dos toques dirían «otra vez».

**Provisional a propósito.** Ana: «probamos como propones a ver qué tal suena,
seguimos buscando sonidos armoniosos». Se afina de oído después de la ventana 2.

## El sonido arranca apagado

El conmutador abre en **«Sonido: desactivado»**. Lo enciende la persona.

Esto **invierte** el prototipo, que hoy arranca con `sonando = true` y
`aria-pressed="true"`. Hay que cambiar las dos cosas.

Motivo de Ana: el ejercicio se empieza mirando la pantalla, y hay que dejar que
la persona se adapte a los sonidos y al ritmo — sobre todo en las de respirar.
El sonido entra cuando ella quiere que entre, no cuando se abre la capa.

## Vive en una capa completa

Cuando se pulsa «Probar», el formulario está a medio llenar y el botón
`Guardar` queda más abajo. Si el Compás se desplegase en línea, empujaría el
botón fuera de la pantalla y a los noventa segundos habría que volver a
buscarlo. En capa, el formulario se queda intacto detrás y al cerrar se vuelve
exactamente donde se estaba.

Requisitos, no adornos:

- foco atrapado dentro de la capa mientras está abierta
- `Escape` cierra
- al cerrar, el scroll vuelve al bloque de la práctica

Ana lo marca como prueba: «vamos a probar con capa completa, a ver qué tal
funciona». **Revisable después del 28.**

## Al terminar

- **No pregunta nada.** `accion_resultado` sigue en `null`, como manda la §4.
  Preguntar aquí sería pedir un resultado a alguien que acaba de exhalar.
- **No se cierra sola.** Nunca hay cierre automático: cierra la persona.
- El mensaje final deja de ser «Hecho.» y pasa a ser más cálido. **Redactado en
  el apéndice.**

## El interruptor de silencio del iPhone

Se mantiene la frase que ya tiene el prototipo en el pie: en iPhone, el
interruptor lateral apaga este sonido, y si no se oye nada es eso.

**No se añade vibración.** Es un canal nuevo, con sus propias implicaciones, y
necesitaría su propia decisión. No está escrita en ninguna parte del proyecto.

## Dónde vive el código

`app/js/compas.js`. Expone `window.abrirTemporizador(pauta)`.

**El gancho ya existe y no hay que tocarlo.** `registro-practica.js`, línea 160,
llama a esa función si está definida y no hace nada si no lo está. Por eso hoy
pulsar «Probar» en una práctica de respiración no abre nada: la función todavía
no existe. Basta con que exista.

Consecuencias obligatorias, no opcionales:

- **el fichero entra en `PRECACHE`** de `app/sw.js`
- **`VERSION` sube**, de `'2026-08-21e'` a la fecha del cambio
- la prueba dorada `pruebas/precache.test.mjs` avisa si se olvida lo primero

Sin eso, el fallo es silencioso y tarda semanas en aparecer: funciona en el
móvil mientras haya cobertura, y falla el día que no la hay.

## Lista de lo que hay que tocar al integrar

1. `seleccion.js` · `abreTemporizador`: de `respiracion` a `respiracion` +
   `duracion`.
2. `pruebas/seleccion.test.mjs` línea 151 · «solo las de respiración abren el
   temporizador»: **se actualiza a sabiendas**, no se borra. Es lo que manda la
   §15 cuando una decisión cambia una regla probada.
3. La prueba «frotarse las orejas no lleva temporizador» **no se toca**:
   `frotar_orejas` tiene `pauta: null`, así que sigue siendo verdad.
4. Duración total cuando hay `lados`: **`segundos × lados`**. `lados` es un
   número (vale `2` en las seis), no un booleano. `textoDePauta` funciona hoy
   por casualidad, porque `2` es *truthy*.
5. Sacar del prototipo las dos fuentes incrustadas en base64: son 37 KB de un
   fichero de 56, y en `app/` la tipografía ya está en `fuentes/`.
6. Corregir «Ritual Lunar» en la cabecera de `registro-practica.js`. Se le
   escapó al `git grep` de la 0007 porque el fichero es posterior.

## Una nota sobre los colores

El prototipo usa `--crema` (`#F2E9D8`) y `--malva` (`#C6A6C4`), que son los dos
arcos de la trama del logo. La decisión 0005 reserva esos colores frente a las
**familias de datos**, no frente a la interfaz, así que este uso es legítimo. Se
escribe aquí para que dentro de un año nadie tenga que deducirlo.

---

# Apéndice de integración — 22 de agosto de 2026

*Escrito al integrar el módulo. Cierra los dos huecos que el cuerpo de esta
decisión dejaba abiertos —el 8 y el 9b de `pendiente.md`— y anota cuatro cosas
que solo aparecieron al escribir el código.*

## A. La campana de empezar: Mi4 · 329,63 Hz

**El problema no era elegir una nota bonita: era de cardinalidad.** Hay tres
turnos que distinguir —empieza, gira, para— y solo había dos alturas asignadas.

El acorde del instrumento tiene exactamente dos clases de altura, porque solo
usa octavas y quintas sobre La:

| Clase | Frecuencias disponibles |
|---|---|
| **La** | 55 · 110 · 220 · 440 |
| **Mi** | 164,81 · 329,63 · 659,25 |

Cualquier nota fuera de esas dos sería la primera nota ajena al instrumento, y
ahí es donde un aviso empieza a sonar a alarma. Así que la elección estaba
acotada a siete valores desde el principio.

Dentro de esa retícula, las distancias entre las tres campanas:

| Par | Razón | Intervalo | Riesgo de confusión |
|---|---|---|---|
| La4 (gira) / La3 (para) | 2:1 | octava | **alto — misma clase de altura** |
| Mi4 (empieza) / La4 (gira) | 4:3 | cuarta justa | bajo |
| Mi4 (empieza) / La3 (para) | 3:2 | quinta justa | bajo |

*(Las razones se comprueban: 329,63 ÷ 220 = 1,4983, que es la quinta justa de
1,5 con el redondeo del temperamento igual; 440 ÷ 329,63 = 1,3348 frente a la
cuarta justa de 1,3333.)*

**La octava es el intervalo que el oído funde:** La4 y La3 *son la misma nota*
en clases de altura, y lo único que las separa es el registro. O sea que el par
ya decidido —gira y para— es el más confundible de los tres. Meter el arranque
también en la familia La habría dado tres campanas de la misma nota en tres
octavas, que es un patrón de aviso.

Mi4 rompe eso sin salirse del acorde, y deja un contorno que cierra bien:
**Mi4 abre a media altura → La4 levanta una cuarta en el giro → La3 cae a la
fundamental del bordón.** La última nota es la fundamental de la que cuelga
todo el instrumento, y eso es lo que hace que un final suene a final.

**Por qué esto no suena a sirena.** Una sirena es alternancia de dos alturas
próximas, sostenida y a volumen constante. Aquí hay golpes únicos, separados
por entre 30 y 600 segundos, con parciales inarmónicos que decaen, y todos del
mismo acorde. Ninguna de las tres condiciones se cumple.

### La cola de la campana final

Segundo canal de distinción, para no depender solo de la altura: **la campana
final multiplica por 1,6 la duración de todos sus parciales.** «Para» resuena;
«gira» no. No cuesta ninguna nota nueva y refuerza justo el par que la tabla de
arriba señala como el más débil.

### La afinación completa, tal como queda en el código

| Momento | Nota | Hz | Volumen | Cola |
|---|---|---|---|---|
| Inspirar | Mi5 | 659,25 | 0,055 | 1,0 |
| Exhalar | La4 | 440 | 0,075 | 1,0 |
| Cambio de lado | La4 | 440 | 0,075 | 1,0 |
| Empezar (duración) | **Mi4** | **329,63** | **0,050** | **1,0** |
| Final | La3 | 220 | 0,090 | **1,6** |

Parciales de cada campana, heredados del prototipo: 1 · 2,007 · 3,011 · 4,63,
con ganancias 1 · 0,30 · 0,12 · 0,04 y duraciones base 4,5 · 2,6 · 1,5 · 0,8 s.
Ligeramente inarmónicos: es lo que distingue un cuenco de un pitido de
microondas.

**Esta tabla tiene que migrar a `registro-de-datos.md`**, que es donde vive toda
constante. Hoy está aquí y en el código. → `pendiente.md` 21.

## B. La campana final suena también al respirar

La tabla del cuerpo de esta decisión dice «Final · La3 · una sola vez» sin
restringir el modo, y al integrarlo se confirma que aplica a los dos.

**Motivo:** sin ella, el último sonido de una respiración es el La4 de exhalar,
que es el mismo que ha sonado seis veces durante el ejercicio. Con los ojos
cerrados no hay forma de saber si aquello era el último ciclo o venía otro. La3
con la cola larga cierra la frase.

Cuesta una campana en tres prácticas. Ana: «decide tú las notas y cuando lo
pruebe si hace falta lo corregimos». Queda en `pendiente.md` 9 como revisable.

## C. Los dos textos de cierre

Hay **dos**, no uno. Se descubrió al leer el prototipo: el mensaje de parar
voluntariamente era «Parado.», tan seco como el «Hecho.» del final.

| Cuándo | Texto |
|---|---|
| Llega al final | ***Se ha terminado el tiempo, no tú.*** |
| Paras tú a mitad | ***Cuando quieras.*** |

Se descartaron *Ya está.*, *Hasta aquí.*, *Quédate lo que quieras.* y *Ya puedes
soltar la cuenta.* La elegida para el final es la que más dice y la única que
nombra expresamente lo que se acaba —el tiempo— y lo que no. Riesgo asumido y
escrito: **es una frase con ingenio, y el ingenio cansa a las sesenta veces.**
Si cansa, se cambia; son dos constantes en la cabecera de `compas.js`.

Ninguna de las dos felicita, promete resultado ni pregunta nada. La §10 y la
regla 4 siguen intactas.

## D. Dónde va la cuenta atrás en modo duración

**Dentro del círculo, no debajo.** Decidido al ver la primera versión, que lo
ponía en la línea de abajo y dejaba el círculo vacío.

Consecuencias:

- En duración **sin lados**, la línea grande de debajo queda vacía mientras
  corre: la instrucción es el número, y repetirlo debajo sería decir dos veces
  lo mismo. La §7 se cumple igual —el elemento más grande sigue siendo la
  instrucción— solo que la instrucción aquí es una cifra.
- En duración **con lados**, el círculo lleva el reloj y debajo va la palabra:
  *Un lado* · *El otro*.
- El círculo enseña la duración total **antes** de empezar. No es un cero ni un
  hueco: es un dato que ya existe.
- El reloj se escribe a la vez en el anillo y en el disco quieto, aunque solo
  uno esté visible. Si no, encender el movimiento a media sesión enseñaría un
  número viejo durante un fotograma.

## E. Cuatro cosas menores que aparecieron al escribir el código

1. **El mando de movimiento cambia de nombre según el modo:** «Onda» al
   respirar, «Anillo» en duración. La §7 exige que el conmutador diga el estado
   de algo concreto, y no hay una sola cosa que se mueva en los dos modos.
2. **El texto de la práctica se lee del DOM**, de `#practica-texto`. El gancho
   solo pasa la pauta y esta decisión dice que el gancho no se toca, así que era
   eso o no enseñar en la capa qué estás haciendo.
3. **Los estilos se inyectan desde el propio módulo.** La app no tiene
   `css/tokens.css` —las variables viven en `index.html`— y partir el Compás en
   dos ficheros añadiría otra entrada que mantener a mano en `PRECACHE` sin
   ganar nada.
4. **Se carga como `<script type="module">`.** Como script clásico, sus
   constantes de nivel superior compartirían ámbito global con las del
   `<script>` de `index.html`. El orden frente a `registro-practica.js` da
   igual: `abrirTemporizador` se busca dentro de un manejador de `click`, no al
   cargar.

## F. Reloj de reserva

Si el navegador no da `AudioContext`, el Compás **funciona igual y en silencio**,
contando con `performance.now()`. No se muestra ningún error: no hay sonido, que
es una carencia real, pero los turnos y la cuenta atrás siguen siendo ciertos.
