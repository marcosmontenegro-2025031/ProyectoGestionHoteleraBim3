import { empleado } from "../models/empleado";
import { CargoEmpleado } from "../models/cargoEmpleado";

export const listaEmpleados: empleado[] = [
    {
        id_empleado: 101,
        nombre: "Carlos",
        apellido: "Mendoza",
        cargo: CargoEmpleado.GENERAL_MANAGER
    },
    {
        id_empleado: 102,
        nombre: "Ana",
        apellido: "Gómez",
        cargo: CargoEmpleado.RECEPCIONIST
    },
    {
        id_empleado: 103,
        nombre: "Pedro",
        apellido: "Ramírez",
        cargo: CargoEmpleado.TECHNICIAN
    },
    {
        id_empleado: 104,
        nombre: "Sofía",
        apellido: "López",
        cargo: CargoEmpleado.ROOM_ATTENDANT
    }
];
