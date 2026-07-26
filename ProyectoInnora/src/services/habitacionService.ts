import db from "../config/database";

export class HabitacionService {

    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Habitacion",
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
                "SELECT * FROM Habitacion WHERE id_habitacion = ?",
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
        numero: string,
        estado: string,
        precio: number,
        id_tipo_habitacion: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `INSERT INTO Habitacion
                (numero, estado, precio, id_tipo_habitacion)
                VALUES (?, ?, ?, ?)`,
                [
                    numero,
                    estado,
                    precio,
                    id_tipo_habitacion
                ],
                (error, resultado: any) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_habitacion: resultado.insertId,
                            numero: numero,
                            estado: estado,
                            precio: precio,
                            id_tipo_habitacion: id_tipo_habitacion
                        });
                    }

                }
            );

        });
    }

    actualizar(
        id: number,
        numero: string,
        estado: string,
        precio: number,
        id_tipo_habitacion: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `UPDATE Habitacion
                SET numero = ?,
                    estado = ?,
                    precio = ?,
                    id_tipo_habitacion = ?
                WHERE id_habitacion = ?`,
                [
                    numero,
                    estado,
                    precio,
                    id_tipo_habitacion,
                    id
                ],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Habitación actualizada correctamente"
                        });
                    }

                }
            );

        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "DELETE FROM Habitacion WHERE id_habitacion = ?",
                [id],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Habitación eliminada correctamente"
                        });
                    }

                }
            );

        });
    }
}

export const habitacionService = new HabitacionService();