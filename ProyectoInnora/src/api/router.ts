import http from "http";
import { ZodError } from "zod";

// ======================================================
// SERVICES
// ======================================================

import { empleadoService } from "../services/empleadoService";
import { huespedService } from "../services/huespedService";
import { usuarioService } from "../services/usuarioService";
import { tipoHabitacionService } from "../services/tipoHabitacion";
import { habitacionService } from "../services/habitacionService";
import { reservaService } from "../services/reservaService";
import { detalleReservaService } from "../services/detalleReservaService";
import { historialReservaService } from "../services/historialReservaService";
import { servicioService } from "../services/servicioService";
import { consumoServicioService } from "../services/consumoServicioService";
import { metodoPagoService } from "../services/metodoPagoService";
import { facturaService } from "../services/facturaService";

// ======================================================
// VALIDATIONS
// ======================================================

import { validarEmpleado } from "./validations/empleadoValidation";
import { validarHuesped } from "./validations/huespedValidation";
import { validarUsuario } from "./validations/usuarioValidation";
import { validarTipoHabitacion } from "./validations/tipoHabitacionValidation";
import { validarHabitacion } from "./validations/habitacionValidation";
import { validarReserva } from "./validations/reservaValidation";
import { validarDetalleReserva } from "./validations/detalleReservaValidation";
import { validarHistorialReserva } from "./validations/historialReservaValidation";
import { validarServicio } from "./validations/servicioValidation";
import { validarConsumoServicio } from "./validations/consumoServicioValidation";
import { validarMetodoPago } from "./validations/metodoPagoValidation";
import { validarFactura } from "./validations/facturaValidation";

// ======================================================
// TIPOS
// ======================================================

interface ResultadoMysql {
    affectedRows?: number;
    insertId?: number;
    warningCount?: number;
    [key: string]: any;
}

interface ErrorPersonalizado extends Error {
    code?: string;
    tipo?: string;
    errno?: number;
    sqlState?: string;
}

// ======================================================
// RESPUESTA JSON
// ======================================================

const enviarRespuesta = (
    res: http.ServerResponse,
    codigo: number,
    datos: any
): void => {

    if (res.writableEnded) {
        return;
    }

    res.writeHead(codigo, {
        "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify(datos));
};

// ======================================================
// LEER BODY
// ======================================================

const obtenerDatos = (
    req: http.IncomingMessage
): Promise<any> => {

    return new Promise((resolve, reject) => {

        let datos = "";

        req.on("data", (parte) => {
            datos += parte.toString();
        });

        req.on("end", () => {

            if (!datos.trim()) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(datos));
            } catch (error) {
                reject(error);
            }
        });

        req.on("error", reject);
    });
};

// ======================================================
// VALIDAR ID
// ======================================================

const validarId = (
    idTexto: string | undefined
): number | null => {

    if (!idTexto) {
        return null;
    }

    const id = Number(idTexto);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
};

// ======================================================
// REGISTRO AFECTADO
// ======================================================

const registroAfectado = (
    resultado: ResultadoMysql
): boolean => {

    return (
        resultado !== null &&
        resultado !== undefined &&
        typeof resultado.affectedRows === "number" &&
        resultado.affectedRows > 0
    );
};

// ======================================================
// OBTENER ERROR MYSQL
// ======================================================

const obtenerCodigoMysql = (
    error: any
): number | undefined => {

    if (
        error &&
        typeof error.errno === "number"
    ) {
        return error.errno;
    }

    return undefined;
};

const obtenerCodigoMysqlTexto = (
    error: any
): string | undefined => {

    if (
        error &&
        typeof error.code === "string"
    ) {
        return error.code;
    }

    return undefined;
};

// ======================================================
// MANEJAR ERRORES PERSONALIZADOS
// ======================================================

