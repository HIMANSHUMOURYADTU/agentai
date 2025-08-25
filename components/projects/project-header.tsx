import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/types/database"

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <Badge variant="secondary">{project.funnel_steps.length} steps</Badge>
          </div>

          {project.description && <p className="text-gray-600 mb-4">{project.description}</p>}

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Created {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/dashboard/projects/${project.id}/analyze`}>Run Analysis</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Funnel Steps</h3>
        <div className="flex flex-wrap gap-2">
          {project.funnel_steps.map((step, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {index + 1}. {step}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
