import db from "../config/database";

export class ConsumoServicioService {
    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM ConsumoServicio",
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
                "SELECT * FROM ConsumoServicio WHERE id_consumo = ?",
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
        cantidad: number,
        id_reserva: number,
        id_servicio: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ConsumoServicio
                (cantidad, id_reserva, id_servicio)
                VALUES (?, ?, ?)`,
                [cantidad, id_reserva, id_servicio],
                (error, resultado: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_consumo: resultado.insertId,
                            cantidad: cantidad,
                            id_reserva: id_reserva,
                            id_servicio: id_servicio
                        });
                    }
                }
            );
        });
    }

    actualizar(
        id: number,
        cantidad: number,
        id_reserva: number,
        id_servicio: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ConsumoServicio
                SET cantidad = ?,
                    id_reserva = ?,
                    id_servicio = ?
                WHERE id_consumo = ?`,
                [cantidad, id_reserva, id_servicio, id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Consumo de servicio actualizado correctamente"
                        });
                    }
                }
            );
        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM ConsumoServicio WHERE id_consumo = ?",
                [id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Consumo de servicio eliminado correctamente"
                        });
                    }
                }
            );
        });
    }
}

export const consumoServicioService = new ConsumoServicioService();