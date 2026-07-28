import { z } from "zod";

export const tipoHabitacionSchema = z.object({

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

    descripcion: z
        .string({
            error: "La descripción debe ser texto"
        })
        .trim()
        .max(255, {
            error: "La descripción no puede superar los 255 caracteres"
        })

});

export const validarTipoHabitacion = (data: unknown) => {

    return tipoHabitacionSchema.parse(data);

};