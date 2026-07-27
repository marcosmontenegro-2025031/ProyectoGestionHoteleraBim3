import http from "http";
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

const enviarRespuesta = (res: http.ServerResponse, codigo: number, datos: any) => {
    res.writeHead(codigo, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(datos));
};

const obtenerDatos = (req: http.IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let datos = "";

        req.on("data", (parte) => {
            datos += parte;
        });

        req.on("end", () => {
            try {
                resolve(datos ? JSON.parse(datos) : {});
            } catch (error) {
                reject(error);
            }
        });

        req.on("error", reject);
    });
};

export const router = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    const metodo = req.method;
    const url = req.url || "/";
    const partes = url.split("/").filter(Boolean);

    try {
        // =========================
        // EMPLEADOS
        // =========================
        if (partes[1] === "empleados") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await empleadoService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await empleadoService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await empleadoService.crear(
                    datos.nombre,
                    datos.apellido,
                    datos.cargo
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await empleadoService.actualizar(
                    id,
                    datos.nombre,
                    datos.apellido,
                    datos.cargo
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await empleadoService.eliminar(id));
            }
        }

        // =========================
        // HUESPEDES
        // =========================
        if (partes[1] === "huespedes") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await huespedService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await huespedService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await huespedService.crear(
                    datos.nombre,
                    datos.apellido,
                    datos.dpi,
                    datos.telefono,
                    datos.correo
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await huespedService.actualizar(
                    id,
                    datos.nombre,
                    datos.apellido,
                    datos.dpi,
                    datos.telefono,
                    datos.correo
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await huespedService.eliminar(id));
            }
        }

        // =========================
        // USUARIOS
        // =========================
        if (partes[1] === "usuarios") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await usuarioService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await usuarioService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await usuarioService.crear(
                    datos.nombre,
                    datos.apellido,
                    datos.correo,
                    datos.contrasena,
                    datos.rol,
                    datos.empleado_id_empleado,
                    datos.huesped_id_huesped
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await usuarioService.actualizar(
                    id,
                    datos.nombre,
                    datos.apellido,
                    datos.correo,
                    datos.contrasena,
                    datos.rol,
                    datos.empleado_id_empleado,
                    datos.huesped_id_huesped
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await usuarioService.eliminar(id));
            }
        }

        // =========================
        // TIPOS DE HABITACION
        // =========================
        if (partes[1] === "tipos-habitacion") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await tipoHabitacionService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await tipoHabitacionService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await tipoHabitacionService.crear(
                    datos.nombre,
                    datos.descripcion
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await tipoHabitacionService.actualizar(
                    id,
                    datos.nombre,
                    datos.descripcion
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await tipoHabitacionService.eliminar(id));
            }
        }

        // =========================
        // HABITACIONES
        // =========================
        if (partes[1] === "habitaciones") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await habitacionService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await habitacionService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await habitacionService.crear(
                    datos.numero,
                    datos.estado,
                    datos.precio,
                    datos.id_tipo_habitacion
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await habitacionService.actualizar(
                    id,
                    datos.numero,
                    datos.estado,
                    datos.precio,
                    datos.id_tipo_habitacion
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await habitacionService.eliminar(id));
            }
        }

        // =========================
        // RESERVAS
        // =========================
        if (partes[1] === "reservas") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await reservaService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await reservaService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await reservaService.crear(
                    datos.fecha_entrada,
                    datos.fecha_salida,
                    datos.estado,
                    datos.id_huesped,
                    datos.id_empleado
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await reservaService.actualizar(
                    id,
                    datos.fecha_entrada,
                    datos.fecha_salida,
                    datos.estado,
                    datos.id_huesped,
                    datos.id_empleado
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await reservaService.eliminar(id));
            }
        }

        // =========================
        // DETALLE RESERVA
        // =========================
        if (partes[1] === "detalles-reserva") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await detalleReservaService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await detalleReservaService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await detalleReservaService.crear(
                    datos.id_reserva,
                    datos.id_habitacion
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await detalleReservaService.actualizar(
                    id,
                    datos.id_reserva,
                    datos.id_habitacion
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await detalleReservaService.eliminar(id));
            }
        }

        // =========================
        // HISTORIAL RESERVA
        // =========================
        if (partes[1] === "historial-reservas") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await historialReservaService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await historialReservaService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await historialReservaService.crear(
                    datos.estado_anterior,
                    datos.estado_nuevo,
                    datos.fecha,
                    datos.id_reserva
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await historialReservaService.actualizar(
                    id,
                    datos.estado_anterior,
                    datos.estado_nuevo,
                    datos.fecha,
                    datos.id_reserva
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await historialReservaService.eliminar(id));
            }
        }

        // =========================
        // SERVICIOS
        // =========================
        if (partes[1] === "servicios") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await servicioService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await servicioService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await servicioService.crear(
                    datos.nombre,
                    datos.precio
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await servicioService.actualizar(
                    id,
                    datos.nombre,
                    datos.precio
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await servicioService.eliminar(id));
            }
        }

        // =========================
        // CONSUMO SERVICIO
        // =========================
        if (partes[1] === "consumos-servicio") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await consumoServicioService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await consumoServicioService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await consumoServicioService.crear(
                    datos.cantidad,
                    datos.id_reserva,
                    datos.id_servicio
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await consumoServicioService.actualizar(
                    id,
                    datos.cantidad,
                    datos.id_reserva,
                    datos.id_servicio
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await consumoServicioService.eliminar(id));
            }
        }

        // =========================
        // METODOS DE PAGO
        // =========================
        if (partes[1] === "metodos-pago") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await metodoPagoService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await metodoPagoService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await metodoPagoService.crear(
                    datos.tipo
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await metodoPagoService.actualizar(
                    id,
                    datos.tipo
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await metodoPagoService.eliminar(id));
            }
        }

        // =========================
        // FACTURAS
        // =========================
        if (partes[1] === "facturas") {
            const id = Number(partes[2]);

            if (metodo === "GET" && !partes[2]) {
                return enviarRespuesta(res, 200, await facturaService.obtenerTodos());
            }

            if (metodo === "GET" && partes[2]) {
                return enviarRespuesta(res, 200, await facturaService.obtenerPorId(id));
            }

            if (metodo === "POST") {
                const datos = await obtenerDatos(req);
                const resultado = await facturaService.crear(
                    datos.numero_factura,
                    datos.total,
                    datos.fecha,
                    datos.id_reserva,
                    datos.id_metodo_pago
                );
                return enviarRespuesta(res, 201, resultado);
            }

            if (metodo === "PUT" && partes[2]) {
                const datos = await obtenerDatos(req);
                const resultado = await facturaService.actualizar(
                    id,
                    datos.numero_factura,
                    datos.total,
                    datos.fecha,
                    datos.id_reserva,
                    datos.id_metodo_pago
                );
                return enviarRespuesta(res, 200, resultado);
            }

            if (metodo === "DELETE" && partes[2]) {
                return enviarRespuesta(res, 200, await facturaService.eliminar(id));
            }
        }

        enviarRespuesta(res, 404, {
            mensaje: "Ruta no encontrada"
        });

    } catch (error) {
        enviarRespuesta(res, 500, {
            mensaje: "Error interno del servidor",
            error: error
        });
    }
};