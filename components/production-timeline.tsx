import { TVProject, STATUS_CONFIG, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2 } from "lucide-react";

interface ProductionTimelineProps {
  project: TVProject;
}

export function ProductionTimeline({ project }: ProductionTimelineProps) {
  const stages: ProjectStatus[] = ["shooting", "editing", "selesai", "kirim"];
  const currentStageIndex = stages.indexOf(project.status);

  const getStageTime = (stage: ProjectStatus): string | null => {
    const log = project.logs?.find(l => l.stage === stage);
    if (!log) return null;
    
    const date = new Date(log.timestamp);
    return date.toLocaleTimeString("id-ID", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const getStageStatus = (index: number): "completed" | "active" | "pending" => {
    if (index < currentStageIndex) return "completed";
    if (index === currentStageIndex) return "active";
    return "pending";
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute top-8 left-0 right-0 h-1 bg-slate-700">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 transition-all duration-1000"
          style={{ 
            width: `${((currentStageIndex + 1) / stages.length) * 100}%` 
          }}
        />
      </div>

      {/* Stages */}
      <div className="relative flex justify-between">
        {stages.map((stage, index) => {
          const config = STATUS_CONFIG[stage];
          const status = getStageStatus(index);
          const time = getStageTime(stage);
          const isActive = status === "active";
          const isCompleted = status === "completed";

          return (
            <div 
              key={stage} 
              className="flex flex-col items-center flex-1"
            >
              {/* Stage Icon */}
              <div 
                className={cn(
                  "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 transition-all duration-500",
                  "border-4 border-slate-900",
                  isCompleted && "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50 scale-110",
                  isActive && "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 animate-pulse scale-110",
                  !isCompleted && !isActive && "bg-slate-800 border-slate-700"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <span className={cn(
                    isActive ? "text-white" : "text-slate-500"
                  )}>
                    {config.icon}
                  </span>
                )}

                {/* Active Pulse Effect */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                )}
              </div>

              {/* Stage Label */}
              <div className="mt-4 text-center">
                <p className={cn(
                  "text-xs font-bold mb-1",
                  isActive && "text-blue-400",
                  isCompleted && "text-emerald-400",
                  !isActive && !isCompleted && "text-slate-500"
                )}>
                  {config.label}
                </p>

                {/* Time Display */}
                {time ? (
                  <div className={cn(
                    "flex items-center gap-1 text-xs justify-center",
                    isActive && "text-blue-300",
                    isCompleted && "text-emerald-300",
                    "text-slate-400"
                  )}>
                    <Clock className="w-3 h-3" />
                    <span>{time}</span>
                  </div>
                ) : isActive ? (
                  <div className="flex items-center gap-1 text-xs justify-center text-blue-400">
                    <Clock className="w-3 h-3 animate-pulse" />
                    <span className="animate-pulse">Sedang Proses...</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600">-</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Info at Bottom */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs">
          <div className="text-slate-400">
            {project.channel && (
              <span className="flex items-center gap-1">
                📺 {project.channel}
                {project.airTime && <span className="ml-2">⏰ {project.airTime}</span>}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-slate-400">{project.assignedTo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
