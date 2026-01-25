import { useState, useEffect } from "react";
import type { TVProject } from "@/types/project";
import { sampleProjects } from "./data";

const STORAGE_KEY = "dreamlight-projects";

// Get projects from localStorage or use sample data
export function getStoredProjects(): TVProject[] {
  if (typeof window === "undefined") return sampleProjects;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading projects:", error);
  }

  // Initialize with sample data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProjects));
  return sampleProjects;
}

// Save projects to localStorage
export function saveProjects(projects: TVProject[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    // Trigger storage event for other tabs/windows
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Error saving projects:", error);
  }
}

// Hook for managing projects with real-time sync
export function useProjects() {
  const [projects, setProjects] = useState<TVProject[]>([]);

  // Load initial data
  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      setProjects(getStoredProjects());
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen to custom event for same-tab updates
    window.addEventListener("projects-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("projects-updated", handleStorageChange);
    };
  }, []);

  // Update projects and save to storage
  const updateProjects = (newProjects: TVProject[] | ((prev: TVProject[]) => TVProject[])) => {
    setProjects((prev) => {
      const updated = typeof newProjects === "function" ? newProjects(prev) : newProjects;
      saveProjects(updated);
      // Trigger custom event for same-tab sync
      window.dispatchEvent(new Event("projects-updated"));
      return updated;
    });
  };

  return { projects, setProjects: updateProjects };
}

// Hook for live/read-only view with polling
export function useLiveProjects(interval = 1000) {
  const [projects, setProjects] = useState<TVProject[]>([]);

  useEffect(() => {
    // Initial load
    setProjects(getStoredProjects());

    // Poll for changes
    const timer = setInterval(() => {
      setProjects(getStoredProjects());
    }, interval);

    // Also listen to storage events
    const handleStorageChange = () => {
      setProjects(getStoredProjects());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("projects-updated", handleStorageChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("projects-updated", handleStorageChange);
    };
  }, [interval]);

  return projects;
}
