"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useSidebar } from "@/components/ui/sidebar"

export function Loading() {
  const { state } = useSidebar()
  const sidebarActive = state === "expanded"

  return (
    <div className="min-h-screen w-full flex">
      {sidebarActive && (
        <div className="hidden md:flex w-64 border-r p-4 flex-col gap-4 shrink-0">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-32" />
          ))}
        </div>
      )}

      <div className="flex-1">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="flex gap-4 flex-wrap">
            <Skeleton className="h-10 w-65" />
            <Skeleton className="h-10 w-55" />
            <Skeleton className="h-10 w-45" />
          </div>

          <div className="flex gap-10 mt-2">
            <Skeleton className="h-6 flex-1 max-w-full" />
            <Skeleton className="h-6 flex-1 max-w-full" />
            <Skeleton className="h-6 flex-1 max-w-full" />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex gap-3 items-center">
                  <Skeleton className="h-12 w-12 rounded-xl" />

                  <div className="flex flex-col gap-2 w-full h-20 justify-center">
                    <Skeleton className="h-4 w-30" />
                    <Skeleton className="h-3 w-45" />
                    <Skeleton className="h-4 w-35" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}