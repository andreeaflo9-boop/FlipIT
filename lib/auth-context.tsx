import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = "flipit_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem(AUTH_KEY).then((raw) => {
            if (raw) {
                try {
                    setUser(JSON.parse(raw));
                } catch {}
            }

            setIsLoading(false);
        });
    }, []);

    const login = async (email: string, password: string) => {
        if (!email || !password) {
            return { success: false, error: "Please complete all fields." };
        }

        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters." };
        }

        const newUser: AuthUser = {
            id: Date.now().toString(),
            name: email.split("@")[0],
            email,
        };

        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
    };

    const register = async (name: string, email: string, password: string) => {
        if (!name || !email || !password) {
            return { success: false, error: "Please complete all fields." };
        }

        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters." };
        }

        const newUser: AuthUser = {
            id: Date.now().toString(),
            name,
            email,
        };

        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
    };

    const logout = async () => {
        await AsyncStorage.removeItem(AUTH_KEY);
        setUser(null);
    };

    const resetPassword = async (email: string) => {
        if (!email) {
            return { success: false, error: "Please enter your email address." };
        }

        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return ctx;
}