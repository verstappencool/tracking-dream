import { STATUS_CONFIG } from "@/lib/types";
import type { ProjectStatus } from "@/types/project";
import { cn } from "@/lib/utils";
import { PROGRESS_GRADIENTS } from "./project-card";

interface ProgressBarProps {
    status: ProjectStatus;
    progress: number;
    size?: "normal" | "small";
    isLightMode?: boolean;
}

export function ProgressBar({ status, progress, size = "normal", isLightMode = false }: ProgressBarProps) {
    const config = STATUS_CONFIG[status];
    const heightClass = size === "small" ? "h-2.5" : "h-3";
    const textSize = size === "small" ? "text-xs font-semibold" : "text-sm font-bold";

    return (
        <div className={size === "small" ? "" : "space-y-1.5"}>
            <div className={cn("flex items-center justify-between", textSize, size === "small" && "mb-1.5")}>
                <span className={isLightMode ? "text-gray-800" : "text-slate-400"}>
                    {size === "small" ? "Progress Rata-rata" : "Progress"}
                </span>
                <span className={cn("font-bold", config.color, size === "normal" && "text-base", isLightMode && "!text-gray-900")}>
                    {progress}%
                </span>
            </div>
            <div className={cn(
                "w-full rounded-full overflow-hidden",
                heightClass,
                isLightMode ? "bg-gray-200 border border-gray-300" : "bg-slate-900/50"
            )}>
                <div
                    className={cn("h-full transition-all duration-500 rounded-full", PROGRESS_GRADIENTS[status])}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
