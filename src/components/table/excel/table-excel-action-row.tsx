"use client";

import * as React from "react";

import AppIcon, { type IconName } from "@/components/general/app-icon";
import { cn } from "@/lib/utils";

interface TableExcelActionRowProps {
  icon: IconName;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function TableExcelActionRow({
  icon,
  label,
  onClick,
  disabled,
}: TableExcelActionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-left text-sm",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      <AppIcon icon={icon} className="size-4 text-muted-foreground" />
      <span className="flex-1 truncate">{label}</span>
    </button>
  );
}
