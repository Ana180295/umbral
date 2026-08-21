# Registro de datos

Toda constante numérica del proyecto vive aquí antes de aparecer en el código.
Sin fila en esta tabla, no se escribe el número.

Motivo: la revisión crítica del dossier señaló que las cifras marcadas `[CALC]`
no eran auditables. Una cifra sin método, versión de librería y fecha de consulta
es una cifra que no se puede reproducir tras cambiar de dependencia.

| Constante | Valor | Unidad | Fuente | Método | Consultado |
|---|---|---|---|---|---|
| Ratio de fuerza de marea Sol:Luna | 0,46 | — | NOAA National Ocean Service Education | citado | *pendiente* |
| Envolvente sicigia/cuadratura (modelo de equilibrio) | ≈ 2,7 | — | Derivado de M₂ y S₂ | (0,24+0,11)/(0,24−0,11) | *pendiente* |
| Mes sinódico medio | 29,530588 | días | *pendiente de fijar edición* | — | *pendiente* |
| Versión de astronomy-engine | 2.1.19 | — | Don Cross, MIT | — | *pendiente* |

## Cómo se cita en el código

```js
/* Fuente: NOAA National Ocean Service Education. Consultado AAAA-MM-DD.
   Ficha: docs/registro-de-datos.md#marea */
const K_SOL_LUNA = 0.46;
```
