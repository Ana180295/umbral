# Hoja de ruta complementaria · sesión del 24 de agosto de 2026

Documento de traspaso. Recoge lo cerrado, lo corregido y lo que queda abierto,
para continuar en otra conversación.

Sustituye en lo que se solape a `hoja-de-ruta-complementaria.md` del 23 de
agosto, que **queda desactualizado en tres sitios**: la §3 (los campos nuevos del
registro), la §10 (las tres decisiones del punto 14) y la cuenta de doce campos.

---

## 0 · Las dos fechas que no son cola

Siguen intactas y mandan por encima del orden de lotes:

- **27 de agosto** · fijar las anclas nuevas de 18:00–22:00
- **28 de agosto, por la noche, tras el ancla de las 23:00** · el `push`

> El octavo día del criterio de aceptación de la Fase 0 y el día del cambio de app
> son el mismo. Publicar por la mañana haría que ese octavo día se viviera sobre
> otra app y los ocho dejarían de ser comparables.

Orden de lotes: **3 → 4 → 5 → 0 → 1 → 2 → 6**.

---

## 1 · HECHO · Lote 3, punto 13 — `construirRegistro` pura

**Implementado, probado y con las pruebas verificadas por mutación.**
Ver `docs/decisiones/0014-el-registro-se-construye-aparte.md`.

Ficheros: `app/js/registro.js` nuevo, `pruebas/registro.test.mjs` nuevo, y
`app/index.html`, `app/js/registro-practica.js` y `app/sw.js` modificados.

Suite: **49 → 61 pruebas**.

### Tres cosas que aparecieron al leer el código antes de escribir

**`nada_especial` ya estaba hecho.** El traspaso del 23 lo daba por pendiente y
con prisa —«los registros que se escriben ahora llevan la ambigüedad dentro»— y
no la llevaban. `CUERPO` lo tenía marcado como excluyente y `alternarCuerpo` lo
trataba bien en las dos direcciones desde el principio. La urgencia del punto 13
desaparece; el punto sigue mereciendo la pena por poder probarlo.

**El registro tiene TRECE campos, no doce.** El traspaso decía doce en dos
sitios. La prueba dorada 1 compara la lista exacta, así que escribirla con doce
habría perdido un campo sin testigos.

**Un fallo real, encontrado y cerrado: `practicaElegida` sobrevivía al
registro.** `limpiar()` vacía `campoAccion.value` por asignación, y una
asignación **no dispara `input`**, así que el manejador que borra
`window.practicaElegida` nunca corría. Y si la práctica seguía siendo candidata
para la nueva necesidad, `revisar()` salía por la rama de «la que hay sigue
valiendo» sin tocar nada. Resultado: eliges una práctica a las 10:30, a las 15:30
escribes tu propia acción o ninguna, y se guarda **el id de la práctica de la
mañana**. Misma familia que el hueco de `zona`: plausible, silencioso, permanente.

Cerrado con `window.reiniciarPractica()`, expuesto por `registro-practica.js` al
modo de `window.abrirTemporizador`, y llamado desde `limpiar()`.

---

## 2 · CERRADO · el punto 14 no era un campo, era una pantalla

Ver `docs/decisiones/0015-como-estaba-el-dia.md`.

`influjo_externo` y `atribucion` **salen del proyecto**. El registro no crece.
Con ellos se caen las cinco preguntas que colgaban del punto 14.

Lo que queda en su lugar: la **pantalla 5, «cómo estaba el día»**, con la regla
que la separa de la 6 —*la 6 lleva la magnitud, la 5 lleva el nombre*—, los dos
bloques, los cinco niveles, y la casilla de cierre visible desde las 21:00 hasta
el final del día lunar.

**La casilla solo deriva a la información. No se guarda.** Es una puerta, no un
dato.

Y dos cosas que no se muestran nunca, en ningún bloque: **los biorritmos y el
control de deriva de la lunación media**. Son instrumentos de validación, y un
instrumento que se enseña deja de poder decir que no.

### Orden de pantallas fijado

1. Portada · 2. Resumen · 3. Cuestionario · 4. Calendario personal ·
5. Cómo estaba el día · 6. Contexto medible

---

## 3 · HECHO · ronda de verificación de fuentes

