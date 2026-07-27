const URL = "http://localhost:3000/tipos-habitacion";

/**
 * Obtener todos los tipos de habitación
 */
export async function obtenerTiposHabitacion(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const tiposHabitacion = await respuesta.json();
        console.log("\n===== LISTA DE TIPOS DE HABITACIÓN =====");
        console.table(tiposHabitacion);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener tipo de habitación por ID
 */
export async function obtenerTipoHabitacionPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const tipoHabitacion = await respuesta.json();
        console.log(tipoHabitacion);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar tipo de habitación
 */
export async function guardarTipoHabitacion(tipoHabitacion: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tipoHabitacion)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar tipo de habitación
 */
export async function actualizarTipoHabitacion(id: number, tipoHabitacion: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tipoHabitacion)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar tipo de habitación
 */
export async function eliminarTipoHabitacion(id: number): Promise<void> {
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