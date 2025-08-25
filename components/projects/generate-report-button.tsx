"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { FileText, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface GenerateReportButtonProps {
  projectId: string
}

export function GenerateReportButton({ projectId }: GenerateReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const generateReport = async () => {
    setIsGenerating(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Generate mock report data (in real app, this would call your analysis API)
      const mockReportData = {
        conversion_rates: [100, 87, 74, 61, 48, 42],
        drop_off_points: [0, 13, 13, 13, 13, 6],
        total_users: Math.floor(Math.random() * 50000) + 10000,
        completion_rate: 42,
        step_names: [], // Will be filled from project data
      }

      const { error } = await supabase.from("funnel_reports").insert({
        project_id: projectId,
        report_data: mockReportData,
        user_id: user.id,
      })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={generateReport} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700">
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">Last updated: {new Date().toLocaleDateString()}</div>
    </div>
  )
}
