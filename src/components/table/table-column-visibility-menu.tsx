"use client";

import type { Table } from "@tanstack/react-table";
import AppIcon from "@/components/general/app-icon";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface TableColumnVisibilityMenuLabels {
  /** aria-label for the trigger button. */
  trigger: string;
  /** Visible label on the trigger button (e.g. "View"). */
  buttonLabel: string;
  /** Placeholder for the search input inside the popover. */
  searchPlaceholder: string;
  /** Empty state when no columns match the query. */
  noColumnsFound: string;
}

interface TableColumnVisibilityMenuProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  disabled?: boolean;
  labels?: Partial<TableColumnVisibilityMenuLabels>;
}

/**
 * Defaults mirror the previous hardcoded English strings so legacy callers
 * keep rendering the same UI; new callers pass labels from `table.options.localization.column`.
 */
const FALLBACK_LABELS: TableColumnVisibilityMenuLabels = {
  trigger: "Toggle columns",
  buttonLabel: "View",
  searchPlaceholder: "Search columns…",
  noColumnsFound: "No columns found.",
};

export function TableColumnVisibilityMenu<TData>({
  table,
  disabled,
  labels: labelOverrides,
  className,
  ...props
}: TableColumnVisibilityMenuProps<TData>) {
  const labels = React.useMemo(
    () => ({ ...FALLBACK_LABELS, ...labelOverrides }),
    [labelOverrides],
  );

  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide(),
        ),
    [table],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label={labels.trigger}
          role="combobox"
          variant="outline"
          className="ml-auto hidden h-8 font-normal lg:flex"
          disabled={disabled}
        >
          <AppIcon icon="settings-2" className="text-muted-foreground" />
          {labels.buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-44 p-0", className)} {...props}>
        <Command>
          <CommandInput placeholder={labels.searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{labels.noColumnsFound}</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  key={column.id}
                  data-checked={column.getIsVisible()}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <span className="truncate">
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
