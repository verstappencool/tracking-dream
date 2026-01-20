"use client";

import { useState } from "react";
import { TVProject, STATUS_CONFIG, ProjectStatus } from "@/lib/types";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatDate, formatTime } from "@/utils/time";
import {
  STATUS_GRADIENTS,
  STATUS_ACCENTS,
  TimestampBadge,
  ProgressBar,
  StatusBadge,
} from "@/app/live/_components";

interface GroupedProjectCardLiveProps {
  title: string;
  projects: TVProject[];
  groupIndex?: number;
}

// Utility functions
const calculateAvgProgress = (projects: TVProject[]) =>
  Math.round(
    projects.reduce((sum, p) => sum + getCurrentStageProgress(p), 0) / projects.length
  );

export function GroupedProjectCardLive({ title, projects, groupIndex = 0 }: GroupedProjectCardLiveProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const mainProject = projects[0];
  const episodeCount = projects.length;
  const config = STATUS_CONFIG[mainProject.status];
  const avgProgress = calculateAvgProgress(projects);
  const status = mainProject.status as Exclude<ProjectStatus, "pre-produksi">;

  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
      {/* Header Card */}
      <div
        className={cn(
          "cursor-pointer p-4 transition-all bg-gradient-to-r",
          STATUS_GRADIENTS[status],
          "hover:brightness-110",
          isExpanded && "border-b border-slate-700/50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <button className="mt-1 p-1 rounded-md hover:bg-white/10 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-300" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-300" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Project Title */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md border", STATUS_ACCENTS[status])}>
                #{groupIndex + 1}
              </span>
              <h3 className="font-bold text-white text-base tracking-wide uppercase drop-shadow-sm">
                {title}
              </h3>
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", STATUS_ACCENTS[status])}>
                {episodeCount} {episodeCount === 1 ? 'Episode' : 'Episodes'}
              </span>
            </div>

            {mainProject.description && (
              <p className="text-sm text-slate-400 mt-2 line-clamp-1 font-light">
                {mainProject.description}
              </p>
            )}

            {/* Channel */}
            {mainProject.channel && (
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-slate-300 bg-slate-700/50 px-2.5 py-1 rounded-md">
                  <span>📺</span> {mainProject.channel}
                </span>
              </div>
            )}

            {/* Progress rata-rata */}
            {mainProject.status !== "payment" && (
              <div className="mt-3">
                <ProgressBar status={mainProject.status} progress={avgProgress} size="small" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episode List */}
      {isExpanded && (
        <div className="bg-slate-900/40 p-3 space-y-2">
          {projects.map((project) => {
            const createdDate = project.createdAt ? new Date(project.createdAt) : null;

            return (
              <div
                key={project.id}
                className="bg-slate-800/90 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Episode Header */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={cn("text-xs font-bold px-2 py-1 rounded border", STATUS_ACCENTS[status])}>
                        EP {project.episode}
                      </span>
                      {project.subtitle && (
                        <h4 className="text-lg font-semibold text-white tracking-wide flex-1">
                          {project.subtitle}
                        </h4>
                      )}
                    </div>

                    {/* Timestamp */}
                    {createdDate && (
                      <div className="flex items-center gap-2 mb-2">
                        <TimestampBadge date={formatDate(createdDate)} time={formatTime(createdDate)} />
                      </div>
                    )}

                    {/* Editor dan Team */}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      {project.editor && (
                        <span className="flex items-center gap-1.5 text-purple-300">
                          <span>✂️</span> {project.editor}
                        </span>
                      )}
                      {project.assignedTo && (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span>👥</span> {project.assignedTo}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {project.status !== "payment" && (
                      <div className="mt-3">
                        <ProgressBar status={project.status} progress={getCurrentStageProgress(project)} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                {(project.status === "payment" || project.status === "selesai") && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-end">
                    <StatusBadge status={project.status} isPaid={project.isPaid} />
                  </div>
                )}

                {/* Notes */}
                {project.notes && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400 italic line-clamp-2">
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
