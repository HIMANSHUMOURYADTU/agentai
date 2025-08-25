import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectGrid } from "@/components/dashboard/project-grid"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Fetch recent reports for stats
  const { data: reports } = await supabase
    .from("funnel_reports")
    .select("*")
    .eq("user_id", data.user.id)
    .order("generated_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your onboarding funnel projects</p>
          </div>
          <CreateProjectDialog />
        </div>

        <DashboardStats projects={projects || []} reports={reports || []} />

        <div className="mt-8">
          <ProjectGrid projects={projects || []} />
        </div>
      </main>
    </div>
  )
}
