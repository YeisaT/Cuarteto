export const NAV_SECTIONS = [
  {
    id: 'general',
    label: null,
    items: [
      { to: '/', label: 'Dashboard general', module: 'dashboard', end: true },
    ],
  },
  {
    id: 'compras',
    label: 'Compras',
    module: 'compras',
    items: [
      { to: '/compras', label: 'Dashboard', module: 'compras', end: true },
      { to: '/compras/proveedores', label: 'Proveedores', module: 'compras' },
      { to: '/compras/ordenes', label: 'Órdenes de compra', module: 'compras' },
      { to: '/compras/pagos', label: 'Pagos', module: 'compras' },
      { to: '/compras/reportes', label: 'Reportes', module: 'compras' },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    module: 'ventas',
    items: [
      { to: '/ventas/clientes', label: 'Clientes', module: 'ventas' },
      { to: '/ventas/notas', label: 'Notas de venta', module: 'ventas' },
      { to: '/ventas/entregas', label: 'Notas de entrega', module: 'ventas' },
      { to: '/ventas/devoluciones', label: 'Devoluciones', module: 'ventas' },
      { to: '/ventas/reportes', label: 'Reportes', module: 'ventas' },
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario',
    module: 'inventario',
    items: [
      { to: '/inventario/productos', label: 'Catálogo de productos', module: 'inventario' },
      { to: '/inventario/kardex', label: 'Kardex', module: 'inventario' },
      { to: '/inventario/ajustes', label: 'Ajustes', module: 'inventario' },
      { to: '/inventario/traspasos', label: 'Traspasos', module: 'inventario' },
    ],
  },
  {
    id: 'parametros',
    label: 'Parámetros',
    module: 'parametros',
    items: [
      { to: '/parametros/empresa', label: 'Datos de la empresa', module: 'parametros' },
      { to: '/parametros/monedas', label: 'Monedas y tipos de cambio', module: 'parametros' },
      { to: '/parametros/sucursales', label: 'Sucursales', module: 'parametros' },
      { to: '/parametros/almacenes', label: 'Almacenes', module: 'parametros' },
      { to: '/parametros/listas-precio', label: 'Listas de precio', module: 'parametros' },
      { to: '/parametros/empleados', label: 'Empleados', module: 'parametros' },
    ],
  },
  {
    id: 'seguridad',
    label: 'Seguridad',
    module: 'seguridad',
    items: [
      { to: '/seguridad/usuarios', label: 'Usuarios', module: 'seguridad' },
      { to: '/seguridad/roles', label: 'Roles y permisos', module: 'seguridad' },
    ],
  },
]
