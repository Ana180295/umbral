# 0019 · El bloque del nivel4 se guarda aparte del bloque del dato

**Fecha:** 26 de agosto de 2026 · **Estado:** cerrada
**Modifica:** un punto concreto de la 0018 (regla 1, «va al bloque B»), sin
tocar el resto de la decisión
**Depende de:** 0015 (los bloques) · 0018 (el nivel4 y la clase ⑤)

*Nota de numeración: propuesta como 0019 porque es la siguiente libre según*
*lo que consta en esta conversación. Confirmar contra `docs/decisiones/`*
*antes de guardar, por si algo ha ocupado el número entretanto.*

---

## El problema, encontrado al escribir el pendiente 35

La 0018 dice, sin matices: «el nivel 4 vive en el bloque B... todo nivel 4».
La prueba dorada que lo ejecutaba miraba el campo `bloque` **del dato
entero**:

```js
// versión anterior
d.nivel4 && d.bloque === 'A'   // → mal
```

Mientras el nivel4 estuvo vacío en los diez datos, esto nunca se puso a
prueba de verdad. Al escribir el nivel4 real para el pendiente 35, cuatro
datos con nivel1-3 legítimamente en bloque A —`zodiaco_tropical`,
`zodiaco_sidereo`, `nakshatra`, `numerologia`— necesitaron nivel4, y la
prueba tal como estaba solo dejaba dos salidas: romper, o mover el `bloque`
entero de esos cuatro a `"B"`.

La segunda opción no es gratis. Habría escondido también nivel1, nivel3 y
nivel5 de esos cuatro datos hasta el cierre del día —contenido estable,
disponible siempre, sin riesgo de fabricar correlaciones falsas, que es
justo lo que la 0015 quiso mantener visible—. Habría sido deshacer una
decisión sin abrirla.

## La resolución

`bloque` sigue significando exactamente lo que significaba: dónde viven
nivel1, nivel3 y nivel5. No se toca en ninguno de los diez datos.

Se añade un campo nuevo, `bloque_nivel4`, que **solo existe cuando hay
nivel4**, y que vale **siempre `"B"`**, sin excepción — es la regla de la
0018 aplicada tal como está escrita, «todo nivel4», ahora que hay algo real
que gobernar.

```js
zodiaco_tropical: {
  bloque: "A",           // nivel1, nivel3, nivel5: disponibles siempre
  nivel4: "...",
  bloque_nivel4: "B",    // el nivel4, solo al cerrar el día
  ...
}
```

La prueba dorada correspondiente pasa a mirar `bloque_nivel4` en vez de
`bloque`:

```js
test('ningún nivel4 fuera del bloque B', () => {
  const mal = [];
  for (const [clave, d] of entradas) {
    if (!d.nivel4) continue;
    if (d.bloque_nivel4 !== 'B') mal.push(`${clave}.bloque_nivel4 = ${d.bloque_nivel4}`);
  }
  assert.deepEqual(mal, []);
});
```

## Lo que no cambia

- El significado de `bloque` para nivel1, nivel3 y nivel5: intacto.
- Las diez fichas de `CAMPOS_ETNOGRAFIA`: sin tocar.
- El resto de las pruebas doradas de `fuentes.test.mjs`: ninguna otra mira
  `bloque` ni `nivel4` de forma que este cambio las afecte. Comprobado
  ejecutando la suite completa contra el fichero editado: **11 de 11
  pasan.**
- La regla de la 0018 en sí: «todo nivel4 va a B» se cumple con más
  precisión que antes, no con menos — antes se cumplía por accidente,
  porque nivel4 estaba vacío en todas partes.

## Lo que esto no resuelve

1. **Si `casas` debería tener alguna vez nivel4 propio**, o si la fusión con
   `zodiaco_tropical` es permanente. Hoy se queda vacío a propósito, con la
   razón anotada en su `aviso`.
2. **El renderizador** (pendiente 30) todavía no existe, así que esta
   decisión es sobre la forma de los datos, no sobre cómo se ve en pantalla
   — eso se decide cuando se escriba.
