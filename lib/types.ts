// Re-export canonical project/API types from types/project.ts
export * from "@/types/project";

import type { ProjectStatus, ProjectPriority } from "@/types/project";

export const STATUS_CONFIG: Record<ProjectStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  step: number;
  icon: string;
}> = {
  "pre-produksi": {
    label: "PRE-PRODUKSI",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    step: 1,
    icon: "📋"
  },
  shooting: {
    label: "SHOOTING",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    step: 2,
    icon: "🎬"
  },
  editing: {
    label: "EDITING",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    step: 3,
    icon: "✂️"
  },
  selesai: {
    label: "SELESAI",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    step: 4,
    icon: "✅"
  },
  payment: {
    label: "PAYMENT",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    step: 5,
    icon: "💰"
  },
};

export const PRIORITY_CONFIG: Record<ProjectPriority, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  low: {
    label: "Rendah",
    color: "text-slate-600",
    bgColor: "bg-slate-100"
  },
  medium: {
    label: "Sedang",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  high: {
    label: "Tinggi",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  urgent: {
    label: "Urgent",
    color: "text-red-600",
    bgColor: "bg-red-100"
  }
};

export const GENRE_LIST = [
  "Drama",
  "Sinetron",
  "Komedi",
  "Dokumenter",
  "Reality Show",
  "Talk Show",
  "Berita",
  "Variety Show",
  "Kuliner",
  "Musik",
  "Olahraga",
  "Anak-anak",
  "Religi",
  "Film"
];
