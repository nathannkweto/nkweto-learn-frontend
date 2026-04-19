import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
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

// Basic MUI Theme (We can expand this later)
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f4f6f8' }
  },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/topics/:topicId" element={<TopicDetails />} />
                <Route path="/teacher/topics/:topicId/create-quiz" element={<QuizBuilder />} />
              </Route>

              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/topics/:topicId" element={<StudentTopicDetails />} />
                <Route path="/student/quizzes/:quizId/take" element={<TakeQuiz />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;