"use client";

import * as React from "react";
import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accordion — disclosure pattern ARIA penuh: tombol dengan aria-expanded/
 * aria-controls, panel role="region" aria-labelledby, chevron dekoratif
 * aria-hidden. isOpenDefault per-item tetap didukung tanpa root-level state.
 */

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  isOpenDefault = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(isOpenDefault);
  const buttonId = useId();
  const panelId = useId();

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card transition-colors overflow-hidden",
        isOpen && "shadow-xs",
        className
      )}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-base font-semibold text-foreground transition-colors hover:bg-muted/50 cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="px-4 pb-5 pt-0 sm:px-5 text-sm text-muted-foreground leading-relaxed border-t border-border mt-1"
        >
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}
