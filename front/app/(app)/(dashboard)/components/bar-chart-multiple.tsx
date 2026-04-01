"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface ChartBarMultipleProps {
  config: ChartConfig;
  data: {
    category: string;
    expenses: number;
    goal: number;
  }[];
}

export function ChartBarMultiple({ config, data }: ChartBarMultipleProps) {
  return (
    <Card className="bg-card shadow-lg shadow-muted-foreground/15">
      <CardHeader>
        <CardTitle>Planejamento de Despesas</CardTitle>
        <CardDescription>Meta x Despesas de cada categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            className="w-full"
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -5,
            }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={5} />
            <Bar dataKey="goal" fill="var(--color-goal)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
