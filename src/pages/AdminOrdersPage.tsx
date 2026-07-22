import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cancelOrder, failOrder, getAdminOrders, markOrderAsPaid } from '../api/orderApi'
import { useAuth } from '../auth/AuthContext'
import type { Order, PaymentStatus } from '../types/order'

type OrderAction = 'PAID' | 'CANCELLED' | 'FAILED'

export function AdminOrdersPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    void loadOrders()
  }, [token])

  const paidOrders = useMemo(() => orders.filter((order) => order.status === 'PAID'), [orders])
  const pendingOrders = useMemo(() => orders.filter((order) => order.status === 'PENDING'), [orders])
  const totalAmount = paidOrders.reduce((sum, order) => sum + order.amount, 0)

  async function loadOrders() {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      setOrders(await getAdminOrders(token))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac zamowien.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOrderAction(order: Order, action: OrderAction) {
    const confirmed = window.confirm(getConfirmMessage(order, action))

    if (!confirmed) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updated = await updateOrderStatus(order.id, action)

      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setSuccess(getSuccessMessage(action))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zmienic statusu zamowienia.')
    } finally {
      setLoading(false)
    }
  }

  function updateOrderStatus(orderId: string, action: OrderAction) {
    if (action === 'PAID') {
      return markOrderAsPaid(orderId, token)
    }

    if (action === 'CANCELLED') {
      return cancelOrder(orderId, token)
    }

    return failOrder(orderId, token)
  }

  return (
    <section className="orders-page">
      <div className="admin-heading-row">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Zamowienia</h2>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate('/admin/courses')}>
          Wroc do kursow
        </button>
      </div>

      {error && <div className="alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <section className="dashboard-stats">
        <article>
          <span>Wszystkie</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <span>Oczekujace</span>
          <strong>{pendingOrders.length}</strong>
        </article>
        <article>
          <span>Przychod</span>
          <strong>{totalAmount.toFixed(0)} zl</strong>
        </article>
      </section>

      {loading && orders.length === 0 ? (
        <p className="muted">Ladowanie zamowien...</p>
      ) : orders.length === 0 ? (
        <p className="muted">Nie ma jeszcze zamowien.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-row" key={order.id}>
              <div>
                <div className="lesson-title-line">
                  <h3>{order.courseTitle}</h3>
                  <span className={getStatusClassName(order.status)}>{getStatusLabel(order.status)}</span>
                  {order.accessGranted && <span className="status done">Dostep aktywny</span>}
                </div>
                <div className="course-meta">
                  <span>{order.amount.toFixed(2)} zl</span>
                  <span>Utworzono: {formatDate(order.createdAt)}</span>
                  <span>Oplacono: {order.paidAt ? formatDate(order.paidAt) : '-'}</span>
                </div>
                <p>ID uzytkownika: {order.userId}</p>
              </div>

              <div className="admin-row-actions">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={loading}
                  onClick={() => navigate(`/courses/${order.courseId}`)}
                >
                  Kurs
                </button>
                <button
                  type="button"
                  disabled={loading || order.status !== 'PENDING'}
                  onClick={() => void handleOrderAction(order, 'PAID')}
                >
                  Oplacone
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={loading || order.status !== 'PENDING'}
                  onClick={() => void handleOrderAction(order, 'CANCELLED')}
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={loading || order.status !== 'PENDING'}
                  onClick={() => void handleOrderAction(order, 'FAILED')}
                >
                  Nieudane
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function getStatusLabel(status: PaymentStatus) {
  switch (status) {
    case 'PAID':
      return 'Oplacone'
    case 'PENDING':
      return 'Oczekuje'
    case 'CANCELLED':
      return 'Anulowane'
    case 'FAILED':
      return 'Nieudane'
  }
}

function getStatusClassName(status: PaymentStatus) {
  if (status === 'PAID') {
    return 'status done'
  }

  if (status === 'PENDING') {
    return 'status free'
  }

  return 'status locked'
}

function getConfirmMessage(order: Order, action: OrderAction) {
  if (action === 'PAID') {
    return `Czy oznaczyc zamowienie "${order.courseTitle}" jako oplacone?`
  }

  if (action === 'CANCELLED') {
    return `Czy anulowac zamowienie "${order.courseTitle}"?`
  }

  return `Czy oznaczyc zamowienie "${order.courseTitle}" jako nieudane?`
}

function getSuccessMessage(action: OrderAction) {
  if (action === 'PAID') {
    return 'Zamowienie zostalo oznaczone jako oplacone.'
  }

  if (action === 'CANCELLED') {
    return 'Zamowienie zostalo anulowane.'
  }

  return 'Zamowienie zostalo oznaczone jako nieudane.'
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
