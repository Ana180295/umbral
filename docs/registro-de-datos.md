# Registro de datos

Toda constante numérica del proyecto vive aquí antes de aparecer en el código.
Sin fila en esta tabla, no se escribe el número.

Motivo: la revisión crítica del dossier señaló que las cifras marcadas `[CALC]`
no eran auditables. Una cifra sin método, versión de librería y fecha de consulta
es una cifra que no se puede reproducir tras cambiar de dependencia.

*Última revisión: 24 de agosto de 2026. **Todo lo que decía «pendiente de
calcular» está calculado**, con astronomy-engine 2.1.19 y el guion que se cita en
cada bloque. Lo que sigue diciendo «pendiente» es lo que depende de una fuente
externa que aún no se ha consultado.*

---

## Lugar

| Constante | Valor | Unidad | Fuente | Método | Consultado |
|---|---|---|---|---|---|
| Latitud de Albacete | 39° 00′ 20″ N = 39,005556 | grados | AEMET, estación 8178D «Albacete, Observatorio» | listado oficial de estaciones, *Estadísticas meteorofenológicas*, datos abiertos AEMET | 2026-08-22 |
| Longitud de Albacete | 01° 51′ 44″ O = −1,862222 | grados | idem | idem | 2026-08-22 |
| Altitud de Albacete | 674 | m | idem | idem | 2026-08-22 |

**Por qué esta estación y no otra.** AEMET tiene dos en Albacete: la 8175
(«Albacete / Los Llanos», base aérea, 702 m) y la 8178D («Albacete,
Observatorio», 674 m). Se elige la del observatorio porque está en la ciudad; la
otra queda unos 5 km al sur. Y se elige AEMET y no un agregador de coordenadas
porque **es la misma fuente de la que va a salir la línea base climática**: así
el cielo y el clima se refieren al mismo punto del suelo.

**Una incoherencia detectada al consultarlo, que queda anotada.** Las páginas web
de AEMET para la estación 8175 muestran, según el día, dos pares de coordenadas
distintos: unas veces 38° 57′ 15″ N / 01° 51′ 23″ O —que son las de Los Llanos en
el listado oficial— y otras 39° 00′ 21″ N / 01° 51′ 46″ O, que son prácticamente
las del observatorio. **El listado de datos abiertos las separa correctamente y
es la fuente que se usa.** Si algún día hay que reverificar esto, es aquí donde
mirar.

*Sensibilidad, para saber cuánto importa:* a esta latitud, 1′ de longitud son
unos 4 segundos en la hora de salida de la Luna. La diferencia entre las dos
estaciones (unos 3′ de latitud) mueve la salida menos de un minuto. O sea que la
elección **no cambia ninguna prueba dorada**, pero la ficha tiene que decir cuál
se usó de todas formas.

---

## Marea

Fórmula y razonamiento completos en `docs/decisiones/0013-el-forzamiento-de-marea.md`.

### Constantes físicas

Se usan los productos **GM** y no G × M por separado: GM está medido con
muchísima más precisión que G a solas, que sigue siendo la constante fundamental
peor conocida de la física.

| Constante | Valor | Unidad | Fuente | Método | Consultado |
|---|---|---|---|---|---|
| GM de la Luna | 4,9028001 × 10¹² | m³/s² | JPL DE440/DE441, Park et al., *Astronomical Journal* 161:105, 2021 | citado | 2026-08-22 |
| GM del Sol (nominal) | 1,32712440018 × 10²⁰ | m³/s² | IAU 2015, Resolución B3 | citado | 2026-08-22 |
| Radio medio de la Tierra | 6,371 × 10⁶ | m | IUGG / GRS80, radio medio R₂ | citado | 2026-08-22 |
| Unidad astronómica | 1,495978707 × 10¹¹ | m | IAU 2012, definición exacta | citado | 2026-08-22 |
| 1 µGal | 10⁻⁸ | m/s² | definición (1 Gal = 1 cm/s²) | — | — |

