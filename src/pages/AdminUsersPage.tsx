import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminCourses } from '../api/courseApi'
import { grantCourseAccess } from '../api/enrollmentApi'
import { getAdminUsers } from '../api/userApi'
import { useAuth } from '../auth/AuthContext'
import type { AdminCourse } from '../types/course'
import type { AdminUser } from '../types/user'

export function AdminUsersPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    void loadUsers()
  }, [token])

  const studentUsers = useMemo(() => users.filter((user) => user.role === 'ROLE_STUDENT'), [users])
  const adminUsers = useMemo(() => users.filter((user) => user.role === 'ROLE_ADMIN'), [users])

  async function loadUsers() {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const [userList, courseList] = await Promise.all([getAdminUsers(token), getAdminCourses(token)])

      setUsers(userList)
      setCourses(courseList)
      setSelectedCourseId(courseList[0]?.id ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac uzytkownikow.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGrantAccess(user: AdminUser) {
    if (!selectedCourseId) {
      setError('Wybierz kurs przed nadaniem dostepu.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const enrollment = await grantCourseAccess(user.id, selectedCourseId, token)
      setSelectedUserId(null)
      setSuccess(`Dostep do kursu "${enrollment.course.title}" zostal nadany uzytkownikowi ${getDisplayName(user)}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie nadac dostepu.')
    } finally {
      setLoading(false)
    }
  }

  function startGrantAccess(userId: string) {
    setError('')
    setSuccess('')
    setSelectedUserId(userId)
    setSelectedCourseId(courses[0]?.id ?? '')
  }

  return (
    <section className="admin-page">
      <div className="admin-heading-row">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Uzytkownicy</h2>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate('/admin/courses')}>
          Wroc do kursow
        </button>
      </div>

      {error && <div className="alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <section className="dashboard-stats">
        <article>
          <span>Wszyscy</span>
          <strong>{users.length}</strong>
        </article>
        <article>
          <span>Studenci</span>
          <strong>{studentUsers.length}</strong>
        </article>
        <article>
          <span>Admini</span>
          <strong>{adminUsers.length}</strong>
        </article>
      </section>

      {loading && users.length === 0 ? (
        <p className="muted">Ladowanie uzytkownikow...</p>
      ) : users.length === 0 ? (
        <p className="muted">Nie ma jeszcze uzytkownikow.</p>
      ) : (
        <div className="admin-table">
          {users.map((user) => (
            <article className="admin-course-row" key={user.id}>
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

                {selectedUserId === user.id && (
                  <div className="grant-access-panel">
                    <label>
                      Kurs
                      <select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)}>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="form-actions">
                      <button type="button" className="secondary-button" onClick={() => setSelectedUserId(null)}>
                        Anuluj
                      </button>
                      <button type="button" disabled={loading || !selectedCourseId} onClick={() => void handleGrantAccess(user)}>
                        Nadaj dostep
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-row-actions">
                {user.role === 'ROLE_STUDENT' && (
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={loading || courses.length === 0}
                    onClick={() => startGrantAccess(user.id)}
                  >
                    Nadaj dostep
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function getDisplayName(user: AdminUser) {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return name || user.username || user.email
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
