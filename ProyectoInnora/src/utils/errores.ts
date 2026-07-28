import { ZodError } from "zod";

export const formatearErrores = (error: unknown) => {

    if (error instanceof ZodError) {

        return error.issues.map((issue) => ({
            campo: issue.path.join("."),
            mensaje: issue.message
        }));

    }

    return [
        {
            campo: "general",
            mensaje: "Error de validación"
        }
    ];
};