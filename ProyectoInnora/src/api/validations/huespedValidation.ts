import { z } from "zod";


export const huespedSchema = z.object({

    nombre:z
        .string({
            error:"El nombre es obligatorio"
        })
        .min(3)
        .max(100),


    apellido:z
        .string({
            error:"El apellido es obligatorio"
        })
        .min(3)
        .max(100),


    dpi:z
        .string({
            error:"El DPI es obligatorio"
        })
        .min(8)
        .max(20),


    telefono:z
        .string()
        .max(20)
        .optional(),


    correo:z
        .string()
        .email("Correo inválido")
        .optional()

});


export const validarHuesped=(data:any)=>{

    return huespedSchema.parse(data);

};