import db from "../config/database";

export class HuespedService {

    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "SELECT * FROM Huesped",
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
                "SELECT * FROM Huesped WHERE id_huesped = ?",
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
        dpi: string,
        telefono: string,
        correo: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `INSERT INTO Huesped
                (nombre, apellido, dpi, telefono, correo)
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
                    } else {
                        resolve({
                            id_huesped: resultado.insertId,
                            nombre: nombre,
                            apellido: apellido,
                            dpi: dpi,
                            telefono: telefono,
                            correo: correo
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
        dpi: string,
        telefono: string,
        correo: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                `UPDATE Huesped
                SET nombre = ?,
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
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Huésped actualizado correctamente"
                        });
                    }

                }
            );

        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {

            db.query(
                "DELETE FROM Huesped WHERE id_huesped = ?",
                [id],
                (error) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Huésped eliminado correctamente"
                        });
                    }

                }
            );

        });
    }
}

export const huespedService = new HuespedService();