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
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span>{label}</span>
          {props.required && (
            <span className="text-destructive" aria-label="wajib diisi">*</span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-hint` : undefined}
        className={cn(
          "flex min-h-[90px] w-full rounded-md border border-input px-3 py-2",
          "bg-card text-foreground",
          "text-sm leading-relaxed",
          "placeholder:text-muted-foreground",
          "transition-colors shadow-xs",
          "hover:border-muted-foreground/40",
          "focus:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          "resize-y",
          error && [
            "border-destructive",
            "focus-visible:border-destructive focus-visible:ring-destructive/20",
          ],
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} role="alert" className="flex items-center gap-1 text-xs text-destructive font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-hint`} className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
