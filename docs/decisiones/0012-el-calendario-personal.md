# 0012 — El calendario lunar personal

**Fecha:** 22 de agosto de 2026 · **Estado:** cerrada en lo estructural
**Depende de:** 0001 (zona horaria) · **Reglas:** 0.1, 0.2
**Cierra:** el bloque abierto de la §18 de la hoja de ruta

## Qué es

Una pantalla propia, **a continuación del cuestionario**. No sustituye al
calendario normal: es complementario. Lleva además un resumen de las tradiciones
tenidas en cuenta para formarlo (ver `docs/notas/tradiciones-lunares.md`).

Y es **personal**: no hay una época compartida por todo el mundo. Cada persona
tiene la suya.

## La unidad: el día lunar

**Un día lunar va de una salida de la Luna a la siguiente.** Dura unas 24 h
50 min de media, no 24 h.

El motivo no es una rareza: mientras la Tierra gira, la Luna ha avanzado en su
órbita, y a la Tierra le hace falta un rato de más para volver a apuntarle. Ese
rato son unos cincuenta minutos, y es lo que hace que la Luna salga cada día más
tarde que el anterior.

Se descartó la otra lectura posible —de la salida a la puesta, el rato que la
Luna está en el cielo—. Eso no es un día: es un periodo de visibilidad, dura
entre nada y unas catorce horas según la época, y deja fuera todas las horas en
que la Luna está bajo el horizonte.

### Consecuencias que hay que dibujar, no esquivar

**Los días lunares no duran todos lo mismo.** Los cincuenta minutos son la
media; la duración real depende de la declinación de la Luna y de la latitud, y
en Albacete varía apreciablemente a lo largo del mes. *(Cuánto exactamente: hay
que medirlo con astronomy-engine y meterlo en `registro-de-datos.md` antes de
que ningún número aparezca en pantalla.)*

**Hay un día civil al mes en el que la Luna no sale.** Como cada día se retrasa
cincuenta minutos, en algún momento del mes la salida cruza la medianoche y un
día civil se queda sin ninguna. Otro se queda sin puesta. No es un fallo del
cálculo: es la geometría, y la rejilla tiene que estar preparada para enseñarlo.

## Los días sin salida: qué se escribe y qué NO

**Un día sin salida de luna no es un día sin Luna.** La Luna sigue ahí, sigue
iluminada —puede estar al 80 %— y sigue tirando exactamente igual. Lo que no
ocurre ese día civil es **el evento**.

Por eso:

```
salida_luna: null          // con el motivo declarado: no ocurre este día civil
iluminacion:  0.81         // se calcula con normalidad
marea_*:      …            // se calculan con normalidad
```

**Poner la iluminación a cero sería escribir un dato falso**, no un dato
ausente. Y ausente tampoco es: la iluminación de ese día se calcula
perfectamente. El hueco está en la columna de la salida, y solo ahí.

## La época: la última salida antes de nacer

**La época de cada persona es la última salida de la Luna anterior al instante
de su nacimiento**, calculada en las coordenadas de su lugar de nacimiento.

«La última anterior» y no «la más cercana»: así el nacimiento cae **dentro** del
día lunar 1, que es lo que tiene sentido, y además no hace falta ninguna regla
de desempate.

### La época no se lee de la base de datos

Se calcula una vez a partir del perfil y se guarda. **Nunca se deriva de los
registros.** Si la época dependiera del primer `checkin`, borrar ese registro
desplazaría el calendario entero, y toda la historia lunar se movería por un
gesto que no tiene nada que ver con el cielo.

## Los datos nuevos que hacen falta

Van a `perfil_local`, el almacén de IndexedDB que ya se crea en la versión 1 y
que hasta ahora estaba vacío. Estaba esperando justo esto.

| Campo | Obligatorio | Nota |
|---|---|---|
| Fecha de nacimiento | sí | |
| Hora de nacimiento | no | exacta o por franja |
| Franja de nacimiento | solo si no hay hora exacta | ver abajo |
| Latitud y longitud del nacimiento | **sí** | la salida de la Luna es local |

**El lugar se pide obligatoriamente.** La salida de la Luna del 3 de mayo en
Albacete no es la misma que en otra ciudad, y usar Albacete para quien nació en
otro sitio daría un calendario mal anclado sin que nada avisara.

### Dos pares de coordenadas, y no son el mismo

Esto es fácil de confundir en el código, así que queda escrito aparte:

| Para qué | Qué coordenadas | Cuándo se usa |
|---|---|---|
| **La época** | Las del **lugar de nacimiento** | Una sola vez, al fijar el día lunar 1 |
| **Las salidas y puestas de cada día** | Las del **lugar donde se vive hoy** (Albacete) | Cada día, siempre |

Usar las de nacimiento para el día a día daría las salidas de un sitio donde ya
no estás. Usar las de Albacete para la época daría un ancla equivocada para
quien no nació aquí. **Son dos campos distintos en `perfil_local`.**

## La hora aproximada: por franjas, y muchas veces exacta igual

Quien no sepa su hora exacta elige una franja. Así no hay que calcular nada y,
sobre todo, **queda registrado cuáles son aproximadas**.

