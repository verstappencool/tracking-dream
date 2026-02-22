"use client";

import { useState } from "react";
import { STATUS_CONFIG } from "@/lib/types";
import type { TVProject, ProjectStatus } from "@/types/project";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatDate, formatTime } from "@/utils/time";
import {
  STATUS_GRADIENTS,
  STATUS_GRADIENTS_LIGHT,
  STATUS_ACCENTS,
  STATUS_ACCENTS_LIGHT,
  TimestampBadge,
  ProgressBar,
  StatusBadge,
  CategoryCards,
} from "@/app/live-v2/_components";
import { useMilestones } from "@/lib/use-milestones";

interface GroupedProjectCardLiveProps {
  title: string;
  projects: TVProject[];
  groupIndex?: number;
  isLightMode?: boolean;
}

export function GroupedProjectCardLive({ title, projects, groupIndex = 0, isLightMode = false }: GroupedProjectCardLiveProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const mainProject = projects[0];
  const episodeCount = projects.length;
  const config = STATUS_CONFIG[mainProject.status];
  const status = mainProject.status as Exclude<ProjectStatus, "pre-produksi">;

  // Fetch milestones untuk project ini
  const { milestones } = useMilestones(mainProject.projectId, 30000);

  // Hitung average progress dengan mempertimbangkan milestones
  const avgProgress = Math.round(
    projects.reduce((sum, p) => sum + getCurrentStageProgress(p, milestones), 0) / projects.length
  );

  const gradients = isLightMode ? STATUS_GRADIENTS_LIGHT : STATUS_GRADIENTS;
  const accents = isLightMode ? STATUS_ACCENTS_LIGHT : STATUS_ACCENTS;

  return (
    <div className={cn(
      "rounded-xl overflow-hidden transition-colors",
      isLightMode
        ? "bg-white/70 backdrop-blur-xl border-2 border-gray-200 shadow-xl shadow-gray-300/50"
        : "bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm"
    )}>
      {/* Header Card */}
      <div
        className={cn(
          "cursor-pointer p-4 transition-all bg-linear-to-r",
          gradients[status],
          isLightMode ? "hover:shadow-lg" : "hover:brightness-110",
          isExpanded && (isLightMode ? "border-b-2 border-gray-200" : "border-b border-slate-700/50")
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <button className={cn(
            "mt-1 p-1 rounded-md transition-colors",
            isLightMode ? "hover:bg-gray-300" : "hover:bg-white/10"
          )}>
            {isExpanded ? (
              <ChevronDown className={cn("w-6 h-6", isLightMode ? "text-gray-800" : "text-slate-300")} />
            ) : (
              <ChevronRight className={cn("w-6 h-6", isLightMode ? "text-gray-800" : "text-slate-300")} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Project Title */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-sm font-bold px-2.5 py-1 rounded-md border-2", accents[status])}>
                #{groupIndex + 1}
              </span>
              {/* Type badge */}
              {mainProject.genre && (
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide shrink-0",
                  mainProject.genre === "Movie"
                    ? isLightMode ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    : mainProject.genre === "Series"
                      ? isLightMode ? "bg-violet-100 text-violet-700 border-violet-300" : "bg-violet-500/15 text-violet-300 border-violet-500/30"
                      : isLightMode ? "bg-cyan-100 text-cyan-700 border-cyan-300" : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                )}>
                  {mainProject.genre === "Movie" ? "🎬" : mainProject.genre === "Series" ? "🎞️" : "📡"} {mainProject.genre}
                </span>
              )}
              <h3 className={cn(
                "font-extrabold text-lg tracking-wide uppercase",
                isLightMode ? "text-gray-950 drop-shadow-sm" : "text-white drop-shadow-sm"
              )}>
                {title}
              </h3>
              <span className={cn("text-sm font-bold px-2.5 py-1 rounded-full border-2", accents[status])}>
                {episodeCount} {episodeCount === 1 ? 'Episode' : 'Episodes'}
              </span>
            </div>

            {mainProject.description && (
              <p className={cn(
                "text-sm mt-2 line-clamp-1 font-medium",
                isLightMode ? "text-gray-700" : "text-slate-400"
              )}>
                {mainProject.description}
              </p>
            )}

            {/* Channel */}
            {mainProject.channel && (
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold",
                  isLightMode
                    ? "text-gray-900 bg-gray-200 border-2 border-gray-400"
                    : "text-slate-300 bg-slate-700/50"
                )}>
                  <span>📺</span> {mainProject.channel}
                </span>
              </div>
            )}

            {/* Progress rata-rata */}
            {mainProject.status !== "payment" && (
              <div className="mt-3">
                <ProgressBar status={mainProject.status} progress={avgProgress} size="small" isLightMode={isLightMode} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episode List */}
      {isExpanded && (
        <div className={cn(
          "p-3 space-y-2",
          isLightMode ? "bg-gray-50/80 backdrop-blur-md" : "bg-slate-900/40"
        )}>
          {projects.map((project) => {
            const createdDate = project.createdAt ? new Date(project.createdAt) : null;

            return (
              <div
                key={project.id}
                className={cn(
                  "rounded-lg p-3 transition-colors",
                  isLightMode
                    ? "bg-white/90 backdrop-blur-md border-2 border-gray-200 hover:bg-white shadow-md"
                    : "bg-slate-800/90 border border-slate-700/50 hover:bg-slate-800"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Episode Header */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={cn("text-sm font-bold px-2.5 py-1 rounded border-2", accents[status])}>
                        EP {project.episode}
                      </span>
                      {project.subtitle && (
                        <h4 className={cn(
                          "text-xl font-bold tracking-wide flex-1",
                          isLightMode ? "text-gray-950" : "text-white"
                        )}>
                          {project.subtitle}
                        </h4>
                      )}
                    </div>

                    {/* Timestamp */}
                    {createdDate && (
                      <div className="flex items-center gap-2 mb-2">
                        <TimestampBadge date={formatDate(createdDate)} time={formatTime(createdDate)} isLightMode={isLightMode} />
                      </div>
                    )}

                    {/* Editor dan Team */}
                    <div className="flex items-center gap-4 mt-2 text-sm font-semibold">
                      {project.editor && (
                        <span className={cn(
                          "flex items-center gap-1.5",
                          isLightMode ? "text-purple-800" : "text-purple-300"
                        )}>
                          <span>✂️</span> {project.editor}
                        </span>
                      )}
                      {/* {project.assignedTo && (
                        <span className={cn(
                          "flex items-center gap-1.5",
                          isLightMode ? "text-gray-800" : "text-slate-400"
                        )}>
                          <span>👥</span> {project.assignedTo}
                        </span>
                      )} */}
                    </div>

                    {/* Progress Bar */}
                    {project.status !== "payment" && (
                      <div className="mt-3">
                        <ProgressBar status={project.status} progress={getCurrentStageProgress(project, milestones)} isLightMode={isLightMode} />
                      </div>
                    )}

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
                  </div>
                </div>

                {/* Status Badge */}
                {(project.status === "payment" || project.status === "selesai") && (
                  <div className={cn(
                    "mt-3 pt-2 border-t flex justify-end",
                    isLightMode ? "border-gray-200" : "border-slate-700/50"
                  )}>
                    <StatusBadge status={project.status} isPaid={project.isPaid} isLightMode={isLightMode} />
                  </div>
                )}

                {/* Notes */}
                {project.notes && (
                  <div className={cn(
                    "mt-2 pt-2 border-t",
                    isLightMode ? "border-gray-200" : "border-slate-700/50"
                  )}>
                    <p className={cn(
                      "text-sm italic line-clamp-2",
                      isLightMode ? "text-gray-500" : "text-slate-400"
                    )}>
                      💬 {project.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
