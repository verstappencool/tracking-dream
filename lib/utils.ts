import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TVProject, ProjectStatus, StageProgress, MilestoneDetail } from "@/types/project";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mapping status ke phase_category untuk perhitungan progress
export const STATUS_TO_PHASE: Record<ProjectStatus, string | null> = {
  "pre-produksi": "Pre-Production",
  "shooting": "Production",
  "editing": "Post-Production",
  "selesai": "Post-Production",
  "payment": null,
};

// Bobot persentase untuk setiap work_status
const WORK_STATUS_WEIGHT: Record<string, number> = {
  "Done": 100,
  "Waiting Approval": 75,
  "In Progress": 50,
  "Pending": 0,
};

// Helper untuk menghitung progress berdasarkan milestones
export function calculateProgressFromMilestones(
  milestones: MilestoneDetail[],
  status: ProjectStatus,
  episodeId?: number
): number {
  const targetPhase = STATUS_TO_PHASE[status];


  if (!targetPhase) {
    return 0;
  }

  // Filter milestones berdasarkan episode dan phase
  let filteredMilestones = milestones.filter(
    m => m.phase_category === targetPhase
  );

  if (episodeId) {
    filteredMilestones = filteredMilestones.filter(m => m.episode_id === episodeId);
  }

  // Untuk pre-produksi: progress hanya dihitung dari milestone milik producer
  if (status === "pre-produksi") {
    const producerMilestones = filteredMilestones.filter(m => m.user?.role === "producer");
    // Jika ada milestone producer, gunakan itu; jika tidak ada, fallback ke semua (backward compatible)
    if (producerMilestones.length > 0) {
      filteredMilestones = producerMilestones;
    }
  }

  // Jika tidak ada milestones, return 0
  if (filteredMilestones.length === 0) {
    return 0;
  }

  // Hitung total bobot dari semua milestones
  const totalWeight = filteredMilestones.reduce((sum, m) => {
    const weight = WORK_STATUS_WEIGHT[m.work_status] ?? 0;
    return sum + weight;
  }, 0);

  // Hitung persentase (total bobot / (jumlah orang * 100))
  const maxWeight = filteredMilestones.length * 100;
  const percentage = Math.round((totalWeight / maxWeight) * 100);

  return percentage;
}

// Helper untuk mendapatkan progress dari tahapan yang sedang aktif
export function getCurrentStageProgress(project: TVProject, milestones?: MilestoneDetail[]): number {
  // Jika ada milestones, hitung progress dari milestones
  if (milestones && milestones.length > 0) {
    const calculatedProgress = calculateProgressFromMilestones(
      milestones,
      project.status,
      project.episodeId
    );

    // Jika ada hasil perhitungan, gunakan itu
    if (calculatedProgress > 0 || project.status === "pre-produksi" || project.status === "shooting" || project.status === "editing") {
      return calculatedProgress;
    }
  }

  // Fallback ke stageProgress dari database
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
