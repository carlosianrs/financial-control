"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface ChartAreaInteractiveProps {
  config: ChartConfig;
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export function ChartAreaInteractive({ config, data }: ChartAreaInteractiveProps) {
  const [displayBalance, setDisplayBalance] = useState<boolean>(true);
  const [displayIncome, setDisplayIncome] = useState<boolean>(true);
  const [displayExpenses, setDisplayExpenses] = useState<boolean>(true);

  const filteredData = data.reduce<{ date: string; balance: number, income: number, expenses: number }[]>((acc, item) => {
    const lastBalance = acc.length ? acc[acc.length - 1].balance : 0;
    const balance = lastBalance + (item.income - item.expenses);

    acc.push({ date: item.date, balance, income: item.income, expenses: item.expenses });
    return acc;
  }, []);

  return (
    <Card className="bg-card shadow-lg shadow-muted-foreground/15">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row justify-between">
        <div className="grid flex-1 gap-1">
          <CardTitle>Evolução de Saldo</CardTitle>
          <CardDescription>
            Saldo diário no mês de março
          </CardDescription>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-1">
            <Checkbox onCheckedChange={() => setDisplayBalance(prev => !prev)} checked={displayBalance} />
            <p>Saldo</p>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox onCheckedChange={() => setDisplayIncome(prev => !prev)} checked={displayIncome} />
            <p>Receitas</p>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox onCheckedChange={() => setDisplayExpenses(prev => !prev)} checked={displayExpenses} />
            <p>Despesas</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={config} className="aspect-auto h-62.5 w-full">
          <AreaChart data={filteredData}>
            <defs>
              {displayBalance && (<linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#60A5FA"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#60A5FA"
                  stopOpacity={0.1}
                />
              </linearGradient>)}
              {displayIncome && (<linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#34D399"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#34D399"
                  stopOpacity={0.1}
                />
              </linearGradient>)}
              {displayExpenses && (<linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#FB2C36"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#FB2C36"
                  stopOpacity={0.1}
                />
              </linearGradient>)}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {displayBalance && (<Area
              dataKey="balance"
              type="monotone"
              fill="url(#fillBalance)"
              stroke="#60A5FA"
            />)}
            {displayIncome && (<Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              stroke="#34D399"
            />)}
            {displayExpenses && (<Area
              dataKey="expenses"
              type="monotone"
              fill="url(#fillExpenses)"
              stroke="#FB2C36"
            />)}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}