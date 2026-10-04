"use client";

import type { RowData } from "@tanstack/react-table";

import AppIcon, { type IconName } from "@/components/general/app-icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TableCoreInstance } from "@/hooks/table/use-table-core";
import { getNextDensity } from "@/lib/table/style-utils";
import type { Density } from "@/lib/table/types";

const densityIcons: Record<Density, IconName> = {
  compact: "rows-4",
  comfortable: "rows-3",
  spacious: "rows-2",
};

export interface TableDensityToggleLabels {
  trigger: string;
}

interface TableDensityToggleProps<TData extends RowData> {
  table: TableCoreInstance<TData>;
  /**
   * Override default từ `table.options.localization.density`. Bỏ trống thì lấy từ
   * i18n dict nên caller không bắt buộc truyền.
   */
  labels?: TableDensityToggleLabels;
}

/**
 * A real toggle, unlike the Landsoft/MRT setup where `!important` cell padding
 * made the same affordance a no-op.
 */
export function TableDensityToggle<TData extends RowData>({
  table,
  labels,
}: TableDensityToggleProps<TData>) {
  const { density } = table.getState();
  const trigger = labels?.trigger ?? table.options.localization.density.toggleDensity;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={trigger}
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.extra.setDensity(getNextDensity(density))}
        >
          <AppIcon icon={densityIcons[density]} className="text-muted-foreground" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{trigger}</TooltipContent>
    </Tooltip>
  );
}
