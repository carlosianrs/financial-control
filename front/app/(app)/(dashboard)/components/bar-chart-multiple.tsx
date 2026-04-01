"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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

export const description = "A multiple bar chart"

interface ChartBarProps {
  config: ChartConfig;
  data: {
    category: string;
    expenses: number;
    goal: number;
  }[];
};

export function ChartBarMultiple({ config, data }: ChartBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planejamento de Despesas</CardTitle>
        <CardDescription>Meta x Despesas de cada categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={config}>
          <BarChart barSize={20} accessibilityLayer layout="vertical" data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="expenses" fill="#fb2c36" radius={4} />
            <Bar dataKey="goal" fill="#60A5FA" radius={4} />
            
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
