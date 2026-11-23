// CAPA DE ACCESO A DATOS (repositorio): versión MySQL
const pool = require('../db');

async function findAll(filtros = {}) {
  let sql = 'SELECT * FROM viajes';
  const condiciones = [];
  const valores = [];

  if (filtros.destino) {
    condiciones.push('destino = ?');
    valores.push(filtros.destino);
  }
  if (filtros.ids) {
    condiciones.push('id IN (?)');
    valores.push(filtros.ids);
  }
  if (condiciones.length > 0) sql += ' WHERE ' + condiciones.join(' AND ');

  const [filas] = await pool.query(sql + ' ORDER BY id', valores);
  return filas;
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM viajes WHERE id = ?', [id]);
  return filas.length > 0 ? filas[0] : null;
}

async function findByCodigo(codigo) {
  const [filas] = await pool.query('SELECT * FROM viajes WHERE codigo = ?', [codigo]);
  return filas.length > 0 ? filas[0] : null;
}

async function create(viaje) {
  const [resultado] = await pool.query(
    'INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros) VALUES (?, ?, ?, ?, ?)',
    [viaje.codigo, viaje.origen, viaje.destino, viaje.fecha, viaje.pasajeros]
  );
  return findById(resultado.insertId);
}

async function update(id, viaje) {
  const [resultado] = await pool.query(
    'UPDATE viajes SET codigo = ?, origen = ?, destino = ?, fecha = ?, pasajeros = ? WHERE id = ?',
    [viaje.codigo, viaje.origen, viaje.destino, viaje.fecha, viaje.pasajeros, id]
  );
  if (resultado.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.query('DELETE FROM viajes WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { findAll, findById, findByCodigo, create, update, remove };