| Franja | Desde | Hasta |
|---|---|---|
| Madrugada | 00:00 | 06:00 |
| Mañana | 06:00 | 12:00 |
| Mediodía | 12:00 | 15:00 |
| Tarde | 15:00 | 21:00 |
| Noche | 21:00 | 00:00 |

Estos límites son una convención y se escriben aquí porque **el cálculo depende
de ellos**. No pueden quedar a interpretación.

### Y aquí está lo bueno: no se supone nada, se calcula

Como solo hay una salida de luna cada 24 h 50 min y una franja dura unas seis
horas, la salida cae dentro de la franja **aproximadamente una de cada cuatro
veces**. Las otras tres, toda la franja está del mismo lado de la salida, y
entonces da igual la hora exacta.

Por eso la app no da nada por supuesto:

- **La franja no contiene ninguna salida** → la época es **exacta**, aunque no
  se sepa la hora. No se avisa de nada, porque no hay nada de lo que avisar.
- **La franja sí la contiene** → es **ambigua**. Se guarda como aproximada y se
  dice **una sola vez** que la cuenta puede estar desplazada un día.

Y una propiedad que conviene saber: **el error no crece**. Si la época se
equivoca de día lunar, se equivoca en ese mismo día para siempre — es un
desplazamiento fijo, no una deriva que empeore. Todo lo que viene después es
exacto.

## El año y la lunación

**El año es la vuelta al Sol desde el nacimiento.** De un cumpleaños
astronómico al siguiente: el instante en que el Sol vuelve a la posición que
tenía al nacer.

Se descartaron las otras dos formas:

| Forma | Por qué no |
|---|---|
| Año de 12 lunaciones (354 días) | Se queda 11 días corto cada vez y se desliza contra las estaciones para siempre. Es la vía islámica, y es legítima, pero no es lo que se quiere aquí. |
| Año de 12 con un decimotercero intercalado | Se mantiene pegado al Sol, pero exige una regla de intercalación **inventada por humanos**, y hay muchas. |

**La vuelta al Sol no pide ninguna convención: solo pide cielo.** El año es
astronómico, las lunaciones son astronómicas, y que unos años quepan doce y
otros trece **no es un desajuste que cuadrar: es el dato**.

Esto tiene además una consecuencia bonita: los años del calendario **son los
años de vida de la persona**.

### En pantalla

```
LUNACIÓN 4 · DÍA 12
```

**El año no se muestra.** Coincide con la edad, y decirle a alguien su edad cada
vez que abre la app es decirle algo que ya sabe. Sigue existiendo por dentro,
porque es lo que determina cuál es la lunación número 1.

La lunación se reinicia en cada vuelta al Sol y va de 1 a 12 o 13. El día es el
día lunar dentro de esa lunación.

*(Nota estructural: una lunación son 29,53 días y un día lunar 1,0347, así que
caben unos 28,5 días lunares en cada lunación. No es entero y nunca lo será. Las
filas de la rejilla no van a cuadrar solas, y eso es exactamente el problema que
llevan resolviendo todos los calendarios lunisolares desde Babilonia. Ver el
inventario de tradiciones.)*

## El límite: esto es una convención, no una causa

**Anclar el calendario al nacimiento es una convención de numeración**, del
mismo tipo que el calendario islámico contando desde la Hégira o el gregoriano
desde una fecha convenida. Elegir un origen no afirma que ese origen influya en
nada.

Mientras se quede ahí, es limpio y no choca con ninguna regla del proyecto.

**Lo que sí lo rompería:** que la app dijera o insinuara, en cualquier pantalla,
que la fase en la que naciste explica algo de cómo estás hoy. Eso ya no sería
una convención sino una causa, y no hay ningún dato que la sostenga.

Palabras de Ana, que quedan aquí porque son mejores que cualquier redacción mía
y porque dichas por ella valen más:

> **«En ningún momento busco influir, quiero que nos preguntemos qué es lo que
> realmente nos influye.»**

## El calendario y los registros no se mezclan

Comparten pantalla; **cada uno conserva su propio reloj**.

- Los registros siguen guardándose con día civil: `fecha_local`, de medianoche a
  medianoche, calculada con `Intl` y la zona del dispositivo.
- El calendario dibuja sus días lunares, que empiezan a la salida de la Luna.

Se ven juntos y **no se mezclan en ningún cálculo**. Es la regla 0.2 en la
pantalla donde es más fácil romperla.

## Las tradiciones: entran las tres familias

Aritméticos puros, astronómicos calculables y observacionales. El inventario
razonado está en `docs/notas/tradiciones-lunares.md`.

**Queda sin resolver**, y va a `pendiente.md`: qué se dibuja cuando una fecha de
la familia observacional no se puede calcular sin que alguien mire el cielo. La
app no puede dar esa fecha sin inventarla; lo honesto es decir que la decide un
observador, y como mucho enseñar la probabilidad de avistamiento con su fuente.

## Lo que hace falta antes de escribir una línea de este calendario

1. La época concreta, calculada con astronomy-engine, con método y fecha de
   consulta, en `registro-de-datos.md`.
2. Latitud y longitud de Albacete —para el día a día— con fuente citable. Ni
   las coordenadas se escriben sin ficha.
3. La duración real medida del día lunar en esa latitud, con su rango.
4. La forma exacta de detectar los días civiles sin salida de luna.
