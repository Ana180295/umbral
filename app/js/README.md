# Módulos

Hoy `index.html` es un solo archivo y funciona. Esta carpeta está preparada
para cuando deje de caber, que será al integrar astronomy-engine.

El corte se hace con módulos ES nativos —`<script type="module">`— para no
introducir un empaquetador. Es lo que permite tener archivos separados
conservando la regla de "cero build".

| Archivo | Contenido | Fase |
|---|---|---|
| `tiempo.js` | ZONA, `fecha_local`, formateadores Intl | 0 |
| `almacen.js` | IndexedDB: abrir, guardar, leer | 0 |
| `vocabulario.js` | ESCALAS, CUERPO, NECESIDAD | 0 |
| `registro-ui.js` | La pantalla "Mi registro" | 0 |
| `luna.js` | Fase, iluminación, salida/puesta, marea | 1 |
| `aura.js` | Gramática visual de la sección 6 | 2 |
| `externas/` | Una por familia: sol, atmosfera, aire, kp | 3 |
| `vendor/` | astronomy-engine copiada, con versión anotada | 1 |

`vendor/` se copia a mano desde npm y se anota la versión exacta.
La app no resuelve dependencias en tiempo de ejecución.
