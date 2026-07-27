const URL = "http://localhost:3000/consumos-servicio";

/**
 * Obtener todos los consumos de servicio
 */
export async function obtenerConsumosServicio(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const consumosServicio = await respuesta.json();
        console.log("\n===== LISTA DE CONSUMOS DE SERVICIO =====");
        console.table(consumosServicio);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener consumo de servicio por ID
 */
export async function obtenerConsumoServicioPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const consumoServicio = await respuesta.json();
        console.log(consumoServicio);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar consumo de servicio
 */
export async function guardarConsumoServicio(consumoServicio: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(consumoServicio)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar consumo de servicio
 */
export async function actualizarConsumoServicio(id: number, consumoServicio: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(consumoServicio)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar consumo de servicio
 */
export async function eliminarConsumoServicio(id: number): Promise<void> {
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