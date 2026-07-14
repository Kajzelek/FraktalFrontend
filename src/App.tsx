import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { getMe, login } from './api/authApi'
import { getCourseCatalog, getCourseContent } from './api/courseApi'
import { completeLesson, getLessonPlayer } from './api/lessonApi'
import { AppHeader } from './components/AppHeader'
import { CourseDetail } from './components/CourseDetail'
import { CourseList } from './components/CourseList'
import { LessonPlayerView } from './components/LessonPlayerView'
import { LoginPanel } from './components/LoginPanel'
import type { LoginForm } from './types/auth'
import type { Course, CourseContent } from './types/course'
import type { LessonPlayer } from './types/lesson'
import type { UserProfile } from './types/user'
import './App.css'

const TOKEN_STORAGE_KEY = 'fraktal.authToken'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) ?? '')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseContent | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<LessonPlayer | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => new Set())
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: 'student@fraktal.pl',
    password: 'Student123!',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAuthenticated = Boolean(token)

  useEffect(() => {
    if (!token) {
      clearSessionState()
      return
    }

    void loadInitialData(token)
  }, [token])

  async function loadInitialData(authToken: string) {
    setLoading(true)
    setError('')

    try {
      const [profile, courseList] = await Promise.all([getMe(authToken), getCourseCatalog(authToken)])

      setUser(profile)
      setCourses(courseList)
      setSelectedCourse(null)
      setSelectedLesson(null)
      setCompletedLessonIds(new Set())
    } catch (err) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setToken('')
      setError(err instanceof Error ? err.message : 'Sesja wygasla. Zaloguj sie ponownie.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const auth = await login(loginForm)
      localStorage.setItem(TOKEN_STORAGE_KEY, auth.token)
      setToken(auth.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zalogowac.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken('')
    clearSessionState()
  }

  async function openCourse(courseId: string) {
    setLoading(true)
    setError('')

    try {
      const content = await getCourseContent(courseId, token)
      setSelectedCourse(content)
      setSelectedLesson(null)
      setCompletedLessonIds(getCompletedLessonIds(content))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac kursu.')
    } finally {
      setLoading(false)
    }
  }

  function closeCourse() {
    setSelectedCourse(null)
    setSelectedLesson(null)
    setCompletedLessonIds(new Set())
  }

  async function openLesson(lessonId: string | null) {
    if (!lessonId) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const lesson = await getLessonPlayer(lessonId, token)
      setSelectedLesson(lesson)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac lekcji.')
    } finally {
      setLoading(false)
    }
  }

  async function markLessonCompleted() {
    if (!selectedLesson) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const progress = await completeLesson(selectedLesson.lessonId, token)

      if (progress.completed) {
        setCompletedLessonIds((current) => new Set(current).add(progress.lessonId))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zapisac postepu.')
    } finally {
      setLoading(false)
    }
  }

  function clearSessionState() {
    setUser(null)
    setCourses([])
    setSelectedCourse(null)
    setSelectedLesson(null)
    setCompletedLessonIds(new Set())
  }

  return (
    <main className="app-shell">
      <AppHeader user={user} onLogout={handleLogout} />

      {error && <div className="alert">{error}</div>}

      {!isAuthenticated ? (
        <LoginPanel form={loginForm} loading={loading} onFormChange={setLoginForm} onSubmit={handleLogin} />
      ) : selectedLesson ? (
        <LessonPlayerView
          lesson={selectedLesson}
          loading={loading}
          completed={completedLessonIds.has(selectedLesson.lessonId)}
          onBack={() => setSelectedLesson(null)}
          onComplete={() => void markLessonCompleted()}
          onOpenLesson={(lessonId) => void openLesson(lessonId)}
        />
      ) : selectedCourse ? (
        <CourseDetail
          course={selectedCourse}
          loading={loading}
          completedLessonIds={completedLessonIds}
          onBack={closeCourse}
          onOpenLesson={(lessonId) => void openLesson(lessonId)}
        />
      ) : (
        <CourseList courses={courses} loading={loading} onOpenCourse={(courseId) => void openCourse(courseId)} />
      )}
    </main>
  )
}

function getCompletedLessonIds(course: CourseContent) {
  return new Set(
    course.chapters.flatMap((chapter) =>
      chapter.lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id),
    ),
  )
}

export default App
