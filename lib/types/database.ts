// Database type definitions for the onboarding analyzer
export interface Project {
  id: string
  name: string
  description?: string
  funnel_steps: string[] // Array of step names
  created_at: string
  updated_at: string
  user_id: string
}

export interface FunnelReport {
  id: string
  project_id: string
  report_data: {
    conversion_rates: number[]
    drop_off_points: number[]
    total_users: number
    completion_rate: number
    step_names: string[]
  }
  generated_at: string
  user_id: string
}

export interface AIInsight {
  id: string
  project_id: string
  funnel_report_id?: string
  insight_type: "optimization" | "pattern" | "recommendation"
  content: string
  confidence_score?: number
  generated_at: string
  user_id: string
}
