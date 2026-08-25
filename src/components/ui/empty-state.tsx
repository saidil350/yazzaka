"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, Inbox, FolderOpen } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: LucideIcon;
  };
  className?: string;
  variant?: "default" | "card" | "compact";
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className = "",
  variant = "default",
}: EmptyStateProps) {
  if (variant === "compact") {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] text-stone-600 ${className}`}
      >
        <div className="h-10 w-10 rounded-2xl bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] flex items-center justify-center mb-2.5 shadow-xs">
          <Icon className="h-5 w-5" />
        </div>
        <h4 className="text-xs font-bold text-[#1E2330]">{title}</h4>
        {description && (
          <p className="text-[11px] text-stone-500 mt-1 max-w-sm font-medium">
            {description}
          </p>
        )}
        {action && (
          <div className="mt-3">
            {action.href ? (
              <Link href={action.href}>
                <Button size="sm" variant="outline" className="text-xs font-bold h-8">
                  {action.icon && <action.icon className="h-3.5 w-3.5 mr-1" />}
                  <span>{action.label}</span>
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={action.onClick}
                className="text-xs font-bold h-8"
              >
                {action.icon && <action.icon className="h-3.5 w-3.5 mr-1" />}
                <span>{action.label}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 sm:px-6 text-center rounded-3xl ${
        variant === "card"
          ? "bg-white border-2 border-[#E8E2D8] shadow-xs"
          : "bg-[#FAF6EE] border-2 border-dashed border-[#E8E2D8]"
      } ${className}`}
    >
      <div className="h-14 w-14 rounded-2xl bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] flex items-center justify-center mb-3.5 shadow-xs">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#1E2330]">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-md font-medium leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action.href ? (
            <Link href={action.href}>
              <Button size="default" className="font-bold text-xs shadow-xs h-9 px-5">
                {action.icon && <action.icon className="h-3.5 w-3.5 mr-1.5" />}
                <span>{action.label}</span>
              </Button>
            </Link>
          ) : (
            <Button
              size="default"
              onClick={action.onClick}
              className="font-bold text-xs shadow-xs h-9 px-5"
            >
              {action.icon && <action.icon className="h-3.5 w-3.5 mr-1.5" />}
              <span>{action.label}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
