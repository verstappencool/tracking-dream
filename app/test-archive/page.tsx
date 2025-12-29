"use client";

import { useState } from "react";
import { TVProject, STATUS_CONFIG } from "@/lib/types";
import { sampleProjects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Archive, ArchiveRestore, Trash2, Home, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function TestArchivePage() {
  // Initialize dengan sample data
  const [projects, setProjects] = useState<TVProject[]>(() => 
    sampleProjects.map(p => ({ ...p, isArchived: false }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "archived">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "year" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Date filter helpers
  const isDateInRange = (dateString: string, range: typeof dateFilter) => {
    if (range === "all") return true;
    
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (range === "custom") {
      if (!customStartDate && !customEndDate) return true;
      
      const start = customStartDate ? new Date(customStartDate) : new Date(0);
      const end = customEndDate ? new Date(customEndDate) : new Date();
      end.setHours(23, 59, 59, 999); // Include full end date
      
      return date >= start && date <= end;
    }
    
    switch (range) {
      case "today":
        return date >= today;
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date >= monthAgo;
      case "year":
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return date >= yearAgo;
      default:
        return true;
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.editor?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchFilter = 
      filterStatus === "all" ? true :
      filterStatus === "active" ? !p.isArchived :
      p.isArchived;
    
    // Date filter: check archivedAt for archived projects, createdAt for active
    const dateToCheck = p.isArchived && p.archivedAt ? p.archivedAt : p.createdAt;
    const matchDate = isDateInRange(dateToCheck, dateFilter);
    
    return matchSearch && matchFilter && matchDate;
  });

  const activeCount = projects.filter(p => !p.isArchived).length;
  const archivedCount = projects.filter(p => p.isArchived).length;

  // Archive project
  const handleArchive = (id: string) => {
    setProjects(prev => 
      prev.map(p => 
        p.id === id 
          ? { 
              ...p, 
              isArchived: true,
              archivedAt: new Date().toISOString(),
              archivedBy: "Admin Test"
            } 
          : p
      )
    );
  };

  // Restore project
  const handleRestore = (id: string) => {
    setProjects(prev => 
      prev.map(p => 
        p.id === id 
          ? { 
              ...p, 
              isArchived: false,
              archivedAt: undefined,
              archivedBy: undefined
            } 
          : p
      )
    );
  };

  // Delete permanent (optional)
  const handleDelete = (id: string) => {
    if (confirm("Yakin mau delete permanent? Data akan hilang selamanya!")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
                <Archive className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">PROJECT ARCHIVE MANAGEMENT</h1>
                <p className="text-xs text-slate-400">
                  Total: {projects.length} • Active: {activeCount} • Archived: {archivedCount}
                </p>
              </div>
            </div>

            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Back Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title, subtitle, or editor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFilterStatus("all")}
                className={cn(
                  "border-slate-700",
                  filterStatus === "all" 
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                All ({projects.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFilterStatus("active")}
                className={cn(
                  "border-slate-700",
                  filterStatus === "active" 
                    ? "bg-green-600 text-white border-green-600 hover:bg-green-700" 
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                📂 Active ({activeCount})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFilterStatus("archived")}
                className={cn(
                  "border-slate-700",
                  filterStatus === "archived" 
                    ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700" 
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                🗄️ Archived ({archivedCount})
              </Button>
            </div>
          </div>

          {/* Date Filter Row */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-800">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 mr-2">Time Range:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDateFilter("all")}
                className={cn(
                  "border-slate-700 h-7 text-xs",
                  dateFilter === "all" 
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                All Time
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDateFilter("today")}
                className={cn(
                  "border-slate-700 h-7 text-xs",
                  dateFilter === "today" 
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                📅 Today
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDateFilter("week")}
                className={cn(
                  "border-slate-700 h-7 text-xs",
                  dateFilter === "week" 
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                📆 This Week
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDateFilter("month")}
                className={cn(
                  "border-slate-700 h-7 text-xs",
                  dateFilter === "month" 
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                🗓️ This Month
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDateFilter("year")}
                className={cn(
                  "border-slate-700 h-7 text-xs",
                  dateFilter === "year" 
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                📊 This Year
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDateFilter("custom")}
                className={cn(
                  "border-slate-700 h-7 text-xs",
                  dateFilter === "custom" 
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                🎯 Custom Range
              </Button>
            </div>
            <span className="text-xs text-slate-500 ml-auto">
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
          </div>

          {/* Custom Date Range Picker */}
          {dateFilter === "custom" && (
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/30 border-t border-slate-700">
              <span className="text-xs text-slate-400">Custom Range:</span>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <label className="text-xs text-slate-500 mb-1">From Date</label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="h-8 text-xs bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <span className="text-slate-500 mt-5">→</span>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-500 mb-1">To Date</label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="h-8 text-xs bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCustomStartDate("");
                    setCustomEndDate("");
                  }}
                  className="border-slate-600 text-slate-400 hover:bg-slate-700 h-8 mt-5 text-xs"
                >
                  Clear
                </Button>
              </div>
              {(customStartDate || customEndDate) && (
                <span className="text-xs text-green-400 ml-auto">
                  ✓ Filtering: {customStartDate || "Start"} → {customEndDate || "Now"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table View */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-slate-800/50 border-b border-slate-700">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-slate-300 uppercase">
              <div className="col-span-3">Project Info</div>
              <div className="col-span-2">Details</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2">Editor/Channel</div>
              <div className="col-span-1 text-center">Progress</div>
              <div className="col-span-2">Archive Info</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-800">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                {searchQuery ? "No projects found matching your search" : "No projects yet"}
              </div>
            ) : (
              filteredProjects.map((project) => {
                const config = STATUS_CONFIG[project.status];
                
                return (
                  <div
                    key={project.id}
                    className={cn(
                      "grid grid-cols-12 gap-4 px-4 py-4 hover:bg-slate-800/30 transition-colors",
                      project.isArchived && "bg-slate-800/20"
                    )}
                  >
                    {/* Project Info */}
                    <div className="col-span-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">{config.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm truncate">
                            {project.title}
                          </h3>
                          {project.subtitle && (
                            <p className="text-xs text-slate-400 truncate">
                              📺 {project.subtitle}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-0.5">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="col-span-2 text-sm text-slate-300">
                      {project.episode ? (
                        <p className="text-xs">
                          Season {project.season} • Episode {project.episode}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500">-</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">{project.genre}</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center justify-center">
                      <Badge 
                        className={cn(
                          "text-xs border-0",
                          config.bgColor,
                          config.color
                        )}
                      >
                        {config.label}
                      </Badge>
                    </div>

                    {/* Editor/Channel */}
                    <div className="col-span-2 text-sm">
                      <p className="text-white text-xs truncate">
                        ✂️ {project.editor || "-"}
                      </p>
                      <p className="text-slate-400 text-xs truncate mt-1">
                        📡 {project.channel || "-"}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="w-full max-w-[80px]">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all", config.bgColor)}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 text-center mt-1">
                          {project.progress}%
                        </p>
                      </div>
                    </div>

                    {/* Archive Info */}
                    <div className="col-span-2">
                      {project.isArchived && project.archivedAt ? (
                        <div className="text-xs">
                          <p className="text-orange-400 font-medium">
                            🗄️ ARCHIVED
                          </p>
                          <p className="text-slate-500 mt-1">
                            By: {project.archivedBy}
                          </p>
                          <p className="text-slate-500">
                            {new Date(project.archivedAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-green-400 font-medium">
                          ✓ ACTIVE
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-center gap-1">
                      {!project.isArchived ? (
                        <Button
                          size="sm"
                          onClick={() => handleArchive(project.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white h-7 px-2 text-xs"
                          title="Archive"
                        >
                          <Archive className="w-3 h-3" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleRestore(project.id)}
                            className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs"
                            title="Restore"
                          >
                            <ArchiveRestore className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(project.id)}
                            className="h-7 w-7 p-0"
                            title="Delete Permanent"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 p-4 bg-blue-950/30 border border-blue-900/30 rounded-lg">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-300 text-sm">
            <div>
              <p className="font-medium text-white mb-1">🔍 Search</p>
              <p className="text-xs">Cari berdasarkan title, subtitle, atau editor name</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">📊 Status Filter</p>
              <p className="text-xs">Filter All, Active, atau Archived projects</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">📅 Date Filter</p>
              <p className="text-xs">Filter berdasarkan hari ini, minggu, bulan, atau tahun</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">⚡ Actions</p>
              <p className="text-xs">Archive, Restore, atau Delete dengan 1 klik</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
