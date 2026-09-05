import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button — shadcn/ui new-york base with Yazzaka color variants.
 * The component API follows the standard shadcn Button contract.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "text-sm font-medium",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Headspace Primary Orange (Bubbly / Chunky 3D look) */
        default:
          "bg-[#FA6400] text-white shadow-[0_3px_0_#cc5000] hover:bg-[#ff7214] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#cc5000] active:translate-y-0.5 active:shadow-[0_1px_0_#cc5000]",

        /** Secondary Warm Pill */
        secondary:
          "bg-[#F3EFE6] text-[#1E2330] hover:bg-[#EDE6D8] hover:-translate-y-0.5 shadow-xs",

        /** Outline Pill */
        outline:
          "border-2 border-[#E8E2D8] bg-white text-[#1E2330] shadow-xs hover:bg-[#FAF6EE] hover:border-[#FA6400] hover:text-[#FA6400] hover:-translate-y-0.5",

        /** Ghost Pill */
        ghost:
          "text-[#1E2330] hover:bg-[#FA6400]/10 hover:text-[#FA6400]",

        /** Destructive Pill */
        destructive:
          "bg-[#EF4444] text-white shadow-xs hover:bg-[#DC2626] hover:-translate-y-0.5",

        /** Link */
        link:
          "text-[#FA6400] underline-offset-4 hover:underline",

        /** Brand accent — Headspace Warm Orange / Amber */
        accent:
          "bg-[#FA6400] text-white shadow-[0_3px_0_#cc5000] hover:bg-[#ff7214] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#cc5000] active:translate-y-0.5 active:shadow-[0_1px_0_#cc5000]",

        /** Pastel Pill Buttons */
        mint:
          "bg-[#E6F4EA] text-[#15803D] border border-[#BDE7CC] hover:bg-[#DCF2E2] hover:-translate-y-0.5 font-bold",
        lilac:
          "bg-[#EBE5FC] text-[#6D28D9] border border-[#D5C7FB] hover:bg-[#E2D8FA] hover:-translate-y-0.5 font-bold",
        sky:
          "bg-[#E0F2FE] text-[#0369A1] border border-[#BCE1FD] hover:bg-[#D0EBFD] hover:-translate-y-0.5 font-bold",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-md px-3 text-xs",
        lg:      "h-10 rounded-md px-8",
        xl:      "h-11 rounded-md px-8 text-base",
        icon:    "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  ref,
  className,
  variant,
  size,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Memproses…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
