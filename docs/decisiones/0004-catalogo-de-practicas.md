# 0004 · Catálogo de prácticas breves

**Fecha:** 2026-08-20 · **Estado:** cerrada · Sustituye al asunto 1 de `pendiente.md`

## El problema

La maqueta prometía «Una opción para ti». Eso son ocho necesidades por varias
prácticas cada una: unas cien frases que alguien lee cansada, a las once de la
noche, después de marcar «activación: sobrepasada». No es contenido decorativo.

## Lo que gobierna la selección

Una práctica no se elige solo por la necesidad. Se elige por la necesidad
**filtrada por lo que la persona acaba de registrar de sí misma**.

```
energía 1–2          → solo coste 1
energía 3            → coste 1 o 2
energía 4–5          → cualquiera
activación 5         → solo coste 1, pase lo que pase
dolor en el cuerpo   → solo coste 1
de 22 h a 6 h        → coste máximo 2 y solo franja "cualquiera"
activación 4–5       → nada marcado como `activadora`
si no queda ninguna  → NO SE MUESTRA NADA
```

El último renglón es el importante. Es la regla 1 del proyecto aplicada a las
palabras: si no hay nada honesto que ofrecer, no se rellena el hueco con algo
plausible. Un espacio vacío es mejor que «prueba a respirar hondo» dirigido a
alguien que ya no puede con nada.

## Los campos, y por qué son esos

**`coste`** mide iniciativa, no esfuerzo físico: 1 se hace sin levantarse, 2 sin
salir de casa, 3 exige salir, prepararse o coordinarse con alguien. Una versión
anterior separaba iniciativa y esfuerzo en dos ejes; se descartó por maquinaria
de sobra para cien prácticas.

**`franja`** tiene tres valores porque hay prácticas activadoras que no deben
aparecer de noche aunque el coste lo permita.

**`activadora`** existe porque el coste no lo captura todo: sacudirse cuesta
poco y sube mucho.

**`origen`** no se muestra nunca en pantalla. Existe para que, cuando llegue la
Fase 4 con sus umbrales de evidencia, se pueda mirar qué familia se marcó como
útil y cuál no. Sin ese campo, mezclar tradiciones sería irreversible.

**`evidencia`** tampoco se muestra. Poner «respaldado por 70 ensayos» en pantalla
convierte una sugerencia en una receta y roza la regla 4 de cero contenido
médico. El campo existe para poder auditar el catálogo, no para presumir.

**`pauta`** tiene cuatro casos: `respiracion` abre onda y sonido, `duracion` abre
una cuenta atrás, `repeticiones` no abre nada porque cuenta la persona, y `null`
no muestra medida. Solo tres prácticas de cien son de respiración.

## Las promesas que se han quitado

De la rutina que originó esto, se conservan los movimientos y se eliminan las
afirmaciones sin fuente: los giros de cintura no «ayudan a la digestión», las
palmadas no «activan los pulmones», y nada «despierta la energía vital». Se
conserva la bomba muscular de la pantorrilla, que sí tiene fisiología detrás.

Ninguna práctica promete resultado. «Sube y baja escaleras diez minutos» es
honesto. «Sube escaleras y notarás la diferencia» no lo es, aunque el ensayo
casi lo permita.

## El problema de la dosis, anotado

El metaanálisis de sesión única concluye que la fatiga solo baja tras ejercicio
de intensidad baja o moderada de **más de veinte minutos**, y un ensayo midió que
cuatro minutos de escaleras no bastan para mover la sensación de energía. La
mayoría del catálogo está por debajo de ese suelo. Eso no invalida las
prácticas, pero **prohíbe** que la app insinúe que dan energía.

## Reglas de escritura

- Tutea y puede consolar, pero no promete.
- Cada frase lleva un permiso dentro: «si te duermes, mejor», «vuelve cuando quieras».
- Una línea. A las once de la noche, tres renglones ya son trabajo.
- En autocontemplación: preguntas de **qué, dónde y cuándo**, nunca de **por qué**.
  El «por qué» abre la puerta a rumiar.

## Lo que queda fuera a propósito

Las secuencias exactas de **Shi Er Duan Jin** (Doce Brocados Sentado) y **Ming Mu
Gong** (Qigong para los ojos), ambas de Chinese Health Qigong Association, están
publicadas en libros con autor y en cursos de pago. No se transcriben: es
material protegido, y una coreografía de doce movimientos reconstruida desde
resúmenes de web sale mal. En su lugar hay prácticas genéricas del mismo linaje
—automasaje sentado, movimiento ocular, palmeo— que llevan siglos en el dominio
común. Las dos formas quedan en `pendiente.md` como material a aprender de
fuente legítima, no a copiar.

## Aviso de seguridad

`sacudirse`, `voo` y `sonido_grave_largo` vienen del trabajo con trauma y pueden
activar más de lo que calman. Están marcadas `activadora: true`, así que el
filtro las retira con activación 4 o 5. Su origen terapéutico no se menciona en
pantalla.

Los meridianos del Makko-ho y el qi del qigong entran como `origen`, nunca como
explicación. Misma decisión que en el asunto del Baduanjin.
