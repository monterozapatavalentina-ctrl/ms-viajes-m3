// =====================================================================
// ms-buses · microservicio PROVEEDOR del examen (solo lectura).
// Lo consulta el microservicio de viajes para validar y componer.
// =====================================================================
const express = require('express');
const cors = require('cors');
const rutas = require('./routes/buses.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Registro: muestra en la terminal cada petición que llega
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ servicio: 'ms-buses', estado: 'ok' });
});

app.use('/buses', rutas);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message });
});

module.exports = app;
