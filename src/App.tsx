import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute } from './components/AdminRoute'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminCoursesPage } from './pages/AdminCoursesPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CoursesPage } from './pages/CoursesPage'
import { LessonPage } from './pages/LessonPage'
import { LoginPage } from './pages/LoginPage'
import { MockPaymentPage } from './pages/MockPaymentPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/payment/mock" element={<MockPaymentPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Route>
    </Routes>
  )
}

export default App
