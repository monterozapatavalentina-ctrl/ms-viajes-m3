// CAPA DE SERVICIO (lógica de negocio)
const repo = require('../repositories/viajes.repository');
const { validarViaje, construirViaje } = require('../models/viajes');
const HttpError = require('../utils/http-error');
const busesClient = require('../clients/buses-client');

async function listar(filtros) {
  return repo.findAll(filtros);
}

async function obtener(id) {
  const viaje = await repo.findById(id);
  if (!viaje) throw new HttpError(404, `No existe el viaje con id ${id}`);
  return viaje;
}

async function crear(datos, token) {
  const errores = validarViaje(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const viaje = construirViaje(datos);
  const bus = await busesClient.obtenerBusPorId(viaje.bus_id, token);

    if (viaje.pasajeros > bus.puestos) {
    throw new HttpError(400, `El número de pasajeros (${viaje.pasajeros}) excede la capacidad del bus (${bus.puestos})`);
  }

  if (await repo.findByCodigo(viaje.codigo)) {
    throw new HttpError(409, `Ya existe un viaje con el código ${viaje.codigo}`);
  }

  if (await repo.findByCodigo(viaje.codigo)) {
    throw new HttpError(409, `Ya existe un viaje con el código ${viaje.codigo}`);
  }

  return repo.create(viaje);
}

async function actualizar(id, datos,token) {
  const errores = validarViaje(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  if (!(await repo.findById(id))) {
    throw new HttpError(404, `No existe el viaje con id ${id}`);
  }

  const viaje = construirViaje(datos);
  const bus = await busesClient.obtenerBusPorId(viaje.bus_id, token);

  if (viaje.pasajeros > bus.puestos) {
    throw new HttpError(400, `El número de pasajeros (${viaje.pasajeros}) excede la capacidad del bus (${bus.puestos})`);
  }

  const otro = await repo.findByCodigo(viaje.codigo);
  if (otro && otro.id !== id) {
    throw new HttpError(409, `Ya existe un viaje con el código ${viaje.codigo}`);
  }

  return repo.update(id, viaje);
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) throw new HttpError(404, `No existe el viaje con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };