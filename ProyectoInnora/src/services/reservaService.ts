import db from "../config/database";

export class ReservaService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Reserva",
                (error, resultados: any) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(resultados as any[]);
                }
            );

        });
    }


    // ======================================================
    // OBTENER POR ID
    // ======================================================

    obtenerPorId(id: number): Promise<any | null> {

        return new Promise((resolve, reject) => {

            db.query(
                `SELECT *
                 FROM Reserva
                 WHERE id_reserva = ?
                 LIMIT 1`,
                [id],
                (error, resultados: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (
                        !resultados ||
                        resultados.length === 0
                    ) {
                        resolve(null);
                        return;
                    }

                    resolve(resultados[0]);
                }
            );

        });
    }


    // ======================================================
    // CREAR
    // ======================================================

    crear(
        fecha_entrada: string,
        fecha_salida: string,
        estado: string,
        id_huesped: number,
        id_empleado: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // --------------------------------------------------
            // VALIDAR FECHA DE ENTRADA
            // --------------------------------------------------

            if (
                fecha_entrada === null ||
                fecha_entrada === undefined ||
                typeof fecha_entrada !== "string" ||
                fecha_entrada.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de entrada es obligatoria"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR FECHA DE SALIDA
            // --------------------------------------------------

            if (
                fecha_salida === null ||
                fecha_salida === undefined ||
                typeof fecha_salida !== "string" ||
                fecha_salida.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de salida es obligatoria"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR ESTADO
            // --------------------------------------------------

            if (
                estado === null ||
                estado === undefined ||
                typeof estado !== "string" ||
                estado.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El estado de la reserva es obligatorio"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR HUÉSPED
            // --------------------------------------------------

            if (
                !Number.isInteger(id_huesped) ||
                id_huesped <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del huésped no es válido"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR EMPLEADO
            // --------------------------------------------------

            if (
                !Number.isInteger(id_empleado) ||
                id_empleado <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del empleado no es válido"
                });

                return;
            }


            // --------------------------------------------------
            // NORMALIZAR
            // --------------------------------------------------

            const entradaTexto = fecha_entrada.trim();
            const salidaTexto = fecha_salida.trim();
            const estadoNormalizado = estado.trim();


            // --------------------------------------------------
            // VALIDAR FECHAS
            // --------------------------------------------------

            const entrada = new Date(entradaTexto);
            const salida = new Date(salidaTexto);

            if (
                Number.isNaN(entrada.getTime()) ||
                Number.isNaN(salida.getTime())
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "Las fechas de la reserva no son válidas"
                });

                return;
            }


            // --------------------------------------------------
            // COMPARAR FECHAS
            // --------------------------------------------------

            if (salida <= entrada) {

                reject({
                    tipo: "VALIDACION",
                    mensaje:
                        "La fecha de salida debe ser posterior a la fecha de entrada"
                });

                return;
            }


            // --------------------------------------------------
            // VERIFICAR HUÉSPED
            // --------------------------------------------------

            db.query(
                `SELECT id_huesped
                 FROM Huesped
                 WHERE id_huesped = ?
                 LIMIT 1`,
                [id_huesped],
                (errorHuesped, huespedes: any[]) => {

                    if (errorHuesped) {
                        reject(errorHuesped);
                        return;
                    }

                    if (
                        !huespedes ||
                        huespedes.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "El huésped no existe"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // VERIFICAR EMPLEADO
                    // --------------------------------------------------

                    db.query(
                        `SELECT id_empleado
                         FROM Empleado
                         WHERE id_empleado = ?
                         LIMIT 1`,
                        [id_empleado],
                        (errorEmpleado, empleados: any[]) => {

                            if (errorEmpleado) {
                                reject(errorEmpleado);
                                return;
                            }

                            if (
                                !empleados ||
                                empleados.length === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje: "El empleado no existe"
                                });

                                return;
                            }


                            // --------------------------------------------------
                            // INSERTAR
                            // --------------------------------------------------

                            db.query(
                                `INSERT INTO Reserva
                                (
                                    fecha_entrada,
                                    fecha_salida,
                                    estado,
                                    id_huesped,
                                    id_empleado
                                )
                                VALUES (?, ?, ?, ?, ?)`,
                                [
                                    entradaTexto,
                                    salidaTexto,
                                    estadoNormalizado,
                                    id_huesped,
                                    id_empleado
                                ],
                                (error, resultado: any) => {

                                    if (error) {

                                        if (
                                            error.code === "ER_DUP_ENTRY"
                                        ) {

                                            reject({
                                                tipo: "DUPLICADO",
                                                mensaje:
                                                    "La reserva ya existe"
                                            });

                                            return;
                                        }

                                        if (
                                            error.code ===
                                            "ER_NO_REFERENCED_ROW_2"
                                        ) {

                                            reject({
                                                tipo: "REFERENCIA",
                                                mensaje:
                                                    "El huésped o empleado no existe"
                                            });

                                            return;
                                        }

                                        reject(error);
                                        return;
                                    }

                                    resolve({
                                        mensaje:
                                            "Reserva creada correctamente",

                                        reserva: {
                                            id_reserva:
                                                resultado.insertId,

                                            fecha_entrada:
                                                entradaTexto,

                                            fecha_salida:
                                                salidaTexto,

                                            estado:
                                                estadoNormalizado,

                                            id_huesped,

                                            id_empleado
                                        }
                                    });

                                }
                            );

                        }
                    );

                }
            );

        });
    }


    // ======================================================
    // ACTUALIZAR
    // ======================================================

    actualizar(
        id: number,
        fecha_entrada: string,
        fecha_salida: string,
        estado: string,
        id_huesped: number,
        id_empleado: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // --------------------------------------------------
            // VALIDAR ID
            // --------------------------------------------------

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR FECHA ENTRADA
            // --------------------------------------------------

            if (
                fecha_entrada === null ||
                fecha_entrada === undefined ||
                typeof fecha_entrada !== "string" ||
                fecha_entrada.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de entrada es obligatoria"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR FECHA SALIDA
            // --------------------------------------------------

            if (
                fecha_salida === null ||
                fecha_salida === undefined ||
                typeof fecha_salida !== "string" ||
                fecha_salida.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de salida es obligatoria"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR ESTADO
            // --------------------------------------------------

            if (
                estado === null ||
                estado === undefined ||
                typeof estado !== "string" ||
                estado.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El estado de la reserva es obligatorio"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR HUÉSPED
            // --------------------------------------------------

            if (
                !Number.isInteger(id_huesped) ||
                id_huesped <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del huésped no es válido"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR EMPLEADO
            // --------------------------------------------------

            if (
                !Number.isInteger(id_empleado) ||
                id_empleado <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del empleado no es válido"
                });

                return;
            }


            const entradaTexto = fecha_entrada.trim();
            const salidaTexto = fecha_salida.trim();
            const estadoNormalizado = estado.trim();


            // --------------------------------------------------
            // VALIDAR FECHAS
            // --------------------------------------------------

            const entrada = new Date(entradaTexto);
            const salida = new Date(salidaTexto);

            if (
                Number.isNaN(entrada.getTime()) ||
                Number.isNaN(salida.getTime())
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "Las fechas de la reserva no son válidas"
                });

                return;
            }


            if (salida <= entrada) {

                reject({
                    tipo: "VALIDACION",
                    mensaje:
                        "La fecha de salida debe ser posterior a la fecha de entrada"
                });

                return;
            }


            // --------------------------------------------------
            // VERIFICAR RESERVA
            // --------------------------------------------------

            db.query(
                `SELECT id_reserva
                 FROM Reserva
                 WHERE id_reserva = ?
                 LIMIT 1`,
                [id],
                (errorReserva, reservas: any[]) => {

                    if (errorReserva) {
                        reject(errorReserva);
                        return;
                    }

                    if (
                        !reservas ||
                        reservas.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "La reserva no existe"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // VERIFICAR HUÉSPED
                    // --------------------------------------------------

                    db.query(
                        `SELECT id_huesped
                         FROM Huesped
                         WHERE id_huesped = ?
                         LIMIT 1`,
                        [id_huesped],
                        (errorHuesped, huespedes: any[]) => {

                            if (errorHuesped) {
                                reject(errorHuesped);
                                return;
                            }

                            if (
                                !huespedes ||
                                huespedes.length === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje: "El huésped no existe"
                                });

                                return;
                            }


                            // --------------------------------------------------
                            // VERIFICAR EMPLEADO
                            // --------------------------------------------------

                            db.query(
                                `SELECT id_empleado
                                 FROM Empleado
                                 WHERE id_empleado = ?
                                 LIMIT 1`,
                                [id_empleado],
                                (errorEmpleado, empleados: any[]) => {

                                    if (errorEmpleado) {
                                        reject(errorEmpleado);
                                        return;
                                    }

                                    if (
                                        !empleados ||
                                        empleados.length === 0
                                    ) {

                                        reject({
                                            tipo: "NO_ENCONTRADO",
                                            mensaje: "El empleado no existe"
                                        });

                                        return;
                                    }


                                    // --------------------------------------------------
                                    // ACTUALIZAR
                                    // --------------------------------------------------

                                    db.query(
                                        `UPDATE Reserva
                                         SET
                                            fecha_entrada = ?,
                                            fecha_salida = ?,
                                            estado = ?,
                                            id_huesped = ?,
                                            id_empleado = ?
                                         WHERE id_reserva = ?`,
                                        [
                                            entradaTexto,
                                            salidaTexto,
                                            estadoNormalizado,
                                            id_huesped,
                                            id_empleado,
                                            id
                                        ],
                                        (error, resultado: any) => {

                                            if (error) {

                                                if (
                                                    error.code ===
                                                    "ER_DUP_ENTRY"
                                                ) {

                                                    reject({
                                                        tipo: "DUPLICADO",
                                                        mensaje:
                                                            "Los datos de la reserva ya existen"
                                                    });

                                                    return;
                                                }

                                                if (
                                                    error.code ===
                                                    "ER_NO_REFERENCED_ROW_2"
                                                ) {

                                                    reject({
                                                        tipo: "REFERENCIA",
                                                        mensaje:
                                                            "El huésped o empleado no existe"
                                                    });

                                                    return;
                                                }

                                                reject(error);
                                                return;
                                            }

                                            if (
                                                resultado.affectedRows === 0
                                            ) {

                                                reject({
                                                    tipo: "NO_ACTUALIZADO",
                                                    mensaje:
                                                        "No se pudo actualizar la reserva"
                                                });

                                                return;
                                            }

                                            resolve({
                                                mensaje:
                                                    "Reserva actualizada correctamente",

                                                reserva: {
                                                    id_reserva: id,
                                                    fecha_entrada:
                                                        entradaTexto,
                                                    fecha_salida:
                                                        salidaTexto,
                                                    estado:
                                                        estadoNormalizado,
                                                    id_huesped,
                                                    id_empleado
                                                }
                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        });
    }


    // ======================================================
    // ELIMINAR
    // ======================================================

    eliminar(id: number): Promise<any> {

        return new Promise((resolve, reject) => {

            // --------------------------------------------------
            // VALIDAR ID
            // --------------------------------------------------

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });

                return;
            }


            // --------------------------------------------------
            // VERIFICAR QUE EXISTA
            // --------------------------------------------------

            db.query(
                `SELECT id_reserva
                 FROM Reserva
                 WHERE id_reserva = ?
                 LIMIT 1`,
                [id],
                (errorBusqueda, reservas: any[]) => {

                    if (errorBusqueda) {
                        reject(errorBusqueda);
                        return;
                    }

                    if (
                        !reservas ||
                        reservas.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "La reserva no existe"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // ELIMINAR
                    // --------------------------------------------------

                    db.query(
                        `DELETE FROM Reserva
                         WHERE id_reserva = ?`,
                        [id],
                        (error, resultado: any) => {

                            if (error) {

                                if (
                                    error.code ===
                                    "ER_ROW_IS_REFERENCED_2"
                                ) {

                                    reject({
                                        tipo: "REFERENCIA",
                                        mensaje:
                                            "No se puede eliminar la reserva porque tiene registros relacionados"
                                    });

                                    return;
                                }

                                reject(error);
                                return;
                            }

                            if (
                                resultado.affectedRows === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje: "La reserva no existe"
                                });

                                return;
                            }

                            resolve({
                                mensaje:
                                    "Reserva eliminada correctamente",

                                id_reserva: id
                            });

                        }
                    );

                }
            );

        });
    }

}


// ======================================================
// INSTANCIA
// ======================================================

export const reservaService =
    new ReservaService();