import {z} from "zod";


export const metodoPagoSchema=z.object({

tipo:z.enum([
"EFECTIVO",
"TARJETA",
"TRANSFERENCIA"
])

});


export const validarMetodoPago=(data:any)=>{

return metodoPagoSchema.parse(data);

};