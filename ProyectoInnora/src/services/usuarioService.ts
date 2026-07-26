import db from "../config/database";

export class UsuarioService {

    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Usuario",
                (error, resultados) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(resultados);
                    }

                }
            );

        });
    }

    obtenerPorId(id: number): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Usuario WHERE id_usuario = ?",
                [id],
                (error, resultados: any) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(resultados[0]);
                    }

                }
            );

        });
    }

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

            db.query(
                `INSERT INTO Usuario
                (nombre, apellido, correo, contrasena, rol,
                empleado_id_empleado, huesped_id_huesped)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    nombre,
                    apellido,
                    correo,
                    contrasena,
                    rol,
                    empleado_id_empleado,
                    huesped_id_huesped
                ],
                (error, resultado: any) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_usuario: resultado.insertId,
                            nombre: nombre,
                            apellido: apellido,
                            correo: correo,
                            contrasena: contrasena,
                            rol: rol,
                            empleado_id_empleado: empleado_id_empleado,
                            huesped_id_huesped: huesped_id_huesped
                        });
                    }

                }
            );

        });
    }

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

            db.query(
                `UPDATE Usuario
                SET nombre = ?,
                    apellido = ?,
                    correo = ?,
                    contrasena = ?,
                    rol = ?,
                    empleado_id_empleado = ?,
                    huesped_id_huesped = ?
                WHERE id_usuario = ?`,
                [
                    nombre,
                    apellido,
                    correo,
                    contrasena,
                    rol,
                    empleado_id_empleado,
                    huesped_id_huesped,
                    id
                ],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Usuario actualizado correctamente"
                        });
                    }

                }
            );

        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "DELETE FROM Usuario WHERE id_usuario = ?",
                [id],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Usuario eliminado correctamente"
                        });
                    }

                }
            );

        });
    }
}

export const usuarioService = new UsuarioService();