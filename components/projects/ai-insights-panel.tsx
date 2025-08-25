"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, RefreshCw, TrendingUp, Target, Zap } from "lucide-react"
import type { AIInsight } from "@/lib/types/database"

interface AIInsightsPanelProps {
  projectId: string
  reportData: any
  existingInsights?: AIInsight[]
}

export function AIInsightsPanel({ projectId, reportData, existingInsights = [] }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>(existingInsights)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInsights = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, reportData }),
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
      }
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return <TrendingUp className="w-4 h-4" />
      case "pattern":
        return <Target className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "optimization":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "pattern":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-purple-50 text-purple-700 border-purple-200"
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-100 text-green-800"
    if (score >= 0.6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return "High"
    if (score >= 0.6) return "Medium"
    return "Low"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          <Button
            onClick={generateInsights}
            disabled={isGenerating}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
        <CardDescription>AI-powered recommendations to optimize your funnel</CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No insights yet</h3>
            <p className="text-gray-600 mb-4">Generate AI-powered insights to optimize your funnel performance.</p>
            <Button onClick={generateInsights} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Insights"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={insight.id || index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.insight_type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.insight_type)}
                    <Badge variant="secondary" className="capitalize">
                      {insight.insight_type}
                    </Badge>
                  </div>
                  {insight.confidence_score && (
                    <Badge className={getConfidenceColor(insight.confidence_score)}>
                      {getConfidenceLabel(insight.confidence_score)} Confidence
                    </Badge>
                  )}
                </div>

                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{insight.content}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  <div className="text-xs text-current text-opacity-70">
                    Generated {new Date(insight.generated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
