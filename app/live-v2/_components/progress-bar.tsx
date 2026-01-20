import { ProjectStatus, STATUS_CONFIG } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PROGRESS_GRADIENTS } from "./project-card";

interface ProgressBarProps {
    status: ProjectStatus;
    progress: number;
    size?: "normal" | "small";
}

export function ProgressBar({ status, progress, size = "normal" }: ProgressBarProps) {
    const config = STATUS_CONFIG[status];
    const heightClass = size === "small" ? "h-2" : "h-2.5";
    const textSize = size === "small" ? "text-xs" : "text-sm";

    return (
        <div className={size === "small" ? "" : "space-y-1.5"}>
            <div className={cn("flex items-center justify-between", textSize, size === "small" && "mb-1.5")}>
                <span className="text-slate-400">{size === "small" ? "Progress Rata-rata" : "Progress"}</span>
                <span className={cn("font-semibold", config.color, size === "normal" && "font-bold text-base")}>
                    {progress}%
                </span>
            </div>
            <div className={cn("w-full bg-slate-900/50 rounded-full overflow-hidden", heightClass)}>
                <div
                    className={cn("h-full transition-all duration-500 rounded-full", PROGRESS_GRADIENTS[status])}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
