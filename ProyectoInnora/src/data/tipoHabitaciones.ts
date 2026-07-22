import { tipoHabitacion } from "../models/tipoHabitacion";

export const listaTipoHabitaciones: tipoHabitacion[] = [
    {
        id_tipo_habitacion: 1,
        nombre: "Individual",
        descripcion: "Habitación con cama individual, ideal para viajeros solitarios."
    },
    {
        id_tipo_habitacion: 2,
        nombre: "Doble",
        descripcion: "Habitación con dos camas individuales o una matrimonial, perfecta para parejas o amigos."
    },
    {
        id_tipo_habitacion: 3,
        nombre: "Suite",
        descripcion: "Habitación de lujo espaciosa con sala de estar, vistas panorámicas y servicios premium."
    },
    {
        id_tipo_habitacion: 4,
        nombre: "Familiar",
        descripcion: "Habitación equipada con múltiples camas, diseñada para el confort de grupos y familias."
    }
];
