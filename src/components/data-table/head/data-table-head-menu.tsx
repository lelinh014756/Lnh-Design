"use client";

/**
 * Dropdown trên ô header: sắp xếp, ghim trái/phải, ẩn cột.
 *
 * Port từ `data-grid-column-header.tsx` nhưng bỏ phần icon kiểu dữ liệu và
 * `meta.onColumnClick` — hai thứ đó chỉ data-grid dùng.
 */

import type {
  ColumnSort,
  Header,
  RowData,
  SortDirection,
  SortingState,
  Table,
} from "@tanstack/react-table";
import AppIcon from "@/components/general/app-icon";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDensityHeadMenuInsetClass } from "@/lib/table/style-utils";
import { cn } from "@/lib/utils";
import type { Density } from "@/lib/table/types";

export interface DataTableHeadMenuLabels {
  sortByColumnAsc: string;
  sortByColumnDesc: string;
  clearSort: string;
  pinToLeft: string;
  pinToRight: string;
  unpin: string;
  hideColumn: string;
}

interface DataTableHeadMenuProps<TData extends RowData> {
  header: Header<TData, unknown>;
  table: Table<TData>;
  label: string;
  labels: DataTableHeadMenuLabels;
  density: Density;
}

export function DataTableHeadMenu<TData extends RowData>({
  header,
  table,
  label,
  labels,
  density,
}: DataTableHeadMenuProps<TData>) {
  const column = header.column;
  const isResizing = table.getState().columnSizingInfo.isResizingColumn;

  const pinned = column.getIsPinned();
  const isPinnedLeft = pinned === "left";
  const isPinnedRight = pinned === "right";

  const onSortingChange = React.useCallback(
    (direction: SortDirection) => {
      table.setSorting((prev: SortingState) => {
        const index = prev.findIndex((sort) => sort.id === column.id);
        const next: ColumnSort = { id: column.id, desc: direction === "desc" };

        if (index < 0) return [...prev, next];

        const updated = [...prev];
        updated[index] = next;
        return updated;
      });
    },
    [column.id, table],
  );

  const onSortRemove = React.useCallback(() => {
    table.setSorting((prev: SortingState) =>
      prev.filter((sort) => sort.id !== column.id),
    );
  }, [column.id, table]);

  const canSort = column.getCanSort();
  const canPin = column.getCanPin();
  const canHide = column.getCanHide();

  if (!canSort && !canPin && !canHide) {
    return (
      <span data-slot="table-head-label" className="truncate">
        {label}
      </span>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        // `data-slot` ở đây và ở label bên dưới là mốc để `useColumnResize` đo
        // bề rộng tối thiểu của header lúc bắt đầu kéo — đừng đổi tên rời rạc.
        data-slot="table-head-menu-trigger"
        className={cn(
          // `absolute inset-0` phủ trọn <th> (vốn đã `position: relative` hoặc
          // `sticky` từ getColumnPinningStyle, đủ làm containing block) — xem
          // vì sao KHÔNG dùng flex+width:auto/100% ở chú thích
          // `getDensityHeadMenuInsetClass`.
          "absolute inset-0 flex items-center justify-between gap-1.5 text-left hover:bg-accent/40 focus:outline-none data-[state=open]:bg-accent/40 [&_svg]:size-3.5",
          getDensityHeadMenuInsetClass(density),
          // Đang kéo resize thì chặn click, tránh mở menu ngoài ý muốn.
          isResizing && "pointer-events-none",
        )}
      >
        <span data-slot="table-head-label" className="truncate">
          {label}
        </span>
        <AppIcon icon="chevron-down" className="shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={0} className="w-52">
        {canSort && (
          <>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === "asc"}
              onSelect={() => onSortingChange("asc")}
            >
              <AppIcon icon="chevron-up" />
              {labels.sortByColumnAsc}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === "desc"}
              onSelect={() => onSortingChange("desc")}
            >
              <AppIcon icon="chevron-down" />
              {labels.sortByColumnDesc}
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground"
                onSelect={onSortRemove}
              >
                <AppIcon icon="x" />
                {labels.clearSort}
              </DropdownMenuItem>
            )}
          </>
        )}

        {canPin && (
          <>
            {canSort && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className="[&_svg]:text-muted-foreground"
              onSelect={() => column.pin(isPinnedLeft ? false : "left")}
            >
              {isPinnedLeft ? <AppIcon icon="pin-off" /> : <AppIcon icon="pin" />}
              {isPinnedLeft ? labels.unpin : labels.pinToLeft}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="[&_svg]:text-muted-foreground"
              onSelect={() => column.pin(isPinnedRight ? false : "right")}
            >
              {isPinnedRight ? <AppIcon icon="pin-off" /> : <AppIcon icon="pin" />}
              {isPinnedRight ? labels.unpin : labels.pinToRight}
            </DropdownMenuItem>
          </>
        )}

        {canHide && (
          <>
            {(canSort || canPin) && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className="[&_svg]:text-muted-foreground"
              onSelect={() => column.toggleVisibility(false)}
            >
              <AppIcon icon="eye-off" />
              {labels.hideColumn}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
