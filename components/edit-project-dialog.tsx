"use client";

import { useState, useEffect } from "react";
import {
  TVProject,
  ProjectStatus,
  ProjectPriority,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  GENRE_LIST,
  StageProgress
} from "@/lib/types";
import {
  getCurrentStageProgress,
  updateStageProgress,
  getProgressForNewStage
} from "@/lib/utils";
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
import { Pencil } from "lucide-react";

interface EditProjectDialogProps {
  project: TVProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<TVProject>) => void;
}

export function EditProjectDialog({ project, open, onOpenChange, onUpdate }: EditProjectDialogProps) {
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
    stageProgress: undefined as StageProgress | undefined,
    notes: "",
    channel: "",
    airTime: "",
    editor: ""
  });

  // Update form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        subtitle: project.subtitle || "",
        description: project.description,
        status: project.status,
        priority: project.priority,
        genre: project.genre,
        episode: project.episode?.toString() || "",
        season: project.season?.toString() || "",
        assignedTo: project.assignedTo,
        dueDate: project.dueDate,
        progress: getCurrentStageProgress(project),
        stageProgress: project.stageProgress,
        notes: project.notes || "",
        channel: project.channel || "",
        airTime: project.airTime || "",
        editor: project.editor || ""
      });
    }
  }, [project]);

  // Handle status change - update progress sesuai tahapan baru
  const handleStatusChange = (newStatus: ProjectStatus) => {
    if (!project) return;

    // Dapatkan progress untuk tahapan baru
    const newProgress = getProgressForNewStage(
      { ...project, stageProgress: formData.stageProgress },
      newStatus
    );

    setFormData({
      ...formData,
      status: newStatus,
      progress: newProgress
    });
  };

  // Handle progress change - update stageProgress
  const handleProgressChange = (newProgress: number) => {
    if (!project) return;

    const updatedStageProgress = updateStageProgress(
      { ...project, status: formData.status, stageProgress: formData.stageProgress },
      newProgress
    );

    setFormData({
      ...formData,
      progress: newProgress,
      stageProgress: updatedStageProgress
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    onUpdate(project.id, {
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
      stageProgress: formData.stageProgress,
      notes: formData.notes || undefined,
      channel: formData.channel || undefined,
      airTime: formData.airTime || undefined,
      editor: formData.editor || undefined
    });

    onOpenChange(false);
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Project *</Label>
            <Input
              id="title"
              placeholder="Masukkan judul tayangan"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                onValueChange={handleStatusChange}
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
            <Label htmlFor="progress">
              Progress {STATUS_CONFIG[formData.status].label} ({formData.progress}%)
            </Label>
            <Input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => handleProgressChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Progress akan tersimpan per tahapan. Ketika pindah tahapan, progress tahapan ini akan tetap tersimpan.
            </div>
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
              Update Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
