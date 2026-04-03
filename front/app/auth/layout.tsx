import { getTokenAuthenticated } from "@/auth/auth";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await getTokenAuthenticated();
  if (authenticated) {
    redirect('/')
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md text-primary-foreground">
            <Image
              src="/logo.png"
              alt="Login"
              className="h-6 w-6"
              width={24}
              height={24}
            />
          </div>
          Controle Financeiro
        </a>
        {children}
      </div>
    </div>
  )
}