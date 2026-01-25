"use client";

import { useState } from "react";
import { STATUS_CONFIG, PRIORITY_CONFIG, GENRE_LIST } from "@/lib/types";
import type { TVProject, ProjectStatus, ProjectPriority } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (project: Omit<TVProject, "id" | "createdAt">) => void;
  existingProjects?: TVProject[]; // Daftar project yang sudah ada
}

export function AddProjectDialog({ open, onOpenChange, onAdd, existingProjects = [] }: AddProjectDialogProps) {
  const [projectMode, setProjectMode] = useState<"new" | "episode">("new");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    status: "shooting" as ProjectStatus,
    priority: "medium" as ProjectPriority,
    genre: "",
    episode: "",
    season: "",
    assignedTo: "",
    dueDate: "",
    progress: 0,
    notes: "",
    channel: "",
    airTime: "",
    editor: ""
  });

  // Get unique project titles
  const uniqueProjects = Array.from(
    new Map(existingProjects.map(p => [p.title, p])).values()
  );

  // Handle mode change
  const handleModeChange = (mode: "new" | "episode") => {
    setProjectMode(mode);
    if (mode === "new") {
      setSelectedProject("");
      // Reset form
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        status: "shooting",
        priority: "medium",
        genre: "",
        episode: "",
        season: "",
        assignedTo: "",
        dueDate: "",
        progress: 0,
        notes: "",
        channel: "",
        airTime: "",
        editor: ""
      });
    }
  };

  // Handle existing project selection
  const handleProjectSelection = (projectTitle: string) => {
    setSelectedProject(projectTitle);
    const project = existingProjects.find(p => p.title === projectTitle);
    if (project) {
      // Get latest episode number
      const sameProjects = existingProjects.filter(p => p.title === projectTitle);
      const maxEpisode = Math.max(...sameProjects.map(p => p.episode || 0));

      setFormData({
        title: project.title,
        subtitle: "",
        description: project.description,
        status: "shooting",
        priority: project.priority,
        genre: project.genre,
        episode: (maxEpisode + 1).toString(),
        season: project.season?.toString() || "",
        assignedTo: project.assignedTo,
        dueDate: "",
        progress: 0,
        notes: "",
        channel: project.channel || "",
        airTime: project.airTime || "",
        editor: project.editor || ""
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      genre: formData.genre,
      episode: formData.episode ? parseInt(formData.episode) : undefined,
      season: formData.season ? parseInt(formData.season) : undefined,
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
      progress: formData.progress,
      stageProgress: {
        "pre-produksi": formData.status === "pre-produksi" ? formData.progress : 0,
        shooting: formData.status === "shooting" ? formData.progress : 0,
        editing: formData.status === "editing" ? formData.progress : 0,
        selesai: formData.status === "selesai" ? formData.progress : 0,
        payment: formData.status === "payment" ? formData.progress : 0
      },
      notes: formData.notes || undefined,
      channel: formData.channel || undefined,
      airTime: formData.airTime || undefined,
      editor: formData.editor || undefined
    });

    // Reset form
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      status: "shooting",
      priority: "medium",
      genre: "",
      episode: "",
      season: "",
      assignedTo: "",
      dueDate: "",
      progress: 0,
      notes: "",
      channel: "",
      airTime: "",
      editor: ""
    });
    setProjectMode("new");
    setSelectedProject("");

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Tambah Project Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode Selection */}
          <div className="space-y-2">
            <Label>Tipe Project</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={projectMode === "new" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleModeChange("new")}
              >
                🆕 Project Baru
              </Button>
              <Button
                type="button"
                variant={projectMode === "episode" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleModeChange("episode")}
              >
                ➕ Tambah Episode
              </Button>
            </div>
          </div>

          {/* Select Existing Project (only if mode = episode) */}
          {projectMode === "episode" && (
            <div className="space-y-2">
              <Label>Pilih Project yang Sudah Ada *</Label>
              <Select
                value={selectedProject}
                onValueChange={handleProjectSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih project..." />
                </SelectTrigger>
                <SelectContent>
                  {uniqueProjects.map((project) => (
                    <SelectItem key={project.id} value={project.title}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Project *</Label>
            <Input
              id="title"
              placeholder="Masukkan judul tayangan"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={projectMode === "episode"}
              required
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Sub Judul / Episode</Label>
            <Input
              id="subtitle"
              placeholder="Contoh: Episode Ngaliyan SD"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Input
              id="description"
              placeholder="Deskripsi singkat tentang project"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProjectStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.icon} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioritas *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: ProjectPriority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label>Genre *</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => setFormData({ ...formData, genre: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRE_LIST.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Episode & Season */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="episode">Episode</Label>
              <Input
                id="episode"
                type="number"
                placeholder="No. episode"
                value={formData.episode}
                onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Input
                id="season"
                type="number"
                placeholder="No. season"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              />
            </div>
          </div>

          {/* Assigned To & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Tim *</Label>
              <Input
                id="assignedTo"
                placeholder="Nama tim"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Deadline *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Channel & Air Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Channel TV</Label>
              <Input
                id="channel"
                placeholder="e.g. Garuda TV, SCTV"
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="airTime">Jam Tayang</Label>
              <Input
                id="airTime"
                type="time"
                value={formData.airTime}
                onChange={(e) => setFormData({ ...formData, airTime: e.target.value })}
              />
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <Label htmlFor="editor">Nama Editor</Label>
            <Input
              id="editor"
              placeholder="Nama editor yang menangani"
              value={formData.editor}
              onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
            />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
            <Input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Input
              id="notes"
              placeholder="Catatan tambahan (opsional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              Tambah Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
