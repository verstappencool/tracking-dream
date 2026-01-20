import type { Project, Episode, Milestone, MilestoneDetail } from "@/types/project";
import type { TVProject, ProjectStatus } from "@/lib/types";

/**
 * Map episode status to kanban column status
 */
export function mapEpisodeStatusToKanban(episodeStatus: string): ProjectStatus {
    const statusMap: Record<string, ProjectStatus> = {
        "Scripting": "pre-produksi",
        "Pre-Production": "pre-produksi",
        "Filming": "shooting",
        "Shooting": "shooting",
        "Editing": "editing",
        "Post-Production": "editing",
        "Preview Ready": "selesai",
        "Master Ready": "payment",  // Master Ready langsung ke Payment
        "Completed": "selesai",
        "Done": "selesai",
        "Payment": "payment",
        "Paid": "payment",
    };

    return statusMap[episodeStatus] || "pre-produksi";
}

/**
 * Calculate progress percentage from milestones
 */
export function calculateProgressFromMilestones(milestones: Milestone[]): number {
    if (!milestones || milestones.length === 0) return 0;

    const doneCount = milestones.filter((m) => m.work_status === "Done").length;
    const totalCount = milestones.length;

    return Math.round((doneCount / totalCount) * 100);
}

/**
 * Check if all staff for an episode have been paid
 */
export function checkEpisodeFullyPaid(
    episodeId: number,
    projectMilestones: MilestoneDetail[]
): boolean {
    // Filter milestones untuk episode ini
    const episodeMilestones = projectMilestones.filter(m => m.episode_id === episodeId);

    // Jika tidak ada milestone, return false
    if (episodeMilestones.length === 0) return false;

    // Cek apakah SEMUA milestone sudah paid
    return episodeMilestones.every(m => m.payment_status === "Paid");
}

/**
 * Transform API Episode to TVProject
 */
export function transformEpisodeToTVProject(
    episode: Episode,
    projectTitle: string,
    projectType: string,
    projectMilestones: MilestoneDetail[] = []
): TVProject {
    const status = mapEpisodeStatusToKanban(episode.status);
    const progress = calculateProgressFromMilestones(episode.milestones);
    const isPaid = checkEpisodeFullyPaid(episode.id, projectMilestones);

    return {
        id: `ep-${episode.id}`,
        title: projectTitle,
        subtitle: episode.title,
        description: episode.synopsis || "",
        status,
        priority: "medium",
        genre: projectType,
        episode: episode.episode_number,
        season: 1,
        assignedTo: "Production Team",
        dueDate: episode.airing_date,
        createdAt: episode.created_at,
        progress,
        stageProgress: {
            "pre-produksi": status === "pre-produksi" ? progress : status === "shooting" || status === "editing" || status === "selesai" || status === "payment" ? 100 : 0,
            shooting: status === "shooting" ? progress : status === "editing" || status === "selesai" || status === "payment" ? 100 : 0,
            editing: status === "editing" ? progress : status === "selesai" || status === "payment" ? 100 : 0,
            selesai: status === "selesai" ? progress : status === "payment" ? 100 : 0,
            payment: status === "payment" ? progress : 0,
        },
        isPaid,
        channel: undefined,
        airTime: undefined,
        editor: undefined,
        notes: undefined,
        logs: [],
    };
}

/**
 * Transform API Project (Movie/TVC without episodes) to TVProject
 */
export function transformProjectToTVProject(project: Project): TVProject {
    // For movies/TVC, use global_status to determine kanban column
    const statusMap: Record<string, ProjectStatus> = {
        "Draft": "pre-produksi",
        "In Progress": "shooting",
        "Completed": "selesai",
        "Cancelled": "selesai",
    };

    const status = statusMap[project.global_status] || "pre-produksi";
    const progress = calculateProgressFromMilestones(project.milestones);

    return {
        id: `proj-${project.id}`,
        title: project.title,
        subtitle: undefined,
        description: project.description,
        status,
        priority: "medium",
        genre: project.type,
        episode: undefined,
        season: undefined,
        assignedTo: project.client_name || "Internal Team",
        dueDate: project.deadline_date,
        createdAt: project.created_at,
        progress,
        stageProgress: {
            "pre-produksi": status === "pre-produksi" ? progress : status === "shooting" || status === "editing" || status === "selesai" || status === "payment" ? 100 : 0,
            shooting: status === "shooting" ? progress : status === "editing" || status === "selesai" || status === "payment" ? 100 : 0,
            editing: status === "editing" ? progress : status === "selesai" || status === "payment" ? 100 : 0,
            selesai: status === "selesai" ? progress : status === "payment" ? 100 : 0,
            payment: status === "payment" ? progress : 0,
        },
        channel: undefined,
        airTime: undefined,
        editor: undefined,
        notes: undefined,
        logs: [],
    };
}

/**
 * Transform all API data to TVProject array
 * - Series: Each episode becomes a separate TVProject
 * - Movie/TVC: Project itself becomes a TVProject
 */
export function transformApiDataToTVProjects(
    projects: Project[],
    episodesMap: Map<number, Episode[]>,
    milestonesMap: Map<number, MilestoneDetail[]> = new Map()
): TVProject[] {
    const tvProjects: TVProject[] = [];

    projects.forEach((project) => {
        const episodes = episodesMap.get(project.id) || [];
        const milestones = milestonesMap.get(project.id) || [];

        if (project.type === "Series" && episodes.length > 0) {
            // For series, create one TVProject per episode
            episodes.forEach((episode) => {
                tvProjects.push(transformEpisodeToTVProject(episode, project.title, project.type, milestones));
            });
        } else {
            // For Movie/TVC or Series without episodes, create one TVProject
            tvProjects.push(transformProjectToTVProject(project));
        }
    });

    return tvProjects;
}
