import { isAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center flex-col px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}