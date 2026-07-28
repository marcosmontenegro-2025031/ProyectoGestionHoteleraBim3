export const validarId = (
    id:any
):number=>{


    const numero = Number(id);


    if(
        !id ||
        isNaN(numero) ||
        numero <=0 ||
        !Number.isInteger(numero)
    ){

        throw new Error(
            "ID inválido"
        );

    }


    return numero;

};