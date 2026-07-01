import { CargoEmpleado } from "./cargoEmpleado";

export interface empleado{
    id_empleado: number,
    nombre: string,
    apellido: string,
    cargo: CargoEmpleado
}