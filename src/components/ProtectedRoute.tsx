import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    allowedRoles?: ('student' | 'teacher')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    // 1. Not logged in? Send to login page.
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Role restriction check. (If roles are provided and user role doesn't match)
    if (allowedRoles && !allowedRoles.includes(user.role as 'student' | 'teacher')) {
        // Send them to their respective dashboard if they try to access a forbidden page
        return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
    }

    // 3. Authorized! Render the child routes.
    return <Outlet />;
};