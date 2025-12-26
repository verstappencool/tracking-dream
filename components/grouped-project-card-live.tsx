"use client";

import { useState } from "react";
import { TVProject, STATUS_CONFIG } from "@/lib/types";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface GroupedProjectCardLiveProps {
  title: string;
  projects: TVProject[];
  groupIndex?: number;
}

export function GroupedProjectCardLive({ title, projects, groupIndex = 0 }: GroupedProjectCardLiveProps) {
  // Always expanded untuk semua kategori (shooting, editing, selesai, g drive/kirim)
  const [isExpanded, setIsExpanded] = useState(true);

  // Ambil project pertama untuk info utama
  const mainProject = projects[0];
  const episodeCount = projects.length;
  const config = STATUS_CONFIG[mainProject.status];

  // Hitung total progress rata-rata
  const avgProgress = Math.round(
    projects.reduce((sum, p) => sum + getCurrentStageProgress(p), 0) / projects.length
  );

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      {/* Header Card - Induk */}
      <div
        className={cn(
          "cursor-pointer p-3 rounded-t-lg",
          "hover:bg-slate-750 transition-all",
          isExpanded && "border-b border-slate-700"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-2">
          <button className="mt-0.5">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">#{groupIndex + 1}</span>
              <h3 className="font-medium text-white text-sm">
                {title}
              </h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                {episodeCount} ep
              </span>
            </div>

            {mainProject.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {mainProject.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              {mainProject.channel && <span>📺 {mainProject.channel}</span>}
              {mainProject.airTime && <span>⏰ {mainProject.airTime}</span>}
            </div>

            {/* Progress rata-rata */}
            <div className="mt-2">
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    mainProject.status === "shooting" && "bg-purple-500",
                    mainProject.status === "editing" && "bg-blue-500",
                    mainProject.status === "selesai" && "bg-emerald-500",
                    mainProject.status === "kirim" && "bg-amber-500"
                  )}
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Rata-rata: {avgProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Episode List - Expanded */}
      {isExpanded && (
        <div className="bg-slate-900/30 p-2 space-y-1">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-slate-800 rounded-lg p-2 border border-slate-700/50"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">#{index + 1}</span>
                    <span className="text-xs font-mono text-slate-500">Ep {project.episode}</span>
                    {project.subtitle && (
                      <p className="text-xs text-blue-400 font-medium flex-1 truncate">
                        {project.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Editor dan Team */}
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    {project.editor && (
                      <span className="text-purple-400">✂️ {project.editor}</span>
                    )}
                    {project.assignedTo && (
                      <span className="text-slate-500">👥 {project.assignedTo}</span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-1.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className={cn("font-medium", config.color)}>
                        {getCurrentStageProgress(project)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-500 rounded-full",
                          project.status === "shooting" && "bg-purple-500",
                          project.status === "editing" && "bg-blue-500",
                          project.status === "selesai" && "bg-emerald-500",
                          project.status === "kirim" && "bg-amber-500"
                        )}
                        style={{ width: `${getCurrentStageProgress(project)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-700/50 flex justify-between">
                {project.status === "kirim" && (
                  <span className="text-xs text-amber-400">✓ Sent</span>
                )}
                {project.status === "selesai" && (
                  <span className="text-xs text-emerald-400">✓ Done</span>
                )}
              </div>

              {/* Notes */}
              {project.notes && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 italic line-clamp-2">
                    {project.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
