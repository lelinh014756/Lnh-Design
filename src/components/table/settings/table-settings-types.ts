/**
 * Shape of the user-facing table settings sheet.
 *
 * A feature module declares its own settings type extending
 * `BaseTableSettings`, plus builders that translate it into TanStack state
 * (`columnOrder`, `columnVisibility`, `columnSizing`, `columnPinning`) — the
 * same split the reference MRT module uses.
 *
 * `TableSettingsLabels` chỉ còn là type — caller Phase 5 sẽ truyền labels từ
 * `table.options.localization.settings`. Defaults cứng VI đã bỏ để caller nào cũng phải khai
 * báo rõ ràng; component trong folder này nhận `labels: TableSettingsLabels`
 * (required) thay vì merge với default.
 */

export interface BaseTableSettings {
  showMultiRowSelection: boolean;
  showSummaryFooter: boolean;
  enableInfiniteScroll: boolean;
  pinLeftColumns: string[];
  pinRightColumns: string[];
  hiddenColumnIds: string[];
  columnOrder: string[];
  columnSizing: Record<string, number>;
}

export interface TableColumnLayoutOption {
  id: string;
  label: string;
  defaultSize: number;
  minSize: number;
  maxSize: number;
}

export interface TableSettingsLabels {
  title: string;
  trigger: string;
  behavior: string;
  multiRowSelection: string;
  summaryFooter: string;
  infiniteScroll: string;
  columnLayout: string;
  colOrder: string;
  colName: string;
  columnWidth: string;
  columnVisibility: string;
  pinLeft: string;
  pinRight: string;
  locked: string;
  dragColumn: string;
  resetColumnLayout: string;
  apply: string;
  clear: string;
}
