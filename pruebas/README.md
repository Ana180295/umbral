# Pruebas doradas

Se ejecutan con el runner incorporado de Node, sin dependencias:

    node --test pruebas/

- `doradas-astronomia.test.mjs` — la tabla de la sección 8. Vacío hasta Fase 1.
- `doradas-arquitectura.test.mjs` — las reglas que no son números:
  sin red nunca devuelve 0 sino `"sin_conexion"`; con `prefers-reduced-motion`
  no hay animación; un campo ausente se guarda como `null`, no como 0.
