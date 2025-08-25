import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, reportData } = await request.json()

    if (!projectId || !reportData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Generate AI insights using Groq
    const prompt = `
    Analyze this onboarding funnel data and provide actionable insights:

    Project: ${project.name}
    Steps: ${project.funnel_steps.join(" → ")}
    
    Funnel Data:
    - Total Users: ${reportData.total_users.toLocaleString()}
    - Completion Rate: ${reportData.completion_rate}%
    - Conversion Rates by Step: ${reportData.conversion_rates.join("%, ")}%
    - Drop-off Rates by Step: ${reportData.drop_off_points.join("%, ")}%

    Please provide 3-5 specific, actionable insights in the following format:
    1. **Insight Type** (Optimization/Pattern/Recommendation): Brief title
       - Analysis: Detailed explanation of what the data shows
       - Action: Specific recommendation to improve this step
       - Impact: Expected improvement if implemented
       - Confidence: High/Medium/Low

    Focus on the biggest drop-off points and provide concrete suggestions for improvement.
    `

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt,
      maxTokens: 1000,
    })

    // Parse the AI response and create structured insights
    const insights = parseAIResponse(text, projectId, user.id)

    // Save insights to database
    const { error: insertError } = await supabase.from("ai_insights").insert(insights)

    if (insertError) {
      console.error("Error saving insights:", insertError)
      return NextResponse.json({ error: "Failed to save insights" }, { status: 500 })
    }

    return NextResponse.json({ insights, rawResponse: text })
  } catch (error) {
    console.error("Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

function parseAIResponse(text: string, projectId: string, userId: string) {
  // Simple parsing logic - in production, you'd want more robust parsing
  const insights = []
  const sections = text.split(/\d+\.\s*\*\*/).slice(1) // Split by numbered items

  for (const section of sections) {
    const lines = section.split("\n").filter((line) => line.trim())
    if (lines.length === 0) continue

    const titleLine = lines[0]
    const typeMatch = titleLine.match(/$$(Optimization|Pattern|Recommendation)$$/)
    const type = typeMatch ? typeMatch[1].toLowerCase() : "recommendation"
    const title = titleLine
      .replace(/$$.*?$$/, "")
      .replace(/\*\*/g, "")
      .trim()

    // Extract confidence from the text
    const confidenceMatch = section.match(/Confidence:\s*(High|Medium|Low)/i)
    const confidence = confidenceMatch
      ? confidenceMatch[1].toLowerCase() === "high"
        ? 0.9
        : confidenceMatch[1].toLowerCase() === "medium"
          ? 0.7
          : 0.5
      : 0.8

    insights.push({
      project_id: projectId,
      insight_type: type,
      content: section.trim(),
      confidence_score: confidence,
      user_id: userId,
    })
  }

  return insights
}