const manejarErrorPersonalizado = (
    res: http.ServerResponse,
    error: ErrorPersonalizado
): boolean => {

    const codigo = error?.code;
    const tipo = error?.tipo;

    // ==================================================
    // DUPLICADO PERSONALIZADO
    // ==================================================

    if (
        codigo === "DUPLICADO" ||
        tipo === "DUPLICADO"
    ) {

        enviarRespuesta(res, 409, {
            mensaje: error.message || "El registro ya existe"
        });

        return true;
    }

    // ==================================================
    // NO ENCONTRADO PERSONALIZADO
    // ==================================================

    if (
        codigo === "NOT_FOUND" ||
        codigo === "NO_ENCONTRADO" ||
        tipo === "NOT_FOUND" ||
        tipo === "NO_ENCONTRADO"
    ) {

        enviarRespuesta(res, 404, {
            mensaje: error.message || "Registro no encontrado"
        });

        return true;
    }

    // ==================================================
    // NO ACTUALIZADO
    // ==================================================

    if (
        codigo === "NOT_UPDATED" ||
        tipo === "NOT_UPDATED"
    ) {

        enviarRespuesta(res, 409, {
            mensaje: error.message || "No se pudo actualizar el registro"
        });

        return true;
    }

    return false;
};

// ======================================================
// MANEJAR ERRORES MYSQL
// ======================================================

const manejarErrorMysql = (
    res: http.ServerResponse,
    error: any
): boolean => {

    const codigoNumero =
        obtenerCodigoMysql(error);

    const codigoTexto =
        obtenerCodigoMysqlTexto(error);

    // ==================================================
    // DUPLICADO MYSQL
    // ER_DUP_ENTRY / 1062
    // ==================================================

    if (
        codigoNumero === 1062 ||
        codigoTexto === "ER_DUP_ENTRY"
    ) {

        enviarRespuesta(res, 409, {
            mensaje: "El registro ya existe",
            detalle:
                "Ya existe un registro con uno de los valores únicos enviados"
        });

        return true;
    }

    // ==================================================
    // FOREIGN KEY NO EXISTE
    // ==================================================

    if (
        codigoNumero === 1452 ||
        codigoTexto === "ER_NO_REFERENCED_ROW_2"
    ) {

        enviarRespuesta(res, 400, {
            mensaje:
                "No se puede realizar la operación porque uno de los registros relacionados no existe"
        });

        return true;
    }

    // ==================================================
    // FOREIGN KEY EN USO
    // ==================================================

    if (
        codigoNumero === 1451 ||
        codigoTexto === "ER_ROW_IS_REFERENCED_2"
    ) {

        enviarRespuesta(res, 409, {
            mensaje:
                "No se puede eliminar el registro porque está siendo utilizado por otros registros"
        });

        return true;
    }

    // ==================================================
    // NULL
    // ==================================================

    if (
        codigoNumero === 1048 ||
        codigoTexto === "ER_BAD_NULL_ERROR"
    ) {

        enviarRespuesta(res, 400, {
            mensaje:
                "No se permiten valores NULL en campos obligatorios"
        });

        return true;
    }

    // ==================================================
    // DATO DEMASIADO LARGO
    // ==================================================

    if (
        codigoNumero === 1406 ||
        codigoTexto === "ER_DATA_TOO_LONG"
    ) {

        enviarRespuesta(res, 400, {
            mensaje:
                "Uno de los valores enviados supera la longitud permitida"
        });

        return true;
    }

    // ==================================================
    // TIPO DE DATO INCORRECTO
    // ==================================================

    if (
        codigoNumero === 1366 ||
        codigoTexto === "ER_TRUNCATED_WRONG_VALUE"
    ) {

        enviarRespuesta(res, 400, {
            mensaje:
                "Uno de los valores enviados tiene un tipo de dato inválido"
        });

        return true;
    }

    return false;
};

// ======================================================
// ROUTER
// ======================================================

