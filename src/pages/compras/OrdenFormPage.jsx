import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader, formatMoney } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { lineTotal } from '../../data/seed'

function blankDetalle() {
  return {
    id: `tmp-${Math.random().toString(36).slice(2, 8)}`,
    productoId: '',
    cantidad: 1,
    unidad: '',
    costoUnitario: 0,
    descuentoPct: 0,
    descuentoMonto: 0,
  }
}

function buildInitial(existing, catalogos, getProveedor) {
  if (existing) {
    return {
      ...existing,
      detalle: existing.detalle.map((d) => ({ ...d })),
    }
  }
  const tc = catalogos.tiposCambio.find((t) => t.monedaId === 'bob')
  return {
    proveedorId: '',
    responsableId: catalogos.empleados.find((e) => e.cargo.includes('Comercial'))?.id || '',
    aprobadorId: catalogos.empleados.find((e) => e.cargo.includes('General'))?.id || '',
    representanteProveedor: '',
    sucursalId: catalogos.sucursales[0]?.id || '',
    almacenId: catalogos.almacenes[0]?.id || '',
    lugarEntrega: '',
    fechaEntrega: '',
    horaEntrega: '10:00',
    monedaId: 'bob',
    tipoCambio: tc?.oficial ?? 1,
    formaPagoId: 'contado',
    comprobanteEntrega: '',
    numeroFactura: '',
    observaciones: '',
    estado: 'borrador',
    detalle: [blankDetalle()],
  }
}

