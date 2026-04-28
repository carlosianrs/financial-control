import { cn, formatMoney } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Icon } from "./icon";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainCardProps {
  title: string;
  value: number;
  pending?: {
    value: number;
    title?: string;
    display?: boolean;
  };
  textColor: string
  glowColor: string
  icon?: {
    name: string;
    color: string;
  }
}

export function MainCard({ title, value, pending, icon, textColor, glowColor }: MainCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="relative overflow-hidden w-full rounded-xl h-full bg-card shadow-lg shadow-muted-foreground/15">
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 blur-3xl rounded-full"
        style={{ background: glowColor, opacity: 0.35 }}
      />

      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-row items-center gap-3 sm:gap-4">
          {icon?.name && (
            <div className={cn(`flex shrink-0 items-center justify-center rounded-md ${icon?.color}`,
              "w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
            )}>
              <Icon
                name={icon.name as any}
                className={cn("w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5", textColor)}
              />
            </div>
          )}

          <div className="flex flex-col items-start justify-start min-w-0">
            <p className="font-semibold text-xs sm:text-sm lg:text-lg text-muted-foreground truncate w-full">{title}</p>
            <p className={cn("text-sm sm:text-lg lg:text-xl font-bold leading-tight", textColor)}>{formatMoney(value)}</p>
            {pending?.display && (
              <div className={`flex flex-row items-center mt-0.5 ${!isMobile ? 'gap-1' : ''} flex-wrap`}>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground whitespace-nowrap">{pending?.title || "Pendente:"}</p>
                <p className="text-[10px] sm:text-xs lg:text-sm font-bold text-yellow-400 whitespace-nowrap">{formatMoney(pending.value)}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}