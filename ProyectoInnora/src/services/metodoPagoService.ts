import db from "../config/database";

export class MetodoPagoService {
    obtenerTodos(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM MetodoPago",
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
                "SELECT * FROM MetodoPago WHERE id_metodo_pago = ?",
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
        tipo: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO MetodoPago
                (tipo)
                VALUES (?)`,
                [tipo],
                (error, resultado: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            id_metodo_pago: resultado.insertId,
                            tipo: tipo
                        });
                    }
                }
            );
        });
    }

    actualizar(
        id: number,
        tipo: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE MetodoPago
                SET tipo = ?
                WHERE id_metodo_pago = ?`,
                [tipo, id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Método de pago actualizado correctamente"
                        });
                    }
                }
            );
        });
    }

    eliminar(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM MetodoPago WHERE id_metodo_pago = ?",
                [id],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            mensaje: "Método de pago eliminado correctamente"
                        });
                    }
                }
            );
        });
    }
}

export const metodoPagoService = new MetodoPagoService();