### Cifras derivadas, todas recalculadas el 22 de agosto

| Constante | Valor | Unidad | Método | Estado |
|---|---|---|---|---|
| Forzamiento lunar máximo, distancia media | **109,98** | µGal | 2·GM☾·R⊕ / r³, r = 384.400 km | **la ficha decía ≈110 · confirmado** |
| Forzamiento solar máximo, a 1 UA | **50,51** | µGal | igual, con los datos del Sol | **la ficha decía ≈50 · confirmado** |
| Ratio de fuerza de marea Sol:Luna | **0,4592** | — | cociente de los dos anteriores | **la ficha decía 0,46 · confirmado** |
| El mismo ratio, por masas y distancias | **0,4592** | — | (M☉/M☾) ÷ (r☉/r☾)³ = 2,707·10⁷ / 5,894·10⁷ | dos caminos, mismo número |
| Envolvente sicigia/cuadratura | **2,699** | — | √(a☾²+a☉²+2a☾a☉·cos 2ε), con ε = 0° y 90° | **la ficha decía ≈2,7 · confirmado** |
| La misma, por amplitudes M₂ y S₂ | **2,692** | — | (0,24+0,11)/(0,24−0,11) | coinciden al 0,3 % |
| Variación perigeo–apogeo | **1,3225** | — | (404.210/368.249)³ | **la ficha decía 1,32 · confirmado** |
| Forzamiento lunar en perigeo | 125,1 | µGal | 2·GM☾·R⊕ / r³ | nuevo |
| Forzamiento lunar en apogeo | 94,6 | µGal | idem | nuevo |
| Amplitud M₂ (modelo de equilibrio) | 0,24 | m | *pendiente de fijar edición* | solo se usa como comprobación cruzada |
| Amplitud S₂ (modelo de equilibrio) | 0,11 | m | *pendiente de fijar edición* | idem |

**La comprobación cruzada del 2,7 es lo más valioso de esta tabla.** El número
sale por dos caminos que no comparten ni las constantes ni las unidades —uno
parte de GM y distancias, el otro de dos amplitudes en metros— y coinciden en
2,699 frente a 2,692. Eso es coherencia interna, no una cita repetida.

### Comportamiento medido de los dos campos

Lo que la decisión 0013 afirmaba, comprobado el 28 de agosto de 2026 sobre
Albacete:

| Afirmación de la 0013 | Medido |
|---|---|
| `marea_mensual` no depende de la rotación: igual a las 10:30 que a las 23:00 | varía un **0,16 %** entre las 08:30 y las 21:00 del mismo día |
| `marea_instantanea` pasa por **dos máximos al día** | exactamente **2** en 24 h |
| — | recorrido de la instantánea ese día: **de −77,8 a +94,0 µGal** |

Valores de la mensual en las cuatro fases de agosto de 2026, con distancia real:

| Fase | Instante UTC | `marea_mensual` |
|---|---|---|
| Cuarto menguante | 6 ago 02:21 | 71,7 µGal |
| Nueva | 12 ago 17:37 | 175,0 µGal |
| Cuarto creciente | 20 ago 02:46 | 47,7 µGal |
| Llena | 28 ago 04:19 | 154,0 µGal |

Nótese que nueva y llena **no dan lo mismo** (175,0 frente a 154,0) aunque las dos
sean sicigia: la diferencia es la distancia de la Luna, y es justamente el 32 %
que la 0013 dijo que no se podía borrar usando la distancia media.

**Modelo de Tierra rígida.** No lleva números de Love ni carga oceánica. Un
gravímetro real mediría algo parecido y no idéntico, y eso hay que decirlo si el
número aparece alguna vez en pantalla.

---

## Luna y calendario

