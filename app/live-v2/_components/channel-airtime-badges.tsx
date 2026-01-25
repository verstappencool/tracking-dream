import { cn } from "@/lib/utils";

interface ChannelAirTimeBadgesProps {
    channel?: string;
    airTime?: string;
    isLightMode?: boolean;
}

export function ChannelAirTimeBadges({ channel, airTime, isLightMode = false }: ChannelAirTimeBadgesProps) {
    if (!channel && !airTime) return null;

    const badgeClass = isLightMode
        ? "text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 font-medium shadow-sm"
        : "text-slate-300 bg-slate-700/50";

    return (
        <div className="flex items-center gap-3 mb-3 flex-wrap">
            {channel && (
                <span className={cn("flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg", badgeClass)}>
                    <span>📺</span> {channel}
                </span>
            )}
            {airTime && (
                <span className={cn("flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg", badgeClass)}>
                    <span>⏰</span> {airTime}
                </span>
            )}
        </div>
    );
}
