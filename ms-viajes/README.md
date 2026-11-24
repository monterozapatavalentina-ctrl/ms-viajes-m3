# ms-viajes

Microservicio de **viajes** del taller_Parte2 del Módulo 3 (Redes y Servicios Multimedia, UAO).
Expone un CRUD de viajes con MySQL, autenticación por token JWT y control de roles.

BUSES_URL=http://127.0.0.1:3012

**Autoras:** Valentina Montero Zapata y Estefanía del Amor Restrepo Campo

## 1. Datos generales

| Dato | Valor |
|---|---|
| Puerto | 3011 (escucha en 127.0.0.1) |
| Ruta base | `/viajes` |
| Base de datos | `viajes_db` (MySQL 8), tabla `viajes` |
| Formato | JSON |
| Seguridad | Token JWT emitido por ms-usuarios |

## 2. Arquitectura

Capas: `routes → controller → service → repository`, con el modelo y `HttpError`.

```
src/
  index.js          arranque del servidor
  app.js            middlewares, rutas y manejo de errores
  db.js             conexión MySQL
  routes/           rutas y roles permitidos
  controllers/      lee la petición y responde
  services/         validaciones y reglas (400, 404, 409)
  repositories/     consultas SQL
  models/           validación y construcción del viaje
  middlewares/      auth.js (verificarToken y requiereRol)
  utils/            http-error.js
db/schema.sql       esquema y 3 registros iniciales
docs/               colección de pruebas
```

## 3. Modelo de datos

| Campo | Tipo | Regla |
|---|---|---|
| id | entero | Lo genera la base de datos |
| codigo | texto | Obligatorio y **único** |
| origen | texto | Obligatorio |
| destino | texto | Obligatorio |
| fecha | fecha | Obligatoria, formato `AAAA-MM-DD`, debe ser una fecha real |
| pasajeros | entero | Obligatorio, mayor que 0 |
| bus_id | entero >0| Obligatorio, mayor que 0, id existente en ms-buses (puerto 3012. Se valida contra ms-buses al crear y actualizar)|

El microservicio no tiene campos de referencia a otras entidades.

## 4. Instalación y ejecución

Requisitos: Node.js 22.9 o superior y MySQL 8.

1. Crear la base y los datos iniciales:
   ```bash
   mysql -u root -p < db/schema.sql
   ```
2. Crear el usuario de la base y darle permisos sobre `viajes_db`.
3. Copiar `.env.example` a `.env` y completar los valores:
   ```
   PORT=3011
   DB_HOST=localhost
   DB_USER=viajes_user
   DB_PASSWORD=<clave>
   DB_NAME=viajes_db
   JWT_SECRET=<la misma de ms-usuarios>
   ```
4. Instalar y ejecutar:
   ```bash
   npm install
   npm start
   ```
   Debe verse: `ms-viajes escuchando en http://127.0.0.1:3011`

El `.env` no se sube al repositorio.

## 5. Seguridad

Todas las rutas de `/viajes` exigen el token en la cabecera:

```
Authorization: Bearer <token>
```

El token se obtiene en ms-usuarios con `POST http://127.0.0.1:3001/usuarios/login`.
ms-viajes lo verifica con la misma `JWT_SECRET`, sin llamar a ms-usuarios.

| Operación | Roles permitidos |
|---|---|
| GET (listar y por id) | cualquier rol con token válido |
| POST, PUT, DELETE | solo `administrador` |

## 6. Contrato de la API

### GET /viajes
Lista los viajes. Filtro opcional: `?destino=<texto>`.

- **200** lista de viajes (puede ser vacía)
- **401** sin token o token inválido

```
GET /viajes?destino=Bogota
```
```json
[
  {
  "id": 1,
  "codigo": "V-001",
  "origen": "Cali",
  "destino": "Bogota",
  "fecha": "2026-12-10",
  "pasajeros": 3
  }
]
```

### GET /viajes/:id
- **200** el viaje
- **400** el id no es un entero positivo
- **401** sin token o token inválido
- **404** no existe un viaje con ese id

### POST /viajes
Crea un viaje (solo administrador).

Cuerpo:
```json
{
    "codigo": "V-004",
    "origen": "Cali",
    "destino": "Cartagena",
    "fecha": "2026-12-28",
    "pasajeros": 4
    }
```
- **201** viaje creado (con su `id` y la cabecera `Location`)
- **400** datos inválidos (campo faltante, `pasajeros` no entero o menor o igual a 0, fecha con formato o valor inválido)
- **401** sin token o token inválido
- **403** el rol no es administrador
- **409** ya existe un viaje con ese `codigo`

### PUT /viajes/:id
Reemplaza los datos del viaje (solo administrador). Cuerpo igual al del POST.

- **200** viaje actualizado
- **400** id o datos inválidos
- **401** sin token o token inválido
- **403** el rol no es administrador
- **404** no existe un viaje con ese id
- **409** el `codigo` ya lo tiene otro viaje

### DELETE /viajes/:id
Elimina el viaje (solo administrador).

- **204** eliminado, sin cuerpo
- **400** el id no es un entero positivo
- **401** sin token o token inválido
- **403** el rol no es administrador
- **404** no existe un viaje con ese id

### GET /health
Sin token. Devuelve `{ "servicio": "ms-viajes", "estado": "ok" }`.

## 7. Formato de los errores

```json
{
    "error": "Datos inválidos",
    "detalles": ["pasajeros debe ser un entero mayor que 0"]}
```

Una ruta que no existe responde **404** con `{ "error": "Ruta no encontrada: ..." }`.

## 8. Resumen de códigos

| Código | Cuándo |
|---|---|
| 200 | Consulta o actualización correcta |
| 201 | Viaje creado |
| 204 | Viaje eliminado |
| 400 | Datos o id inválidos |
| 401 | Falta el token o es inválido |
| 403 | El rol no tiene permiso |
| 404 | El viaje no existe |
| 409 | El `codigo` ya existe |

## 9. Registro de peticiones

Cada petición recibida se imprime en la terminal con su método, ruta y código de respuesta:

```
GET /viajes?destino=Bogota 200
POST /viajes 409
```

## 10. Pruebas

La colección con el login y los casos de cada código está en `docs/`.
Orden: login de administrador, login de comercial y luego los casos del 01 al 19.
Los casos se ejecutan con ms-usuarios (puerto 3001) y ms-viajes (puerto 3011) encendidos.