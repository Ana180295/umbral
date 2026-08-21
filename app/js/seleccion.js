/* =================================================================
   Ritual Lunar — selección de prácticas.

   Una práctica no se elige solo por la necesidad. Se elige por la
   necesidad filtrada por lo que la persona acaba de decir de sí misma.

   REGLA QUE GOBIERNA TODO LO DEMÁS: si no queda ninguna práctica que
   cumpla las condiciones, NO SE MUESTRA NADA. Ni un genérico, ni un
   «prueba a respirar hondo». Un hueco vacío es mejor que una frase
   inventada para alguien que ya no puede con nada. Es la regla 1 del
   proyecto aplicada a las palabras.

   Módulo puro: no toca el DOM, no lee la hora del sistema, no llama a
   Math.random por su cuenta. Todo entra por parámetro, para que se
   pueda probar.
   ================================================================= */

export function esNoche(hora) {
  if (hora === null || hora === undefined) return false;
  return hora >= 22 || hora < 6;
}

/* Coste máximo admisible según lo registrado: 1, 2 o 3. */
export function techoDeCoste({ energia, activacion, senal_corporal = [], hora }) {
  let techo = 3;

  /* Quien tiene poca energía no puede pagar iniciativa. */
  if (energia !== null && energia !== undefined) {
    if (energia <= 2) techo = Math.min(techo, 1);
    else if (energia === 3) techo = Math.min(techo, 2);
  }

  /* Activación al máximo: solo coste 1, pase lo que pase.
     «Sobrepasada» no admite que le propongan salir a la calle. */
  if (activacion === 5) techo = Math.min(techo, 1);

  /* Dolor: nada que exija ponerse de pie. */
  if (senal_corporal.includes("dolor")) techo = Math.min(techo, 1);

  /* De noche, coste 2 como mucho. */
  if (esNoche(hora)) techo = Math.min(techo, 2);

  return techo;
}

export function franjasAdmisibles(hora) {
  if (hora === null || hora === undefined) return ["cualquiera", "solo_dia", "mejor_manana"];
  if (esNoche(hora)) return ["cualquiera"];
  if (hora < 12) return ["cualquiera", "solo_dia", "mejor_manana"];
  return ["cualquiera", "solo_dia"];
}

/* Filtra el catálogo entero. Un array vacío es un resultado legítimo,
   no un error. */
export function candidatas(catalogo, contexto) {
  const { necesidad, activacion, hora } = contexto;
  const techo = techoDeCoste(contexto);
  const franjas = franjasAdmisibles(hora);

  return catalogo.practicas.filter(p => {
    if (necesidad && !p.necesidad.includes(necesidad)) return false;
    if (p.coste > techo) return false;
    if (!franjas.includes(p.franja)) return false;
    /* Con la activación alta no se ofrece nada que la suba más. */
    if (p.activadora && activacion !== null && activacion !== undefined && activacion >= 4) return false;
    return true;
  });
}

/* El azar entra por parámetro para que las pruebas sean deterministas:
   `elegir(cat, ctx, () => 0)` devuelve siempre la primera.
   Devuelve null si no hay ninguna, y ese null significa «no muestres la
   sección», no «muestra un mensaje de error». */
export function elegir(catalogo, contexto, azar = Math.random) {
  const lista = candidatas(catalogo, contexto);
  if (lista.length === 0) return null;
  return lista[Math.floor(azar() * lista.length)];
}

/* Texto de la medida, para pintarla bajo la práctica.
   null cuando no hay pauta: entonces no se pinta nada. */
export function textoDePauta(pauta) {
  if (!pauta) return null;
  if (pauta.tipo === "respiracion") {
    return `${pauta.inspirar} s dentro · ${pauta.exhalar} s fuera · ${pauta.ciclos} ciclos`;
  }
  if (pauta.tipo === "duracion") {
    const m = pauta.segundos >= 60 ? `${pauta.segundos / 60} min` : `${pauta.segundos} s`;
    return pauta.lados ? `${m} por lado` : m;
  }
  if (pauta.tipo === "repeticiones") return `${pauta.veces} veces`;
  return null;
}

/* Solo las pautas de respiración abren la onda y el sonido.
   «Frótate las orejas» no lleva temporizador, y forzarlo sería ruido. */
export function abreTemporizador(practica) {
  return Boolean(practica && practica.pauta && practica.pauta.tipo === "respiracion");
}
