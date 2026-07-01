import { EstadoHabitacion } from "./estadoHabitacion";

export interface habitacion{
    id_habitacion: number,
    numero: string,
    estado: EstadoHabitacion,
    precio: number,
    tipoHabitacion_id_tipoHabitacion: number | null;
}