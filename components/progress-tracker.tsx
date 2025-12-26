"use client";

import { TVProject, STATUS_CONFIG, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressTrackerProps {
  project: TVProject;
  size?: "sm" | "md" | "lg";
}

export function ProgressTracker({ project, size = "md" }: ProgressTrackerProps) {
  const steps: ProjectStatus[] = ["order", "proses", "selesai"];
  const currentStep = STATUS_CONFIG[project.status].step;

  const sizeClasses = {
    sm: {
      container: "gap-1",
      circle: "w-6 h-6 text-xs",
      line: "h-0.5",
      label: "text-[10px]"
    },
    md: {
      container: "gap-2",
      circle: "w-8 h-8 text-sm",
      line: "h-1",
      label: "text-xs"
    },
    lg: {
      container: "gap-3",
      circle: "w-12 h-12 text-base",
      line: "h-1.5",
      label: "text-sm"
    }
  };

  const s = sizeClasses[size];

  return (
    <div className={cn("flex items-center justify-between w-full", s.container)}>
      {steps.map((status, index) => {
        const config = STATUS_CONFIG[status];
        const isCompleted = currentStep > config.step;
        const isCurrent = currentStep === config.step;
        const isLast = index === steps.length - 1;

        return (
          <div key={status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "rounded-full flex items-center justify-center font-medium transition-all duration-300",
                  s.circle,
                  isCompleted && "bg-emerald-500 text-white",
                  isCurrent && cn(config.bgColor, config.color, "ring-2 ring-offset-2", config.borderColor.replace("border-", "ring-")),
                  !isCompleted && !isCurrent && "bg-gray-100 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className={cn(size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5")} />
                ) : (
                  config.icon
                )}
              </div>
              <span className={cn(
                "mt-1 font-medium text-center whitespace-nowrap",
                s.label,
                isCompleted && "text-emerald-600",
                isCurrent && config.color,
                !isCompleted && !isCurrent && "text-gray-400"
              )}>
                {config.label}
              </span>
            </div>
            
            {!isLast && (
              <div className={cn(
                "flex-1 mx-2 rounded-full transition-all duration-300",
                s.line,
                isCompleted ? "bg-emerald-500" : "bg-gray-200"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
