import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import {
  SEED_PROVEEDORES,
  SEED_ORDENES,
  SEED_PAGOS,
  MONEDAS,
  TIPOS_CAMBIO,
  FORMAS_PAGO,
  ESTADOS_ORDEN,
  SUCURSALES,
  ALMACENES,
  EMPLEADOS,
  PRODUCTOS,
  ordenTotal,
} from '../data/seed'

const DataContext = createContext(null)
const STORAGE_KEY = 'cm_compras_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return {
    proveedores: SEED_PROVEEDORES,
    ordenes: SEED_ORDENES,
    pagos: SEED_PAGOS,
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const nextOrdenNumero = useCallback(() => {
    const year = new Date().getFullYear()
    const nums = data.ordenes
      .map((o) => {
        const m = o.numero.match(/OC-(\d+)-(\d+)/)
        return m && Number(m[1]) === year ? Number(m[2]) : 0
      })
      .filter(Boolean)
    const next = (nums.length ? Math.max(...nums) : 0) + 1
    return `OC-${year}-${String(next).padStart(4, '0')}`
  }, [data.ordenes])

  const listProveedores = useCallback(() => data.proveedores, [data.proveedores])

  const getProveedor = useCallback(
    (id) => data.proveedores.find((p) => p.id === id) || null,
    [data.proveedores],
  )

  const saveProveedor = useCallback((payload) => {
    setData((prev) => {
      if (payload.id) {
        return {
          ...prev,
          proveedores: prev.proveedores.map((p) =>
            p.id === payload.id ? { ...p, ...payload } : p,
          ),
        }
      }
      const nuevo = {
        ...payload,
        id: uid('prov'),
        activo: payload.activo !== false,
        productosOfrecidos: payload.productosOfrecidos || [],
      }
      return { ...prev, proveedores: [nuevo, ...prev.proveedores] }
    })
  }, [])

  const toggleProveedor = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      proveedores: prev.proveedores.map((p) =>
        p.id === id ? { ...p, activo: !p.activo } : p,
      ),
    }))
  }, [])

  const listOrdenes = useCallback(() => data.ordenes, [data.ordenes])

  const getOrden = useCallback(
    (id) => data.ordenes.find((o) => o.id === id) || null,
    [data.ordenes],
  )

  const saveOrden = useCallback(
    (payload, userId) => {
      if (payload.id) {
        setData((prev) => ({
          ...prev,
          ordenes: prev.ordenes.map((o) =>
            o.id === payload.id ? { ...o, ...payload } : o,
          ),
        }))
        return payload.id
      }
      const id = uid('oc')
      const nueva = {
        ...payload,
        id,
        numero: nextOrdenNumero(),
        creadoPor: userId,
        creadoEn: new Date().toISOString(),
        estado: payload.estado || 'borrador',
      }
      setData((prev) => ({ ...prev, ordenes: [nueva, ...prev.ordenes] }))
      return id
    },
    [nextOrdenNumero],
  )

  const actualizarEstadoOrden = useCallback((id, estado, extra = {}) => {
    setData((prev) => ({
      ...prev,
      ordenes: prev.ordenes.map((o) =>
        o.id === id ? { ...o, estado, ...extra } : o,
      ),
    }))
  }, [])

  const listPagos = useCallback(() => data.pagos, [data.pagos])

  const registrarPago = useCallback((payload, userId) => {
    setData((prev) => {
      const pago = {
        ...payload,
        id: uid('pag'),
        registradoPor: userId,
      }
      const pagosOrden = [...prev.pagos, pago].filter((p) => p.ordenId === payload.ordenId)
      const orden = prev.ordenes.find((o) => o.id === payload.ordenId)
      let ordenes = prev.ordenes
      if (orden) {
        const pagado = pagosOrden.reduce((s, p) => s + Number(p.monto), 0)
        const total = ordenTotal(orden)
        // No cambiamos estado de recepción; el pago es independiente
        void pagado
        void total
      }
      return { ...prev, pagos: [pago, ...prev.pagos] }
    })
  }, [])

  const pagosDeOrden = useCallback(
    (ordenId) => data.pagos.filter((p) => p.ordenId === ordenId),
    [data.pagos],
  )

  const dashboardStats = useCallback(() => {
    const ordenes = data.ordenes
    const pendientes = ordenes.filter((o) => o.estado === 'pendiente').length
    const aprobadas = ordenes.filter((o) => o.estado === 'aprobada').length
    const recibidas = ordenes.filter((o) => o.estado === 'recibida').length
    const montoPendiente = ordenes
      .filter((o) => o.estado === 'pendiente' || o.estado === 'aprobada')
      .reduce((s, o) => s + ordenTotal(o), 0)
    const proveedoresActivos = data.proveedores.filter((p) => p.activo).length
    const pagosMes = data.pagos.reduce((s, p) => s + Number(p.monto), 0)
    return {
      pendientes,
      aprobadas,
      recibidas,
      montoPendiente,
      proveedoresActivos,
      pagosMes,
      recientes: ordenes.slice(0, 5),
    }
  }, [data])

  const value = useMemo(
    () => ({
      catalogos: {
        monedas: MONEDAS,
        tiposCambio: TIPOS_CAMBIO,
        formasPago: FORMAS_PAGO,
        estadosOrden: ESTADOS_ORDEN,
        sucursales: SUCURSALES,
        almacenes: ALMACENES,
        empleados: EMPLEADOS,
        productos: PRODUCTOS,
      },
      listProveedores,
      getProveedor,
      saveProveedor,
      toggleProveedor,
      listOrdenes,
      getOrden,
      saveOrden,
      actualizarEstadoOrden,
      listPagos,
      registrarPago,
      pagosDeOrden,
      dashboardStats,
      ordenTotal,
      resetData: () => {
        const fresh = {
          proveedores: SEED_PROVEEDORES,
          ordenes: SEED_ORDENES,
          pagos: SEED_PAGOS,
        }
        setData(fresh)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      },
    }),
    [
      listProveedores,
      getProveedor,
      saveProveedor,
      toggleProveedor,
      listOrdenes,
      getOrden,
      saveOrden,
      actualizarEstadoOrden,
      listPagos,
      registrarPago,
      pagosDeOrden,
      dashboardStats,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider')
  return ctx
}
