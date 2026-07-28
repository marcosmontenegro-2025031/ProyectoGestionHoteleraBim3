import db from "../config/database";

// =====================================================
// TIPO DE ERROR DEL SERVICIO
// =====================================================

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


// =====================================================
// SERVICIO HUESPED
// =====================================================

export class HuespedService {

    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos(): Promise<any[]> {

        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Huesped",

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


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id: number
    ): Promise<any | null> {

        return new Promise((resolve, reject) => {

            db.query(
                `SELECT *
                 FROM Huesped
                 WHERE id_huesped = ?`,
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


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        nombre: string,
        apellido: string,
        dpi: string,
        telefono: string | null,
        correo: string | null
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // -------------------------------------------------
            // VALIDACIONES
            // -------------------------------------------------

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
                dpi === undefined ||
                dpi === null ||
                typeof dpi !== "string" ||
                dpi.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El DPI es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            // -------------------------------------------------
            // VERIFICAR DPI
            // -------------------------------------------------

            db.query(
                `SELECT id_huesped
                 FROM Huesped
                 WHERE dpi = ?
                 LIMIT 1`,
                [dpi],

                (error, resultados: any[]) => {

                    if (error) {
                        reject(error);
                        return;
                    }


                    // -------------------------------------------------
                    // DPI DUPLICADO
                    // -------------------------------------------------

                    if (
                        resultados &&
                        resultados.length > 0
                    ) {

                        reject(
                            new ServiceError(
                                "El DPI ya está registrado",
                                "DUPLICADO"
                            )
                        );

                        return;
                    }


                    // -------------------------------------------------
                    // VERIFICAR CORREO
                    // -------------------------------------------------

                    if (
                        correo !== null &&
                        correo !== undefined &&
                        correo.trim() !== ""
                    ) {

                        db.query(
                            `SELECT id_huesped
                             FROM Huesped
                             WHERE correo = ?
                             LIMIT 1`,
                            [correo],

                            (error, correos: any[]) => {

                                if (error) {
                                    reject(error);
                                    return;
                                }


                                // -------------------------------------------------
                                // CORREO DUPLICADO
                                // -------------------------------------------------

                                if (
                                    correos &&
                                    correos.length > 0
                                ) {

                                    reject(
                                        new ServiceError(
                                            "El correo ya está registrado",
                                            "DUPLICADO"
                                        )
                                    );

                                    return;
                                }


                                this.insertar(
                                    nombre.trim(),
                                    apellido.trim(),
                                    dpi.trim(),
                                    telefono,
                                    correo.trim(),
                                    resolve,
                                    reject
                                );

                            }
                        );

                        return;
                    }


                    // -------------------------------------------------
                    // INSERTAR SIN CORREO
                    // -------------------------------------------------

                    this.insertar(
                        nombre.trim(),
                        apellido.trim(),
                        dpi.trim(),
                        telefono,
                        null,
                        resolve,
                        reject
                    );

                }
            );

        });
    }


    // =====================================================
    // INSERTAR
    // =====================================================

    private insertar(
        nombre: string,
        apellido: string,
        dpi: string,
        telefono: string | null,
        correo: string | null,
        resolve: (value: any) => void,
        reject: (reason?: any) => void
    ): void {

        db.query(
            `INSERT INTO Huesped
            (
                nombre,
                apellido,
                dpi,
                telefono,
                correo
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                dpi,
                telefono,
                correo
            ],

            (error, resultado: any) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    mensaje: "Huésped creado correctamente",

                    huesped: {
                        id_huesped: resultado.insertId,
                        nombre,
                        apellido,
                        dpi,
                        telefono,
                        correo
                    }
                });

            }
        );
    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar(
        id: number,
        nombre: string,
        apellido: string,
        dpi: string,
        telefono: string | null,
        correo: string | null
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // -------------------------------------------------
            // VALIDACIONES
            // -------------------------------------------------

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
                dpi === undefined ||
                dpi === null ||
                typeof dpi !== "string" ||
                dpi.trim() === ""
            ) {

                reject(
                    new ServiceError(
                        "El DPI es obligatorio",
                        "VALIDATION_ERROR"
                    )
                );

                return;
            }


            // -------------------------------------------------
            // VERIFICAR QUE EXISTA
            // -------------------------------------------------

            db.query(
                `SELECT id_huesped
                 FROM Huesped
                 WHERE id_huesped = ?
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
                                "El huésped no existe",
                                "NOT_FOUND"
                            )
                        );

                        return;
                    }


