import { z } from "zod";

export const empleadoSchema = z.object({

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

    cargo: z
        .string({
            error: "El cargo es obligatorio"
        })
        .trim()
        .min(3, {
            error: "El cargo debe tener al menos 3 caracteres"
        })
        .max(100, {
            error: "El cargo no puede superar los 100 caracteres"
        })

});

export const validarEmpleado = (data: unknown) => {

    return empleadoSchema.parse(data);

};