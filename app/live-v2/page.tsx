"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { STATUS_CONFIG } from "@/lib/types";
import type { TVProject, ProjectStatus } from "@/types/project";
import { useApiProjects } from "@/lib/use-api-projects";
import { GroupedProjectCardLive } from "@/components/grouped-project-card-live";
import { AnimatedColumn } from "@/components/animated-column";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw, Loader2, Sun, Moon } from "lucide-react";
import { ProjectCard } from "@/app/live-v2/_components";

const STATUSES: ProjectStatus[] = ["pre-produksi", "shooting", "editing", "selesai", "payment"];

/**
 * Clock terisolasi — hanya komponen ini yang re-render setiap detik.
 * Dengan begitu AnimatedColumn & kartu-kartu TIDAK terganggu tiap detik.
 */
const LiveClock = memo(function LiveClock({
  timeClassName,
  weekdayClassName,
  subtitleClassName,
  containerClassName,
  liveBgClassName,
  liveTextClassName,
  liveDotClassName,
}: {
  timeClassName: string;
  weekdayClassName: string;
  subtitleClassName: string;
  containerClassName: string;
  liveBgClassName: string;
  liveTextClassName: string;
  liveDotClassName: string;
}) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className={cn("text-sm font-medium", weekdayClassName)}>
          {now.toLocaleDateString("id-ID", { weekday: "long" })}
        </p>
        <p className={cn("text-xs", subtitleClassName)}>
          {now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className={cn("flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors duration-300", containerClassName)}>
        <div className={cn("text-2xl font-mono font-semibold tabular-nums tracking-wider", timeClassName)}>
          {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border", liveBgClassName)}>
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", liveDotClassName)} />
          <span className={cn("text-[10px] font-semibold uppercase tracking-wider", liveTextClassName)}>Live</span>
        </div>
      </div>
    </div>
  );
});

const useColumnData = (projects: TVProject[]) => {
  return useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        projects: projects.filter((p) => p.status === status),
      })),
    [projects]
  );
};

// Utilities
const groupProjectsByTitle = (projectList: TVProject[]) => {
  const grouped = new Map<string, TVProject[]>();
  projectList.forEach((project) => {
    const existing = grouped.get(project.title) || [];
    grouped.set(project.title, [...existing, project]);
  });
  return grouped;
};

