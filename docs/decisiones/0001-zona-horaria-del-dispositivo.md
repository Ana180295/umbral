# 0001 · La zona horaria se toma del dispositivo

**Fecha:** 2026-08-19 · **Estado:** cerrada

## Contexto
La tabla de stack fijaba `Europe/Madrid`. Eso da el día civil correcto en
Albacete, pero calcula la fecha de un registro con el día de Madrid aunque
la persona esté en otro huso.

## Decisión
`Intl.DateTimeFormat().resolvedOptions().timeZone`, con `Europe/Madrid`
únicamente como reserva si el navegador no la resuelve. La zona efectiva
se muestra en el pie de la pantalla.

## Consecuencias
- Nunca se escribe `+1`, `+2` ni `CEST` a mano: la base tzdata la mantiene el sistema.
- Viajar cambia el día civil de los registros nuevos. Los ya guardados no se tocan.
- Pendiente: decidir si un registro debe guardar además la zona en que se creó.
