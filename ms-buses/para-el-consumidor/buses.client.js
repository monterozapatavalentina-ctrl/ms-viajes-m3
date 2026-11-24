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

module.exports = { pedir };
