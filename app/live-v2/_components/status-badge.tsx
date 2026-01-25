import type { ProjectStatus } from "@/types/project";

interface StatusBadgeProps {
    status: ProjectStatus;
    isPaid?: boolean;
    isLightMode?: boolean;
}

export function StatusBadge({ status, isPaid, isLightMode = false }: StatusBadgeProps) {
    if (status === "payment") {
        return isPaid ? (
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isLightMode
                ? "text-emerald-800 bg-emerald-100 border-2 border-emerald-400 shadow-md"
                : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                }`}>
                ✅ Paid
            </span>
        ) : (
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isLightMode
                ? "text-red-800 bg-red-100 border-2 border-red-400 shadow-md"
                : "text-red-400 bg-red-500/10 border border-red-500/30"
                }`}>
                ⏳ Unpaid
            </span>
        );
    }

    if (status === "selesai") {
        return (
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isLightMode
                ? "text-emerald-800 bg-emerald-100 border-2 border-emerald-400 shadow-md"
                : "text-emerald-400 bg-emerald-500/10"
                }`}>
                ✓ Selesai
            </span>
        );
    }

    return null;
}
