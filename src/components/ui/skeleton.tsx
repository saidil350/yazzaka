import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  // bg-muted (bukan bg-accent stock): di aplikasi ini --accent adalah oranye
  // brand untuk CTA, sehingga skeleton memakai token muted agar menyatu
  // dengan latar di semua scope.
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
