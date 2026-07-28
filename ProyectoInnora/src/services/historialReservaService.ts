import db from "../config/database";

export class HistorialReservaService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM HistorialReserva",
                (error, resultados) => {

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

            // ---------------------------------------------
            // VALIDAR ID
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del historial no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // CONSULTAR
            // ---------------------------------------------

            db.query(
                `SELECT *
                 FROM HistorialReserva
                 WHERE id_historia = ?`,
                [id],
                (error, resultados: any[]) => {

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


    // ======================================================
    // CREAR
    // ======================================================

    crear(
        estado_anterior: string,
        estado_nuevo: string,
        fecha: string,
        id_reserva: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ESTADO ANTERIOR
            // ---------------------------------------------

            if (
                estado_anterior === null ||
                estado_anterior === undefined ||
                typeof estado_anterior !== "string" ||
                estado_anterior.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El estado anterior es obligatorio"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR ESTADO NUEVO
            // ---------------------------------------------

            if (
                estado_nuevo === null ||
                estado_nuevo === undefined ||
                typeof estado_nuevo !== "string" ||
                estado_nuevo.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El estado nuevo es obligatorio"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR FECHA
            // ---------------------------------------------

            if (
                fecha === null ||
                fecha === undefined ||
                typeof fecha !== "string" ||
                fecha.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha es obligatoria"
                });

                return;
            }

            const fechaValida = new Date(fecha);

            if (isNaN(fechaValida.getTime())) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha no es válida"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR ID RESERVA
            // ---------------------------------------------

            if (!Number.isInteger(id_reserva) || id_reserva <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR RESERVA
            // ---------------------------------------------

            db.query(
                `SELECT id_reserva
                 FROM Reserva
                 WHERE id_reserva = ?`,
                [id_reserva],
                (errorReserva, reservas: any[]) => {

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
                    // INSERTAR
                    // -----------------------------------------

                    db.query(
                        `INSERT INTO HistorialReserva
                        (
                            estado_anterior,
                            estado_nuevo,
                            fecha,
                            id_reserva
                        )
                        VALUES (?, ?, ?, ?)`,
                        [
                            estado_anterior.trim(),
                            estado_nuevo.trim(),
                            fecha,
                            id_reserva
                        ],
                        (error, resultado: any) => {

                            if (error) {

                                if (
                                    error.code ===
                                    "ER_NO_REFERENCED_ROW_2"
                                ) {

                                    reject({
                                        tipo: "REFERENCIA",
                                        mensaje: "La reserva indicada no existe"
                                    });

                                    return;
                                }

                                if (
                                    error.code ===
                                    "ER_DUP_ENTRY"
                                ) {

                                    reject({
                                        tipo: "DUPLICADO",
                                        mensaje: "El registro del historial ya existe"
                                    });

                                    return;
                                }

                                reject(error);
                                return;
                            }

                            resolve({
                                mensaje:
                                    "Historial de reserva creado correctamente",

                                historial: {
                                    id_historia: resultado.insertId,
                                    estado_anterior:
                                        estado_anterior.trim(),
                                    estado_nuevo:
                                        estado_nuevo.trim(),
                                    fecha,
                                    id_reserva
                                }
                            });

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
        estado_anterior: string,
        estado_nuevo: string,
        fecha: string,
        id_reserva: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ID HISTORIAL
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del historial no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR ESTADO ANTERIOR
            // ---------------------------------------------

            if (
                estado_anterior === null ||
                estado_anterior === undefined ||
                typeof estado_anterior !== "string" ||
                estado_anterior.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El estado anterior es obligatorio"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR ESTADO NUEVO
            // ---------------------------------------------

            if (
                estado_nuevo === null ||
                estado_nuevo === undefined ||
                typeof estado_nuevo !== "string" ||
                estado_nuevo.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El estado nuevo es obligatorio"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR FECHA
            // ---------------------------------------------

            if (
                fecha === null ||
                fecha === undefined ||
                typeof fecha !== "string" ||
                fecha.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha es obligatoria"
                });

                return;
            }

            const fechaValida = new Date(fecha);

            if (isNaN(fechaValida.getTime())) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha no es válida"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR ID RESERVA
            // ---------------------------------------------

            if (!Number.isInteger(id_reserva) || id_reserva <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR HISTORIAL
            // ---------------------------------------------

            db.query(
                `SELECT id_historia
                 FROM HistorialReserva
                 WHERE id_historia = ?`,
                [id],
                (errorHistorial, historiales: any[]) => {

                    if (errorHistorial) {
                        reject(errorHistorial);
                        return;
                    }

                    if (
                        !historiales ||
                        historiales.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "El historial de reserva no existe"
                        });

                        return;
                    }


                    // ---------------------------------------------
                    // VERIFICAR RESERVA
                    // ---------------------------------------------

                    db.query(
                        `SELECT id_reserva
                         FROM Reserva
                         WHERE id_reserva = ?`,
                        [id_reserva],
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
                                    mensaje: "La reserva indicada no existe"
                                });

                                return;
                            }


                            // -----------------------------------------
                            // ACTUALIZAR
                            // -----------------------------------------

                            db.query(
                                `UPDATE HistorialReserva
                                 SET
                                     estado_anterior = ?,
                                     estado_nuevo = ?,
                                     fecha = ?,
                                     id_reserva = ?
                                 WHERE id_historia = ?`,
                                [
                                    estado_anterior.trim(),
                                    estado_nuevo.trim(),
                                    fecha,
                                    id_reserva,
                                    id
                                ],
                                (error, resultado: any) => {

                                    if (error) {

                                        if (
                                            error.code ===
                                            "ER_NO_REFERENCED_ROW_2"
                                        ) {

                                            reject({
                                                tipo: "REFERENCIA",
                                                mensaje: "La reserva indicada no existe"
                                            });

                                            return;
                                        }

                                        if (
                                            error.code ===
                                            "ER_DUP_ENTRY"
                                        ) {

                                            reject({
                                                tipo: "DUPLICADO",
                                                mensaje: "El registro del historial ya existe"
                                            });

                                            return;
                                        }

                                        reject(error);
                                        return;
                                    }


                                    // ---------------------------------
                                    // VERIFICAR ACTUALIZACIÓN
                                    // ---------------------------------

                                    if (
                                        resultado.affectedRows === 0
                                    ) {

                                        reject({
                                            tipo: "NO_ENCONTRADO",
                                            mensaje: "El historial de reserva no existe"
                                        });

                                        return;
                                    }


                                    resolve({
                                        mensaje:
                                            "Historial de reserva actualizado correctamente",

                                        historial: {
                                            id_historia: id,
                                            estado_anterior:
                                                estado_anterior.trim(),
                                            estado_nuevo:
                                                estado_nuevo.trim(),
                                            fecha,
                                            id_reserva
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
    // ELIMINAR
    // ======================================================

    eliminar(id: number): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ID
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del historial no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR QUE EXISTA
            // ---------------------------------------------

            db.query(
                `SELECT id_historia
                 FROM HistorialReserva
                 WHERE id_historia = ?`,
                [id],
                (errorBusqueda, historiales: any[]) => {

                    if (errorBusqueda) {
                        reject(errorBusqueda);
                        return;
                    }

                    if (
                        !historiales ||
                        historiales.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "El historial de reserva no existe o ya fue eliminado"
                        });

                        return;
                    }


                    // ---------------------------------------------
                    // ELIMINAR
                    // ---------------------------------------------

                    db.query(
                        `DELETE FROM HistorialReserva
                         WHERE id_historia = ?`,
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
                                            "No se puede eliminar el historial porque está relacionado con otros registros"
                                    });

                                    return;
                                }

                                reject(error);
                                return;
                            }


                            // -----------------------------------------
                            // VERIFICAR ELIMINACIÓN
                            // -----------------------------------------

                            if (
                                resultado.affectedRows === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje:
                                        "El historial de reserva no existe o ya fue eliminado"
                                });

                                return;
                            }


                            resolve({
                                mensaje:
                                    "Historial de reserva eliminado correctamente",

                                id_historia: id
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

export const historialReservaService =
    new HistorialReservaService();