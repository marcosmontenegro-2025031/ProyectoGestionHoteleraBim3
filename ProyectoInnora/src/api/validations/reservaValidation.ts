import { z } from "zod";

export const reservaSchema = z
    .object({

        fecha_entrada: z
            .string({
                error: "La fecha de entrada es obligatoria"
            })
            .date({
                error: "La fecha de entrada debe tener formato YYYY-MM-DD"
            }),

        fecha_salida: z
            .string({
                error: "La fecha de salida es obligatoria"
            })
            .date({
                error: "La fecha de salida debe tener formato YYYY-MM-DD"
            }),

        estado: z
            .enum(
                [
                    "PENDIENTE",
                    "CONFIRMADA",
                    "CANCELADA",
                    "FINALIZADA"
                ],
                {
                    error: "El estado de la reserva no es válido"
                }
            ),

        id_huesped: z
            .number({
                error: "El ID del huésped es obligatorio"
            })
            .int({
                error: "El ID del huésped debe ser entero"
            })
            .positive({
                error: "El ID del huésped debe ser mayor que 0"
            }),

        id_empleado: z
            .number({
                error: "El ID del empleado es obligatorio"
            })
            .int({
                error: "El ID del empleado debe ser entero"
            })
            .positive({
                error: "El ID del empleado debe ser mayor que 0"
            })

    })
    .refine(
        (data) =>
            new Date(data.fecha_salida) >
            new Date(data.fecha_entrada),
        {
            message:
                "La fecha de salida debe ser mayor que la fecha de entrada",
            path: ["fecha_salida"]
        }
    );

export const validarReserva = (data: unknown) => {

    return reservaSchema.parse(data);

};