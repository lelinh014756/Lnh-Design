"use client";

import type { RowData } from "@tanstack/react-table";
import AppIcon from "@/components/general/app-icon";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TableCoreInstance } from "@/hooks/table/use-table-core";

export interface TableFilterToggleLabels {
  trigger: string;
}

interface TableFilterToggleProps<TData extends RowData> {
  table: TableCoreInstance<TData>;
  /**
   * Override default từ `table.options.localization.filter`. Bỏ trống thì lấy từ
   * i18n dict nên caller không bắt buộc truyền.
   */
  labels?: TableFilterToggleLabels;
}

export function TableFilterToggle<TData extends RowData>({
  table,
  labels,
}: TableFilterToggleProps<TData>) {
  const { showColumnFilters } = table.getState();
  const trigger = labels?.trigger ?? table.options.localization.filter.showHideFilters;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={trigger}
          aria-pressed={showColumnFilters}
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.extra.setShowColumnFilters(!showColumnFilters)}
        >
          {showColumnFilters ? (
            <AppIcon icon="filter-x" className="text-muted-foreground" />
          ) : (
            <AppIcon icon="list-filter" className="text-muted-foreground" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{trigger}</TooltipContent>
    </Tooltip>
  );
}
