import { z } from "zod";

export const consumoServicioSchema = z.object({

    cantidad: z
        .number({
            error: "La cantidad es obligatoria"
        })
        .int({
            error: "La cantidad debe ser un número entero"
        })
        .positive({
            error: "La cantidad debe ser mayor que 0"
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
        }),

    id_servicio: z
        .number({
            error: "El ID del servicio es obligatorio"
        })
        .int({
            error: "El ID del servicio debe ser entero"
        })
        .positive({
            error: "El ID del servicio debe ser mayor que 0"
        })

});

export const validarConsumoServicio = (data: unknown) => {

    return consumoServicioSchema.parse(data);

};