export default function LiveTrackingPage() {
  const { projects, loading, error } = useApiProjects(300000);
  const columns = useColumnData(projects);
  const [isLightMode, setIsLightMode] = useState(false);

  // Theme classes - HIGH CONTRAST for TV display with Glass UI
  const theme = {
    // Background
    pageBg: isLightMode
      ? "bg-linear-to-br from-slate-100 via-blue-50 to-purple-100"
      : "bg-linear-to-b from-slate-900 to-slate-950",

    // Header - Glass effect
    headerBg: isLightMode
      ? "bg-white/95 border-gray-200"
      : "bg-slate-900/95 border-slate-800/50",

    // Logo
    logoBg: isLightMode
      ? "from-emerald-200/80 to-cyan-200/80 border-emerald-400/50"
      : "from-emerald-500/20 to-cyan-500/20 border-emerald-500/30",
    logoIcon: isLightMode ? "text-emerald-700" : "text-emerald-400",

    // Title
    titleText: isLightMode ? "text-gray-950 font-black" : "text-white",
    subtitleText: isLightMode ? "text-gray-600 font-semibold" : "text-slate-500",

    // Time display 
    timeBg: isLightMode
      ? "bg-white border-gray-200"
      : "bg-slate-800/50 border-slate-700/50",
    timeText: isLightMode ? "text-gray-950 font-black" : "text-white",
    dateText: isLightMode ? "text-gray-700 font-semibold" : "text-slate-300",

    // Live badge
    liveBg: isLightMode
      ? "bg-emerald-100 border-emerald-400/50"
      : "bg-emerald-500/20 border-emerald-500/30",
    liveText: isLightMode ? "text-emerald-800 font-bold" : "text-emerald-400",
    liveDot: isLightMode ? "bg-emerald-600" : "bg-emerald-400",

    // Admin button
    adminBtn: isLightMode
      ? "text-gray-700 hover:text-gray-950 hover:bg-gray-100 font-semibold"
      : "text-slate-400 hover:text-white hover:bg-slate-800/50",

    // Column 
    columnBg: isLightMode
      ? "bg-slate-100 border-gray-300"
      : "bg-slate-900/50 border-slate-800",
    columnHeader: isLightMode
      ? "border-gray-300"
      : "border-slate-800",
    columnLabel: isLightMode ? "text-gray-950 font-extrabold" : "text-white",
    columnCount: isLightMode
      ? "text-gray-800 bg-white font-bold"
      : "text-slate-400 bg-slate-800",
    emptyText: isLightMode ? "text-gray-500 font-medium" : "text-slate-600",

    // Footer 
    footerBg: isLightMode
      ? "bg-white text-gray-700 font-medium"
      : "bg-slate-800/50 text-slate-400",
    footerBorder: isLightMode ? "border-gray-200" : "border-slate-800",
    footerText: isLightMode ? "text-gray-600 font-medium" : "text-slate-600",

    // Loading 
    loadingBg: isLightMode
      ? "bg-white/95"
      : "bg-slate-900/95",
    loadingText: isLightMode ? "text-gray-800 font-semibold" : "text-slate-300",

    // Error 
    errorBg: isLightMode
      ? "bg-red-50 border-red-300/50 text-red-700 font-semibold"
      : "bg-red-500/10 border-red-500/30 text-red-400",
  };

  return (
    <>
      <div className={cn("min-h-screen transition-colors duration-300", theme.pageBg)}>


        {loading && projects.length === 0 && (
          <div className={cn("fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center", theme.loadingBg)}>
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
              <p className={cn("text-lg", theme.loadingText)}>Loading projects...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={cn("fixed top-4 right-4 px-4 py-3 rounded-lg z-50 max-w-md border", theme.errorBg)}>
            <p className="text-sm font-medium">⚠️ {error}</p>
          </div>
        )}


        <header className={cn("backdrop-blur-xl border-b sticky top-0 z-50 transition-colors duration-300", theme.headerBg)}>
          <div className="max-w-480 mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center gap-4">
                <div>
                  <img src="/logohitam.png" alt="" width={200} height={300} />
                  {/* Live indicator */}
                  {/* <span className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse shadow-lg", theme.liveDot)} /> */}

                </div>


                {/* <div>
                  <h1 className={cn("text-xl font-semibold tracking-tight", theme.titleText)}>
                    DREAMLIGHT
                  </h1>
                  <p className={cn("text-xs tracking-widest uppercase", theme.subtitleText)}>
                    Production Board
                  </p>
                </div> */}
              </div>

              {/* Time & Date Display — terisolasi, tidak memicu re-render kolom */}
              <div className="flex items-center gap-4">
                <LiveClock
                  timeClassName={cn("text-2xl font-mono font-semibold tabular-nums tracking-wider", theme.timeText)}
                  weekdayClassName={theme.dateText}
                  subtitleClassName={theme.subtitleText}
                  containerClassName={theme.timeBg}
                  liveBgClassName={theme.liveBg}
                  liveTextClassName={theme.liveText}
                  liveDotClassName={theme.liveDot}
                />

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLightMode(!isLightMode)}
                  className={cn("gap-2", theme.adminBtn)}
                >
                  {isLightMode ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <main className="max-w- mx-auto px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {columns.map((col) => {
              const config = STATUS_CONFIG[col.status];
              const groupedProjects = groupProjectsByTitle(col.projects);
              const shouldAnimate = false
              const projectsKey = col.projects.map(p => p.id).join('-');

              return (
                <div key={col.status} className={cn("rounded-xl p-4 h-[calc(100vh-180px)] border flex flex-col transition-colors duration-300", theme.columnBg)}>
                  {/* Column Header */}
                  <div className={cn("flex items-center gap-3 mb-4 pb-3 border-b", theme.columnHeader)}>
                    <span className="text-3xl">{config.icon}</span>
                    <span className={cn("font-bold text-lg uppercase tracking-wide", theme.columnLabel)}>{config.label}</span>
                    <span className={cn("ml-auto text-base px-3 py-1 rounded-full font-bold", theme.columnCount)}>
                      {col.projects.length}
                    </span>
                  </div>

                  {/* Content dengan AnimatedColumn wrapper */}
                  {col.projects.length === 0 ? (
                    <div className={cn("text-center py-12 text-sm", theme.emptyText)}>
                      <p>Tidak ada project</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-hidden">
                      <AnimatedColumn shouldAnimate={shouldAnimate} projectsKey={projectsKey}>
                        {Array.from(groupedProjects.entries()).map(([title, projectGroup], index) => {
                          if (projectGroup.length > 1) {
                            return (
                              <GroupedProjectCardLive
                                key={`${title}-${index}`}
                                title={title}
                                projects={projectGroup.sort((a, b) => (a.episode || 0) - (b.episode || 0))}
                                groupIndex={index}
                                isLightMode={isLightMode}
                              />
                            );
                          }

                          const project = projectGroup[0];
                          return (
                            <ProjectCard
                              key={`${project.id}-${index}`}
                              project={project}
                              config={config}
                              groupIndex={index}
                              isLightMode={isLightMode}
                            />
                          );
                        })}
                      </AnimatedColumn>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs", theme.footerBg)}>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Auto-refresh aktif • Update setiap 5 detik dari API</span>
            </div>
            <div className={cn("py-4 border-t", theme.footerBorder)}>
              <p className={cn("text-xs", theme.footerText)}>🔒 Mode Read Only • Data real-time dari {process.env.NEXT_PUBLIC_API_URL}</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
