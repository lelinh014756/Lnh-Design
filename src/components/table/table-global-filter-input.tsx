"use client";

import type { RowData } from "@tanstack/react-table";
import AppIcon from "@/components/general/app-icon";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TableCoreInstance } from "@/hooks/table/use-table-core";
import { cn } from "@/lib/utils";

export interface TableGlobalFilterInputLabels {
  /** Placeholder shown inside the input when empty. */
  placeholder: string;
  /** aria-label for the input + clear button. */
  search: string;
  clearSearch: string;
}

interface TableGlobalFilterInputProps<TData extends RowData>
  extends Omit<React.ComponentProps<"div">, "children"> {
  table: TableCoreInstance<TData>;
  /**
   * Override defaults từ `table.options.localization.search`. Bỏ trống thì lấy từ đó nên
   * caller không bắt buộc truyền.
   */
  labels?: TableGlobalFilterInputLabels;
}

export function TableGlobalFilterInput<TData extends RowData>({
  table,
  labels,
  className,
  ...props
}: TableGlobalFilterInputProps<TData>) {
  const searchDict = table.options.localization.search;
  const value = (table.getState().globalFilter as string) ?? "";
  const placeholder = labels?.placeholder ?? searchDict.search;
  const searchLabel = labels?.search ?? searchDict.search;
  const clearLabel = labels?.clearSearch ?? searchDict.clearSearch;

  return (
    <div className={cn("relative", className)} {...props}>
      <AppIcon icon="search" className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label={searchLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="h-8 w-40 pl-8 lg:w-56"
      />
      {value && (
        <Button
          aria-label={clearLabel}
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-6 -translate-y-1/2"
          onClick={() => table.setGlobalFilter("")}
        >
          <AppIcon icon="x" className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
