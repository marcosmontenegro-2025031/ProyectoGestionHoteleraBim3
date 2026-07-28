import db from "../config/database";

export class MetodoPagoService {

    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM MetodoPago",
                (error, resultados: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(resultados);
                }
            );

        });
    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(id: number): Promise<any | null> {

        return new Promise((resolve, reject) => {

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del método de pago no es válido"
                });

                return;
            }

            db.query(
                `SELECT *
                 FROM MetodoPago
                 WHERE id_metodo_pago = ?`,
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


    // =====================================================
    // CREAR
    // =====================================================

    crear(tipo: string): Promise<any> {

        return new Promise((resolve, reject) => {

            if (
                tipo === null ||
                tipo === undefined ||
                typeof tipo !== "string" ||
                tipo.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El tipo de método de pago es obligatorio"
                });

                return;
            }

            const tipoLimpio = tipo.trim();

            db.query(
                `SELECT id_metodo_pago
                 FROM MetodoPago
                 WHERE LOWER(TRIM(tipo)) = LOWER(TRIM(?))
                 LIMIT 1`,
                [tipoLimpio],

                (error, resultados: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (resultados.length > 0) {

                        reject({
                            tipo: "DUPLICADO",
                            mensaje: "El método de pago ya existe"
                        });

                        return;
                    }

                    db.query(
                        `INSERT INTO MetodoPago
                        (tipo)
                        VALUES (?)`,
                        [tipoLimpio],

                        (error, resultado: any) => {

                            if (error) {

                                if (error.code === "ER_DUP_ENTRY") {

                                    reject({
                                        tipo: "DUPLICADO",
                                        mensaje: "El método de pago ya existe"
                                    });

                                    return;
                                }

                                reject(error);
                                return;
                            }

                            resolve({
                                mensaje: "Método de pago creado correctamente",
                                metodoPago: {
                                    id_metodo_pago: resultado.insertId,
                                    tipo: tipoLimpio
                                }
                            });

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
        tipo: string
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del método de pago no es válido"
                });

                return;
            }

            if (
                tipo === null ||
                tipo === undefined ||
                typeof tipo !== "string" ||
                tipo.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El tipo de método de pago es obligatorio"
                });

                return;
            }

            const tipoLimpio = tipo.trim();

            db.query(
                `SELECT id_metodo_pago
                 FROM MetodoPago
                 WHERE id_metodo_pago = ?
                 LIMIT 1`,
                [id],

                (error, resultados: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (resultados.length === 0) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "El método de pago no existe"
                        });

                        return;
                    }

                    db.query(
                        `SELECT id_metodo_pago
                         FROM MetodoPago
                         WHERE LOWER(TRIM(tipo)) = LOWER(TRIM(?))
                         AND id_metodo_pago <> ?
                         LIMIT 1`,
                        [
                            tipoLimpio,
                            id
                        ],

                        (error, repetidos: any[]) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            if (repetidos.length > 0) {

                                reject({
                                    tipo: "DUPLICADO",
                                    mensaje:
                                        "Ya existe otro método de pago con ese tipo"
                                });

                                return;
                            }

                            db.query(
                                `UPDATE MetodoPago
                                 SET tipo = ?
                                 WHERE id_metodo_pago = ?`,
                                [
                                    tipoLimpio,
                                    id
                                ],

                                (error, resultado: any) => {

                                    if (error) {

                                        if (error.code === "ER_DUP_ENTRY") {

                                            reject({
                                                tipo: "DUPLICADO",
                                                mensaje:
                                                    "El método de pago ya existe"
                                            });

                                            return;
                                        }

                                        reject(error);
                                        return;
                                    }

                                    if (resultado.affectedRows === 0) {

                                        reject({
                                            tipo: "NO_MODIFICADO",
                                            mensaje:
                                                "No se pudo actualizar el método de pago"
                                        });

                                        return;
                                    }

                                    resolve({
                                        mensaje:
                                            "Método de pago actualizado correctamente",
                                        metodoPago: {
                                            id_metodo_pago: id,
                                            tipo: tipoLimpio
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


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(id: number): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del método de pago no es válido"
                });

                return;
            }

            db.query(
                `SELECT id_metodo_pago
                 FROM MetodoPago
                 WHERE id_metodo_pago = ?
                 LIMIT 1`,
                [id],

                (error, resultados: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (resultados.length === 0) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "El método de pago no existe o ya fue eliminado"
                        });

                        return;
                    }

                    db.query(
                        `DELETE FROM MetodoPago
                         WHERE id_metodo_pago = ?`,
                        [id],

                        (error, resultado: any) => {

                            if (error) {

                                if (
                                    error.code === "ER_ROW_IS_REFERENCED_2" ||
                                    error.code === "ER_ROW_IS_REFERENCED"
                                ) {

                                    reject({
                                        tipo: "REFERENCIA",
                                        mensaje:
                                            "No se puede eliminar el método de pago porque está relacionado con otros registros"
                                    });

                                    return;
                                }

                                reject(error);
                                return;
                            }

                            if (resultado.affectedRows === 0) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje:
                                        "El método de pago no existe o ya fue eliminado"
                                });

                                return;
                            }

                            resolve({
                                mensaje:
                                    "Método de pago eliminado correctamente",
                                id_metodo_pago: id
                            });

                        }
                    );

                }
            );

        });
    }

}

export const metodoPagoService =
    new MetodoPagoService();