const URL = "http://localhost:3000/reservas";

/**
 * Obtener todas las reservas
 */
export async function obtenerReservas(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const reservas = await respuesta.json();
        console.log("\n===== LISTA DE RESERVAS =====");
        console.table(reservas);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener reserva por ID
 */
export async function obtenerReservaPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const reserva = await respuesta.json();
        console.log(reserva);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar reserva
 */
export async function guardarReserva(reserva: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar reserva
 */
export async function actualizarReserva(id: number, reserva: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar reserva
 */
export async function eliminarReserva(id: number): Promise<void> {
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