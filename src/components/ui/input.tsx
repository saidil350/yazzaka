import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Input — shadcn/ui standard
 * States: default / focus / error / disabled
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  ref,
  className,
  type,
  label,
  error,
  helperText,
  icon,
  leftIcon,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span>{label}</span>
          {props.required && (
            <span className="text-destructive" aria-label="wajib diisi">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
          }
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-base shadow-xs transition-colors md:text-sm",
            leftIcon && "pl-9",
            "text-foreground",
            "placeholder:text-muted-foreground",
            "hover:border-muted-foreground/40",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-destructive font-medium"
        >
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
