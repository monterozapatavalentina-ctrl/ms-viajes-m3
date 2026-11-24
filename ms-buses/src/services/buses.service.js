// CAPA DE NEGOCIO: buses
const repo = require('../repositories/buses.repository');
const HttpError = require('../utils/http-error');

async function listar(ids) {
  return repo.findAll(ids);
}

async function obtener(id) {
  const fila = await repo.findById(id);
  if (!fila) throw new HttpError(404, `No existe el bus con id ${id}`);
  return fila;
}

module.exports = { listar, obtener };
