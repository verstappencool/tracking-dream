import { cn, STATUS_TO_PHASE } from "@/lib/utils";
import type { MilestoneDetail } from "@/types/project";
import type { ProjectStatus } from "@/types/project";

interface CategoryCardsProps {
    data: MilestoneDetail[];
    episodeId?: number;
    compact?: boolean;
    isLightMode?: boolean;
    cardStatus?: ProjectStatus;
}

// Work status styling config
const WORK_STATUS_CONFIG = {
    "In Progress": {
        dot: "bg-blue-400 animate-pulse",
        darkBg: "bg-blue-500/10 border-blue-500/25",
        lightBg: "bg-blue-50 border-blue-200",
        darkAvatar: "bg-blue-500/25 text-blue-200 ring-1 ring-blue-400/50",
        lightAvatar: "bg-blue-100 text-blue-700 ring-1 ring-blue-400",
        darkLabel: "text-blue-300 bg-blue-500/15 border-blue-500/30",
        lightLabel: "text-blue-700 bg-blue-100 border-blue-300",
        labelText: "Berlangsung",
    },
    "Pending": {
        dot: "bg-slate-400",
        darkBg: "bg-slate-700/20 border-slate-600/20",
        lightBg: "bg-gray-50 border-gray-200",
        darkAvatar: "bg-slate-600/35 text-slate-300 ring-1 ring-slate-500/40",
        lightAvatar: "bg-gray-100 text-gray-600 ring-1 ring-gray-300",
        darkLabel: "text-slate-400 bg-slate-600/25 border-slate-500/30",
        lightLabel: "text-gray-600 bg-gray-100 border-gray-300",
        labelText: "Pending",
    },
    "Waiting Approval": {
        dot: "bg-yellow-400 animate-pulse",
        darkBg: "bg-yellow-500/10 border-yellow-500/25",
        lightBg: "bg-yellow-50 border-yellow-200",
        darkAvatar: "bg-yellow-500/25 text-yellow-200 ring-1 ring-yellow-400/50",
        lightAvatar: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-400",
        darkLabel: "text-yellow-300 bg-yellow-500/15 border-yellow-500/30",
        lightLabel: "text-yellow-700 bg-yellow-50 border-yellow-300",
        labelText: "Review",
    },
    "Done": {
        dot: "bg-emerald-400",
        darkBg: "bg-emerald-500/8 border-emerald-500/20",
        lightBg: "bg-emerald-50 border-emerald-200",
        darkAvatar: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40",
        lightAvatar: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400",
        darkLabel: "text-emerald-300 bg-emerald-500/15 border-emerald-500/25",
        lightLabel: "text-emerald-700 bg-emerald-50 border-emerald-300",
        labelText: "Selesai",
    },
} as const;

// Role yang relevan per status kolom kanban (null = tampilkan semua role)
const ROLE_FOR_STATUS: Partial<Record<ProjectStatus, string[] | null>> = {
    "pre-produksi": null, // semua role ditampilkan
    "shooting": ["crew"],
    "editing": ["crew"],
    "selesai": ["crew"],
    "payment": ["crew"],
};

// Sort order: active work first
const STATUS_ORDER = ["In Progress", "Waiting Approval", "Pending", "Done"];

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function CategoryCards({ data, episodeId, compact = false, isLightMode = false, cardStatus }: CategoryCardsProps) {
    // Filter by episode
    let filteredData = episodeId
        ? data.filter((m) => m.episode_id === episodeId)
        : data;

    // Filter by phase category from card status
    // pre-produksi: skip filter phase, tampilkan semua milestone episode (semua role)
    if (cardStatus && cardStatus !== "pre-produksi") {
        const targetPhase = STATUS_TO_PHASE[cardStatus];
        if (targetPhase) {
            filteredData = filteredData.filter((m) => m.phase_category === targetPhase);
        }
    }

    // Filter berdasarkan role user sesuai kolom status
    if (cardStatus) {
        const allowedRoles = ROLE_FOR_STATUS[cardStatus];
        // null = tampilkan semua, array = filter by role
        if (allowedRoles !== undefined && allowedRoles !== null && allowedRoles.length > 0) {
            filteredData = filteredData.filter(
                (m) => !m.user.role || allowedRoles.includes(m.user.role)
            );
        }
    }

    // Di PREVIEW, hanya tampilkan yang masih aktif (sembunyikan yang sudah Done)
    if (cardStatus === "selesai") {
        filteredData = filteredData.filter(
            (m) => m.work_status === "In Progress" || m.work_status === "Waiting Approval"
        );
    }

    if (filteredData.length === 0) return null;

    // Sort by work status priority
    const sorted = [...filteredData].sort((a, b) => {
        const ai = STATUS_ORDER.indexOf(a.work_status);
        const bi = STATUS_ORDER.indexOf(b.work_status);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    return (
        <div className="space-y-1.5">
            {sorted.map((member) => {
                const cfg =
                    WORK_STATUS_CONFIG[member.work_status as keyof typeof WORK_STATUS_CONFIG] ??
                    WORK_STATUS_CONFIG["Pending"];
                const isPaid = member.payment_status === "Paid";

                return (
                    <div
                        key={member.id}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg border transition-all",
                            isLightMode ? cfg.lightBg : cfg.darkBg
                        )}
                    >
                        {/* Avatar circle with initials */}
                        <div
                            className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 select-none",
                                isLightMode ? cfg.lightAvatar : cfg.darkAvatar
                            )}
                        >
                            {getInitials(member.user.name)}
                        </div>

                        {/* Name + task */}
                        <div className="flex-1 min-w-0">
                            <p
                                className={cn(
                                    "text-sm font-bold truncate leading-tight",
                                    isLightMode ? "text-gray-900" : "text-white"
                                )}
                            >
                                {member.user.name}
                                {!compact && isPaid && (
                                    <span className="ml-1 text-xs">💰</span>
                                )}
                            </p>
                            <p
                                className={cn(
                                    "text-xs truncate leading-tight mt-0.5",
                                    isLightMode ? "text-gray-500" : "text-slate-400"
                                )}
                            >
                                {member.task_name}
                            </p>
                        </div>

                        {/* Status badge */}
                        <span
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-bold whitespace-nowrap shrink-0",
                                isLightMode ? cfg.lightLabel : cfg.darkLabel
                            )}
                        >
                            <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
                            {cfg.labelText}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
