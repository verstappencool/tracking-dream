import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TVProject, ProjectStatus, StageProgress } from "@/types/project";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper untuk mendapatkan progress dari tahapan yang sedang aktif
export function getCurrentStageProgress(project: TVProject): number {
  if (!project.stageProgress) {
    return project.progress;
  }
  return project.stageProgress[project.status] || 0;
}

// Helper untuk update progress tahapan tertentu
export function updateStageProgress(
  project: TVProject,
  newProgress: number
): StageProgress {
  const stageProgress = project.stageProgress || {
    "pre-produksi": 0,
    shooting: 0,
    editing: 0,
    selesai: 0,
    payment: 0
  };

  return {
    ...stageProgress,
    [project.status]: newProgress
  };
}

// Helper untuk mendapatkan progress saat pindah tahapan
export function getProgressForNewStage(
  project: TVProject,
  newStatus: ProjectStatus
): number {
  // Jika ada stageProgress, ambil progress dari tahapan tujuan
  if (project.stageProgress) {
    return project.stageProgress[newStatus] || 0;
  }

  // Fallback ke progress umum
  return project.progress;
}
