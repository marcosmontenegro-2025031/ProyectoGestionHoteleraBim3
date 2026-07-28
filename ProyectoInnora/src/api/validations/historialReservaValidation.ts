import { z } from "zod";


export const historialReservaSchema = z.object({

    estado_anterior: z
        .string({
            error:"El estado anterior es obligatorio"
        })
        .min(
            3,
            "El estado anterior es inválido"
        )
        .max(
            50,
            "El estado anterior no puede superar 50 caracteres"
        ),


    estado_nuevo: z
        .string({
            error:"El estado nuevo es obligatorio"
        })
        .min(
            3,
            "El estado nuevo es inválido"
        )
        .max(
            50,
            "El estado nuevo no puede superar 50 caracteres"
        ),


    fecha: z
        .string({
            error:"La fecha es obligatoria"
        })
        .datetime(
            "La fecha debe tener formato datetime válido"
        ),


    id_reserva: z
        .number({
            error:"La reserva es obligatoria"
        })
        .positive(
            "El ID de reserva debe ser válido"
        )
        .int(
            "El ID debe ser entero"
        )

});



export const validarHistorialReserva = (data:any)=>{

    return historialReservaSchema.parse(data);

};