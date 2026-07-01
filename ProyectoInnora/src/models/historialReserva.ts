export interface HistorialReserva {
    id_hitorial: number,
    estado_anterior: string,
    estado_nuevo: string,
    fecha: Date,
    reserva_id_reserva: number | null;
}