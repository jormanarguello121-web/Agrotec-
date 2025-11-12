// Funcionalidades específicas para el agricultor

class AgricultorManager {
    constructor() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.apiUrl = ''; // Usaremos rutas relativas
    }

    // Cargar productos del agricultor
    async cargarProductos() {
        try {
            const response = await fetch('/api/productos');
            const data = await response.json();
            return data.productos || [];
        } catch (error) {
            console.error('Error cargando productos:', error);
            return [];
        }
    }

    // Agregar nuevo producto
    async agregarProducto(productoData) {
        try {
            const response = await fetch('/api/productos/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...productoData,
                    agricultorId: this.usuario.id
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error agregando producto:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Editar producto
    async editarProducto(productoId, productoData) {
        try {
            const response = await fetch(`/api/productos/editar/${productoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error editando producto:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Eliminar producto
    async eliminarProducto(productoId) {
        try {
            const response = await fetch(`/api/productos/eliminar/${productoId}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error eliminando producto:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener estadísticas
    async obtenerEstadisticas() {
        try {
            const response = await fetch(`/api/estadisticas/agricultor/${this.usuario.id}`);
            return await response.json();
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            return {};
        }
    }
}

// Funciones globales para HTML
function mostrarMensaje(mensaje, tipo = 'success') {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = tipo === 'success' ? 'success' : 'error';
    mensajeDiv.textContent = mensaje;
    
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

// Inicializar manager global
const agricultorManager = new AgricultorManager();
