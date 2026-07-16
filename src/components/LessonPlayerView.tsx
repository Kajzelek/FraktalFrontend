import type { LessonPlayer } from '../types/lesson'

type LessonPlayerViewProps = {
  lesson: LessonPlayer
  loading: boolean
  completed: boolean
  canTrackProgress: boolean
  onBack: () => void
  onComplete: () => void
  onOpenLesson: (lessonId: string | null) => void
}

export function LessonPlayerView({
  lesson,
  loading,
  completed,
  canTrackProgress,
  onBack,
  onComplete,
  onOpenLesson,
}: LessonPlayerViewProps) {
  return (
    <section className="lesson-player">
      <div className="player-toolbar">
        <button type="button" className="secondary-button" onClick={onBack}>
          Wroc do kursu
        </button>
        {canTrackProgress && (
          <button type="button" onClick={onComplete} disabled={loading || completed}>
            {completed ? 'Ukonczona' : 'Oznacz jako ukonczona'}
          </button>
        )}
      </div>

      <section className="player-layout">
        <div className="video-panel">
          {renderVideo(lesson)}
        </div>

        <aside className="lesson-side-panel">
          <p className="eyebrow">Lekcja</p>
          <h2>{lesson.title}</h2>
          <p>{lesson.description}</p>

          <div className="detail-stats">
            <span>{lesson.free ? 'Darmowa' : 'Platna'}</span>
            <span>{lesson.durationMinutes ?? '-'} min</span>
          </div>

          <div className="player-navigation">
            <button
              type="button"
              className="secondary-button"
              disabled={!lesson.previousLessonId || loading}
              onClick={() => onOpenLesson(lesson.previousLessonId)}
            >
              Poprzednia
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={!lesson.nextLessonId || loading}
              onClick={() => onOpenLesson(lesson.nextLessonId)}
            >
              Nastepna
            </button>
          </div>
        </aside>
      </section>

      <section className="materials-panel">
        <div>
          <p className="eyebrow">Materialy</p>
          <h3>PDF i dodatki</h3>
        </div>

        {lesson.primaryPdf?.url || lesson.pdfUrl ? (
          <a className="material-link" href={lesson.primaryPdf?.url ?? lesson.pdfUrl ?? '#'} target="_blank" rel="noreferrer">
            Otworz PDF: {lesson.primaryPdf?.title ?? 'Material lekcji'}
          </a>
        ) : (
          <p className="muted">Ta lekcja nie ma jeszcze PDF.</p>
        )}

        {lesson.materials
          .filter((material) => material.type !== 'VIDEO' && material.type !== 'PDF')
          .map((material) => (
            <a className="material-link" href={material.url ?? '#'} key={material.id} target="_blank" rel="noreferrer">
              {material.title}
            </a>
          ))}
      </section>
    </section>
  )
}

function renderVideo(lesson: LessonPlayer) {
  if (lesson.primaryVideo?.status === 'READY' && lesson.primaryVideo.url) {
    if (lesson.primaryVideo.provider === 'EXTERNAL_URL') {
      return (
        <video controls poster={lesson.primaryVideo.thumbnailUrl ?? undefined}>
          <source src={lesson.primaryVideo.url} />
        </video>
      )
    }

    return <div className="video-placeholder">Cloudflare Stream bedzie podpiete w kolejnym kroku.</div>
  }

  if (lesson.primaryVideo?.status === 'PROCESSING') {
    return <div className="video-placeholder">Wideo jeszcze sie przetwarza.</div>
  }

  if (lesson.primaryVideo?.status === 'FAILED') {
    return <div className="video-placeholder error-state">Nie udalo sie przetworzyc wideo.</div>
  }

  if (lesson.videoUrl) {
    return (
      <video controls>
        <source src={lesson.videoUrl} />
      </video>
    )
  }

  return <div className="video-placeholder">Ta lekcja nie ma jeszcze wideo.</div>
}
