🌱 AgroTec - Prototipo de Plataforma Agrícola
Sistema web para fortalecer la comercialización agrícola en San Juan de Rioseco, Cundinamarca

Descripción del Proyecto
Prototipo funcional de una aplicación web diseñada para conectar agricultores locales con compradores, facilitando la comercialización directa de productos agrícolas. Desarrollado como parte de un proyecto de investigación aplicada.

Objetivos
Crear un canal directo de comercialización para agricultores
Digitalizar procesos de compra-venta de productos agrícolas
Facilitar el acceso a mercados para productores rurales
Validar flujos de usuario con agricultores reales

Estructura del Proyecto
AgroTec/
├── admin/                 # Módulo de administración
│   ├── dashboard.html     # Panel de control admin
│   ├── reportes.html      # Reportes del sistema
│   ├── usuarios.html      # Gestión de usuarios
│   └── admin.css          # Estilos del admin
├── agricultor/            # Módulo para agricultores
│   ├── dashboard.html     # Dashboard personal
│   ├── productos.html     # Gestión de productos
│   ├── informacion.html   # Información del perfil
│   └── agricultor.css     # Estilos del agricultor
├── cliente/               # Módulo para clientes
│   ├── mercado.html       # Catálogo de productos
│   ├── carrito.html       # Carrito de compras
│   ├── pedidos.html       # Historial de pedidos
│   ├── calendario.html    # Calendario agrícola
│   └── cliente.css        # Estilos del cliente
├── js/                    # Lógica de la aplicación
│   ├── auth.js            # Autenticación
│   ├── admin.js           # Funciones admin
│   ├── agricultor.js      # Lógica agricultor
│   ├── cliente.js         # Lógica cliente
│   └── api.js             # Simulación de API
├── public/                # Archivos públicos
│   ├── index.html         # Página principal
│   ├── login.html         # Inicio de sesión
│   ├── index.css          # Estilos principales
│   └── styles.css         # Estilos globales
└── *.json                 # Datos de prueba

Características Principales

Módulo Agricultor
-Gestión de inventario de productos
-Dashboard personal con métricas
-Perfil de agricultor
-Control de productos y precios

Módulo Cliente
-Catálogo de productos disponible
-Carrito de compras
-Seguimiento de pedidos
-Calendario de temporadas

Módulo Administrador
-Gestión completa de usuarios
-Reportes del sistema
-Supervisión de actividad
-Panel de control central

Tecnologías Utilizadas
Frontend: HTML5, CSS3, JavaScript (ES6+)
Almacenamiento: JSON files (prototipo)
Despliegue: Render.com (Static Site)
Control de Versiones: GitHub
