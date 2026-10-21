"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, FolderOpen } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

/**
 * EmptyState — Compound Component Pattern & Explicit Variants
 * Supports flexible children composition as well as backward-compatible props.
 */

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: LucideIcon;
  };
  className?: string;
  variant?: "default" | "card" | "compact";
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className = "",
  variant = "default",
  children,
}: EmptyStateProps) {
  // If children are supplied, render compound style
  if (children) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center",
          variant === "compact" &&
            "p-6 rounded-lg bg-muted border border-border text-muted-foreground",
          variant === "card" &&
            "py-12 px-4 sm:px-6 rounded-lg bg-card border border-border shadow-xs",
          variant === "default" &&
            "py-12 px-4 sm:px-6 rounded-lg bg-muted/50 border border-dashed border-border",
          className
        )}
      >
        {children}
      </div>
    );
  }

  // Legacy compact variant
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-6 text-center rounded-lg bg-muted border border-border text-muted-foreground",
          className
        )}
      >
        <EmptyStateIcon icon={Icon} size="sm" />
        {title && <EmptyStateTitle size="sm">{title}</EmptyStateTitle>}
        {description && (
          <EmptyStateDescription size="sm">{description}</EmptyStateDescription>
        )}
        {action && (
          <EmptyStateActions className="mt-3">
            {action.href ? (
              <Link href={action.href}>
                <Button size="sm" variant="outline" className="text-xs h-8">
                  {action.icon && <action.icon className="h-3.5 w-3.5" />}
                  <span>{action.label}</span>
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={action.onClick}
                className="text-xs h-8"
              >
                {action.icon && <action.icon className="h-3.5 w-3.5" />}
                <span>{action.label}</span>
              </Button>
            )}
          </EmptyStateActions>
        )}
      </div>
    );
  }

  // Legacy default or card variant
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 sm:px-6 text-center rounded-lg",
        variant === "card"
          ? "bg-card border border-border shadow-xs"
          : "bg-muted/50 border border-dashed border-border",
        className
      )}
    >
      <EmptyStateIcon icon={Icon} />
      {title && <EmptyStateTitle>{title}</EmptyStateTitle>}
      {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
      {action && (
        <EmptyStateActions className="mt-5">
          {action.href ? (
            <Link href={action.href}>
              <Button size="default" className="text-xs h-9 px-5">
                {action.icon && <action.icon className="h-3.5 w-3.5" />}
                <span>{action.label}</span>
              </Button>
            </Link>
          ) : (
            <Button
              size="default"
              onClick={action.onClick}
              className="text-xs h-9 px-5"
            >
              {action.icon && <action.icon className="h-3.5 w-3.5" />}
              <span>{action.label}</span>
            </Button>
          )}
        </EmptyStateActions>
      )}
    </div>
  );
}

export function EmptyStateIcon({
  icon: Icon = FolderOpen,
  size = "md",
  className,
}: {
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0",
        size === "sm" ? "h-10 w-10 mb-2.5" : "h-12 w-12 mb-3.5",
        className
      )}
    >
      <Icon className={size === "sm" ? "h-5 w-5" : "h-6 w-6"} />
    </div>
  );
}

export function EmptyStateTitle({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  if (size === "sm") {
    return (
      <h4 className={cn("text-xs font-medium text-foreground", className)}>
        {children}
      </h4>
    );
  }
  return (
    <h3
      className={cn(
        "text-base sm:text-lg font-semibold text-foreground",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function EmptyStateDescription({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-muted-foreground leading-relaxed",
        size === "sm" ? "text-xs mt-1 max-w-sm" : "text-sm mt-1.5 max-w-md",
        className
      )}
    >
      {children}
    </p>
  );
}

export function EmptyStateActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {children}
    </div>
  );
}

EmptyState.Icon = EmptyStateIcon;
EmptyState.Title = EmptyStateTitle;
EmptyState.Description = EmptyStateDescription;
EmptyState.Actions = EmptyStateActions;
