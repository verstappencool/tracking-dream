"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, User, LoginCredentials } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("auth_token");
            const savedUser = localStorage.getItem("auth_user");

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    // Verify token is still valid
                    await refreshUser();
                } catch (error) {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("auth_user");
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            const response = await authApi.login(credentials);

            if (response.success && response.data) {
                const { token, user } = response.data;

                // Save to localStorage
                localStorage.setItem("auth_token", token);
                localStorage.setItem("auth_user", JSON.stringify(user));

                // Update state
                setUser(user);

                toast.success(response.message || `Selamat Datang, ${user.name}!`);

                // Redirect based on role
                if (user.role === "admin" || user.role === "producer") {
                    router.push("/");
                } else if (user.role === "crew") {
                    router.push("/crew");
                } else if (user.role === "broadcaster") {
                    router.push("/broadcaster");
                } else if (user.role === "investor") {
                    router.push("/investor");
                }
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login gagal. Periksa email dan password Anda.";
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Ignore error, just log out locally
        } finally {
            // Clear localStorage
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");

            // Clear state
            setUser(null);

            toast.success("Anda telah logout");
            router.push("/login");
        }
    };

    const refreshUser = async () => {
        try {
            const response = await authApi.me();
            if (response.success && response.data) {
                setUser(response.data);
                localStorage.setItem("auth_user", JSON.stringify(response.data));
            }
        } catch (error) {
            // Token invalid, clear auth
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            setUser(null);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