`docs/fuentes-tradiciones.md` reescrito. **Seis puntos cerrados, cinco fichas
corregidas.**

### Cerrados

| | Resultado |
|---|---|
| Origen por defecto del zodiaco | **No hay ninguno.** Se muestran los dos, y se etiqueta también el tropical |
| Cálculo de casas | **PASA.** 0,00000′ en 54 latitudes de −60° a +66°. No hace falta astro.com |
| Coordenadas de Spica | **Verificadas**, y la deriva medida: 0,052″/año → 1,6″ en 31 años contra un ayanamsa de 85.600″ |
| Inscripción UNESCO de los jieqi | **30 de noviembre de 2016**, 11.ª sesión, Adís Abeba |
| Variante de calendario islámico en ICU | **`islamic-civil`**, declarado |
| Cornelius | **Verificado**: 2.ª ed. Wessex 2003, ISBN 1-902405-11-0; 1.ª Arkana 1994 |

### Corregidos — cinco fichas estaban mal

**Tzolk'in.** El artículo de Kennett et al. (*Sci. Rep.* 3, 1597, 2013) existe y
respalda la **familia GMT** frente a alternativas que se separan hasta mil años.
Lo que **no** hace es distinguir 584283 de 584285: son dos días, y un método con
resolución de décadas no puede arbitrar 48 horas. La elección de 584283 se apoya
en **dos** razones, no en tres: la cuenta viva k'iche' y el uso de campo. Las dos
son argumentos de práctica, no de datación física.

*Y la variante desplaza DOS días, no uno. `fuentes-tradiciones.md` decía uno y
`formas-de-dividir.md` decía dos. Corregir el segundo también.*

**Biorritmos.** Fliess sostuvo **23 y 28 días**, planteados como periodicidades
sexuales masculina y femenina. Swoboda no es coautor de la teoría: aparece en la
disputa de plagio de 1903 alrededor de Weininger. **El ciclo intelectual de 33
días no es de ninguno de los dos** — pertenece al modelo popular estadounidense
de los años setenta y su origen no se ha podido establecer.
Importa porque los biorritmos son el control negativo del proyecto: un control
con la procedencia mal escrita no puede sostener lo que se le echa encima.

**Calendario islámico en ICU.** `islamic` a secas **no es el tabular**: equivale
a `islamic-rgsa`, una simulación astronómica que no coincide con la práctica de
ningún país conocido. Y `islamic-tbla` difiere de `islamic-civil` en el **100 %**
de los días. Regla: nunca `islamic` a secas.

**Tithi.** Rango real: de **19 h 59 min a 26 h 47 min**, media 23 h 37 min. Casi
siete horas de recorrido, mejor número que el «varias horas» que había.

**UNESCO.** El «2013» era un error. La fecha que se confunde es **2006**, año de
entrada en la lista **nacional** china, que es otra cosa.

### Numerología — el estado es peor de lo que parecía

Lo único estable es que Julia Seton Sears acuñó la palabra hacia 1912. Para el
primer libro de Balliett circulan **tres años que se contradicen: 1903, 1908 y
1911**, y las únicas fuentes que los dan son sitios comerciales de numerología.
Los títulos que aparecen —*The Philosophy of Numbers* (1908), *Number Vibration
in Questions and Answers* (1911), *The Day of Wisdom* (1917)— **no se han podido
confirmar contra ningún catálogo de biblioteca**.

Detalle nuevo: Juno Jordan era el seudónimo de Juno Belle Kapp, **hija de Julia
Seton**, que empezó con Balliett en 1898 a los catorce años. Las «tres mujeres»
del linaje son madre, hija y maestra.

**Mientras esto siga así, la clase ③ no aparece en pantalla.**

---

## 4 · HECHO · los dos parches de `hoja-de-cielo.mjs`

**El orbe baja de 3° a 1°.** Con 3° no hay un solo día del año sin aspectos, y un
sistema que nunca calla no puede ser contradicho por los datos. La línea «ninguno
dentro de ese orbe» ya existía y no se imprimía nunca; ahora saldrá unos cinco
días al año.

**El orbe de los paralelos se declara.** Estaba escrito a pelo dos veces como
`< 1`: era una segunda constante sin nombre y sin ficha. Ahora es
`ORBE_PARALELO` y entra en `registro-de-datos.md`.

