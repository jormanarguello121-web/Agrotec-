// ===== CLASE CLIENTEMANAGER - Gestión centralizada del módulo cliente =====
class ClienteManager {
    constructor() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        this.entregas = JSON.parse(localStorage.getItem('entregas')) || [];
        this.init();
    }

    init() {
        this.verificarAutenticacion();
        this.actualizarContadorCarrito();
    }

    // ===== VERIFICACIÓN DE AUTENTICACIÓN =====
    verificarAutenticacion() {
        if (!this.usuario || this.usuario.rol !== 'cliente') {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    // ===== GESTIÓN DE PRODUCTOS =====
    async cargarProductosDisponibles() {
        try {
            const response = await fetch('/productos');
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            const data = await response.json();
            // Ajustar según la estructura de tu API
            return data.productos || data || [];
        } catch (error) {
            console.error('Error cargando productos:', error);
            return this.obtenerProductosEjemplo();
        }
    }

    obtenerProductosEjemplo() {
        return [
            {
                id: 1,
                nombre: "Tomates Orgánicos",
                categoria: "verduras",
                precio: 2.5,
                cantidad: 50,
                descripcion: "Tomates frescos cultivados orgánicamente",
                agricultor: "Juan Agricultor",
                imagen: "",
                estado: "activo"
            },
            {
                id: 3,
                nombre: "Zanahorias Frescas",
                categoria: "verduras",
                precio: 1.8,
                cantidad: 30,
                descripcion: "Zanahorias dulces y crujientes",
                agricultor: "María Productora",
                imagen: "",
                estado: "activo"
            },
            {
                id: 2,
                nombre: "Aguacates Hass",
                categoria: "frutas",
                precio: 4.0,
                cantidad: 0,
                descripcion: "Aguacates de primera calidad",
                agricultor: "Pedro Agricultor",
                imagen: "",
                estado: "agotado"
            }
        ];
    }

    // ===== GESTIÓN DEL CARRITO =====
    agregarAlCarrito(producto) {
        if (producto.cantidad === 0) {
            this.mostrarMensaje('Producto agotado', 'error');
            return false;
        }

        const itemExistente = this.carrito.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                agricultor: producto.agricultor,
                imagen: producto.imagen
            });
        }
        
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarMensaje(`✅ ${producto.nombre} agregado al carrito`, 'success');
        return true;
    }

    eliminarDelCarrito(productoId) {
        this.carrito = this.carrito.filter(item => item.id !== productoId);
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarMensaje('Producto eliminado del carrito', 'info');
    }

    cambiarCantidadCarrito(productoId, cambio) {
        const item = this.carrito.find(item => item.id === productoId);
        if (item) {
            item.cantidad += cambio;
            
            if (item.cantidad <= 0) {
                this.eliminarDelCarrito(productoId);
            } else {
                this.guardarCarrito();
                this.actualizarContadorCarrito();
            }
        }
    }

    vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarMensaje('Carrito vaciado', 'info');
    }

    obtenerResumenCarrito() {
        const subtotal = this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
        const envio = 2.00;
        const total = subtotal + envio;
        const totalItems = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);

        return {
            subtotal,
            envio,
            total,
            totalItems,
            items: this.carrito
        };
    }

    // ===== GESTIÓN DE PEDIDOS =====
    async procesarPedido(direccionEntrega, metodoPago) {
        if (this.carrito.length === 0) {
            this.mostrarMensaje('El carrito está vacío', 'error');
            return null;
        }

        try {
            const resumen = this.obtenerResumenCarrito();
            const nuevoPedido = {
                id: this.generarIdUnico(),
                fecha: new Date().toISOString(),
                items: [...this.carrito],
                subtotal: resumen.subtotal,
                envio: resumen.envio,
                total: resumen.total,
                estado: 'confirmado',
                direccionEntrega: direccionEntrega || 'Calle Principal #123, Ciudad',
                metodoPago: metodoPago || 'Tarjeta Crédito',
                tracking: `TRK${Date.now()}`
            };

            // Agregar a pedidos
            this.pedidos.push(nuevoPedido);
            this.guardarPedidos();

            // Crear entrega asociada
            this.crearEntrega(nuevoPedido);

            // Limpiar carrito
            this.vaciarCarrito();

            this.mostrarMensaje('✅ Pedido realizado exitosamente', 'success');
            return nuevoPedido;

        } catch (error) {
            console.error('Error procesando pedido:', error);
            this.mostrarMensaje('Error al procesar el pedido', 'error');
            return null;
        }
    }

    crearEntrega(pedido) {
        const entrega = {
            id: pedido.id,
            pedidoId: pedido.id,
            fechaEntrega: new Date(new Date(pedido.fecha).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 días
            estado: 'programada',
            productos: pedido.items,
            direccion: pedido.direccionEntrega,
            repartidor: this.obtenerRepartidorAleatorio(),
            telefono: '+57 300 111 2233',
            horario: this.obtenerHorarioAleatorio(),
            tracking: pedido.tracking
        };

        this.entregas.push(entrega);
        this.guardarEntregas();
        return entrega;
    }

    obtenerPedidos(filtros = {}) {
        let pedidosFiltrados = [...this.pedidos];

        // Filtro por estado
        if (filtros.estado && filtros.estado !== 'todos') {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === filtros.estado);
        }

        // Filtro por fecha
        if (filtros.fecha && filtros.fecha !== 'todos') {
            pedidosFiltrados = this.filtrarPorFecha(pedidosFiltrados, filtros.fecha);
        }

        // Filtro por búsqueda
        if (filtros.busqueda) {
            const termino = filtros.busqueda.toLowerCase();
            pedidosFiltrados = pedidosFiltrados.filter(pedido => 
                `pedido #${pedido.id}`.includes(termino) ||
                pedido.items.some(item => item.nombre.toLowerCase().includes(termino))
            );
        }

        // Ordenar por fecha (más recientes primero)
        return pedidosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    filtrarPorFecha(pedidos, filtroFecha) {
        const hoy = new Date();
        
        switch(filtroFecha) {
            case 'hoy':
                return pedidos.filter(p => 
                    new Date(p.fecha).toDateString() === hoy.toDateString()
                );
            case 'semana':
                const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
                return pedidos.filter(p => 
                    new Date(p.fecha) >= inicioSemana
                );
            case 'mes':
                return pedidos.filter(p => 
                    new Date(p.fecha).getMonth() === hoy.getMonth() && 
                    new Date(p.fecha).getFullYear() === hoy.getFullYear()
                );
            case '3meses':
                const tresMesesAtras = new Date(hoy.setMonth(hoy.getMonth() - 3));
                return pedidos.filter(p => 
                    new Date(p.fecha) >= tresMesesAtras
                );
            default:
                return pedidos;
        }
    }

    cancelarPedido(pedidoId) {
        const pedido = this.pedidos.find(p => p.id === pedidoId);
        if (pedido && ['confirmado', 'preparacion'].includes(pedido.estado)) {
            pedido.estado = 'cancelado';
            
            // También cancelar la entrega asociada
            const entrega = this.entregas.find(e => e.pedidoId === pedidoId);
            if (entrega) {
                entrega.estado = 'cancelada';
            }
            
            this.guardarPedidos();
            this.guardarEntregas();
            this.mostrarMensaje('Pedido cancelado exitosamente', 'info');
            return true;
        }
        return false;
    }

    obtenerEstadisticasPedidos() {
        const totalPedidos = this.pedidos.length;
        const pedidosPendientes = this.pedidos.filter(p => 
            ['confirmado', 'preparacion', 'camino'].includes(p.estado)
        ).length;

        return {
            totalPedidos,
            pedidosPendientes
        };
    }

    // ===== GESTIÓN DE ENTREGAS =====
    obtenerEntregas(filtros = {}) {
        let entregasFiltradas = [...this.entregas];

        if (filtros.estado && filtros.estado !== 'todas') {
            entregasFiltradas = entregasFiltradas.filter(e => e.estado === filtros.estado);
        }

        return entregasFiltradas.sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));
    }

    obtenerEntregasDelDia(fecha = new Date()) {
        return this.entregas.filter(entrega => 
            new Date(entrega.fechaEntrega).toDateString() === fecha.toDateString()
        );
    }

    obtenerResumenEntregas() {
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        const entregasHoy = this.obtenerEntregasDelDia(hoy);
        const entregasSemana = this.entregas.filter(e => {
            const fechaEntrega = new Date(e.fechaEntrega);
            return fechaEntrega >= inicioSemana && fechaEntrega <= finSemana;
        });
        const entregasMes = this.entregas.filter(e => {
            const fechaEntrega = new Date(e.fechaEntrega);
            return fechaEntrega >= inicioMes && fechaEntrega <= finMes;
        });

        return {
            hoy: entregasHoy.length,
            semana: entregasSemana.length,
            mes: entregasMes.length
        };
    }

    // ===== UTILIDADES =====
    generarIdUnico() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    obtenerRepartidorAleatorio() {
        const repartidores = ['Juan Repartidor', 'María Repartidora', 'Carlos Repartidor', 'Ana Repartidora'];
        return repartidores[Math.floor(Math.random() * repartidores.length)];
    }

    obtenerHorarioAleatorio() {
        const horarios = ['9:00 - 13:00', '14:00 - 18:00', '10:00 - 12:00', '15:00 - 17:00'];
        return horarios[Math.floor(Math.random() * horarios.length)];
    }

    formatearFecha(fechaISO, formato = 'corta') {
        const fecha = new Date(fechaISO);
        
        if (formato === 'corta') {
            return fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } else {
            return fecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    obtenerIconoEstado(estado) {
        const iconos = {
            'confirmado': '✅',
            'preparacion': '👨‍🍳',
            'camino': '🚚',
            'entregado': '📦',
            'entregada': '📦',
            'cancelado': '❌',
            'cancelada': '❌',
            'programada': '📅'
        };
        return iconos[estado] || '📝';
    }

    obtenerTextoEstado(estado) {
        const textos = {
            'confirmado': 'Confirmado',
            'preparacion': 'En preparación',
            'camino': 'En camino',
            'entregado': 'Entregado',
            'entregada': 'Entregada',
            'cancelado': 'Cancelado',
            'cancelada': 'Cancelada',
            'programada': 'Programada'
        };
        return textos[estado] || 'Pendiente';
    }

    // ===== PERSISTENCIA =====
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    guardarPedidos() {
        localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
    }

    guardarEntregas() {
        localStorage.setItem('entregas', JSON.stringify(this.entregas));
    }

    // ===== UI Y MENSAJES =====
    actualizarContadorCarrito() {
        const totalItems = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    mostrarMensaje(mensaje, tipo = 'success') {
        // Eliminar mensajes existentes
        const mensajesExistentes = document.querySelectorAll('.mensaje-flotante');
        mensajesExistentes.forEach(msg => msg.remove());

        // Crear nuevo mensaje
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `mensaje-flotante ${tipo}`;
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        
        // Colores según tipo
        const colores = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        
        mensajeDiv.style.background = colores[tipo] || colores.success;
        if (tipo === 'warning') {
            mensajeDiv.style.color = '#212529';
        }

        document.body.appendChild(mensajeDiv);

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            if (mensajeDiv.parentNode) {
                mensajeDiv.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => mensajeDiv.remove(), 300);
            }
        }, 3000);
    }

    // ===== CERRAR SESIÓN =====
    cerrarSesion() {
        localStorage.removeItem('usuario');
        localStorage.removeItem('carrito');
        window.location.href = '/login.html';
    }
}

