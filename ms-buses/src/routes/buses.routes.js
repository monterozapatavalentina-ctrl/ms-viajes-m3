// CAPA DE PRESENTACIÓN: rutas de buses (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/buses.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /buses  y  GET /buses?ids=1,3
router.get('/:id', controller.obtener);   // GET /buses/:id

module.exports = router;
