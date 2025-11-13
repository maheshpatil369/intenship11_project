// File path: src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Mock user data structure (role is key)
const INITIAL_USER_STATE = {
    isAuthenticated: false,
    token: null,
    user: null, 
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(INITIAL_USER_STATE);
    const [isLoading, setIsLoading] = useState(true);

    // Simulated check for initial login (e.g., from localStorage)
    React.useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');
        
        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setAuthState({
                    isAuthenticated: true,
                    token: storedToken,
                    user: user,
                });
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                localStorage.clear();
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token, user) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        setAuthState({
            isAuthenticated: true,
            token,
            user,
        });
    };

    const logout = () => {
        localStorage.clear();
        setAuthState(INITIAL_USER_STATE);
    };

    const contextValue = {
        ...authState,
        isLoading,
        login,
        logout,
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Loading Application...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};