import { STATUS_CONFIG } from "@/lib/types";
import type { TVProject, ProjectStatus } from "@/types/project";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/time";
import { TimestampBadge } from "./timestamp-badge";
import { ChannelAirTimeBadges } from "./channel-airtime-badges";
import { ProgressBar } from "./progress-bar";
import { StatusBadge } from "./status-badge";
import { useMilestones } from "@/lib/use-milestones";
import CategoryCards from "./category-cards";


export const STATUS_GRADIENTS: Record<ProjectStatus, string> = {
    "pre-produksi": "from-pink-500/20 to-pink-600/10 border-pink-500/30",
    shooting: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    editing: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    selesai: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    payment: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
};

export const STATUS_GRADIENTS_LIGHT: Record<ProjectStatus, string> = {
    "pre-produksi": "from-pink-50/90 to-pink-100/80 border-2 border-pink-300 backdrop-blur-xl shadow-xl shadow-pink-200/30",
    shooting: "from-purple-50/90 to-purple-100/80 border-2 border-purple-300 backdrop-blur-xl shadow-xl shadow-purple-200/30",
    editing: "from-blue-50/90 to-blue-100/80 border-2 border-blue-300 backdrop-blur-xl shadow-xl shadow-blue-200/30",
    selesai: "from-emerald-50/90 to-emerald-100/80 border-2 border-emerald-300 backdrop-blur-xl shadow-xl shadow-emerald-200/30",
    payment: "from-amber-50/90 to-amber-100/80 border-2 border-amber-300 backdrop-blur-xl shadow-xl shadow-amber-200/30",
};

export const STATUS_ACCENTS: Record<ProjectStatus, string> = {
    "pre-produksi": "bg-pink-500/20 text-pink-300 border-pink-500/40",
    shooting: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    editing: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    selesai: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    payment: "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

export const STATUS_ACCENTS_LIGHT: Record<ProjectStatus, string> = {
    "pre-produksi": "bg-pink-100 text-pink-800 border-2 border-pink-400 font-bold shadow-sm",
    shooting: "bg-purple-100 text-purple-800 border-2 border-purple-400 font-bold shadow-sm",
    editing: "bg-blue-100 text-blue-800 border-2 border-blue-400 font-bold shadow-sm",
    selesai: "bg-emerald-100 text-emerald-800 border-2 border-emerald-400 font-bold shadow-sm",
    payment: "bg-amber-100 text-amber-800 border-2 border-amber-400 font-bold shadow-sm",
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
    isLightMode?: boolean;
}

export function ProjectCard({ project, config, groupIndex, isLightMode = false }: ProjectCardProps) {
    const createdDate = project.createdAt ? new Date(project.createdAt) : null;
    const progress = getCurrentStageProgress(project);

    // Fetch milestones untuk project ini
    const { milestones, loading: milestonesLoading } = useMilestones(project.projectId, 30000);

    const gradients = isLightMode ? STATUS_GRADIENTS_LIGHT : STATUS_GRADIENTS;
    const accents = isLightMode ? STATUS_ACCENTS_LIGHT : STATUS_ACCENTS;

    return (
        <div className={cn(
            "rounded-xl overflow-hidden border transition-all",
            "bg-gradient-to-br",
            gradients[project.status],
            isLightMode ? "hover:shadow-lg" : "backdrop-blur-sm hover:brightness-110"
        )}>
            <div className="p-4">
                {/* Title dengan Tag Badge */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md border", accents[project.status])}>
                        #{groupIndex + 1}
                    </span>
                    <h3 className={cn(
                        "font-extrabold text-lg tracking-wide uppercase flex-1",
                        isLightMode ? "text-gray-950 drop-shadow-sm" : "text-white drop-shadow-sm"
                    )}>
                        {project.title}
                    </h3>
                </div>

                {/* Subtitle / Episode Title */}
                {project.subtitle && (
                    <h4 className={cn(
                        "text-xl font-bold mb-3 tracking-wide",
                        isLightMode ? "text-gray-900" : "text-white"
                    )}>
                        {project.subtitle}
                    </h4>
                )}

                {/* Timestamp */}
                {createdDate && (
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <TimestampBadge date={formatDate(createdDate)} time={formatTime(createdDate)} isLightMode={isLightMode} />
                    </div>
                )}

                {/* Description */}
                {project.description && (
                    <p className={cn(
                        "text-sm mb-3 line-clamp-2 font-medium",
                        isLightMode ? "text-gray-700" : "text-slate-400"
                    )}>
                        {project.description}
                    </p>
                )}

                {/* Channel & Air Time */}
                <ChannelAirTimeBadges channel={project.channel} airTime={project.airTime} isLightMode={isLightMode} />

                {/* Editor */}
                {/* {project.editor && (
                    <div className={cn(
                        "flex items-center gap-1.5 text-sm font-semibold mb-3",
                        isLightMode ? "text-purple-800" : "text-purple-300"
                    )}>
                        <span>✂️</span> {project.editor}
                    </div>
                )} */}

                {/* Progress Bar */}
                {project.status !== "payment" && <ProgressBar status={project.status} progress={progress} isLightMode={isLightMode} />}

                {/* Crew by Phase Category */}
                {milestones.length > 0 && project.episodeId && (
                    <div className={cn(
                        "mt-3 pt-3 border-t",
                        isLightMode ? "border-gray-200" : "border-slate-700/50"
                    )}>
                        <CategoryCards
                            data={milestones}
                            episodeId={project.episodeId}
                            cardStatus={project.status}
                            compact={true}
                            isLightMode={isLightMode}
                        />
                    </div>
                )}

         

                {/* Status Badge (ketika ada milestones) */}
                {milestones.length > 0 && (
                    <div className="flex justify-end mt-2">
                       
                        <StatusBadge status={project.status} isPaid={project.isPaid} isLightMode={isLightMode} />
                    </div>
                )}

                {/* Notes */}
                {project.notes && (
                    <div className={cn(
                        "mt-3 pt-3 border-t",
                        isLightMode ? "border-gray-200" : "border-slate-700/50"
                    )}>
                        <p className={cn(
                            "text-sm italic line-clamp-2",
                            isLightMode ? "text-gray-500" : "text-slate-400"
                        )}>💬 {project.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
