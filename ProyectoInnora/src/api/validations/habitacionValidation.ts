import { z } from "zod";

export const habitacionSchema = z.object({

    numero: z
        .string({
            error: "El número de habitación es obligatorio"
        })
        .trim()
        .min(1, {
            error: "El número de habitación es obligatorio"
        })
        .max(20, {
            error: "El número de habitación no puede superar los 20 caracteres"
        }),

    estado: z
        .enum(
            [
                "DISPONIBLE",
                "OCUPADA",
                "EN MANTENIMIENTO"
            ],
            {
                error: "El estado de la habitación no es válido"
            }
        ),

    precio: z
        .number({
            error: "El precio es obligatorio"
        })
        .positive({
            error: "El precio debe ser mayor que 0"
        }),

    id_tipo_habitacion: z
        .number({
            error: "El ID del tipo de habitación es obligatorio"
        })
        .int({
            error: "El ID del tipo de habitación debe ser entero"
        })
        .positive({
            error: "El ID del tipo de habitación debe ser mayor que 0"
        })

});

export const validarHabitacion = (data: unknown) => {

    return habitacionSchema.parse(data);

};