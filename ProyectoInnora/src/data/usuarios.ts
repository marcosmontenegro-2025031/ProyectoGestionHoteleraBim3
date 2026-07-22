import { usuario } from "../models/usuario";
import { Rol } from "../models/rolUsuario";

export const listaUsuarios: usuario[] = [
    {
        id_usuario: 1,
        nombre: "Carlos",
        apellido: "Mendoza",
        correo: "carlos.mendoza.admin@gmail.com",
        contrasena: "Admin2026!",
        rol: Rol.ADMIN,
        empleado_id_empleado: 101,
        huesped_id_huesped: null
    },
    {
        id_usuario: 2,
        nombre: "Ana",
        apellido: "Gómez",
        correo: "ana.gomez.recepcion@outlook.com",
        contrasena: "Empleado_2026",
        rol: Rol.EMPLEADO,
        empleado_id_empleado: 102,
        huesped_id_huesped: null
    },
    {
        id_usuario: 3,
        nombre: "Luis",
        apellido: "Martínez",
        correo: "luis.martinez.99@yahoo.com",
        contrasena: "Luis12345",
        rol: Rol.HUESPED,
        empleado_id_empleado: null,
        huesped_id_huesped: 501
    },
    {
        id_usuario: 4,
        nombre: "María",
        apellido: "Rodríguez",
        correo: "maria.rodriguez.lodging@icloud.com",
        contrasena: "MariaPassword",
        rol: Rol.HUESPED,
        empleado_id_empleado: null,
        huesped_id_huesped: 502
    }
];
