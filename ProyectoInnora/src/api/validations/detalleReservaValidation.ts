import {z} from "zod";


export const detalleReservaSchema=z.object({

    id_reserva:z
        .number()
        .positive()
        .int(),


    id_habitacion:z
        .number()
        .positive()
        .int()

});


export const validarDetalleReserva=(data:any)=>{

return detalleReservaSchema.parse(data);

};