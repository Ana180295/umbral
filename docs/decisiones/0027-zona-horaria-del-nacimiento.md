# 0027 · La zona horaria del nacimiento sale de la localidad, no del aparato

**Fecha:** 12 de noviembre de 2026 · **Estado:** cerrada
**Modifica:** el punto 3 de «lo que esto no resuelve» de la 0025, que lo dejaba
sin resolver
**No modifica:** la 0001. La zona de los **registros** sigue siendo la del
aparato, que es la correcta para ellos: un registro se hace donde estás. Esta
decisión trata solo de la zona del **nacimiento**, que es la de donde naciste
**Depende de:** 0022 (el perfil de nacimiento) · 0025 (la localidad) ·
`02-inventario-de-datos.md`, A2

---

## El problema

La hora de nacimiento se escribe en hora civil del lugar —«22:43»— y para
convertirla en un instante hace falta la zona de ese lugar en esa fecha. El
perfil guardaba siempre la del aparato con el que se rellenaba el formulario.

Para quien nace en el mismo huso que su teléfono, no cambia nada. Para
cualquier otra persona, la hora se convierte con el huso equivocado, y con ella
se desplazan la época del calendario personal, y el día que exista la carta
natal, el Ascendente, el Medio Cielo y las casas: un minuto mueve el Ascendente
unos 15′ (`02-inventario-de-datos.md`, A2), así que una hora de huso lo mueve
del orden de 15°. Y nada lo avisaba.

La 0025 lo dejó escrito como pendiente y señaló la salida: la misma respuesta
de Open-Meteo que da las coordenadas trae un campo `timezone`, y se descartaba.

## La decisión

1. **La zona del nacimiento es el `timezone` de la localidad elegida.** Viaja
   en cada candidata de `buscarLocalidad()` como `zona` y es la que se guarda
   en `perfil_local.nacimiento.zona`.
2. **Solo pasa si es una zona IANA que el navegador reconoce.** Si falta o no
   la reconoce, la candidata lleva `zona: null`. El módulo de geocodificación
   nunca pone una zona supuesta.
3. **Reserva: la del aparato.** Si la candidata trae `zona: null`, la pantalla
   usa la del aparato (la misma `ZONA` de la 0001). Decidido por Ana el 12 de
   noviembre: «se usa la del aparato».
4. **La pantalla dice cuál se usa y de dónde sale.** «Zona horaria del
   nacimiento: Europe/Madrid, la de la localidad», o «…, la de este aparato: la
   búsqueda no la ha dado». No es un aviso: es decir de dónde sale un dato, como
   se hace con todos.
5. **Los perfiles ya guardados no se migran.** Ana, 12 de noviembre: solo existe
   el suyo y se puede rehacer cuantas veces haga falta. Así no se abre ninguna
   excepción a la regla de la 0025 de no volver a pedir red para un perfil ya
   construido.

## Lo que esto no resuelve, y queda dicho

- **Nacimientos anteriores a 1970.** Hasta donde se sabe, la base de zonas
  horarias que usa el navegador no garantiza los cambios de hora locales
  anteriores a 1970. No se ha verificado en fuente. Ana, 12 de noviembre: sin
  aviso por ahora, se decide más adelante. Anotado como pendiente.
- **La validación de la zona** la hace `Intl`, que es la misma base que luego
  convierte la hora: si `Intl` no la conoce, no podría usarla de todas formas.

## Cómo se comprueba

`pruebas/geocodificacion.test.mjs`, nuevo:
- la 8 comprueba que la zona de otra localidad viaja (Buenos Aires);
- la 9, que ausente o inválida da `null`.

Verificado por mutación: descartar la zona como antes, dejar de validarla o
poner una zona fija de reserva dentro del módulo rompe al menos una prueba
cada uno.

**Lo que no cubre ninguna prueba:** `pintarZonaPerfil()` y la línea
`zona: localidadResuelta.zona || ZONA` de `index.html` tocan el DOM y quedan
en el punto ciego conocido de la §8. Se comprueban a mano, en el navegador.

---

### Corregido en la misma tanda, sin decisión propia

**La época se calculaba en Albacete.** `index.html` pasaba a `resolverEpoca()`
el observador de Albacete en las dos llamadas (calendario y portada). La 0012 y
la §4 de la hoja de ruta dicen desde el principio que la época va con las
coordenadas del nacimiento, y el 03 lo daba por probado «con perfiles reales».
Pasó porque esos perfiles eran de Albacete, el único lugar donde el fallo no
cambia nada.

No hay criterio nuevo que decidir, solo código que no hacía lo que ya estaba
decidido. Por eso va aquí y no como decisión aparte.

- `perfil.js` gana `observadorDeNacimiento()` y `epocaDelPerfil()`, y la
  pantalla ya no elige observador.
- Pruebas 26 a 30 de `pruebas/perfil.test.mjs`. La 27 usa Buenos Aires a
  propósito, porque una prueba en Albacete no podía distinguir el fallo del
  arreglo. La 30 lee `index.html` y falla si vuelve a aparecer `OBS_ALBACETE`
  en el cálculo de la época.
- Cuatro mutantes, los cuatro muertos.
