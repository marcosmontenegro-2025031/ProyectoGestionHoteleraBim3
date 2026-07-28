import db from "../config/database";

export class ServicioService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Servicio",
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
                    mensaje: "El ID del servicio no es válido"
                });

                return;
            }


            db.query(
                `SELECT *
                 FROM Servicio
                 WHERE id_servicio = ?`,
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
        nombre: string,
        precio: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR NOMBRE
            // ---------------------------------------------

            if (
                nombre === null ||
                nombre === undefined ||
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El nombre del servicio es obligatorio"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR PRECIO
            // ---------------------------------------------

            if (
                typeof precio !== "number" ||
                !Number.isFinite(precio) ||
                precio < 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El precio debe ser un número válido mayor o igual a 0"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR DUPLICADO
            // ---------------------------------------------

            db.query(
                `SELECT id_servicio
                 FROM Servicio
                 WHERE nombre = ?
                 LIMIT 1`,
                [nombre.trim()],
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
                            mensaje: "Ya existe un servicio con ese nombre"
                        });

                        return;
                    }


                    // -----------------------------------------
                    // INSERTAR
                    // -----------------------------------------

                    db.query(
                        `INSERT INTO Servicio
                        (
                            nombre,
                            precio
                        )
                        VALUES (?, ?)`,
                        [
                            nombre.trim(),
                            precio
                        ],
                        (error, resultado: any) => {

                            if (error) {

                                if (
                                    error.code ===
                                    "ER_DUP_ENTRY"
                                ) {

                                    reject({
                                        tipo: "DUPLICADO",
                                        mensaje: "Ya existe un servicio con ese nombre"
                                    });

                                    return;
                                }

                                reject(error);
                                return;
                            }

                            resolve({
                                mensaje:
                                    "Servicio creado correctamente",

                                servicio: {
                                    id_servicio: resultado.insertId,
                                    nombre: nombre.trim(),
                                    precio
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
        nombre: string,
        precio: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ---------------------------------------------
            // VALIDAR ID
            // ---------------------------------------------

            if (!Number.isInteger(id) || id <= 0) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El ID del servicio no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR NOMBRE
            // ---------------------------------------------

            if (
                nombre === null ||
                nombre === undefined ||
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El nombre del servicio es obligatorio"
                });

                return;
            }


            // ---------------------------------------------
            // VALIDAR PRECIO
            // ---------------------------------------------

            if (
                typeof precio !== "number" ||
                !Number.isFinite(precio) ||
                precio < 0
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El precio debe ser un número válido mayor o igual a 0"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR QUE EXISTA
            // ---------------------------------------------

            db.query(
                `SELECT id_servicio
                 FROM Servicio
                 WHERE id_servicio = ?
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
                            mensaje: "El servicio no existe"
                        });

                        return;
                    }


                    // -----------------------------------------
                    // VERIFICAR DUPLICADO
                    // -----------------------------------------

                    db.query(
                        `SELECT id_servicio
                         FROM Servicio
                         WHERE nombre = ?
                         AND id_servicio <> ?
                         LIMIT 1`,
                        [
                            nombre.trim(),
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
                                        "Ya existe otro servicio con ese nombre"
                                });

                                return;
                            }


                            // ---------------------------------
                            // ACTUALIZAR
                            // ---------------------------------

                            db.query(
                                `UPDATE Servicio
                                 SET
                                     nombre = ?,
                                     precio = ?
                                 WHERE id_servicio = ?`,
                                [
                                    nombre.trim(),
                                    precio,
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
                                                    "Ya existe otro servicio con ese nombre"
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
                                            mensaje:
                                                "El servicio no existe"
                                        });

                                        return;
                                    }


                                    resolve({
                                        mensaje:
                                            "Servicio actualizado correctamente",

                                        servicio: {
                                            id_servicio: id,
                                            nombre: nombre.trim(),
                                            precio
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
                    mensaje: "El ID del servicio no es válido"
                });

                return;
            }


            // ---------------------------------------------
            // VERIFICAR QUE EXISTA
            // ---------------------------------------------

            db.query(
                `SELECT id_servicio
                 FROM Servicio
                 WHERE id_servicio = ?
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
                                "El servicio no existe o ya fue eliminado"
                        });

                        return;
                    }


                    // -----------------------------------------
                    // ELIMINAR
                    // -----------------------------------------

                    db.query(
                        `DELETE FROM Servicio
                         WHERE id_servicio = ?`,
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
                                            "No se puede eliminar el servicio porque está relacionado con otros registros"
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
                                        "El servicio no existe o ya fue eliminado"
                                });

                                return;
                            }


                            resolve({
                                mensaje:
                                    "Servicio eliminado correctamente",

                                id_servicio: id
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

export const servicioService =
    new ServicioService();