                    // -------------------------------------------------
                    // VERIFICAR DPI DUPLICADO
                    // -------------------------------------------------

                    db.query(
                        `SELECT id_huesped
                         FROM Huesped
                         WHERE dpi = ?
                         AND id_huesped <> ?
                         LIMIT 1`,
                        [
                            dpi,
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
                                        "El DPI ya pertenece a otro huésped",
                                        "DUPLICADO"
                                    )
                                );

                                return;
                            }


                            // -------------------------------------------------
                            // VERIFICAR CORREO
                            // -------------------------------------------------

                            if (
                                correo !== null &&
                                correo !== undefined &&
                                correo.trim() !== ""
                            ) {

                                db.query(
                                    `SELECT id_huesped
                                     FROM Huesped
                                     WHERE correo = ?
                                     AND id_huesped <> ?
                                     LIMIT 1`,
                                    [
                                        correo,
                                        id
                                    ],

                                    (
                                        error,
                                        correos: any[]
                                    ) => {

                                        if (error) {
                                            reject(error);
                                            return;
                                        }


                                        if (
                                            correos &&
                                            correos.length > 0
                                        ) {

                                            reject(
                                                new ServiceError(
                                                    "El correo ya pertenece a otro huésped",
                                                    "DUPLICADO"
                                                )
                                            );

                                            return;
                                        }


                                        this.actualizarBD(
                                            id,
                                            nombre.trim(),
                                            apellido.trim(),
                                            dpi.trim(),
                                            telefono,
                                            correo.trim(),
                                            resolve,
                                            reject
                                        );

                                    }
                                );

                                return;
                            }


                            // -------------------------------------------------
                            // ACTUALIZAR SIN CORREO
                            // -------------------------------------------------

                            this.actualizarBD(
                                id,
                                nombre.trim(),
                                apellido.trim(),
                                dpi.trim(),
                                telefono,
                                null,
                                resolve,
                                reject
                            );

                        }
                    );

                }
            );

        });
    }


    // =====================================================
    // ACTUALIZAR BD
    // =====================================================

    private actualizarBD(
        id: number,
        nombre: string,
        apellido: string,
        dpi: string,
        telefono: string | null,
        correo: string | null,
        resolve: (value: any) => void,
        reject: (reason?: any) => void
    ): void {

        db.query(
            `UPDATE Huesped
             SET
                nombre = ?,
                apellido = ?,
                dpi = ?,
                telefono = ?,
                correo = ?
             WHERE id_huesped = ?`,
            [
                nombre,
                apellido,
                dpi,
                telefono,
                correo,
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
                            "No se pudo actualizar el huésped",
                            "NOT_UPDATED"
                        )
                    );

                    return;
                }


                resolve({
                    mensaje: "Huésped actualizado correctamente",

                    huesped: {
                        id_huesped: id,
                        nombre,
                        apellido,
                        dpi,
                        telefono,
                        correo
                    }
                });

            }
        );
    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id: number
    ): Promise<any> {

        return new Promise((resolve, reject) => {

            // -------------------------------------------------
            // VERIFICAR EXISTENCIA
            // -------------------------------------------------

            db.query(
                `SELECT id_huesped
                 FROM Huesped
                 WHERE id_huesped = ?
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
                                "El huésped no existe",
                                "NOT_FOUND"
                            )
                        );

                        return;
                    }


                    // -------------------------------------------------
                    // ELIMINAR
                    // -------------------------------------------------

                    db.query(
                        `DELETE FROM Huesped
                         WHERE id_huesped = ?`,
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
                                        "No se pudo eliminar el huésped",
                                        "NOT_DELETED"
                                    )
                                );

                                return;
                            }


                            resolve({
                                id_huesped: id,
                                mensaje:
                                    "Huésped eliminado correctamente"
                            });

                        }
                    );

                }
            );

        });
    }
}


// =====================================================
// INSTANCIA
// =====================================================

export const huespedService =
    new HuespedService();