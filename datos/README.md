# Datos de línea base

`crudo/` — los archivos tal como se descargaron. No se editan nunca.
`derivado/` — el JSON que consume la app, con fecha de generación y método dentro.

Se calculan **una vez** con `construir-lineas-base.mjs`, no en cada arranque.
Si el resultado no se puede regenerar desde `crudo/` con ese script, no vale.
