import db from "../config/database";

// ======================================================
// TIPO PARA ERRORES PERSONALIZADOS
// ======================================================

interface ErrorServicio extends Error {
    code?: string;
}

// ======================================================
// SERVICIO EMPLEADO
// ======================================================

export class EmpleadoService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Empleado",

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

            db.query(
                `SELECT *
                 FROM Empleado
                 WHERE id_empleado = ?`,
                [id],

                (error, resultados) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    const filas = resultados as any[];

                    if (filas.length === 0) {
                        resolve(null);
                        return;
                    }

                    resolve(filas[0]);
                }
            );

        });
    }


    // ======================================================
    // CREAR
    // ======================================================

    crear(
        nombre: string,
        apellido: string,
        cargo: string
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ==================================================
            // VALIDACIONES
            // ==================================================

            if (
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                const error: ErrorServicio =
                    new Error("El nombre es obligatorio");

                error.code = "VALIDACION";

                reject(error);
                return;
            }


            if (
                typeof apellido !== "string" ||
                apellido.trim() === ""
            ) {

                const error: ErrorServicio =
                    new Error("El apellido es obligatorio");

                error.code = "VALIDACION";

                reject(error);
                return;
            }


            if (
                typeof cargo !== "string" ||
                cargo.trim() === ""
            ) {

                const error: ErrorServicio =
                    new Error("El cargo es obligatorio");

                error.code = "VALIDACION";

                reject(error);
                return;
            }


            // ==================================================
            // LIMPIAR DATOS
            // ==================================================

            nombre = nombre.trim();
            apellido = apellido.trim();
            cargo = cargo.trim();


            // ==================================================
            // VERIFICAR DUPLICADO
            // ==================================================

            db.query(
                `SELECT id_empleado
                 FROM Empleado
                 WHERE nombre = ?
                 AND apellido = ?
                 AND cargo = ?`,
                [
                    nombre,
                    apellido,
                    cargo
                ],

                (error, resultados) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    const filas = resultados as any[];


                    // ==================================================
                    // DUPLICADO
                    // ==================================================

                    if (filas.length > 0) {

                        const errorDuplicado: ErrorServicio =
                            new Error(
                                "Ya existe un empleado con esos datos"
                            );

                        errorDuplicado.code = "DUPLICADO";

                        reject(errorDuplicado);
                        return;
                    }


                    // ==================================================
                    // INSERTAR
                    // ==================================================

                    db.query(
                        `INSERT INTO Empleado
                        (
                            nombre,
                            apellido,
                            cargo
                        )
                        VALUES (?, ?, ?)`,
                        [
                            nombre,
                            apellido,
                            cargo
                        ],

                        (error, resultado) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            const datos =
                                resultado as any;

                            resolve({
                                mensaje:
                                    "Empleado creado correctamente",

                                empleado: {
                                    id_empleado:
                                        datos.insertId,

                                    nombre,
                                    apellido,
                                    cargo
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
        apellido: string,
        cargo: string
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ==================================================
            // VALIDACIONES
            // ==================================================

            if (
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                const error: ErrorServicio =
                    new Error("El nombre es obligatorio");

                error.code = "VALIDACION";

                reject(error);
                return;
            }


            if (
                typeof apellido !== "string" ||
                apellido.trim() === ""
            ) {

                const error: ErrorServicio =
                    new Error("El apellido es obligatorio");

                error.code = "VALIDACION";

                reject(error);
                return;
            }


            if (
                typeof cargo !== "string" ||
                cargo.trim() === ""
            ) {

                const error: ErrorServicio =
                    new Error("El cargo es obligatorio");

                error.code = "VALIDACION";

                reject(error);
                return;
            }


            // ==================================================
            // LIMPIAR DATOS
            // ==================================================

            nombre = nombre.trim();
            apellido = apellido.trim();
            cargo = cargo.trim();


            // ==================================================
            // VERIFICAR QUE EXISTA
            // ==================================================

            db.query(
                `SELECT id_empleado
                 FROM Empleado
                 WHERE id_empleado = ?`,
                [id],

                (error, resultados) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    const filas = resultados as any[];


                    if (filas.length === 0) {

                        const errorNoEncontrado: ErrorServicio =
                            new Error(
                                "El empleado no existe"
                            );

                        errorNoEncontrado.code = "NOT_FOUND";

                        reject(errorNoEncontrado);
                        return;
                    }


                    // ==================================================
                    // VERIFICAR DUPLICADO
                    // ==================================================

                    db.query(
                        `SELECT id_empleado
                         FROM Empleado
                         WHERE nombre = ?
                         AND apellido = ?
                         AND cargo = ?
                         AND id_empleado <> ?`,
                        [
                            nombre,
                            apellido,
                            cargo,
                            id
                        ],

                        (error, resultadosDuplicados) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            const duplicados =
                                resultadosDuplicados as any[];


                            if (duplicados.length > 0) {

                                const errorDuplicado: ErrorServicio =
                                    new Error(
                                        "Ya existe otro empleado con esos datos"
                                    );

                                errorDuplicado.code =
                                    "DUPLICADO";

                                reject(errorDuplicado);
                                return;
                            }


                            // ==================================================
                            // ACTUALIZAR
                            // ==================================================

                            db.query(
                                `UPDATE Empleado
                                 SET
                                    nombre = ?,
                                    apellido = ?,
                                    cargo = ?
                                 WHERE id_empleado = ?`,
                                [
                                    nombre,
                                    apellido,
                                    cargo,
                                    id
                                ],

                                (error, resultado) => {

                                    if (error) {
                                        reject(error);
                                        return;
                                    }

                                    const datos =
                                        resultado as any;


                                    // ==================================================
                                    // NO SE ACTUALIZÓ
                                    // ==================================================

                                    if (
                                        typeof datos.affectedRows !== "number" ||
                                        datos.affectedRows === 0
                                    ) {

                                        const errorNoActualizado: ErrorServicio =
                                            new Error(
                                                "No se pudo actualizar el empleado"
                                            );

                                        errorNoActualizado.code =
                                            "NOT_UPDATED";

                                        reject(errorNoActualizado);
                                        return;
                                    }


                                    // ==================================================
                                    // RESPUESTA
                                    // ==================================================

                                    resolve({

                                        mensaje:
                                            "Empleado actualizado correctamente",

                                        empleado: {
                                            id_empleado: id,
                                            nombre,
                                            apellido,
                                            cargo
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

            // ==================================================
            // VERIFICAR EXISTENCIA
            // ==================================================

            db.query(
                `SELECT id_empleado
                 FROM Empleado
                 WHERE id_empleado = ?`,
                [id],

                (error, resultados) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    const filas = resultados as any[];


                    // ==================================================
                    // NO EXISTE
                    // ==================================================

                    if (filas.length === 0) {

                        const errorNoEncontrado: ErrorServicio =
                            new Error(
                                "Empleado no encontrado"
                            );

                        errorNoEncontrado.code =
                            "NOT_FOUND";

                        reject(errorNoEncontrado);
                        return;
                    }


                    // ==================================================
                    // ELIMINAR
                    // ==================================================

                    db.query(
                        `DELETE FROM Empleado
                         WHERE id_empleado = ?`,
                        [id],

                        (error, resultado) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            const datos =
                                resultado as any;


                            // ==================================================
                            // NO SE ELIMINÓ
                            // ==================================================

                            if (
                                typeof datos.affectedRows !== "number" ||
                                datos.affectedRows === 0
                            ) {

                                const errorNoEliminado: ErrorServicio =
                                    new Error(
                                        "No se pudo eliminar el empleado"
                                    );

                                errorNoEliminado.code =
                                    "NOT_DELETED";

                                reject(errorNoEliminado);
                                return;
                            }


                            // ==================================================
                            // RESPUESTA
                            // ==================================================

                            resolve({

                                id_empleado: id,

                                mensaje:
                                    "Empleado eliminado correctamente"

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

export const empleadoService =
    new EmpleadoService();