import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-[var(--color-danger)]" aria-label="wajib diisi">*</span>
            )}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-hint` : undefined}
          className={cn(
            "flex min-h-[100px] w-full rounded-md border px-3 py-3",
            "bg-[var(--surface-raised)] text-[var(--text-primary)]",
            "text-sm leading-relaxed",
            "placeholder:text-[var(--text-placeholder)]",
            "border-[var(--border-strong)]",
            "transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "hover:border-[var(--text-muted)]",
            "focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-[var(--surface-overlay)]",
            "resize-y",
            error && [
              "border-[var(--color-danger)]",
              "focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20",
            ],
            className
          )}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} role="alert" className="flex items-center gap-1 text-xs text-[var(--color-danger)] font-medium">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
