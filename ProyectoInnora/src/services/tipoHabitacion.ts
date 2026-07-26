import db from "../config/database";

export class TipoHabitacionService {

    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM TipoHabitacion",
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
                "SELECT * FROM TipoHabitacion WHERE id_tipo_habitacion = ?",
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
        descripcion: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `INSERT INTO TipoHabitacion
                (nombre, descripcion)
                VALUES (?, ?)`,
                [
                    nombre,
                    descripcion
                ],
                (error, resultado: any) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_tipo_habitacion: resultado.insertId,
                            nombre: nombre,
                            descripcion: descripcion
                        });
                    }

                }
            );

        });
    }

    actualizar(
        id: number,
        nombre: string,
        descripcion: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `UPDATE TipoHabitacion
                SET nombre = ?,
                    descripcion = ?
                WHERE id_tipo_habitacion = ?`,
                [
                    nombre,
                    descripcion,
                    id
                ],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Tipo de habitación actualizado correctamente"
                        });
                    }

                }
            );

        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "DELETE FROM TipoHabitacion WHERE id_tipo_habitacion = ?",
                [id],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Tipo de habitación eliminado correctamente"
                        });
                    }

                }
            );

        });
    }
}

export const tipoHabitacionService = new TipoHabitacionService();