// =====================================================================
// CLIENTE HTTP de ms-buses, para el microservicio de viajes.
// Copie este archivo en ms-viajes/src/clients/ y COMPLÉTELO:
// la función pedir() ya está hecha; faltan las funciones que usan
// la validación, la regla de negocio y la composición.
// En el .env de ms-viajes:  BUSES_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const BUSES_URL = process.env.BUSES_URL;

// Hace una petición GET a ms-buses reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-buses no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(`${BUSES_URL}${ruta}`, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-buses caído o sin responder
  }
}

// Ejemplo de uso:
//   const respuesta = await pedir('/buses/3', token);
//   if (!respuesta) ...                   → ms-buses no respondió
//   if (respuesta.status === 404) ...     → no existe
//   const datos = await respuesta.json(); → el objeto (o el arreglo, con ?ids=)



async function obtenerBusPorId(bus_id, token) {
  const respuesta = await pedir(`/buses/${bus_id}`, token);
  if (!respuesta) throw new HttpError(503, 'ms-buses no respondió');
  if (respuesta.status === 404) throw new HttpError(400, `No existe bus con id ${bus_id}`);
  if (!respuesta.ok) throw new HttpError(respuesta.status, `Error al obtener bus de ms-buses(${respuesta.status})`);
  return respuesta.json();
}

async function obtenerBuses(bus_ids, token) {
    if (id.length === 0) return [];
    const respuesta = await pedir(`/buses?ids=${bus_ids.join(',')}`, token);
    if (!respuesta || !respuesta.ok) return [];
    return respuesta.json();
}

module.exports = { pedir, obtenerBusPorId, obtenerBuses };
