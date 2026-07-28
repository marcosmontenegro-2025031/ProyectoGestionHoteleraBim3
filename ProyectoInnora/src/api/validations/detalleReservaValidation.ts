import { z } from "zod";

export const detalleReservaSchema = z.object({

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

    id_habitacion: z
        .number({
            error: "El ID de la habitación es obligatorio"
        })
        .int({
            error: "El ID de la habitación debe ser entero"
        })
        .positive({
            error: "El ID de la habitación debe ser mayor que 0"
        })

});

export const validarDetalleReserva = (data: unknown) => {

    return detalleReservaSchema.parse(data);

};