const URL = "http://localhost:3000/empleados";

/**
 * Obtener todos los empleados
 */
export async function obtenerEmpleados(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const empleados = await respuesta.json();
        console.log("\n===== LISTA DE EMPLEADOS =====");
        console.table(empleados);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener empleado por ID
 */
export async function obtenerEmpleadoPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const empleado = await respuesta.json();
        console.log(empleado);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar empleado
 */
export async function guardarEmpleado(empleado: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(empleado)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar empleado
 */
export async function actualizarEmpleado(id: number, empleado: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(empleado)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar empleado
 */
export async function eliminarEmpleado(id: number): Promise<void> {
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
