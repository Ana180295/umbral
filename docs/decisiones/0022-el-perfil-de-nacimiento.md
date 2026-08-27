# 0022 · El perfil de nacimiento: cuándo y cómo se pide

**Fecha:** 26 de agosto de 2026
**Estado:** cerrada
**Relacionada con:** `01-pendiente.md` 20 y 26 (26 cierra como consecuencia
directa de esta) · `03-registro-de-datos.md`, «Época del calendario
personal» · decisión 0012 (el calendario personal)

---

## 20.1 · Qué se pide y cómo se presenta

Se pide y se vende como el dato necesario para construir **el calendario
lunar personal** — porque es verdad, la época personal depende literalmente
de él. El segundo uso del dato —la carta de curiosidades del origen, en el
anclaje del calendario— no se menciona en la pantalla que pide el dato; se
descubre por su propio sitio, cuando la persona llega a esa pantalla.

## 20.2 · Qué pasa si falta

Sin el dato, no se crea el calendario personal. Nada de anclaje sustituto ni
fecha por defecto: ausencia de dato es ausencia de calendario, no un
calendario aproximado.

## 20.3 · Qué pasa si es impreciso

Para quien no sabe la hora exacta de su nacimiento, se ofrece una franja de
**3 horas**, sin ningún aviso de ambigüedad al elegirla. Cuando la
ambigüedad ocurre de verdad —el orto lunar de ese día cae dentro de la
franja elegida—, se muestran **las dos fechas de época posibles** y elige la
persona; si no puede decidir, se le da la información base de cada una de
las dos lunas —sin opinar, sin enlazar a ningún sitio— para que busque por
su cuenta.

**Verificación (astronomy-engine 2.1.19, ortos lunares reales de Albacete
2026):** con franjas de 6h, entre el 23% y 28% de los días del año caen en
zona de ambigüedad; con franjas de 3h, entre el 11% y 16%; con 1h, entre el
3% y 6%; con 30 min, entre el 1% y 4%. La distribución de ortos lunares por
hora del reloj es casi uniforme a lo largo del año, así que estos
porcentajes son estables y no dependen de qué franja concreta se elija.

## Consecuencia sobre las franjas horarias ya fichadas

La tabla de franjas de `03-registro-de-datos.md` («Época del calendario
personal») tenía **cinco franjas asimétricas** (madrugada 6h, mañana 6h,
mediodía 3h, tarde 6h, noche 3h), anteriores a esta decisión. Se sustituyen
por **ocho franjas uniformes de 3h**, ya reflejadas en el registro de datos.

## Consecuencia sobre el pendiente 26

El cálculo de la época personal ya estaba escrito y funcionaba; lo único que
le faltaba era de dónde sacar el dato de entrada. Con esta decisión cerrada,
el pendiente 26 se cierra como consecuencia directa: se calcula con
astronomy-engine en cuanto exista el perfil de nacimiento, usando las
franjas nuevas de 3h uniformes.
