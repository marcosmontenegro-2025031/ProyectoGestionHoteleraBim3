import { z } from "zod";

export const huespedSchema = z.object({

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

    dpi: z
        .string({
            error: "El DPI es obligatorio"
        })
        .trim()
        .min(8, {
            error: "El DPI debe tener al menos 8 caracteres"
        })
        .max(20, {
            error: "El DPI no puede superar los 20 caracteres"
        }),

    telefono: z
        .string({
            error: "El teléfono debe ser texto"
        })
        .trim()
        .max(20, {
            error: "El teléfono no puede superar los 20 caracteres"
        }),

    correo: z
        .string({
            error: "El correo debe ser texto"
        })
        .trim()
        .email({
            error: "El correo electrónico no es válido"
        })

});

export const validarHuesped = (data: unknown) => {

    return huespedSchema.parse(data);

};