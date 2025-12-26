"use client";

import { useState } from "react";
import { TVProject, STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressTracker } from "./progress-tracker";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import {
  Calendar,
  Users,
  Film,
  Clock,
  FileText,
  Tag,
  Tv
} from "lucide-react";

interface ProjectDetailDialogProps {
  project: TVProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  if (!project) return null;

  const statusConfig = STATUS_CONFIG[project.status];
  const priorityConfig = PRIORITY_CONFIG[project.priority];

  const dueDate = new Date(project.dueDate);
  const today = new Date();
  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {project.title}
              </DialogTitle>
              {project.subtitle && (
                <p className="text-sm text-blue-600 font-medium mt-1">
                  {project.subtitle}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
            </div>
            <Badge className={cn("shrink-0", priorityConfig.bgColor, priorityConfig.color, "border-0")}>
              {priorityConfig.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Progress Tracker */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Status Produksi</h3>
            <ProgressTracker project={project} size="lg" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress {STATUS_CONFIG[project.status].label}</span>
              <span className="font-semibold text-gray-900">{getCurrentStageProgress(project)}%</span>
            </div>
            <Progress value={getCurrentStageProgress(project)} className="h-3" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Film className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Genre</p>
                <p className="font-medium text-gray-900">{project.genre}</p>
              </div>
            </div>

            {project.episode && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tv className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Episode</p>
                  <p className="font-medium text-gray-900">
                    Episode {project.episode} {project.season && `• Season ${project.season}`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tim</p>
                <p className="font-medium text-gray-900">{project.assignedTo}</p>
              </div>
            </div>

            {project.editor && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-lg">✂️</span>
                <div>
                  <p className="text-xs text-gray-500">Editor</p>
                  <p className="font-medium text-purple-700">{project.editor}</p>
                </div>
              </div>
            )}

            {project.channel && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tv className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Channel</p>
                  <p className="font-medium text-gray-900">
                    {project.channel} {project.airTime && `• ${project.airTime}`}
                  </p>
                </div>
              </div>
            )}

            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              isOverdue ? "bg-red-50" : "bg-gray-50"
            )}>
              <Calendar className={cn("w-5 h-5", isOverdue ? "text-red-500" : "text-gray-400")} />
              <div>
                <p className="text-xs text-gray-500">Deadline</p>
                <p className={cn(
                  "font-medium",
                  isOverdue ? "text-red-600" : "text-gray-900"
                )}>
                  {dueDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                  {isOverdue && ` (Terlambat ${Math.abs(daysLeft)} hari)`}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {project.notes && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Catatan</p>
                  <p className="text-sm text-amber-700 mt-1">{project.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="text-xs text-gray-400 text-center pt-4 border-t">
            Dibuat pada {new Date(project.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
