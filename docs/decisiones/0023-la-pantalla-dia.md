# 0023 · La pantalla `dia`

**Fecha:** 26 de agosto de 2026
**Estado:** cerrada
**Relacionada con:** `01-pendiente.md` 30 · decisión 0015 (forma: dos
bloques, cinco niveles, la casilla de cierre) · decisión 0016 (el
renderizador de `fuentes.js`) · decisión 0017 (el mapa de pantallas, claves
en vez de números)

---

## El problema

La decisión 0015 ya había cerrado la forma de la pantalla `dia` —dos
bloques, cinco niveles, la casilla de cierre—, pero quedaba abierto si
`dia` es una pantalla propia o si comparte sitio con `calendario`.

## La decisión

- `dia` es una **pantalla única**, reutilizada para cualquier fecha del
  calendario personal — hoy es un caso particular de esa pantalla, no una
  pantalla distinta.
- `calendario` pasa a ser la rejilla de navegación: tocar cualquier día
  —pasado, hoy o futuro— abre `dia` con los datos de esa fecha.
- El renderizador de `fuentes.js` (decisión 0016) debe funcionar para
  **cualquier fecha**, no solo para hoy.
- La **casilla de cierre** (visible de 21:00 al final del día lunar, nunca
  se guarda) **solo existe cuando la fecha mostrada es hoy**. En cualquier
  otro día no aparece — ni deshabilitada, ni vacía: directamente no está.
- Sin casilla, no hay puerta que cruzar: **los días pasados se muestran
  enteros**, bloque A (lo medible) y bloque B (lo interpretativo, niveles 4
  y 5) juntos. El bloque B no es exclusivo de hoy — es exclusivo de «días
  ya cerrados», y hoy es el único día que todavía no lo está.

## Consecuencia

Bloquea el renderizador de la 0016 hasta implementarse, no `fuentes.js` en
sí, que ya estaba escrito antes de esta decisión.
