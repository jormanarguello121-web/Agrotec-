// Verificar sesión del cliente
function obtenerUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || usuario.rol !== 'cliente') {
    window.location.href = '/login.html';
    return null;
  }
  return usuario;
}

// Cargar productos disponibles
async function cargarProductosDisponibles() {
  const usuario = obtenerUsuario();
  if (!usuario) return;

  try {
    const response = await fetch('/productos');
    const productos = await response.json();

    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    productos.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('producto-card');
      div.innerHTML = `
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <p><strong>Precio:</strong> $${p.precio}</p>
        <button onclick="agregarAlCarrito('${p.id}', '${p.nombre}', ${p.precio})">Agregar al Carrito</button>
      `;
      contenedor.appendChild(div);
    });

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// Agregar producto al carrito (guardado en localStorage)
function agregarAlCarrito(id, nombre, precio) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`✅ ${nombre} agregado al carrito`);
}

// Mostrar carrito en la vista carrito.html
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contenedor = document.getElementById('carrito-container');
  const totalElemento = document.getElementById('total');
  let total = 0;

  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>No tienes productos en el carrito.</p>';
    totalElemento.textContent = '0';
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('carrito-item');
    total += item.precio * item.cantidad;

    div.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>Precio: $${item.precio}</p>
      <p>Cantidad: ${item.cantidad}</p>
      <button onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });

  totalElemento.textContent = total.toFixed(2);
}

// Eliminar un producto del carrito
function eliminarDelCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

// Finalizar compra (simulado)
function finalizarCompra() {
  alert('✅ Compra realizada con éxito!');
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('carrito');
  window.location.href = '/login.html';
}
