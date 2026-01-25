interface ChannelAirTimeBadgesProps {
    channel?: string;
    airTime?: string;
}

export function ChannelAirTimeBadges({ channel, airTime }: ChannelAirTimeBadgesProps) {
    if (!channel && !airTime) return null;

    return (
        <div className="flex items-center gap-3 mb-3 flex-wrap">
            {channel && (
                <span className="flex items-center gap-1.5 text-sm text-slate-300 bg-slate-700/50 px-2.5 py-1 rounded-md">
                    <span>📺</span> {channel}
                </span>
            )}
            {airTime && (
                <span className="flex items-center gap-1.5 text-sm text-slate-300 bg-slate-700/50 px-2.5 py-1 rounded-md">
                    <span>⏰</span> {airTime}
                </span>
            )}
        </div>
    );
}
