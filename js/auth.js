// Manejo de autenticación y redirección

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar si hay usuario en localStorage
        const userData = localStorage.getItem('usuario');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.usuario;
                localStorage.setItem('usuario', JSON.stringify(result.usuario));
                
                // Redirigir según el rol
                this.redirectByRole(result.usuario.rol);
                
                return { success: true, usuario: result.usuario };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async register(userData) {
        try {
            const response = await fetch('/api/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            return await response.json();
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('usuario');
        window.location.href = '/';
    }

    redirectByRole(rol) {
        switch(rol) {
            case 'agricultor':
                window.location.href = '/agricultor/dashboard.html';
                break;
            case 'cliente':
                window.location.href = '/cliente/mercado.html';
                break;
            case 'administrador':
                window.location.href = '/admin/dashboard.html';
                break;
            default:
                window.location.href = '/';
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUser() {
        return this.currentUser;
    }

    requireAuth(requiredRole = null) {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }

        if (requiredRole && this.currentUser.rol !== requiredRole) {
            window.location.href = '/';
            return false;
        }

        return true;
    }
}

// Instancia global
const authManager = new AuthManager();
