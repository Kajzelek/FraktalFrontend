import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { cancelMockPayment, confirmMockPayment, failMockPayment } from '../api/paymentApi'
import { useAuth } from '../auth/AuthContext'
import type { OrderResponse } from '../types/payment'

export function MockPaymentPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePayment(action: 'success' | 'cancel' | 'fail') {
    if (!orderId) {
      setError('Brak identyfikatora zamowienia.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result =
        action === 'success'
          ? await confirmMockPayment(orderId, token)
          : action === 'cancel'
            ? await cancelMockPayment(orderId, token)
            : await failMockPayment(orderId, token)

      setOrder(result)

      if (result.accessGranted) {
        navigate(`/courses/${result.courseId}`, { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie obsluzyc platnosci.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="payment-panel">
      <div>
        <p className="eyebrow">Mock payment</p>
        <h2>Platnosc testowa</h2>
        <p className="muted">Zamowienie: {orderId ?? 'brak'}</p>
      </div>

      {error && <div className="alert">{error}</div>}

      {order && (
        <div className="payment-result">
          <strong>Status: {order.status}</strong>
          <span>{order.courseTitle}</span>
        </div>
      )}

      <div className="payment-actions">
        <button type="button" disabled={loading || !orderId} onClick={() => void handlePayment('success')}>
          Oplac i nadaj dostep
        </button>
        <button type="button" className="secondary-button" disabled={loading || !orderId} onClick={() => void handlePayment('cancel')}>
          Anuluj
        </button>
        <button type="button" className="secondary-button" disabled={loading || !orderId} onClick={() => void handlePayment('fail')}>
          Oznacz jako blad
        </button>
      </div>
    </section>
  )
}
