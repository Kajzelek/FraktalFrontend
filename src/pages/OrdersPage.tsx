import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrders } from '../api/orderApi'
import { useAuth } from '../auth/AuthContext'
import type { Order, PaymentStatus } from '../types/order'

export function OrdersPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadOrders()
  }, [token])

  const paidOrders = useMemo(() => orders.filter((order) => order.status === 'PAID'), [orders])
  const pendingOrders = useMemo(() => orders.filter((order) => order.status === 'PENDING'), [orders])

  async function loadOrders() {
    setLoading(true)
    setError('')

    try {
      setOrders(await getMyOrders(token))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac historii zakupow.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="orders-page">
      <div className="section-heading">
        <p className="eyebrow">Konto</p>
        <h2>Historia zakupow</h2>
      </div>

      {error && <div className="alert">{error}</div>}

      <section className="dashboard-stats">
        <article>
          <span>Wszystkie zamowienia</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <span>Oplacone</span>
          <strong>{paidOrders.length}</strong>
        </article>
        <article>
          <span>Oczekujace</span>
          <strong>{pendingOrders.length}</strong>
        </article>
      </section>

      {loading && orders.length === 0 ? (
        <p className="muted">Ladowanie zakupow...</p>
      ) : orders.length === 0 ? (
        <p className="muted">Nie masz jeszcze zadnych zakupow.</p>
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
              </div>

              <div className="admin-row-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate(`/courses/${order.courseId}`)}
                >
                  Kurs
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
