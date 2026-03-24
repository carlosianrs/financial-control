import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import logo from "@/public/logo.png"
import { cookies } from "next/headers";
import { UserProvider } from "@/contexts/user-context";
import { getTokenAuthenticated } from "@/auth/auth";
import { TitlePage } from "@/components/title-page";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await getTokenAuthenticated();
  if (!authenticated) redirect('/auth/sign-in')

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <UserProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 pr-5 pt-2">
            <div className="flex flex-1 items-center px-3">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <div className="flex items-center gap-2 justify-between">
                <TitlePage />
              </div>
            </div>
            <Image src={logo} className="size-8" alt="Controle Financeiro" />
          </header>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg-px-8 py-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </UserProvider>
    </SidebarProvider>
  )
}