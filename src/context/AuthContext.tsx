/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../api/generated/models';
import { setupAxiosInterceptors } from '../api/axiosSetup';
import { getOpenAPIDefinition } from '../api/generated/endpoints';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = getOpenAPIDefinition();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            setupAxiosInterceptors(logout);

            if (storedToken) {
                try {
                    // FIX: Using the exact method name from your error log
                    const response = await api.authMeGet();
                    if (response.data) {
                        setToken(storedToken);
                        setUser(response.data);
                        localStorage.setItem('user', JSON.stringify(response.data));
                    }
                } catch {
                    // FIX: Removed unused 'error' variable
                    console.warn('Token validation failed on startup. Logging out.');
                    logout();
                }
            }

            setIsInitializing(false);
        };

        // FIX: Added 'void' to explicitly ignore the returned promise, satisfying the ESLint rule
        void initializeAuth();
    }, [logout]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    if (isInitializing) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};