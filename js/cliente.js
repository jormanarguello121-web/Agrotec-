// Al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Verificar autenticación
    if (!usuario || usuario.rol !== 'cliente') {
        window.location.href = '/login.html';
        return;
    }

    // Mostrar nombre
    document.getElementById('userName').textContent = usuario.nombre;

    // Cargar datos simulados (luego conectaremos API real)
    cargarProductosDisponibles();
    cargarPedidosCliente();
});

// ================================
// PRODUCTOS DISPONIBLES
// ================================
let productos = [];

async function cargarProductosDisponibles() {
    try {
        const respuesta = await fetch('https://agrotec-h2nn.onrender.com/api/productos');
        if (!respuesta.ok) throw new Error('Error al obtener los productos');
        
        const data = await respuesta.json();
        productos = data.productos.filter(p => p.estado === "activo" && p.cantidad > 0);

        mostrarProductos();
    } catch (error) {
        console.error('Error cargando productos:', error);
        const contenedor = document.getElementById('listaProductos');
        contenedor.innerHTML = `<p class="no-data">⚠️ No se pudieron cargar los productos. Intenta más tarde.</p>`;
    }
}

function mostrarProductos() {
    const contenedor = document.getElementById('listaProductos');
    contenedor.innerHTML = productos.map(p => `
        <div class="product-card">
            <img src="${p.imagen || 'https://cdn-icons-png.flaticon.com/512/415/415733.png'}" 
                 alt="${p.nombre}" class="product-img">
            <div class="product-info">
                <h4>${p.nombre}</h4>
                <p class="categoria">📦 ${p.categoria}</p>
                <p>${p.descripcion}</p>
                <p class="precio">💰 $${p.precio.toLocaleString()} / kg</p>
                <button class="btn btn-primary" onclick="agregarAlCarrito(${p.id})">🛒 Agregar</button>
            </div>
        </div>
    `).join('');
}
// ================================
// CARRITO DE COMPRAS
// ================================
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;

    const existe = carrito.find(item => item.id === idProducto);
    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    mostrarMensaje(`"${producto.nombre}" agregado al carrito`);
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// ================================
// PEDIDOS DEL CLIENTE
// ================================
let pedidos = [];

function cargarPedidosCliente() {
    // Simulación (luego vendrá del backend)
    pedidos = [
        {
            id: 1001,
            fecha: "2025-11-12",
            total: 35000,
            estado: "Entregado"
        },
        {
            id: 1002,
            fecha: "2025-11-10",
            total: 18500,
            estado: "En camino"
        }
    ];

    mostrarPedidos();
}

function mostrarPedidos() {
    const contenedor = document.getElementById('listaPedidos');
    if (!contenedor) return;

    if (pedidos.length === 0) {
        contenedor.innerHTML = `<p class="no-data">No tienes pedidos registrados aún 🛍️</p>`;
        return;
    }

    contenedor.innerHTML = pedidos.map(p => `
        <div class="pedido-card">
            <div class="pedido-header">
                <h4>Pedido #${p.id}</h4>
                <span class="estado ${p.estado.toLowerCase()}">${p.estado}</span>
            </div>
            <div class="pedido-detalles">
                <p>📅 ${p.fecha}</p>
                <p>💰 Total: $${p.total.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

// ================================
// UTILIDADES
// ================================
function mostrarMensaje(texto) {
    const alerta = document.createElement('div');
    alerta.className = 'alert';
    alerta.textContent = texto;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
}
