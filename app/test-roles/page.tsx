"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedColumn } from "@/components/animated-column";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/types";
import { 
  User, 
  Video, 
  Scissors, 
  Shield, 
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ChevronRight,
  Monitor,
  Clock,
  AlertCircle
} from "lucide-react";

// Types
type UserRole = "admin" | "shooting_admin" | "editor_admin";
type ProjectStatus = "shooting" | "editing" | "selesai" | "kirim";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  status: ProjectStatus;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  editorId?: string;
  createdBy: string;
  dueDate: string;
  progress: number;
  channel?: string;
  airTime?: string;
  editor?: string;
  notes?: string;
}

const STATUSES: ProjectStatus[] = ["shooting", "editing", "selesai", "kirim"];

// Hooks
const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return currentTime;
};

const useColumnData = (projects: Project[]) => {
  return useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        projects: projects.filter((p) => p.status === status),
      })),
    [projects]
  );
};

const groupProjectsByTitle = (projectList: Project[]) => {
  const grouped = new Map<string, Project[]>();
  projectList.forEach((project) => {
    const existing = grouped.get(project.title) || [];
    grouped.set(project.title, [...existing, project]);
  });
  return grouped;
};

// Dummy Data
const dummyUsers: UserType[] = [
  { id: "1", name: "Super Admin", email: "admin@tv.com", role: "admin" },
  { id: "2", name: "Andi (Shooting)", email: "andi@tv.com", role: "shooting_admin" },
  { id: "3", name: "Budi (Editor)", email: "budi@tv.com", role: "editor_admin" },
  { id: "4", name: "Citra (Shooting)", email: "citra@tv.com", role: "shooting_admin" },
  { id: "5", name: "Dedi (Editor)", email: "dedi@tv.com", role: "editor_admin" },
];

const dummyProjects: Project[] = [
  {
    id: "1",
    title: "BINTANG MBG",
    subtitle: "Episode Ngaliyan SD",
    description: "Program variety show BINTANG MBG yang tayang di Garuda TV pukul 20.30",
    status: "shooting",
    priority: "high",
    assignedTo: "2",
    createdBy: "1",
    dueDate: "2025-12-28",
    progress: 30,
    channel: "Garuda TV",
    airTime: "20:30",
    editor: "Budi Santoso",
  },
  {
    id: "2",
    title: "PESAN DARI KUBUR",
    subtitle: "Episode 8",
    description: "Serial horor misteri yang tayang di SCTV",
    status: "editing",
    priority: "urgent",
    assignedTo: "2",
    editorId: "3",
    createdBy: "2",
    dueDate: "2025-12-27",
    progress: 75,
    channel: "SCTV",
    editor: "Budi (Editor)",
    notes: "Perlu review ulang scene 15-20",
  },
  {
    id: "3",
    title: "INSERT TODAY",
    description: "Program berita infotainment",
    status: "selesai",
    priority: "medium",
    editorId: "5",
    createdBy: "4",
    dueDate: "2025-12-26",
    progress: 100,
    channel: "Trans TV",
    airTime: "19:00",
    editor: "Dedi (Editor)",
  },
  {
    id: "4",
    title: "BERITA SIANG",
    description: "Program berita siang hari",
    status: "kirim",
    priority: "high",
    editorId: "3",
    createdBy: "1",
    dueDate: "2025-12-25",
    progress: 100,
    channel: "Metro TV",
    airTime: "12:00",
    editor: "Budi (Editor)",
    notes: "Sudah dikirim ke G Drive",
  },
  {
    id: "5",
    title: "BINTANG MBG",
    subtitle: "Episode Banyumanik",
    description: "Episode spesial di Banyumanik",
    status: "shooting",
    priority: "medium",
    assignedTo: "4",
    createdBy: "1",
    dueDate: "2025-12-29",
    progress: 15,
    channel: "Garuda TV",
    airTime: "20:30",
  },
  {
    id: "6",
    title: "COMEDY NIGHT",
    subtitle: "Stand Up Special",
    description: "Special stand up comedy",
    status: "editing",
    priority: "low",
    editorId: "5",
    createdBy: "2",
    dueDate: "2025-12-30",
    progress: 45,
    channel: "Net TV",
    editor: "Dedi (Editor)",
  },
];

