# Ritual Lunar

Herramienta de autorregulación personal. Todo se queda en el dispositivo.

## Cómo se abre

`app/` se sirve tal cual. No hay compilación, ni empaquetador, ni paso de build.

    cd app && python3 -m http.server 8000

Y en el navegador, `http://localhost:8000`.

> IndexedDB necesita un origen real. Abrir `index.html` con doble clic
> (`file://`) puede fallar según el navegador. Sirve siempre por HTTP.

## Cómo se publica

GitHub Pages apuntando a la carpeta `app/`. Coste: 0 €.

## Cómo se prueba

    node --test pruebas/

## Las cinco reglas

1. No se inventa ningún dato.
2. Lo autoinformado y lo externo nunca se mezclan en una fórmula.
3. Los datos personales se quedan en el dispositivo.
4. Cero contenido médico.
5. Si un cambio rompe la separación anterior, se para y se pregunta.

El documento que gobierna todo lo demás es `docs/hoja-de-ruta.md`.
Lo que aún no está decidido vive en `docs/pendiente.md`, y no se rellena
con un valor plausible.

## Estado

| Fase | Qué | Estado |
|---|---|---|
| 0 | Mi registro, sin red, sin aura | construida, sin probar 8 días |
| 1 | Luna local con astronomy-engine | no empezada |
| 2 | El aura completa | no empezada |
| 3 | Fuentes externas, una a una | no empezada |
| 4 | Memoria personal con umbrales | no empezada |
| 5 | Empaquetado APK con Capacitor | no empezada |
