import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — Headspace Pill Style & Pastel Accents
 * Rounded-full, friendly, soft cheerful colors
 */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border",
    "px-3 py-1 text-xs font-bold tracking-tight",
    "transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",

        outline:
          "border-border bg-card text-foreground",

        success:
          "border-[#BDE7CC] bg-[#E6F4EA] text-[#15803D]",

        warning:
          "border-[#FDE68A] bg-[#FEF3C7] text-[#B45309]",

        info:
          "border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1]",

        /** Brand accent — Headspace Warm Orange / Amber */
        accent:
          "border-[#FED7AA] bg-[#FFEDD5] text-[#C2410C]",

        /** Headspace Pastels */
        lilac:
          "border-[#DDD6FE] bg-[#EDE9FE] text-[#6D28D9]",

        mint:
          "border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]",

        sky:
          "border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1]",

        butter:
          "border-[#FEF08A] bg-[#FEF9C3] text-[#A16207]",

        coral:
          "border-[#FECDD3] bg-[#FFE4E6] text-[#BE123C]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
