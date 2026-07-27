const URL = "http://localhost:3000/detalles-reserva";

/**
 * Obtener todos los detalles de reserva
 */
export async function obtenerDetallesReserva(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const detallesReserva = await respuesta.json();
        console.log("\n===== LISTA DE DETALLES DE RESERVA =====");
        console.table(detallesReserva);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener detalle de reserva por ID
 */
export async function obtenerDetalleReservaPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const detalleReserva = await respuesta.json();
        console.log(detalleReserva);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar detalle de reserva
 */
export async function guardarDetalleReserva(detalleReserva: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(detalleReserva)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar detalle de reserva
 */
export async function actualizarDetalleReserva(id: number, detalleReserva: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(detalleReserva)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar detalle de reserva
 */
export async function eliminarDetalleReserva(id: number): Promise<void> {
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