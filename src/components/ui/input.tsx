import * as React from "react";
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
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {icon && <span className="text-stone-400">{icon}</span>}
          <span>{label}</span>
          {props.required && (
            <span className="text-rose-500" aria-label="wajib diisi">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
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
            "flex h-10 w-full rounded-xl border border-[#E8E2D8] bg-[#FCFBF7] px-3.5 py-2",
            leftIcon && "pl-9",
            "text-sm font-medium text-[#1E2330] shadow-2xs",
            "placeholder:text-stone-400 placeholder:font-normal",
            "transition-all duration-200",
            "hover:border-stone-400 hover:bg-white",
            "focus-visible:outline-none focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#FA6400]/10 focus-visible:border-[#FA6400]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#FAF6EE]",
            error && "border-rose-500 focus-visible:ring-rose-500/10 focus-visible:border-rose-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-rose-500 font-medium"
        >
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-stone-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
