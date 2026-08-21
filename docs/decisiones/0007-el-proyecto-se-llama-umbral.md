# 0007 — El proyecto se llama Umbral

**Fecha:** 21 de agosto de 2026 · **Estado:** cerrada
**Sustituye a:** el nombre "Ritual Lunar" en todo el repositorio

## Contexto

"Ritual Lunar" venía de la etapa en que esto iba a ser un calendario lunar. La
decisión de producto de la sección 1 lo convirtió en otra cosa —una herramienta
de autorregulación en la que la Luna es una familia de datos entre seis— y el
nombre se quedó describiendo lo que la app ya no es. Prometía luna y ritual, y
lo que hay al abrirla son cuatro escalas y una pregunta.

## Decisión

**El proyecto se llama Umbral.**

Además de que el concepto encaja —el momento antes de cruzar, la pausa antes de
actuar—, **umbral es el término técnico de percepción**: umbral sensorial,
umbral de detección, el punto a partir del cual un estímulo se nota. Es
literalmente lo que miden las cuatro escalas. El nombre describe el mecanismo,
no la estética, y eso lo hace resistente a que el proyecto vuelva a cambiar de
forma.

Cumple además la sección 10: no promete resultado, no evoca fisiología, y no
hay que retirarlo después como hubo que retirar "aura".

## Alcance del cambio

`Ritual Lunar` → `Umbral` · `ritual-lunar` → `umbral` · `ritual_lunar` → `umbral`

Ejecutado sobre los ficheros de texto rastreados por git, con `git grep -lI`
para no tocar fuentes ni imágenes. Alcanza a:

| Sitio | Qué cambia |
|---|---|
| `app/index.html` | `<title>`, `.marca-nombre`, comentarios de cabecera |
| `app/manifest.webmanifest` | `name`, `short_name`, `description` |
| `app/sw.js` | prefijo de caché → `umbral-${VERSION}`, y el filtro de limpieza |
| `docs/` | hoja de ruta, decisiones 0001–0006, `pendiente.md` |
| Carpeta y repositorio | `~/proyectos/umbral`, `github.com/…/umbral` |
| URL publicada | `https://…github.io/umbral/app/` |

`VERSION` pasa a `'2026-08-21c'`: dejarla en `'rl-…'` habría producido un
nombre de caché con dos prefijos y las siglas del nombre viejo dentro.

## Lo que se rompe a propósito

**La base de datos pasa de `ritual_lunar` a `umbral`, y los registros
anteriores quedan huérfanos.** IndexedDB no renombra bases: la vieja sigue en
el disco del navegador, inaccesible para la app, hasta que se borren los datos
del sitio.

Se acepta porque en el momento de decidirlo **había un solo registro, de
prueba, hecho en `localhost` esa misma tarde**. Es el instante más barato que
va a existir para este cambio: dos semanas después habrían sido catorce días
reales y habría hecho falta una migración de verdad.

**Si esta decisión se relee para renombrar otra cosa: ya no es gratis.** A
partir del primer día de uso real, cualquier cambio de `DB_NOMBRE` exige leer
de la base vieja, escribir en la nueva y verificar antes de borrar nada. No se
hace con un `sed`.

## Por qué el nombre de la base importa más de lo que parece

`USUARIA.github.io` es **un único origen para todos los repositorios de la
cuenta**. GitHub Pages sirve cada proyecto en un subdirectorio, no en un
subdominio, y el navegador reparte el almacenamiento —IndexedDB, Cache Storage,
localStorage— por origen, no por ruta.

Consecuencia práctica: cualquier otro proyecto publicado en la misma cuenta
comparte ese espacio. No hay fuga de datos entre ellos, pero sí colisión si dos
usan el mismo nombre de base. `umbral` es lo bastante propio como para que no
ocurra.

El prefijo de caché sigue la misma lógica: el `activate` del worker borra solo
las cachés que empiezan por `umbral-`. Borrar todas las del origen habría
tirado las de cualquier otra app publicada en la misma cuenta.

*Si algún día se quiere aislamiento real, la vía es un dominio propio, no una
ruta distinta. No es necesario hoy.* → `pendiente.md`

## Rastro

El nombre viejo desaparece del árbol de trabajo pero **sigue en el historial de
git**, en el commit raíz `a50cbc8`. Es lo correcto: el historial registra lo que
pasó, no lo que preferiríamos haber hecho. No se reescribe.
