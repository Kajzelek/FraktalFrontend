import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute } from './components/AdminRoute'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminChaptersPage } from './pages/AdminChaptersPage'
import { AdminCourseCreatePage } from './pages/AdminCourseCreatePage'
import { AdminCourseEditPage } from './pages/AdminCourseEditPage'
import { AdminCoursesPage } from './pages/AdminCoursesPage'
import { AdminLessonMaterialsPage } from './pages/AdminLessonMaterialsPage'
import { AdminLessonsPage } from './pages/AdminLessonsPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CoursesPage } from './pages/CoursesPage'
import { DashboardPage } from './pages/DashboardPage'
import { LessonPage } from './pages/LessonPage'
import { LoginPage } from './pages/LoginPage'
import { MockPaymentPage } from './pages/MockPaymentPage'
import { OrdersPage } from './pages/OrdersPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/payment/mock" element={<MockPaymentPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/courses/new" element={<AdminCourseCreatePage />} />
            <Route path="/admin/courses/:courseId/edit" element={<AdminCourseEditPage />} />
            <Route path="/admin/courses/:courseId/chapters" element={<AdminChaptersPage />} />
            <Route path="/admin/courses/:courseId/chapters/:chapterId/lessons" element={<AdminLessonsPage />} />
            <Route
              path="/admin/courses/:courseId/chapters/:chapterId/lessons/:lessonId/materials"
              element={<AdminLessonMaterialsPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
