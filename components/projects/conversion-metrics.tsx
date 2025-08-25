import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Users, Target } from "lucide-react"

interface ConversionMetricsProps {
  data: {
    conversion_rates: number[]
    drop_off_points: number[]
    total_users: number
    completion_rate: number
    step_names: string[]
  }
}

export function ConversionMetrics({ data }: ConversionMetricsProps) {
  const totalDropOff = data.drop_off_points.reduce((sum, rate) => sum + rate, 0)
  const biggestDropOff = Math.max(...data.drop_off_points)
  const biggestDropOffIndex = data.drop_off_points.indexOf(biggestDropOff)
  const completedUsers = Math.round((data.completion_rate / 100) * data.total_users)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_users.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Started onboarding</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <Target className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.completion_rate}%</div>
          <p className="text-xs text-muted-foreground">{completedUsers.toLocaleString()} users completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Drop-off</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDropOff.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Across all steps</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Biggest Drop-off</CardTitle>
          <TrendingDown className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{biggestDropOff}%</div>
          <p className="text-xs text-muted-foreground">At step: {data.step_names[biggestDropOffIndex]}</p>
        </CardContent>
      </Card>
    </div>
  )
}
