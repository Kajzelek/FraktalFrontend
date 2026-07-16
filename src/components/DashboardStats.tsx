type DashboardStatsProps = {
  enrolledCoursesCount: number
  completedLessons: number
  allLessons: number
  averageProgress: number
}

export function DashboardStats({
  enrolledCoursesCount,
  completedLessons,
  allLessons,
  averageProgress,
}: DashboardStatsProps) {
  return (
    <section className="dashboard-stats">
      <article>
        <span>Moje kursy</span>
        <strong>{enrolledCoursesCount}</strong>
      </article>
      <article>
        <span>Ukonczone lekcje</span>
        <strong>
          {completedLessons}/{allLessons}
        </strong>
      </article>
      <article>
        <span>Sredni postep</span>
        <strong>{averageProgress}%</strong>
      </article>
    </section>
  )
}