**La numerología pasa de opt-out a opt-in.** Salía por omisión, y una sección de
fuentes marcada entera `[SIN VERIFICAR]` no puede ser el comportamiento por
defecto de nada. Se pide con `"numerologia": true`.

---

## 5 · ABIERTO · por dónde seguir

### Lo inmediato

1. **Reabrir el Lote 3, punto 1 (copia local) con los campos nuevos del
   perfil.** Es lo único que sigue vivo de la §3 del traspaso anterior. Los
   campos son `nombre_completo` (entrada de cálculo, con **fecha del cambio** si
   cambia), `mote` (no entra en ningún cálculo) y `altitud`, más las **once
   convenciones declaradas**. La especificación de la exportación está cerrada
   desde el 23; el código no se ha escrito. `fechaLocalDe` ya existe, que era la
   dependencia que faltaba.
2. **Lote 4** — pantalla del contexto medible (la 6).
3. **Lote 5** — calendario personal (la 4).
4. **Lotes 0, 1, 2, 6.**

### La pantalla 5, cuando le toque

Tres decisiones sin cerrar, todas en la 0015: si es pantalla propia o comparte
sitio con el calendario personal; qué parte de la hoja pasa a pantalla; y cómo se
navega entre los cinco niveles.

### Verificaciones que ya no son investigación

Necesitan el ejemplar o un catálogo de biblioteca:

- **Rudhyar** — editorial, ISBN y 1967 confirmados; el título alternativo *The
  Moon: The Cycles and Fortunes of Life* **no lo sostiene ninguna fuente
  localizada**. Candidato a dato heredado de memoria.
- **Houlding** — 2006, Wessex, ISBN 190240520X, pero consta como **2.ª ed.** y la
  primera sigue sin identificar.
- **Nakshatra y tithi** — vía el *Sūrya-Siddhānta* en la traducción de Ebenezer
  Burgess, *JAOS* vol. 6 (1860), dominio público y digitalizado.
- **Reingold-Dershowitz y Meeus** — edición e impresión, desde el editor.

### Correcciones pendientes en documentos

- `formas-de-dividir.md`: 584285 desplaza **dos** días, no uno; y la razón 1 del
  tzolk'in hay que reescribirla igual que en `fuentes-tradiciones.md`.
- `hoja-de-ruta.md` §2: la rosa va al lado del nombre, no como elemento aparte.
- `pendiente.md`: retirar `influjo_externo` y `atribucion` del bloque D.
- `inventario-de-datos.md`: lo mismo, y corregir doce → trece campos.
- `registro-de-datos.md`: fichar `ORBE` y `ORBE_PARALELO`.

---

## 6 · Reglas nuevas que valen para todo el proyecto

**Que una prueba pase no demuestra que la prueba sirva.** Hay que romper el
código a propósito y ver si se pone roja. Esta sesión: seis mutantes, seis
muertos. El mutante que ignora la zona horaria **pasa la prueba de la 01:30 en
Madrid**, porque la zona del portátil coincide con la esperada — lo caza otra
prueba que compara Kiritimati con Niue sobre el mismo instante. Sin ella, la
prueba de la 01:30 habría sido un control que solo mira donde la respuesta es
obvia. Es la lección de Campano aplicada al código propio.

**Un modelo de lenguaje no es una fuente bibliográfica.** Preguntar por el año de
una primera edición produce un año: sonará exacto, vendrá con ISBN y con número
de páginas, y no habrá forma de distinguir el recordado del reconstruido. Es la
regla 0.1 rota de la peor manera, porque no deja hueco visible. Las citas se
cierran contra catálogo de biblioteca, registro del editor o dominio público.

**Cuando se cambia el camino por donde pasan los datos, hay que demostrar que no
cambian los datos.** El camino nuevo del registro se comparó con el viejo en tres
casos y produce el mismo objeto byte a byte. Sin esa comprobación, una refactor
puede alterar lo guardado sin que nadie lo note durante meses.

**Un dato sin fuente no puede ser el comportamiento por omisión.** Es lo que
cambia la numerología de opt-out a opt-in, y es generalizable: lo dudoso se pide,
no se emite.

---

*24 de agosto de 2026.*
