import db from "../config/database";

// ======================================================
// ERROR PERSONALIZADO
// ======================================================

class ServiceError extends Error {

    code: string;

    constructor(
        mensaje: string,
        code: string
    ) {
        super(mensaje);

        this.name = "ServiceError";
        this.code = code;

        Object.setPrototypeOf(
            this,
            ServiceError.prototype
        );
    }
}


// ======================================================
// SERVICIO USUARIO
// ======================================================

export class UsuarioService {

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                `SELECT
                    id_usuario,
                    nombre,
                    apellido,
                    correo,
                    rol,
                    empleado_id_empleado,
                    huesped_id_huesped
                 FROM Usuario`,

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

    obtenerPorId(
        id: number
    ): Promise<any | null> {

        return new Promise((resolve, reject) => {

            db.query(
                `SELECT
                    id_usuario,
                    nombre,
                    apellido,
                    correo,
                    rol,
                    empleado_id_empleado,
                    huesped_id_huesped
                 FROM Usuario
                 WHERE id_usuario = ?`,
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
        apellido: string,
        correo: string,
        contrasena: string,
        rol: string,
        empleado_id_empleado: number | null,
        huesped_id_huesped: number | null
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ==================================================
            // VALIDACIONES
            // ==================================================

            if (
                nombre === undefined ||
                nombre === null ||
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El nombre es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                apellido === undefined ||
                apellido === null ||
                typeof apellido !== "string" ||
                apellido.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El apellido es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                correo === undefined ||
                correo === null ||
                typeof correo !== "string" ||
                correo.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El correo es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                contrasena === undefined ||
                contrasena === null ||
                typeof contrasena !== "string" ||
                contrasena.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "La contraseña es obligatoria",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                rol === undefined ||
                rol === null ||
                typeof rol !== "string" ||
                rol.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El rol es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            // ==================================================
            // VERIFICAR CORREO DUPLICADO
            // ==================================================

            db.query(
                `SELECT id_usuario
                 FROM Usuario
                 WHERE correo = ?
                 LIMIT 1`,
                [correo.trim()],

                (error, resultados: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }


                    if (
                        resultados &&
                        resultados.length > 0
                    ) {

                        reject(
                            new ServiceError(
                                "El correo ya está registrado",
                                "DUPLICADO"
                            )
                        );

                        return;
                    }


                    // ==================================================
                    // INSERTAR
                    // ==================================================

                    db.query(
                        `INSERT INTO Usuario
                        (
                            nombre,
                            apellido,
                            correo,
                            contrasena,
                            rol,
                            empleado_id_empleado,
                            huesped_id_huesped
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            nombre.trim(),
                            apellido.trim(),
                            correo.trim(),
                            contrasena,
                            rol.trim(),
                            empleado_id_empleado,
                            huesped_id_huesped
                        ],

                        (error, resultado: any) => {

                            if (error) {
                                reject(error);
                                return;
                            }


                            resolve({
                                mensaje: "Usuario creado correctamente",

                                usuario: {
                                    id_usuario: resultado.insertId,
                                    nombre: nombre.trim(),
                                    apellido: apellido.trim(),
                                    correo: correo.trim(),
                                    rol: rol.trim(),
                                    empleado_id_empleado,
                                    huesped_id_huesped
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
        correo: string,
        contrasena: string,
        rol: string,
        empleado_id_empleado: number | null,
        huesped_id_huesped: number | null
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ==================================================
            // VALIDACIONES
            // ==================================================

            if (
                nombre === undefined ||
                nombre === null ||
                typeof nombre !== "string" ||
                nombre.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El nombre es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                apellido === undefined ||
                apellido === null ||
                typeof apellido !== "string" ||
                apellido.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El apellido es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                correo === undefined ||
                correo === null ||
                typeof correo !== "string" ||
                correo.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El correo es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                contrasena === undefined ||
                contrasena === null ||
                typeof contrasena !== "string" ||
                contrasena.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "La contraseña es obligatoria",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            if (
                rol === undefined ||
                rol === null ||
                typeof rol !== "string" ||
                rol.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El rol es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            // ==================================================
            // VERIFICAR QUE EXISTA
            // ==================================================

            db.query(
                `SELECT id_usuario
                 FROM Usuario
                 WHERE id_usuario = ?
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

                        reject(
                            new ServiceError(
                                "El usuario no existe",
                                "NOT_FOUND"
                            )
                        );

                        return;
                    }


                    // ==================================================
                    // VERIFICAR CORREO DUPLICADO
                    // ==================================================

                    db.query(
                        `SELECT id_usuario
                         FROM Usuario
                         WHERE correo = ?
                         AND id_usuario <> ?
                         LIMIT 1`,
                        [
                            correo.trim(),
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

                                reject(
                                    new ServiceError(
                                        "El correo ya pertenece a otro usuario",
                                        "DUPLICADO"
                                    )
                                );

                                return;
                            }


                            // ==================================================
                            // ACTUALIZAR
                            // ==================================================

                            db.query(
                                `UPDATE Usuario
                                 SET
                                    nombre = ?,
                                    apellido = ?,
                                    correo = ?,
                                    contrasena = ?,
                                    rol = ?,
                                    empleado_id_empleado = ?,
                                    huesped_id_huesped = ?
                                 WHERE id_usuario = ?`,
                                [
                                    nombre.trim(),
                                    apellido.trim(),
                                    correo.trim(),
                                    contrasena,
                                    rol.trim(),
                                    empleado_id_empleado,
                                    huesped_id_huesped,
                                    id
                                ],

                                (error, resultado: any) => {

                                    if (error) {
                                        reject(error);
                                        return;
                                    }


                                    if (
                                        !resultado ||
                                        resultado.affectedRows === 0
                                    ) {

                                        reject(
                                            new ServiceError(
                                                "No se pudo actualizar el usuario",
                                                "NOT_UPDATED"
                                            )
                                        );

                                        return;
                                    }


                                    resolve({
                                        mensaje:
                                            "Usuario actualizado correctamente",

                                        usuario: {
                                            id_usuario: id,
                                            nombre: nombre.trim(),
                                            apellido: apellido.trim(),
                                            correo: correo.trim(),
                                            rol: rol.trim(),
                                            empleado_id_empleado,
                                            huesped_id_huesped
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

    eliminar(
        id: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // ==================================================
            // VERIFICAR EXISTENCIA
            // ==================================================

            db.query(
                `SELECT id_usuario
                 FROM Usuario
                 WHERE id_usuario = ?
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

                        reject(
                            new ServiceError(
                                "El usuario no existe",
                                "NOT_FOUND"
                            )
                        );

                        return;
                    }


                    // ==================================================
                    // ELIMINAR
                    // ==================================================

                    db.query(
                        `DELETE FROM Usuario
                         WHERE id_usuario = ?`,
                        [id],

                        (error, resultado: any) => {

                            if (error) {
                                reject(error);
                                return;
                            }


                            if (
                                !resultado ||
                                resultado.affectedRows === 0
                            ) {

                                reject(
                                    new ServiceError(
                                        "No se pudo eliminar el usuario",
                                        "NOT_DELETED"
                                    )
                                );

                                return;
                            }


                            resolve({
                                mensaje:
                                    "Usuario eliminado correctamente",

                                id_usuario: id
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

export const usuarioService =
    new UsuarioService();