import type { RowData } from "@tanstack/react-table";
import AppIcon from "@/components/general/app-icon";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TableCoreInstance } from "@/hooks/table/use-table-core";
import { cn } from "@/lib/utils";

/** Interpolate `{placeholder}` tokens in a localization template. */
function formatLocalized(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export interface DataTablePaginationLabels {
  rowsPerPage: string;
  totalItems: string;
  pageOf: string;
  goToFirstPage: string;
  goToLastPage: string;
  goToNextPage: string;
  goToPreviousPage: string;
}

interface DataTablePaginationProps<TData extends RowData>
  extends React.ComponentProps<"div"> {
  table: TableCoreInstance<TData>;
  pageSizeOptions?: number[];
  /**
   * Override defaults từ `table.options.localization.pagination`. Bỏ trống thì lấy từ đó
   * nên caller không bắt buộc truyền.
   */
  labels?: Partial<DataTablePaginationLabels>;
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions,
  labels,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const tp = table.options.localization.pagination;
  const l = {
    rowsPerPage: labels?.rowsPerPage ?? tp.rowsPerPage,
    totalItems: labels?.totalItems ?? tp.totalItems,
    pageOf: labels?.pageOf ?? tp.pageOf,
    goToFirstPage: labels?.goToFirstPage ?? tp.goToFirstPage,
    goToLastPage: labels?.goToLastPage ?? tp.goToLastPage,
    goToNextPage: labels?.goToNextPage ?? tp.goToNextPage,
    goToPreviousPage: labels?.goToPreviousPage ?? tp.goToPreviousPage,
  };
  const pageSizes = pageSizeOptions ?? table.options.pageSizeOptions;

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        className,
      )}
      {...props}
    >
      {/* `getRowCount()` trả về option `rowCount` nên ra tổng thật của server,
          không phải số dòng của trang hiện tại. Số dòng đã chọn do action bar lo. */}
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        {formatLocalized(l.totalItems, {
          count: table.getRowCount(),
        })}
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap font-medium text-sm">{l.rowsPerPage}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-18 data-size:h-8">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {pageSizes.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center font-medium text-sm">
          {formatLocalized(l.pageOf, {
            page: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label={l.goToFirstPage}
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <AppIcon icon="chevrons-left" />
          </Button>
          <Button
            aria-label={l.goToPreviousPage}
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <AppIcon icon="chevron-left" />
          </Button>
          <Button
            aria-label={l.goToNextPage}
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <AppIcon icon="chevron-right" />
          </Button>
          <Button
            aria-label={l.goToLastPage}
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <AppIcon icon="chevrons-right" />
          </Button>
        </div>
      </div>
    </div>
  );
}
