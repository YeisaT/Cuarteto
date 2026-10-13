/** Datos semilla que simulan la API REST / catálogos dinámicos de BD. */

export const MONEDAS = [
  { id: 'bob', codigo: 'BOB', nombre: 'Boliviano', simbolo: 'Bs.' },
  { id: 'usd', codigo: 'USD', nombre: 'Dólar estadounidense', simbolo: 'USD' },
  { id: 'eur', codigo: 'EUR', nombre: 'Euro', simbolo: '€' },
]

export const TIPOS_CAMBIO = [
  { monedaId: 'usd', oficial: 6.96, referencial: 6.96 },
  { monedaId: 'eur', oficial: 7.55, referencial: 7.6 },
  { monedaId: 'bob', oficial: 1, referencial: 1 },
]

export const FORMAS_PAGO = [
  { id: 'contado', nombre: 'Contado' },
  { id: 'credito_30', nombre: 'Crédito 30 días' },
  { id: 'credito_60', nombre: 'Crédito 60 días' },
  { id: 'transferencia', nombre: 'Transferencia bancaria' },
]

export const ESTADOS_ORDEN = [
  { id: 'borrador', nombre: 'Borrador', tone: 'neutral' },
  { id: 'pendiente', nombre: 'Pendiente aprobación', tone: 'warn' },
  { id: 'aprobada', nombre: 'Aprobada', tone: 'info' },
  { id: 'recibida', nombre: 'Recibida', tone: 'ok' },
  { id: 'anulada', nombre: 'Anulada', tone: 'danger' },
]

export const SUCURSALES = [
  { id: 'suc-1', nombre: 'Casa Matriz La Paz', gerenteComercialId: 'emp-1' },
  { id: 'suc-2', nombre: 'Sucursal Santa Cruz', gerenteComercialId: 'emp-2' },
]

export const ALMACENES = [
  { id: 'alm-1', nombre: 'Almacén Central LP', sucursalId: 'suc-1', jefeAlmacenId: 'emp-3' },
  { id: 'alm-2', nombre: 'Almacén SCZ', sucursalId: 'suc-2', jefeAlmacenId: 'emp-4' },
]

export const EMPLEADOS = [
  { id: 'emp-1', nombre: 'Carla Mendoza', cargo: 'Gerente Comercial' },
  { id: 'emp-2', nombre: 'Luis Vargas', cargo: 'Gerente Comercial' },
  { id: 'emp-3', nombre: 'Ana Rojas', cargo: 'Jefe de Almacén' },
  { id: 'emp-4', nombre: 'Pedro Quispe', cargo: 'Jefe de Almacén' },
  { id: 'emp-5', nombre: 'Roberto Salas', cargo: 'Gerente General' },
]

export const PRODUCTOS = [
  { id: 'prod-1', codigo: 'CM-001', nombre: 'Arroz grano largo 25kg', unidad: 'saco', categoria: 'Abarrotes' },
  { id: 'prod-2', codigo: 'CM-002', nombre: 'Aceite vegetal 1L', unidad: 'caja x12', categoria: 'Abarrotes' },
  { id: 'prod-3', codigo: 'CM-003', nombre: 'Leche en polvo 400g', unidad: 'caja x24', categoria: 'Lácteos' },
  { id: 'prod-4', codigo: 'CM-004', nombre: 'Detergente líquido 3L', unidad: 'unidad', categoria: 'Limpieza' },
  { id: 'prod-5', codigo: 'CM-005', nombre: 'Fideos espagueti 500g', unidad: 'caja x20', categoria: 'Abarrotes' },
]

export const USUARIOS_DEMO = [
  {
    id: 'u-1',
    nombre: 'Yeisa Admin',
    email: 'admin@cuarteto.market',
    password: 'admin123',
    rolId: 'administrador',
  },
  {
    id: 'u-2',
    nombre: 'María Compras',
    email: 'compras@cuarteto.market',
    password: 'compras123',
    rolId: 'compras',
  },
  {
    id: 'u-3',
    nombre: 'Gerente General',
    email: 'gerencia@cuarteto.market',
    password: 'gerencia123',
    rolId: 'gerencia',
  },
  {
    id: 'u-4',
    nombre: 'Vendedor Demo',
    email: 'ventas@cuarteto.market',
    password: 'ventas123',
    rolId: 'ventas',
  },
]

export const SEED_PROVEEDORES = [
  {
    id: 'prov-1',
    razonSocial: 'Distribuidora Andina S.A.',
    nit: '1029384756',
    tipo: 'local',
    pais: 'Bolivia',
    ciudad: 'La Paz',
    telefono: '+591 2 2456789',
    email: 'ventas@andina.bo',
    representante: 'Jorge Mamani',
    activo: true,
    productosOfrecidos: [
      { productoId: 'prod-1', costoReferencial: 185, monedaId: 'bob' },
      { productoId: 'prod-5', costoReferencial: 95, monedaId: 'bob' },
    ],
  },
  {
    id: 'prov-2',
    razonSocial: 'Pacific Trade Co.',
    nit: 'US-884512',
    tipo: 'internacional',
    pais: 'Estados Unidos',
    ciudad: 'Miami',
    telefono: '+1 305 555 0199',
    email: 'orders@pacifictrade.com',
    representante: 'Helen Carter',
    activo: true,
    productosOfrecidos: [
      { productoId: 'prod-2', costoReferencial: 28.5, monedaId: 'usd' },
      { productoId: 'prod-3', costoReferencial: 42, monedaId: 'usd' },
      { productoId: 'prod-4', costoReferencial: 6.8, monedaId: 'usd' },
    ],
  },
  {
    id: 'prov-3',
    razonSocial: 'Alimentos del Sur Ltda.',
    nit: '3049582716',
    tipo: 'local',
    pais: 'Bolivia',
    ciudad: 'Santa Cruz',
    telefono: '+591 3 3344556',
    email: 'contacto@alsur.bo',
    representante: 'Sofía Peña',
    activo: true,
    productosOfrecidos: [
      { productoId: 'prod-1', costoReferencial: 178, monedaId: 'bob' },
      { productoId: 'prod-3', costoReferencial: 310, monedaId: 'bob' },
    ],
  },
]

