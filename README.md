# Sistema de Gestión Hotelera

Sistema backend para la gestión de un hotel, desarrollado con TypeScript, Node.js, MySQL y Zod.

El proyecto permite administrar los principales procesos de un sistema hotelero mediante una arquitectura modular, validaciones de datos, servicios de negocio, clientes HTTP y conexión con una base de datos MySQL.

## Tecnologías utilizadas

* TypeScript
* Node.js
* MySQL
* mysql2
* Zod
* REST API
* PNPM

## Funcionalidades

El sistema contempla la gestión de:

* Empleados
* Huéspedes
* Usuarios
* Habitaciones
* Tipos de habitación
* Reservas
* Detalles de reserva
* Facturas
* Métodos de pago
* Servicios
* Consumo de servicios
* Historial de reservas

Cada módulo cuenta con modelos, validaciones y servicios correspondientes.

## Estructura del proyecto

```text
.
├── src/
│   │
│   ├── api/
│   │   ├── client/
│   │   │   ├── consumoServicioClient.ts
│   │   │   ├── detalleReservaClient.ts
│   │   │   ├── empleadoClient.ts
│   │   │   ├── facturaClient.ts
│   │   │   ├── habitacionClient.ts
│   │   │   ├── historialReservaClient.ts
│   │   │   ├── huespedClient.ts
│   │   │   ├── metodoPagoClient.ts
│   │   │   ├── reservaClient.ts
│   │   │   ├── servicioClient.ts
│   │   │   ├── tipoHabitacionClient.ts
│   │   │   └── usuarioClient.ts
│   │   │
│   │   └── validations/
│   │       ├── consumoServicioValidation.ts
│   │       ├── detalleReservaValidation.ts
│   │       ├── empleadoValidation.ts
│   │       ├── facturaValidation.ts
│   │       ├── habitacionValidation.ts
│   │       ├── historialReservaValidation.ts
│   │       ├── huespedValidation.ts
│   │       ├── metodoPagoValidation.ts
│   │       ├── reservaValidation.ts
│   │       ├── servicioValidation.ts
│   │       ├── tipoHabitacionValidation.ts
│   │       └── usuarioValidation.ts
│   │
│   ├── config/
│   │   └── database.ts
│   │
│   ├── models/
│   │   ├── cargoEmpleado.ts
│   │   ├── consumoServicio.ts
│   │   ├── detalleReserva.ts
│   │   ├── empleado.ts
│   │   ├── estadoHabitacion.ts
│   │   ├── estadoReserva.ts
│   │   ├── factura.ts
│   │   ├── habitacion.ts
│   │   ├── historialReserva.ts
│   │   ├── huesped.ts
│   │   ├── metodoPago.ts
│   │   ├── reserva.ts
│   │   ├── rolUsuario.ts
│   │   ├── servicio.ts
│   │   ├── tipoConsumoServicio.ts
│   │   └── usuario.ts
│   │
│   ├── services/
│   │   ├── consumoServicioService.ts
│   │   ├── detalleReservaService.ts
│   │   ├── empleadoService.ts
│   │   ├── facturaService.ts
│   │   ├── habitacionService.ts
│   │   ├── historialReservaService.ts
│   │   ├── huespedService.ts
│   │   ├── metodoPagoService.ts
│   │   ├── reservaService.ts
│   │   ├── servicioService.ts
│   │   ├── tipoHabitacionService.ts
│   │   └── usuarioService.ts
│   │
│   ├── utils/
│   │   ├── errores.ts
│   │   ├── index.ts
│   │   ├── readline.ts
│   │   ├── response.ts
│   │   └── validarId.ts
│   │
│   ├── errorHandler.ts
│   ├── router.ts
│   ├── server.ts
│   └── index.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

## Arquitectura

El proyecto está organizado mediante una separación de responsabilidades:

```text
Cliente
   |
   v
API / Client
   |
   v
Router
   |
   v
Validaciones Zod
   |
   v
Services
   |
   v
MySQL
```

El manejo de errores se realiza mediante un flujo centralizado:

```text
Error
  |
  v
errorHandler.ts
  |
  v
utils/errores.ts
  |
  v
utils/response.ts
  |
  v
Respuesta HTTP
```

## Descripción de las carpetas

### `src/api/client`

Contiene los clientes HTTP utilizados para consumir los diferentes servicios de la API.

Ejemplos:

```text
empleadoClient.ts
huespedClient.ts
usuarioClient.ts
habitacionClient.ts
reservaClient.ts
facturaClient.ts
```

### `src/api/validations`

Contiene los esquemas de validación desarrollados con Zod.

Cada entidad posee su propio archivo de validación.

Ejemplo:

```ts
import { z } from "zod";

