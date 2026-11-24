# ms-buses · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de viajes, que guarda el atributo `bus_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE buses_db;
CREATE USER 'buses_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON buses_db.* TO 'buses_user'@'localhost';
```

2. `mysql -u buses_user -p buses_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "placa": "VCK-123", "marca": "Marcopolo", "puestos": 42}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| placa | texto |
| marca | texto |
| puestos | entero |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /buses | 200 arreglo | 401 |
| Consultar por lotes | GET | /buses?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /buses/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | placa | marca | puestos |
|---|---|---|---|
| 1 | VCK-123 | Marcopolo | 42 |
| 2 | WMN-456 | Chevrolet | 30 |
| 3 | TQR-789 | Hino | 19 |
| 4 | SXT-012 | Volvo | 50 |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `buses.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-viajes/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-viajes y ms-buses. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/viajes` y `/api/buses` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-viajes | `GET /buses/:id` (validar) · `GET /buses?ids=…` (componer) |
