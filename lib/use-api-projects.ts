import { useState, useEffect } from "react";
import { TVProject } from "./types";
import { fetchProjectsWithEpisodes } from "./api/projects";
import { transformApiDataToTVProjects } from "./api/transformers";

/**
 * Custom hook to fetch and transform API data to TVProject format
 * for live-v2 page with auto-refresh
 */
export function useApiProjects(refreshInterval = 5000) {
    const [projects, setProjects] = useState<TVProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const { projects: apiProjects, allEpisodes, allMilestones } = await fetchProjectsWithEpisodes();
            const transformedProjects = transformApiDataToTVProjects(apiProjects, allEpisodes, allMilestones);

            setProjects(transformedProjects);
        } catch (err) {
            console.error("Error fetching API projects:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch projects");
            setProjects([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Auto-refresh polling
    useEffect(() => {
        if (!refreshInterval) return;

        const interval = setInterval(() => {
            fetchData();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    return { projects, loading, error, refetch: fetchData };
}