export const empleadoSchema = z.object({

    nombre: z
        .string({
            error: "El nombre es obligatorio"
        })
        .min(3)
        .max(100),

    apellido: z
        .string({
            error: "El apellido es obligatorio"
        })
        .min(3)
        .max(100),

    cargo: z
        .string({
            error: "El cargo es obligatorio"
        })
        .min(3)
        .max(100)

});

export const validarEmpleado = (data: any) => {

    return empleadoSchema.parse(data);

};
```

Las validaciones permiten comprobar que los datos recibidos cumplan con las reglas establecidas antes de enviarlos a los servicios y a la base de datos.

### `src/config`

Contiene la configuración global de la aplicación.

Actualmente incluye la configuración de conexión con MySQL mediante:

```text
database.ts
```

### `src/models`

Contiene las interfaces, tipos y entidades utilizadas en TypeScript.

Incluye modelos como:

```text
empleado.ts
huesped.ts
usuario.ts
habitacion.ts
reserva.ts
factura.ts
servicio.ts
```

También contiene tipos relacionados con estados, roles y categorías:

```text
cargoEmpleado.ts
estadoHabitacion.ts
estadoReserva.ts
rolUsuario.ts
tipoConsumoServicio.ts
```

### `src/services`

Contiene la lógica de negocio y las operaciones relacionadas con la base de datos.

Cada módulo dispone de su propio servicio:

```text
empleadoService.ts
huespedService.ts
usuarioService.ts
habitacionService.ts
reservaService.ts
facturaService.ts
```

Los servicios implementan operaciones CRUD:

```text
CREATE
READ
UPDATE
DELETE
```

Por ejemplo, el servicio de empleados puede incluir:

```text
obtenerTodos()
obtenerPorId()
crear()
actualizar()
eliminar()
```

### `src/utils`

Contiene funciones auxiliares y reutilizables:

```text
errores.ts
index.ts
readline.ts
response.ts
validarId.ts
```

Estas utilidades permiten centralizar funciones comunes del proyecto.

### `errorHandler.ts`

Se encarga del manejo global de errores de la aplicación.

### `router.ts`

Contiene el enrutador principal de la API y determina qué operación debe ejecutarse según la ruta y el método HTTP.

### `server.ts`

Contiene la configuración y ejecución del servidor.

### `index.ts`

Es el punto de entrada principal de la aplicación.

## Base de datos

El sistema utiliza MySQL como gestor de base de datos.

Las principales entidades administradas son:

```text
Empleado
Huésped
Usuario
Habitación
Tipo de habitación
Reserva
Detalle de reserva
Factura
Método de pago
Servicio
Consumo de servicio
Historial de reserva
```

Estas entidades permiten representar los diferentes procesos relacionados con la administración de un hotel.

## Validaciones

El proyecto utiliza Zod para comprobar que los datos recibidos cumplan con las reglas establecidas.

El flujo general es:

```text
Datos recibidos
      |
      v
Schema de Zod
      |
      v
¿Datos válidos?
    /       \
   Sí        No
   |          |
   v          v
Service     Error
   |
   v
MySQL
```

Las validaciones permiten controlar aspectos como:

* Campos obligatorios
* Tipo de dato
* Longitud mínima
* Longitud máxima
* Formato de los datos
* IDs válidos
* Datos requeridos para crear o actualizar registros

## Manejo de errores

El proyecto contempla el manejo de diferentes tipos de errores:

* Datos inválidos
* Campos obligatorios faltantes
* IDs incorrectos
* Registros inexistentes
* Errores de conexión
* Errores de consultas SQL
* Errores internos del servidor

Los errores son gestionados mediante el sistema centralizado de manejo de errores del proyecto.

## Variables de entorno

Las credenciales y configuraciones sensibles deben almacenarse mediante variables de entorno.

El archivo:

```text
.env.example
```

sirve como plantilla para crear el archivo `.env`.

Ejemplo:

```env
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=DBGestionHotel
DB_PORT=3306
PORT=3000
```

El archivo `.env` no debe contenerse en el repositorio cuando incluya credenciales reales.

## Requisitos previos

Antes de ejecutar el proyecto se necesita tener instalado:

* Node.js
* PNPM
* MySQL

Para comprobar la instalación de Node.js:

```bash
node --version
```

Para comprobar la instalación de PNPM:

```bash
pnpm --version
```

Para comprobar la instalación de MySQL:

```bash
mysql --version
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Entrar al proyecto

```bash
cd nombre-del-proyecto
```

### 3. Instalar las dependencias

```bash
pnpm install
```

### 4. Configurar las variables de entorno

