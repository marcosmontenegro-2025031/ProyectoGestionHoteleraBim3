import {z} from "zod";


export const usuarioSchema=z.object({

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


    correo:z
        .string({
            error:"El correo es obligatorio"
        })
        .email(),


    contrasena:z
        .string({
            error:"La contraseña es obligatoria"
        })
        .min(6)
        .max(255),


    rol:z
        .string()
        .max(50)
        .optional(),


    empleado_id_empleado:z
        .number()
        .int()
        .positive()
        .optional(),


    huesped_id_huesped:z
        .number()
        .int()
        .positive()
        .optional()

});


export const validarUsuario=(data:any)=>{

    return usuarioSchema.parse(data);

};