import { habitacion } from "../models/habitacion";
import { EstadoHabitacion } from "../models/estadoHabitacion";

export const listaHabitaciones: habitacion[] = [
    {
        id_habitacion: 1,
        numero: "101",
        estado: EstadoHabitacion.DISPONIBLE,
        precio: 50.00,
        tipoHabitacion_id_tipoHabitacion: 1
    },
    {
        id_habitacion: 2,
        numero: "102",
        estado: EstadoHabitacion.OCUPADA,
        precio: 85.50,
        tipoHabitacion_id_tipoHabitacion: 2
    },
    {
        id_habitacion: 3,
        numero: "201",
        estado: EstadoHabitacion.MATENIMIENTO,
        precio: 120.00,
        tipoHabitacion_id_tipoHabitacion: 3
    },
    {
        id_habitacion: 4,
        numero: "202",
        estado: EstadoHabitacion.DISPONIBLE,
        precio: 45.00,
        tipoHabitacion_id_tipoHabitacion: null
    }
];
