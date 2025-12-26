"use client";

import { use, useState, useEffect } from "react";
import { TVProject, STATUS_CONFIG } from "@/lib/types";
import { sampleProjects } from "@/lib/data";
import { ProgressTracker } from "@/components/progress-tracker";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn, getCurrentStageProgress } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  Users,
  Film,
  Calendar,
  Tv,
  CheckCircle,
  Loader2,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<TVProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const found = sampleProjects.find(p => p.id === id);
      setProject(found || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Tv className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Project Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Project dengan ID tersebut tidak ada</p>
          <Link href="/">
            <Button>Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[project.status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tracking Project</p>
                <h1 className="font-semibold text-gray-900">{project.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className={cn(
          "rounded-2xl p-8 mb-8 border-2",
          statusConfig.bgColor,
          statusConfig.borderColor
        )}>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{statusConfig.icon}</div>
            <h2 className={cn("text-2xl font-bold mb-2", statusConfig.color)}>
              {statusConfig.label}
            </h2>
            <p className="text-gray-600">{project.description}</p>
          </div>

          {/* Progress Tracker - Domino Style */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <ProgressTracker project={project} size="lg" />
          </div>

          {/* Progress Bar */}
          {project.status === "proses" && (
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-amber-50">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status Produksi</p>
                  <h3 className="text-xl font-bold text-amber-600">
                    Dalam Proses
                  </h3>
                </div>
              </div>

              {/* Animated Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress {STATUS_CONFIG[project.status].label}</span>
                  <span className="font-semibold text-gray-900">{getCurrentStageProgress(project)}%</span>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-1000",
                      getCurrentStageProgress(project) < 30 ? "bg-red-500" :
                        getCurrentStageProgress(project) < 60 ? "bg-amber-500" :
                          getCurrentStageProgress(project) < 90 ? "bg-blue-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${getCurrentStageProgress(project)}%` }}
                  />
                  {getCurrentStageProgress(project) < 100 && (
                    <div
                      className="absolute inset-y-0 left-0 rounded-full animate-pulse opacity-50 bg-white"
                      style={{ width: `${getCurrentStageProgress(project)}%` }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Completed Badge */}
        {project.status === "selesai" && (
          <div className="bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-200 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-emerald-700 mb-2">
              Project Selesai! 🎉
            </h3>
            <p className="text-emerald-600">
              Tayangan sudah siap untuk disiarkan
            </p>
          </div>
        )}

        {/* Project Details Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Film className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Genre</p>
                <p className="font-semibold text-gray-900">{project.genre}</p>
              </div>
            </div>
          </div>

          {project.episode && (
            <div className="bg-white rounded-xl p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Tv className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Episode</p>
                  <p className="font-semibold text-gray-900">
                    Episode {project.episode} {project.season && `• Season ${project.season}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Users className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tim</p>
                <p className="font-semibold text-gray-900">{project.assignedTo}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Deadline</p>
                <p className="font-semibold text-gray-900">
                  {new Date(project.dueDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {project.notes && (
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-8">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Catatan</p>
                <p className="text-amber-700 mt-1">{project.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t bg-white mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            TV Production Tracker © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
