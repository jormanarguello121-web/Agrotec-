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

// Archivos de datos
const USERS_FILE = 'usuarios.json';
const PRODUCTS_FILE = 'productos.json';

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

// Función para leer productos
function leerProductos() {
    try {
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('Error leyendo productos:', error);
    }
    return { productos: [] };
}

// Función para guardar productos
function guardarProductos(productos) {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productos, null, 2));
        return true;
    } catch (error) {
        console.log('Error guardando productos:', error);
        return false;
    }
}

// ================= RUTAS PRINCIPALES =================

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir el login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ================= RUTAS AGRICULTOR =================

// Dashboard agricultor
app.get('/agricultor/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'agricultor', 'dashboard.html'));
});

// Productos agricultor
app.get('/agricultor/productos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'agricultor', 'productos.html'));
});

// Información agricultor
app.get('/agricultor/informacion.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'agricultor', 'informacion.html'));
});

// ================= RUTAS CLIENTE =================

// Marketplace cliente
app.get('/cliente/mercado.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cliente', 'mercado.html'));
});

// Productos cliente
app.get('/cliente/productos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cliente', 'productos.html'));
});

// Calendario cliente
app.get('/cliente/calendario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cliente', 'calendario.html'));
});

// ================= RUTAS ADMIN =================

// Dashboard admin
app.get('/admin/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// Usuarios admin
app.get('/admin/usuarios.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'usuarios.html'));
});

// Reportes admin
app.get('/admin/reportes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'reportes.html'));
});

// ================= API RUTAS (ENDOPOINTS DEL SERVIDOR) =================

// API: Registro de usuarios
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
        password, 
        rol,
        fechaRegistro: new Date().toISOString(),
        activo: true
    };

    datos.usuarios.push(nuevoUsuario);
    
    if (guardarUsuarios(datos)) {
        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            usuario: { 
                id: nuevoUsuario.id, 
                nombre: nuevoUsuario.nombre, 
                rol: nuevoUsuario.rol 
            }
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Error guardando usuario' 
        });
    }
});

// API: Login
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
        user.email === email && user.password === password && user.activo !== false
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
            message: 'Credenciales incorrectas o usuario inactivo' 
        });
    }
});

// API: Obtener todos los usuarios (solo admin)
app.get('/usuarios', (req, res) => {
    const datos = leerUsuarios();
    // Ocultar passwords antes de enviar
    const usuariosSinPassword = datos.usuarios.map(user => ({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        fechaRegistro: user.fechaRegistro,
        activo: user.activo
    }));
    res.json({ usuarios: usuariosSinPassword });
});

// ================= API PRODUCTOS =================

// API: Obtener todos los productos
app.get('/productos', (req, res) => {
    const datos = leerProductos();
    res.json({ productos: datos.productos });
});

// API: Obtener productos por agricultor
app.get('/productos/agricultor/:id', (req, res) => {
    const agricultorId = parseInt(req.params.id);
    const datos = leerProductos();
    const productosAgricultor = datos.productos.filter(producto => 
        producto.agricultorId === agricultorId
    );
    res.json({ productos: productosAgricultor });
});

// API: Agregar nuevo producto
app.post('/productos/agregar', (req, res) => {
    const { nombre, categoria, precio, cantidad, fechaCosecha, descripcion, imagen, agricultorId } = req.body;
    
    if (!nombre || !categoria || !precio || !cantidad || !agricultorId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos requeridos' 
        });
    }

    const datos = leerProductos();
    
    // Crear nuevo producto
    const nuevoProducto = {
        id: datos.productos.length + 1,
        nombre,
        categoria,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        fechaCosecha: fechaCosecha || null,
        descripcion: descripcion || '',
        imagen: imagen || '',
        agricultorId: parseInt(agricultorId),
        estado: cantidad > 0 ? 'activo' : 'agotado',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    };

    datos.productos.push(nuevoProducto);
    
    if (guardarProductos(datos)) {
        res.json({ 
            success: true, 
            message: 'Producto agregado exitosamente',
            producto: nuevoProducto
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Error guardando producto' 
        });
    }
});

// API: Editar producto
app.put('/productos/editar/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { nombre, categoria, precio, cantidad, fechaCosecha, descripcion, imagen } = req.body;
    
    const datos = leerProductos();
    const productoIndex = datos.productos.findIndex(p => p.id === productId);
    
    if (productoIndex === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Producto no encontrado' 
        });
    }

    // Actualizar producto
    datos.productos[productoIndex] = {
        ...datos.productos[productoIndex],
        nombre,
        categoria,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        fechaCosecha: fechaCosecha || null,
        descripcion: descripcion || '',
        imagen: imagen || '',
        estado: cantidad > 0 ? 'activo' : 'agotado',
        fechaActualizacion: new Date().toISOString()
    };
    
    if (guardarProductos(datos)) {
        res.json({ 
            success: true, 
            message: 'Producto actualizado exitosamente',
            producto: datos.productos[productoIndex]
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Error actualizando producto' 
        });
    }
});

