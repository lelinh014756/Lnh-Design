/**
 * Public surface for the generic Excel actions toolbar entry point.
 *
 * Caller truyền labels + handlers; component chỉ validate extension + size rồi
 * delegate toàn bộ business logic (parse, validate, persist) về caller. Đây là
 * lý do `onDownloadTemplate` và `onImportFile` là `(file) => Promise<void>` —
 * component không cần biết schema employee, task, hay product.
 *
 * Labels tự đọc từ `table.options.localization.excelActions` bên trong nếu caller không truyền.
 */

export interface TableExcelActionsLabels {
  trigger: string;
  title: string;
  downloadTemplate: string;
  importFile: string;
  importSuccess: string;
  importFailure: string;
  importInvalidType: string;
  importTooLarge: string;
  importHeaderMissing: string;
  templateDownloadFailure: string;
}

export interface TableExcelActionsProps {
  /** Optional — nếu không truyền, tự đọc từ `table.options.localization.excelActions`. */
  labels?: TableExcelActionsLabels;
  disabled?: boolean;
  loading?: boolean;
  importAccept?: string;
  maxImportBytes?: number;
  onDownloadTemplate?: () => Promise<void> | void;
  onImportFile?: (file: File) => Promise<void> | void;
  onError?: (kind: "template" | "import", error: unknown) => void;
}