const roleConfig = {
  admin: { label: "Super Admin", color: "bg-red-500", icon: Shield },
  shooting_admin: { label: "Shooting Admin", color: "bg-blue-500", icon: Video },
  editor_admin: { label: "Editor Admin", color: "bg-yellow-500", icon: Scissors },
};

export default function TestRolesPage() {
  const [currentUser, setCurrentUser] = useState<UserType>(dummyUsers[0]);
  const [projects, setProjects] = useState<Project[]>(dummyProjects);
  const [users] = useState<UserType[]>(dummyUsers);
  const currentTime = useCurrentTime();
  
  // Permission helpers
  const canCreate = () => {
    return currentUser.role === "admin" || currentUser.role === "shooting_admin";
  };

  const canEdit = (project: Project) => {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "shooting_admin") {
      return project.status === "shooting";
    }
    if (currentUser.role === "editor_admin") {
      return ["editing", "selesai", "kirim"].includes(project.status);
    }
    return false;
  };

  const canDelete = (project: Project) => {
    return currentUser.role === "admin";
  };

  const canMoveToNextStage = (project: Project) => {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "shooting_admin" && project.status === "shooting") return true;
    if (currentUser.role === "editor_admin" && ["editing", "selesai"].includes(project.status)) return true;
    return false;
  };

  // Actions
  const handleCreateProject = () => {
    if (!canCreate()) {
      alert("❌ Anda tidak memiliki permission untuk create project!");
      return;
    }
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project " + Math.floor(Math.random() * 100),
      subtitle: "Episode " + Math.floor(Math.random() * 20),
      description: "Deskripsi project baru",
      status: "shooting",
      priority: "medium",
      createdBy: currentUser.id,
      assignedTo: currentUser.role === "shooting_admin" ? currentUser.id : undefined,
      dueDate: "2025-12-30",
      progress: 0,
      channel: "Sample TV",
    };
    setProjects([newProject, ...projects]);
    alert("✅ Project berhasil dibuat!");
  };

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !canDelete(project)) {
      alert("❌ Anda tidak memiliki permission untuk delete project!");
      return;
    }
    if (confirm(`Yakin ingin menghapus project: ${project.title}?`)) {
      setProjects(projects.filter(p => p.id !== projectId));
      alert("✅ Project berhasil dihapus!");
    }
  };

  const handleMoveToNextStage = (project: Project) => {
    if (!canMoveToNextStage(project)) {
      alert("❌ Anda tidak memiliki permission untuk pindahkan stage!");
      return;
    }

    const stages: ProjectStatus[] = ["shooting", "editing", "selesai", "kirim"];
    const currentIndex = stages.indexOf(project.status);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setProjects(projects.map(p => 
        p.id === project.id ? { 
          ...p, 
          status: nextStage,
          progress: nextStage === "kirim" ? 100 : p.progress
        } : p
      ));
    }
  };

  const handleUpdateProgress = (projectId: string, newProgress: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !canEdit(project)) {
      alert("❌ Anda tidak memiliki permission untuk edit project ini!");
      return;
    }
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, progress: newProgress } : p
    ));
  };

  // Filter projects based on role
  const getFilteredProjects = () => {
    if (currentUser.role === "admin") {
      return projects; // Admin sees all
    }
    if (currentUser.role === "shooting_admin") {
      return projects.filter(p => p.status === "shooting" || p.assignedTo === currentUser.id);
    }
    if (currentUser.role === "editor_admin") {
      return projects.filter(p => 
        ["editing", "selesai", "kirim"].includes(p.status) || p.editorId === currentUser.id
      );
    }
    return projects;
  };

  const filteredProjects = getFilteredProjects();
  const columns = useColumnData(filteredProjects);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Monitor className="w-6 h-6 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-white">Role-Based Access Control - DEMO</h1>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {currentTime.toLocaleTimeString("id-ID")} •
                  <span className="text-emerald-400">● LIVE DEMO</span>
                </div>
              </div>
            </div>

            {/* Current User Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                <div className="text-sm">
                  <p className="text-white font-medium">{currentUser.name}</p>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                </div>
                <Badge className={cn(roleConfig[currentUser.role].color, "text-white ml-2")}>
                  {roleConfig[currentUser.role].label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* User Switcher Panel */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Switch User:</span>
              <div className="flex gap-2">
                {users.map((user) => {
                  const RoleIcon = roleConfig[user.role].icon;
                  return (
                    <Button
                      key={user.id}
                      onClick={() => setCurrentUser(user)}
                      size="sm"
                      variant={currentUser.id === user.id ? "default" : "outline"}
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        currentUser.id === user.id 
                          ? "ring-2 ring-white bg-slate-700" 
                          : "border-slate-700 text-slate-300 hover:bg-slate-800"
                      )}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {user.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleCreateProject}
              disabled={!canCreate()}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </div>

          {/* Permissions Info */}
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Your Permissions:</span>
            </div>
            <PermissionBadge allowed={canCreate()} text="Create" />
            <PermissionBadge 
              allowed={currentUser.role === "admin" || currentUser.role === "shooting_admin"} 
              text="Edit Shooting" 
            />
            <PermissionBadge 
              allowed={currentUser.role === "admin" || currentUser.role === "editor_admin"} 
              text="Edit Editing" 
            />
            <PermissionBadge allowed={currentUser.role === "admin"} text="Delete" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4">
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
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const config = STATUS_CONFIG[col.status];
            const groupedProjects = groupProjectsByTitle(col.projects);
            const shouldAnimate = col.projects.length >= 3;
            const projectsKey = col.projects.map(p => p.id).join('-');

            return (
              <div key={col.status} className="rounded-xl p-4 min-h-[400px] bg-slate-900/50 border border-slate-800">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                  <span className="text-lg">{config.icon}</span>
                  <span className="font-medium text-white text-sm">{config.label}</span>
                  <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {col.projects.length}
                  </span>
                </div>

                {/* Content */}
                {col.projects.length === 0 ? (
                  <div className="text-center py-12 text-slate-600 text-sm">
                    <p>Tidak ada project</p>
                  </div>
                ) : (
                  <AnimatedColumn shouldAnimate={shouldAnimate} projectsKey={projectsKey}>
                    {(shouldAnimate
                      ? [...Array.from(groupedProjects.entries()), ...Array.from(groupedProjects.entries())]
                      : Array.from(groupedProjects.entries())
                    ).map(([title, projectGroup], idx) => {
                      const index = shouldAnimate ? idx % groupedProjects.size : idx;
                      const isDuplicate = shouldAnimate && idx >= groupedProjects.size;
                      const keyPrefix = isDuplicate ? 'dup-' : '';

                      if (projectGroup.length > 1) {
                        return (
                          <div key={`${keyPrefix}${title}-${index}`} className="mb-3">
                            <GroupedCard
                              title={title}
                              projects={projectGroup}
                              config={config}
                              canEdit={projectGroup.every(p => canEdit(p))}
                              canDelete={projectGroup.every(p => canDelete(p))}
                              canMove={projectGroup.every(p => canMoveToNextStage(p))}
                              onDelete={(id) => handleDeleteProject(id)}
                              onMove={(project) => handleMoveToNextStage(project)}
                              onUpdateProgress={handleUpdateProgress}
                            />
                          </div>
                        );
                      }

                      const project = projectGroup[0];
                      return (
                        <div key={`${keyPrefix}${project.id}-${index}`} className="mb-3">
                          <ProjectCard
                            project={project}
                            config={config}
                            groupIndex={index}
                            canEdit={canEdit(project)}
                            canDelete={canDelete(project)}
                            canMove={canMoveToNextStage(project)}
                            onDelete={() => handleDeleteProject(project.id)}
                            onMove={() => handleMoveToNextStage(project)}
                            onUpdateProgress={handleUpdateProgress}
                          />
                        </div>
                      );
                    })}
                  </AnimatedColumn>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="py-4 border-t border-slate-800">
            <p className="text-xs text-slate-600">🎭 Role-Based Access Control Demo • Try switching users to see different permissions</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Project Card Component
const ProjectCard = ({
  project,
  config,
  groupIndex,
  canEdit,
  canDelete,
  canMove,
  onDelete,
  onMove,
  onUpdateProgress,
}: {
  project: Project;
  config: typeof STATUS_CONFIG[ProjectStatus];
  groupIndex: number;
  canEdit: boolean;
  canDelete: boolean;
  canMove: boolean;
  onDelete: () => void;
  onMove: () => void;
  onUpdateProgress: (id: string, progress: number) => void;
}) => (
  <div className={cn("bg-slate-800 rounded-lg p-3 border transition-all", config.borderColor, "hover:bg-slate-750")}>
    {/* Title */}
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">#{groupIndex + 1}</span>
      <h3 className="font-medium text-white text-sm flex-1">{project.title}</h3>
    </div>

    {/* Subtitle */}
    {project.subtitle && <p className="text-xs text-blue-400 font-medium mb-2">{project.subtitle}</p>}

    {/* Description */}
    {project.description && <p className="text-xs text-slate-500 mb-2 line-clamp-2">{project.description}</p>}

    {/* Channel & Air Time */}
    {(project.channel || project.airTime) && (
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
        {project.channel && <span className="flex items-center gap-1">📺 {project.channel}</span>}
        {project.airTime && <span className="flex items-center gap-1">⏰ {project.airTime}</span>}
      </div>
    )}

    {/* Editor */}
    {project.editor && (
      <div className="flex items-center gap-1 text-xs text-purple-400 mb-2">
        <span>✂️ {project.editor}</span>
      </div>
    )}

    {/* Progress Bar */}
    <div className="space-y-1 mb-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Progress</span>
        <span className={cn("font-medium", config.color)}>{project.progress}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            project.status === "shooting" && "bg-purple-500",
            project.status === "editing" && "bg-blue-500",
            project.status === "selesai" && "bg-emerald-500",
            project.status === "kirim" && "bg-amber-500"
          )}
          style={{ width: `${project.progress}%` }}
        />
      </div>
      {canEdit && (
        <input
          type="range"
          min="0"
          max="100"
          value={project.progress}
          onChange={(e) => onUpdateProgress(project.id, parseInt(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      )}
    </div>

    {/* Notes */}
    {project.notes && (
      <div className="mb-2 pb-2 border-b border-slate-700">
        <p className="text-xs text-slate-400 italic line-clamp-2">{project.notes}</p>
      </div>
    )}

    {/* Actions */}
    <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
      <Button
        size="sm"
        variant="outline"
        onClick={onMove}
        disabled={!canMove || project.status === "kirim"}
        className="flex-1 text-xs h-7 border-slate-600"
      >
        <ChevronRight className="w-3 h-3 mr-1" />
        Next
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={!canEdit}
        className="text-xs h-7 border-slate-600"
      >
        <Edit className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onDelete}
        disabled={!canDelete}
        className="text-xs h-7 border-red-600 text-red-400 hover:bg-red-400/10"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  </div>
);

// Grouped Card Component
const GroupedCard = ({
  title,
  projects,
  config,
  canEdit,
  canDelete,
  canMove,
  onDelete,
  onMove,
  onUpdateProgress,
}: {
  title: string;
  projects: Project[];
  config: typeof STATUS_CONFIG[ProjectStatus];
  canEdit: boolean;
  canDelete: boolean;
  canMove: boolean;
  onDelete: (id: string) => void;
  onMove: (project: Project) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("bg-slate-800 rounded-lg border transition-all", config.borderColor)}>
      <div 
        className="p-3 cursor-pointer hover:bg-slate-750"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-white text-sm mb-1">{title}</h3>
            <p className="text-xs text-slate-400">{projects.length} episodes</p>
          </div>
          <Badge className={cn(config.color, "text-white")}>
            {projects.length}
          </Badge>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-700 p-3 space-y-2">
          {projects.map((project) => (
            <div key={project.id} className="bg-slate-900/50 rounded p-2 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium">{project.subtitle || `Episode ${project.id}`}</span>
                <span className={cn("font-medium", config.color)}>{project.progress}%</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMove(project)}
                  disabled={!canMove || project.status === "kirim"}
                  className="flex-1 text-xs h-6 border-slate-600"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(project.id)}
                  disabled={!canDelete}
                  className="text-xs h-6 border-red-600 text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Permission Badge Component
const PermissionBadge = ({ allowed, text }: { allowed: boolean; text: string }) => (
  <div className="flex items-center gap-1">
    {allowed ? (
      <>
        <Check className="w-3 h-3 text-green-400" />
        <span className="text-green-400">{text}</span>
      </>
    ) : (
      <>
        <X className="w-3 h-3 text-red-400" />
        <span className="text-red-400">{text}</span>
      </>
    )}
  </div>
);
