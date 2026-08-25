# 0014 · El registro se construye aparte

**Fecha:** 24 de agosto de 2026
**Estado:** cerrada e implementada
**Relacionada con:** decisión 0009 (el hueco de `zona`), reglas 0.1 y 0.2

---

## El problema

El objeto que se guarda en `checkins` se armaba dentro del manejador del botón
«Guardar», en línea, mezclado con `crypto.randomUUID()` y `new Date()`. Eso lo
hacía imposible de probar sin navegador.

Y así se produjo el fallo de la 0009: **`zona` se calculaba, se enseñaba en
pantalla y no se escribía en disco, durante siete días.** No hubo error, ni aviso,
ni nada rojo. Lo que no se escribe no avisa.

## La decisión

`app/js/registro.js` con dos funciones puras:

```js
construirRegistro(entradas, contexto)   // contexto = { id, timestamp, zona }
fechaLocalDe(timestamp, zona)
```

Ni `crypto.randomUUID()` ni `Date.now()` entran dentro: son impuras y harían la
función imposible de probar. `fechaLocalDe` **sí** va dentro, porque es
determinista, y es la misma función que usará el módulo de la copia local
(Lote 3, punto 1).

## Las cuatro reglas del fichero

**1 · Los trece campos siempre, con `null` donde no haya nada.**
`undefined` desaparece al serializar, y entonces «no lo anoté» y «este campo no
existe» se escriben igual. Ausente es `null`, **nunca `0`** y nunca cadena vacía.

> Son **trece**, no doce. El traspaso del 23 de agosto decía doce en dos sitios
> y el objeto real tenía trece. La discrepancia la encontró la prueba dorada 1
> antes de que llegara a importar.

**2 · La lista de campos se escribe a mano en la prueba**, y no se importa de la
constante `CAMPOS` del módulo. Un solo sitio que editar es un solo sitio donde
equivocarse sin testigos. Se comprueba exactamente: ni uno de menos ni uno de más.

**3 · Un valor imposible lanza; no se degrada.** Convertir un `descanso: 7` en
`null` fabricaría un «no lo anoté» a partir de un fallo: quedaría un registro
válido, guardado, permanente y falso. La pantalla conserva lo escrito:

> *No se ha podido guardar este registro. Lo que has escrito sigue aquí.*

**4 · `zona` ausente lanza, no se degrada a `null`.**
Un registro nuevo sin zona sería el hueco de la 0009 abierto otra vez, esta vez
sin la excusa de que nadie lo sabía. Los registros del 21 al 27 de agosto se
quedan sin ella y **el hueco no se rellena nunca** — pero eso es sobre el pasado,
no un permiso para el futuro.

## Cómo se carga

`registro.js` es un módulo ES con `export function`, igual que `seleccion.js`, y
se asoma a `window` al final, igual que `compas.js` con `abrirTemporizador`. En
Node no hay `window`, así que al importarlo desde las pruebas ese bloque no hace
nada y el módulo sigue siendo puro donde importa.

Si el módulo no cargara, el botón **no improvisa un objeto a mano**: dice que no
se ha podido guardar y para.

## Las pruebas, y por qué no basta con que pasen

Doce pruebas en `pruebas/registro.test.mjs`, seis de ellas doradas. Pero pasar no
demuestra nada por sí solo: Campano pasó el control «la cúspide 1 es el
Ascendente» con error exactamente cero teniendo la casa 2 a medio cielo.

Así que el código se rompió a propósito seis veces y se comprobó que cada rotura
pone la suite roja:

| Mutante | Pruebas rojas |
|---|---|
| No escribe `zona` | 2 |
| `fechaLocalDe` usa la zona del aparato | 1 |
| Degrada un 7 a `null` | 1 |
| `senal_corporal` vacía se vuelve `null` | 1 |
| Campos sin contestar como `undefined` | 1 |
| `fecha_local` con `toISOString()` | 2 |

Corridas con `TZ=Europe/Madrid`, que es la máquina real. **El mutante 2 pasa la
dorada 4 bajo Madrid**, porque la zona ambiente coincide con la esperada: lo caza
la dorada 3, comparando `Pacific/Kiritimati` con `Pacific/Niue` sobre el mismo
instante. Sin esa comparación, la dorada 4 habría sido un control que solo mira
donde la respuesta es obvia.

## Que no cambia ningún dato

Comprobado aparte: el camino nuevo produce **exactamente el mismo objeto** que el
viejo en tres casos —registro completo, una sola escala, y `nada_especial`—.
La migración no altera nada de lo ya guardado ni de lo que se guarde igual.

## Lo que no entra

`senal_corporal` ya distinguía `["nada_especial"]` de `[]` **desde el primer
día**: `CUERPO` lo tenía marcado como excluyente y `alternarCuerpo` lo trataba
bien en las dos direcciones. El traspaso del 23 de agosto lo daba por pendiente y
con prisa. No lo estaba. Lo único que se añade es que la regla de exclusión ahora
también se comprueba en el módulo, y no solo en la pantalla.
