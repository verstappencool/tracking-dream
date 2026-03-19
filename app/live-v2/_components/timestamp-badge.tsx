import { cn } from "@/lib/utils";

interface TimestampBadgeProps {
    date: string;
    time: string;
    isLightMode?: boolean;
}

export function TimestampBadge({ date, time, isLightMode = false }: TimestampBadgeProps) {
    const badgeClass = isLightMode
        ? "text-gray-700 bg-white border border-gray-300 font-medium"
        : "text-slate-500 bg-slate-700/50";

    return (
        <>
            <span className={cn("text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5", badgeClass)}>
                <span>📅</span> {date}
            </span>
            <span className={cn("text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5", badgeClass)}>
                <span>🕐</span> {time}
            </span>
        </>
    );
}
