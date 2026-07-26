import db from "../config/database";

export class FacturaService {
    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM Factura",
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
                "SELECT * FROM Factura WHERE id_factura = ?",
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
        numero_factura: string,
        total: number,
        fecha: string,
        id_reserva: number,
        id_metodo_pago: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO Factura
                (numero_factura, total, fecha, id_reserva, id_metodo_pago)
                VALUES (?, ?, ?, ?, ?)`,
                [numero_factura, total, fecha, id_reserva, id_metodo_pago],
                (error, resultado: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_factura: resultado.insertId,
                            numero_factura: numero_factura,
                            total: total,
                            fecha: fecha,
                            id_reserva: id_reserva,
                            id_metodo_pago: id_metodo_pago
                        });
                    }
                }
            );
        });
    }

    actualizar(
        id: number,
        numero_factura: string,
        total: number,
        fecha: string,
        id_reserva: number,
        id_metodo_pago: number
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE Factura
                SET numero_factura = ?,
                    total = ?,
                    fecha = ?,
                    id_reserva = ?,
                    id_metodo_pago = ?
                WHERE id_factura = ?`,
                [
                    numero_factura,
                    total,
                    fecha,
                    id_reserva,
                    id_metodo_pago,
                    id
                ],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Factura actualizada correctamente"
                        });
                    }
                }
            );
        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM Factura WHERE id_factura = ?",
                [id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Factura eliminada correctamente"
                        });
                    }
                }
            );
        });
    }
}

export const facturaService = new FacturaService();