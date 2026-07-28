import db from "../config/database";

export class DetalleReservaService {

    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM DetalleReserva",
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


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(id: number): Promise<any | null> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ID
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del detalle de reserva no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // BUSCAR DETALLE
            // ---------------------------------------------

            db.query(
                `SELECT *
                 FROM DetalleReserva
                 WHERE id_detalle = ?`,
                [id],
                (error, resultados: any) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!resultados || resultados.length === 0) {
                        resolve(null);
                        return;
                    }

                    resolve(resultados[0]);
                }
            );

        });
    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        id_reserva: number,
        id_habitacion: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR RESERVA
            // ---------------------------------------------

            if (!Number.isInteger(id_reserva) || id_reserva <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR HABITACIÓN
            // ---------------------------------------------

            if (!Number.isInteger(id_habitacion) || id_habitacion <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la habitación no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR RESERVA
            // ---------------------------------------------

            db.query(
                `SELECT id_reserva
                 FROM Reserva
                 WHERE id_reserva = ?
                 LIMIT 1`,
                [id_reserva],
                (errorReserva, reservas: any) => {

                    if (errorReserva) {
                        reject(errorReserva);
                        return;
                    }

                    if (!reservas || reservas.length === 0) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "La reserva indicada no existe"
                        });

                        return;
                    }


                    // -----------------------------------------
                    // VERIFICAR HABITACIÓN
                    // -----------------------------------------

                    db.query(
                        `SELECT id_habitacion
                         FROM Habitacion
                         WHERE id_habitacion = ?
                         LIMIT 1`,
                        [id_habitacion],
                        (errorHabitacion, habitaciones: any) => {

                            if (errorHabitacion) {
                                reject(errorHabitacion);
                                return;
                            }

                            if (
                                !habitaciones ||
                                habitaciones.length === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje: "La habitación indicada no existe"
                                });

                                return;
                            }


                            // ---------------------------------
                            // VERIFICAR DUPLICADO
                            // ---------------------------------

                            db.query(
                                `SELECT id_detalle
                                 FROM DetalleReserva
                                 WHERE id_reserva = ?
                                 AND id_habitacion = ?
                                 LIMIT 1`,
                                [
                                    id_reserva,
                                    id_habitacion
                                ],
                                (errorDuplicado, detalles: any) => {

                                    if (errorDuplicado) {
                                        reject(errorDuplicado);
                                        return;
                                    }

                                    if (
                                        detalles &&
                                        detalles.length > 0
                                    ) {

                                        reject({
                                            tipo: "DUPLICADO",
                                            mensaje:
                                                "La habitación ya está registrada en esta reserva"
                                        });

                                        return;
                                    }


                                    // ---------------------------------
                                    // INSERTAR
                                    // ---------------------------------

                                    db.query(
                                        `INSERT INTO DetalleReserva
                                        (
                                            id_reserva,
                                            id_habitacion
                                        )
                                        VALUES (?, ?)`,
                                        [
                                            id_reserva,
                                            id_habitacion
                                        ],
                                        (error, resultado: any) => {

                                            if (error) {

                                                // -----------------------------
                                                // DUPLICADO MYSQL
                                                // -----------------------------

                                                if (
                                                    error.code ===
                                                    "ER_DUP_ENTRY"
                                                ) {

                                                    reject({
                                                        tipo: "DUPLICADO",
                                                        mensaje:
                                                            "Este detalle de reserva ya existe"
                                                    });

                                                    return;
                                                }


                                                // -----------------------------
                                                // ERROR DE REFERENCIA
                                                // -----------------------------

                                                if (
                                                    error.code ===
                                                    "ER_NO_REFERENCED_ROW_2"
                                                ) {

                                                    reject({
                                                        tipo: "REFERENCIA",
                                                        mensaje:
                                                            "La reserva o habitación indicada no existe"
                                                    });

                                                    return;
                                                }


                                                reject(error);
                                                return;
                                            }


                                            resolve({
                                                mensaje:
                                                    "Detalle de reserva creado correctamente",

                                                detalle: {
                                                    id_detalle:
                                                        resultado.insertId,

                                                    id_reserva,

                                                    id_habitacion
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


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar(
        id: number,
        id_reserva: number,
        id_habitacion: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ID DETALLE
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje:
                        "El ID del detalle de reserva no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR ID RESERVA
            // ---------------------------------------------

            if (
                !Number.isInteger(id_reserva) ||
                id_reserva <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR ID HABITACIÓN
            // ---------------------------------------------

            if (
                !Number.isInteger(id_habitacion) ||
                id_habitacion <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje:
                        "El ID de la habitación no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR DETALLE
            // ---------------------------------------------

            db.query(
                `SELECT id_detalle
                 FROM DetalleReserva
                 WHERE id_detalle = ?
                 LIMIT 1`,
                [id],
                (errorDetalle, detalles: any) => {

                    if (errorDetalle) {
                        reject(errorDetalle);
                        return;
                    }

                    if (
                        !detalles ||
                        detalles.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "El detalle de reserva no existe"
                        });

                        return;
                    }


                    // -----------------------------------------
                    // VERIFICAR RESERVA
                    // -----------------------------------------

                    db.query(
                        `SELECT id_reserva
                         FROM Reserva
                         WHERE id_reserva = ?
                         LIMIT 1`,
                        [id_reserva],
                        (errorReserva, reservas: any) => {

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
                                    mensaje:
                                        "La reserva indicada no existe"
                                });

                                return;
                            }


                            // ---------------------------------
                            // VERIFICAR HABITACIÓN
                            // ---------------------------------

                            db.query(
                                `SELECT id_habitacion
                                 FROM Habitacion
                                 WHERE id_habitacion = ?
                                 LIMIT 1`,
                                [id_habitacion],
                                (
                                    errorHabitacion,
                                    habitaciones: any
                                ) => {

                                    if (errorHabitacion) {
                                        reject(errorHabitacion);
                                        return;
                                    }

                                    if (
                                        !habitaciones ||
                                        habitaciones.length === 0
                                    ) {

                                        reject({
                                            tipo: "NO_ENCONTRADO",
                                            mensaje:
                                                "La habitación indicada no existe"
                                        });

                                        return;
                                    }


                                    // ---------------------------------
                                    // VERIFICAR DUPLICADO
                                    // ---------------------------------

                                    db.query(
                                        `SELECT id_detalle
                                         FROM DetalleReserva
                                         WHERE id_reserva = ?
                                         AND id_habitacion = ?
                                         AND id_detalle <> ?
                                         LIMIT 1`,
                                        [
                                            id_reserva,
                                            id_habitacion,
                                            id
                                        ],
                                        (
                                            errorDuplicado,
                                            duplicados: any
                                        ) => {

                                            if (errorDuplicado) {
                                                reject(errorDuplicado);
                                                return;
                                            }

                                            if (
                                                duplicados &&
                                                duplicados.length > 0
                                            ) {

                                                reject({
                                                    tipo: "DUPLICADO",
                                                    mensaje:
                                                        "La habitación ya está registrada en esta reserva"
                                                });

                                                return;
                                            }


                                            // -----------------------------
                                            // ACTUALIZAR
                                            // -----------------------------

                                            db.query(
                                                `UPDATE DetalleReserva
                                                 SET
                                                     id_reserva = ?,
                                                     id_habitacion = ?
                                                 WHERE id_detalle = ?`,
                                                [
                                                    id_reserva,
                                                    id_habitacion,
                                                    id
                                                ],
                                                (
                                                    error,
                                                    resultado: any
                                                ) => {

                                                    if (error) {

                                                        if (
                                                            error.code ===
                                                            "ER_DUP_ENTRY"
                                                        ) {

                                                            reject({
                                                                tipo: "DUPLICADO",
                                                                mensaje:
                                                                    "Este detalle de reserva ya existe"
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
                                                                    "La reserva o habitación indicada no existe"
                                                            });

                                                            return;
                                                        }


                                                        reject(error);
                                                        return;
                                                    }


                                                    if (
                                                        resultado.affectedRows ===
                                                        0
                                                    ) {

                                                        reject({
                                                            tipo: "NO_ENCONTRADO",
                                                            mensaje:
                                                                "El detalle de reserva no existe"
                                                        });

                                                        return;
                                                    }


                                                    resolve({
                                                        mensaje:
                                                            "Detalle de reserva actualizado correctamente",

                                                        detalle: {
                                                            id_detalle: id,
                                                            id_reserva,
                                                            id_habitacion
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

                }
            );

        });
    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(id: number): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ID
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje:
                        "El ID del detalle de reserva no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR EXISTENCIA
            // ---------------------------------------------

            db.query(
                `SELECT id_detalle
                 FROM DetalleReserva
                 WHERE id_detalle = ?
                 LIMIT 1`,
                [id],
                (errorBusqueda, detalles: any) => {

                    if (errorBusqueda) {
                        reject(errorBusqueda);
                        return;
                    }

                    if (
                        !detalles ||
                        detalles.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "El detalle de reserva no existe"
                        });

                        return;
                    }


                    // ---------------------------------------------
                    // ELIMINAR
                    // ---------------------------------------------

                    db.query(
                        `DELETE FROM DetalleReserva
                         WHERE id_detalle = ?`,
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
                                            "No se puede eliminar el detalle porque está relacionado con otros registros"
                                    });

                                    return;
                                }

                                reject(error);
                                return;
                            }


                            // ---------------------------------------------
                            // COMPROBAR ELIMINACIÓN
                            // ---------------------------------------------

                            if (
                                resultado.affectedRows === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje:
                                        "El detalle de reserva no existe o ya fue eliminado"
                                });

                                return;
                            }


                            resolve({
                                mensaje:
                                    "Detalle de reserva eliminado correctamente",

                                id_detalle: id
                            });

                        }
                    );

                }
            );

        });
    }
}


// =====================================================
// INSTANCIA DEL SERVICIO
// =====================================================

export const detalleReservaService =
    new DetalleReservaService();