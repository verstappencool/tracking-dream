"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-slate-950 border-slate-800 text-white shadow-xl",
          title: "text-white font-medium",
          description: "text-slate-300",
          actionButton: "bg-blue-600 text-white hover:bg-blue-700",
          cancelButton: "bg-slate-700 text-white hover:bg-slate-600",
          error: "bg-slate-950 border-red-500/30 text-white",
          success: "bg-slate-950 border-emerald-500/30 text-white",
          warning: "bg-slate-950 border-amber-500/30 text-white",
          info: "bg-slate-950 border-blue-500/30 text-white",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-blue-400" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
