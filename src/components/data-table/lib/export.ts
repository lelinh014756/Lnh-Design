/**
 * Xuất dữ liệu bảng ra file.
 *
 * Hai định dạng dùng CHUNG một bước trích xuất (`resolveExportColumns` +
 * `readCellValue`), nên tiêu đề và giá trị luôn giống nhau giữa hai file — chỉ
 * khác cách ghi ra đĩa.
 *
 * ─── Ba lỗi của bản CSV cũ, và vì sao ────────────────────────────────────────
 *
 * 1. LỖI FONT TIẾNG VIỆT. `new Blob([csv], { type: "text/csv;charset=utf-8" })`
 *    KHÔNG đủ: `charset` trong MIME type chỉ có tác dụng khi file đi qua HTTP.
 *    Mở file `.csv` từ đĩa, Excel (bản Windows) mặc định đọc theo bảng mã ANSI
 *    của hệ thống chứ không phải UTF-8 → "Nguyễn" thành "Nguyá»…n". Cách duy
 *    nhất để Excel tự nhận UTF-8 là chèn BOM `﻿` vào đầu file.
 *
 * 2. TIÊU ĐỀ LÀ ID CỘT. Bản cũ lấy `column.id`, nên file ra `staffStatusId`,
 *    `fullName`… thay vì "Tình trạng NV", "Họ tên".
 *
 * 3. CỘT GHÉP RA RỖNG. Bản cũ gọi `row.getValue(id)`. Cột không khai
 *    `accessorKey`/`accessorFn` (Email, Điện thoại, CCCD, Tài khoản ngân hàng,
 *    Ngày tạo, Cập nhật — 6/19 cột ở màn nhân viên) không có gì để `getValue`
 *    đọc → trả `undefined` → xuất ra ô trống. Xem `meta.exportValue`.
 *
 * Ngoài ra bản cũ dùng `getAllLeafColumns()` (kể cả cột đang ẩn) và quên
 * `URL.revokeObjectURL` — rò object URL sau mỗi lần xuất.
 */

import type { Row, RowData, Table } from "@tanstack/react-table";

import { type DisplayColumnId, getIsDisplayColumn } from "@/lib/table/types";

export interface ExportOptions<TData> {
  filename?: string;
  /** Tên sheet — chỉ dùng cho Excel. */
  sheetName?: string;
  excludeColumns?: (keyof TData | DisplayColumnId)[];
  onlySelected?: boolean;
}

interface ExportColumn<TData extends RowData> {
  id: string;
  header: string;
  read: (row: Row<TData>) => unknown;
}

/** Excel không nhận kiểu tuỳ ý — quy về đúng những kiểu nó hiểu. */
type ExportCellValue = string | number | boolean | Date | null;

const DEFAULT_COLUMN_WIDTH = 10;
const MAX_COLUMN_WIDTH = 50;
const HEADER_FILL_ARGB = "FF0F172A";
const HEADER_TEXT_ARGB = "FFFFFFFF";
const BORDER_ARGB = "FFE2E8F0";
const STRIPE_FILL_ARGB = "FFF8FAFC";
const DATE_FORMAT = "dd/mm/yyyy";

// ─── Trích xuất (dùng chung cho mọi định dạng) ───────────────────────────────

function resolveExportColumns<TData extends RowData>(
  table: Table<TData>,
  excludeColumns: readonly (keyof TData | DisplayColumnId)[],
): ExportColumn<TData>[] {
  const excluded = new Set(excludeColumns as readonly string[]);

  return (
    table
      .getVisibleLeafColumns()
      // Cột đang ẩn / thứ tự cột: lấy theo `getVisibleLeafColumns` để file xuất
      // ra khớp đúng những gì người dùng đang thấy trên màn hình.
      .filter(
        (column) =>
          !excluded.has(column.id) && !getIsDisplayColumn(column.id),
      )
      .map((column) => {
        const { meta, header } = column.columnDef;

        return {
          id: column.id,
          header:
            meta?.label ?? (typeof header === "string" ? header : column.id),
          read:
            meta?.exportValue ??
            ((row: Row<TData>) =>
              // `getValue` chỉ chạy được khi cột có accessor; cột ghép thì đọc
              // thẳng từ dữ liệu gốc theo id, còn không thì đành để trống.
              column.accessorFn
                ? row.getValue(column.id)
                : (row.original as Record<string, unknown>)?.[column.id]),
        };
      })
  );
}

function getExportRows<TData extends RowData>(
  table: Table<TData>,
  onlySelected: boolean,
): Row<TData>[] {
  return onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getRowModel().rows;
}

