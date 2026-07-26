import db from "../config/database";

export class ReservaService {
    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM Reserva",
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
                "SELECT * FROM Reserva WHERE id_reserva = ?",
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
        fecha_entrada: string,
        fecha_salida: string,
        estado: string,
        id_huesped: number,
        id_empleado: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO Reserva
                (fecha_entrada, fecha_salida, estado, id_huesped, id_empleado)
                VALUES (?, ?, ?, ?, ?)`,
                [fecha_entrada, fecha_salida, estado, id_huesped, id_empleado],
                (error, resultado: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_reserva: resultado.insertId,
                            fecha_entrada: fecha_entrada,
                            fecha_salida: fecha_salida,
                            estado: estado,
                            id_huesped: id_huesped,
                            id_empleado: id_empleado
                        });
                    }
                }
            );
        });
    }

    actualizar(
        id: number,
        fecha_entrada: string,
        fecha_salida: string,
        estado: string,
        id_huesped: number,
        id_empleado: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE Reserva
                SET fecha_entrada = ?,
                    fecha_salida = ?,
                    estado = ?,
                    id_huesped = ?,
                    id_empleado = ?
                WHERE id_reserva = ?`,
                [fecha_entrada, fecha_salida, estado, id_huesped, id_empleado, id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Reserva actualizada correctamente"
                        });
                    }
                }
            );
        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM Reserva WHERE id_reserva = ?",
                [id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Reserva eliminada correctamente"
                        });
                    }
                }
            );
        });
    }
}

export const reservaService = new ReservaService();