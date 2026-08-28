import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({
  ref,
  className,
  label,
  error,
  helperText,
  icon,
  id,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700"
        >
          {icon && <span className="text-stone-400">{icon}</span>}
          <span>{label}</span>
          {props.required && (
            <span className="text-rose-500" aria-label="wajib diisi">*</span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-hint` : undefined}
        className={cn(
          "flex min-h-[90px] w-full rounded-xl border border-[#E8E2D8] px-3.5 py-2.5",
          "bg-[#FCFBF7] text-[#1E2330]",
          "text-sm font-medium leading-relaxed",
          "placeholder:text-stone-400 placeholder:font-normal",
          "transition-all duration-200",
          "hover:border-stone-400 hover:bg-white",
          "focus:bg-white focus:outline-none focus:border-[#FA6400] focus:ring-4 focus:ring-[#FA6400]/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#FAF6EE]",
          "resize-y shadow-2xs",
          error && [
            "border-rose-500",
            "focus:border-rose-500 focus:ring-rose-500/10",
          ],
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} role="alert" className="flex items-center gap-1 text-xs text-rose-500 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-hint`} className="text-xs text-stone-500">{helperText}</p>
      )}
    </div>
  );
}
