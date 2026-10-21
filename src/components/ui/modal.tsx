import * as React from "react";
import { use } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal / Dialog — Compound Component Pattern & React 19 Standard
 * - Native <dialog> semantics with role="dialog" + aria-modal
 * - Shared ModalContext for seamless composition
 * - Supports both Compound usage (<Modal.Header>, <Modal.Body>, etc.) & Legacy Props
 */

interface ModalContextType {
  onClose: () => void;
  titleId: string;
  descId: string;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
  className,
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
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    full: "max-w-[95vw]",
  };

  const isLegacyProps = title !== undefined;

  return (
    <ModalContext.Provider value={{ onClose, titleId, descId }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        aria-modal="true"
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Panel */}
        <div
          className={cn(
            "relative z-10 w-full flex flex-col max-h-[88vh]",
            "bg-card rounded-lg",
            "border border-border",
            "shadow-lg",
            maxWidthClass[maxWidth] ?? "max-w-lg",
            className
          )}
        >
          {isLegacyProps ? (
            <>
              <ModalHeader>
                <div className="space-y-0.5 pr-6">
                  <ModalTitle>{title}</ModalTitle>
                  {description && (
                    <ModalDescription>{description}</ModalDescription>
                  )}
                </div>
                <ModalClose />
              </ModalHeader>
              <ModalBody>{children}</ModalBody>
              {footer && <ModalFooter>{footer}</ModalFooter>}
            </>
          ) : (
            children
          )}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

export function ModalHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between px-6 pt-5 pb-4 border-b border-border shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = use(ModalContext);
  return (
    <h2
      id={ctx?.titleId}
      className={cn("text-lg font-semibold text-foreground leading-none tracking-tight", className)}
    >
      {children}
    </h2>
  );
}

export function ModalDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = use(ModalContext);
  return (
    <p
      id={ctx?.descId}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    >
      {children}
    </p>
  );
}

export function ModalClose({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const ctx = use(ModalContext);
  return (
    <button
      type="button"
      onClick={onClick || ctx?.onClose}
      autoFocus
      aria-label="Tutup dialog"
      className={cn(
        "h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5",
        "text-muted-foreground",
        "transition-colors duration-150",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "cursor-pointer",
        className
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-y-auto px-6 py-5 flex-1 min-h-0", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 pt-4 pb-5 border-t border-border shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Close = ModalClose;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
