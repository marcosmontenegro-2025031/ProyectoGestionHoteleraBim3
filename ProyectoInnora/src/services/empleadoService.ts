import db from "../config/database";

export class EmpleadoService {

    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Empleado",
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
                "SELECT * FROM Empleado WHERE id_empleado = ?",
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
        cargo: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `INSERT INTO Empleado
                (nombre, apellido, cargo)
                VALUES (?, ?, ?)`,
                [
                    nombre,
                    apellido,
                    cargo
                ],
                (error, resultado: any) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_empleado: resultado.insertId,
                            nombre: nombre,
                            apellido: apellido,
                            cargo: cargo
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
        cargo: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `UPDATE Empleado
                SET nombre = ?,
                    apellido = ?,
                    cargo = ?
                WHERE id_empleado = ?`,
                [
                    nombre,
                    apellido,
                    cargo,
                    id
                ],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Empleado actualizado correctamente"
                        });
                    }

                }
            );

        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "DELETE FROM Empleado WHERE id_empleado = ?",
                [id],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Empleado eliminado correctamente"
                        });
                    }

                }
            );

        });
    }
}

export const empleadoService = new EmpleadoService();