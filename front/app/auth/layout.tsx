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
    <div className="relative flex min-h-svh items-center justify-center bg-muted">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="relative flex w-full max-w-md flex-col gap-6">        
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Image
              src="/logo.png"
              alt="Login"
              className="h-7 w-7"
              width={28}
              height={28}
            />
            Controle Financeiro
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}