import {z} from "zod";


export const facturaSchema=z.object({

numero_factura:z
.string()
.max(50),


total:z
.number()
.positive(),


fecha:z
.string()
.datetime(),


id_reserva:z
.number()
.positive()
.int(),


id_metodo_pago:z
.number()
.positive()
.int()

});


export const validarFactura=(data:any)=>{

return facturaSchema.parse(data);

};