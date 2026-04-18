import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react'; // Fix: Explicit type import
import type { User } from '../api/generated/models';
import { setupAxiosInterceptors } from '../api/axiosSetup';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// Export the context so the hook can access it from another file
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Fix: Moved logout ABOVE the useEffect and wrapped in useCallback
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    // Initialize auth state from local storage on first load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        // Set up global Axios interceptors and pass it the logout function
        setupAxiosInterceptors(logout);

        setIsInitializing(false);
    }, [logout]); // Added logout to dependency array

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    if (isInitializing) {
        return null; // Or a MUI <CircularProgress /> to prevent layout shift
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};