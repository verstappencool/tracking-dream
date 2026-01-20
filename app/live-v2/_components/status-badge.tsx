import { ProjectStatus } from "@/lib/types";

interface StatusBadgeProps {
    status: ProjectStatus;
    isPaid?: boolean;
}

export function StatusBadge({ status, isPaid }: StatusBadgeProps) {
    if (status === "payment") {
        return isPaid ? (
            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                ✅ Paid
            </span>
        ) : (
            <span className="text-sm font-medium text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                ⏳ Unpaid
            </span>
        );
    }

    if (status === "selesai") {
        return (
            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                ✓ Selesai
            </span>
        );
    }

    return null;
}
