import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader, StatusBadge, formatMoney, Modal } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { lineTotal } from '../../data/seed'

export default function OrdenDetallePage() {
  const { id } = useParams()
  const { can, user } = useAuth()
  const {
    getOrden,
    getProveedor,
    catalogos,
    ordenTotal,
    actualizarEstadoOrden,
    pagosDeOrden,
    registrarPago,
  } = useData()

  const orden = getOrden(id)
  const [msg, setMsg] = useState('')
  const [pagoOpen, setPagoOpen] = useState(false)
  const [pagoForm, setPagoForm] = useState({
    monto: '',
    formaPagoId: 'contado',
    fecha: new Date().toISOString().slice(0, 10),
    referencia: '',
    observaciones: '',
  })

  if (!orden) {
    return (
      <div className="alert warn">
        Orden no encontrada. <Link to="/compras/ordenes">Volver</Link>
      </div>
    )
  }

  const proveedor = getProveedor(orden.proveedorId)
  const mon = catalogos.monedas.find((m) => m.id === orden.monedaId)
  const forma = catalogos.formasPago.find((f) => f.id === orden.formaPagoId)
  const responsable = catalogos.empleados.find((e) => e.id === orden.responsableId)
  const aprobador = catalogos.empleados.find((e) => e.id === orden.aprobadorId)
  const sucursal = catalogos.sucursales.find((s) => s.id === orden.sucursalId)
  const almacen = catalogos.almacenes.find((a) => a.id === orden.almacenId)
  const pagos = pagosDeOrden(orden.id)
  const total = ordenTotal(orden)
  const pagado = pagos.reduce((s, p) => s + Number(p.monto), 0)
  const puedeAprobar = can('compras_aprobar')

  const aprobar = () => {
    if (!puedeAprobar) {
      setMsg('Tu rol no puede aprobar órdenes. Se requiere Gerencia o Administrador.')
      return
    }
    actualizarEstadoOrden(orden.id, 'aprobada', {
      aprobadorId: orden.aprobadorId,
    })
    setMsg('Orden aprobada. El jefe de almacén podrá registrar el ingreso al Kardex.')
  }

  const anular = () => {
    actualizarEstadoOrden(orden.id, 'anulada')
    setMsg('Orden anulada.')
  }

  const marcarRecibida = () => {
    const comprobante = window.prompt('Nº comprobante de entrega / guía:', orden.comprobanteEntrega || '')
    if (comprobante === null) return
    actualizarEstadoOrden(orden.id, 'recibida', { comprobanteEntrega: comprobante })
    setMsg('Mercadería marcada como recibida. Inventario actualizará el Kardex (integración).')
  }

  const submitPago = (e) => {
    e.preventDefault()
    if (!navigator.onLine) {
      setMsg('Sin conexión: no se puede registrar el pago de una compra.')
      return
    }
    registrarPago(
      {
        ordenId: orden.id,
        monto: Number(pagoForm.monto),
        monedaId: orden.monedaId,
        formaPagoId: pagoForm.formaPagoId,
        fecha: pagoForm.fecha,
        referencia: pagoForm.referencia,
        observaciones: pagoForm.observaciones,
      },
      user.id,
    )
    setPagoOpen(false)
    setMsg('Pago registrado.')
  }

  return (
    <div>
      <PageHeader
        title={orden.numero}
        subtitle={`${proveedor?.razonSocial || 'Proveedor'} · ${sucursal?.nombre || ''}`}
        actions={
          <>
            <Link className="btn btn-ghost" to="/compras/ordenes">
              Listado
            </Link>
            {orden.estado === 'borrador' || orden.estado === 'pendiente' ? (
              <Link className="btn btn-ghost" to={`/compras/ordenes/${orden.id}/editar`}>
                Editar
              </Link>
            ) : null}
          </>
        }
      />

      {msg ? <div className="alert info">{msg}</div> : null}

      <div className="toolbar" style={{ marginBottom: '1rem' }}>
        <StatusBadge estado={orden.estado} estados={catalogos.estadosOrden} />
        {orden.estado === 'pendiente' && puedeAprobar ? (
          <button type="button" className="btn btn-primary" onClick={aprobar}>
            Aprobar orden
          </button>
        ) : null}
        {orden.estado === 'aprobada' ? (
          <button type="button" className="btn btn-accent" onClick={marcarRecibida}>
            Registrar recepción
          </button>
        ) : null}
        {orden.estado !== 'anulada' && orden.estado !== 'recibida' ? (
          <button type="button" className="btn btn-danger" onClick={anular}>
            Anular
          </button>
        ) : null}
        {orden.estado === 'aprobada' || orden.estado === 'recibida' ? (
          <button type="button" className="btn btn-ghost" onClick={() => {
            setPagoForm((f) => ({ ...f, monto: String(Math.max(0, total - pagado)) }))
            setPagoOpen(true)
          }}>
            Registrar pago
          </button>
        ) : null}
      </div>

      <div className="panel panel-pad" style={{ marginBottom: '1rem' }}>
        <dl className="detail-grid">
          <div className="detail-item">
            <dt>Responsable</dt>
            <dd>{responsable?.nombre}</dd>
          </div>
          <div className="detail-item">
            <dt>Aprobador</dt>
            <dd>{aprobador?.nombre || '—'}</dd>
          </div>
          <div className="detail-item">
            <dt>Representante proveedor</dt>
            <dd>{orden.representanteProveedor || '—'}</dd>
          </div>
          <div className="detail-item">
            <dt>Almacén</dt>
            <dd>{almacen?.nombre}</dd>
          </div>
          <div className="detail-item">
            <dt>Lugar / fecha entrega</dt>
            <dd>
              {orden.lugarEntrega || '—'}
              <br />
              {orden.fechaEntrega} {orden.horaEntrega}
            </dd>
          </div>
          <div className="detail-item">
            <dt>Moneda / TC</dt>
            <dd>
              {mon?.codigo} · TC {orden.tipoCambio}
            </dd>
          </div>
          <div className="detail-item">
            <dt>Forma de pago</dt>
            <dd>{forma?.nombre}</dd>
          </div>
          <div className="detail-item">
            <dt>Factura / comprobante</dt>
            <dd>
              {orden.numeroFactura || '—'} / {orden.comprobanteEntrega || '—'}
            </dd>
          </div>
        </dl>
        {orden.observaciones ? (
          <p style={{ color: 'var(--muted)', margin: 0 }}>{orden.observaciones}</p>
        ) : null}
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <div className="panel-pad" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Detalle</h2>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Costo unit.</th>
                <th>Desc. %</th>
                <th>Desc. monto</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orden.detalle.map((d) => {
                const prod = catalogos.productos.find((p) => p.id === d.productoId)
                return (
                  <tr key={d.id}>
                    <td>
                      {prod?.codigo} — {prod?.nombre}
                    </td>
                    <td>{d.cantidad}</td>
                    <td>{d.unidad}</td>
                    <td>{formatMoney(d.costoUnitario, mon)}</td>
                    <td>{d.descuentoPct || 0}%</td>
                    <td>{formatMoney(d.descuentoMonto || 0, mon)}</td>
                    <td>{formatMoney(lineTotal(d), mon)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="panel-pad" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem' }}>
          <div>
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>TOTAL</span>
            <div style={{ fontFamily: 'var(--display)', fontSize: '1.35rem' }}>
              {formatMoney(total, mon)}
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>PAGADO</span>
            <div style={{ fontFamily: 'var(--display)', fontSize: '1.35rem' }}>
              {formatMoney(pagado, mon)}
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-pad" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Pagos asociados</h2>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Forma</th>
                <th>Referencia</th>
                <th>Obs.</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">
                    Sin pagos registrados.
                  </td>
                </tr>
              ) : (
                pagos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.fecha}</td>
                    <td>{formatMoney(p.monto, mon)}</td>
                    <td>
                      {catalogos.formasPago.find((f) => f.id === p.formaPagoId)?.nombre}
                    </td>
                    <td>{p.referencia || '—'}</td>
                    <td>{p.observaciones || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={pagoOpen} title="Registrar pago" onClose={() => setPagoOpen(false)}>
        <form onSubmit={submitPago}>
          <div className="form-grid">
            <div className="field">
              <label>Monto</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={pagoForm.monto}
                onChange={(e) => setPagoForm((f) => ({ ...f, monto: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Fecha</label>
              <input
                type="date"
                required
                value={pagoForm.fecha}
                onChange={(e) => setPagoForm((f) => ({ ...f, fecha: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Forma de pago</label>
              <select
                value={pagoForm.formaPagoId}
                onChange={(e) => setPagoForm((f) => ({ ...f, formaPagoId: e.target.value }))}
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
                value={pagoForm.referencia}
                onChange={(e) => setPagoForm((f) => ({ ...f, referencia: e.target.value }))}
              />
            </div>
            <div className="field full">
              <label>Observaciones</label>
              <textarea
                rows={2}
                value={pagoForm.observaciones}
                onChange={(e) => setPagoForm((f) => ({ ...f, observaciones: e.target.value }))}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setPagoOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar pago
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
