export interface Client {
    id: number;
    name: string;
    email: string;
    role?: string;
}

export interface Investor {
    id: number;
    name: string;
    email: string;
    role?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface ProjectBasicInfo {
    id: number;
    title: string;
}

export interface ProjectMilestoneInfo {
    id: number;
    title: string;
    deadline_date: string;
}

export interface ProjectInfo {
    id: number;
    title: string;
    type: ProjectType;
}

export interface Episode {
    id: number;
    project_id: number;
    title: string;
    episode_number: number;
    status: string;
    synopsis: string;
    airing_date: string;
    created_at: string;
    updated_at: string;
    project: ProjectInfo;
    milestones: Milestone[];
}

export interface Milestone {
    id: number;
    phase_category: string;
    work_status: string;
}

export interface MilestoneDetail {
    id: number;
    project_id: number;
    episode_id: number | null;
    user_id: number;
    task_name: string;
    phase_category: string;
    work_status: string;
    honor_amount: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
    user: User;
    project: ProjectMilestoneInfo;
    episode: Episode | null;
}

export interface Finance {
    id: number;
    project_id: number;
    type: "Income" | "Expense";
    category: string;
    amount: string;
    transaction_date: string;
    description: string;
    status: "Received" | "Paid" | "Pending" | "Cancelled";
    created_at: string;
    updated_at: string;
    project: ProjectBasicInfo;
}

export interface FinanceSummary {
    totalExpense: number;
    totalIncome: number;
}

export interface Asset {
    id: number;
    project_id: number;
    name: string;
    type: string;
    file_path: string;
    file_size: number;
    created_at: string;
    updated_at: string;
}

export interface ProgressStats {
    "Pre-Production": number;
    "Production": number;
    "Post-Production": number;
}

export type ProjectType = "Movie" | "Series" | "TVC";
export type GlobalStatus = "Draft" | "In Progress" | "Completed" | "Cancelled";

// Shared enums / helper types used by the UI
export type ProjectStatus =
    | "pre-produksi"
    | "shooting"
    | "editing"
    | "selesai"
    | "payment";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface StageProgress {
    "pre-produksi": number;
    shooting: number;
    editing: number;
    selesai: number;
    payment: number;
}

export interface ProductionLog {
    stage: ProjectStatus;
    timestamp: string;
    duration?: number; // in minutes
    notes?: string;
}

// TVProject is the UI-friendly shape used across live views (one item per episode/project)
export interface TVProject {
    id: string;
    title: string;
    subtitle?: string;
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
    channel?: string;
    airTime?: string;
    editor?: string;
    logs?: ProductionLog[];
    isArchived?: boolean;
    archivedAt?: string;
    archivedBy?: string;
    isPaid?: boolean;
    paidAt?: string;
    // API-related IDs for fetching related data
    projectId?: number;
    episodeId?: number;
    // Optional 
    stageProgress?: StageProgress;
}

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

export interface ProjectDetail extends Project {
    milestones: MilestoneDetail[];
    finances: Finance[];
    assets: Asset[];
    progress_stats: ProgressStats;
}

export interface ProjectDetailAPIResponse {
    success: boolean;
    data: ProjectDetail;
}

export interface EpisodesAPIResponse {
    success: boolean;
    count: number;
    data: Episode[];
}

export interface FinancesAPIResponse {
    success: boolean;
    count: number;
    data: Finance[];
    summary: FinanceSummary;
}

export interface MilestonesAPIResponse {
    success: boolean;
    count: number;
    data: MilestoneDetail[];
}