import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from "./layouts/AppLayout.tsx";

// Public Pages
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';

// Unified Main Nav Pages
import { HomePage } from './features/dashboard/HomePage.tsx'; // Merged from Teacher/Student Dashboard
import {LessonScreen} from "./features/lessons/LessonScreen.tsx";
import {ProgramsPage} from "./features/programs/ProgramsPage.tsx";
import {ProgramDetail} from "./features/programs/ProgramDetailPage.tsx";
import {PageDetail} from "./features/pages/PageDetail.tsx";
import {ProjectPage} from "./features/projects/ProjectPage.tsx";

function App() {
  return (
      <AuthProvider>
        <CssBaseline />
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Accessible by ANY logged-in user */}
            {/* Note: Update ProtectedRoute to allow both roles, or remove the allowedRoles prop entirely if it just checks auth */}
            <Route element={<ProtectedRoute allowedRoles={['teacher', 'student']} />}>
              <Route element={<AppLayout />}>

                {/* Main Navigation Routes */}
                <Route path="/" element={<HomePage />} />
                  <Route path="/programs" element={<ProgramsPage />} />
                  <Route path="/programs/:programId" element={<ProgramDetail />} />

                  {/* Deep links from your navigate() functions */}
                <Route path="/lessons/:lessonId" element={<LessonScreen />} />
                <Route path="/lessons/:lessonId/pages" element={<PageDetail />} />


                  <Route path="/projects/:projectId" element={<ProjectPage />} />
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
  );
}

export default App;