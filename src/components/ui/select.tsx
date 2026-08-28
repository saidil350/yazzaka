import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLSelectElement>;
}

export function Select({
  ref,
  className,
  label,
  error,
  helperText,
  icon,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700"
        >
          {icon && <span className="text-stone-400">{icon}</span>}
          <span>{label}</span>
          {props.required && (
            <span className="text-rose-500" aria-label="wajib diisi">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-hint` : undefined
          }
          className={cn(
            "w-full appearance-none rounded-xl border border-[#E8E2D8] bg-[#FCFBF7] px-3.5 py-2.5 pr-10",
            "text-sm font-medium text-[#1E2330] shadow-2xs",
            "transition-all duration-200",
            "hover:border-stone-400 hover:bg-white",
            "focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FA6400]/10 focus:border-[#FA6400]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#FAF6EE]",
            error && "border-rose-500 focus:ring-rose-500/10 focus:border-rose-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} role="alert" className="text-xs text-rose-500 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-hint`} className="text-xs text-stone-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
