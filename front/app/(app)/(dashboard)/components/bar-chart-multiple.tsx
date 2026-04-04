"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
        <ChartContainer config={config} className="w-full" style={{ height: `${data.length * 45}px` }} >
          <BarChart
            className="w-full"
            height={data.length * 40}
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
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={5}>
              <LabelList
                dataKey="expenses"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value === 0 ? '' : value}
              />
            </Bar>
            <Bar dataKey="goal" fill="var(--color-goal)" radius={5}>
              <LabelList
                dataKey="goal"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value === 0 ? '' : value}
              />
            </Bar>
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
