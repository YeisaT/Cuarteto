import { PlaceholderPage } from '../components/ui'

export function VentasClientes() {
  return (
    <PlaceholderPage
      title="Clientes"
      moduleName="Ventas"
      note="Previsión: las notas de venta podrán guardarse en localStorage/IndexedDB y sincronizarse al recuperar conexión."
    />
  )
}

export function VentasNotas() {
  return (
    <PlaceholderPage
      title="Notas de venta"
      moduleName="Ventas"
      note="Soporte offline previsto: cola local + sync automático al recuperar red."
    />
  )
}

export function VentasEntregas() {
  return <PlaceholderPage title="Notas de entrega" moduleName="Ventas" />
}

export function VentasDevoluciones() {
  return <PlaceholderPage title="Devoluciones" moduleName="Ventas" />
}

export function VentasReportes() {
  return <PlaceholderPage title="Reportes de ventas" moduleName="Ventas" />
}

export function InventarioProductos() {
  return <PlaceholderPage title="Catálogo de productos" moduleName="Inventario" />
}

export function InventarioKardex() {
  return <PlaceholderPage title="Kardex" moduleName="Inventario" />
}

export function InventarioAjustes() {
  return <PlaceholderPage title="Ajustes de inventario" moduleName="Inventario" />
}

export function InventarioTraspasos() {
  return <PlaceholderPage title="Traspasos entre sucursales" moduleName="Inventario" />
}

export function ParamEmpresa() {
  return <PlaceholderPage title="Datos de la empresa" moduleName="Parámetros" />
}

export function ParamMonedas() {
  return <PlaceholderPage title="Monedas y tipos de cambio" moduleName="Parámetros" />
}

export function ParamSucursales() {
  return <PlaceholderPage title="Sucursales" moduleName="Parámetros" />
}

export function ParamAlmacenes() {
  return <PlaceholderPage title="Almacenes" moduleName="Parámetros" />
}

export function ParamListasPrecio() {
  return <PlaceholderPage title="Listas de precio" moduleName="Parámetros" />
}

export function ParamEmpleados() {
  return <PlaceholderPage title="Empleados" moduleName="Parámetros" />
}

export function SegUsuarios() {
  return <PlaceholderPage title="Usuarios" moduleName="Seguridad" />
}

export function SegRoles() {
  return <PlaceholderPage title="Roles y permisos" moduleName="Seguridad" />
}
