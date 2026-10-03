"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getTableSelectColumn } from "@/components/table";
import { useTableCore } from "@/hooks/table";
import { tableLocalizationVi } from "@/lib/table/localization";

import type { PreviewMap } from "./types";

interface RegistryItemRow {
  slug: string;
  name: string;
  category: string;
  installs: number;
  visibility: "public" | "internal";
  updatedAt: string;
}

const ROWS: RegistryItemRow[] = [
  { slug: "button", name: "Button", category: "General", installs: 412, visibility: "public", updatedAt: "2026-08-21" },
  { slug: "data-table", name: "Data Table", category: "Data Display", installs: 198, visibility: "public", updatedAt: "2026-08-24" },
  { slug: "app-sheet", name: "AppSheet", category: "Feedback", installs: 143, visibility: "public", updatedAt: "2026-08-19" },
  { slug: "sortable", name: "Sortable", category: "Data Entry", installs: 96, visibility: "public", updatedAt: "2026-08-11" },
  { slug: "dev-portal", name: "Dev Portal", category: "Layout", installs: 12, visibility: "internal", updatedAt: "2026-08-24" },
  { slug: "statistics-card", name: "StatisticsCard", category: "Layout", installs: 87, visibility: "public", updatedAt: "2026-08-08" },
  { slug: "faceted", name: "Faceted", category: "Data Entry", installs: 64, visibility: "public", updatedAt: "2026-07-30" },
  { slug: "action-bar", name: "ActionBar", category: "Feedback", installs: 58, visibility: "public", updatedAt: "2026-07-28" },
];

/**
 * Demo `data-table`.
 *
 * Dùng `useTableCore` chứ không `useDataTable`: bản URL-state là một registry
 * item riêng (`data-table-url`), và ghi querystring từ trong iframe làm lịch sử
 * duyệt của khung xem lệch với trang mẹ.
 */
function DataTableDemo() {
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<RegistryItemRow>[]>(
    () => [
      getTableSelectColumn<RegistryItemRow>(),
      {
        accessorKey: "name",
        header: "Item",
        size: 190,
        cell: ({ row }) => (
          <span className="flex flex-col gap-0.5">
            <span className="font-medium">{row.original.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              @aurecook/{row.original.slug}
            </span>
          </span>
        ),
      },
      { accessorKey: "category", header: "Nhóm", size: 130 },
      {
        accessorKey: "installs",
        header: "Lượt cài",
        size: 100,
        meta: { align: "end" },
        cell: ({ getValue }) => (
          <span className="tabular-nums">{(getValue() as number).toLocaleString("vi-VN")}</span>
        ),
      },
      {
        accessorKey: "visibility",
        header: "Phạm vi",
        size: 120,
        cell: ({ getValue }) =>
          getValue() === "internal" ? (
            <Badge variant="secondary">Nội bộ</Badge>
          ) : (
            <Badge variant="outline">Công khai</Badge>
          ),
      },
      { accessorKey: "updatedAt", header: "Cập nhật", size: 120 },
    ],
    [],
  );

  const table = useTableCore<RegistryItemRow>({
    // Tầng 2 của hợp đồng i18n: một object cho cả cụm. Bản `vi` đi kèm chính
    // item registry, không phải từ điển của app — bỏ dòng này thì bảng chạy
    // bằng tiếng Anh mặc định chứ không vỡ.
    localization: tableLocalizationVi,
    data: ROWS,
    columns,
    getRowId: (row) => row.slug,
    enableRowSelection: true,
    enableRowNumbers: true,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enablePagination: true,
    pageSizeOptions: [5, 10, 20],
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  });

  return <DataTable table={table} />;
}

export const dataTablePreviews: PreviewMap = {
  "data-table": DataTableDemo,
};
