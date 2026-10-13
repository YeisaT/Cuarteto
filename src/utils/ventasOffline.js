/**
 * Utilidad prevista para Ventas offline.
 * Compras NO debe usar esta cola: requieren conexión activa.
 */
const QUEUE_KEY = 'cm_ventas_offline_queue'

export function enqueueVentaOffline(payload) {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  queue.push({ ...payload, queuedAt: new Date().toISOString(), synced: false })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  return queue.length
}

export function getPendingVentas() {
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]').filter((x) => !x.synced)
}

export async function syncPendingVentas(sendFn) {
  if (!navigator.onLine) return { synced: 0, remaining: getPendingVentas().length }
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  let synced = 0
  const next = []
  for (const item of queue) {
    if (item.synced) {
      next.push(item)
      continue
    }
    try {
      await sendFn(item)
      synced += 1
      next.push({ ...item, synced: true, syncedAt: new Date().toISOString() })
    } catch {
      next.push(item)
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(next))
  return { synced, remaining: next.filter((x) => !x.synced).length }
}

/** Escucha reconexión para disparar sync automático (usar desde módulo Ventas). */
export function watchOnlineSync(sendFn) {
  const handler = () => {
    syncPendingVentas(sendFn)
  }
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}
