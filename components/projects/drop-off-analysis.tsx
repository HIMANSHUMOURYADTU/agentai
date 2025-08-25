import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingDown } from "lucide-react"

interface DropOffAnalysisProps {
  data: {
    conversion_rates: number[]
    drop_off_points: number[]
    total_users: number
    completion_rate: number
    step_names: string[]
  }
}

export function DropOffAnalysis({ data }: DropOffAnalysisProps) {
  const analysisData = data.step_names.map((step, index) => ({
    step,
    stepNumber: index + 1,
    conversionRate: data.conversion_rates[index],
    dropOffRate: data.drop_off_points[index] || 0,
    usersLost: Math.round(((data.drop_off_points[index] || 0) / 100) * data.total_users),
    severity: data.drop_off_points[index] > 15 ? "high" : data.drop_off_points[index] > 10 ? "medium" : "low",
  }))

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    return severity === "high" ? <AlertTriangle className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step-by-Step Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysisData.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(item.severity)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getSeverityIcon(item.severity)}
                <h4 className="font-medium">
                  Step {item.stepNumber}: {item.step}
                </h4>
              </div>
              <div className="text-sm font-medium">{item.dropOffRate}% drop-off</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversion Rate</span>
                <span>{item.conversionRate}%</span>
              </div>
              <Progress value={item.conversionRate} className="h-2" />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.usersLost.toLocaleString()} users lost at this step</span>
                <span>
                  {item.severity === "high" && "Critical"}
                  {item.severity === "medium" && "Moderate"}
                  {item.severity === "low" && "Good"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
