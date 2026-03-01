import { useState, useEffect } from 'react'
import axios from 'axios'
import Session from 'supertokens-auth-react/recipe/session'
import { placeOrder, getStockStatus, getWsUrl } from '../api'

const STATUS_LABELS: Record<string, string> = {
  waiting: 'Pending',
  received: 'Stock verified / In kitchen',
  cooking: 'Cooking',
  packaging: 'Packaging',
  ready: 'Ready',
}

export function OrderPage() {
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [statusUpdates, setStatusUpdates] = useState<Array<{ id: number; status: string }>>([])
  const [wsConnected, setWsConnected] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [stock, setStock] = useState<number | null>(null)

  useEffect(() => {
    const load = () =>
      getStockStatus()
        .then((d) => setStock(d.value ?? 0))
        .catch(() => setStock(null))
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    Session.getUserId().then(setUserId).catch(() => setUserId(null))
  }, [])

  useEffect(() => {
    if (!userId) return
    const ws = new WebSocket(getWsUrl())
    ws.onopen = () => {
      ws.send(userId)
      setWsConnected(true)
    }
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.id != null && msg.status) {
          setStatusUpdates((prev) => [...prev, { id: msg.id, status: msg.status }])
        }
      } catch {
        // ignore
      }
    }
    ws.onclose = () => setWsConnected(false)
    ws.onerror = () => setWsConnected(false)
    return () => ws.close()
  }, [userId])

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderError('')
    setOrderSuccess(false)
    setSubmitting(true)
    try {
      const data = await placeOrder(quantity)
      if (data.success) {
        setOrderSuccess(true)
        getStockStatus().then((d) => setStock(d.value ?? 0)).catch(() => {})
      } else {
        setOrderError(data.error ?? 'Order failed')
      }
    } catch (err) {
      setOrderError(
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : 'Network error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const available = stock ?? 0
  const canOrder = available > 0 && quantity <= available

  if (userId === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Place order</h2>
        {stock !== null && (
          <p className="text-sm text-slate-600 mb-3">
            Available: <span className="font-medium text-slate-800">{available}</span> portion
            {available !== 1 ? 's' : ''}
          </p>
        )}
        <form onSubmit={handlePlaceOrder} className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="qty" className="block text-xs font-medium text-slate-500 mb-1">
              Quantity
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              max={available > 0 ? available : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !canOrder}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Placing...' : 'Order now'}
          </button>
        </form>
        {available === 0 && stock !== null && (
          <p className="mt-3 text-sm text-amber-600">No stock available. Try again later.</p>
        )}
        {orderError && <p className="mt-3 text-sm text-red-600">{orderError}</p>}
        {orderSuccess && (
          <p className="mt-3 text-sm text-green-600">Order placed. Track status below.</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Order status</h2>
          <span
            className={`inline-flex items-center gap-1.5 text-xs ${
              wsConnected ? 'text-green-600' : 'text-slate-500'
            }`}
          >
            <span className={`size-1.5 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-slate-400'}`} />
            {wsConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        {statusUpdates.length === 0 ? (
          <p className="text-slate-500 text-sm">No updates yet.</p>
        ) : (
          <ul className="space-y-2">
            {statusUpdates.map((u, i) => (
              <li
                key={`${u.id}-${i}`}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm border border-slate-100"
              >
                <span className="text-slate-600">Order #{u.id}</span>
                <span className="text-slate-800 font-medium">{STATUS_LABELS[u.status] ?? u.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
