import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// Instance axios khusus TV Dashboard
const TV_KEY = process.env.NEXT_PUBLIC_TV_API_KEY || "drmlght_tv_h8g2k9m4v1p0x_2026";
if (process.env.NODE_ENV !== "production") {
    console.log("TV API Key terdeteksi sebagai:", TV_KEY);
}

export const tvApiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": TV_KEY,
    },
    timeout: 30000,
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
}
