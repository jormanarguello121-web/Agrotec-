// ===== ADMIN MANAGER - Gestión del módulo administrador =====
class AdminManager {
    constructor() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.usuarios = [];
        this.usuarioEditando = null;
        this.init();
    }

    init() {
        if (!this.verificarAutenticacion()) {
            return;
        }
        this.configurarEventos();
        this.cargarUsuarios();
    }

    verificarAutenticacion() {
        if (!this.usuario || this.usuario.rol !== 'administrador') {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    configurarEventos() {
        // Configurar formulario de usuario si existe
        const formUsuario = document.getElementById('formUsuario');
        if (formUsuario) {
            formUsuario.addEventListener('submit', (e) => {
                e.preventDefault();
                this.guardarUsuario();
            });
        }

        // Configurar eventos de filtros si existen
        const buscarUsuario = document.getElementById('buscarUsuario');
        if (buscarUsuario) {
            buscarUsuario.addEventListener('keyup', () => this.filtrarUsuarios());
        }

        const filtroRol = document.getElementById('filtroRol');
        if (filtroRol) {
            filtroRol.addEventListener('change', () => this.filtrarUsuarios());
        }

        const filtroEstado = document.getElementById('filtroEstado');
        if (filtroEstado) {
            filtroEstado.addEventListener('change', () => this.filtrarUsuarios());
        }
    }

    async cargarUsuarios() {
        try {
            const response = await fetch('/usuarios');
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            const data = await response.json();
            this.usuarios = data.usuarios || [];
            this.mostrarUsuarios();
            this.actualizarEstadisticas();
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            // Datos de ejemplo para desarrollo
            this.usuarios = this.obtenerUsuariosEjemplo();
            this.mostrarUsuarios();
            this.actualizarEstadisticas();
        }
    }

    obtenerUsuariosEjemplo() {
        return [
            {
                id: 1,
                nombre: "Juan Agricultor",
                email: "agricultor@ejemplo.com",
                rol: "agricultor",
                fechaRegistro: "2024-01-01T00:00:00.000Z",
                activo: true
            },
            {
                id: 2,
                nombre: "María Cliente",
                email: "cliente@ejemplo.com",
                rol: "cliente",
                fechaRegistro: "2024-01-02T00:00:00.000Z",
                activo: true
            },
            {
                id: 3,
                nombre: "Admin Principal",
                email: "admin@ejemplo.com",
                rol: "administrador",
                fechaRegistro: "2024-01-01T00:00:00.000Z",
                activo: true
            },
            {
                id: 4,
                nombre: "Pedro Productor",
                email: "pedro@ejemplo.com",
                rol: "agricultor",
                fechaRegistro: "2024-01-15T00:00:00.000Z",
                activo: false
            },
            {
                id: 5,
                nombre: "Ana Consumidora",
                email: "ana@ejemplo.com",
                rol: "cliente",
                fechaRegistro: "2024-02-01T00:00:00.000Z",
                activo: true
            }
        ];
    }

    mostrarUsuarios(usuariosFiltrados = null) {
        const lista = document.getElementById('listaUsuarios');
        if (!lista) return;

        const usuariosAMostrar = usuariosFiltrados || this.usuarios;
        
        if (usuariosAMostrar.length === 0) {
            lista.innerHTML = `
                <div class="no-users">
                    <div class="empty-icon">👥</div>
                    <h3>No hay usuarios</h3>
                    <p>No se encontraron usuarios que coincidan con tu búsqueda</p>
                </div>
            `;
            return;
        }
        
        lista.innerHTML = usuariosAMostrar.map(usuario => this.crearCardUsuario(usuario)).join('');
    }

    crearCardUsuario(usuario) {
        return `
            <div class="user-card" data-rol="${usuario.rol}" data-estado="${usuario.activo ? 'activo' : 'inactivo'}">
                <div class="user-header">
                    <div class="user-info">
                        <h4>${usuario.nombre}</h4>
                        <span class="user-email">📧 ${usuario.email}</span>
                    </div>
                    <div class="user-status">
                        <span class="role-badge ${usuario.rol}">
                            ${this.obtenerIconoRol(usuario.rol)} ${this.obtenerTextoRol(usuario.rol)}
                        </span>
                        <span class="status-badge ${usuario.activo ? 'activo' : 'inactivo'}">
                            ${usuario.activo ? '🟢 Activo' : '🔴 Inactivo'}
                        </span>
                    </div>
                </div>
                
                <div class="user-details">
                    <div class="detail">
                        <strong>ID:</strong> ${usuario.id}
                    </div>
                    <div class="detail">
                        <strong>Registro:</strong> ${this.formatearFecha(usuario.fechaRegistro)}
                    </div>
                </div>
                
                <div class="user-actions">
                    <button class="btn btn-small" onclick="adminManager.editarUsuario(${usuario.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-small ${usuario.activo ? 'btn-warning' : 'btn-success'}" 
                            onclick="adminManager.${usuario.activo ? 'desactivarUsuario' : 'activarUsuario'}(${usuario.id})">
                        ${usuario.activo ? '🚫 Desactivar' : '✅ Activar'}
                    </button>
                    ${usuario.rol !== 'administrador' ? `
                        <button class="btn btn-small btn-danger" 
                                onclick="adminManager.eliminarUsuario(${usuario.id})">
                            🗑️ Eliminar
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    obtenerIconoRol(rol) {
        const iconos = {
            'agricultor': '🌱',
            'cliente': '🛒', 
            'administrador': '⚙️'
        };
        return iconos[rol] || '👤';
    }

    obtenerTextoRol(rol) {
        const textos = {
            'agricultor': 'Agricultor',
            'cliente': 'Cliente',
            'administrador': 'Administrador'
        };
        return textos[rol] || 'Usuario';
    }

    formatearFecha(fechaISO) {
        return new Date(fechaISO).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    actualizarEstadisticas() {
        const totalUsuarios = this.usuarios.length;
        const totalAgricultores = this.usuarios.filter(u => u.rol === 'agricultor').length;
        const totalClientes = this.usuarios.filter(u => u.rol === 'cliente').length;
        const totalAdmins = this.usuarios.filter(u => u.rol === 'administrador').length;

        // Actualizar elementos si existen
        if (document.getElementById('totalUsuarios')) {
            document.getElementById('totalUsuarios').textContent = totalUsuarios;
        }
        if (document.getElementById('totalAgricultores')) {
            document.getElementById('totalAgricultores').textContent = totalAgricultores;
        }
        if (document.getElementById('totalClientes')) {
            document.getElementById('totalClientes').textContent = totalClientes;
        }
        if (document.getElementById('totalAdmins')) {
            document.getElementById('totalAdmins').textContent = totalAdmins;
        }
    }

    filtrarUsuarios() {
        const busqueda = document.getElementById('buscarUsuario')?.value.toLowerCase() || '';
        const rol = document.getElementById('filtroRol')?.value || 'todos';
        const estado = document.getElementById('filtroEstado')?.value || 'todos';
        
        let usuariosFiltrados = this.usuarios.filter(usuario => {
            const coincideBusqueda = 
                usuario.nombre.toLowerCase().includes(busqueda) ||
                usuario.email.toLowerCase().includes(busqueda);
            
            const coincideRol = rol === 'todos' || usuario.rol === rol;
            const coincideEstado = estado === 'todos' || 
                (estado === 'activo' && usuario.activo) ||
                (estado === 'inactivo' && !usuario.activo);
            
            return coincideBusqueda && coincideRol && coincideEstado;
        });
        
        this.mostrarUsuarios(usuariosFiltrados);
    }

    mostrarModalNuevoUsuario() {
        this.usuarioEditando = null;
        document.getElementById('modalTitulo').textContent = 'Nuevo Usuario';
        document.getElementById('formUsuario').reset();
        document.getElementById('estadoUsuario').value = 'activo';
        document.getElementById('modalUsuario').style.display = 'block';
    }

    editarUsuario(id) {
        this.usuarioEditando = this.usuarios.find(u => u.id === id);
        if (this.usuarioEditando) {
            document.getElementById('modalTitulo').textContent = 'Editar Usuario';
            document.getElementById('usuarioId').value = this.usuarioEditando.id;
            document.getElementById('nombreUsuario').value = this.usuarioEditando.nombre;
            document.getElementById('emailUsuario').value = this.usuarioEditando.email;
            document.getElementById('passwordUsuario').value = ''; // No mostrar password
            document.getElementById('rolUsuario').value = this.usuarioEditando.rol;
            document.getElementById('estadoUsuario').value = this.usuarioEditando.activo ? 'activo' : 'inactivo';
            
            document.getElementById('modalUsuario').style.display = 'block';
        }
    }

    async guardarUsuario() {
        const formData = {
            nombre: document.getElementById('nombreUsuario').value,
            email: document.getElementById('emailUsuario').value,
            password: document.getElementById('passwordUsuario').value,
            rol: document.getElementById('rolUsuario').value,
            activo: document.getElementById('estadoUsuario').value === 'activo'
        };

        // Validaciones básicas
        if (!formData.nombre || !formData.email || !formData.password || !formData.rol) {
            this.mostrarMensaje('❌ Todos los campos marcados con * son obligatorios', 'error');
            return;
        }

        try {
            if (this.usuarioEditando) {
                // Editar usuario existente
                await this.actualizarUsuario(this.usuarioEditando.id, formData);
            } else {
                // Crear nuevo usuario
                await this.crearUsuario(formData);
            }
            this.cerrarModalUsuario();
        } catch (error) {
            this.mostrarMensaje('❌ Error guardando usuario: ' + error.message, 'error');
        }
    }

    async crearUsuario(usuarioData) {
        // Verificar si el email ya existe
        const emailExiste = this.usuarios.some(u => u.email === usuarioData.email);
        if (emailExiste) {
            throw new Error('El email ya está registrado');
        }

        // Simular creación de usuario
        const nuevoUsuario = {
            id: Math.max(...this.usuarios.map(u => u.id), 0) + 1,
            ...usuarioData,
            fechaRegistro: new Date().toISOString()
        };
        
        this.usuarios.push(nuevoUsuario);
        this.mostrarUsuarios();
        this.actualizarEstadisticas();
        this.mostrarMensaje('✅ Usuario creado exitosamente', 'success');
    }

    async actualizarUsuario(id, usuarioData) {
        const index = this.usuarios.findIndex(u => u.id === id);
        if (index !== -1) {
            // Verificar si el email ya existe (excluyendo el usuario actual)
            const emailExiste = this.usuarios.some(u => u.email === usuarioData.email && u.id !== id);
            if (emailExiste) {
                throw new Error('El email ya está registrado por otro usuario');
            }

            this.usuarios[index] = { 
                ...this.usuarios[index], 
                ...usuarioData,
                // Mantener la fecha de registro original
                fechaRegistro: this.usuarios[index].fechaRegistro
            };
            this.mostrarUsuarios();
            this.actualizarEstadisticas();
            this.mostrarMensaje('✅ Usuario actualizado exitosamente', 'success');
        }
    }

    async activarUsuario(id) {
        if (confirm('¿Estás seguro de que quieres activar este usuario?')) {
            const usuario = this.usuarios.find(u => u.id === id);
            if (usuario) {
                usuario.activo = true;
                this.mostrarUsuarios();
                this.mostrarMensaje('✅ Usuario activado exitosamente', 'success');
            }
        }
    }

    async desactivarUsuario(id) {
        if (confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
            const usuario = this.usuarios.find(u => u.id === id);
            if (usuario) {
                usuario.activo = false;
                this.mostrarUsuarios();
                this.mostrarMensaje('⚠️ Usuario desactivado', 'warning');
            }
        }
    }

    async eliminarUsuario(id) {
        if (confirm('¿Estás seguro de que quieres eliminar permanentemente este usuario?\n\n⚠️ Esta acción no se puede deshacer.')) {
            this.usuarios = this.usuarios.filter(u => u.id !== id);
            this.mostrarUsuarios();
            this.actualizarEstadisticas();
            this.mostrarMensaje('🗑️ Usuario eliminado exitosamente', 'info');
        }
    }

    cerrarModalUsuario() {
        const modal = document.getElementById('modalUsuario');
        if (modal) {
            modal.style.display = 'none';
        }
        this.usuarioEditando = null;
    }

    // Métodos para reportes
    cargarReportes() {
        // Simular datos de reportes
        if (document.getElementById('totalVentas')) {
            document.getElementById('totalVentas').textContent = '$2,450,000';
        }
        if (document.getElementById('totalUsuarios')) {
            document.getElementById('totalUsuarios').textContent = this.usuarios.length.toString();
        }
        if (document.getElementById('totalProductos')) {
            document.getElementById('totalProductos').textContent = '89';
        }
        if (document.getElementById('totalPedidos')) {
            document.getElementById('totalPedidos').textContent = '234';
        }
    }

    generarReporteCompleto() {
        this.mostrarMensaje('📊 Generando reporte completo...', 'info');
        // Simular generación de reporte
        setTimeout(() => {
            this.mostrarMensaje('✅ Reporte generado exitosamente', 'success');
        }, 2000);
    }

    exportarDatos() {
        this.mostrarMensaje('📥 Exportando datos del sistema...', 'info');
        // Simular exportación
        setTimeout(() => {
            this.mostrarMensaje('✅ Datos exportados exitosamente', 'success');
        }, 2000);
    }

    actualizarReportes() {
        console.log('Actualizando reportes con filtros...');
        // Aquí se actualizarían los reportes basados en los filtros
        this.cargarReportes();
    }

    mostrarMensaje(mensaje, tipo = 'success') {
        // Eliminar mensajes existentes
        const mensajesExistentes = document.querySelectorAll('.mensaje-flotante');
        mensajesExistentes.forEach(msg => msg.remove());

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

        setTimeout(() => {
            if (mensajeDiv.parentNode) {
                mensajeDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => mensajeDiv.remove(), 300);
            }
        }, 4000);
    }
}

// ===== INSTANCIA GLOBAL =====
const adminManager = new AdminManager();

// ===== FUNCIONES GLOBALES PARA HTML =====
function mostrarModalNuevoUsuario() {
    adminManager.mostrarModalNuevoUsuario();
}

function editarUsuario(id) {
    adminManager.editarUsuario(id);
}

function guardarUsuario() {
    adminManager.guardarUsuario();
}

function activarUsuario(id) {
    adminManager.activarUsuario(id);
}

function desactivarUsuario(id) {
    adminManager.desactivarUsuario(id);
}

function eliminarUsuario(id) {
    adminManager.eliminarUsuario(id);
}

function filtrarUsuarios() {
    adminManager.filtrarUsuarios();
}

function cerrarModalUsuario() {
    adminManager.cerrarModalUsuario();
}

function generarReporteCompleto() {
    adminManager.generarReporteCompleto();
}

function exportarDatos() {
    adminManager.exportarDatos();
}

function cargarReportes() {
    adminManager.cargarReportes();
}

function actualizarReportes() {
    adminManager.actualizarReportes();
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // AdminManager ya se inicializa automáticamente en su constructor
    console.log('✅ Módulo de administración cargado correctamente');
    
    // Agregar estilos para animaciones de mensajes
    if (!document.querySelector('#mensaje-styles')) {
        const styles = document.createElement('style');
        styles.id = 'mensaje-styles';
        styles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
});
