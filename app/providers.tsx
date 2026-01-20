"use client";

import { AuthProvider } from "@/lib/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
        </AuthProvider>
    );
}
