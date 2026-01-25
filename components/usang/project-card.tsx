"use client";

import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/types";
import type { TVProject } from "@/types/project";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressTracker } from "./progress-tracker";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import { Calendar, Users, Film, Clock, Eye } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: TVProject;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusConfig = STATUS_CONFIG[project.status];
  const priorityConfig = PRIORITY_CONFIG[project.priority];

  const dueDate = new Date(project.dueDate);
  const today = new Date();
  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;
  const isUrgent = daysLeft <= 3 && daysLeft >= 0;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4",
        statusConfig.borderColor,
        "bg-white"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-xs text-blue-600 font-medium mt-0.5">
                {project.subtitle}
              </p>
            )}
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {project.description}
            </p>
          </div>
          <Badge className={cn("shrink-0", priorityConfig.bgColor, priorityConfig.color, "border-0")}>
            {priorityConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Tracker Mini */}
        <ProgressTracker project={project} size="sm" />

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span className="font-medium">{getCurrentStageProgress(project)}%</span>
          </div>
          <Progress value={getCurrentStageProgress(project)} className="h-2" />
        </div>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Film className="w-3 h-3" />
            <span>{project.genre}</span>
          </div>
          {project.episode && (
            <div className="flex items-center gap-1">
              <span>Ep {project.episode}</span>
              {project.season && <span>S{project.season}</span>}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{project.assignedTo}</span>
          </div>
          {project.editor && (
            <div className="flex items-center gap-1 text-purple-600 font-medium">
              <span>✂️ {project.editor}</span>
            </div>
          )}
        </div>

        {/* Due Date */}
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium",
          isOverdue && "text-red-600",
          isUrgent && "text-amber-600",
          !isOverdue && !isUrgent && "text-gray-500"
        )}>
          {isOverdue ? (
            <Clock className="w-3 h-3" />
          ) : (
            <Calendar className="w-3 h-3" />
          )}
          <span>
            {isOverdue
              ? `Terlambat ${Math.abs(daysLeft)} hari`
              : isUrgent
                ? `${daysLeft} hari lagi`
                : new Date(project.dueDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })
            }
          </span>
        </div>

        {/* View Tracking Button */}
        <Link href={`/tracking/${project.id}`} onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Eye className="w-3 h-3" />
            Lihat Tracking
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