export const router = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
): Promise<void> => {

    const metodo = req.method || "GET";
    const url = req.url || "/";
    const partes = url.split("/").filter(Boolean);

    try {

        // ==================================================
        // EMPLEADOS
        // ==================================================

        if (partes[0] === "empleados") {

            const id = validarId(partes[1]);

            // GET TODOS
            if (metodo === "GET" && !partes[1]) {

                const resultado =
                    await empleadoService.obtenerTodos();

                return enviarRespuesta(res, 200, resultado);
            }

            // GET POR ID
            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de empleado inválido"
                    });
                }

                const resultado =
                    await empleadoService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Empleado no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            // POST
            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);

                const v = validarEmpleado(datos);

                const resultado =
                    await empleadoService.crear(
                        v.nombre,
                        v.apellido,
                        v.cargo
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            // PUT
            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de empleado inválido"
                    });
                }

                const datos = await obtenerDatos(req);

                const v = validarEmpleado(datos);

                const resultado =
                    await empleadoService.actualizar(
                        id,
                        v.nombre,
                        v.apellido,
                        v.cargo
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            // DELETE
            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de empleado inválido"
                    });
                }

                const resultado =
                    await empleadoService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para empleados"
            });
        }

        // ==================================================
        // HUESPEDES
        // ==================================================

        if (partes[0] === "huespedes") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await huespedService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de huésped inválido"
                    });
                }

                const resultado =
                    await huespedService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Huésped no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarHuesped(datos);

                const resultado =
                    await huespedService.crear(
                        v.nombre,
                        v.apellido,
                        v.dpi,
                        v.telefono,
                        v.correo
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de huésped inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarHuesped(datos);

                const resultado =
                    await huespedService.actualizar(
                        id,
                        v.nombre,
                        v.apellido,
                        v.dpi,
                        v.telefono,
                        v.correo
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de huésped inválido"
                    });
                }

                const resultado =
                    await huespedService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para huéspedes"
            });
        }

        // ==================================================
        // USUARIOS
        // ==================================================

        if (partes[0] === "usuarios") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await usuarioService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de usuario inválido"
                    });
                }

                const resultado =
                    await usuarioService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Usuario no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarUsuario(datos);

                const resultado =
                    await usuarioService.crear(
                        v.nombre,
                        v.apellido,
                        v.correo,
                        v.contrasena,
                        v.rol,
                        v.empleado_id_empleado,
                        v.huesped_id_huesped
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de usuario inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarUsuario(datos);

                const resultado =
                    await usuarioService.actualizar(
                        id,
                        v.nombre,
                        v.apellido,
                        v.correo,
                        v.contrasena,
                        v.rol,
                        v.empleado_id_empleado,
                        v.huesped_id_huesped
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de usuario inválido"
                    });
                }

                const resultado =
                    await usuarioService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para usuarios"
            });
        }

        // ==================================================
        // TIPOS DE HABITACIÓN
        // ==================================================

        if (partes[0] === "tipos-habitacion") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await tipoHabitacionService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de tipo de habitación inválido"
                    });
                }

                const resultado =
                    await tipoHabitacionService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Tipo de habitación no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarTipoHabitacion(datos);

                const resultado =
                    await tipoHabitacionService.crear(
                        v.nombre,
                        v.descripcion
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de tipo de habitación inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarTipoHabitacion(datos);

                const resultado =
                    await tipoHabitacionService.actualizar(
                        id,
                        v.nombre,
                        v.descripcion
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de tipo de habitación inválido"
                    });
                }

                const resultado =
                    await tipoHabitacionService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para tipos de habitación"
            });
        }

        // ==================================================
        // HABITACIONES
        // ==================================================

        if (partes[0] === "habitaciones") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await habitacionService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de habitación inválido"
                    });
                }

                const resultado =
                    await habitacionService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Habitación no encontrada",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarHabitacion(datos);

                const resultado =
                    await habitacionService.crear(
                        v.numero,
                        v.estado,
                        v.precio,
                        v.id_tipo_habitacion
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de habitación inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarHabitacion(datos);

                const resultado =
                    await habitacionService.actualizar(
                        id,
                        v.numero,
                        v.estado,
                        v.precio,
                        v.id_tipo_habitacion
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de habitación inválido"
                    });
                }

                const resultado =
                    await habitacionService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para habitaciones"
            });
        }

        // ==================================================
        // RESERVAS
        // ==================================================

        if (partes[0] === "reservas") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await reservaService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de reserva inválido"
                    });
                }

                const resultado =
                    await reservaService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Reserva no encontrada",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarReserva(datos);

                const resultado =
                    await reservaService.crear(
                        v.fecha_entrada,
                        v.fecha_salida,
                        v.estado,
                        v.id_huesped,
                        v.id_empleado
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de reserva inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarReserva(datos);

                const resultado =
                    await reservaService.actualizar(
                        id,
                        v.fecha_entrada,
                        v.fecha_salida,
                        v.estado,
                        v.id_huesped,
                        v.id_empleado
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de reserva inválido"
                    });
                }

                const resultado =
                    await reservaService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para reservas"
            });
        }

        // ==================================================
        // DETALLES DE RESERVA
        // ==================================================

        if (partes[0] === "detalles-reserva") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await detalleReservaService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de detalle de reserva inválido"
                    });
                }

                const resultado =
                    await detalleReservaService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Detalle de reserva no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarDetalleReserva(datos);

                const resultado =
                    await detalleReservaService.crear(
                        v.id_reserva,
                        v.id_habitacion
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de detalle de reserva inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarDetalleReserva(datos);

                const resultado =
                    await detalleReservaService.actualizar(
                        id,
                        v.id_reserva,
                        v.id_habitacion
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de detalle de reserva inválido"
                    });
                }

                const resultado =
                    await detalleReservaService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para detalles de reserva"
            });
        }

        // ==================================================
        // HISTORIAL DE RESERVAS
        // ==================================================

        if (partes[0] === "historial-reservas") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await historialReservaService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de historial inválido"
                    });
                }

                const resultado =
                    await historialReservaService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Historial de reserva no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarHistorialReserva(datos);

                const resultado =
                    await historialReservaService.crear(
                        v.estado_anterior,
                        v.estado_nuevo,
                        v.fecha,
                        v.id_reserva
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de historial inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarHistorialReserva(datos);

                const resultado =
                    await historialReservaService.actualizar(
                        id,
                        v.estado_anterior,
                        v.estado_nuevo,
                        v.fecha,
                        v.id_reserva
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de historial inválido"
                    });
                }

                const resultado =
                    await historialReservaService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para historial de reservas"
            });
        }

        // ==================================================
        // SERVICIOS
        // ==================================================

        if (partes[0] === "servicios") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await servicioService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de servicio inválido"
                    });
                }

                const resultado =
                    await servicioService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Servicio no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarServicio(datos);

                const resultado =
                    await servicioService.crear(
                        v.nombre,
                        v.precio
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de servicio inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarServicio(datos);

                const resultado =
                    await servicioService.actualizar(
                        id,
                        v.nombre,
                        v.precio
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de servicio inválido"
                    });
                }

                const resultado =
                    await servicioService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para servicios"
            });
        }

        // ==================================================
        // CONSUMOS DE SERVICIO
        // ==================================================

        if (partes[0] === "consumos-servicio") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await consumoServicioService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de consumo de servicio inválido"
                    });
                }

                const resultado =
                    await consumoServicioService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Consumo de servicio no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarConsumoServicio(datos);

                const resultado =
                    await consumoServicioService.crear(
                        v.cantidad,
                        v.id_reserva,
                        v.id_servicio
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de consumo de servicio inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarConsumoServicio(datos);

                const resultado =
                    await consumoServicioService.actualizar(
                        id,
                        v.cantidad,
                        v.id_reserva,
                        v.id_servicio
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de consumo de servicio inválido"
                    });
                }

                const resultado =
                    await consumoServicioService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para consumos de servicio"
            });
        }

        // ==================================================
        // MÉTODOS DE PAGO
        // ==================================================

        if (partes[0] === "metodos-pago") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await metodoPagoService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de método de pago inválido"
                    });
                }

                const resultado =
                    await metodoPagoService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Método de pago no encontrado",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarMetodoPago(datos);

                const resultado =
                    await metodoPagoService.crear(v.tipo);

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de método de pago inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarMetodoPago(datos);

                const resultado =
                    await metodoPagoService.actualizar(
                        id,
                        v.tipo
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de método de pago inválido"
                    });
                }

                const resultado =
                    await metodoPagoService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para métodos de pago"
            });
        }

        // ==================================================
        // FACTURAS
        // ==================================================

        if (partes[0] === "facturas") {

            const id = validarId(partes[1]);

            if (metodo === "GET" && !partes[1]) {

                return enviarRespuesta(
                    res,
                    200,
                    await facturaService.obtenerTodos()
                );
            }

            if (metodo === "GET" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de factura inválido"
                    });
                }

                const resultado =
                    await facturaService.obtenerPorId(id);

                if (!resultado) {
                    return enviarRespuesta(res, 404, {
                        mensaje: "Factura no encontrada",
                        id
                    });
                }

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "POST" && !partes[1]) {

                const datos = await obtenerDatos(req);
                const v = validarFactura(datos);

                const resultado =
                    await facturaService.crear(
                        v.numero_factura,
                        v.total,
                        v.fecha,
                        v.id_reserva,
                        v.id_metodo_pago
                    );

                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de factura inválido"
                    });
                }

                const datos = await obtenerDatos(req);
                const v = validarFactura(datos);

                const resultado =
                    await facturaService.actualizar(
                        id,
                        v.numero_factura,
                        v.total,
                        v.fecha,
                        v.id_reserva,
                        v.id_metodo_pago
                    );

                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[1]) {

                if (id === null) {
                    return enviarRespuesta(res, 400, {
                        mensaje: "ID de factura inválido"
                    });
                }

                const resultado =
                    await facturaService.eliminar(id);

                return enviarRespuesta(res, 200, resultado);
            }

            return enviarRespuesta(res, 405, {
                mensaje: "Método no permitido para facturas"
            });
        }

        // ==================================================
        // RUTA NO ENCONTRADA
        // ==================================================

        return enviarRespuesta(res, 404, {
            mensaje: "Ruta no encontrada"
        });

    } catch (error: any) {

        // ==================================================
        // ERROR ZOD
        // ==================================================

        if (error instanceof ZodError) {

            return enviarRespuesta(res, 400, {
                mensaje: "Error de validación",

                errores: error.issues.map((detalle) => ({
                    campo:
                        detalle.path.length > 0
                            ? detalle.path.join(".")
                            : "body",

                    mensaje: detalle.message
                }))
            });
        }

        // ==================================================
        // ERROR PERSONALIZADO DEL SERVICE
        // ==================================================

        if (
            manejarErrorPersonalizado(
                res,
                error as ErrorPersonalizado
            )
        ) {
            return;
        }

        // ==================================================
        // ERROR MYSQL
        // ==================================================

        if (manejarErrorMysql(res, error)) {
            return;
        }

        // ==================================================
        // JSON INVÁLIDO
        // ==================================================

        if (error instanceof SyntaxError) {

            return enviarRespuesta(res, 400, {
                mensaje:
                    "El cuerpo de la solicitud contiene JSON inválido"
            });
        }

        // ==================================================
        // ERROR DESCONOCIDO
        // ==================================================

        console.error("=================================");
        console.error("ERROR EN ROUTER");
        console.error(error);
        console.error("=================================");

        return enviarRespuesta(res, 500, {
            mensaje: "Error interno del servidor"
        });
    }
};