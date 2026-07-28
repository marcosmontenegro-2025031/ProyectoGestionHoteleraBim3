import {z} from "zod";


export const reservaSchema=z.object({

    fecha_entrada:z
        .string()
        .date(),


    fecha_salida:z
        .string()
        .date(),


    estado:z
        .enum([
            "PENDIENTE",
            "CONFIRMADA",
            "CANCELADA",
            "FINALIZADA"
        ]),


    id_huesped:z
        .number()
        .positive()
        .int(),


    id_empleado:z
        .number()
        .positive()
        .int()


})
.refine(
(data)=>
new Date(data.fecha_salida)
>
new Date(data.fecha_entrada),
{
message:"La fecha de salida debe ser mayor que la entrada",
path:["fecha_salida"]
}
);



export const validarReserva=(data:any)=>{

return reservaSchema.parse(data);

};