const URL = "http://localhost:3000/servicios";

/**
 * Obtener todos los servicios
 */
export async function obtenerServicios(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const servicios = await respuesta.json();
        console.log("\n===== LISTA DE SERVICIOS =====");
        console.table(servicios);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener servicio por ID
 */
export async function obtenerServicioPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const servicio = await respuesta.json();
        console.log(servicio);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar servicio
 */
export async function guardarServicio(servicio: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(servicio)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar servicio
 */
export async function actualizarServicio(id: number, servicio: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(servicio)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar servicio
 */
export async function eliminarServicio(id: number): Promise<void> {
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