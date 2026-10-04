"use client";

/**
 * Thanh thao tác hàng loạt, hiện khi có dòng được chọn.
 *
 * Gói sẵn phần lặp lại ở mọi bảng: số dòng đã chọn, nút đóng và Export CSV.
 * Các item riêng của từng màn hình truyền qua `children`.
 */

import type { RowData } from "@tanstack/react-table";
import AppIcon from "@/components/general/app-icon";
import * as React from "react";

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import type { TableCoreInstance } from "@/hooks/table/use-table-core";
import { exportTableToExcel } from "../lib/export";

export interface DataTableActionBarLabels {
  rowsSelected: string;
  export: string;
}

interface DataTableActionBarProps<TData extends RowData> {
  table: TableCoreInstance<TData>;
  /** Item riêng của màn hình, render trước nút Export. */
  children?: React.ReactNode;
  /** Tắt nếu màn hình tự lo việc xuất file. */
  enableExport?: boolean;
  exportFilename?: string;
  exportSheetName?: string;
  onOpenChange?: (open: boolean) => void;
  /**
   * Override defaults từ `table.options.localization.actionBar`. Bỏ trống thì lấy từ đó
   * nên caller không bắt buộc truyền.
   */
  labels?: Partial<DataTableActionBarLabels>;
}

export function DataTableActionBar<TData extends RowData>({
  table,
  children,
  enableExport = true,
  exportFilename,
  exportSheetName,
  onOpenChange,
  labels,
}: DataTableActionBarProps<TData>) {
  const ta = table.options.localization.actionBar;
  const rows = table.getFilteredSelectedRowModel().rows;
  const l = {
    rowsSelected: labels?.rowsSelected ?? ta.rowsSelected,
    export: labels?.export ?? ta.export,
  };

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) table.toggleAllRowsSelected(false);
      onOpenChange?.(open);
    },
    [onOpenChange, table],
  );

  const onExport = React.useCallback(() => {
    // `exceljs` nạp động nên hàm này là async — không `await` được ở đây, và
    // cũng không nên nuốt lỗi im lặng: người dùng bấm xuất mà không có gì xảy
    // ra thì phải thấy được lý do trong console.
    exportTableToExcel(table, {
      filename: exportFilename,
      sheetName: exportSheetName,
      onlySelected: true,
    }).catch((error) => {
      console.error("Xuất Excel thất bại", error);
    });
  }, [exportFilename, exportSheetName, table]);

  return (
    <ActionBar open={rows.length > 0} onOpenChange={handleOpenChange}>
      <ActionBarSelection>
        <span className="font-medium">{rows.length}</span>
        <span>{l.rowsSelected}</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <AppIcon icon="x" />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        {children}
        {enableExport && (
          <ActionBarItem onClick={onExport}>
            <AppIcon icon="download" />
            {l.export}
          </ActionBarItem>
        )}
      </ActionBarGroup>
    </ActionBar>
  );
}
