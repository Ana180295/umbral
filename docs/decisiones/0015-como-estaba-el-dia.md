# 0015 · Cómo estaba el día

**Fecha:** 24 de agosto de 2026
**Estado:** cerrada la forma; la implementación no ha empezado
**Relacionada con:** decisión 0012 (calendario personal), regla 0.2, hoja de ruta §10

---

## Lo primero: el punto 14 no era lo que decía ser

El punto 14 del Lote 3 estaba escrito como **dos campos nuevos del registro**:

```
influjo_externo    1–5 o null
atribucion         texto libre, o []
```

No lo es. Es **una pantalla**: un sitio al que se entra por curiosidad, para ver
cómo estaba el día astronómicamente, por tradiciones y por numerología.

**Los dos campos salen del proyecto.** Con ellos se caen todas las preguntas que
colgaban: cómo se llama el bloque, si aparece en los tres registros, el umbral
para convertir una palabra en botón, la normalización de las palabras, y si la
escala entraba en el filtro de prácticas. No había bloque.

**El registro no crece.** `nota_libre` se queda como está y **sin botones,
nunca** — el día que la app pinta un botón que dice «Luna», todos los datos
posteriores están contaminados por ese botón.

## El orden de las pantallas

1. Portada
2. Resumen
3. Cuestionario — introspección y ejercicio ajustado al momento
4. Calendario personal
5. **Cómo estaba el día**
6. Contexto medible

## La línea que parte la 5 de la 6

> **La 6 lleva la magnitud. La 5 lleva el nombre.**

El jieqi de hoy es 165°: eso es un ángulo, va a la 6, y está disponible todo el
día. Que ese tramo se llame *Chushu* y quiera decir «fin del calor» es historia
de la lengua, y va a la 5.

Es la regla de «solo los datos medibles» llevada al detalle, y parte datos por
dentro:

> `iluminación 97,3 %` es una medida.
> `fase Balsámica` es la misma medida con una palabra que describe un ánimo.

El tithi 19 y la fase «Llena» son el mismo 222,718° con dos rejillas, y solo una
de las dos sugiere cómo estás.

## Los dos bloques de la pantalla 5

Tres condiciones. Bloque A —disponible siempre— solo si las pasa las tres:

1. O no cambia hoy, o cambia y es una magnitud sin nombre.
2. No nombra un estado ni una cualidad.
3. No relaciona el cielo de hoy contigo.

| Bloque | Qué lleva |
|---|---|
| **A · siempre** | Los nombres de lo natal: signos, casas, número del nombre |
| **B · al cerrar el día** | Los nombres del día: fase, tzolk'in, horas planetarias, y **los aspectos del día con lo natal** |

**Lo natal es seguro no porque no influya, sino porque influye igual todos los
días.** Un sesgo constante no puede fabricar correlaciones falsas. Lo del día sí,
y la relación entre los dos es donde vive el riesgo entero.

## Lo que no entra en ningún bloque

**Los biorritmos y el control de deriva de la lunación media no se muestran
nunca.** No es una preferencia estética.

Los biorritmos son el **control negativo del proyecto**: sirven precisamente
porque cruzarlos con los registros no puede dar nada, y por eso permiten detectar
un método de análisis roto. En el momento en que la app enseña «hoy tu curva
emocional está baja», el control deja de poder decir que no. **El instrumento se
rompe al mirarlo.**

Los dos siguen calculándose. Ninguno de los dos llega a pantalla.

## Los cinco niveles

Cada nivel completo en sí mismo. Ninguno puede terminar en «y para entender esto
necesitas el siguiente».

| | Qué es | Ejemplo con los jieqi |
|---|---|---|
| **1** | La frase que es botón | 24 tramos de 15°, contados desde el equinoccio |
| **2** | Dónde cae hoy | Chushu, 165°. Empezó el 23 a las 04:18 |
| **3** | Cómo se calcula | el múltiplo de 15° que el Sol acaba de pasar |
| **4** | De dónde sale | tropicales: el mismo cero que el zodiaco occidental |
| **5** | Quién discute qué | los nombres son del hemisferio norte; en Sídney engañan |

**El nivel 5 es la condición de entrada.** Es donde viven los `[SIN VERIFICAR]`,
la variante 584285, las dieciséis convenciones numerológicas y la fecha real de
Balliett. **Un dato sin nivel 5 escrito no se muestra.** Con eso,
`docs/05-fuentes-tradiciones.md` deja de ser deuda y pasa a ser la puerta.

Por hondo que se baje, nunca se llega a «esto quiere decir que».

## La puerta del bloque B

Una casilla en el registro de la noche, **visible desde las 21:00 hasta el final
del día lunar** — no hasta medianoche, que es una frontera que la app no usa para
nada más.

La hora la declara la persona; **no se calcula ninguna media de hora de dormir**,
porque una media sobre otras personas aplicada a una sola sería la regla 0.1 rota
con estadística en vez de con imaginación. `hora_cierre_visible` va en
`perfil_local` y es editable.

**La casilla solo deriva a la información. No se guarda.** Es una puerta, no un
dato: por eso el registro se queda en trece campos y la prueba dorada 1 no cambia.

Y si esa noche no anotas, el bloque B no se abre. **No es un castigo**: es que no
hay con qué emparejarlo. El texto tiene que decir eso y no lo otro:

> Esto se abre cuando cierras el día.
> Si esta noche no lo necesitas, aquí tampoco hay nada que te haga falta.

## Lo que queda por decidir

1. Si «cómo estaba el día» es una pantalla propia o comparte sitio con el
   calendario personal de la 0012.
2. Qué parte exacta de `herramientas/hoja-de-cielo.mjs` pasa a pantalla. La hoja
   completa son varias páginas de papel.
3. Cómo se navega entre los cinco niveles sin que el nivel 1 parezca un resumen
   de lo de abajo.
