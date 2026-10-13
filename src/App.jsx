import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { RequireAuth, RequireModule } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import GeneralDashboard from './pages/GeneralDashboard'
import ComprasDashboard from './pages/compras/ComprasDashboard'
import ProveedoresPage from './pages/compras/ProveedoresPage'
import OrdenesListPage from './pages/compras/OrdenesListPage'
import OrdenFormPage from './pages/compras/OrdenFormPage'
import OrdenDetallePage from './pages/compras/OrdenDetallePage'
import PagosPage from './pages/compras/PagosPage'
import ComprasReportesPage from './pages/compras/ComprasReportesPage'
import {
  VentasClientes,
  VentasNotas,
  VentasEntregas,
  VentasDevoluciones,
  VentasReportes,
  InventarioProductos,
  InventarioKardex,
  InventarioAjustes,
  InventarioTraspasos,
  ParamEmpresa,
  ParamMonedas,
  ParamSucursales,
  ParamAlmacenes,
  ParamListasPrecio,
  ParamEmpleados,
  SegUsuarios,
  SegRoles,
} from './pages/placeholders'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<GeneralDashboard />} />

          <Route element={<RequireModule module="compras" />}>
            <Route path="compras" element={<ComprasDashboard />} />
            <Route path="compras/proveedores" element={<ProveedoresPage />} />
            <Route path="compras/ordenes" element={<OrdenesListPage />} />
            <Route path="compras/ordenes/nueva" element={<OrdenFormPage />} />
            <Route path="compras/ordenes/:id" element={<OrdenDetallePage />} />
            <Route path="compras/ordenes/:id/editar" element={<OrdenFormPage />} />
            <Route path="compras/pagos" element={<PagosPage />} />
            <Route path="compras/reportes" element={<ComprasReportesPage />} />
          </Route>

          <Route element={<RequireModule module="ventas" />}>
            <Route path="ventas/clientes" element={<VentasClientes />} />
            <Route path="ventas/notas" element={<VentasNotas />} />
            <Route path="ventas/entregas" element={<VentasEntregas />} />
            <Route path="ventas/devoluciones" element={<VentasDevoluciones />} />
            <Route path="ventas/reportes" element={<VentasReportes />} />
          </Route>

          <Route element={<RequireModule module="inventario" />}>
            <Route path="inventario/productos" element={<InventarioProductos />} />
            <Route path="inventario/kardex" element={<InventarioKardex />} />
            <Route path="inventario/ajustes" element={<InventarioAjustes />} />
            <Route path="inventario/traspasos" element={<InventarioTraspasos />} />
          </Route>

          <Route element={<RequireModule module="parametros" />}>
            <Route path="parametros/empresa" element={<ParamEmpresa />} />
            <Route path="parametros/monedas" element={<ParamMonedas />} />
            <Route path="parametros/sucursales" element={<ParamSucursales />} />
            <Route path="parametros/almacenes" element={<ParamAlmacenes />} />
            <Route path="parametros/listas-precio" element={<ParamListasPrecio />} />
            <Route path="parametros/empleados" element={<ParamEmpleados />} />
          </Route>

          <Route element={<RequireModule module="seguridad" />}>
            <Route path="seguridad/usuarios" element={<SegUsuarios />} />
            <Route path="seguridad/roles" element={<SegRoles />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
