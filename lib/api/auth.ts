import { apiClient, ApiResponse } from "./client";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "producer" | "crew" | "broadcaster" | "investor";
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export const authApi = {

    async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>(
            "/auth/login",
            credentials
        );
        return response.data;
    },


    async me(): Promise<ApiResponse<User>> {
        const response = await apiClient.get<ApiResponse<User>>("/auth/me");
        return response.data;
    },


    async logout(): Promise<ApiResponse> {
        const response = await apiClient.post<ApiResponse>("/auth/logout");
        return response.data;
    },


    async register(userData: {
        name: string;
        email: string;
        password: string;
        role: string;
    }): Promise<ApiResponse<User>> {
        const response = await apiClient.post<ApiResponse<User>>(
            "/auth/register",
            userData
        );
        return response.data;
    },
};
