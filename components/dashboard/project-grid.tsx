import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, BarChart3, Calendar, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { Project } from "@/lib/types/database"

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <Card className="p-12 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-600 mb-6">Create your first onboarding funnel project to get started.</p>
        <Button className="bg-blue-600 hover:bg-blue-700">Create Project</Button>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">{project.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </DropdownMenuItem>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {project.description || "No description provided"}
            </p>

            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="text-xs">
                {project.funnel_steps.length} steps
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button asChild size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href={`/dashboard/projects/${project.id}`}>View Details</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                <Link href={`/dashboard/projects/${project.id}/analyze`}>Analyze</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
