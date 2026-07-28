import {z} from "zod";


export const consumoServicioSchema=z.object({

cantidad:z
.number()
.positive()
.int(),


id_reserva:z
.number()
.positive()
.int(),


id_servicio:z
.number()
.positive()
.int()

});


export const validarConsumoServicio=(data:any)=>{

return consumoServicioSchema.parse(data);

};