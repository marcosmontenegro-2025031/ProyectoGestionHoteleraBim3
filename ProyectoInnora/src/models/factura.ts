export interface ConsumoServicio {
    id: number,
    numero_factura: string,
    total: number,
    fecha: Date,
    id_reserva: number,
    id_metodo_pago: number,
}