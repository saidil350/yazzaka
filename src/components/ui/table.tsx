import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Table — shadcn/ui standard
 */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  ref?: React.Ref<HTMLTableElement>;
}

export function Table({ className, ref, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
}

export function TableHeader({ className, ref, ...props }: TableHeaderProps) {
  return (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b border-[#E8E2D8] bg-[#FAF6EE]", className)}
      {...props}
    />
  );
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
}

export function TableBody({ className, ref, ...props }: TableBodyProps) {
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0 bg-white", className)}
      {...props}
    />
  );
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
}

export function TableFooter({ className, ref, ...props }: TableFooterProps) {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-[#E8E2D8] bg-[#FAF6EE] font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  ref?: React.Ref<HTMLTableRowElement>;
}

export function TableRow({ className, ref, ...props }: TableRowProps) {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-[#E8E2D8] transition-colors hover:bg-[#FFF9F2] data-[state=selected]:bg-[#FFF0E5]",
        className
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>;
}

export function TableHead({ className, ref, ...props }: TableHeadProps) {
  return (
    <th
      ref={ref}
      className={cn(
        "h-11 px-4 text-left align-middle text-xs font-bold text-[#1E2330]",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>;
}

export function TableCell({ className, ref, ...props }: TableCellProps) {
  return (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle text-sm text-[#1E2330] font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  ref?: React.Ref<HTMLTableCaptionElement>;
}

export function TableCaption({ className, ref, ...props }: TableCaptionProps) {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