// API: Eliminar producto
app.delete('/productos/eliminar/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    
    const datos = leerProductos();
    const productoIndex = datos.productos.findIndex(p => p.id === productId);
    
    if (productoIndex === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Producto no encontrado' 
        });
    }

    // Eliminar producto
    datos.productos.splice(productoIndex, 1);
    
    if (guardarProductos(datos)) {
        res.json({ 
            success: true, 
            message: 'Producto eliminado exitosamente'
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Error eliminando producto' 
        });
    }
});

// ================= API ESTADÍSTICAS =================

// API: Estadísticas del agricultor
app.get('/estadisticas/agricultor/:id', (req, res) => {
    const agricultorId = parseInt(req.params.id);
    const productosData = leerProductos();
    
    const productosAgricultor = productosData.productos.filter(
        p => p.agricultorId === agricultorId
    );
    
    const totalProductos = productosAgricultor.length;
    const productosActivos = productosAgricultor.filter(p => p.estado === 'activo').length;
    const productosAgotados = productosAgricultor.filter(p => p.estado === 'agotado').length;
    const ingresosTotales = productosAgricultor.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    
    res.json({
        totalProductos,
        productosActivos,
        productosAgotados,
        ingresosTotales,
        productosRecientes: productosAgricultor.slice(0, 5)
    });
});

// ================= RUTAS DE REDIRECCIÓN DESPUÉS DE LOGIN =================

// Redirección basada en rol después del login
app.post('/login-redirect', (req, res) => {
    const { rol } = req.body;
    
    let redirectUrl = '/';
    
    switch(rol) {
        case 'agricultor':
            redirectUrl = '/agricultor/dashboard.html';
            break;
        case 'cliente':
            redirectUrl = '/cliente/mercado.html';
            break;
        case 'administrador':
            redirectUrl = '/admin/dashboard.html';
            break;
        default:
            redirectUrl = '/';
    }
    
    res.json({ redirectUrl });
});

// ================= SERVIR ARCHIVOS CSS Y JS =================

// Servir archivos JavaScript desde la carpeta js/
app.get('/js/:archivo', (req, res) => {
    const archivo = req.params.archivo;
    res.sendFile(path.join(__dirname, 'js', archivo));
});

// Servir archivos CSS desde las carpetas de roles
app.get('/:carpeta/:archivo.css', (req, res) => {
    const carpeta = req.params.carpeta;
    const archivo = req.params.archivo;
    
    // Solo permitir estas carpetas por seguridad
    const carpetasPermitidas = ['agricultor', 'cliente', 'admin'];
    if (carpetasPermitidas.includes(carpeta)) {
        res.sendFile(path.join(__dirname, carpeta, `${archivo}.css`));
    } else {
        res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    }
});
// ================= API CARRITO Y PEDIDOS =================

// API: Procesar pedido desde carrito
app.post('/pedidos/procesar', (req, res) => {
    const { items, direccionEntrega, metodoPago, total } = req.body;
    
    console.log('📦 Procesando pedido:', { items, total });
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'El carrito está vacío' 
        });
    }

    // Crear nuevo pedido
    const nuevoPedido = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        items: items,
        subtotal: total - 2.00,
        envio: 2.00,
        total: total,
        estado: "confirmado",
        direccionEntrega: direccionEntrega || "Calle Principal #123, Ciudad",
        metodoPago: metodoPago || "Tarjeta Crédito",
        tracking: `TRK${Date.now()}`
    };

    res.json({ 
        success: true, 
        message: 'Pedido procesado exitosamente',
        pedido: nuevoPedido
    });
});

// API: Obtener pedidos del usuario
app.get('/pedidos/usuario/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Por ahora devolvemos un array vacío o datos de ejemplo
    // Más adelante puedes conectar con una base de datos
    res.json({
        success: true,
        pedidos: [
            {
                id: 1001,
                fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { id: 1, nombre: "Tomates Orgánicos", precio: 2.5, cantidad: 3 },
                    { id: 3, nombre: "Zanahorias Frescas", precio: 1.8, cantidad: 2 }
                ],
                subtotal: 10.10,
                envio: 2.00,
                total: 12.10,
                estado: "entregado",
                tracking: "TRK123456789"
            }
        ]
    });
});

// API: Rastrear pedido
app.get('/pedidos/rastrear/:trackingId', (req, res) => {
    const trackingId = req.params.trackingId;
    
    res.json({
        success: true,
        tracking: trackingId,
        estado: "en_camino",
        ubicacion: "Centro de distribución",
        estimado: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  });   
// ================= MANEJO DE ERRORES =================

// Ruta 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor AgroTec ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Sistema de gestión listo para usar`);
    console.log(`🌱 Rutas disponibles:`);
    console.log(`   • Página principal: /`);
    console.log(`   • Login: /login`);
    console.log(`   • Agricultor: /agricultor/dashboard.html`);
    console.log(`   • Cliente: /cliente/mercado.html`);
    console.log(`   • Admin: /admin/dashboard.html`);
    console.log(`   • API Productos: /productos`);
    console.log(`   • API Usuarios: /usuarios`);
});
