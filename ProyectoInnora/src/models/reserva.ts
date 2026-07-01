import { EstadoReserva } from './estadoReserva';

export interface reserva{
    id_reserva: number,
    fecha_entrada: Date,
    fecha_salida: Date,
    estado: EstadoReserva,
    huesped_id_huesped: number | null;
    habitacion_id_habitacion: number | null;
}