| Constante | Valor | Unidad | Fuente | Método | Consultado |
|---|---|---|---|---|---|
| Mes sinódico medio | 29,530588 | días | Meeus, *Astronomical Algorithms*, 2.ª ed., 1998, cap. 49 | citado | *pendiente de verificar contra el ejemplar* |
| Día lunar medio en Albacete | 24 h 51 min (24,8496 h) | — | medido | media de 353 intervalos salida→salida de 2026 | 2026-08-22 · **descriptiva, no operativa** |
| Día lunar más corto de 2026 | **24 h 22 min** | — | medido | idem | 2026-08-22 |
| Día lunar más largo de 2026 | **25 h 20 min** | — | medido | idem | 2026-08-22 |
| Mediana del día lunar | 24 h 57 min | — | medido | idem | 2026-08-22 |
| Días lunares por lunación | 28,52 | — | derivado | 29,530588 ÷ 1,0354 | 2026-08-22 · **descriptiva, no operativa** |
| Días civiles sin salida de Luna en 2026 | **13** | — | medido | fechas abajo | 2026-08-22 |
| Distancia lunar en perigeo, 6 sep 2026 | 368.249 | km | astronomy-engine | `SearchLunarApsis` | 2026-08-22 |
| Distancia lunar en apogeo, 19 sep 2026 | 404.210 | km | astronomy-engine | `NextLunarApsis` | 2026-08-22 |

### Ninguna de estas dos medias entra en ningún cálculo

**Decidido el 22 de agosto: cada día lunar lleva la duración que le
corresponda, calculada de sus dos salidas reales.** La media de 24 h 51 min y
los 28,52 días por lunación están aquí para saber de qué orden hablamos, y
para nada más. Palabras de Ana: «nada de medias, cada día se pone la duración
del día lunar».

Lo garantiza `diaLunar()` en `app/js/luna.js`, y lo vigilan dos pruebas
doradas: una recorre sesenta días seguidos y falla si aparecen menos de
cuarenta duraciones distintas —eso olería a constante—, y la otra comprueba
que entre el día lunar más corto y el más largo del año sigue habiendo casi
una hora.

**El rango del día lunar es el dato que faltaba.** La decisión 0012 decía que la
duración «varía apreciablemente» y pedía medirlo antes de que ningún número
apareciera en pantalla. Son **58 minutos entre el día lunar más corto y el más
largo del año**. No es un detalle: una rejilla de calendario que dibuje todos los
días lunares del mismo ancho está mintiendo casi una hora.

**Los trece días de 2026 sin salida de Luna en Albacete**, uno por lunación como
predecía la 0012:

```
9 ene · 7 feb · 8 mar · 5 abr · 4 may · 3 jun · 4 jul
4 ago · 4 sep · 3 oct · 1 nov · 30 nov · 29 dic
```

El 9 de enero es el que la §8 pedía como prueba dorada exacta. **Sale.**

*Recordatorio, porque es donde más fácil es equivocarse:* un día sin salida no es
un día sin Luna. Ese día la iluminación se calcula con normalidad y las dos
mareas también. Lo único que falta es el suceso.

---

## Época del calendario personal

| Constante | Valor | Unidad | Fuente | Método | Consultado |
|---|---|---|---|---|---|
| Época personal | *por calcular* | instante UTC | astronomy-engine | última salida de la Luna anterior al nacimiento, en las coordenadas de nacimiento | **falta el perfil de nacimiento** |

Sigue pendiente y **no por falta de método**: el cálculo está escrito y
funciona. Falta el dato de entrada. Anotado en `pendiente.md` 26, y depende
del 20 —cómo se pide el perfil de nacimiento sin que parezca un formulario de
registro—, porque sin fecha, franja y coordenadas de nacimiento no hay época.

### Franjas horarias de nacimiento

Convención propia, no medida. Se escribe aquí porque **el cálculo de la época
depende de estos límites** y no pueden quedar a interpretación.

| Franja | Desde | Hasta |
|---|---|---|
| Madrugada | 00:00 | 06:00 |
| Mañana | 06:00 | 12:00 |
| Mediodía | 12:00 | 15:00 |
| Tarde | 15:00 | 21:00 |
| Noche | 21:00 | 00:00 |

