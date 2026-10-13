import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, PageHeader, formatMoney } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

export default function PagosPage() {
  const { user } = useAuth()
  const {
    listPagos,
    listOrdenes,
    getProveedor,
    catalogos,
    registrarPago,
    ordenTotal,
    pagosDeOrden,
  } = useData()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    ordenId: '',
    monto: '',
    formaPagoId: 'contado',
    fecha: new Date().toISOString().slice(0, 10),
    referencia: '',
    observaciones: '',
  })
  const [error, setError] = useState('')

  const pagos = listPagos()
  const ordenesPagables = useMemo(
    () => listOrdenes().filter((o) => o.estado === 'aprobada' || o.estado === 'recibida'),
    [listOrdenes],
  )

  const onOrdenChange = (ordenId) => {
    const orden = listOrdenes().find((o) => o.id === ordenId)
    if (!orden) {
      setForm((f) => ({ ...f, ordenId, monto: '' }))
      return
    }
    const pagado = pagosDeOrden(ordenId).reduce((s, p) => s + Number(p.monto), 0)
    const saldo = Math.max(0, ordenTotal(orden) - pagado)
    setForm((f) => ({
      ...f,
      ordenId,
      monto: String(saldo),
      formaPagoId: orden.formaPagoId || f.formaPagoId,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!navigator.onLine) {
      setError('Sin conexión: los pagos de compras requieren conexión activa.')
      return
    }
    const orden = listOrdenes().find((o) => o.id === form.ordenId)
    if (!orden) {
      setError('Selecciona una orden válida.')
      return
    }
    registrarPago(
      {
        ordenId: form.ordenId,
        monto: Number(form.monto),
        monedaId: orden.monedaId,
        formaPagoId: form.formaPagoId,
        fecha: form.fecha,
        referencia: form.referencia,
        observaciones: form.observaciones,
      },
      user.id,
    )
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Pagos de compras"
        subtitle="Registro de pagos asociados a órdenes aprobadas o recibidas."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
            Nuevo pago
          </button>
        }
      />

      <div className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Orden</th>
                <th>Proveedor</th>
                <th>Monto</th>
                <th>Forma</th>
                <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    Aún no hay pagos.
                  </td>
                </tr>
              ) : (
                pagos.map((p) => {
                  const orden = listOrdenes().find((o) => o.id === p.ordenId)
                  const mon = catalogos.monedas.find((m) => m.id === p.monedaId)
                  return (
                    <tr key={p.id}>
                      <td>{p.fecha}</td>
                      <td>
                        {orden ? (
                          <Link to={`/compras/ordenes/${orden.id}`}>{orden.numero}</Link>
                        ) : (
                          p.ordenId
                        )}
                      </td>
                      <td>{orden ? getProveedor(orden.proveedorId)?.razonSocial : '—'}</td>
                      <td>{formatMoney(p.monto, mon)}</td>
                      <td>
                        {catalogos.formasPago.find((f) => f.id === p.formaPagoId)?.nombre}
                      </td>
                      <td>{p.referencia || '—'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} title="Registrar pago" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit}>
          {error ? <p className="error-text">{error}</p> : null}
          <div className="form-grid">
            <div className="field full">
              <label>Orden de compra</label>
              <select
                required
                value={form.ordenId}
                onChange={(e) => onOrdenChange(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {ordenesPagables.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.numero} — {getProveedor(o.proveedorId)?.razonSocial}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Monto</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.monto}
                onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Fecha</label>
              <input
                type="date"
                required
                value={form.fecha}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Forma de pago</label>
              <select
                value={form.formaPagoId}
                onChange={(e) => setForm((f) => ({ ...f, formaPagoId: e.target.value }))}
              >
                {catalogos.formasPago.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Referencia</label>
              <input
                value={form.referencia}
                onChange={(e) => setForm((f) => ({ ...f, referencia: e.target.value }))}
              />
            </div>
            <div className="field full">
              <label>Observaciones</label>
              <textarea
                rows={2}
                value={form.observaciones}
                onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
