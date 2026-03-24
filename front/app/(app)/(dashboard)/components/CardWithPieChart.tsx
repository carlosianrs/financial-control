'use client'

import { Icon } from "@/components/icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import { Cell, Pie, PieChart } from "recharts";

interface CardAccountProps {
  data: {
    name: string,
    value: number,
    color: string,
    accountIconPath?: string,
    accountName?: string,
  }[];
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
      <CardContent className="grid grid-cols-[200px_1fr] gap-8 items-center h-full">
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
        <div className="flex flex-col gap-4">
          {data.map((item) => {
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  {/* {item?.accountIconPath && item?.accountName && (<div className="flex items-center justify-center w-10 h-10 rounded-md bg-purple-500/20">
                    <Image
                      src={item.accountIconPath}
                      alt={item.accountName}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>)} */}

                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>

                <span className="font-bold">{formatMoney(item.value)}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}