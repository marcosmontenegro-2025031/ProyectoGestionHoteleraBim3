import { z } from "zod";

export const facturaSchema = z.object({

    numero_factura: z
        .string({
            error: "El número de factura es obligatorio"
        })
        .trim()
        .min(1, {
            error: "El número de factura es obligatorio"
        })
        .max(50, {
            error: "El número de factura no puede superar los 50 caracteres"
        }),

    total: z
        .number({
            error: "El total es obligatorio"
        })
        .positive({
            error: "El total debe ser mayor que 0"
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
        }),

    id_metodo_pago: z
        .number({
            error: "El ID del método de pago es obligatorio"
        })
        .int({
            error: "El ID del método de pago debe ser entero"
        })
        .positive({
            error: "El ID del método de pago debe ser mayor que 0"
        })

});

export const validarFactura = (data: unknown) => {

    return facturaSchema.parse(data);

};