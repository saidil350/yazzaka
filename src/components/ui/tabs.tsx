"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Tabs — built on Radix Tabs: role tablist/tab/tabpanel, aria-selected,
 * navigasi panah & focus otomatis dari primitives.
 */

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      <TabsPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        {children}
      </TabsPrimitive.Root>
    </div>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[2px] text-muted-foreground overflow-x-auto max-w-full",
        className
      )}
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        "data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
        className
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsPrimitive.Content
      value={value}
      className={cn("mt-2 focus-visible:outline-none", className)}
    >
      {children}
    </TabsPrimitive.Content>
  );
}