export const SEED_ORDENES = [
  {
    id: 'oc-1',
    numero: 'OC-2026-0001',
    proveedorId: 'prov-1',
    responsableId: 'emp-1',
    aprobadorId: 'emp-5',
    representanteProveedor: 'Jorge Mamani',
    sucursalId: 'suc-1',
    almacenId: 'alm-1',
    lugarEntrega: 'Almacén Central LP — Av. Montes 450',
    fechaEntrega: '2026-03-28',
    horaEntrega: '10:00',
    monedaId: 'bob',
    tipoCambio: 1,
    formaPagoId: 'contado',
    estado: 'pendiente',
    comprobanteEntrega: '',
    numeroFactura: '',
    observaciones: 'Pedido rutinario de abarrotes',
    creadoPor: 'u-2',
    creadoEn: '2026-03-18T09:30:00',
    detalle: [
      {
        id: 'det-1',
        productoId: 'prod-1',
        cantidad: 40,
        unidad: 'saco',
        costoUnitario: 185,
        descuentoPct: 2,
        descuentoMonto: 0,
      },
      {
        id: 'det-2',
        productoId: 'prod-5',
        cantidad: 25,
        unidad: 'caja x20',
        costoUnitario: 95,
        descuentoPct: 0,
        descuentoMonto: 50,
      },
    ],
  },
  {
    id: 'oc-2',
    numero: 'OC-2026-0002',
    proveedorId: 'prov-2',
    responsableId: 'emp-1',
    aprobadorId: 'emp-5',
    representanteProveedor: 'Helen Carter',
    sucursalId: 'suc-1',
    almacenId: 'alm-1',
    lugarEntrega: 'Almacén Central LP',
    fechaEntrega: '2026-04-05',
    horaEntrega: '14:00',
    monedaId: 'usd',
    tipoCambio: 6.96,
    formaPagoId: 'transferencia',
    estado: 'aprobada',
    comprobanteEntrega: '',
    numeroFactura: 'INV-77821',
    observaciones: 'Importación aceite y lácteos',
    creadoPor: 'u-2',
    creadoEn: '2026-03-10T11:00:00',
    detalle: [
      {
        id: 'det-3',
        productoId: 'prod-2',
        cantidad: 100,
        unidad: 'caja x12',
        costoUnitario: 28.5,
        descuentoPct: 5,
        descuentoMonto: 0,
      },
      {
        id: 'det-4',
        productoId: 'prod-3',
        cantidad: 60,
        unidad: 'caja x24',
        costoUnitario: 42,
        descuentoPct: 0,
        descuentoMonto: 0,
      },
    ],
  },
  {
    id: 'oc-3',
    numero: 'OC-2026-0003',
    proveedorId: 'prov-3',
    responsableId: 'emp-2',
    aprobadorId: null,
    representanteProveedor: 'Sofía Peña',
    sucursalId: 'suc-2',
    almacenId: 'alm-2',
    lugarEntrega: 'Almacén SCZ',
    fechaEntrega: '2026-03-25',
    horaEntrega: '09:00',
    monedaId: 'bob',
    tipoCambio: 1,
    formaPagoId: 'contado',
    estado: 'recibida',
    comprobanteEntrega: 'GR-3341',
    numeroFactura: 'F-12045',
    observaciones: '',
    creadoPor: 'u-2',
    creadoEn: '2026-03-05T16:20:00',
    detalle: [
      {
        id: 'det-5',
        productoId: 'prod-1',
        cantidad: 80,
        unidad: 'saco',
        costoUnitario: 178,
        descuentoPct: 0,
        descuentoMonto: 0,
      },
    ],
  },
]

export const SEED_PAGOS = [
  {
    id: 'pag-1',
    ordenId: 'oc-3',
    monto: 14240,
    monedaId: 'bob',
    formaPagoId: 'contado',
    fecha: '2026-03-12',
    referencia: 'TRX-99821',
    observaciones: 'Pago total contra factura F-12045',
    registradoPor: 'u-2',
  },
]

export function lineTotal(item) {
  const bruto = item.cantidad * item.costoUnitario
  const descPct = bruto * ((item.descuentoPct || 0) / 100)
  const descMonto = item.descuentoMonto || 0
  return Math.max(0, bruto - descPct - descMonto)
}

export function ordenTotal(orden) {
  return (orden.detalle || []).reduce((sum, item) => sum + lineTotal(item), 0)
}
