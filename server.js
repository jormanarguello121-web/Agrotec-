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
app.use('/agricultor', express.static('agricultor'));
app.use('/cliente', express.static('cliente'));
app.use('/admin', express.static('admin'));
app.use('/js', express.static('js'));

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
    // Si no existe el archivo, crear estructura básica
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
    // Si no existe el archivo, crear estructura básica
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

// Crear archivos de datos si no existen
function inicializarArchivosDatos() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            const usuariosIniciales = {
                usuarios: [
                    {
                        id: 1,
                        nombre: "Juan Agricultor",
                        email: "agricultor@ejemplo.com",
                        password: "password123",
                        rol: "agricultor",
                        fechaRegistro: new Date().toISOString(),
                        activo: true
                    },
                    {
                        id: 2,
                        nombre: "María Cliente",
                        email: "cliente@ejemplo.com",
                        password: "password123",
                        rol: "cliente",
                        fechaRegistro: new Date().toISOString(),
                        activo: true
                    },
                    {
                        id: 3,
                        nombre: "Admin Sistema",
                        email: "admin@ejemplo.com",
                        password: "password123",
                        rol: "administrador",
                        fechaRegistro: new Date().toISOString(),
                        activo: true
                    }
                ]
            };
            guardarUsuarios(usuariosIniciales);
            console.log('✅ Archivo de usuarios creado');
        }

        if (!fs.existsSync(PRODUCTS_FILE)) {
            const productosIniciales = {
                productos: [
                    {
                        id: 1,
                        nombre: "Tomates Orgánicos",
                        categoria: "verduras",
                        precio: 4500,
                        cantidad: 50,
                        fechaCosecha: "2024-01-15",
                        descripcion: "Tomates frescos cultivados orgánicamente",
                        imagen: "",
                        agricultorId: 1,
                        estado: "activo",
                        fechaCreacion: new Date().toISOString(),
                        fechaActualizacion: new Date().toISOString()
                    },
                    {
                        id: 2,
                        nombre: "Aguacates Hass",
                        categoria: "frutas",
                        precio: 6500,
                        cantidad: 0,
                        fechaCosecha: "2024-01-10",
                        descripcion: "Aguacates de primera calidad",
                        imagen: "",
                        agricultorId: 1,
                        estado: "agotado",
                        fechaCreacion: new Date().toISOString(),
                        fechaActualizacion: new Date().toISOString()
                    },
                    {
                        id: 3,
                        nombre: "Zanahorias Frescas",
                        categoria: "verduras",
                        precio: 3800,
                        cantidad: 30,
                        fechaCosecha: "2024-01-12",
                        descripcion: "Zanahorias dulces y crujientes",
                        imagen: "",
                        agricultorId: 1,
                        estado: "activo",
                        fechaCreacion: new Date().toISOString(),
                        fechaActualizacion: new Date().toISOString()
                    }
                ]
            };
            guardarProductos(productosIniciales);
            console.log('✅ Archivo de productos creado');
        }
    } catch (error) {
        console.log('Error inicializando archivos:', error);
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

// Carrito cliente 
app.get('/cliente/carrito.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cliente', 'carrito.html'));
});

// Pedidos cliente
app.get('/cliente/pedidos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cliente', 'pedidos.html'));
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

// ================= API RUTAS =================

// API: Registro de usuarios
app.post('/registrar', (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        console.log('📝 Datos recibidos para registro:', { nombre, email, rol });
        
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
            console.log('✅ Usuario registrado exitosamente:', nuevoUsuario.email);
            res.json({ 
                success: true, 
                message: 'Usuario registrado exitosamente',
                usuario: { 
                    id: nuevoUsuario.id, 
                    nombre: nuevoUsuario.nombre, 
                    email: nuevoUsuario.email,
                    rol: nuevoUsuario.rol 
                }
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Error guardando usuario' 
            });
        }
    } catch (error) {
        console.error('❌ Error en registro:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor en registro' 
        });
    }
});

// API: Login
app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔐 Intento de login:', { email });
        
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
            console.log('✅ Login exitoso para:', usuario.email);
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
            console.log('❌ Login fallido para:', email);
            res.status(401).json({ 
                success: false, 
                message: 'Credenciales incorrectas o usuario inactivo' 
            });
        }
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor en login' 
        });
    }
});

