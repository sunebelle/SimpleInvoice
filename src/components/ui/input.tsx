import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

const baseClassName =
  "w-full rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring disabled:opacity-50";

const sizes = {
  md: "px-4 py-2.5",
  lg: "px-4 py-3",
} as const;

export interface InputProps extends ComponentProps<"input"> {
  inputSize?: keyof typeof sizes;
}

export function Input({
  ref,
  inputSize = "md",
  className,
  ...props
}: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(baseClassName, sizes[inputSize], className)}
      {...props}
    />
  );
}

export interface TextareaProps extends ComponentProps<"textarea"> {
  inputSize?: keyof typeof sizes;
}

export function Textarea({
  ref,
  inputSize = "md",
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      ref={ref}
      className={cn(baseClassName, sizes[inputSize], "resize-none", className)}
      {...props}
    />
  );
}