Crear el archivo `.env` utilizando `.env.example` como referencia.

Ejemplo:

```env
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=DBGestionHotel
DB_PORT=3306
PORT=3000
```

### 5. Configurar MySQL

Crear la base de datos correspondiente y comprobar que las credenciales configuradas permitan establecer correctamente la conexión.

## Ejecución

Para ejecutar el proyecto en modo desarrollo:

```bash
pnpm dev
```

Para compilar el proyecto:

```bash
pnpm build
```

Para ejecutar el proyecto compilado:

```bash
pnpm start
```

Los comandos anteriores deben estar definidos en el archivo `package.json`.

## API

La API utiliza métodos HTTP para administrar los diferentes recursos.

| Método | Operación              |
| ------ | ---------------------- |
| GET    | Obtener información    |
| POST   | Crear información      |
| PUT    | Actualizar información |
| DELETE | Eliminar información   |

### Ejemplo de rutas para empleados

```text
GET     /empleados
GET     /empleados/:id
POST    /empleados
PUT     /empleados/:id
DELETE  /empleados/:id
```

## Módulos

| Módulo               | Modelo | Validación | Service | Client |
| -------------------- | ------ | ---------- | ------- | ------ |
| Empleado             | Sí     | Sí         | Sí      | Sí     |
| Huésped              | Sí     | Sí         | Sí      | Sí     |
| Usuario              | Sí     | Sí         | Sí      | Sí     |
| Habitación           | Sí     | Sí         | Sí      | Sí     |
| Tipo de habitación   | Sí     | Sí         | Sí      | Sí     |
| Reserva              | Sí     | Sí         | Sí      | Sí     |
| Detalle de reserva   | Sí     | Sí         | Sí      | Sí     |
| Factura              | Sí     | Sí         | Sí      | Sí     |
| Método de pago       | Sí     | Sí         | Sí      | Sí     |
| Servicio             | Sí     | Sí         | Sí      | Sí     |
| Consumo de servicio  | Sí     | Sí         | Sí      | Sí     |
| Historial de reserva | Sí     | Sí         | Sí      | Sí     |

## Operaciones CRUD

El sistema implementa las operaciones principales de una API:

```text
CREATE  Crear registros
READ    Consultar registros
UPDATE  Actualizar registros
DELETE  Eliminar registros
```

## Pruebas

La API puede probarse utilizando herramientas como:

* Postman
* Insomnia
* Thunder Client
* REST Client

Se recomienda probar tanto casos exitosos como casos de error.

### Casos exitosos

```text
Datos válidos
IDs existentes
Creación correcta
Actualización correcta
Eliminación correcta
Consultas correctas
```

### Casos de error

```text
Campos obligatorios faltantes
Datos con formato incorrecto
IDs inválidos
Registros inexistentes
Errores de base de datos
```

## Códigos HTTP

| Código | Significado                            |
| ------ | -------------------------------------- |
| 200    | Operación realizada correctamente      |
| 201    | Recurso creado correctamente           |
| 400    | Solicitud incorrecta o datos inválidos |
| 404    | Recurso no encontrado                  |
| 500    | Error interno del servidor             |

## Flujo de una solicitud

```text
1. Cliente
      |
      v
2. Router
      |
      v
3. Validación Zod
      |
      v
4. Service
      |
      v
5. MySQL
      |
      v
6. Response
      |
      v
7. Cliente
```

En caso de error:

```text
Error
  |
  v
errorHandler
  |
  v
response
  |
  v
Cliente
```

## Scripts de PNPM

Los comandos principales del proyecto son:

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

La configuración de estos comandos se encuentra en:

```text
package.json
```

## Objetivos del proyecto

* Desarrollar una API para la gestión hotelera.
* Aplicar TypeScript en un proyecto backend.
* Trabajar con MySQL como base de datos relacional.
* Implementar operaciones CRUD.
* Validar datos utilizando Zod.
* Aplicar separación de responsabilidades.
* Organizar el código mediante módulos.
* Implementar manejo de errores.
* Utilizar interfaces y tipos de TypeScript.
* Facilitar el mantenimiento y escalabilidad del sistema.

## Conceptos aplicados

* TypeScript
* Node.js
* Programación Orientada a Objetos
* Interfaces
* Types
* Clases
* Encapsulamiento
* CRUD
* SQL
* MySQL
* REST API
* HTTP
* Zod
* Validación de datos
* Manejo de errores
* Variables de entorno
* Arquitectura modular
* Separación de responsabilidades
* PNPM

## Autor

Sistema de Gestión Hotelera.

©MarcosMontenegro
## Licencia
©MarcosMontenegro