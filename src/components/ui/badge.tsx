import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
  outline: "text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export function Badge({
  className,
  variant = "primary",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
