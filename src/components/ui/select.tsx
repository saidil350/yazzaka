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
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span>{label}</span>
          {props.required && (
            <span className="text-destructive" aria-label="wajib diisi">*</span>
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
            "w-full appearance-none rounded-md border border-input bg-card px-3 py-2 pr-9",
            "text-sm text-foreground shadow-xs",
            "transition-colors",
            "hover:border-muted-foreground/40",
            "focus:outline-none focus-visible:border-muted-foreground/40",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} role="alert" className="text-xs text-destructive font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-hint`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
