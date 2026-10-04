"use client";

import type { RowData } from "@tanstack/react-table";
import AppIcon from "@/components/general/app-icon";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TableCoreInstance } from "@/hooks/table/use-table-core";

export interface TableFullscreenToggleLabels {
  trigger: string;
}

interface TableFullscreenToggleProps<TData extends RowData> {
  table: TableCoreInstance<TData>;
  /**
   * Override default từ `table.options.localization.fullscreen`. Bỏ trống thì lấy
   * từ i18n dict nên caller không bắt buộc truyền.
   */
  labels?: TableFullscreenToggleLabels;
}

export function TableFullscreenToggle<TData extends RowData>({
  table,
  labels,
}: TableFullscreenToggleProps<TData>) {
  const { isFullScreen } = table.getState();
  const { setIsFullScreen } = table.extra;
  const trigger = isFullScreen
    ? (labels?.trigger ?? table.options.localization.fullscreen.exit)
    : (labels?.trigger ?? table.options.localization.fullscreen.trigger);

  // Fullscreen locks page scroll; Escape is the conventional way out.
  React.useEffect(() => {
    if (!isFullScreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFullScreen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullScreen, setIsFullScreen]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={trigger}
          aria-pressed={isFullScreen}
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isFullScreen ? (
            <AppIcon icon="minimize" className="text-muted-foreground" />
          ) : (
            <AppIcon icon="maximize" className="text-muted-foreground" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{trigger}</TooltipContent>
    </Tooltip>
  );
}
