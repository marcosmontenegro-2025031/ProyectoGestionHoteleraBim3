import { Rol } from "./rolUsuario";

export interface usuario{
    id_usuario: number,
    nombre: string,
    apellido: string,
    correo: string,
    contrasena: string,
    rol: Rol,
    empleado_id_empleado: number | null;
    huesped_id_huesped: number | null;
}