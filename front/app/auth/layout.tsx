import { getTokenAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await getTokenAuthenticated();
  if (authenticated) {
    redirect('/')
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center flex-col px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}