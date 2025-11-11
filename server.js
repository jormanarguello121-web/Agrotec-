const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Archivo para usuarios
const USERS_FILE = 'usuarios.json';

// Función para leer usuarios
function leerUsuarios() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('Error leyendo usuarios:', error);
    }
    return { usuarios: [] };
}

// Función para guardar usuarios
function guardarUsuarios(usuarios) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
        return true;
    } catch (error) {
        console.log('Error guardando usuarios:', error);
        return false;
    }
}

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir el login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para registro de usuarios
app.post('/registrar', (req, res) => {
    const { nombre, email, password, rol } = req.body;
    
    if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son requeridos' 
        });
    }

    const datos = leerUsuarios();
    
    // Verificar si el usuario ya existe
    const usuarioExistente = datos.usuarios.find(user => user.email === email);
    if (usuarioExistente) {
        return res.status(400).json({ 
            success: false, 
            message: 'El usuario ya existe' 
        });
    }

    // Agregar nuevo usuario
    const nuevoUsuario = {
        id: datos.usuarios.length + 1,
        nombre,
        email,
        password, // En producción esto debería estar encriptado
        rol,
        fechaRegistro: new Date().toISOString()
    };

    datos.usuarios.push(nuevoUsuario);
    
    if (guardarUsuarios(datos)) {
        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Error guardando usuario' 
        });
    }
});

// Ruta para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email y password son requeridos' 
        });
    }

    const datos = leerUsuarios();
    const usuario = datos.usuarios.find(user => 
        user.email === email && user.password === password
    );

    if (usuario) {
        res.json({ 
            success: true, 
            message: 'Login exitoso',
            usuario: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email, 
                rol: usuario.rol 
            }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Credenciales incorrectas' 
        });
    }
});

// Ruta para obtener todos los usuarios (solo para administradores)
app.get('/usuarios', (req, res) => {
    const datos = leerUsuarios();
    // Ocultar passwords antes de enviar
    const usuariosSinPassword = datos.usuarios.map(user => ({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        fechaRegistro: user.fechaRegistro
    }));
    res.json({ usuarios: usuariosSinPassword });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor AgroTec ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Sistema de gestión listo para usar`);
});
