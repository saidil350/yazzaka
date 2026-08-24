import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white transition-all overflow-hidden",
        isOpen && "border-slate-300 shadow-xs",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-base font-semibold text-slate-900 transition-all hover:bg-slate-50/80 cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200",
            isOpen && "rotate-180 text-[var(--color-primary)]"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-5 pt-0 sm:px-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
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