| Constante | Valor | Unidad | Método |
|---|---|---|---|
| Probabilidad de que una franja de 6 h contenga una salida de luna | ≈ 1/4 | — | 6 h ÷ 24 h 51 min |

---

## Sonido del Compás

Ver el apéndice A de `docs/decisiones/0010-el-compas-integrado.md`.

Afinación en La, solo octavas y quintas: sin tercera el acorde no es mayor ni
menor, así que no empuja hacia ninguna emoción y aguanta sesenta repeticiones sin
cansar. Las siete alturas disponibles son las únicas de las que puede salir
cualquier campana futura.

| Momento | Nota | Hz | Volumen | Cola |
|---|---|---|---|---|
| Inspirar | Mi5 | 659,25 | 0,055 | 1,0 |
| Exhalar | La4 | 440 | 0,075 | 1,0 |
| Cambio de lado | La4 | 440 | 0,075 | 1,0 |
| Empezar, en modo duración | Mi4 | 329,63 | 0,050 | 1,0 |
| Final | La3 | 220 | 0,090 | 1,6 |

Razones que las separan: Mi4/La3 = 1,4983 (quinta justa, 7 semitonos) ·
La4/Mi4 = 1,3348 (cuarta justa, 5 semitonos) · La4/La3 = 2 (octava, 12
semitonos, **misma clase de altura**, que es por lo que la campana final lleva
la cola 1,6 veces más larga).

Parciales de la campana, heredados del prototipo: 1 · 2,007 · 3,011 · 4,63, con
ganancias 1 · 0,30 · 0,12 · 0,04 y duraciones base 4,5 · 2,6 · 1,5 · 0,8 s.
Ligeramente inarmónicos: es lo que distingue un cuenco de un pitido de microondas.

---

## Marca

Medidos sobre los PNG el 22 de agosto. No estaban escritos en ninguna parte.

| Elemento | Color |
|---|---|
| Fondo nocturno de la app | `#0A0E19` |
| Cara clara de las puntas de la rosa | `#EDE3C7` |
| Cara malva de las puntas | `#89739F` |
| Rombo central | `#F5A028` |
| Filamentos de la izquierda | `#428E92` |
| Filamentos de la derecha | `#F5A028` |

*Nota histórica, para que nadie la repita:* los iconos llevaban dentro un
rectángulo de `#040618`, el nocturno que la §2 declaraba antes de que los tokens
pasaran a `#0A0E19`. Contraste entre los dos: 1,043 : 1. Corregido el 22 de
agosto. Ver el apéndice C de la decisión 0011.

---

## Herramientas

| Constante | Valor | Unidad | Fuente | Método | Consultado |
|---|---|---|---|---|---|
| Versión de astronomy-engine | 2.1.19 | — | Don Cross, MIT | `package.json` del paquete instalado | 2026-08-22 |
| Dependencias de astronomy-engine | 0 | — | idem | idem | 2026-08-22 |
| Tamaño de la build UMD minificada | 116.424 | bytes | medido | `astronomy.browser.min.js` | 2026-08-22 |
| La misma, comprimida | **45,6 KB** | — | medido | `gzip -9` | 2026-08-22 |
| Tamaño de la build en módulo ES | 412.025 | bytes | medido | `esm/astronomy.js` | 2026-08-22 |
| La misma, comprimida | 105,1 KB | — | medido | `gzip -9` | 2026-08-22 |

Los 45,6 KB comprimidos que fichó la §3 son **de la build UMD**, no de la de
módulos. Es la razón de que se empaquete esa: 296 KB de diferencia en disco no se
pagan por evitar una variable global, y además la UMD se puede cargar con
`require()` desde Node, así que las pruebas doradas ejercitan exactamente los
bytes que se instalan en el móvil.

---

## Lo que sigue pendiente, y de qué depende

