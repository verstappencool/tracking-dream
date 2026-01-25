"use client";

import { useState, useEffect, useMemo } from "react";
import { STATUS_CONFIG } from "@/lib/types";
import type { TVProject, ProjectStatus } from "@/types/project";
import { useLiveProjects } from "@/lib/use-projects";
import { GroupedProjectCardLive } from "@/components/grouped-project-card-live";
import { AnimatedColumn } from "@/components/animated-column";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Pencil, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "./_components";
import { ProtectedRoute } from "@/components/protected-route";

const STATUSES: ProjectStatus[] = ["pre-produksi", "shooting", "editing", "selesai", "payment"];

// Hooks
const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
};

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
  const projects = useLiveProjects(1000);
  const currentTime = useCurrentTime();
  const columns = useColumnData(projects);

  return (
    <ProtectedRoute allowedRoles={["admin", "producer"]}>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Header - Minimalist Design */}
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
          <div className="max-w-[1920px] mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center gap-4">
                {/* Dreamlight Logo */}
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {/* Live indicator */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    DREAMLIGHT
                  </h1>
                  <p className="text-xs text-slate-500 tracking-widest uppercase">
                    Production Board
                  </p>
                </div>
              </div>

              {/* Time & Date Display */}
              <div className="flex items-center gap-6">
                {/* Date & Day */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-300">
                    {currentTime.toLocaleDateString("id-ID", {
                      weekday: "long",
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentTime.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-2xl font-mono font-semibold text-white tabular-nums tracking-wider">
                    {currentTime.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                {/* Admin Button */}
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="hidden md:inline text-xs">Admin</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-[1920px] mx-auto px-8">
            <div className="flex items-center justify-between py-6">
              {columns.map((col, index) => {
                const config = STATUS_CONFIG[col.status];
                return (
                  <div key={col.status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 bg-slate-800 border-2", config.borderColor)}>
                        {config.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{config.label}</span>
                      <span className={cn("text-xs mt-1", config.color)}>{col.projects.length} project</span>
                    </div>
                    {index < columns.length - 1 && <ChevronRight className="w-6 h-6 text-slate-600 mx-2" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <main className="max-w- mx-auto px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {columns.map((col) => {
              const config = STATUS_CONFIG[col.status];
              const groupedProjects = groupProjectsByTitle(col.projects);
              const shouldAnimate = false; // Let AnimatedColumn detect overflow automatically
              const projectsKey = col.projects.map(p => p.id).join('-');

              return (
                <div key={col.status} className="rounded-xl p-4 h-[calc(100vh-320px)] bg-slate-900/50 border border-slate-800 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                    <span className="text-lg">{config.icon}</span>
                    <span className="font-medium text-white text-sm">{config.label}</span>
                    <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      {col.projects.length}
                    </span>
                  </div>

                  {/* Content dengan AnimatedColumn wrapper */}
                  {col.projects.length === 0 ? (
                    <div className="text-center py-12 text-slate-600 text-sm">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-xs text-slate-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Auto-refresh aktif • Update real-time</span>
            </div>
            <div className="py-4 border-t border-slate-800">
              <p className="text-xs text-slate-600">🔒 Mode Read Only • Untuk mengedit, klik tombol "Admin Mode" di atas</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
