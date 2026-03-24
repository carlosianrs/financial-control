import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 flex-col">
      <div className="relative inline-block mb-3 font-sans">
        <span className="text-8xl font-bold text-white inline-block">404</span>
      </div>
      <p className="text-gray-100 mb-8">Página não encontrada</p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href={"/"}>Tela Inicial</Link>
        </Button>
      </div>
    </div>
  )
}