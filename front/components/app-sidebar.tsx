"use client"

import * as React from "react"
import { Goal, LayoutDashboard, Tags, Wallet } from "lucide-react"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { useUser } from "@/contexts/user-context"

export const itemsMenu = [
  {
    title: "Dashboard",
    description: "Visão geral das suas finanças",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transações",
    description: "Visão geral das receitas e gastos",
    url: "/transactions",
    icon: Wallet,
  },
  {
    title: "Planejamento",
    description: "Visão geral das suas finanças",
    url: "/planning",
    icon: Goal,
  },
  {
    title: "Categoria",
    description: "Visão geral das suas finanças",
    url: "/categories",
    icon: Tags,
    badge: "10",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  return (
    <Sidebar variant="sidebar" className="p-2 bg-sidebar" {...props}>
      <SidebarHeader>
        <NavUser user={user!} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={itemsMenu} />
      </SidebarContent>
    </Sidebar>
  )
}