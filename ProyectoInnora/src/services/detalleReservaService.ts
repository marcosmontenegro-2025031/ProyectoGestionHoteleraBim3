import db from "../config/database";

export class DetalleReservaService {
    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM DetalleReserva",
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
                "SELECT * FROM DetalleReserva WHERE id_detalle = ?",
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
        id_reserva: number,
        id_habitacion: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO DetalleReserva
                (id_reserva, id_habitacion)
                VALUES (?, ?)`,
                [id_reserva, id_habitacion],
                (error, resultado: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_detalle: resultado.insertId,
                            id_reserva: id_reserva,
                            id_habitacion: id_habitacion
                        });
                    }
                }
            );
        });
    }

    actualizar(
        id: number,
        id_reserva: number,
        id_habitacion: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE DetalleReserva
                SET id_reserva = ?,
                    id_habitacion = ?
                WHERE id_detalle = ?`,
                [id_reserva, id_habitacion, id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Detalle de reserva actualizado correctamente"
                        });
                    }
                }
            );
        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM DetalleReserva WHERE id_detalle = ?",
                [id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Detalle de reserva eliminado correctamente"
                        });
                    }
                }
            );
        });
    }
}

export const detalleReservaService = new DetalleReservaService();