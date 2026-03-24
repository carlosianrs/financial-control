'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardAccountSkeleton() {
  return (
    <Card className="w-full rounded-xl shadow-md h-full bg-card border-transparent">
      <CardHeader className="items-center pb-0 gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>

      <CardContent className="grid grid-cols-[200px_1fr] gap-8 items-center">
        <div className="flex items-center justify-center">
          <Skeleton className="w-40 h-40 rounded-full" />
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-8" />
              </div>

              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}