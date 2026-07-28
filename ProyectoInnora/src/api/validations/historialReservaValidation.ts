import { z } from "zod";

export const historialReservaSchema = z.object({

    estado_anterior: z
        .string({
            error: "El estado anterior es obligatorio"
        })
        .trim()
        .min(3, {
            error: "El estado anterior debe tener al menos 3 caracteres"
        })
        .max(50, {
            error: "El estado anterior no puede superar los 50 caracteres"
        }),

    estado_nuevo: z
        .string({
            error: "El estado nuevo es obligatorio"
        })
        .trim()
        .min(3, {
            error: "El estado nuevo debe tener al menos 3 caracteres"
        })
        .max(50, {
            error: "El estado nuevo no puede superar los 50 caracteres"
        }),

    fecha: z
        .string({
            error: "La fecha es obligatoria"
        })
        .datetime({
            error: "La fecha debe tener formato datetime válido"
        }),

    id_reserva: z
        .number({
            error: "El ID de la reserva es obligatorio"
        })
        .int({
            error: "El ID de la reserva debe ser entero"
        })
        .positive({
            error: "El ID de la reserva debe ser mayor que 0"
        })

});

export const validarHistorialReserva = (data: unknown) => {

    return historialReservaSchema.parse(data);

};