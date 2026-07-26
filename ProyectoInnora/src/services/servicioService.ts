import db from "../config/database";

export class ServicioService {
    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM Servicio",
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
                "SELECT * FROM Servicio WHERE id_servicio = ?",
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
        precio: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO Servicio
                (nombre, precio)
                VALUES (?, ?)`,
                [nombre, precio],
                (error, resultado: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_servicio: resultado.insertId,
                            nombre: nombre,
                            precio: precio
                        });
                    }
                }
            );
        });
    }

    actualizar(
        id: number,
        nombre: string,
        precio: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE Servicio
                SET nombre = ?,
                    precio = ?
                WHERE id_servicio = ?`,
                [nombre, precio, id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Servicio actualizado correctamente"
                        });
                    }
                }
            );
        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM Servicio WHERE id_servicio = ?",
                [id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Servicio eliminado correctamente"
                        });
                    }
                }
            );
        });
    }
}

export const servicioService = new ServicioService();