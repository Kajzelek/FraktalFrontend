import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContinueLesson, getCourseCatalog } from '../api/courseApi'
import { useAuth } from '../auth/AuthContext'
import { DashboardCourseRow } from '../components/DashboardCourseRow'
import { DashboardFocusCourse } from '../components/DashboardFocusCourse'
import { DashboardStats } from '../components/DashboardStats'
import type { ContinueLesson, Course } from '../types/course'

export function DashboardPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [continueByCourseId, setContinueByCourseId] = useState<Record<string, ContinueLesson>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadCourses()
  }, [token])

  const enrolledCourses = useMemo(() => courses.filter((course) => course.hasAccess), [courses])
  const availableCourses = useMemo(() => courses.filter((course) => !course.hasAccess), [courses])
  const activeCourse = useMemo(
    () =>
      [...enrolledCourses]
        .filter((course) => {
          const nextLesson = continueByCourseId[course.id]
          return course.lessonsCount > 0 && nextLesson && !nextLesson.locked && nextLesson.lessonId
        })
        .sort((a, b) => b.progressPercent - a.progressPercent)[0] ?? null,
    [continueByCourseId, enrolledCourses],
  )
  const completedLessons = enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0)
  const allLessons = enrolledCourses.reduce((sum, course) => sum + course.lessonsCount, 0)
  const averageProgress = allLessons === 0 ? 0 : Math.round((completedLessons / allLessons) * 100)

  async function loadCourses() {
    setLoading(true)
    setError('')

    try {
      const catalog = await getCourseCatalog(token)
      const enrolled = catalog.filter((course) => course.hasAccess)
      const continueEntries = await Promise.all(
        enrolled.map(async (course) => [course.id, await getContinueLesson(course.id, token)] as const),
      )

      setCourses(catalog)
      setContinueByCourseId(Object.fromEntries(continueEntries))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac dashboardu.')
    } finally {
      setLoading(false)
    }
  }

  function continueCourse(course: Course) {
    const nextLesson = continueByCourseId[course.id]

    if (!nextLesson?.lessonId || nextLesson.locked) {
      navigate(`/courses/${course.id}`)
      return
    }

    navigate(`/lessons/${nextLesson.lessonId}`)
  }

  return (
    <section className="dashboard-page">
      <div className="section-heading">
        <p className="eyebrow">Panel ucznia</p>
        <h2>Czesc{user?.firstName ? `, ${user.firstName}` : ''}</h2>
      </div>

      {error && <div className="alert">{error}</div>}

      <DashboardStats
        enrolledCoursesCount={enrolledCourses.length}
        completedLessons={completedLessons}
        allLessons={allLessons}
        averageProgress={averageProgress}
      />

      {activeCourse && (
        <DashboardFocusCourse
          course={activeCourse}
          description={getContinueDescription(activeCourse, continueByCourseId[activeCourse.id])}
          loading={loading}
          onContinue={continueCourse}
        />
      )}

      <section className="content-grid">
        <div className="section-heading">
          <p className="eyebrow">Kursy</p>
          <h2>Moje kursy</h2>
        </div>

        {loading && courses.length === 0 ? (
          <p className="muted">Ladowanie kursow...</p>
        ) : enrolledCourses.length === 0 ? (
          <p className="muted">Nie masz jeszcze wykupionych kursow.</p>
        ) : (
          <div className="dashboard-course-list">
            {enrolledCourses.map((course) => (
              <DashboardCourseRow
                course={course}
                description={getContinueDescription(course, continueByCourseId[course.id])}
                actionLabel={getContinueButtonLabel(continueByCourseId[course.id])}
                actionDisabled={!canUseCourseAction(course, continueByCourseId[course.id])}
                loading={loading}
                onOpenCourse={(courseId) => navigate(`/courses/${courseId}`)}
                onAction={continueCourse}
                key={course.id}
              />
            ))}
          </div>
        )}
      </section>

      {availableCourses.length > 0 && (
        <section className="content-grid">
          <div className="section-heading">
            <p className="eyebrow">Dostepne</p>
            <h2>Pozostale kursy</h2>
          </div>
          <div className="dashboard-course-list">
            {availableCourses.slice(0, 3).map((course) => (
              <DashboardCourseRow
                course={course}
                onOpenCourse={(courseId) => navigate(`/courses/${courseId}`)}
                key={course.id}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

function canUseCourseAction(course: Course, nextLesson: ContinueLesson | undefined) {
  return course.lessonsCount > 0 && Boolean(nextLesson?.lessonId)
}

function getContinueDescription(course: Course, nextLesson: ContinueLesson | undefined) {
  if (!nextLesson) {
    return 'Sprawdzanie nastepnej lekcji...'
  }

  if (course.lessonsCount === 0 || !nextLesson.lessonId) {
    return 'Kurs nie ma jeszcze lekcji.'
  }

  if (nextLesson.courseCompleted) {
    return 'Kurs ukonczony.'
  }

  if (nextLesson.locked) {
    return `Nastepna lekcja jest zablokowana: ${nextLesson.lessonTitle ?? 'lekcja'}`
  }

  return `Nastepna lekcja: ${nextLesson.lessonTitle ?? 'lekcja'}`
}

function getContinueButtonLabel(nextLesson: ContinueLesson | undefined) {
  if (nextLesson?.courseCompleted) {
    return 'Powtorz'
  }

  if (nextLesson?.locked) {
    return 'Zobacz kurs'
  }

  return 'Kontynuuj'
}
