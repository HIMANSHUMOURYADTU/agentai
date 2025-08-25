import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get API key from headers for external integrations
    const apiKey = request.headers.get("x-api-key")
    const authHeader = request.headers.get("authorization")

    let user = null

    if (authHeader?.startsWith("Bearer ")) {
      // Handle JWT token authentication
      const token = authHeader.substring(7)
      const { data, error } = await supabase.auth.getUser(token)
      if (!error && data.user) {
        user = data.user
      }
    } else if (apiKey) {
      // Handle API key authentication (you'd implement API key validation here)
      return NextResponse.json({ error: "API key authentication not implemented" }, { status: 501 })
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { project_id, funnel_data } = await request.json()

    if (!project_id || !funnel_data) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Validate funnel_data structure
    const requiredFields = ["step_completions", "total_users", "timestamp"]
    for (const field of requiredFields) {
      if (!(field in funnel_data)) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .eq("user_id", user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Process the funnel data and calculate metrics
    const processedData = processFunnelData(funnel_data, project.funnel_steps)

    // Create a new report
    const { data: report, error } = await supabase
      .from("funnel_reports")
      .insert({
        project_id,
        report_data: processedData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Data ingested successfully",
        report_id: report.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Data ingestion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function processFunnelData(funnelData: any, funnelSteps: string[]) {
  const { step_completions, total_users } = funnelData

  // Calculate conversion rates and drop-off points
  const conversionRates = []
  const dropOffPoints = []

  for (let i = 0; i < funnelSteps.length; i++) {
    const completions = step_completions[i] || 0
    const conversionRate = total_users > 0 ? (completions / total_users) * 100 : 0
    conversionRates.push(Math.round(conversionRate * 100) / 100)

    if (i > 0) {
      const previousCompletions = step_completions[i - 1] || 0
      const dropOff = previousCompletions > 0 ? ((previousCompletions - completions) / previousCompletions) * 100 : 0
      dropOffPoints.push(Math.round(dropOff * 100) / 100)
    } else {
      dropOffPoints.push(0)
    }
  }

  const completionRate = conversionRates[conversionRates.length - 1] || 0

  return {
    conversion_rates: conversionRates,
    drop_off_points: dropOffPoints,
    total_users,
    completion_rate: completionRate,
    step_names: funnelSteps,
    ingested_at: new Date().toISOString(),
  }
}
