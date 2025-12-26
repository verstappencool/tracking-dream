"use client";

import { TVProject, STATUS_CONFIG, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  projects: TVProject[];
  onProjectClick?: (project: TVProject) => void;
}

export function KanbanBoard({ projects, onProjectClick }: KanbanBoardProps) {
  const columns: ProjectStatus[] = ["order", "proses", "selesai"];

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(p => p.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((status) => {
        const config = STATUS_CONFIG[status];
        const columnProjects = getProjectsByStatus(status);

        return (
          <div key={status} className="space-y-4">
            {/* Column Header */}
            <div className={cn(
              "flex items-center gap-3 p-4 rounded-xl",
              config.bgColor,
              "border",
              config.borderColor
            )}>
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h2 className={cn("font-semibold", config.color)}>
                  {config.label}
                </h2>
                <p className="text-sm text-gray-500">
                  {columnProjects.length} project
                </p>
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-4">
              {columnProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed">
                  <p className="text-sm">Tidak ada project</p>
                </div>
              ) : (
                columnProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onProjectClick?.(project)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
