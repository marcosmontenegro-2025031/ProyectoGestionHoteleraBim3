import db from "../config/database";

export class FacturaService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Factura",
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


    // ======================================================
    // OBTENER POR ID
    // ======================================================

    obtenerPorId(id: number): Promise<any | null> {

        return new Promise((resolve, reject) => {

            if (!Number.isInteger(id) || id <= 0) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la factura no es válido"
                });
                return;
            }

            db.query(
                "SELECT * FROM Factura WHERE id_factura = ?",
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
        numero_factura: string,
        total: number,
        fecha: string,
        id_reserva: number,
        id_metodo_pago: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ==============================================
            // VALIDAR NÚMERO DE FACTURA
            // ==============================================

            if (
                typeof numero_factura !== "string" ||
                numero_factura.trim().length === 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El número de factura es obligatorio"
                });
                return;
            }

            numero_factura = numero_factura.trim();


            // ==============================================
            // VALIDAR TOTAL
            // ==============================================

            if (
                typeof total !== "number" ||
                !Number.isFinite(total) ||
                total <= 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El total debe ser un número mayor que 0"
                });
                return;
            }


            // ==============================================
            // VALIDAR FECHA
            // ==============================================

            if (
                typeof fecha !== "string" ||
                fecha.trim().length === 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de la factura es obligatoria"
                });
                return;
            }

            const fechaValida = new Date(fecha);

            if (isNaN(fechaValida.getTime())) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de la factura no es válida"
                });
                return;
            }


            // ==============================================
            // VALIDAR RESERVA
            // ==============================================

            if (!Number.isInteger(id_reserva) || id_reserva <= 0) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });
                return;
            }


            // ==============================================
            // VALIDAR MÉTODO DE PAGO
            // ==============================================

            if (
                !Number.isInteger(id_metodo_pago) ||
                id_metodo_pago <= 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del método de pago no es válido"
                });
                return;
            }


            // ==============================================
            // VERIFICAR NÚMERO DE FACTURA
            // ==============================================

            db.query(
                `SELECT id_factura
                 FROM Factura
                 WHERE numero_factura = ?
                 LIMIT 1`,
                [numero_factura],
                (errorNumero, facturas: any[]) => {

                    if (errorNumero) {
                        reject(errorNumero);
                        return;
                    }

                    if (facturas.length > 0) {
                        reject({
                            tipo: "DUPLICADO",
                            mensaje: "El número de factura ya existe"
                        });
                        return;
                    }


                    // ==========================================
                    // VERIFICAR RESERVA
                    // ==========================================

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

                            if (reservas.length === 0) {
                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje: "La reserva indicada no existe"
                                });
                                return;
                            }


                            // ======================================
                            // VERIFICAR MÉTODO DE PAGO
                            // ======================================

                            db.query(
                                `SELECT id_metodo_pago
                                 FROM MetodoPago
                                 WHERE id_metodo_pago = ?
                                 LIMIT 1`,
                                [id_metodo_pago],
                                (errorMetodo, metodos: any[]) => {

                                    if (errorMetodo) {
                                        reject(errorMetodo);
                                        return;
                                    }

                                    if (metodos.length === 0) {
                                        reject({
                                            tipo: "NO_ENCONTRADO",
                                            mensaje: "El método de pago indicado no existe"
                                        });
                                        return;
                                    }


                                    // ==================================
                                    // INSERTAR
                                    // ==================================

                                    db.query(
                                        `INSERT INTO Factura
                                        (
                                            numero_factura,
                                            total,
                                            fecha,
                                            id_reserva,
                                            id_metodo_pago
                                        )
                                        VALUES (?, ?, ?, ?, ?)`,
                                        [
                                            numero_factura,
                                            total,
                                            fecha,
                                            id_reserva,
                                            id_metodo_pago
                                        ],
                                        (error, resultado: any) => {

                                            if (error) {

                                                if (
                                                    error.code === "ER_DUP_ENTRY"
                                                ) {
                                                    reject({
                                                        tipo: "DUPLICADO",
                                                        mensaje: "El número de factura ya existe"
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
                                                            "La reserva o el método de pago indicado no existe"
                                                    });
                                                    return;
                                                }

                                                reject(error);
                                                return;
                                            }

                                            resolve({
                                                id_factura: resultado.insertId,
                                                numero_factura,
                                                total,
                                                fecha,
                                                id_reserva,
                                                id_metodo_pago,
                                                mensaje:
                                                    "Factura creada correctamente"
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
    // ACTUALIZAR
    // ======================================================

    actualizar(
        id: number,
        numero_factura: string,
        total: number,
        fecha: string,
        id_reserva: number,
        id_metodo_pago: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ==============================================
            // VALIDAR ID
            // ==============================================

            if (!Number.isInteger(id) || id <= 0) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la factura no es válido"
                });
                return;
            }


            // ==============================================
            // VALIDAR NÚMERO DE FACTURA
            // ==============================================

            if (
                typeof numero_factura !== "string" ||
                numero_factura.trim().length === 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El número de factura es obligatorio"
                });
                return;
            }

            numero_factura = numero_factura.trim();


            // ==============================================
            // VALIDAR TOTAL
            // ==============================================

            if (
                typeof total !== "number" ||
                !Number.isFinite(total) ||
                total <= 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El total debe ser un número mayor que 0"
                });
                return;
            }


            // ==============================================
            // VALIDAR FECHA
            // ==============================================

            if (
                typeof fecha !== "string" ||
                fecha.trim().length === 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de la factura es obligatoria"
                });
                return;
            }

            const fechaValida = new Date(fecha);

            if (isNaN(fechaValida.getTime())) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "La fecha de la factura no es válida"
                });
                return;
            }


            // ==============================================
            // VALIDAR RESERVA
            // ==============================================

            if (!Number.isInteger(id_reserva) || id_reserva <= 0) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la reserva no es válido"
                });
                return;
            }


            // ==============================================
            // VALIDAR MÉTODO DE PAGO
            // ==============================================

            if (
                !Number.isInteger(id_metodo_pago) ||
                id_metodo_pago <= 0
            ) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del método de pago no es válido"
                });
                return;
            }


            // ==============================================
            // VERIFICAR FACTURA
            // ==============================================

            db.query(
                `SELECT id_factura
                 FROM Factura
                 WHERE id_factura = ?
                 LIMIT 1`,
                [id],
                (errorFactura, facturas: any[]) => {

                    if (errorFactura) {
                        reject(errorFactura);
                        return;
                    }

                    if (facturas.length === 0) {
                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "La factura no existe"
                        });
                        return;
                    }


                    // ==========================================
                    // VERIFICAR NÚMERO DUPLICADO
                    // ==========================================

                    db.query(
                        `SELECT id_factura
                         FROM Factura
                         WHERE numero_factura = ?
                         AND id_factura <> ?
                         LIMIT 1`,
                        [
                            numero_factura,
                            id
                        ],
                        (errorNumero, duplicados: any[]) => {

                            if (errorNumero) {
                                reject(errorNumero);
                                return;
                            }

                            if (duplicados.length > 0) {
                                reject({
                                    tipo: "DUPLICADO",
                                    mensaje:
                                        "El número de factura ya pertenece a otra factura"
                                });
                                return;
                            }


                            // ======================================
                            // VERIFICAR RESERVA
                            // ======================================

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

                                    if (reservas.length === 0) {
                                        reject({
                                            tipo: "NO_ENCONTRADO",
                                            mensaje:
                                                "La reserva indicada no existe"
                                        });
                                        return;
                                    }


                                    // ==================================
                                    // VERIFICAR MÉTODO DE PAGO
                                    // ==================================

                                    db.query(
                                        `SELECT id_metodo_pago
                                         FROM MetodoPago
                                         WHERE id_metodo_pago = ?
                                         LIMIT 1`,
                                        [id_metodo_pago],
                                        (errorMetodo, metodos: any[]) => {

                                            if (errorMetodo) {
                                                reject(errorMetodo);
                                                return;
                                            }

                                            if (metodos.length === 0) {
                                                reject({
                                                    tipo: "NO_ENCONTRADO",
                                                    mensaje:
                                                        "El método de pago indicado no existe"
                                                });
                                                return;
                                            }


                                            // ==============================
                                            // ACTUALIZAR
                                            // ==============================

                                            db.query(
                                                `UPDATE Factura
                                                SET
                                                    numero_factura = ?,
                                                    total = ?,
                                                    fecha = ?,
                                                    id_reserva = ?,
                                                    id_metodo_pago = ?
                                                WHERE id_factura = ?`,
                                                [
                                                    numero_factura,
                                                    total,
                                                    fecha,
                                                    id_reserva,
                                                    id_metodo_pago,
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
                                                                    "El número de factura ya existe"
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
                                                                    "La reserva o el método de pago indicado no existe"
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
                                                            tipo: "NO_MODIFICADO",
                                                            mensaje:
                                                                "No se pudo actualizar la factura"
                                                        });
                                                        return;
                                                    }


                                                    resolve({
                                                        id_factura: id,
                                                        numero_factura,
                                                        total,
                                                        fecha,
                                                        id_reserva,
                                                        id_metodo_pago,
                                                        mensaje:
                                                            "Factura actualizada correctamente"
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

            // ==============================================
            // VALIDAR ID
            // ==============================================

            if (!Number.isInteger(id) || id <= 0) {
                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID de la factura no es válido"
                });
                return;
            }


            // ==============================================
            // VERIFICAR EXISTENCIA
            // ==============================================

            db.query(
                `SELECT id_factura
                 FROM Factura
                 WHERE id_factura = ?
                 LIMIT 1`,
                [id],
                (errorBusqueda, facturas: any[]) => {

                    if (errorBusqueda) {
                        reject(errorBusqueda);
                        return;
                    }

                    if (facturas.length === 0) {
                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "La factura no existe o ya fue eliminada"
                        });
                        return;
                    }


                    // ==============================================
                    // ELIMINAR
                    // ==============================================

                    db.query(
                        "DELETE FROM Factura WHERE id_factura = ?",
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
                                            "No se puede eliminar la factura porque tiene registros relacionados"
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
                                        "La factura no existe o ya fue eliminada"
                                });
                                return;
                            }


                            resolve({
                                id_factura: id,
                                mensaje:
                                    "Factura eliminada correctamente"
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

export const facturaService = new FacturaService();