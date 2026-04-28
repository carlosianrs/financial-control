"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatMoney } from "@/lib/utils";

interface Goal {
  category: string;
  expenses: number;
  goal: number;
}

interface ChartBarMultipleProps {
  goals: Goal[];
}

export function ChartBarMultiple({ goals }: ChartBarMultipleProps) {
  return (
    <Card className="bg-card shadow-lg shadow-muted-foreground/15">
      <CardHeader>
        <CardTitle>Planejamento de Despesas</CardTitle>
        <CardDescription>Despesas x Meta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {goals.map((g, i) => {
            const percent = Math.round((g.expenses / g.goal) * 100) || 0;
            const current = g.goal - g.expenses;

            return (
              <div key={i}>
                <p className="text-sm font-medium mb-1">{g.category}</p>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-foreground">{formatMoney(g.expenses)}</span>
                  <span className="text-sm text-foreground">{formatMoney(g.goal)}</span>
                </div>
                <div className="bg-[#333] rounded h-2 overflow-hidden">
                  <div className="h-2 rounded"
                    style={{ width: `${percent}%`, background: percent >= 100 ? '#ff0303' : '#0073ff' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{percent == Infinity ? 0 : percent}% concluído | {formatMoney(current)} saldo</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}