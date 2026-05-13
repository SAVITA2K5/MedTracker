import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStoredUser, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // ── Restore session on mount ──────────────────────────────
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const storedUser = await getStoredUser();
                if (storedUser) {
                    setUser(storedUser);
                }
            } catch (e) {
                console.warn('Session restore error:', e);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    const signIn = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);
    };

    const signOut = async () => {
        await logoutService();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
