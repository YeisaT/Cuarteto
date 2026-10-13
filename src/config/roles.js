/** Catálogo dinámico de roles (simulando tabla BD). */
export const ROLES = [
  { id: 'administrador', nombre: 'Administrador' },
  { id: 'compras', nombre: 'Compras' },
  { id: 'importaciones', nombre: 'Importaciones' },
  { id: 'ventas', nombre: 'Ventas' },
  { id: 'caja', nombre: 'Caja' },
  { id: 'gerencia', nombre: 'Gerencia' },
  { id: 'almacen', nombre: 'Almacén' },
  { id: 'contabilidad', nombre: 'Contabilidad' },
]

/** Permisos por módulo — el backend validará lo mismo en cada endpoint. */
export const MODULE_PERMISSIONS = {
  dashboard: ['administrador', 'compras', 'importaciones', 'ventas', 'caja', 'gerencia', 'almacen', 'contabilidad'],
  compras: ['administrador', 'compras', 'importaciones', 'gerencia', 'contabilidad'],
  compras_aprobar: ['administrador', 'gerencia'],
  ventas: ['administrador', 'ventas', 'caja', 'gerencia'],
  inventario: ['administrador', 'almacen', 'gerencia', 'compras'],
  parametros: ['administrador', 'gerencia'],
  seguridad: ['administrador'],
}

export function canAccess(roleId, moduleKey) {
  const allowed = MODULE_PERMISSIONS[moduleKey]
  if (!allowed) return false
  return allowed.includes(roleId)
}
