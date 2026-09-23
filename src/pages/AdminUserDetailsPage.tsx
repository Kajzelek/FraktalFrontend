import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserEnrollments } from '../api/enrollmentApi'
import { getAdminOrders } from '../api/orderApi'
import { getAdminUser } from '../api/userApi'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'
import type { Enrollment } from '../types/enrollment'
import type { Order, PaymentStatus } from '../types/order'
import type { AdminUser } from '../types/user'

export function AdminUserDetailsPage() {
  const { userId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId) {
      void loadUserDetails(userId)
    }
  }, [token, userId])

  const paidOrders = useMemo(() => orders.filter((order) => order.status === 'PAID'), [orders])
  const totalAmount = paidOrders.reduce((sum, order) => sum + order.amount, 0)

  async function loadUserDetails(selectedUserId: string) {
    setLoading(true)
    setError('')
    setUser(null)
    setEnrollments([])
    setOrders([])

    try {

      const userData = await getAdminUser(selectedUserId, token)
      setUser(userData)

      const [enrollmentsResult, ordersResult] = await Promise.allSettled([
        getUserEnrollments(selectedUserId, token),
        getAdminOrders(token),
      ])

      const errors: string[] = []

      if(enrollmentsResult.status === 'fulfilled'){
        setEnrollments(enrollmentsResult.value)
      }else{
        errors.push('Nie udalo sie pobrac dostepow uzytkownika.')
      }

      if(ordersResult.status === 'fulfilled'){
        const userOrders = ordersResult.value.filter(
          (order) => order.userId === selectedUserId,
        )
        setOrders(userOrders)
      }else{
        errors.push('Nie udalo sie pobrac zamowien uzytkownika.')
      }

      if(errors.length > 0){
        setError(errors.join(' '))

      }

    } catch (err) {
      if (err instanceof ApiError)
        switch (err.status){
          case 401:
          setError('Sesja wygasla. Zaloguj sie ponownie.')
          break
        case 403:
          setError('Nie masz uprawnien do wyswietlenia tego uzytkownika.')
          break
        case 404:
          setError('Nie znaleziono uzytkownika.')
          break
        default:
          setError(err.message)
        } else{
          setError('Nie udalo sie pobrac szczegolow uzytkownika')
        }
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return <div className="alert">Brak identyfikatora uzytkownika.</div>
  }

  return (
    <section className="admin-page">
      <div className="admin-heading-row">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Szczegoly uzytkownika</h2>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate('/admin/users')}>
          Wroc do uzytkownikow
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading && !user ? (
        <p className="muted">Ladowanie uzytkownika...</p>
      ) : user ? (
        <>
          <section className="dashboard-stats">
            <article>
              <span>Dostepy</span>
              <strong>{enrollments.length}</strong>
            </article>
            <article>
              <span>Zamowienia</span>
              <strong>{orders.length}</strong>
            </article>
            <article>
              <span>Przychod</span>
              <strong>{totalAmount.toFixed(0)} zl</strong>
            </article>
          </section>

          <section className="admin-course-row">
            <div>
              <div className="lesson-title-line">
                <h3>{getDisplayName(user)}</h3>
                <span className={user.role === 'ROLE_ADMIN' ? 'status free' : 'status done'}>
                  {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}
                </span>
              </div>
              <p>{user.email}</p>
              <div className="course-meta">
                <span>Login: {user.username}</span>
                <span>Nick: {user.nickname || '-'}</span>
                <span>Utworzono: {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </section>

          <section className="content-grid">
            <div className="section-heading">
              <p className="eyebrow">Dostepy</p>
              <h2>Kursy uzytkownika</h2>
            </div>

            {enrollments.length === 0 ? (
              <p className="muted">Ten uzytkownik nie ma jeszcze dostepu do kursow.</p>
            ) : (
              <div className="admin-table">
                {enrollments.map((enrollment) => (
                  <article className="admin-course-row" key={enrollment.id}>
                    <div>
                      <h3>{enrollment.course.title}</h3>
                      <div className="course-meta">
                        <span>{enrollment.course.category}</span>
                        <span>Nadano: {formatDate(enrollment.enrollmentDate)}</span>
                      </div>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                      >
                        Kurs
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="content-grid">
            <div className="section-heading">
              <p className="eyebrow">Zakupy</p>
              <h2>Zamowienia</h2>
            </div>

            {orders.length === 0 ? (
              <p className="muted">Ten uzytkownik nie ma jeszcze zamowien.</p>
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
        </>
      ) : !error ?(
        <p className="muted">Nie znaleziono uzytkownika.</p>
      ) : null}
    </section>
  )
}

function getDisplayName(user: AdminUser) {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return name || user.username || user.email
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
