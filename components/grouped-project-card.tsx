"use client";

import { useState } from "react";
import { TVProject, STATUS_CONFIG } from "@/lib/types";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupedProjectCardProps {
  title: string;
  projects: TVProject[];
  draggedProject: TVProject | null;
  onDragStart: (e: React.DragEvent, project: TVProject) => void;
  onDragEnd: () => void;
  onEdit: (project: TVProject) => void;
  onMove: (projectId: string, status: any) => void;
  getNextStatus: (status: any) => any;
  getPrevStatus: (status: any) => any;
}

export function GroupedProjectCard({
  title,
  projects,
  draggedProject,
  onDragStart,
  onDragEnd,
  onEdit,
  onMove,
  getNextStatus,
  getPrevStatus
}: GroupedProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Ambil project pertama untuk info utama
  const mainProject = projects[0];
  const episodeCount = projects.length;

  // Hitung total progress rata-rata
  const avgProgress = Math.round(
    projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
  );

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      {/* Header Card - Induk */}
      <div
        className={cn(
          "group cursor-pointer p-3 rounded-t-lg",
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
              {/* {mainProject.editor && <span className="text-purple-400">✂️ {mainProject.editor}</span>} */}
            </div>

            {/* Progress rata-rata */}
            <div className="mt-2">
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
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
        <div className="p-2 space-y-1 bg-slate-900/30">
          {projects.map((project) => {
            const nextStatus = getNextStatus(project.status);
            const prevStatus = getPrevStatus(project.status);

            return (
              <div
                key={project.id}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  onDragStart(e, project);
                }}
                onDragEnd={onDragEnd}
                className={cn(
                  "group bg-slate-800 rounded-lg p-2 cursor-grab active:cursor-grabbing",
                  "border border-slate-700/50 hover:border-slate-600 transition-all",
                  "hover:bg-slate-750",
                  draggedProject?.id === project.id && "opacity-50"
                )}
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-3 h-3 text-slate-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
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
                        <span className={cn("font-medium", STATUS_CONFIG[project.status].color)}>
                          {getCurrentStageProgress(project)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300 rounded-full",
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

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(project);
                    }}
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-3 h-3 text-slate-400 hover:text-white" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-slate-700/50">
                  {prevStatus && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMove(project.id, prevStatus);
                      }}
                      className="h-6 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      {STATUS_CONFIG[prevStatus].label}
                    </Button>
                  )}
                  {nextStatus && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMove(project.id, nextStatus);
                      }}
                      className={cn(
                        "h-6 px-2 text-xs ml-auto",
                        nextStatus === "kirim"
                          ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                          : "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      )}
                    >
                      {STATUS_CONFIG[nextStatus].label}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                  {project.status === "kirim" && (
                    <span className="text-xs text-amber-400 ml-auto">✓ Sent</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
