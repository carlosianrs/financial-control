'use client'

import { usePathname } from "next/navigation"
import { itemsMenu } from "./app-sidebar";

export function TitlePage() {
  const pathname = usePathname();
  const itemMenu = itemsMenu.find(item => item.url == "/" ? pathname == item.url : pathname.includes(item.url))

  return (
    <div>
      <p className="text-2xl font-bold">{itemMenu?.title}</p>
      <p className="text-sm text-muted-foreground">{itemMenu?.description}</p>
    </div>
  )
}