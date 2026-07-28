import db from "../config/database";

export class TipoHabitacionService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM TipoHabitacion",
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
                 FROM TipoHabitacion
                 WHERE id_tipo_habitacion = ?
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
        nombre: string,
        descripcion: string | null
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // --------------------------------------------------
            // VALIDAR NOMBRE
            // --------------------------------------------------

            if (
                nombre === null ||
                nombre === undefined ||
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje: "El nombre del tipo de habitación es obligatorio"
                });

                return;
            }

            // --------------------------------------------------
            // NORMALIZAR DATOS
            // --------------------------------------------------

            const nombreNormalizado = nombre.trim();

            const descripcionNormalizada =
                descripcion === null ||
                descripcion === undefined
                    ? null
                    : descripcion.trim() === ""
                        ? null
                        : descripcion.trim();


            // --------------------------------------------------
            // VERIFICAR DUPLICADO
            // --------------------------------------------------

            db.query(
                `SELECT id_tipo_habitacion
                 FROM TipoHabitacion
                 WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))
                 LIMIT 1`,
                [nombreNormalizado],
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
                                "Ya existe un tipo de habitación con ese nombre"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // INSERTAR
                    // --------------------------------------------------

                    db.query(
                        `INSERT INTO TipoHabitacion
                        (
                            nombre,
                            descripcion
                        )
                        VALUES (?, ?)`,
                        [
                            nombreNormalizado,
                            descripcionNormalizada
                        ],
                        (error, resultado: any) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            resolve({
                                mensaje:
                                    "Tipo de habitación creado correctamente",

                                tipoHabitacion: {
                                    id_tipo_habitacion:
                                        resultado.insertId,

                                    nombre:
                                        nombreNormalizado,

                                    descripcion:
                                        descripcionNormalizada
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
        descripcion: string | null
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // --------------------------------------------------
            // VALIDAR NOMBRE
            // --------------------------------------------------

            if (
                nombre === null ||
                nombre === undefined ||
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                reject({
                    tipo: "VALIDACION",
                    mensaje:
                        "El nombre del tipo de habitación es obligatorio"
                });

                return;
            }

            const nombreNormalizado = nombre.trim();

            const descripcionNormalizada =
                descripcion === null ||
                descripcion === undefined
                    ? null
                    : descripcion.trim() === ""
                        ? null
                        : descripcion.trim();


            // --------------------------------------------------
            // VERIFICAR QUE EXISTA
            // --------------------------------------------------

            db.query(
                `SELECT id_tipo_habitacion
                 FROM TipoHabitacion
                 WHERE id_tipo_habitacion = ?
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
                                "El tipo de habitación no existe"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // VERIFICAR DUPLICADO
                    // --------------------------------------------------

                    db.query(
                        `SELECT id_tipo_habitacion
                         FROM TipoHabitacion
                         WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))
                         AND id_tipo_habitacion <> ?
                         LIMIT 1`,
                        [
                            nombreNormalizado,
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
                                        "Ya existe otro tipo de habitación con ese nombre"
                                });

                                return;
                            }


                            // --------------------------------------------------
                            // ACTUALIZAR
                            // --------------------------------------------------

                            db.query(
                                `UPDATE TipoHabitacion
                                 SET
                                    nombre = ?,
                                    descripcion = ?
                                 WHERE id_tipo_habitacion = ?`,
                                [
                                    nombreNormalizado,
                                    descripcionNormalizada,
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
                                                "No se pudo actualizar el tipo de habitación"
                                        });

                                        return;
                                    }

                                    resolve({
                                        mensaje:
                                            "Tipo de habitación actualizado correctamente",

                                        tipoHabitacion: {
                                            id_tipo_habitacion: id,
                                            nombre:
                                                nombreNormalizado,
                                            descripcion:
                                                descripcionNormalizada
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

            // --------------------------------------------------
            // VERIFICAR QUE EXISTA
            // --------------------------------------------------

            db.query(
                `SELECT id_tipo_habitacion
                 FROM TipoHabitacion
                 WHERE id_tipo_habitacion = ?
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
                                "El tipo de habitación no existe o ya fue eliminado"
                        });

                        return;
                    }


                    // --------------------------------------------------
                    // ELIMINAR
                    // --------------------------------------------------

                    db.query(
                        `DELETE FROM TipoHabitacion
                         WHERE id_tipo_habitacion = ?`,
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
                                        "El tipo de habitación no existe o ya fue eliminado"
                                });

                                return;
                            }

                            resolve({
                                mensaje:
                                    "Tipo de habitación eliminado correctamente",

                                id_tipo_habitacion: id
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

export const tipoHabitacionService =
    new TipoHabitacionService();