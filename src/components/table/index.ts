// ─── i18n dictionary ─────────────────────────────────────────────────────────
// User-facing strings từ `@/lib/table/localization/{en,vi}.ts` — nằm trong
// chính cụm này, không phải từ điển của app. Ghi đè qua prop `labels` của
// từng component, hoặc `localization` của `useTableCore`.
// Key sections tương ứng với exports trong file này:
//
//   filters        → TableFilters
//   settings       → TableSettings
//   excelActions   → TableExcelActions
//   density        → TableDensityToggle
//   column         → TableColumnVisibilityMenu
//   fullscreen     → TableFullscreenToggle
//   display        → TableEmptyState (noRecordsToDisplay)

export {
  DEFAULT_EXCEL_ACCEPT,
  DEFAULT_EXCEL_MAX_BYTES,
  TableExcelActions,
} from "./excel"
export type { TableExcelActionsLabels, TableExcelActionsProps } from "./excel"
export { TableColumnVisibilityMenu } from "./table-column-visibility-menu"
export { TableDensityToggle } from "./table-density-toggle"
export { TableEmptyState } from "./table-empty-state"
export {
  TableExportButton,
  type TableExportButtonLabels,
} from "./table-export-button"
export { TableFilterToggle } from "./table-filter-toggle"
export {
  TableFilters,
  type TableFiltersLabels,
  useTableFilters,
} from "./table-filters"
export { TableFullscreenToggle } from "./table-fullscreen-toggle"
export { TableGlobalFilterInput } from "./table-global-filter-input"
export { TableProgressBar } from "./table-progress-bar"
export {
  TableProvider,
  useOptionalTableContext,
  useTableContext,
} from "./table-provider"
export { getTableSelectColumn } from "./table-select-column"
export { TableToolbarInternalButtons } from "./table-toolbar-internal-buttons"
