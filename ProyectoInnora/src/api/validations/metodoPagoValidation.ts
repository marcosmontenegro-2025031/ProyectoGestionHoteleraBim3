import { z } from "zod";

export const metodoPagoSchema = z.object({

    tipo: z
        .enum(
            [
                "EFECTIVO",
                "TARJETA",
                "TRANSFERENCIA"
            ],
            {
                error: "El tipo de pago no es válido"
            }
        )

});

export const validarMetodoPago = (data: unknown) => {

    return metodoPagoSchema.parse(data);

};