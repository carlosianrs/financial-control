import { getTokenAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await getTokenAuthenticated();
  if (!authenticated) {
    redirect('/auth/sign-in')
  }
  
  return (
    <>
      {children}
    </>
  )
}