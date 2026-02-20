import { cn } from "@/lib/utils";
import type { MilestoneDetail } from "@/types/project";
import type { ProjectStatus } from "@/types/project";
import { MarqueeText } from "./marquee-text";

interface CategoryCardsProps {
    data: MilestoneDetail[];
    episodeId?: number;
    compact?: boolean;
    isLightMode?: boolean;
    cardStatus?: ProjectStatus;
}

// Mapping status card ke phase_category
const STATUS_TO_PHASE: Record<ProjectStatus, string | null> = {
    "pre-produksi": "Pre-Production",
    "shooting": "Production",
    "editing": "Post-Production",
    "selesai": null, // tampilkan semua
    "payment": null, // tampilkan semua
};

// Badge colors berdasarkan card status (untuk In Progress)
const CARD_STATUS_COLORS = {
    "pre-produksi": {
        darkBadge: "bg-pink-500/20 text-pink-300 border-pink-500/40",
        lightBadge: "bg-pink-100 text-pink-700 border-pink-400",
    },
    "shooting": {
        darkBadge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        lightBadge: "bg-purple-100 text-purple-700 border-purple-400",
    },
    "editing": {
        darkBadge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        lightBadge: "bg-blue-100 text-blue-700 border-blue-400",
    },
    "selesai": {
        darkBadge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        lightBadge: "bg-emerald-100 text-emerald-700 border-emerald-400",
    },
    "payment": {
        darkBadge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        lightBadge: "bg-amber-100 text-amber-700 border-amber-400",
    },
} as const;

// badge color dari workstatus cik :v
const getWorkStatusBadge = (workStatus: string, cardStatus: ProjectStatus, isLightMode: boolean) => {
    const cardColors = CARD_STATUS_COLORS[cardStatus];

    switch (workStatus) {
        case "In Progress":
            return isLightMode ? cardColors.lightBadge : cardColors.darkBadge;
        case "Pending":
            // Abu-abu
            return isLightMode
                ? "bg-gray-100 text-gray-700 border-gray-400"
                : "bg-gray-500/20 text-gray-300 border-gray-500/40";
        case "Waiting Approval":
            // Kuning
            return isLightMode
                ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
        case "Done":
            // Hijau
            return isLightMode
                ? "bg-emerald-100 text-emerald-700 border-emerald-400"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
        default:
            return isLightMode ? cardColors.lightBadge : cardColors.darkBadge;
    }
};

export default function CategoryCards({ data, episodeId, compact = false, isLightMode = false, cardStatus }: CategoryCardsProps) {
    // Filter by episode if provided
    let filteredData = episodeId
        ? data.filter(m => m.episode_id === episodeId)
        : data;

    // Filter by card status (phase category) if provided
    if (cardStatus) {
        const targetPhase = STATUS_TO_PHASE[cardStatus];
        if (targetPhase) {
            filteredData = filteredData.filter(m => m.phase_category === targetPhase);
        }
    }

    if (filteredData.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {filteredData.map((member) => {
                const isPaid = member.payment_status === "Paid";
                const badgeColor = getWorkStatusBadge(member.work_status, cardStatus || "shooting", isLightMode);

                return (
                    <div
                        key={member.id}
                        className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold text-xs transition-all hover:scale-105 min-w-37.5",
                            badgeColor
                        )}
                    >
                        <MarqueeText
                            userName={member.user.name}
                            taskName={member.task_name}
                            className="flex-1"
                        />
                        {!compact && isPaid && <span className="text-[10px] ml-1">💰</span>}
                    </div>
                );
            })}
        </div>
    );
}
