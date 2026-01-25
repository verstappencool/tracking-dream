interface TimestampBadgeProps {
    date: string;
    time: string;
}

export function TimestampBadge({ date, time }: TimestampBadgeProps) {
    return (
        <>
            <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded flex items-center gap-1.5">
                <span>📅</span> {date}
            </span>
            <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded flex items-center gap-1.5">
                <span>🕐</span> {time}
            </span>
        </>
    );
}
