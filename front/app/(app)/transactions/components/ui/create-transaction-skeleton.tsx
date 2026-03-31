import { Skeleton } from "@/components/ui/skeleton"
import { DialogFooter } from "@/components/ui/dialog"

export function CreateTransactionSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <div className="grid grid-cols-2 gap-1">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <DialogFooter>
        <Skeleton className="h-10 w-full" />
      </DialogFooter>
    </>
  )
}