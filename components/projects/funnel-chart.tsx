"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  FunnelChart as FunnelChartComponent,
  Funnel,
  Cell,
} from "recharts"

interface FunnelChartProps {
  data: {
    conversion_rates: number[]
    drop_off_points: number[]
    total_users: number
    completion_rate: number
    step_names: string[]
  }
}

export function FunnelChart({ data }: FunnelChartProps) {
  const chartData = data.step_names.map((step, index) => ({
    step: step,
    users: Math.round((data.conversion_rates[index] / 100) * data.total_users),
    rate: data.conversion_rates[index],
    dropOff: data.drop_off_points[index] || 0,
  }))

  const funnelData = chartData.map((item, index) => ({
    name: `${index + 1}. ${item.step}`,
    value: item.users,
    fill: `hsl(${220 - index * 10}, 70%, ${60 - index * 3}%)`,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Funnel Visualization</CardTitle>
          <CardDescription>User progression through onboarding steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              users: {
                label: "Users",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChartComponent>
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
                <ChartTooltip content={<ChartTooltipContent />} />
              </FunnelChartComponent>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates by Step</CardTitle>
          <CardDescription>Percentage of users completing each step</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              rate: {
                label: "Conversion Rate",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="step" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{ value: "Conversion Rate (%)", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value}%`, "Conversion Rate"]}
                />
                <Bar dataKey="rate" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
