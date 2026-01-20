import { TVProject, STATUS_CONFIG, ProjectStatus } from "@/lib/types";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/time";
import { TimestampBadge } from "./timestamp-badge";
import { ChannelAirTimeBadges } from "./channel-airtime-badges";
import { ProgressBar } from "./progress-bar";
import { StatusBadge } from "./status-badge";


export const STATUS_GRADIENTS: Record<ProjectStatus, string> = {
    "pre-produksi": "from-pink-500/20 to-pink-600/10 border-pink-500/30",
    shooting: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    editing: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    selesai: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    payment: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
};

export const STATUS_ACCENTS: Record<ProjectStatus, string> = {
    "pre-produksi": "bg-pink-500/20 text-pink-300 border-pink-500/40",
    shooting: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    editing: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    selesai: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    payment: "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

export const PROGRESS_GRADIENTS: Record<ProjectStatus, string> = {
    "pre-produksi": "bg-gradient-to-r from-pink-500 to-pink-400",
    shooting: "bg-gradient-to-r from-purple-500 to-purple-400",
    editing: "bg-gradient-to-r from-blue-500 to-blue-400",
    selesai: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    payment: "",
};

interface ProjectCardProps {
    project: TVProject;
    config: typeof STATUS_CONFIG[ProjectStatus];
    groupIndex: number;
}

export function ProjectCard({ project, config, groupIndex }: ProjectCardProps) {
    const createdDate = project.createdAt ? new Date(project.createdAt) : null;
    const progress = getCurrentStageProgress(project);

    return (
        <div className={cn(
            "rounded-xl overflow-hidden border transition-all backdrop-blur-sm",
            "bg-gradient-to-br",
            STATUS_GRADIENTS[project.status],
            "hover:brightness-110"
        )}>
            <div className="p-4">
                {/* Title dengan Tag Badge */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md border", STATUS_ACCENTS[project.status])}>
                        #{groupIndex + 1}
                    </span>
                    <h3 className="font-bold text-white text-base tracking-wide uppercase drop-shadow-sm flex-1">
                        {project.title}
                    </h3>
                </div>

                {/* Subtitle / Episode Title */}
                {project.subtitle && (
                    <h4 className="text-lg font-semibold text-white mb-3 tracking-wide">
                        {project.subtitle}
                    </h4>
                )}

                {/* Timestamp */}
                {createdDate && (
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <TimestampBadge date={formatDate(createdDate)} time={formatTime(createdDate)} />
                    </div>
                )}

                {/* Description */}
                {project.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2 font-light">
                        {project.description}
                    </p>
                )}

                {/* Channel & Air Time */}
                <ChannelAirTimeBadges channel={project.channel} airTime={project.airTime} />

                {/* Editor */}
                {project.editor && (
                    <div className="flex items-center gap-1.5 text-sm text-purple-300 mb-3">
                        <span>✂️</span> {project.editor}
                    </div>
                )}

                {/* Progress Bar */}
                {project.status !== "payment" && <ProgressBar status={project.status} progress={progress} />}

                {/* Team & Status */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                    <span className="text-sm text-slate-400 flex items-center gap-1.5">
                        <span>👥</span> {project.assignedTo}
                    </span>
                    <StatusBadge status={project.status} isPaid={project.isPaid} />
                </div>

                {/* Notes */}
                {project.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <p className="text-sm text-slate-400 italic line-clamp-2">💬 {project.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
