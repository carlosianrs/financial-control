'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import { Cell, Pie, PieChart } from "recharts";

export interface CardData {
  name: string,
  value: number,
  color: string,
  iconPath?: string,
}

interface CardAccountProps {
  data: CardData[];
  title: string;
  description: string;
}

export default function CardWithPieChart({ title, description, data }: CardAccountProps) {
  return (
    <Card className="w-full rounded-xl h-full bg-card shadow-lg shadow-muted-foreground/15">
      <CardHeader className="items-center gap-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center h-full">
        <div className="flex justify-center items-center">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            stroke="none"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        </div>
        <div className="flex flex-col gap-4">
          {data.length ? data.map((item, index) => {
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  {item.iconPath && (<div className="flex items-center justify-center w-6 h-6 rounded-md bg-transparent">
                    <Image
                      src={'/banks/nubank.png'}
                      alt={item.iconPath}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>)}

                  <span className="text-xs lg:text-sm font-medium text-foreground">{item.name}</span>
                </div>

                <span className="font-bold text-sm lg:text-base">{formatMoney(item.value)}</span>
              </div>
            )
          }) : <p>Nenhum dado encontrado</p>}
        </div>
      </CardContent>
    </Card>
  )
}