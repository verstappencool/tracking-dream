import { tvApiClient } from "./client";
import type {
    ProjectsAPIResponse,
    EpisodesAPIResponse,
    MilestonesAPIResponse,
    Project,
    Episode,
    MilestoneDetail,
} from "@/types/project";

/**
 * Fetch all projects from API
 */
export async function fetchProjects(): Promise<Project[]> {
    try {
        const response = await tvApiClient.get<ProjectsAPIResponse>("/projects");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

/**
 * Fetch episodes for a specific project
 */
export async function fetchEpisodes(projectId: number): Promise<Episode[]> {
    try {
        const response = await tvApiClient.get<EpisodesAPIResponse>("/episodes", {
            params: { project_id: projectId },
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching episodes for project ${projectId}:`, error);
        return [];
    }
}

/**
 * Fetch milestones for a specific project
 */
export async function fetchMilestones(projectId: number): Promise<MilestoneDetail[]> {
    try {
        const response = await tvApiClient.get<MilestonesAPIResponse>("/milestones", {
            params: { project_id: projectId },
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching milestones for project ${projectId}:`, error);
        return [];
    }
}

/**
 * Fetch all projects with their episodes and milestones
 * This combines projects, episodes, and milestones data
 */
export async function fetchProjectsWithEpisodes(): Promise<{
    projects: Project[];
    allEpisodes: Map<number, Episode[]>;
    allMilestones: Map<number, MilestoneDetail[]>;
}> {
    try {
        const projects = await fetchProjects();
        const allEpisodes = new Map<number, Episode[]>();
        const allMilestones = new Map<number, MilestoneDetail[]>();

        // Fetch episodes and milestones for each project in parallel
        await Promise.all(
            projects.map(async (project) => {
                const episodes = await fetchEpisodes(project.id);
                const milestones = await fetchMilestones(project.id);
                allEpisodes.set(project.id, episodes);
                allMilestones.set(project.id, milestones);
            })
        );

        return { projects, allEpisodes, allMilestones };
    } catch (error) {
        console.error("Error fetching projects with episodes:", error);
        return { projects: [], allEpisodes: new Map(), allMilestones: new Map() };
    }
}
