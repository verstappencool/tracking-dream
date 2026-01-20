export type ProjectStatus =
  | "pre-produksi" // Tahap Pre-Produksi
  | "shooting"      // Tahap Shooting
  | "editing"       // Tahap Editing
  | "selesai"       // Selesai Produksi
  | "payment";      // Status Pembayaran

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface StageProgress {
  "pre-produksi": number;
  shooting: number;
  editing: number;
  selesai: number;
  payment: number;
}

export interface TVProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  genre: string;
  episode?: number;
  season?: number;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  thumbnail?: string;
  progress: number; // Progress dari tahapan aktif
  stageProgress?: StageProgress; // Progress per tahapan
  notes?: string;
}

export interface ProductionLog {
  stage: ProjectStatus;
  timestamp: string;
  duration?: number; // in minutes
  notes?: string;
}

export interface TVProject {
  id: string;
  title: string;
  subtitle?: string; // Subtitle/episode name (e.g., "Episode Ngaliyan SD")
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  genre: string;
  episode?: number;
  season?: number;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  thumbnail?: string;
  progress: number;
  notes?: string;
  channel?: string; // TV Channel
  airTime?: string; // Jam tayang
  editor?: string; // Nama editor yang menangani
  logs?: ProductionLog[]; // Production timeline
  // Archive system
  isArchived?: boolean; // Apakah project sudah diarchive
  archivedAt?: string; // Tanggal archive
  archivedBy?: string; // Siapa yang archive
  // Payment system
  isPaid?: boolean; // Status pembayaran: true = sudah bayar, false = belum bayar
  paidAt?: string; // Tanggal pembayaran
}

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

// API Response Types
export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface Investor {
  id: number;
  name: string;
  email: string;
}

export interface Episode {
  id: number;
  title: string;
  episode_number: number;
  status: string;
}

export interface Milestone {
  id: number;
  phase_category: string;
  work_status: string;
}

export type ProjectType = "Movie" | "Series" | "TVC";
export type GlobalStatus = "Draft" | "In Progress" | "Completed" | "Cancelled";

export interface Project {
  id: number;
  title: string;
  client_id: number | null;
  client_name: string;
  investor_id: number | null;
  investor_name: string;
  type: ProjectType;
  total_budget_plan: string;
  target_income: string;
  start_date: string;
  deadline_date: string;
  description: string;
  global_status: GlobalStatus;
  created_at: string;
  updated_at: string;
  client: Client | null;
  investor: Investor | null;
  episodes: Episode[];
  milestones: Milestone[];
}

export interface ProjectsAPIResponse {
  success: boolean;
  count: number;
  data: Project[];
}
