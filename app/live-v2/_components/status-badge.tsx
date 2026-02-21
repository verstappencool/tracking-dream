import type { ProjectStatus, MilestoneDetail } from "@/types/project";
import { STATUS_TO_PHASE } from "@/lib/utils";

interface StatusBadgeProps {
    status: ProjectStatus;
    isPaid?: boolean;
    isLightMode?: boolean;
    milestones?: MilestoneDetail[];
    episodeId?: number;
}

export function StatusBadge({ status, isPaid, isLightMode = false, milestones = [], episodeId }: StatusBadgeProps) {
    // Cek apakah ada milestone yang masih belum selesai di fase ini
    const targetPhase = STATUS_TO_PHASE[status];
    const relevantMilestones = milestones.filter(
        (m) =>
            (!targetPhase || m.phase_category === targetPhase) &&
            (!episodeId || m.episode_id === episodeId)
    );
    const hasInProgress = relevantMilestones.some((m) => m.work_status === "In Progress");
    const hasWaitingApproval = !hasInProgress && relevantMilestones.some((m) => m.work_status === "Waiting Approval");

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
        if (hasInProgress) {
            return (
                <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isLightMode
                    ? "text-orange-800 bg-orange-100 border-2 border-orange-400 shadow-md"
                    : "text-orange-400 bg-orange-500/10 border border-orange-500/30"
                    }`}>
                    🔄 Revisi
                </span>
            );
        }
        if (hasWaitingApproval) {
            return (
                <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isLightMode
                    ? "text-yellow-800 bg-yellow-100 border-2 border-yellow-400 shadow-md"
                    : "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30"
                    }`}>
                    ⏳ Waiting Approval
                </span>
            );
        }
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
