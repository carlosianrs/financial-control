import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex px-4 flex-col gap-5">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-5 border bg-card shadow-lg shadow-muted-foreground/15">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-md" />
              
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-5 border bg-card shadow-lg shadow-muted-foreground/15">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-md" />
              
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <Card className="w-full rounded-xl border shadow-md h-full bg-card" key={i}>
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
                    </div>

                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}