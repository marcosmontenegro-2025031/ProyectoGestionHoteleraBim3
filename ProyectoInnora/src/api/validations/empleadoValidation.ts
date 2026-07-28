import { z } from "zod";


export const empleadoSchema = z.object({

    nombre: z
        .string({
            error:"El nombre es obligatorio"
        })
        .min(3)
        .max(100),


    apellido: z
        .string({
            error:"El apellido es obligatorio"
        })
        .min(3)
        .max(100),


    cargo: z
        .string({
            error:"El cargo es obligatorio"
        })
        .min(3)
        .max(100)

});


export const validarEmpleado = (data:any)=>{

    return empleadoSchema.parse(data);

};