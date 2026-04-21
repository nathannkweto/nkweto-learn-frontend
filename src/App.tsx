import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TopicDetails } from './pages/teacher/TopicDetails';
import { QuizBuilder } from './pages/teacher/QuizBuilder';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentTopicDetails } from './pages/student/StudentTopicDetails';
import { TakeQuiz } from './pages/student/TakeQuiz';
import { PageEditor } from "./pages/teacher/PageEditor.tsx";
import { CreatePage } from "./pages/teacher/CreatePage.tsx";
import {StudentPageView} from "./pages/student/StudentPageView.tsx";
import {ReviewResponse} from "./pages/teacher/ReviewResponse.tsx";
import {QuizSubmissions} from "./pages/teacher/QuizSubmissions.tsx";

function App() {
  return (
        <AuthProvider>
          <CssBaseline />
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/topics/:topicId" element={<TopicDetails />} />
                <Route path="/teacher/topics/:topicId/create-quiz" element={<QuizBuilder />} />
                <Route path="/teacher/quizzes/quizId/submissions" element={<QuizSubmissions />} />
                <Route path="/teacher/submissions/:submissionId" element={<ReviewResponse />} />
                <Route path="/teacher/topics/:topicId/pages/create" element={<CreatePage />} />
                <Route path="/teacher/pages/:pageId/edit" element={<PageEditor />} />
              </Route>

              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/topics/:topicId" element={<StudentTopicDetails />} />
                <Route path="/student/quizzes/:quizId/take" element={<TakeQuiz />} />
                <Route path="/student/topics/:topicId/pages/:pageId" element={<StudentPageView />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
  );
}

export default App;