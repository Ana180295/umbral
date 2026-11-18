# 12 · Los destacados del cielo — propuesta para aprobar

*18 de noviembre de 2026. Ana, ese día (debate B): tres listas de destacados,
«Cielo», «Astrología» y «Por tradición». Quedamos en que cada destacado de la
lista «Cielo» lleva un criterio numérico que se propone aquí y Ana aprueba.
**Nada de esto está programado todavía.***

El criterio de fondo es el de los orbes (03): **el día vacío tiene que poder
existir**. Si todos los días tienen un destacado, ninguno destaca.

---

## Lista 1 · Cielo — lo astronómico, medible

Cada fila: qué se destaca, el criterio exacto, cuántas veces pasa en 2026 visto
desde Albacete (medido el 18 de noviembre con el motor y el ΔT medido) y la
búsqueda del motor que lo calcula. **El destacado sale el día civil que contiene
el instante**, salvo «toda la noche», que sale la noche entera.

| # | Destacado | Criterio propuesto | 2026 | Del motor |
|---|---|---|---|---|
| 1 | **Oposición** de Marte, Júpiter, Saturno, Urano o Neptuno | El instante en que su longitud eclíptica geocéntrica está a 180° de la del Sol | 5 | `SearchRelativeLongitude` |
| 2 | **Conjunción con el Sol** de un planeta exterior | Su longitud, igual a la del Sol (0°). El planeta no se ve esos días | 4 | `SearchRelativeLongitude` |
| 3 | **Conjunción inferior o superior** de Mercurio o Venus | Igual, 0°; inferior si pasa por delante del Sol, superior si por detrás | 8 | `SearchRelativeLongitude` |
| 4 | **Máxima elongación** de Mercurio o Venus | El instante de máxima separación angular del Sol, de tarde o de mañana | 7 | `SearchMaxElongation` |
| 5 | **Estación**: un planeta se para y cambia de sentido | El día en que su velocidad en longitud eclíptica geocéntrica cambia de signo (empieza o termina el retrógrado) | 18 | barrido diario del motor |
| 6 | **La Luna más cerca o más lejos** (perigeo, apogeo) | El instante de mínima o máxima distancia Tierra-Luna de cada mes | 27 | `SearchLunarApsis` |
| 7 | **Eclipse de Luna** visible desde el sitio | Parcial o total, con la Luna sobre el horizonte en el máximo. Los penumbrales, fuera: no se distinguen a simple vista | 1 (28 ago) | `SearchLunarEclipse` |
| 8 | **Eclipse de Sol** visible desde el sitio | Cualquiera que el motor dé como visible desde el sitio | 1 (12 ago, parcial en Albacete) | `SearchLocalSolarEclipse` |
| 9 | **Planeta visible toda la noche** | Marte, Júpiter o Saturno sobre el horizonte desde la puesta del Sol hasta su salida, comprobado cada media hora | Júpiter 7 noches (9-15 ene), Saturno 2 (6-7 oct) | `SearchRiseSet`, `Horizon` |

**Con las nueve, 2026 tiene 73 días con algún destacado y 292 vacíos.**

Fuera de la lista, a propósito:

- **Superluna, microluna**: no tienen una definición astronómica única; cada
  fuente pone el umbral en un sitio. Si se quiere, el perigeo (fila 6) ya dice lo
  medible.
- **Lluvias de estrellas**: no salen del motor. Necesitarían una fuente propia,
  la International Meteor Organization (IMO), con su ficha.
- **Las salidas y puestas de cada cuerpo** no son un destacado: pasan todos los
  días. Van como dato del día, a la vista cuando se pida, no en esta lista.
- **Los tránsitos de Mercurio o Venus por delante del Sol**: el motor los
  calcula, pero el próximo de Mercurio es el 13 de noviembre de 2032 y el de
  Venus, en 2117 (medido con `SearchTransit`). Se pueden añadir sin cambiar el
  criterio.

**Lo que hay que aprobar:** cada una de las nueve filas, con su criterio, o
cambiar el criterio. Y dos preguntas:
- **La 6 (perigeo y apogeo)** es la que más llena: 27 días. ¿Entran los dos, solo
  el perigeo, o ninguno?
- **La 9**: ¿solo los tres planetas que se ven a simple vista, o también Urano y
  Neptuno, que necesitan prismáticos?

---

## Lista 2 · Astrología

Depende del mapa de fuentes (`docs/11`, pendiente 53): ningún destacado
astrológico sale sin su obra fichada. Candidatos, para cuando la haya:

- Un planeta **cambia de signo**.
- **Aspectos exactos** del cielo del día con la carta natal: son las líneas del
  bloque B que se decidieron el mismo día (debate A).
- **Retornos**: solar (cumpleaños astronómico) y lunar (ya está el cumpleaños
  lunar).
- **Luna vacía de curso**: hay definiciones distintas según la escuela; antes de
  entrar hay que elegir fuente.

## Lista 3 · Por tradición

Los días señalados de cada calendario que ya está fichado. Cada uno necesita una
línea de fuente, aunque la tradición ya la tenga:

- **Tithi:** la luna llena (*purnima*, tithi 15) y la nueva (*amavasya*, tithi
  30) salen de la definición de Burgess. Los días de observancia, como el
  *ekadashi* (tithi 11 y 26), son práctica ritual: clase ⑤, con etnografía.
- **Jieqi:** el primer día de cada término solar. Ya fichado (UNESCO).
- **Calendario islámico:** el primer día de cada mes, en el civil aritmético que
  ya usa Umbral. Los meses señalados, como el ramadán, son práctica: clase ⑤.
- **Fases de Rudhyar:** el cumpleaños de lunación, ya calculado.
