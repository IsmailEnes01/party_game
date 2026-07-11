import * as LucideIcons from "lucide-react";
import { cn } from "@/utils/cn";

type LucideIconName = keyof typeof LucideIcons;

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: LucideIconName;
  size?: number | string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, strokeWidth = 2, className, ...props }: IconProps) {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={cn(className)}
      {...props}
    />
  );
}