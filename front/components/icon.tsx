import * as Icons from "lucide-react";

interface IconProps {
  name: keyof typeof Icons;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const LucideIcon = Icons[name] as Icons.LucideIcon;

  if (!LucideIcon) return null;

  return <LucideIcon className={className} />;
}