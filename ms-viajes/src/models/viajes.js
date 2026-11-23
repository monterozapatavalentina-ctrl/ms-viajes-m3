// CAPA DE MODELO (entidad)
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

function esTextoVacio(valor) {
  return typeof valor !== 'string' || valor.trim() === '';
}

// true solo si el texto es AAAA-MM-DD y es una fecha real (rechaza 2026-02-30)
function esFechaReal(texto) {
  if (typeof texto !== 'string' || !FORMATO_FECHA.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

function validarViaje(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos del viaje'];
  }
  if (esTextoVacio(datos.codigo)) errores.push('codigo es obligatorio');
  if (esTextoVacio(datos.origen)) errores.push('origen es obligatorio');
  if (esTextoVacio(datos.destino)) errores.push('destino es obligatorio');
  if (!esFechaReal(datos.fecha)) errores.push('fecha es obligatoria con formato AAAA-MM-DD y debe ser una fecha real');
  if (!Number.isInteger(datos.pasajeros) || datos.pasajeros <= 0) {
    errores.push('pasajeros debe ser un entero mayor que 0');
  }
  return errores;
}

function construirViaje(datos) {
  return {
    codigo: datos.codigo.trim(),
    origen: datos.origen.trim(),
    destino: datos.destino.trim(),
    fecha: datos.fecha,
    pasajeros: datos.pasajeros,
  };
}

module.exports = { validarViaje, construirViaje };