import { STATUS_CONFIG } from "@/lib/types";
import type { TVProject, ProjectStatus } from "@/types/project";
import { cn, getCurrentStageProgress, STATUS_TO_PHASE } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/time";
import { TimestampBadge } from "./timestamp-badge";
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
    "pre-produksi": "from-pink-50/90 to-pink-100/90 border-2 border-pink-300",
    shooting: "from-purple-50/90 to-purple-100/90 border-2 border-purple-300",
    editing: "from-blue-50/90 to-blue-100/90 border-2 border-blue-300",
    selesai: "from-emerald-50/90 to-emerald-100/90 border-2 border-emerald-300",
    payment: "from-amber-50/90 to-amber-100/90 border-2 border-amber-300",
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
    "pre-produksi": "bg-linear-to-r from-pink-500 to-pink-400",
    shooting: "bg-linear-to-r from-purple-500 to-purple-400",
    editing: "bg-linear-to-r from-blue-500 to-blue-400",
    selesai: "bg-linear-to-r from-emerald-500 to-emerald-400",
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

    const { milestones } = useMilestones(project.projectId, 30000);
    const progress = getCurrentStageProgress(project, milestones);

    // "Master ready": semua milestone yang relevan untuk episode/fase ini sudah Done
    const targetPhase = STATUS_TO_PHASE[project.status];
    const relevantMilestones = milestones.filter(
        (m) =>
            (!project.episodeId || m.episode_id === project.episodeId) &&
            (!targetPhase || m.phase_category === targetPhase)
    );
    const masterReady =
        relevantMilestones.length > 0 &&
        relevantMilestones.every((m) => m.work_status === "Done");

    const gradients = isLightMode ? STATUS_GRADIENTS_LIGHT : STATUS_GRADIENTS;
    const accents = isLightMode ? STATUS_ACCENTS_LIGHT : STATUS_ACCENTS;

    // Accent line color per status (left border strip)
    const accentLine: Record<ProjectStatus, string> = {
        "pre-produksi": "bg-pink-500",
        shooting: "bg-purple-500",
        editing: "bg-blue-500",
        selesai: "bg-emerald-500",
        payment: "bg-amber-500",
    };

    return (
        <div className={cn(
            "rounded-xl overflow-hidden border transition-all flex",
            "bg-linear-to-br",
            gradients[project.status],
            // Hapus backdrop-blur dan shadow yang memberatkan rendering GPU
            isLightMode ? "" : "hover:brightness-110"
        )}>
            {/* Left accent strip */}
            <div className={cn("w-1 shrink-0 rounded-l-xl", accentLine[project.status])} />

            <div className="flex-1 p-4 min-w-0">

                {/* ── TOP META BAR: project name as context label ── */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider shrink-0",
                        accents[project.status]
                    )}>
                        #{groupIndex + 1}
                    </span>

                    {/* Project type badge */}
                    {project.genre && (
                        <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded border shrink-0 uppercase tracking-wide",
                            project.genre === "Movie"
                                ? isLightMode
                                    ? "bg-amber-100 text-amber-700 border-amber-300"
                                    : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                : project.genre === "Series"
                                    ? isLightMode
                                        ? "bg-violet-100 text-violet-700 border-violet-300"
                                        : "bg-violet-500/15 text-violet-300 border-violet-500/30"
                                    : /* TVC */
                                    isLightMode
                                        ? "bg-cyan-100 text-cyan-700 border-cyan-300"
                                        : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                        )}>
                            {project.genre === "Movie" ? "🎬" : project.genre === "Series" ? "🎞️" : "📡"} {project.genre}
                        </span>
                    )}

                    {/* Episode number badge — hanya untuk Series */}
                    {project.genre === "Series" && project.episode && (
                        <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded border shrink-0",
                            isLightMode
                                ? "bg-slate-100 text-slate-600 border-slate-300"
                                : "bg-slate-700/50 text-slate-300 border-slate-600/50"
                        )}>
                            Eps {project.episode}
                        </span>
                    )}

                    <span className={cn(
                        "text-sm font-semibold uppercase tracking-wide truncate",
                        isLightMode ? "text-gray-500" : "text-slate-400"
                    )}>
                        {project.title}
                    </span>
                    {/* Channel badge inline */}
                    {project.channel && (
                        <span className={cn(
                            "ml-auto text-xs font-bold px-2.5 py-1 rounded border shrink-0",
                            isLightMode
                                ? "bg-gray-100 text-gray-600 border-gray-300"
                                : "bg-slate-700/60 text-slate-300 border-slate-600/50"
                        )}>
                            📺 {project.channel}
                        </span>
                    )}
                </div>

                {/* ── HERO: Episode Title ── */}
                {project.subtitle ? (
                    <h3 className={cn(
                        "text-2xl font-black leading-tight mb-2 tracking-tight",
                        isLightMode ? "text-gray-950" : "text-white"
                    )}>
                        {project.subtitle}
                    </h3>
                ) : (
                    // Fallback bila tidak ada episode title: tampilkan project title besar
                    <h3 className={cn(
                        "text-2xl font-black leading-tight mb-2 tracking-tight uppercase",
                        isLightMode ? "text-gray-950" : "text-white"
                    )}>
                        {project.title}
                    </h3>
                )}

                {/* Description */}
                {project.description && (
                    <p className={cn(
                        "text-sm mb-3 line-clamp-2 leading-relaxed",
                        isLightMode ? "text-gray-500" : "text-slate-400"
                    )}>
                        {project.description}
                    </p>
                )}

                {/* Timestamp */}
                {createdDate && (
                    <div className="flex items-center gap-2 mb-3">
                        <TimestampBadge date={formatDate(createdDate)} time={formatTime(createdDate)} isLightMode={isLightMode} />
                    </div>
                )}

                {/* Progress Bar */}
                {project.status !== "payment" && (
                    <ProgressBar status={project.status} progress={progress} isLightMode={isLightMode} />
                )}

                {/* ── CREW section ── */}
                {!masterReady && milestones.length > 0 && project.episodeId && (
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

                {/* Status Badge */}
                {milestones.length > 0 && (
                    <div className="flex justify-end mt-2">
                        <StatusBadge status={project.status} isPaid={project.isPaid} isLightMode={isLightMode} milestones={milestones} episodeId={project.episodeId} />
                    </div>
                )}

                {/* Notes */}
                {project.notes && (
                    <div className={cn(
                        "mt-3 pt-3 border-t",
                        isLightMode ? "border-gray-200" : "border-slate-700/50"
                    )}>
                        <p className={cn(
                            "text-xs italic line-clamp-2",
                            isLightMode ? "text-gray-500" : "text-slate-400"
                        )}>
                            💬 {project.notes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