/**
 * Giữ nguyên `number` / `boolean` / `Date` thay vì `String()` hết — có vậy
 * Excel mới sắp xếp, lọc và tính tổng được trên cột đó.
 */
function toCellValue(value: unknown): ExportCellValue {
  if (value == null || value === "") return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean" || typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter((item) => item != null).join(", ");
  return String(value);
}

// ─── Tải file ────────────────────────────────────────────────────────────────

/**
 * Không dùng `file-saver`: trình duyệt hiện tại đều hỗ trợ thuộc tính
 * `download` của thẻ `<a>`, thêm một dependency chỉ để gói lại 8 dòng này là
 * không đáng. Điểm bản cũ làm thiếu là `revokeObjectURL` — không gọi thì blob
 * nằm lại trong bộ nhớ tới khi đóng tab.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Excel ───────────────────────────────────────────────────────────────────

function autoFitWidth(values: (ExportCellValue | undefined)[]): number {
  let longest = 0;
  for (const value of values) {
    const length =
      value instanceof Date
        ? DATE_FORMAT.length
        : String(value ?? "").length;
    if (length > longest) longest = length;
  }
  return Math.max(DEFAULT_COLUMN_WIDTH, Math.min(longest + 2, MAX_COLUMN_WIDTH));
}

/**
 * Xuất `.xlsx` có định dạng: header nền đậm chữ trắng, khoá dòng tiêu đề, bật
 * bộ lọc, kẻ viền, tô sọc xen kẽ và tự canh độ rộng cột.
 *
 * `exceljs` được `import()` động — nó nặng ~280KB (gzip), mà xuất file là thao
 * tác hiếm; để import tĩnh thì mọi người vào trang đều phải tải kèm dù không
 * bấm nút xuất lần nào.
 */
export async function exportTableToExcel<TData extends RowData>(
  table: Table<TData>,
  options: ExportOptions<TData> = {},
): Promise<void> {
  const {
    filename = "table",
    sheetName = "Data",
    excludeColumns = [],
    onlySelected = false,
  } = options;

  const columns = resolveExportColumns(table, excludeColumns);
  const rows = getExportRows(table, onlySelected);
  if (columns.length === 0) return;

  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.id,
  }));

  const cellValues: ExportCellValue[][] = rows.map((row) =>
    columns.map((column) => toCellValue(column.read(row))),
  );

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: HEADER_TEXT_ARGB } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: HEADER_FILL_ARGB },
    };
  });

  for (const [index, values] of cellValues.entries()) {
    const row = sheet.addRow(values);
    const isStripe = index % 2 === 1;

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: BORDER_ARGB } },
        left: { style: "thin", color: { argb: BORDER_ARGB } },
        bottom: { style: "thin", color: { argb: BORDER_ARGB } },
        right: { style: "thin", color: { argb: BORDER_ARGB } },
      };
      cell.alignment = { vertical: "middle" };
      if (isStripe) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: STRIPE_FILL_ARGB },
        };
      }
      if (cell.value instanceof Date) cell.numFmt = DATE_FORMAT;
    });
  }

  columns.forEach((column, index) => {
    const sheetColumn = sheet.getColumn(index + 1);
    sheetColumn.width = autoFitWidth([
      column.header,
      ...cellValues.map((values) => values[index]),
    ]);
  });

  // Khoá dòng tiêu đề khi cuộn + bật bộ lọc trên chính dòng đó.
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: rows.length + 1, column: columns.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`,
  );
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

function escapeCsv(value: ExportCellValue): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();
  const text = String(value);
  // Bọc nháy kép khi có dấu phẩy, nháy kép hoặc xuống dòng — thiếu bước này
  // thì một ô ghi chú có dấu phẩy sẽ tự tách thành nhiều cột.
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Giữ lại cho nơi cần dữ liệu thô để nạp vào hệ thống khác. */
export function exportTableToCSV<TData extends RowData>(
  table: Table<TData>,
  options: ExportOptions<TData> = {},
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = options;

  const columns = resolveExportColumns(table, excludeColumns);
  const rows = getExportRows(table, onlySelected);

  const content = [
    columns.map((column) => escapeCsv(column.header)).join(","),
    ...rows.map((row) =>
      columns.map((column) => escapeCsv(toCellValue(column.read(row)))).join(","),
    ),
  ].join("\r\n");

  downloadBlob(
    // `﻿` = BOM. Xem lỗi số 1 ở đầu file.
    new Blob([`﻿${content}`], { type: "text/csv;charset=utf-8;" }),
    filename.endsWith(".csv") ? filename : `${filename}.csv`,
  );
}
