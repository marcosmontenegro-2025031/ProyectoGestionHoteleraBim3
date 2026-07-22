import { reserva } from "../models/reserva";
import { EstadoReserva } from "../models/estadoReserva";

export const listaReservas: reserva[] = [
    {
        id_reserva: 1,
        fecha_entrada: new Date("2026-07-25"),
        fecha_salida: new Date("2026-07-28"),
        estado: EstadoReserva.CONFIRMADA,
        huesped_id_huesped: 501,
        habitacion_id_habitacion: 2
    },
    {
        id_reserva: 2,
        fecha_entrada: new Date("2026-08-01"),
        fecha_salida: new Date("2026-08-05"),
        estado: EstadoReserva.PENDIENTE,
        huesped_id_huesped: 502,
        habitacion_id_habitacion: 1
    },
    {
        id_reserva: 3,
        fecha_entrada: new Date("2026-07-15"),
        fecha_salida: new Date("2026-07-18"),
        estado: EstadoReserva.FINALIZADA,
        huesped_id_huesped: 503,
        habitacion_id_habitacion: 3
    },
    {
        id_reserva: 4,
        fecha_entrada: new Date("2026-09-10"),
        fecha_salida: new Date("2026-09-15"),
        estado: EstadoReserva.CANCELADA,
        huesped_id_huesped: 504,
        habitacion_id_habitacion: null
    }
];
