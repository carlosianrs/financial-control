import { cn, formatMoney } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Icon } from "./icon";

interface MainCardProps {
  title: string;
  value: number;
  textColor: string
  glowColor: string
  icon?: {
    name: string;
    color: string;
  }
}

export function MainCard({ title, value, icon, textColor, glowColor }: MainCardProps) {
  return (
    <Card className="relative overflow-hidden w-full rounded-xl h-full bg-card shadow-lg shadow-muted-foreground/15">
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 blur-3xl rounded-full"
        style={{ background: glowColor, opacity: 0.35 }}
      />

      <CardContent>
        <div className="flex flex-row items-center text-wrap flex-wrap gap-5">
          {icon?.name && (<div className={cn(`flex items-center justify-center w-10 h-10 rounded-md ${icon?.color}`)}>
            <Icon name={icon.name! as any} className={`w-5 h-5 ${textColor}`} />
          </div>)}
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold text-lg">{title}</p>
            <p className={`text-xl font-bold ${textColor}`}>{formatMoney(value)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}