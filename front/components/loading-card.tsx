import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "./ui/card";

export function LoadingCard() {
  return Array.from({ length: 6 }).map((_, i) => (
    <Card key={i} className="rounded-xl border bg-card shadow-sm cursor-progress">
      <CardContent className="p-4 flex gap-3 items-center">
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
        <div className="flex flex-col gap-2 w-full justify-center">
          <Skeleton className="h-4 w-10 sm:w-24" />
          <Skeleton className="h-3 w-15 sm:w-36" />
          <Skeleton className="h-4 w-13 sm:w-28" />
        </div>
      </CardContent>
    </Card>
  ))
}