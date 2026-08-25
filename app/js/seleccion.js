/* =================================================================
   Umbral — selección de prácticas.

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

/* Cuántos lados tiene una pauta. `lados` es un NÚMERO —vale 2 en las seis
   prácticas que lo llevan—, no un booleano, y hasta ahora se leía por su
   veracidad: funcionaba de casualidad, porque 2 es cierto. Un `lados: 1`
   habría dicho "por lado" sin haber ningún lado contrario. */
export function ladosDePauta(pauta) {
  const n = Number(pauta?.lados);
  return Number.isFinite(n) && n > 1 ? n : 1;
}

/* Segundos que dura una pauta de principio a fin, o null si no dura nada
   medible. Con lados, la duración total es SEGUNDOS × LADOS: 45 s a cada lado
   son 90 s, no 45.
   Las de `repeticiones` devuelven null y no un cero: no es que duren nada, es
   que no tienen ninguna duración que contar. Las cuenta el cuerpo. */
export function duracionTotal(pauta) {
  if (!pauta) return null;
  if (pauta.tipo === "respiracion") {
    return (pauta.inspirar + pauta.exhalar) * pauta.ciclos;
  }
  if (pauta.tipo === "duracion") {
    return pauta.segundos * ladosDePauta(pauta);
  }
  return null;
}

/* Segundos escritos como se leen en voz alta. Vive aquí, y no en cada
   pantalla que los pinte, para que la misma práctica no se llame "1.5 min"
   bajo el texto y "1 min 30 s" dentro del Compás. */
export function textoDuracion(segundos) {
  if (segundos < 60) return `${segundos} s`;
  const m = Math.floor(segundos / 60);
  const r = segundos % 60;
  return r === 0 ? `${m} min` : `${m} min ${r} s`;
}

/* Texto de la medida, para pintarla bajo la práctica.
   null cuando no hay pauta: entonces no se pinta nada. */
export function textoDePauta(pauta) {
  if (!pauta) return null;
  if (pauta.tipo === "respiracion") {
    return `${pauta.inspirar} s dentro · ${pauta.exhalar} s fuera · ${pauta.ciclos} ciclos`;
  }
  if (pauta.tipo === "duracion") {
    const m = textoDuracion(pauta.segundos);
    return ladosDePauta(pauta) > 1 ? `${m} por lado` : m;
  }
  if (pauta.tipo === "repeticiones") return `${pauta.veces} veces`;
  return null;
}

/* Qué abre el Compás. Cambiado a sabiendas el 22 de agosto (decisión 0010,
   §15 de la hoja de ruta): antes solo las 3 de respiración, ahora también las
   34 de duración. Son 37 de 100.

   Respiración: cada inspiración y cada exhalación es un turno.
   Duración con lados: hay un cambio en mitad.
   Duración sin lados: un solo turno, cuándo parar.
   Repeticiones: NO, y no es una preferencia. Una pauta de "10 veces" no tiene
   duración, y dársela exigiría inventarla — la regla 0.1. Se cuentan con el
   cuerpo. «Frótate las orejas» sigue fuera por otro motivo: tiene pauta null. */
export function abreTemporizador(practica) {
  const tipo = practica?.pauta?.tipo;
  return tipo === "respiracion" || tipo === "duracion";
}
