const URL = "http://localhost:3000/historial-reservas";

/**
 * Obtener todos los historiales de reserva
 */
export async function obtenerHistorialesReserva(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const historialesReserva = await respuesta.json();
        console.log("\n===== LISTA DE HISTORIALES DE RESERVA =====");
        console.table(historialesReserva);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener historial de reserva por ID
 */
export async function obtenerHistorialReservaPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const historialReserva = await respuesta.json();
        console.log(historialReserva);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar historial de reserva
 */
export async function guardarHistorialReserva(historialReserva: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(historialReserva)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar historial de reserva
 */
export async function actualizarHistorialReserva(id: number, historialReserva: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(historialReserva)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar historial de reserva
 */
export async function eliminarHistorialReserva(id: number): Promise<void> {
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