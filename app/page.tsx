"use client";

import { useState } from "react";
import { TVProject, STATUS_CONFIG, ProjectStatus } from "@/lib/types";
import { useProjects } from "@/lib/use-projects";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { EditProjectDialog } from "@/components/edit-project-dialog";
import { GroupedProjectCard } from "@/components/grouped-project-card";
import { Button } from "@/components/ui/button";
import { cn, getCurrentStageProgress, getProgressForNewStage } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  GripVertical,
  Tv,
  Plus,
  Eye,
  Pencil
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { projects, setProjects } = useProjects();
  const [draggedProject, setDraggedProject] = useState<TVProject | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TVProject | null>(null);

  // Add new project
  const handleAddProject = (newProject: Omit<TVProject, "id" | "createdAt">) => {
    const project: TVProject = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProjects([project, ...projects]);
  };

  // Update project
  const handleUpdateProject = (id: string, updates: Partial<TVProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    if (confirm("Yakin ingin menghapus project ini?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  // Move project to next/prev status
  const moveProject = (projectId: string, newStatus: ProjectStatus) => {
    // Validasi: cek apakah editor sudah diisi jika pindah ke editing
    const project = projects.find(p => p.id === projectId);
    if (project && newStatus === "editing" && !project.editor) {
      toast.error("Nama Editor Belum Diisi!", {
        description: "Mohon isi nama editor terlebih dahulu sebelum memindahkan ke tahap editing.",
      });
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        // Ambil progress dari tahapan yang dituju
        const newProgress = getProgressForNewStage(p, newStatus);

        return {
          ...p,
          status: newStatus,
          progress: newProgress
        };
      }
      return p;
    }));
  };

  const getNextStatus = (status: ProjectStatus): ProjectStatus | null => {
    if (status === "shooting") return "editing";
    if (status === "editing") return "selesai";
    if (status === "selesai") return "kirim";
    return null;
  };

  const getPrevStatus = (status: ProjectStatus): ProjectStatus | null => {
    if (status === "kirim") return "selesai";
    if (status === "selesai") return "editing";
    if (status === "editing") return "shooting";
    return null;
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, project: TVProject) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ProjectStatus) => {
    e.preventDefault();
    if (draggedProject && draggedProject.status !== targetStatus) {
      moveProject(draggedProject.id, targetStatus);
    }
    setDraggedProject(null);
  };

  const handleDragEnd = () => {
    setDraggedProject(null);
  };

  // Group projects by status
  const columns: { status: ProjectStatus; projects: TVProject[] }[] = [
    { status: "shooting", projects: projects.filter(p => p.status === "shooting") },
    { status: "editing", projects: projects.filter(p => p.status === "editing") },
    { status: "selesai", projects: projects.filter(p => p.status === "selesai") },
    { status: "kirim", projects: projects.filter(p => p.status === "kirim") },
  ];

  // Group projects by title within each status
  const groupProjectsByTitle = (projectList: TVProject[]) => {
    const grouped = new Map<string, TVProject[]>();

    projectList.forEach(project => {
      const existing = grouped.get(project.title) || [];
      existing.push(project);
      grouped.set(project.title, existing);
    });

    return grouped;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">PROGRAM DREAMLIGHT</h1>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Pencil className="w-3 h-3" /> Admin Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/live">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Live View</span>
                </Button>
              </Link>

              <Button
                onClick={() => setAddDialogOpen(true)}
                size="sm"
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            {columns.map((col, index) => {
              const config = STATUS_CONFIG[col.status];
              const isLast = index === columns.length - 1;

              return (
                <div key={col.status} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2",
                      "bg-slate-800 border-2",
                      config.borderColor
                    )}>
                      {config.icon}
                    </div>
                    <span className="text-sm font-medium text-white">{config.label}</span>
                    <span className={cn("text-xs mt-1", config.color)}>
                      {col.projects.length} project
                    </span>
                  </div>
                  {!isLast && (
                    <ChevronRight className="w-6 h-6 text-slate-600 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const config = STATUS_CONFIG[col.status];
            const groupedProjects = groupProjectsByTitle(col.projects);
            const hasMany = col.projects.length >= 3;

            return (
              <div
                key={col.status}
                className={cn(
                  "rounded-xl p-4 min-h-[400px] transition-all flex flex-col",
                  "bg-slate-900/50 border border-slate-800",
                  draggedProject && draggedProject.status !== col.status && "border-dashed border-slate-600 bg-slate-800/30"
                )}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 flex-shrink-0">
                  <span className="text-lg">{config.icon}</span>
                  <span className="font-medium text-white text-sm">{config.label}</span>
                  <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {col.projects.length}
                  </span>
                </div>

                {/* Cards - Grouped */}
                <div
                  className={cn(
                    "space-y-3 scrollbar-hide",
                    hasMany && "overflow-y-auto max-h-[calc(100vh-400px)]"
                  )}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {Array.from(groupedProjects.entries()).map(([title, projectGroup], groupIndex) => {
                    // Jika hanya 1 episode, tampilkan card biasa
                    if (projectGroup.length === 1) {
                      const project = projectGroup[0];
                      const nextStatus = getNextStatus(project.status);
                      const prevStatus = getPrevStatus(project.status);

                      return (
                        <div
                          key={project.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, project)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            "group bg-slate-800 rounded-lg p-3 cursor-grab active:cursor-grabbing",
                            "border border-slate-700 hover:border-slate-600 transition-all",
                            "hover:bg-slate-750",
                            draggedProject?.id === project.id && "opacity-50"
                          )}
                        >
                          {/* Drag Handle + Title */}
                          <div className="flex items-start gap-2">
                            <GripVertical className="w-4 h-4 text-slate-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                                #{groupIndex + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-white text-sm">
                                {project.title}
                              </h3>
                              {project.subtitle && (
                                <p className="text-xs text-blue-400 font-medium mt-0.5">
                                  {project.subtitle}
                                </p>
                              )}
                              {project.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {project.description}
                                </p>
                              )}
                              {(project.channel || project.airTime) && (
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                  {project.channel && <span>📺 {project.channel}</span>}
                                  {project.airTime && <span>⏰ {project.airTime}</span>}
                                </div>
                              )}
                              {(project.editor || project.assignedTo) && (
                                <div className="flex items-center gap-3 mt-1 text-xs">
                                  {project.editor && (
                                    <span className="text-purple-400">✂️ {project.editor}</span>
                                  )}
                                  {project.assignedTo && (
                                    <span className="text-slate-400">👥 {project.assignedTo}</span>
                                  )}
                                </div>
                              )}

                              {/* Progress Bar */}
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-slate-500">Progress</span>
                                  <span className={cn("font-medium", STATUS_CONFIG[project.status].color)}>
                                    {getCurrentStageProgress(project)}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
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
                                setSelectedProject(project);
                                setEditDialogOpen(true);
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Pencil className="w-3 h-3 text-slate-400 hover:text-white" />
                            </Button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-700">
                            {prevStatus && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveProject(project.id, prevStatus)}
                                className="h-7 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
                              >
                                <ArrowLeft className="w-3 h-3 mr-1" />
                                {STATUS_CONFIG[prevStatus].label}
                              </Button>
                            )}
                            {nextStatus && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveProject(project.id, nextStatus)}
                                className={cn(
                                  "h-7 px-2 text-xs ml-auto",
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
                    }

                    // Jika lebih dari 1 episode, tampilkan grouped card
                    return (
                      <GroupedProjectCard
                        key={title}
                        title={title}
                        projects={projectGroup.sort((a, b) => (a.episode || 0) - (b.episode || 0))}
                        draggedProject={draggedProject}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onEdit={(project) => {
                          setSelectedProject(project);
                          setEditDialogOpen(true);
                        }}
                        onMove={moveProject}
                        getNextStatus={getNextStatus}
                        getPrevStatus={getPrevStatus}
                      />
                    );
                  })}

                  {col.projects.length === 0 && (
                    <div className="text-center py-12 text-slate-600 text-sm">
                      <p>Drop project di sini</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-slate-600 mt-6">
          💡 Drag & drop atau klik tombol untuk memindahkan project
        </p>
      </main>

      <AddProjectDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddProject}
        existingProjects={projects}
      />

      <EditProjectDialog
        project={selectedProject}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdateProject}
      />
    </div>
  );
}
