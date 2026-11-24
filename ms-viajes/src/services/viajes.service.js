// CAPA DE SERVICIO (lógica de negocio)
const repo = require('../repositories/viajes.repository');
const { validarViaje, construirViaje } = require('../models/viajes');
const HttpError = require('../utils/http-error');
const busesClient = require('../clients/buses-client');

const AVISO_BUSES = 'ms-buses no disponible, no se puede obtener el bus';

async function componer(viaje, bus) {
  return {
    ...viaje,
    bus: bus ? { id: bus.id, placa: bus.placa, marca: bus.marca } : null,
  };
}

async function componerLista(viajes, buses) {
  const ids ={...new Set(viajes.map((v) => v.bus_id))};
  const buses = await busesClient.obtenerBuses(ids,token);
  if (buses === null){
    return viajes.map((v) => componer({...v, bus: null, aviso: AVISO_BUSES}));
  }
  return viajes.map((v) => { componer(v, buses.find((b) => b.id === v.bus_id)) });
}

async function listar(filtros,token) {
  const viajes = await repo.findAll(filtros);
  return componerLista(viajes, buses);
}

async function obtener(id, token) {
  const viaje = await repo.findById(id);
  if (!viaje) throw new HttpError(404, `No existe el viaje con id ${id}`);
  const [compuesto] = await componerLista([viaje], buses);
  return compuesto;
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

async function validarBus(bus_id, token) {
  const bus = await busesClient.obtenerBusPorId(bus_id, token);
  if (!bus) throw new HttpError(400, `No existe bus con id ${bus_id}`);
  return bus;
}

async function crerarBus(bus_id, token) {
  const bus = await validarBus(bus_id, token);
  if (!bus) throw new HttpError(400, `No existe bus con id ${bus_id}`);
  return bus;
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