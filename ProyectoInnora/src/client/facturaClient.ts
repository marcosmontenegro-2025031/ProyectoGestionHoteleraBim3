const URL = "http://localhost:3000/facturas";

/**
 * Obtener todas las facturas
 */
export async function obtenerFacturas(): Promise<void> {
    try {
        const respuesta = await fetch(URL);
        const facturas = await respuesta.json();
        console.log("\n===== LISTA DE FACTURAS =====");
        console.table(facturas);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtener factura por ID
 */
export async function obtenerFacturaPorId(id: number): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const factura = await respuesta.json();
        console.log(factura);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Guardar factura
 */
export async function guardarFactura(factura: any): Promise<void> {
    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(factura)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Actualizar factura
 */
export async function actualizarFactura(id: number, factura: any): Promise<void> {
    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(factura)
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Eliminar factura
 */
export async function eliminarFactura(id: number): Promise<void> {
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