# 0002 · El color no codifica valor en "Mi registro"

**Fecha:** 2026-08-19 · **Estado:** cerrada

## Contexto
La maqueta daba un color distinto a cada escala (Descanso dorado, Energía
naranja, Activación violeta, Tono rosa). Dos problemas: el dorado y el naranja
ya están reservados para Luna y Kp en la gramática del aura, y la secuencia
cálido→frío se lee como una progresión de valencia.

## Decisión
Un único acento de selección para las cuatro escalas. Los cinco colores de
familia quedan declarados en `tokens.css` pero sin usar hasta Fase 2.
Discos de tamaño idéntico: ningún extremo se dibuja como el "bueno".

## Consecuencias
- El 5 de Activación ("sobrepasada") no puede confundirse con un logro.
- Se añaden los dos extremos bajo cada fila y el numeral junto a la etiqueta,
  porque sin ellos la dirección de la escala no se lee.
