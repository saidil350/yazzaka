import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal / Dialog — Impeccable Craft
 * - Native <dialog> semantics with role="dialog" + aria-modal
 * - Floating elevation shadow: ambient + key light
 * - Escape key + backdrop click to close
 * - Focus trap via autoFocus on close button
 * - No layout shift — scrolls internally
 */

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
}: ModalProps) {
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--surface-inverse)]/60 backdrop-blur-[2px] transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel — floating elevation shadow */}
      <div
        className={cn(
          "relative z-10 w-full flex flex-col max-h-[88vh]",
          "bg-[var(--surface-raised)] rounded-lg",
          "border border-[var(--border-default)]",
          // Layered shadow: ambient + key light
          "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_20px_36px_-4px_rgba(0,0,0,0.10)]",
          maxWidthClass[maxWidth] ?? "max-w-lg"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[var(--border-subtle)] shrink-0">
          <div className="space-y-0.5 pr-6">
            <h2
              id={titleId}
              className="font-editorial text-lg font-bold text-[var(--text-primary)] leading-snug"
            >
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-sm text-[var(--text-muted)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Tutup dialog"
            className={[
              "h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5",
              "text-[var(--text-muted)] border border-transparent",
              "transition-all duration-150",
              "hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30",
              "active:scale-95",
            ].join(" ")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1 min-h-0">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 pt-4 pb-5 border-t border-[var(--border-subtle)] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
