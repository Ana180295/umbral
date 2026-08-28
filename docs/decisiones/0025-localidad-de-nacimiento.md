# 0025 · El lugar de nacimiento se pide por nombre de localidad, no por coordenadas

**Fecha:** 28 de agosto de 2026 · **Estado:** cerrada
**Modifica:** un punto concreto de la 0022 (el perfil de nacimiento) —cómo se
piden `lat`/`lon`/`altitud`—, sin tocar el resto de la decisión
**Depende de:** 0022 (el perfil de nacimiento) · 02-inventario-de-datos.md, A2

---

## El problema

La 0022 cerró CUÁNDO y CÓMO se pide el perfil de nacimiento, pero el
formulario resultante pedía `lat`, `lon` y `altitud` como tres campos
numéricos en crudo, con un placeholder de ejemplo (`39.005556`) y nada más.
Es exactamente el dato que necesita `luna.js` para construir el `Observer`
— pero no es lo que sabe una persona sobre su propio nacimiento. Ana lo dijo
sin rodeos, probando el formulario: *"yo sé que nací en Albacete, pero no me
sé su latitud."*

## Las tres opciones consideradas

**A · Tabla local de localidades**, sin red. Sin dependencia de cobertura en
el momento de crear el perfil, pero exige mantener y fichar una tabla propia
—fuente, alcance, método— y decidir qué localidades cubre.

**B · Geocodificación puntual con red, en el momento de crear el perfil.**
Se escribe el nombre, se resuelve una vez con una consulta externa, y las
coordenadas resultantes se guardan fijas — el perfil no vuelve a pedir red
después. Cubre cualquier localidad del mundo sin mantener nada a mano.

**C · Las dos combinadas**, con los campos numéricos como alternativa
avanzada para cuando falla la búsqueda.

**Elegida: B**, sin alternativa manual. La persona: *"No, solo el buscador
de localidad."* Si la búsqueda falla, se reintenta — no hay entrada de
números de reserva.

## El proveedor: Open-Meteo Geocoding API

`https://geocoding-api.open-meteo.com/v1/search` — investigado antes de
escribir una sola línea de código, no elegido de memoria. Tres motivos:

- Sin clave, sin registro, con CORS: la única familia de opciones que
  funciona desde un `fetch()` del navegador sin backend propio, que es la
  arquitectura entera de Umbral.
- Devuelve nombre, `latitude`, `longitude` **y `elevation`** en la misma
  llamada — ninguna segunda petición hace falta para la altitud que pide
  el `Observer`.
- Ya es una familia de proveedor presente en el proyecto: `sw.js` nombra
  Open-Meteo junto a GFZ y AEMET como fuente externa de otros datos. No es
  una dependencia nueva de cero.

Los datos de localización de esta API vienen de **GeoNames**, bajo licencia
**CC BY 4.0**, que exige atribución. **Pendiente de colocar en pantalla** —
mismo tipo de obligación que ya cumple `OFL.txt` con la tipografía (decisión
0016 §5), pero dónde exactamente en la interfaz es una decisión de diseño
que no se tomó esta noche.

## El campo nuevo: `localidad`

Se añade a `perfil_local.nacimiento` junto a `lat`/`lon`/`altitud`. **No
participa en ningún cálculo** — `luna.js` sigue usando solo lat/lon/altitud,
exactamente igual que antes. Es el nombre que se enseña, y se guarda como
entrada, no se recalcula, porque una geocodificación inversa de las mismas
coordenadas no tiene por qué devolver el mismo texto que se buscó — el
mismo argumento que ya usó la 0022 para guardar `"antes"`/`"despues"` en
vez del instante resuelto.

**Opcional.** Ausente o `null` es un perfil válido, para no romper ningún
perfil creado antes de esta noche.

`app/js/perfil.js` → `construirPerfilNacimiento` valida `localidad` si
llega (tiene que ser texto), y la deja pasar sin más si no llega.

## El módulo nuevo: `app/js/geocodificacion.js`

Deliberadamente separado de `perfil.js`, que declara en su propia cabecera
que no toca la red. `geocodificacion.js` es la mitad impura: la única que
sí lo hace.

Misma forma de estado que `calcularEpoca`/`elegirEpoca` de `perfil.js`, a
propósito, para que se reconozca el mismo patrón de ambigüedad-que-elige-
la-persona:

```
estado: "unica"        — una sola coincidencia, se acepta directa
estado: "ambigua"       — varias; elegirLocalidad(resultado, indice)
estado: "sin_dato"      — ninguna coincidencia, o texto demasiado corto
estado: "sin_conexion"  — la petición de red falló
```

## El flujo en pantalla

Los tres campos numéricos desaparecen del formulario. En su lugar: una
caja de texto, un botón «Buscar localidad», y una lista de fichas —mismo
patrón de radiogroup que ya usan las franjas horarias de la 0022— que solo
aparece si hay más de una coincidencia.

- **Una sola coincidencia:** se acepta directa, sin pedir confirmación.
- **Varias:** la persona elige una; al elegir, la lista se oculta entera
  —encontrado probando contra la API real: dejar la lista visible debajo
  de la elección confundía, con "Aeropuerto de Albacete" quedándose ahí
  al lado de "Albacete" ya elegida.
- **Sin conexión o sin resultados:** mensaje claro, nada se guarda.
- **Si se reescribe el texto** después de resolver una localidad, la
  localidad guardada se invalida al momento — nunca queda una coordenada
  que ya no corresponde a lo que hay escrito en la caja.

## Lo que no cambia

- `luna.js`, `calcularEpoca`, `elegirEpoca`, `resolverEpoca`: intactos.
- La validación de `lat`/`lon`/`altitud` en `construirPerfilNacimiento`:
  la misma que ya existía, sin tocar.
- Cualquier perfil ya guardado antes de esta noche sigue siendo válido sin
  `localidad`.

## Lo que esto no resuelve

1. **Dónde se coloca la atribución a GeoNames/CC BY 4.0 en la interfaz.**
   Anotado, sin decidir.
2. **`02-inventario-de-datos.md`, bloque A2** pasa de siete campos a ocho.
   Actualizado en esta misma tanda de documentos.
3. **La zona horaria del nacimiento** se sigue tomando del dispositivo
   (`ZONA`), no de la localidad resuelta — la API de Open-Meteo devuelve un
   campo `timezone` que hoy no se usa. Si alguien introduce el perfil de
   nacimiento de otra persona nacida en un huso distinto al del aparato
   con el que está rellenando el formulario, la zona seguirá siendo la del
   aparato. No es un problema nuevo de esta decisión —ya existía—, pero
   esta decisión lo deja más visible al añadir un dato (`timezone`) que
   podría resolverlo y que hoy se descarta sin usar. Sin resolver.
