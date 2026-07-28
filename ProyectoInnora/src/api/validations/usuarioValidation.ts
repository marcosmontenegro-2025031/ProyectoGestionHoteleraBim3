import { z } from "zod";

export const usuarioSchema = z.object({

    nombre: z
        .string({
            error: "El nombre es obligatorio"
        })
        .trim()
        .min(3, {
            error: "El nombre debe tener al menos 3 caracteres"
        })
        .max(100, {
            error: "El nombre no puede superar los 100 caracteres"
        }),

    apellido: z
        .string({
            error: "El apellido es obligatorio"
        })
        .trim()
        .min(3, {
            error: "El apellido debe tener al menos 3 caracteres"
        })
        .max(100, {
            error: "El apellido no puede superar los 100 caracteres"
        }),

    correo: z
        .string({
            error: "El correo es obligatorio"
        })
        .trim()
        .email({
            error: "El correo electrónico no es válido"
        }),

    contrasena: z
        .string({
            error: "La contraseña es obligatoria"
        })
        .min(6, {
            error: "La contraseña debe tener al menos 6 caracteres"
        })
        .max(255, {
            error: "La contraseña no puede superar los 255 caracteres"
        }),

    rol: z
        .string({
            error: "El rol debe ser texto"
        })
        .trim()
        .max(50, {
            error: "El rol no puede superar los 50 caracteres"
        }),

    empleado_id_empleado: z
        .number({
            error: "El ID del empleado debe ser un número"
        })
        .int({
            error: "El ID del empleado debe ser entero"
        })
        .positive({
            error: "El ID del empleado debe ser mayor que 0"
        }),

    huesped_id_huesped: z
        .number({
            error: "El ID del huésped debe ser un número"
        })
        .int({
            error: "El ID del huésped debe ser entero"
        })
        .positive({
            error: "El ID del huésped debe ser mayor que 0"
        })

});

export const validarUsuario = (data: unknown) => {

    return usuarioSchema.parse(data);

};