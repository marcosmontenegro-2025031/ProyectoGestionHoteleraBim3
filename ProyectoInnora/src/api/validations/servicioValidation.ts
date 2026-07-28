import { z } from "zod";

export const servicioSchema = z.object({

    nombre: z
        .string({
            error: "El nombre del servicio es obligatorio"
        })
        .trim()
        .min(3, {
            error: "El nombre debe tener al menos 3 caracteres"
        })
        .max(100, {
            error: "El nombre no puede superar los 100 caracteres"
        }),

    precio: z
        .number({
            error: "El precio es obligatorio"
        })
        .positive({
            error: "El precio debe ser mayor que 0"
        })

});

export const validarServicio = (data: unknown) => {

    return servicioSchema.parse(data);

};