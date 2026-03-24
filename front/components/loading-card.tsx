import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "./ui/card";

export function LoadingCard() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="rounded-xl border bg-card p-4 shadow-sm cursor-progress">
          <CardContent className="flex gap-3 items-center">
            <Skeleton className="h-12 w-15 rounded-xl" />
            <div className="flex flex-col gap-2 w-full h-20 justify-center">
              <Skeleton className="h-4 w-30" />
              <Skeleton className="h-3 w-45" />
              <Skeleton className="h-4 w-35" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}