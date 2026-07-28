import {z} from "zod";


export const servicioSchema=z.object({

    nombre:z
        .string()
        .min(3)
        .max(100),


    precio:z
        .number()
        .positive()

});


export const validarServicio=(data:any)=>{

return servicioSchema.parse(data);

};