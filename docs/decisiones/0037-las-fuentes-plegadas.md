# 0037 · Las fuentes, plegadas al final

**Fecha:** 18 de noviembre de 2026 · **Estado:** cerrada
**Origen:** debate C del 16 de noviembre. Ana: «las fuentes prefiero que no se
vean a menos que se busquen explícitamente, en las citas solamente la
información, nada de fuentes, eso lo tenemos que poner como un enlace al final».
Ana, 18 de noviembre: «la marca de débil que se mantenga dentro de la fuente».
**Cambia:** la 0016 §7 («DÉBIL se muestra con la marca visible»)

---

## La decisión

En cada ficha de tradición del día (`construirFichaDeDato` y
`construirFichaDeNivel4` en `index.html`):

1. **A la vista:** el nombre, sin marca, y la cifra. En «Sobre esta tradición»,
   los niveles 1, 3 y 4, que son información.
2. **Al final, un desplegable «Fuente»**, cerrado, que solo abre quien lo busca.
   Dentro:
   - **el estado de verificación**: «Verificado fuerte», o la marca **DÉBIL** con
     lo que significa según el 05 (una sola entrada de catálogo, sin nada que la
     contradiga; falta una segunda comprobación);
   - **el nivel 5**, quién discute qué. Va aquí y no en el texto porque es
     verificación y debate sobre las fuentes, no información sobre la tradición;
   - **la ficha**: autor, título, publicación, dónde dentro de la obra y cuándo
     se verificó.
3. **El aviso al citar sigue sin pintarse**, como fija la 0016 §8.
4. **Los datos SIN VERIFICAR siguen sin mostrarse**, como fija la 0016 §7.

## Lo que no cambia

La regla de la 0016 de que todo dato visible tiene ficha: la ficha sigue ahí,
siempre, a un toque. Lo que cambia es que no compite con la información.

## Cómo se comprueba

`pruebas/fuentes-ocultas.test.mjs`, con el renderizador real:

1. En el texto visible no aparece ningún título, autor, publicación, fecha de
   verificación, nivel 5 ni estado; dentro de la fuente aparecen todos.
2. Los avisos al citar no se pintan nunca.
3. La marca DÉBIL va dentro de la fuente y solo en los datos débiles. Hoy ningún
   dato con cifra en el día es débil (el único, `casas`, aún no tiene cifra), así
   que la prueba lo comprueba con un dato de prueba.

**Mutación**, cuatro mutantes, los cuatro mueren: la marca junto al nombre, el
nivel 5 en el texto, el aviso pintado y la ficha sin la fecha de verificación.
