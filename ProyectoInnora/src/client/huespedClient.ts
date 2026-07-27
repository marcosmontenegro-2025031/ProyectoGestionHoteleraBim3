const URL = "http://localhost:3000/huespedes";

/**
 * Obtener todos los huéspedes
 */
export async function obtenerHuespedes(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const huespedes = await respuesta.json();
        console.log("\n===== LISTA DE HUÉSPEDES =====");
        console.table(huespedes);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener huésped por ID
 */
export async function obtenerHuespedPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const huesped = await respuesta.json();
        console.log(huesped);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar huésped
 */
export async function guardarHuesped(huesped: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(huesped)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar huésped
 */
export async function actualizarHuesped(id: number, huesped: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(huesped)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar huésped
 */
export async function eliminarHuesped(id: number): Promise<void> {
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