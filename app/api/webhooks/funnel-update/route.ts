import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (implement your webhook security here)
    const signature = request.headers.get("x-webhook-signature")
    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 401 })
    }

    const payload = await request.json()
    const { user_id, project_id, event_type, data } = payload

    if (!user_id || !project_id || !event_type) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify project exists and belongs to user
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .eq("user_id", user_id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    switch (event_type) {
      case "funnel_completion":
        await handleFunnelCompletion(supabase, project, data)
        break
      case "step_completion":
        await handleStepCompletion(supabase, project, data)
        break
      case "user_drop_off":
        await handleUserDropOff(supabase, project, data)
        break
      default:
        return NextResponse.json({ error: "Unknown event type" }, { status: 400 })
    }

    return NextResponse.json({ message: "Webhook processed successfully" })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleFunnelCompletion(supabase: any, project: any, data: any) {
  // Log funnel completion event
  console.log(`Funnel completed for project ${project.id}:`, data)

  // You could trigger additional actions here like:
  // - Send notifications
  // - Update analytics
  // - Trigger AI analysis
}

async function handleStepCompletion(supabase: any, project: any, data: any) {
  // Log step completion event
  console.log(`Step completed for project ${project.id}:`, data)
}

async function handleUserDropOff(supabase: any, project: any, data: any) {
  // Log user drop-off event
  console.log(`User dropped off for project ${project.id}:`, data)

  // Could trigger immediate AI analysis for critical drop-offs
}
