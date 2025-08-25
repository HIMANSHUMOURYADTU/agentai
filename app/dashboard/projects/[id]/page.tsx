import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectHeader } from "@/components/projects/project-header"
import { FunnelChart } from "@/components/projects/funnel-chart"
import { ConversionMetrics } from "@/components/projects/conversion-metrics"
import { DropOffAnalysis } from "@/components/projects/drop-off-analysis"
import { GenerateReportButton } from "@/components/projects/generate-report-button"
import { AIInsightsPanel } from "@/components/projects/ai-insights-panel"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch project details
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (!project) {
    redirect("/dashboard")
  }

  // Fetch latest funnel report
  const { data: latestReport } = await supabase
    .from("funnel_reports")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", data.user.id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single()

  const { data: aiInsights } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", data.user.id)
    .order("generated_at", { ascending: false })
    .limit(10)

  // Generate mock data if no report exists
  const mockReportData = {
    conversion_rates: [100, 85, 72, 58, 45, 38],
    drop_off_points: [0, 15, 13, 14, 13, 7],
    total_users: 10000,
    completion_rate: 38,
    step_names: project.funnel_steps,
  }

  const reportData = latestReport?.report_data || mockReportData

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8">
        <ProjectHeader project={project} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <FunnelChart data={reportData} />
            <DropOffAnalysis data={reportData} />
          </div>

          <div className="space-y-6">
            <ConversionMetrics data={reportData} />
            <GenerateReportButton projectId={project.id} />
            <AIInsightsPanel projectId={project.id} reportData={reportData} existingInsights={aiInsights || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
