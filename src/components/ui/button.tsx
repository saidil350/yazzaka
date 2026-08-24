import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — Headspace Pill Style & Shadcn primitives
 * Rounded-full, bouncy hover feel, warm friendly colors
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "text-sm font-semibold tracking-tight",
    "transition-all duration-200 ease-out active:scale-95",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
          "text-[#1E2330] hover:bg-[#FA6400]/10 hover:text-[#FA6400] rounded-full",

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
        default: "h-10 px-5 py-2.5 text-sm",
        sm:      "h-8 px-3.5 text-xs font-medium",
        lg:      "h-12 px-7 text-base font-bold",
        xl:      "h-14 px-8 text-base font-bold",
        icon:    "h-10 w-10 p-0 rounded-full",
        "icon-sm": "h-8 w-8 p-0 rounded-full",
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
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
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
            <svg
              className="h-4 w-4 animate-spin shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Memproses…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
