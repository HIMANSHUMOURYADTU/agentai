import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react"
import type { Project, FunnelReport } from "@/lib/types/database"

interface DashboardStatsProps {
  projects: Project[]
  reports: FunnelReport[]
}

export function DashboardStats({ projects, reports }: DashboardStatsProps) {
  const totalProjects = projects.length
  const recentReports = reports.length
  const avgConversionRate =
    reports.length > 0
      ? reports.reduce((acc, report) => acc + (report.report_data.completion_rate || 0), 0) / reports.length
      : 0

  const aiInsightsCount = Math.min(totalProjects * 3, 25) // Estimate based on projects

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
          <p className="text-xs text-gray-500 mt-1">Active funnel projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Recent Reports</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{recentReports}</div>
          <p className="text-xs text-gray-500 mt-1">Generated this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Avg Conversion</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{avgConversionRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500 mt-1">Across all projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>
          <Zap className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{aiInsightsCount}</div>
          <p className="text-xs text-gray-500 mt-1">Optimization suggestions</p>
        </CardContent>
      </Card>
    </div>
  )
}
