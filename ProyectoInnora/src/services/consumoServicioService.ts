import db from "../config/database";

export class ConsumoServicioService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM ConsumoServicio",
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
                    mensaje: "El ID del consumo no es válido"
                });

                return;
            }


            db.query(
                `SELECT *
                 FROM ConsumoServicio
                 WHERE id_consumo = ?`,
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
        cantidad: number,
        id_reserva: number,
        id_servicio: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR CANTIDAD
            // ---------------------------------------------

            if (
                typeof cantidad !== "number" ||
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La cantidad debe ser un número entero mayor que 0"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR RESERVA
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
            // VALIDAR SERVICIO
            // ---------------------------------------------

            if (
                !Number.isInteger(id_servicio) ||
                id_servicio <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del servicio no es válido"
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
                    // VERIFICAR SERVICIO
                    // -----------------------------------------

                    db.query(
                        `SELECT id_servicio
                         FROM Servicio
                         WHERE id_servicio = ?
                         LIMIT 1`,
                        [id_servicio],
                        (errorServicio, servicios: any[]) => {

                            if (errorServicio) {
                                reject(errorServicio);
                                return;
                            }

                            if (
                                !servicios ||
                                servicios.length === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje: "El servicio indicado no existe"
                                });

                                return;
                            }


                            // -------------------------------------
                            // INSERTAR
                            // -------------------------------------

                            db.query(
                                `INSERT INTO ConsumoServicio
                                (
                                    cantidad,
                                    id_reserva,
                                    id_servicio
                                )
                                VALUES (?, ?, ?)`,
                                [
                                    cantidad,
                                    id_reserva,
                                    id_servicio
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
                                                    "Este servicio ya está registrado para esta reserva"
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
                                                    "La reserva o el servicio indicado no existe"
                                            });

                                            return;
                                        }

                                        reject(error);
                                        return;
                                    }


                                    resolve({
                                        mensaje:
                                            "Consumo de servicio creado correctamente",

                                        consumo: {
                                            id_consumo:
                                                resultado.insertId,
                                            cantidad,
                                            id_reserva,
                                            id_servicio
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
        cantidad: number,
        id_reserva: number,
        id_servicio: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ID CONSUMO
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del consumo no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR CANTIDAD
            // ---------------------------------------------

            if (
                typeof cantidad !== "number" ||
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "La cantidad debe ser un número entero mayor que 0"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR RESERVA
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
            // VALIDAR SERVICIO
            // ---------------------------------------------

            if (
                !Number.isInteger(id_servicio) ||
                id_servicio <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del servicio no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR CONSUMO
            // ---------------------------------------------

            db.query(
                `SELECT id_consumo
                 FROM ConsumoServicio
                 WHERE id_consumo = ?
                 LIMIT 1`,
                [id],
                (errorConsumo, consumos: any[]) => {

                    if (errorConsumo) {
                        reject(errorConsumo);
                        return;
                    }

                    if (
                        !consumos ||
                        consumos.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "El consumo de servicio no existe"
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
                            // VERIFICAR SERVICIO
                            // -----------------------------------------

                            db.query(
                                `SELECT id_servicio
                                 FROM Servicio
                                 WHERE id_servicio = ?
                                 LIMIT 1`,
                                [id_servicio],
                                (errorServicio, servicios: any[]) => {

                                    if (errorServicio) {
                                        reject(errorServicio);
                                        return;
                                    }

                                    if (
                                        !servicios ||
                                        servicios.length === 0
                                    ) {

                                        reject({
                                            tipo: "NO_ENCONTRADO",
                                            mensaje:
                                                "El servicio indicado no existe"
                                        });

                                        return;
                                    }


                                    // ---------------------------------
                                    // VERIFICAR DUPLICADO
                                    // ---------------------------------

                                    db.query(
                                        `SELECT id_consumo
                                         FROM ConsumoServicio
                                         WHERE id_reserva = ?
                                         AND id_servicio = ?
                                         AND id_consumo <> ?
                                         LIMIT 1`,
                                        [
                                            id_reserva,
                                            id_servicio,
                                            id
                                        ],
                                        (
                                            errorDuplicado,
                                            duplicados: any[]
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
                                                        "Este servicio ya está registrado para esta reserva"
                                                });

                                                return;
                                            }


                                            // -----------------------------
                                            // ACTUALIZAR
                                            // -----------------------------

                                            db.query(
                                                `UPDATE ConsumoServicio
                                                 SET
                                                     cantidad = ?,
                                                     id_reserva = ?,
                                                     id_servicio = ?
                                                 WHERE id_consumo = ?`,
                                                [
                                                    cantidad,
                                                    id_reserva,
                                                    id_servicio,
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
                                                                    "Este servicio ya está registrado para esta reserva"
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
                                                                    "La reserva o el servicio indicado no existe"
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
                                                            tipo:
                                                                "NO_ENCONTRADO",
                                                            mensaje:
                                                                "El consumo de servicio no existe"
                                                        });

                                                        return;
                                                    }


                                                    resolve({
                                                        mensaje:
                                                            "Consumo de servicio actualizado correctamente",

                                                        consumo: {
                                                            id_consumo: id,
                                                            cantidad,
                                                            id_reserva,
                                                            id_servicio
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
                    mensaje: "El ID del consumo no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR QUE EXISTA
            // ---------------------------------------------

            db.query(
                `SELECT id_consumo
                 FROM ConsumoServicio
                 WHERE id_consumo = ?
                 LIMIT 1`,
                [id],
                (errorBusqueda, consumos: any[]) => {

                    if (errorBusqueda) {
                        reject(errorBusqueda);
                        return;
                    }

                    if (
                        !consumos ||
                        consumos.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "El consumo de servicio no existe o ya fue eliminado"
                        });

                        return;
                    }


                    // ---------------------------------------------
                    // ELIMINAR
                    // ---------------------------------------------

                    db.query(
                        `DELETE FROM ConsumoServicio
                         WHERE id_consumo = ?`,
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
                                            "No se puede eliminar el consumo porque está relacionado con otros registros"
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
                                        "El consumo de servicio no existe o ya fue eliminado"
                                });

                                return;
                            }


                            resolve({
                                mensaje:
                                    "Consumo de servicio eliminado correctamente",

                                id_consumo: id
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

export const consumoServicioService =
    new ConsumoServicioService();