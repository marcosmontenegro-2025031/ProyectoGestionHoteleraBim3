const URL = "http://localhost:3000/metodos-pago";

/**
 * Obtener todos los métodos de pago
 */
export async function obtenerMetodosPago(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const metodosPago = await respuesta.json();
        console.log("\n===== LISTA DE MÉTODOS DE PAGO =====");
        console.table(metodosPago);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener método de pago por ID
 */
export async function obtenerMetodoPagoPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const metodoPago = await respuesta.json();
        console.log(metodoPago);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar método de pago
 */
export async function guardarMetodoPago(metodoPago: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(metodoPago)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar método de pago
 */
export async function actualizarMetodoPago(id: number, metodoPago: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(metodoPago)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar método de pago
 */
export async function eliminarMetodoPago(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "DELETE"
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}