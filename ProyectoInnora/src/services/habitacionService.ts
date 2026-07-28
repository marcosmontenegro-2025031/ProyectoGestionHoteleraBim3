import db from "../config/database";

export class HabitacionService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Habitacion",
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
                 FROM Habitacion
                 WHERE id_habitacion = ?
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
        numero: string,
        estado: string,
        precio: number,
        id_tipo_habitacion: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // --------------------------------------------------
            // VALIDAR NÚMERO
            // --------------------------------------------------

            if (
                numero === null ||
                numero === undefined ||
                typeof numero !== "string" ||
                numero.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El número de habitación es obligatorio"
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
                    mensaje: "El estado de la habitación es obligatorio"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR PRECIO
            // --------------------------------------------------

            if (
                precio === null ||
                precio === undefined ||
                typeof precio !== "number" ||
                !Number.isFinite(precio) ||
                precio < 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El precio debe ser un número mayor o igual a 0"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR TIPO DE HABITACIÓN
            // --------------------------------------------------

            if (
                id_tipo_habitacion === null ||
                id_tipo_habitacion === undefined ||
                !Number.isInteger(id_tipo_habitacion) ||
                id_tipo_habitacion <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del tipo de habitación no es válido"
                });

                return;
            }


            // --------------------------------------------------
            // NORMALIZAR
            // --------------------------------------------------

            const numeroNormalizado = numero.trim();
            const estadoNormalizado = estado.trim();


            // --------------------------------------------------
            // VERIFICAR TIPO DE HABITACIÓN
            // --------------------------------------------------

            db.query(
                `SELECT id_tipo_habitacion
                 FROM TipoHabitacion
                 WHERE id_tipo_habitacion = ?
                 LIMIT 1`,
                [id_tipo_habitacion],
                (error, tipos: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (
                        !tipos ||
                        tipos.length === 0
                    ) {

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "El tipo de habitación indicado no existe"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // VERIFICAR NÚMERO DUPLICADO
                    // --------------------------------------------------

                    db.query(
                        `SELECT id_habitacion
                         FROM Habitacion
                         WHERE numero = ?
                         LIMIT 1`,
                        [numeroNormalizado],
                        (error, resultados: any[]) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            if (
                                resultados &&
                                resultados.length > 0
                            ) {

                                reject({
                                    tipo: "DUPLICADO",
                                    mensaje:
                                        "El número de habitación ya existe"
                                });

                                return;
                            }


                            // --------------------------------------------------
                            // INSERTAR
                            // --------------------------------------------------

                            db.query(
                                `INSERT INTO Habitacion
                                (
                                    numero,
                                    estado,
                                    precio,
                                    id_tipo_habitacion
                                )
                                VALUES (?, ?, ?, ?)`,
                                [
                                    numeroNormalizado,
                                    estadoNormalizado,
                                    precio,
                                    id_tipo_habitacion
                                ],
                                (error, resultado: any) => {

                                    if (error) {
                                        reject(error);
                                        return;
                                    }

                                    resolve({
                                        mensaje:
                                            "Habitación creada correctamente",

                                        habitacion: {
                                            id_habitacion:
                                                resultado.insertId,

                                            numero:
                                                numeroNormalizado,

                                            estado:
                                                estadoNormalizado,

                                            precio,

                                            id_tipo_habitacion
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
        numero: string,
        estado: string,
        precio: number,
        id_tipo_habitacion: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // --------------------------------------------------
            // VALIDAR NÚMERO
            // --------------------------------------------------

            if (
                numero === null ||
                numero === undefined ||
                typeof numero !== "string" ||
                numero.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El número de habitación es obligatorio"
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
                    mensaje: "El estado de la habitación es obligatorio"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR PRECIO
            // --------------------------------------------------

            if (
                precio === null ||
                precio === undefined ||
                typeof precio !== "number" ||
                !Number.isFinite(precio) ||
                precio < 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El precio debe ser un número mayor o igual a 0"
                });

                return;
            }


            // --------------------------------------------------
            // VALIDAR TIPO DE HABITACIÓN
            // --------------------------------------------------

            if (
                id_tipo_habitacion === null ||
                id_tipo_habitacion === undefined ||
                !Number.isInteger(id_tipo_habitacion) ||
                id_tipo_habitacion <= 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje:
                        "El ID del tipo de habitación no es válido"
                });

                return;
            }


            const numeroNormalizado = numero.trim();
            const estadoNormalizado = estado.trim();


            // --------------------------------------------------
            // VERIFICAR QUE EXISTA
            // --------------------------------------------------

            db.query(
                `SELECT id_habitacion
                 FROM Habitacion
                 WHERE id_habitacion = ?
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

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje: "La habitación no existe"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // VERIFICAR TIPO DE HABITACIÓN
                    // --------------------------------------------------

                    db.query(
                        `SELECT id_tipo_habitacion
                         FROM TipoHabitacion
                         WHERE id_tipo_habitacion = ?
                         LIMIT 1`,
                        [id_tipo_habitacion],
                        (error, tipos: any[]) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            if (
                                !tipos ||
                                tipos.length === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje:
                                        "El tipo de habitación indicado no existe"
                                });

                                return;
                            }


                            // --------------------------------------------------
                            // VERIFICAR NÚMERO DUPLICADO
                            // --------------------------------------------------

                            db.query(
                                `SELECT id_habitacion
                                 FROM Habitacion
                                 WHERE numero = ?
                                 AND id_habitacion <> ?
                                 LIMIT 1`,
                                [
                                    numeroNormalizado,
                                    id
                                ],
                                (error, duplicados: any[]) => {

                                    if (error) {
                                        reject(error);
                                        return;
                                    }

                                    if (
                                        duplicados &&
                                        duplicados.length > 0
                                    ) {

                                        reject({
                                            tipo: "DUPLICADO",
                                            mensaje:
                                                "El número de habitación ya pertenece a otra habitación"
                                        });

                                        return;
                                    }


                                    // --------------------------------------------------
                                    // ACTUALIZAR
                                    // --------------------------------------------------

                                    db.query(
                                        `UPDATE Habitacion
                                         SET
                                            numero = ?,
                                            estado = ?,
                                            precio = ?,
                                            id_tipo_habitacion = ?
                                         WHERE id_habitacion = ?`,
                                        [
                                            numeroNormalizado,
                                            estadoNormalizado,
                                            precio,
                                            id_tipo_habitacion,
                                            id
                                        ],
                                        (error, resultado: any) => {

                                            if (error) {
                                                reject(error);
                                                return;
                                            }

                                            if (
                                                resultado.affectedRows === 0
                                            ) {

                                                reject({
                                                    tipo: "NO_ACTUALIZADO",
                                                    mensaje:
                                                        "No se pudo actualizar la habitación"
                                                });

                                                return;
                                            }

                                            resolve({
                                                mensaje:
                                                    "Habitación actualizada correctamente",

                                                habitacion: {
                                                    id_habitacion: id,
                                                    numero:
                                                        numeroNormalizado,
                                                    estado:
                                                        estadoNormalizado,
                                                    precio,
                                                    id_tipo_habitacion
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
            // VERIFICAR QUE EXISTA
            // --------------------------------------------------

            db.query(
                `SELECT id_habitacion
                 FROM Habitacion
                 WHERE id_habitacion = ?
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

                        reject({
                            tipo: "NO_ENCONTRADO",
                            mensaje:
                                "La habitación no existe o ya fue eliminada"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // ELIMINAR
                    // --------------------------------------------------

                    db.query(
                        `DELETE FROM Habitacion
                         WHERE id_habitacion = ?`,
                        [id],
                        (error, resultado: any) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            if (
                                resultado.affectedRows === 0
                            ) {

                                reject({
                                    tipo: "NO_ENCONTRADO",
                                    mensaje:
                                        "La habitación no existe o ya fue eliminada"
                                });

                                return;
                            }

                            resolve({
                                mensaje:
                                    "Habitación eliminada correctamente",

                                id_habitacion: id
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

export const habitacionService =
    new HabitacionService();