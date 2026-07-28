import {z} from "zod";


export const habitacionSchema=z.object({

    numero:z
        .string({
            error:"El número es obligatorio"
        })
        .max(20),


    estado:z
        .enum([
            "DISPONIBLE",
            "OCUPADA",
            "EN MANTENIMIENTO"
        ]),


    precio:z
        .number({
            error:"El precio es obligatorio"
        })
        .positive(),


    id_tipo_habitacion:z
        .number({
            error:"El tipo de habitación es obligatorio"
        })
        .positive()
        .int()

});


export const validarHabitacion=(data:any)=>{

    return habitacionSchema.parse(data);

};