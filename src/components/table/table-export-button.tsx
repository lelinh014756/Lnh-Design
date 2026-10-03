"use client";

/**
 * Nút xuất Excel đứng riêng trên toolbar.
 *
 * `<DataTableActionBar enableExport>` cũng xuất Excel, nhưng thanh đó chỉ nổi
 * lên khi có dòng được chọn — bảng nào tắt `enableRowSelection` thì không bao
 * giờ với tới được nút xuất. Component này lấp đúng chỗ đó: cùng gọi
 * `exportTableToExcel`, chỉ khác `onlySelected: false` nên xuất trọn những gì
 * bảng đang hiển thị (đúng cột đang hiện, đúng thứ tự cột — xem
 * `resolveExportColumns`).
 *
 * Dựng theo đúng khuôn `TableFullscreenToggle` (Tooltip + Button icon outline)
 * để cụm nút trên toolbar không lệch nhau.
 */

import type { RowData } from "@tanstack/react-table";
import { Download, Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { exportTableToExcel } from "@/components/data-table/lib/export";
import type { TableCoreInstance } from "@/hooks/table/use-table-core";

export interface TableExportButtonLabels {
  trigger: string;
  failure: string;
}

interface TableExportButtonProps<TData extends RowData> {
  table: TableCoreInstance<TData>;
  /** Không kèm `.xlsx` — `exportTableToExcel` tự thêm. */
  filename?: string;
  sheetName?: string;
  disabled?: boolean;
  /**
   * Override default từ `table.options.localization.actionBar`. Bỏ trống thì mặc định
   * lấy từ i18n dict nên caller không bắt buộc truyền.
   */
  labels?: Partial<TableExportButtonLabels>;
}

export function TableExportButton<TData extends RowData>({
  table,
  filename,
  sheetName,
  disabled,
  labels,
}: TableExportButtonProps<TData>) {
  const ta = table.options.localization.actionBar;
  const l = {
    trigger: labels?.trigger ?? ta.export,
    failure: labels?.failure ?? ta.exportFailed,
  };

  const [isExporting, setIsExporting] = React.useState(false);

  // `exceljs` nạp động nên lần bấm đầu tốn thêm một nhịp tải chunk — không có
  // cờ này thì nút im lìm vài trăm ms, người dùng bấm tiếp lần hai.
  const onExport = React.useCallback(async () => {
    setIsExporting(true);
    try {
      await exportTableToExcel(table, { filename, sheetName });
    } catch (error) {
      console.error(l.failure, error);
      toast.error(l.failure);
    } finally {
      setIsExporting(false);
    }
  }, [table, filename, sheetName, l.failure]);

  const isDisabled =
    disabled || isExporting || table.getRowModel().rows.length === 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={l.trigger}
          variant="outline"
          size="icon"
          disabled={isDisabled}
          onClick={() => void onExport()}
        >
          {isExporting ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            <Download className="text-muted-foreground" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{l.trigger}</TooltipContent>
    </Tooltip>
  );
}