// API: Obtener todos los usuarios (solo admin)
app.get('/usuarios', (req, res) => {
    try {
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
        console.log('📊 Enviando lista de usuarios:', usuariosSinPassword.length);
        res.json({ usuarios: usuariosSinPassword });
    } catch (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// ================= API PRODUCTOS =================

// API: Obtener todos los productos
app.get('/productos', (req, res) => {
    try {
        const datos = leerProductos();
        console.log('🛒 Enviando lista de productos:', datos.productos.length);
        res.json({ productos: datos.productos });
    } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// API: Obtener productos por agricultor
app.get('/productos/agricultor/:id', (req, res) => {
    try {
        const agricultorId = parseInt(req.params.id);
        const datos = leerProductos();
        const productosAgricultor = datos.productos.filter(producto => 
            producto.agricultorId === agricultorId
        );
        console.log(`🌱 Productos del agricultor ${agricultorId}:`, productosAgricultor.length);
        res.json({ productos: productosAgricultor });
    } catch (error) {
        console.error('❌ Error obteniendo productos por agricultor:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// API: Agregar nuevo producto
app.post('/productos/agregar', (req, res) => {
    try {
        const { nombre, categoria, precio, cantidad, fechaCosecha, descripcion, imagen, agricultorId } = req.body;
        
        console.log('➕ Agregando producto:', { nombre, agricultorId });
        
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
            console.log('✅ Producto agregado exitosamente:', nuevoProducto.nombre);
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
    } catch (error) {
        console.error('❌ Error agregando producto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// API: Editar producto
app.put('/productos/editar/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { nombre, categoria, precio, cantidad, fechaCosecha, descripcion, imagen } = req.body;
        
        console.log('✏️ Editando producto ID:', productId);
        
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
            console.log('✅ Producto actualizado exitosamente:', datos.productos[productoIndex].nombre);
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
    } catch (error) {
        console.error('❌ Error editando producto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// API: Eliminar producto
app.delete('/productos/eliminar/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        
        console.log('🗑️ Eliminando producto ID:', productId);
        
        const datos = leerProductos();
        const productoIndex = datos.productos.findIndex(p => p.id === productId);
        
        if (productoIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }

        const productoEliminado = datos.productos[productoIndex];
        
        // Eliminar producto
        datos.productos.splice(productoIndex, 1);
        
        if (guardarProductos(datos)) {
            console.log('✅ Producto eliminado exitosamente:', productoEliminado.nombre);
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
    } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// ================= API ESTADÍSTICAS =================

// API: Estadísticas del agricultor
app.get('/estadisticas/agricultor/:id', (req, res) => {
    try {
        const agricultorId = parseInt(req.params.id);
        const productosData = leerProductos();
        
        const productosAgricultor = productosData.productos.filter(
            p => p.agricultorId === agricultorId
        );
        
        const totalProductos = productosAgricultor.length;
        const productosActivos = productosAgricultor.filter(p => p.estado === 'activo').length;
        const productosAgotados = productosAgricultor.filter(p => p.estado === 'agotado').length;
        const ingresosTotales = productosAgricultor.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
        
        console.log(`📊 Estadísticas agricultor ${agricultorId}:`, { totalProductos, productosActivos });
        
        res.json({
            totalProductos,
            productosActivos,
            productosAgotados,
            ingresosTotales,
            productosRecientes: productosAgricultor.slice(0, 5)
        });
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// ================= API CARRITO Y PEDIDOS =================

// API: Procesar pedido desde carrito
app.post('/pedidos/procesar', (req, res) => {
    try {
        const { items, direccionEntrega, metodoPago, total } = req.body;
        
        console.log('📦 Procesando pedido con items:', items?.length);
        
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

        console.log('✅ Pedido procesado exitosamente:', nuevoPedido.id);
        
        res.json({ 
            success: true, 
            message: 'Pedido procesado exitosamente',
            pedido: nuevoPedido
        });
    } catch (error) {
        console.error('❌ Error procesando pedido:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// API: Obtener pedidos del usuario
app.get('/pedidos/usuario/:userId', (req, res) => {
    try {
        const userId = req.params.userId;
        
        console.log('📋 Obteniendo pedidos del usuario:', userId);
        
        // Datos de ejemplo
        const pedidosEjemplo = [
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
        ];
        
        res.json({
            success: true,
            pedidos: pedidosEjemplo
        });
    } catch (error) {
        console.error('❌ Error obteniendo pedidos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// ================= RUTAS DE ARCHIVOS ESTÁTICOS =================

// Servir archivos CSS desde las carpetas de roles
app.get('/:carpeta/:archivo.css', (req, res) => {
    try {
        const carpeta = req.params.carpeta;
        const archivo = req.params.archivo;
        
        // Solo permitir estas carpetas por seguridad
        const carpetasPermitidas = ['agricultor', 'cliente', 'admin'];
        if (carpetasPermitidas.includes(carpeta)) {
            const filePath = path.join(__dirname, carpeta, `${archivo}.css`);
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            } else {
                res.status(404).json({ success: false, message: 'Archivo CSS no encontrado' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Carpeta no permitida' });
        }
    } catch (error) {
        console.error('❌ Error sirviendo archivo CSS:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Servir archivos JavaScript
app.get('/js/:archivo', (req, res) => {
    try {
        const archivo = req.params.archivo;
        const filePath = path.join(__dirname, 'js', archivo);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).json({ success: false, message: 'Archivo JS no encontrado' });
        }
    } catch (error) {
        console.error('❌ Error sirviendo archivo JS:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// ================= MANEJO DE ERRORES =================

// Ruta 404
app.use((req, res) => {
    console.log('❌ Ruta no encontrada:', req.url);
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('💥 Error del servidor:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
    });
});

// Inicializar archivos de datos
inicializarArchivosDatos();

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor AgroTec ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Sistema de gestión listo para usar`);
    console.log(`🌱 Rutas disponibles:`);
    console.log(`   • Página principal: /`);
    console.log(`   • Login: /login`);
    console.log(`   • Agricultor: /agricultor/dashboard.html`);
    console.log(`   • Cliente: /cliente/mercado.html`);
    console.log(`   • Admin: /admin/dashboard.html`);
    console.log(`   • API Usuarios: /usuarios`);
    console.log(`   • API Productos: /productos`);
    console.log(`\n💡 Usuarios de prueba:`);
    console.log(`   • Agricultor: agricultor@ejemplo.com / password123`);
    console.log(`   • Cliente: cliente@ejemplo.com / password123`);
    console.log(`   • Admin: admin@ejemplo.com / password123\n`);
});
