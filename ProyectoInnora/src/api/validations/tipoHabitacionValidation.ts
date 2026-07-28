import {z} from "zod";


export const tipoHabitacionSchema=z.object({

    nombre:z
        .string({
            error:"El nombre es obligatorio"
        })
        .min(3)
        .max(100),


    descripcion:z
        .string()
        .max(255)
        .optional()

});


export const validarTipoHabitacion=(data:any)=>{

    return tipoHabitacionSchema.parse(data);

};