// ===== INSTANCIA GLOBAL =====
const clienteManager = new ClienteManager();

// ===== FUNCIONES GLOBALES PARA HTML =====

// Gestión de Carrito
function agregarAlCarrito(productoId) {
    // Esta función sería llamada desde los botones en marketplace.html
    // Necesitarías tener los productos disponibles en el scope global o obtenerlos
    console.log('Agregar al carrito:', productoId);
    // clienteManager.agregarAlCarrito(producto);
}

function eliminarDelCarrito(productoId) {
    clienteManager.eliminarDelCarrito(productoId);
}

function cambiarCantidadCarrito(productoId, cambio) {
    clienteManager.cambiarCantidadCarrito(productoId, cambio);
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        clienteManager.vaciarCarrito();
    }
}

// Gestión de Pedidos
function cancelarPedido(pedidoId) {
    if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
        clienteManager.cancelarPedido(pedidoId);
    }
}

function rastrearPedido(tracking) {
    clienteManager.mostrarMensaje(`🚚 Rastreando pedido: ${tracking}`, 'info');
}

// Utilidades
function formatearFecha(fechaISO) {
    return clienteManager.formatearFecha(fechaISO);
}

function formatearFechaCompleta(fechaISO) {
    return clienteManager.formatearFecha(fechaISO, 'completa');
}

function obtenerIconoEstado(estado) {
    return clienteManager.obtenerIconoEstado(estado);
}

function obtenerTextoEstado(estado) {
    return clienteManager.obtenerTextoEstado(estado);
}

// Navegación
function irAlMarketplace() {
    window.location.href = 'mercado.html';
}

function irAlCarrito() {
    window.location.href = 'carrito.html';
}

function irAMisPedidos() {
    window.location.href = 'pedidos.html';
}

function irACalendario() {
    window.location.href = 'calendario.html';
}

function cerrarSesion() {
    clienteManager.cerrarSesion();
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar contador de carrito en todas las páginas
    clienteManager.actualizarContadorCarrito();
    
    // Verificar autenticación en todas las páginas
    if (!clienteManager.verificarAutenticacion()) {
        return;
    }
    
    console.log('ClienteManager inicializado correctamente');
});