| Qué | De qué depende |
|---|---|
| Edición del mes sinódico de 29,530588 | verificar contra el ejemplar de Meeus, 2.ª ed., cap. 49 |
| Amplitudes M₂ = 0,24 m y S₂ = 0,11 m | fijar edición; solo se usan como comprobación cruzada |
| Época personal | que exista el perfil de nacimiento |
| Clave de AEMET OpenData | correo a AEMET |
| **«Noches sin Luna en 2026 = 63»** | **esa fila no tiene método, y el número depende enteramente de cuál sea.** Desarrollado abajo |


---

## Aspectos — los dos orbes de `herramientas/hoja-de-cielo.mjs`

Un orbe no es una medida: es **cuánto margen se le concede a una coincidencia
angular antes de dejar de llamarla coincidencia**. No hay experimento que lo
decida, así que lo que se ficha no es un valor verdadero sino el criterio con el
que se eligió — y aquí el criterio es medible.

| Constante | Valor | Unidad | Fuente | Método | Consultado |
|---|---|---|---|---|---|
| `ORBE` (aspectos eclípticos) | 1 | grados | Criterio propio del proyecto | Conteo sobre un año civil completo contra una carta real, con astronomy-engine 2.1.19 | 2026-08-24 |
| `ORBE_PARALELO` (paralelos de declinación) | 1 | grados | Criterio propio del proyecto | Heredado del valor que estaba escrito a pelo en el código; **sin medir** | 2026-08-24 |

### Por qué 1° y no 3°, que era lo que había

Medido sobre un año completo:

| Orbe | Aspectos por día | Días del año sin ninguno |
|---|---|---|
| 1° | 4,8 | **5** |
| 2° | 10,1 | 0 |
| 3° | 15,9 | 0 |

**Por encima de 1° no hay un solo día del año sin aspectos.** Y un sistema que
nunca calla no puede ser contradicho por los datos: si siempre hay algo que
señalar, la señal no distingue nada. El día vacío tiene que poder existir.

La línea que imprime «ninguno dentro de ese orbe» ya estaba escrita en el
generador desde el principio. Con 3° no se ejecutaba nunca.

### El de los paralelos queda a medias, y se dice

`ORBE_PARALELO` estaba en el código sin nombre, escrito dos veces como `< 1`.
Ahora tiene nombre, pero **el 1° no está medido**: es el valor que había. No se ha
contado cuántos días del año se quedan sin ningún paralelo, así que **no se sabe
si este umbral deja existir el día vacío o no**.

Se ficha con esa carencia escrita en vez de darle el mismo aval que al otro. Un
número heredado y un número medido no valen lo mismo aunque coincidan en el valor.

### El caso de las 63 noches

La §8 pedía «noches sin Luna en Albacete en 2026: 63 ± 2» como prueba dorada.
**No se puede convertir en prueba, porque la fila nunca dijo qué es una noche.**
Medido con cuatro definiciones, contando las noches en que la Luna está bajo el
horizonte durante todo el intervalo:

| Definición de noche | Noches sin Luna en 2026 |
|---|---|
| Astronómica, Sol bajo −18° | **59** |
| Náutica, Sol bajo −12° | 45 |
| Civil, Sol bajo −6° | 25 |
| De puesta a salida de Sol | 10 |

Ninguna da 63, y la más cercana —59— se queda fuera de la tolerancia de ±2. La
definición más permisiva de las cuatro es la astronómica, así que **no hay
ninguna lectura razonable que llegue a 63**.

Lo que esto enseña no es que el motor falle: las otras doce pruebas de la §8
salen, y perigeo y apogeo salen **al kilómetro exacto**. Lo que enseña es que
esa cifra se escribió sin método, que es precisamente lo que este documento
existe para impedir. **Se propone sustituir la fila por: «noches sin Luna en
Albacete en 2026, con noche astronómica (Sol bajo −18°): 59».** Con método
escrito, es una prueba dorada. Sin él, era un número.