export default function OrdenFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id) && id !== 'nueva'
  const navigate = useNavigate()
  const { user } = useAuth()
  const { catalogos, listProveedores, getOrden, saveOrden, getProveedor } = useData()

  const existing = isEdit ? getOrden(id) : null
  const [form, setForm] = useState(() => buildInitial(existing, catalogos, getProveedor))
  const [error, setError] = useState('')

  const proveedores = listProveedores().filter((p) => p.activo)
  const almacenes = catalogos.almacenes.filter((a) => a.sucursalId === form.sucursalId)
  const total = useMemo(
    () => form.detalle.reduce((s, d) => s + lineTotal(d), 0),
    [form.detalle],
  )
  const mon = catalogos.monedas.find((m) => m.id === form.monedaId)

  if (isEdit && !existing) {
    return (
      <div className="alert warn">
        Orden no encontrada. <Link to="/compras/ordenes">Volver al listado</Link>
      </div>
    )
  }

  const setField = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (key === 'monedaId') {
        const tc = catalogos.tiposCambio.find((t) => t.monedaId === value)
        next.tipoCambio = tc?.oficial ?? 1
      }
      if (key === 'proveedorId') {
        const prov = getProveedor(value)
        next.representanteProveedor = prov?.representante || ''
      }
      if (key === 'sucursalId') {
        const firstAlm = catalogos.almacenes.find((a) => a.sucursalId === value)
        next.almacenId = firstAlm?.id || ''
      }
      return next
    })
  }

  const setDetalle = (idx, key, value) => {
    setForm((f) => {
      const detalle = f.detalle.map((row, i) => {
        if (i !== idx) return row
        const next = { ...row, [key]: value }
        if (key === 'productoId') {
          const prod = catalogos.productos.find((p) => p.id === value)
          next.unidad = prod?.unidad || ''
          const prov = getProveedor(f.proveedorId)
          const ref = prov?.productosOfrecidos?.find((x) => x.productoId === value)
          if (ref) next.costoUnitario = ref.costoReferencial
        }
        return next
      })
      return { ...f, detalle }
    })
  }

  const addLine = () => setForm((f) => ({ ...f, detalle: [...f.detalle, blankDetalle()] }))
  const removeLine = (idx) =>
    setForm((f) => ({
      ...f,
      detalle: f.detalle.length <= 1 ? f.detalle : f.detalle.filter((_, i) => i !== idx),
    }))

  const persist = (estado) => {
    if (!navigator.onLine) {
      setError('No hay conexión. Las compras no se pueden registrar offline.')
      return
    }
    if (!form.proveedorId || !form.fechaEntrega || form.detalle.some((d) => !d.productoId)) {
      setError('Completa proveedor, fecha de entrega y al menos un producto válido.')
      return
    }
    const payload = {
      ...form,
      estado,
      detalle: form.detalle.map((row) => ({
        ...row,
        id: String(row.id).startsWith('tmp-')
          ? `det-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
          : row.id,
        cantidad: Number(row.cantidad),
        costoUnitario: Number(row.costoUnitario),
        descuentoPct: Number(row.descuentoPct) || 0,
        descuentoMonto: Number(row.descuentoMonto) || 0,
      })),
    }
    if (isEdit) payload.id = existing.id
    const savedId = saveOrden(payload, user.id)
    navigate(`/compras/ordenes/${isEdit ? existing.id : savedId}`)
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? `Editar ${existing.numero}` : 'Nueva orden de compra'}
        subtitle="Responsable: Gerente Comercial · Aprobador: Gerente General · Forma de pago desde catálogo dinámico."
        actions={
          <Link className="btn btn-ghost" to="/compras/ordenes">
            Volver
          </Link>
        }
      />

      {!navigator.onLine ? (
        <div className="alert warn">Sin conexión: no se pueden guardar compras.</div>
      ) : null}
      {error ? <p className="error-text">{error}</p> : null}

      <div className="panel panel-pad">
        <div className="form-grid">
          <div className="field">
            <label>Proveedor</label>
            <select
              required
              value={form.proveedorId}
              onChange={(e) => setField('proveedorId', e.target.value)}
            >
              <option value="">Seleccionar…</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.razonSocial} ({p.tipo})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Representante del proveedor</label>
            <input
              value={form.representanteProveedor}
              onChange={(e) => setField('representanteProveedor', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Responsable (Gerente Comercial)</label>
            <select
              value={form.responsableId}
              onChange={(e) => setField('responsableId', e.target.value)}
            >
              {catalogos.empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} — {e.cargo}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Aprobador (Gerente General)</label>
            <select
              value={form.aprobadorId || ''}
              onChange={(e) => setField('aprobadorId', e.target.value)}
            >
              {catalogos.empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} — {e.cargo}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Sucursal</label>
            <select
              value={form.sucursalId}
              onChange={(e) => setField('sucursalId', e.target.value)}
            >
              {catalogos.sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Almacén de recepción</label>
            <select
              value={form.almacenId}
              onChange={(e) => setField('almacenId', e.target.value)}
            >
              {almacenes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="field full">
            <label>Lugar de entrega</label>
            <input
              value={form.lugarEntrega}
              onChange={(e) => setField('lugarEntrega', e.target.value)}
              placeholder="Dirección / referencia"
            />
          </div>
          <div className="field">
            <label>Fecha de entrega</label>
            <input
              type="date"
              required
              value={form.fechaEntrega}
              onChange={(e) => setField('fechaEntrega', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Hora de entrega</label>
            <input
              type="time"
              value={form.horaEntrega}
              onChange={(e) => setField('horaEntrega', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Moneda</label>
            <select
              value={form.monedaId}
              onChange={(e) => setField('monedaId', e.target.value)}
            >
              {catalogos.monedas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.codigo} — {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Tipo de cambio (oficial)</label>
            <input
              type="number"
              step="0.0001"
              value={form.tipoCambio}
              onChange={(e) => setField('tipoCambio', Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Forma de pago</label>
            <select
              value={form.formaPagoId}
              onChange={(e) => setField('formaPagoId', e.target.value)}
            >
              {catalogos.formasPago.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Nº factura (si aplica)</label>
            <input
              value={form.numeroFactura}
              onChange={(e) => setField('numeroFactura', e.target.value)}
            />
          </div>
          <div className="field full">
            <label>Observaciones</label>
            <textarea
              rows={2}
              value={form.observaciones}
              onChange={(e) => setField('observaciones', e.target.value)}
            />
          </div>
        </div>

        <h3 style={{ fontSize: '1.05rem', margin: '1.35rem 0 0.7rem' }}>Detalle de productos</h3>
        <div className="line-items">
          {form.detalle.map((row, idx) => (
            <div className="line-item" key={row.id}>
              <div className="field">
                <label>Producto</label>
                <select
                  value={row.productoId}
                  onChange={(e) => setDetalle(idx, 'productoId', e.target.value)}
                >
                  <option value="">Seleccionar…</option>
                  {catalogos.productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} — {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Cantidad</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={row.cantidad}
                  onChange={(e) => setDetalle(idx, 'cantidad', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Unidad</label>
                <input
                  value={row.unidad}
                  onChange={(e) => setDetalle(idx, 'unidad', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Costo unit.</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.costoUnitario}
                  onChange={(e) => setDetalle(idx, 'costoUnitario', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Desc. %</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={row.descuentoPct}
                  onChange={(e) => setDetalle(idx, 'descuentoPct', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Desc. monto</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.descuentoMonto}
                  onChange={(e) => setDetalle(idx, 'descuentoMonto', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Total línea</label>
                <strong style={{ padding: '0.55rem 0' }}>{formatMoney(lineTotal(row), mon)}</strong>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeLine(idx)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="toolbar" style={{ marginTop: '0.85rem' }}>
          <button type="button" className="btn btn-ghost" onClick={addLine}>
            + Línea
          </button>
          <strong style={{ marginLeft: 'auto' }}>Total orden: {formatMoney(total, mon)}</strong>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={() => persist('borrador')}>
            Guardar borrador
          </button>
          <button type="button" className="btn btn-accent" onClick={() => persist('pendiente')}>
            Enviar a aprobación
          </button>
        </div>
      </div>
    </div>
  )
}
