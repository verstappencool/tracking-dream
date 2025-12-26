"use client";

import { TVProject } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
  projects: TVProject[];
}

export function StatsCards({ projects }: StatsCardsProps) {
  const totalProjects = projects.length;
  const prosesCount = projects.filter(p => p.status === "proses").length;
  const selesaiCount = projects.filter(p => p.status === "selesai").length;
  
  const urgentCount = projects.filter(p => p.priority === "urgent" || p.priority === "high").length;
  
  const today = new Date();
  const overdueCount = projects.filter(p => {
    const dueDate = new Date(p.dueDate);
    return dueDate < today && p.status !== "selesai";
  }).length;

  const stats = [
    {
      label: "Total Project",
      value: totalProjects,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      label: "Dalam Proses",
      value: prosesCount,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      label: "Selesai",
      value: selesaiCount,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      label: "Perlu Perhatian",
      value: overdueCount + urgentCount,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.label}
          className={cn(
            "border transition-all duration-300 hover:shadow-md",
            stat.borderColor,
            stat.bgColor
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                stat.bgColor
              )}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
