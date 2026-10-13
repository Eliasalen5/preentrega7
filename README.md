# Turnos y Reservas — Pre-entrega 7 (Handlebars y Socket.io)

API REST de turnos y reservas (Express + MongoDB/Mongoose) a la que se le agregó una
**capa de vistas server-side con Handlebars** y **comunicación en tiempo real con
Socket.io**, sin reemplazar la API REST ni la arquitectura en capas.

## Arquitectura en capas

La API REST se mantiene igual:

```
router → controller → service → repository → DAO → MongoDB (Mongoose)
```

Las **vistas** usan exactamente las mismas capas (no acceden a los datos por su cuenta):

```
views.router → views.controller → service → repository → DAO → model
```

| Capa           | Responsabilidad                                            |
| -------------- | ---------------------------------------------------------- |
| **Router**     | Define las rutas y las conecta con su controller           |
| **Controller** | Lee `req`, llama al service y responde (`res` / `res.render`) |
| **Service**    | Reglas de negocio. No conoce `req`/`res` ni la base de datos |
| **Repository** | Métodos de acceso a datos, sin reglas de negocio           |
| **DAO**        | Única capa que habla con los modelos de Mongoose           |
| **Model**      | Esquemas de las colecciones de MongoDB                     |

No hay datos hardcodeados en las vistas: toda la información llega desde MongoDB a
través de las capas.

## Vistas (Handlebars)

| Ruta                    | Descripción                                                            |
| ----------------------- | --------------------------------------------------------------------- |
| `GET /`                 | Redirige a `/views/services`                                          |
| `GET /views/services`   | Lista los servicios desde MongoDB (nombre, descripción, duración, precio, categoría y disponibilidad) |
| `GET /views/availability` | Lista las reservas reales de la base de datos                        |

## Tiempo real (Socket.io)

Socket.io se inicializa en `server.js` sobre el mismo servidor HTTP de Express.

- El cliente (`public/js/socket.js`) se conecta y **escucha** los eventos.
- Las acciones reales del sistema **emiten** eventos cuando se modifican los datos
  (vía API REST o desde los botones de las vistas):

| Evento               | Cuándo se emite                                  |
| -------------------- | ------------------------------------------------ |
| `service:created`    | `POST /api/services`                             |
| `service:updated`    | `PUT /api/services/:sid`                         |
| `service:deleted`    | `DELETE /api/services/:sid`                      |
| `booking:created`    | `POST /api/bookings`                             |
| `booking:updated`    | `POST /api/bookings/:bid/services/:sid`          |

Al recibirlos, el navegador actualiza el listado **sin recargar la página** (agrega,
modifica o elimina la tarjeta correspondiente). Las vistas incluyen un botón para crear
un servicio o una reserva de ejemplo y ver el cambio en vivo.

## Requisitos

- Node.js 18 o superior (usa módulos ESM nativos).
- Una base de datos en **MongoDB Atlas** (o MongoDB local) accesible por URI.

## Instalación

```bash
npm install
```

## Variables de entorno

Creá un archivo `.env` en la raíz del proyecto, tomando como base `.env.example`:

| Variable    | Descripción                           | Ejemplo                                    |
| ----------- | ------------------------------------- | ------------------------------------------ |
| `PORT`      | Puerto del servidor                   | `8080`                                      |
| `NODE_ENV`  | Entorno de ejecución                  | `development`                               |
| `MONGO_URI` | Cadena de conexión de MongoDB (Atlas) | `mongodb+srv://usuario:pass@cluster/turnos` |

```
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/turnos
```

Si falta alguna de estas variables, la aplicación **falla al iniciar** con un mensaje
claro (validación en `src/config/env.config.js`).

## Ejecución

```bash
npm start
```

o en modo desarrollo (reinicio automático):

```bash
npm run dev
```

- Vistas: `http://localhost:8080/views/services`
- API: `http://localhost:8080/api/services`

## Estructura del proyecto

```
src/
  app.js                             # Express: motor de vistas, estáticos y routers
  server.js                          # Conexión a MongoDB + servidor HTTP + Socket.io
  config/
    env.config.js                    # Carga y valida las variables de entorno
    db.config.js                     # Conexión a MongoDB con Mongoose
  models/
    service.model.js                 # Esquema de Service
    booking.model.js                 # Esquema de Booking (services: [{ service: ObjectId, quantity }])
    message.model.js                 # Esquema de Message
  routes/
    services.router.js               # API de services -> controller
    bookings.router.js               # API de bookings -> controller
    views.router.js                  # Vistas -> views.controller
  controllers/
    services.controller.js           # API services (emite eventos socket)
    bookings.controller.js           # API bookings (emite eventos socket)
    views.controller.js              # Renderiza las vistas con datos reales
  services/
    services.service.js              # Reglas de negocio de servicios
    bookings.service.js              # Reglas de negocio de reservas (quantity)
  repositories/
    services.repository.js
    bookings.repository.js
  dao/
    services.dao.js                  # Mongoose <-> Service
    bookings.dao.js                  # Mongoose <-> Booking
  views/
    layouts/main.handlebars          # Layout principal (incluye socket.io)
    services.handlebars              # Listado de servicios
    availability.handlebars          # Listado de reservas
  public/
    css/styles.css                   # Estilos de las vistas
    js/socket.js                     # Cliente Socket.io (escucha y actualiza el DOM)
package.json
.env.example
.gitignore
README.md
```

## Endpoints de la API (sin cambios)

### `services`

| Método   | Ruta                 | Códigos   |
| -------- | -------------------- | --------- |
| `GET`    | `/api/services`      | 200       |
| `GET`    | `/api/services/:sid` | 200 / 404 |
| `POST`   | `/api/services`      | 201 / 400 |
| `PUT`    | `/api/services/:sid` | 200 / 404 |
| `DELETE` | `/api/services/:sid` | 200 / 404 |

### `bookings`

| Método | Ruta                               | Códigos   |
| ------ | ---------------------------------- | --------- |
| `POST` | `/api/bookings`                    | 201 / 400 |
| `GET`  | `/api/bookings/:bid`               | 200 / 404 |
| `POST` | `/api/bookings/:bid/services/:sid` | 200 / 404 |

## Ejemplos

```bash
# Crear un servicio (dispara service:created y actualiza la vista en vivo)
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Consulta general",
    "description": "Consulta médica general de 30 minutos",
    "duration": 30,
    "price": 5000,
    "category": "salud",
    "available": true
  }'

curl http://localhost:8080/api/services
curl http://localhost:8080/views/services
curl http://localhost:8080/views/availability
```
