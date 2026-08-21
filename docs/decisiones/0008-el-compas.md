# 0008 — El temporizador se llama Compás

**Fecha:** 21 de agosto de 2026 · **Estado:** cerrada
**Relacionada con:** 0007 (nombre del proyecto), §15 de la hoja de ruta

## Contexto

Se barajó "El Compás del Umbral" como nombre del proyecto y se descartó: no cabe
bajo un icono de Android, arrastra el registro ornamental que se retiró con
"aura", y junta dos metáforas que por separado son exactas y juntas no dicen
nada — un compás no tiene umbral.

Pero la palabra era demasiado buena para tirarla, y tiene un sitio propio.

## Decisión

**El temporizador de Umbral se llama el Compás.**

En música, el compás no mide cuánto dura algo: **marca los tiempos y ordena las
entradas**. Es literalmente lo que la §15 decidió que hace este temporizador —
avisar de un cambio de turno sin obligar a mirar la pantalla— y no lo que
decidimos que no hace, que es cronometrar.

Y "compás de espera" nombra con precisión el gesto entero de la app: una pausa
marcada dentro de algo que sigue sonando.

Encaja además con el icono, que es una rosa de los vientos, y con el otro
sentido de la palabra: el instrumento que mide separaciones iguales.

## Qué implica en el código y en la pantalla

- El prototipo `herramientas/temporizador-respiracion.html` pasa a integrarse
  como **el Compás**. El gancho ya existe: `registro-practica.js` llama a
  `window.abrirTemporizador(pauta)` si está definida.
- En pantalla, cuando se abra, el rótulo es **Compás**. No "Temporizador", no
  "Timer".
- **En el código el nombre técnico sigue siendo `temporizador`.** `abreTemporizador`
  no se renombra. La marca vive en la interfaz; el código se llama por lo que
  hace, para que dentro de un año se pueda leer sin conocer la marca.

## Lo que este nombre no autoriza

Que el temporizador se llame Compás **no lo convierte en un metrónomo**. No
marca pulso continuo, no lleva ritmo audible constante, y no sincroniza nada con
nada. La §15 sigue mandando: suena en los turnos, y en las duraciones sin lados,
una sola campana al final.

Y sigue sin haber temporizador en las pautas de `repeticiones`: no tienen
segundos que contar, y dárselos sería inventar un dato (regla 0.1).

## Lo que queda a nombre de Umbral

**Umbral** es el proyecto, la app y el icono. **El Compás** es una pieza dentro.
No hay más nombres propios en el producto, y no se añaden sin una decisión como
esta. Cada nombre nuevo es una palabra más que habrá que jubilar si el proyecto
vuelve a girar — ya han caído dos, "lunar" y "aura".
