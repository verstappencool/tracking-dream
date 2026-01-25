import { useState, useEffect } from "react";
import { fetchMilestones } from "./api/projects";
import type { MilestoneDetail } from "@/types/project";

export function useMilestones(projectId: number | undefined, refreshInterval: number = 30000) {
    const [milestones, setMilestones] = useState<MilestoneDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) {
            setMilestones([]);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchMilestones(projectId);
                setMilestones(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch milestones");
                setMilestones([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Auto-refresh
        const interval = setInterval(fetchData, refreshInterval);
        return () => clearInterval(interval);
    }, [projectId, refreshInterval]);

    return { milestones, loading, error };
}
