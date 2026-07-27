const URL = "http://localhost:3000/habitaciones";

/**
 * Obtener todas las habitaciones
 */
export async function obtenerHabitaciones(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const habitaciones = await respuesta.json();
        console.log("\n===== LISTA DE HABITACIONES =====");
        console.table(habitaciones);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener habitación por ID
 */
export async function obtenerHabitacionPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const habitacion = await respuesta.json();
        console.log(habitacion);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar habitación
 */
export async function guardarHabitacion(habitacion: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(habitacion)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar habitación
 */
export async function actualizarHabitacion(id: number, habitacion: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(habitacion)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar habitación
 */
export async function eliminarHabitacion(id: number): Promise<void> {
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