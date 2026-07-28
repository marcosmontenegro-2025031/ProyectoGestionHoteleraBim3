import {AppError} from "../utils/errores";


export const errorHandler = (
    error:any
)=>{


    if(error instanceof AppError){

        return {
            status:error.statusCode,
            body:{
                success:false,
                message:error.message
            }
        };

    }


    return {
        status:500,
        body:{
            success:false,
            message:"Error interno del servidor"
        }
    };


};