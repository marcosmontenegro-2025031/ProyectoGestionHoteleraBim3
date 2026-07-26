import db from "../config/database";

export class HistorialReservaService {
    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM HistorialReserva",
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
                "SELECT * FROM HistorialReserva WHERE id_historia = ?",
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
        estado_anterior: string,
        estado_nuevo: string,
        fecha: string,
        id_reserva: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO HistorialReserva
                (estado_anterior, estado_nuevo, fecha, id_reserva)
                VALUES (?, ?, ?, ?)`,
                [estado_anterior, estado_nuevo, fecha, id_reserva],
                (error, resultado: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_historia: resultado.insertId,
                            estado_anterior: estado_anterior,
                            estado_nuevo: estado_nuevo,
                            fecha: fecha,
                            id_reserva: id_reserva
                        });
                    }
                }
            );
        });
    }

    actualizar(
        id: number,
        estado_anterior: string,
        estado_nuevo: string,
        fecha: string,
        id_reserva: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE HistorialReserva
                SET estado_anterior = ?,
                    estado_nuevo = ?,
                    fecha = ?,
                    id_reserva = ?
                WHERE id_historia = ?`,
                [estado_anterior, estado_nuevo, fecha, id_reserva, id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Historial de reserva actualizado correctamente"
                        });
                    }
                }
            );
        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM HistorialReserva WHERE id_historia = ?",
                [id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Historial de reserva eliminado correctamente"
                        });
                    }
                }
            );
        });
    }
}

export const historialReservaService = new HistorialReservaService();